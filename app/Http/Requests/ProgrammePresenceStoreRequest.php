<?php

declare(strict_types=1);

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ProgrammePresenceStoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'date' => ['required', 'date'],
            'nombre_participants' => ['nullable', 'integer', 'min:0'],
            'hommes_adultes' => ['required', 'integer', 'min:0'],
            'femmes_adultes' => ['required', 'integer', 'min:0'],
            'jeunes_hommes' => ['required', 'integer', 'min:0'],
            'jeunes_filles' => ['required', 'integer', 'min:0'],
            'enfants' => ['required', 'integer', 'min:0'],
            'visiteurs' => ['required', 'integer', 'min:0'],
        ];
    }
}
