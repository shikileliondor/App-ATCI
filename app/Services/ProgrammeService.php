<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\Programme;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
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
}
