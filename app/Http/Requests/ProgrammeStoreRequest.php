<?php

declare(strict_types=1);

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ProgrammeStoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'nom' => ['required', 'string', 'max:255'],
            'date_debut' => ['required', 'date'],
            'date_fin' => ['required', 'date', 'after_or_equal:date_debut'],
            'lieu' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'statut' => ['nullable', 'in:actif,termine'],
            'presences' => ['nullable', 'array'],
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
