<?php

declare(strict_types=1);

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class VisiteurUpdateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'nom' => ['sometimes', 'required', 'string', 'max:255'],
            'prenom' => ['sometimes', 'required', 'string', 'max:255'],
            'telephone' => ['nullable', 'string', 'max:30'],
            'motif_visite' => ['nullable', 'string', 'max:500'],
            'date_visite' => ['sometimes', 'required', 'date'],
            'commentaire' => ['nullable', 'string'],
        ];
    }
}
