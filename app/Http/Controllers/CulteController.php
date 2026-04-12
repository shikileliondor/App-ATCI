<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\CulteStoreRequest;
use App\Http\Requests\CulteUpdateRequest;
use App\Models\Culte;
use App\Services\CulteService;
use Illuminate\Http\JsonResponse;

class CulteController extends Controller
{
    public function __construct(private readonly CulteService $culteService)
    {
    }

    public function index(): JsonResponse
    {
        return response()->json([
            'message' => 'Liste des cultes récupérée avec succès.',
            'data' => $this->culteService->paginate(),
        ]);
    }

    public function store(CulteStoreRequest $request): JsonResponse
    {
        $culte = $this->culteService->create($request->validated());

        return response()->json([
            'message' => 'Culte créé avec succès.',
            'data' => $culte,
        ], 201);
    }

    public function show(Culte $culte): JsonResponse
    {
        return response()->json([
            'message' => 'Culte récupéré avec succès.',
            'data' => $this->culteService->findOrFail($culte->id),
        ]);
    }

    public function update(CulteUpdateRequest $request, Culte $culte): JsonResponse
    {
        $updatedCulte = $this->culteService->update($culte, $request->validated());

        return response()->json([
            'message' => 'Culte mis à jour avec succès.',
            'data' => $updatedCulte,
        ]);
    }

    public function destroy(Culte $culte): JsonResponse
    {
        $this->culteService->delete($culte);

        return response()->json([
            'message' => 'Culte supprimé avec succès.',
        ]);
    }
}
