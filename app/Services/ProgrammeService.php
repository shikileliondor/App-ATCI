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

    public function getProgrammeDashboard(int $id): array
    {
        $programme = Programme::query()->with(['participants', 'presences'])->findOrFail($id);

        return [
            'programme' => $programme,
            'participants' => $programme->participants,
            'stats' => $this->buildParticipantStats($programme),
        ];
    }

    public function create(array $data): Programme
    {
        try {
            return DB::transaction(function () use ($data): Programme {
                $programme = Programme::query()->create($this->applyBusinessRules($data));
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
                $programme->fill($this->applyBusinessRules($data, $programme));
                $programme->save();

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

    private function applyBusinessRules(array $data, ?Programme $existingProgramme = null): array
    {
        if (! array_key_exists('statut', $data) || ! in_array($data['statut'], ['actif', 'termine'], true)) {
            $data['statut'] = $existingProgramme?->statut ?? 'actif';
        }

        $isParticipantsEnabled = (bool) ($data['participants_enabled'] ?? $existingProgramme?->participants_enabled ?? false);
        $data['participants_enabled'] = $isParticipantsEnabled;

        if (! $isParticipantsEnabled) {
            $data['participants_mode'] = null;
            $data['expected_participants'] = null;
            $data['actual_participants'] = null;
        }

        return $data;
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

    private function buildParticipantStats(Programme $programme): array
    {
        if (! $programme->participants_enabled) {
            return ['has_data' => false];
        }

        $participants = $programme->participants;
        $expected = (int) ($programme->expected_participants ?? 0);
        $actualFromSimple = (int) ($programme->actual_participants ?? 0);
        $actualFromAdvanced = $participants->count();

        $actual = $programme->participants_mode === 'avance' ? max($actualFromAdvanced, $actualFromSimple) : $actualFromSimple;
        $hasData = $expected > 0 || $actual > 0 || $participants->isNotEmpty();

        if (! $hasData) {
            return ['has_data' => false];
        }

        return [
            'has_data' => true,
            'total' => $actual,
            'expected' => $expected,
            'attendance_rate' => $expected > 0 ? round(($actual / $expected) * 100, 2) : null,
            'gender_distribution' => [
                'hommes' => $participants->where('sexe', 'homme')->count(),
                'femmes' => $participants->where('sexe', 'femme')->count(),
            ],
            'departments' => $participants
                ->filter(fn ($participant): bool => filled($participant->departement))
                ->groupBy('departement')
                ->map(fn (Collection $group): int => $group->count())
                ->sortDesc()
                ->all(),
        ];
    }
}
