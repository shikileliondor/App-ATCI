<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\DocumentStoreRequest;
use App\Http\Requests\DocumentUpdateRequest;
use App\Models\Document;
use App\Services\DocumentService;
use Illuminate\Http\JsonResponse;

class DocumentController extends Controller
{
    public function __construct(private readonly DocumentService $documentService)
    {
    }

    public function index(): JsonResponse
    {
        return response()->json([
            'message' => 'Liste des documents récupérée avec succès.',
            'data' => $this->documentService->paginate(),
        ]);
    }

    public function store(DocumentStoreRequest $request): JsonResponse
    {
        $document = $this->documentService->create($request->validated());

        return response()->json([
            'message' => 'Document créé avec succès.',
            'data' => $document,
        ], 201);
    }

    public function show(Document $document): JsonResponse
    {
        return response()->json([
            'message' => 'Document récupéré avec succès.',
            'data' => $this->documentService->findOrFail($document->id),
        ]);
    }

    public function update(DocumentUpdateRequest $request, Document $document): JsonResponse
    {
        $updatedDocument = $this->documentService->update($document, $request->validated());

        return response()->json([
            'message' => 'Document mis à jour avec succès.',
            'data' => $updatedDocument,
        ]);
    }

    public function destroy(Document $document): JsonResponse
    {
        $this->documentService->delete($document);

        return response()->json([
            'message' => 'Document supprimé avec succès.',
        ]);
    }
}
