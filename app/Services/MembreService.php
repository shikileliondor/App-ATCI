<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\Membre;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;
use RuntimeException;
use Throwable;

class MembreService
{
    public function paginate(int $perPage = 15): LengthAwarePaginator
    {
        return Membre::query()
            ->with(['departement:id,nom', 'comite:id,nom'])
            ->latest()
            ->paginate($perPage);
    }

    public function findOrFail(int $id): Membre
    {
        return Membre::query()->findOrFail($id);
    }

    public function create(array $data): Membre
    {
        try {
            return DB::transaction(function () use ($data): Membre {
                $payload = $this->applyBusinessRules($data);

                return Membre::query()->create($payload);
            });
        } catch (Throwable $exception) {
            throw new RuntimeException('Erreur lors de la création du membre.', 0, $exception);
        }
    }

    public function update(Membre $membre, array $data): Membre
    {
        try {
            return DB::transaction(function () use ($membre, $data): Membre {
                $payload = $this->applyBusinessRules($data, true);
                $membre->fill($payload);
                $membre->save();

                return $membre->refresh();
            });
        } catch (Throwable $exception) {
            throw new RuntimeException('Erreur lors de la mise à jour du membre.', 0, $exception);
        }
    }

    public function delete(Membre $membre): void
    {
        try {
            DB::transaction(function () use ($membre): void {
                $membre->delete();
            });
        } catch (Throwable $exception) {
            throw new RuntimeException('Erreur lors de la suppression du membre.', 0, $exception);
        }
    }

    private function applyBusinessRules(array $data, bool $isUpdate = false): array
    {
        $payload = Arr::except($data, ['departement_id', 'comite_id']);

        if (array_key_exists('departement_id', $data)) {
            $payload['departement_id'] = $data['departement_id'];
        }

        if (array_key_exists('comite_id', $data)) {
            $payload['comite_id'] = $data['comite_id'];
        } elseif (! $isUpdate) {
            $payload['comite_id'] = null;
        }

        if (array_key_exists('est_converti', $payload) && ! $payload['est_converti']) {
            $payload['date_conversion'] = null;
        }

        if (array_key_exists('est_baptise', $payload) && ! $payload['est_baptise']) {
            $payload['date_bapteme'] = null;
        }

        return $payload;
    }
}
