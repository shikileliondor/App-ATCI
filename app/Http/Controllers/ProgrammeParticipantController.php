<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Models\Programme;
use App\Models\ProgrammeParticipant;
use App\Services\ProgrammeService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProgrammeParticipantController extends Controller
{
    public function __construct(private readonly ProgrammeService $programmeService)
    {
    }

    public function updateSettings(Request $request, Programme $programme): JsonResponse
    {
        $validated = $request->validate([
            'participants_enabled' => ['required', 'boolean'],
            'participants_mode' => ['nullable', 'in:simple,advanced'],
            'participants_expected' => ['nullable', 'integer', 'min:0'],
            'participants_actual' => ['nullable', 'integer', 'min:0'],
        ]);

        if (($validated['participants_enabled'] ?? false) && empty($validated['participants_mode'])) {
            return response()->json([
                'message' => 'Le mode participants est requis lorsque le suivi est activé.',
                'errors' => ['participants_mode' => ['Le mode participants est requis lorsque le suivi est activé.']],
            ], 422);
        }

        $programme = $this->programmeService->updateParticipantSettings($programme, $validated);

        return response()->json([
            'message' => 'Paramètres participants mis à jour.',
            'data' => $programme,
        ]);
    }

    public function store(Request $request, Programme $programme): JsonResponse
    {
        $validated = $request->validate([
            'nom' => ['required', 'string', 'max:255'],
            'sexe' => ['nullable', 'in:homme,femme'],
            'departement' => ['nullable', 'string', 'max:255'],
        ]);

        $participant = $this->programmeService->addParticipant($programme, $validated);

        return response()->json([
            'message' => 'Participant ajouté.',
            'data' => $participant,
        ], 201);
    }

    public function destroy(Programme $programme, ProgrammeParticipant $participant): JsonResponse
    {
        $this->programmeService->deleteParticipant($programme, $participant);

        return response()->json([
            'message' => 'Participant supprimé.',
        ]);
    }
}
