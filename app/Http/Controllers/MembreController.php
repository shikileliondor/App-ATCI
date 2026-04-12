<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\MembreStoreRequest;
use App\Http\Requests\MembreUpdateRequest;
use App\Models\Membre;
use App\Services\MembreService;
use Illuminate\Http\JsonResponse;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;

class MembreController extends Controller
{
    public function __construct(private readonly MembreService $membreService)
    {
    }

    public function index(): InertiaResponse
    {
        return Inertia::render('Membres/Index', [
            'membres' => $this->membreService->paginate(),
        ]);
    }

    public function store(MembreStoreRequest $request): JsonResponse
    {
        $membre = $this->membreService->create($request->validated());

        return response()->json([
            'message' => 'Membre créé avec succès.',
            'data' => $membre,
        ], 201);
    }

    public function show(Membre $membre): JsonResponse
    {
        return response()->json([
            'message' => 'Membre récupéré avec succès.',
            'data' => $this->membreService->findOrFail($membre->id),
        ]);
    }

    public function update(MembreUpdateRequest $request, Membre $membre): JsonResponse
    {
        $updatedMembre = $this->membreService->update($membre, $request->validated());

        return response()->json([
            'message' => 'Membre mis à jour avec succès.',
            'data' => $updatedMembre,
        ]);
    }

    public function destroy(Membre $membre): JsonResponse
    {
        $this->membreService->delete($membre);

        return response()->json([
            'message' => 'Membre supprimé avec succès.',
        ]);
    }
}
