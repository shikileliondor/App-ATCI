<?php

declare(strict_types=1);

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ProgrammePresenceUpdateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'date' => ['sometimes', 'required', 'date'],
            'nombre_participants' => ['nullable', 'integer', 'min:0'],
            'hommes_adultes' => ['sometimes', 'required', 'integer', 'min:0'],
            'femmes_adultes' => ['sometimes', 'required', 'integer', 'min:0'],
            'jeunes_hommes' => ['sometimes', 'required', 'integer', 'min:0'],
            'jeunes_filles' => ['sometimes', 'required', 'integer', 'min:0'],
            'enfants' => ['sometimes', 'required', 'integer', 'min:0'],
            'visiteurs' => ['sometimes', 'required', 'integer', 'min:0'],
        ];
    }
}
