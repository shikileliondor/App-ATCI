<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\Culte;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use RuntimeException;
use Throwable;

class CulteService
{
    public function paginate(int $perPage = 15): LengthAwarePaginator
    {
        return Culte::query()->latest('date_culte')->paginate($perPage);
    }

    public function findOrFail(int $id): Culte
    {
        return Culte::query()->findOrFail($id);
    }

    public function create(array $data): Culte
    {
        try {
            return DB::transaction(function () use ($data): Culte {
                $payload = $this->applyBusinessRules($data);

                return Culte::query()->create($payload);
            });
        } catch (Throwable $exception) {
            throw new RuntimeException('Erreur lors de la création du culte.', 0, $exception);
        }
    }

    public function update(Culte $culte, array $data): Culte
    {
        try {
            return DB::transaction(function () use ($culte, $data): Culte {
                $payload = $this->applyBusinessRules($data, $culte);

                $culte->fill($payload);
                $culte->save();

                return $culte->refresh();
            });
        } catch (Throwable $exception) {
            throw new RuntimeException('Erreur lors de la mise à jour du culte.', 0, $exception);
        }
    }

    public function delete(Culte $culte): void
    {
        try {
            DB::transaction(fn (): bool => $culte->delete());
        } catch (Throwable $exception) {
            throw new RuntimeException('Erreur lors de la suppression du culte.', 0, $exception);
        }
    }

    private function applyBusinessRules(array $data, ?Culte $existingCulte = null): array
    {
        $stats = ['hommes_adultes', 'femmes_adultes', 'jeunes_hommes', 'jeunes_filles', 'enfants', 'visiteurs'];

        if (! array_key_exists('total_personnes', $data) || $data['total_personnes'] === null || $data['total_personnes'] === '') {
            $sum = 0;
            foreach ($stats as $field) {
                if (array_key_exists($field, $data)) {
                    $sum += (int) $data[$field];
                    continue;
                }

                $sum += (int) ($existingCulte?->{$field} ?? 0);
            }
            $data['total_personnes'] = $sum;
        }

        return $data;
    }
}
