<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\Comite;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\DB;

class ComiteService
{
    public function paginate(array $filters = [], int $perPage = 10): LengthAwarePaginator
    {
        return Comite::query()
            ->with('departement:id,nom')
            ->when($filters['search'] ?? null, function (Builder $query, string $search): void {
                $query->where(function (Builder $builder) use ($search): void {
                    $builder->where('nom', 'like', "%{$search}%")
                        ->orWhereHas('departement', fn (Builder $query) => $query->where('nom', 'like', "%{$search}%"));
                });
            })
            ->when($filters['statut'] ?? null, fn (Builder $query, string $statut) => $query->where('statut', $statut))
            ->latest()
            ->paginate($perPage)
            ->withQueryString();
    }

    public function create(array $data): Comite
    {
        return DB::transaction(fn (): Comite => Comite::query()->create($data));
    }

    public function update(Comite $comite, array $data): Comite
    {
        return DB::transaction(function () use ($comite, $data): Comite {
            $comite->update($data);

            return $comite->refresh();
        });
    }

    public function delete(Comite $comite): void
    {
        DB::transaction(function () use ($comite): void {
            $comite->delete();
        });
    }
}
