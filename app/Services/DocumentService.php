<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\Document;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use RuntimeException;
use Throwable;

class DocumentService
{
    public function paginate(int $perPage = 15): LengthAwarePaginator
    {
        return Document::query()->latest()->paginate($perPage);
    }

    public function findOrFail(int $id): Document
    {
        return Document::query()->findOrFail($id);
    }

    public function create(array $data): Document
    {
        try {
            return DB::transaction(function () use ($data): Document {
                /** @var UploadedFile $file */
                $file = $data['fichier'];
                $data['fichier'] = $file->store('documents', 'public');
                $data['file_size'] = round($file->getSize() / 1024, 1).' KB';

                return Document::query()->create($data);
            });
        } catch (Throwable $exception) {
            throw new RuntimeException('Erreur lors de l\'enregistrement du document.', 0, $exception);
        }
    }

    public function update(Document $document, array $data): Document
    {
        try {
            return DB::transaction(function () use ($document, $data): Document {
                if (isset($data['fichier']) && $data['fichier'] instanceof UploadedFile) {
                    if ($document->fichier !== '' && Storage::disk('public')->exists($document->fichier)) {
                        Storage::disk('public')->delete($document->fichier);
                    }

                    $file = $data['fichier'];
                    $data['fichier'] = $file->store('documents', 'public');
                    $data['file_size'] = round($file->getSize() / 1024, 1).' KB';
                }

                $document->fill($data);
                $document->save();

                return $document->refresh();
            });
        } catch (Throwable $exception) {
            throw new RuntimeException('Erreur lors de la mise à jour du document.', 0, $exception);
        }
    }

    public function delete(Document $document): void
    {
        try {
            DB::transaction(function () use ($document): void {
                if ($document->fichier !== '' && Storage::disk('public')->exists($document->fichier)) {
                    Storage::disk('public')->delete($document->fichier);
                }

                $document->delete();
            });
        } catch (Throwable $exception) {
            throw new RuntimeException('Erreur lors de la suppression du document.', 0, $exception);
        }
    }
}
