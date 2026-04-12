<?php

declare(strict_types=1);

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class DocumentStoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'titre' => ['required', 'string', 'max:255'],
            'type' => ['nullable', 'string', 'max:100'],
            'fichier' => ['required', 'file', 'mimes:pdf,doc,docx,jpg,jpeg,png', 'max:10240'],
            'categorie' => ['nullable', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'uploaded_by' => ['nullable', 'string', 'max:255'],
        ];
    }
}
