<?php

declare(strict_types=1);

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CulteStoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'titre' => ['nullable', 'string', 'max:255'],
            'date_culte' => ['required', 'date'],
            'heure' => ['nullable', 'date_format:H:i'],
            'lieu' => ['nullable', 'string', 'max:255'],
            'theme' => ['nullable', 'string', 'max:255'],
            'pasteur' => ['nullable', 'string', 'max:255'],
            'hommes_adultes' => ['nullable', 'integer', 'min:0'],
            'femmes_adultes' => ['nullable', 'integer', 'min:0'],
            'jeunes_hommes' => ['nullable', 'integer', 'min:0'],
            'jeunes_filles' => ['nullable', 'integer', 'min:0'],
            'enfants' => ['nullable', 'integer', 'min:0'],
            'visiteurs' => ['nullable', 'integer', 'min:0'],
            'total_personnes' => ['nullable', 'integer', 'min:0'],
            'observations' => ['nullable', 'string'],
        ];
    }
}
