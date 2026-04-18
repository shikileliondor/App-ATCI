<?php

declare(strict_types=1);

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ProgrammeParticipantUpdateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'nom' => ['sometimes', 'required', 'string', 'max:255'],
            'sexe' => ['nullable', 'in:homme,femme'],
            'departement' => ['nullable', 'string', 'max:255'],
        ];
    }
}
