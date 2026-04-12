<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\VisiteurStoreRequest;
use App\Http\Requests\VisiteurUpdateRequest;
use App\Models\Visiteur;
use App\Services\VisiteurService;
use Illuminate\Http\JsonResponse;

class VisiteurController extends Controller
{
    public function __construct(private readonly VisiteurService $visiteurService)
    {
    }

    public function index(): JsonResponse
    {
        return response()->json([
            'message' => 'Liste des visiteurs récupérée avec succès.',
            'data' => $this->visiteurService->paginate(),
        ]);
    }

    public function store(VisiteurStoreRequest $request): JsonResponse
    {
        $visiteur = $this->visiteurService->create($request->validated());

        return response()->json([
            'message' => 'Visiteur créé avec succès.',
            'data' => $visiteur,
        ], 201);
    }

    public function show(Visiteur $visiteur): JsonResponse
    {
        return response()->json([
            'message' => 'Visiteur récupéré avec succès.',
            'data' => $this->visiteurService->findOrFail($visiteur->id),
        ]);
    }

    public function update(VisiteurUpdateRequest $request, Visiteur $visiteur): JsonResponse
    {
        $updatedVisiteur = $this->visiteurService->update($visiteur, $request->validated());

        return response()->json([
            'message' => 'Visiteur mis à jour avec succès.',
            'data' => $updatedVisiteur,
        ]);
    }

    public function destroy(Visiteur $visiteur): JsonResponse
    {
        $this->visiteurService->delete($visiteur);

        return response()->json([
            'message' => 'Visiteur supprimé avec succès.',
        ]);
    }
}
