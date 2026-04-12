<?php

declare(strict_types=1);

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CulteUpdateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'titre' => ['sometimes', 'required', 'string', 'max:255'],
            'date_culte' => ['sometimes', 'required', 'date'],
            'theme' => ['nullable', 'string', 'max:255'],
            'pasteur' => ['nullable', 'string', 'max:255'],
            'hommes_adultes' => ['sometimes', 'integer', 'min:0'],
            'femmes_adultes' => ['sometimes', 'integer', 'min:0'],
            'jeunes_hommes' => ['sometimes', 'integer', 'min:0'],
            'jeunes_filles' => ['sometimes', 'integer', 'min:0'],
            'enfants' => ['sometimes', 'integer', 'min:0'],
            'visiteurs' => ['sometimes', 'integer', 'min:0'],
            'total_personnes' => ['nullable', 'integer', 'min:0'],
            'observations' => ['nullable', 'string'],
        ];
    }
}
