<?php

declare(strict_types=1);

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class DocumentUpdateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'titre' => ['sometimes', 'required', 'string', 'max:255'],
            'type' => ['nullable', 'string', 'max:100'],
            'fichier' => ['sometimes', 'file', 'mimes:pdf,doc,docx,jpg,jpeg,png', 'max:10240'],
            'description' => ['nullable', 'string'],
        ];
    }
}
