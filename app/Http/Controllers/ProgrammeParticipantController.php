<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\ProgrammeParticipantStoreRequest;
use App\Http\Requests\ProgrammeParticipantUpdateRequest;
use App\Models\Programme;
use App\Models\ProgrammeParticipant;
use Illuminate\Http\JsonResponse;

class ProgrammeParticipantController extends Controller
{
    public function store(ProgrammeParticipantStoreRequest $request, Programme $programme): JsonResponse
    {
        $participant = $programme->participants()->create($request->validated());

        return response()->json([
            'message' => 'Participant ajouté avec succès.',
            'data' => $participant,
        ], 201);
    }

    public function update(ProgrammeParticipantUpdateRequest $request, Programme $programme, ProgrammeParticipant $participant): JsonResponse
    {
        abort_if($participant->programme_id !== $programme->id, 404);

        $participant->update($request->validated());

        return response()->json([
            'message' => 'Participant mis à jour avec succès.',
            'data' => $participant,
        ]);
    }

    public function destroy(Programme $programme, ProgrammeParticipant $participant): JsonResponse
    {
        abort_if($participant->programme_id !== $programme->id, 404);

        $participant->delete();

        return response()->json([
            'message' => 'Participant supprimé avec succès.',
        ]);
    }
}
