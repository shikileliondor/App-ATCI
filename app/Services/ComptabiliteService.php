<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\Comptabilite;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use RuntimeException;
use Throwable;

class ComptabiliteService
{
    public function paginate(int $perPage = 15): LengthAwarePaginator
    {
        return Comptabilite::query()->latest('date_operation')->paginate($perPage);
    }

    public function findOrFail(int $id): Comptabilite
    {
        return Comptabilite::query()->findOrFail($id);
    }

    public function create(array $data): Comptabilite
    {
        try {
            return DB::transaction(fn (): Comptabilite => Comptabilite::query()->create($data));
        } catch (Throwable $exception) {
            throw new RuntimeException('Erreur lors de la création de l\'opération comptable.', 0, $exception);
        }
    }

    public function update(Comptabilite $comptabilite, array $data): Comptabilite
    {
        try {
            return DB::transaction(function () use ($comptabilite, $data): Comptabilite {
                $comptabilite->fill($data);
                $comptabilite->save();

                return $comptabilite->refresh();
            });
        } catch (Throwable $exception) {
            throw new RuntimeException('Erreur lors de la mise à jour de l\'opération comptable.', 0, $exception);
        }
    }

    public function delete(Comptabilite $comptabilite): void
    {
        try {
            DB::transaction(fn (): bool => $comptabilite->delete());
        } catch (Throwable $exception) {
            throw new RuntimeException('Erreur lors de la suppression de l\'opération comptable.', 0, $exception);
        }
    }
}
