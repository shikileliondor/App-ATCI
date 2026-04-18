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
            'type' => ['sometimes', 'required', 'string', 'max:120'],
            'date_debut' => ['sometimes', 'required', 'date'],
            'date_fin' => ['sometimes', 'required', 'date', 'after_or_equal:date_debut'],
            'heure' => ['nullable', 'date_format:H:i'],
            'lieu' => ['sometimes', 'required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'statut' => ['nullable', 'in:actif,termine'],
            'participants_enabled' => ['nullable', 'boolean'],
            'participants_mode' => ['nullable', 'in:simple,avance'],
            'expected_participants' => ['nullable', 'integer', 'min:0'],
            'actual_participants' => ['nullable', 'integer', 'min:0'],
        ];
    }
}
