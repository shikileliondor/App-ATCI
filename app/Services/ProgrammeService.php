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
                return $programme->presences()->updateOrCreate(
                    ['date' => $data['date']],
                    ['nombre_participants' => $data['nombre_participants']]
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
                $presence->fill($data);
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
                return Programme::query()->create($this->applyBusinessRules($data));
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

    private function applyBusinessRules(array $data, ?Programme $existingProgramme = null): array
    {
        if (! array_key_exists('statut', $data) || ! in_array($data['statut'], ['actif', 'termine'], true)) {
            $data['statut'] = $existingProgramme?->statut ?? 'actif';
        }

        return $data;
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
