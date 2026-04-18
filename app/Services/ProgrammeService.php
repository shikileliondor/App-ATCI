<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\Programme;
use App\Models\ProgrammeParticipant;
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
        return Programme::query()->orderByDesc('date_debut')->paginate($perPage);
    }

    public function getProgrammeDashboard(int $id): array
    {
        $programme = Programme::query()->with('participants')->findOrFail($id);
        $participants = $programme->participants;

        return [
            'programme' => $programme,
            'participants' => $participants,
            'stats' => $this->buildParticipantStats($programme, $participants),
        ];
    }

    public function create(array $data): Programme
    {
        try {
            return DB::transaction(function () use ($data): Programme {
                return Programme::query()->create($this->applyBusinessRules($data));
            });
        } catch (Throwable $exception) {
            throw new RuntimeException('Erreur lors de la création de l’événement.', 0, $exception);
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
            throw new RuntimeException('Erreur lors de la mise à jour de l’événement.', 0, $exception);
        }
    }

    public function delete(Programme $programme): void
    {
        try {
            DB::transaction(fn (): bool => $programme->delete());
        } catch (Throwable $exception) {
            throw new RuntimeException('Erreur lors de la suppression de l’événement.', 0, $exception);
        }
    }

    public function updateParticipantSettings(Programme $programme, array $data): Programme
    {
        try {
            return DB::transaction(function () use ($programme, $data): Programme {
                $enabled = (bool) ($data['participants_enabled'] ?? $programme->participants_enabled);

                $programme->participants_enabled = $enabled;
                $programme->participants_mode = $enabled ? ($data['participants_mode'] ?? $programme->participants_mode ?? 'simple') : null;
                $programme->participants_expected = $enabled ? ($data['participants_expected'] ?? null) : null;
                $programme->participants_actual = $enabled ? ($data['participants_actual'] ?? null) : null;
                $programme->save();

                if (! $enabled) {
                    $programme->participants()->delete();
                }

                return $programme->refresh();
            });
        } catch (Throwable $exception) {
            throw new RuntimeException('Erreur lors de la mise à jour des paramètres participants.', 0, $exception);
        }
    }

    public function addParticipant(Programme $programme, array $data): ProgrammeParticipant
    {
        if (! $programme->participants_enabled || $programme->participants_mode !== 'advanced') {
            throw new RuntimeException('Le mode avancé des participants doit être activé.');
        }

        return $programme->participants()->create([
            'nom' => $data['nom'],
            'sexe' => $data['sexe'] ?? null,
            'departement' => $data['departement'] ?? null,
        ]);
    }

    public function deleteParticipant(Programme $programme, ProgrammeParticipant $participant): void
    {
        if ($participant->programme_id !== $programme->id) {
            throw new RuntimeException('Participant non associé à cet événement.');
        }

        $participant->delete();
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

        if (! array_key_exists('participants_enabled', $data)) {
            $data['participants_enabled'] = $existingProgramme?->participants_enabled ?? false;
        }

        if (! ($data['participants_enabled'] ?? false)) {
            $data['participants_mode'] = null;
            $data['participants_expected'] = null;
            $data['participants_actual'] = null;
        } else {
            $data['participants_mode'] = $data['participants_mode'] ?? $existingProgramme?->participants_mode ?? 'simple';
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

    private function buildParticipantStats(Programme $programme, Collection $participants): array
    {
        if (! $programme->participants_enabled) {
            return [
                'has_data' => false,
                'total' => 0,
                'attendance_rate' => null,
                'gender_distribution' => [],
                'department_distribution' => [],
            ];
        }

        $actual = $programme->participants_mode === 'advanced'
            ? $participants->count()
            : (int) ($programme->participants_actual ?? 0);

        $expected = (int) ($programme->participants_expected ?? 0);
        $hasData = $actual > 0 || $expected > 0 || $participants->isNotEmpty();

        if (! $hasData) {
            return [
                'has_data' => false,
                'total' => 0,
                'attendance_rate' => null,
                'gender_distribution' => [],
                'department_distribution' => [],
            ];
        }

        $genderDistribution = $participants
            ->filter(fn (ProgrammeParticipant $participant): bool => filled($participant->sexe))
            ->groupBy('sexe')
            ->map(fn (Collection $group): int => $group->count())
            ->toArray();

        $departmentDistribution = $participants
            ->filter(fn (ProgrammeParticipant $participant): bool => filled($participant->departement))
            ->groupBy('departement')
            ->map(fn (Collection $group): int => $group->count())
            ->toArray();

        return [
            'has_data' => true,
            'total' => $actual,
            'attendance_rate' => $expected > 0 ? round(($actual / $expected) * 100, 1) : null,
            'gender_distribution' => $genderDistribution,
            'department_distribution' => $departmentDistribution,
        ];
    }
}
