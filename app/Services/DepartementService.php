<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\Departement;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\DB;

class DepartementService
{
    public function paginate(array $filters = [], int $perPage = 10): LengthAwarePaginator
    {
        return Departement::query()
            ->withCount('comites')
            ->when($filters['search'] ?? null, function (Builder $query, string $search): void {
                $query->where('nom', 'like', "%{$search}%");
            })
            ->when($filters['statut'] ?? null, function (Builder $query, string $statut): void {
                $query->where('statut', $statut);
            })
            ->latest()
            ->paginate($perPage)
            ->withQueryString();
    }

    public function create(array $data): Departement
    {
        return DB::transaction(fn (): Departement => Departement::query()->create($data));
    }

    public function update(Departement $departement, array $data): Departement
    {
        return DB::transaction(function () use ($departement, $data): Departement {
            $departement->update($data);

            return $departement->refresh();
        });
    }

    public function delete(Departement $departement): void
    {
        DB::transaction(function () use ($departement): void {
            $departement->delete();
        });
    }
}
