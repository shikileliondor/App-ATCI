<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\Programme;
use App\Models\ProgrammePresence;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use RuntimeException;
use Throwable;

class ProgrammeService
{
    private const PRESENCE_FIELDS = [
        'hommes_adultes',
        'femmes_adultes',
        'jeunes_hommes',
        'jeunes_filles',
        'enfants',
        'visiteurs',
    ];

    public function paginate(int $perPage = 15): LengthAwarePaginator
    {
        return Programme::query()->orderBy('date_debut')->paginate($perPage);
    }

    public function findOrFail(int $id): Programme
    {
        return Programme::query()->findOrFail($id);
    }

    public function getProgrammeDashboard(int $id): array
    {
        $programme = Programme::query()->with('presences')->findOrFail($id);
        $presences = $programme->presences->sortBy('date')->values();

        return [
            'programme' => $programme,
            'presences' => $presences,
            'stats' => $this->buildStats($presences),
        ];
    }

    public function createPresence(Programme $programme, array $data): ProgrammePresence
    {
        try {
            return DB::transaction(function () use ($programme, $data): ProgrammePresence {
                $presencePayload = $this->normalizePresencePayload($data);

                return $programme->presences()->updateOrCreate(
                    ['date' => $data['date']],
                    $presencePayload
                );
            });
        } catch (Throwable $exception) {
            throw new RuntimeException('Erreur lors de la création de la présence.', 0, $exception);
        }
    }

    public function updatePresence(Programme $programme, ProgrammePresence $presence, array $data): ProgrammePresence
    {
        if ($presence->programme_id !== $programme->id) {
            throw new RuntimeException('Présence non associée à ce programme.');
        }

        try {
            return DB::transaction(function () use ($presence, $data): ProgrammePresence {
                $payload = $this->normalizePresencePayload($data, $presence);
                $presence->fill($payload);
                $presence->save();

                return $presence->refresh();
            });
        } catch (Throwable $exception) {
            throw new RuntimeException('Erreur lors de la mise à jour de la présence.', 0, $exception);
        }
    }

    public function deletePresence(Programme $programme, ProgrammePresence $presence): void
    {
        if ($presence->programme_id !== $programme->id) {
            throw new RuntimeException('Présence non associée à ce programme.');
        }

        try {
            DB::transaction(fn (): bool => $presence->delete());
        } catch (Throwable $exception) {
            throw new RuntimeException('Erreur lors de la suppression de la présence.', 0, $exception);
        }
    }

    public function create(array $data): Programme
    {
        try {
            return DB::transaction(function () use ($data): Programme {
                $presences = $data['presences'] ?? [];
                unset($data['presences']);

                $programme = Programme::query()->create($this->applyBusinessRules($data));
                $this->syncPresences($programme, $presences);

                return $programme->refresh();
            });
        } catch (Throwable $exception) {
            throw new RuntimeException('Erreur lors de la création du programme.', 0, $exception);
        }
    }

    public function update(Programme $programme, array $data): Programme
    {
        try {
            return DB::transaction(function () use ($programme, $data): Programme {
                $presences = $data['presences'] ?? null;
                unset($data['presences']);

                $programme->fill($this->applyBusinessRules($data, $programme));
                $programme->save();

                if (is_array($presences)) {
                    $this->syncPresences($programme, $presences);
                }

                return $programme->refresh();
            });
        } catch (Throwable $exception) {
            throw new RuntimeException('Erreur lors de la mise à jour du programme.', 0, $exception);
        }
    }

    public function delete(Programme $programme): void
    {
        try {
            DB::transaction(fn (): bool => $programme->delete());
        } catch (Throwable $exception) {
            throw new RuntimeException('Erreur lors de la suppression du programme.', 0, $exception);
        }
    }

    private function applyBusinessRules(array $data, ?Programme $existingProgramme = null): array
    {
        if (! array_key_exists('statut', $data) || ! in_array($data['statut'], ['actif', 'termine'], true)) {
            $data['statut'] = $existingProgramme?->statut ?? 'actif';
        }

        return $data;
    }

    private function syncPresences(Programme $programme, array $presences): void
    {
        $programme->presences()->delete();

        if ($presences === []) {
            return;
        }

        foreach ($presences as $presence) {
            $payload = $this->normalizePresencePayload($presence);
            $payload['date'] = $presence['date'];
            $programme->presences()->create($payload);
        }
    }

    private function normalizePresencePayload(array $data, ?ProgrammePresence $existingPresence = null): array
    {
        $payload = [];

        foreach (self::PRESENCE_FIELDS as $field) {
            $payload[$field] = (int) ($data[$field] ?? $existingPresence?->{$field} ?? 0);
        }

        $payload['nombre_participants'] = array_sum($payload);

        if (array_key_exists('date', $data)) {
            $payload['date'] = $data['date'];
        }

        return $payload;
    }

    private function buildStats(Collection $presences): array
    {
        if ($presences->isEmpty()) {
            return [
                'total' => 0,
                'moyenne' => 0,
                'max' => 0,
                'min' => 0,
                'jours' => 0,
            ];
        }

        $participants = $presences->pluck('nombre_participants')->map(fn ($value): int => (int) $value);
        $total = $participants->sum();
        $jours = $participants->count();

        return [
            'total' => $total,
            'moyenne' => round($total / $jours, 2),
            'max' => $participants->max(),
            'min' => $participants->min(),
            'jours' => $jours,
        ];
    }
}
