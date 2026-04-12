<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\ProgrammePresenceStoreRequest;
use App\Http\Requests\ProgrammePresenceUpdateRequest;
use App\Models\Programme;
use App\Models\ProgrammePresence;
use App\Services\ProgrammeService;
use Illuminate\Http\JsonResponse;

class ProgrammePresenceController extends Controller
{
    public function __construct(private readonly ProgrammeService $programmeService)
    {
    }

    public function store(ProgrammePresenceStoreRequest $request, Programme $programme): JsonResponse
    {
        $presence = $this->programmeService->createPresence($programme, $request->validated());

        return response()->json([
            'message' => 'Présence enregistrée avec succès.',
            'data' => $presence,
        ], 201);
    }

    public function update(ProgrammePresenceUpdateRequest $request, Programme $programme, ProgrammePresence $presence): JsonResponse
    {
        $presence = $this->programmeService->updatePresence($programme, $presence, $request->validated());

        return response()->json([
            'message' => 'Présence mise à jour avec succès.',
            'data' => $presence,
        ]);
    }

    public function destroy(Programme $programme, ProgrammePresence $presence): JsonResponse
    {
        $this->programmeService->deletePresence($programme, $presence);

        return response()->json([
            'message' => 'Présence supprimée avec succès.',
        ]);
    }
}
