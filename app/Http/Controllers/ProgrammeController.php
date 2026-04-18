<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\ProgrammeStoreRequest;
use App\Http\Requests\ProgrammeUpdateRequest;
use App\Models\Programme;
use App\Services\ProgrammeService;
use Illuminate\Http\JsonResponse;

class ProgrammeController extends Controller
{
    public function __construct(private readonly ProgrammeService $programmeService)
    {
    }

    public function index(): JsonResponse
    {
        return response()->json([
            'message' => 'Liste des événements récupérée avec succès.',
            'data' => $this->programmeService->paginate(),
        ]);
    }

    public function store(ProgrammeStoreRequest $request): JsonResponse
    {
        $programme = $this->programmeService->create($request->validated());

        return response()->json([
            'message' => 'Événement créé avec succès.',
            'data' => $programme,
        ], 201);
    }

    public function show(Programme $programme): JsonResponse
    {
        return response()->json([
            'message' => 'Événement récupéré avec succès.',
            'data' => $this->programmeService->getProgrammeDashboard($programme->id),
        ]);
    }

    public function update(ProgrammeUpdateRequest $request, Programme $programme): JsonResponse
    {
        $updatedProgramme = $this->programmeService->update($programme, $request->validated());

        return response()->json([
            'message' => 'Événement mis à jour avec succès.',
            'data' => $updatedProgramme,
        ]);
    }

    public function destroy(Programme $programme): JsonResponse
    {
        $this->programmeService->delete($programme);

        return response()->json([
            'message' => 'Événement supprimé avec succès.',
        ]);
    }
}
