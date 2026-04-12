<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\Visiteur;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use RuntimeException;
use Throwable;

class VisiteurService
{
    public function paginate(int $perPage = 15): LengthAwarePaginator
    {
        return Visiteur::query()->latest()->paginate($perPage);
    }

    public function findOrFail(int $id): Visiteur
    {
        return Visiteur::query()->findOrFail($id);
    }

    public function create(array $data): Visiteur
    {
        try {
            return DB::transaction(fn (): Visiteur => Visiteur::query()->create($data));
        } catch (Throwable $exception) {
            throw new RuntimeException('Erreur lors de la création du visiteur.', 0, $exception);
        }
    }

    public function update(Visiteur $visiteur, array $data): Visiteur
    {
        try {
            return DB::transaction(function () use ($visiteur, $data): Visiteur {
                $visiteur->fill($data);
                $visiteur->save();

                return $visiteur->refresh();
            });
        } catch (Throwable $exception) {
            throw new RuntimeException('Erreur lors de la mise à jour du visiteur.', 0, $exception);
        }
    }

    public function delete(Visiteur $visiteur): void
    {
        try {
            DB::transaction(fn (): bool => $visiteur->delete());
        } catch (Throwable $exception) {
            throw new RuntimeException('Erreur lors de la suppression du visiteur.', 0, $exception);
        }
    }
}
