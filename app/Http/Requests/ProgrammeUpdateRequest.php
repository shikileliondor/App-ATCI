<?php

declare(strict_types=1);

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ProgrammeUpdateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'nom' => ['sometimes', 'required', 'string', 'max:255'],
            'date_debut' => ['sometimes', 'required', 'date'],
            'date_fin' => ['sometimes', 'required', 'date', 'after_or_equal:date_debut'],
            'lieu' => ['sometimes', 'required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'statut' => ['nullable', 'in:actif,termine'],
            'presences' => ['sometimes', 'array'],
            'presences.*.date' => ['required_with:presences', 'date'],
            'presences.*.hommes_adultes' => ['required_with:presences', 'integer', 'min:0'],
            'presences.*.femmes_adultes' => ['required_with:presences', 'integer', 'min:0'],
            'presences.*.jeunes_hommes' => ['required_with:presences', 'integer', 'min:0'],
            'presences.*.jeunes_filles' => ['required_with:presences', 'integer', 'min:0'],
            'presences.*.enfants' => ['required_with:presences', 'integer', 'min:0'],
            'presences.*.visiteurs' => ['required_with:presences', 'integer', 'min:0'],
        ];
    }
}
