<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\ComptabiliteStoreRequest;
use App\Http\Requests\ComptabiliteUpdateRequest;
use App\Models\Comptabilite;
use App\Services\ComptabiliteService;
use Illuminate\Http\JsonResponse;

class ComptabiliteController extends Controller
{
    public function __construct(private readonly ComptabiliteService $comptabiliteService)
    {
    }

    public function index(): JsonResponse
    {
        return response()->json([
            'message' => 'Liste des opérations comptables récupérée avec succès.',
            'data' => $this->comptabiliteService->paginate(),
        ]);
    }

    public function store(ComptabiliteStoreRequest $request): JsonResponse
    {
        $comptabilite = $this->comptabiliteService->create($request->validated());

        return response()->json([
            'message' => 'Opération comptable créée avec succès.',
            'data' => $comptabilite,
        ], 201);
    }

    public function show(Comptabilite $comptabilite): JsonResponse
    {
        return response()->json([
            'message' => 'Opération comptable récupérée avec succès.',
            'data' => $this->comptabiliteService->findOrFail($comptabilite->id),
        ]);
    }

    public function update(ComptabiliteUpdateRequest $request, Comptabilite $comptabilite): JsonResponse
    {
        $updatedComptabilite = $this->comptabiliteService->update($comptabilite, $request->validated());

        return response()->json([
            'message' => 'Opération comptable mise à jour avec succès.',
            'data' => $updatedComptabilite,
        ]);
    }

    public function destroy(Comptabilite $comptabilite): JsonResponse
    {
        $this->comptabiliteService->delete($comptabilite);

        return response()->json([
            'message' => 'Opération comptable supprimée avec succès.',
        ]);
    }
}
