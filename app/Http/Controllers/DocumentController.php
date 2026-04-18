<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\DocumentStoreRequest;
use App\Http\Requests\DocumentUpdateRequest;
use App\Models\Document;
use App\Services\DocumentService;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\StreamedResponse;

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
        $validated = $request->validated();
        $validated['uploaded_by'] = $request->user()?->name;
        $document = $this->documentService->create($validated);

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
        $validated = $request->validated();
        $validated['uploaded_by'] = $request->user()?->name;
        $updatedDocument = $this->documentService->update($document, $validated);

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

    public function download(Document $document): StreamedResponse
    {
        abort_unless(
            $document->fichier !== '' && Storage::disk('public')->exists($document->fichier),
            404,
            'Fichier introuvable.'
        );

        $extension = pathinfo($document->fichier, PATHINFO_EXTENSION);
        $safeTitle = str($document->titre)->slug('_')->toString();
        $downloadName = trim($safeTitle, '_').($extension !== '' ? '.'.$extension : '');
        $mimeType = Storage::disk('public')->mimeType($document->fichier) ?: 'application/octet-stream';

        return Storage::disk('public')->download($document->fichier, $downloadName, [
            'Content-Type' => $mimeType,
        ]);
    }
}
