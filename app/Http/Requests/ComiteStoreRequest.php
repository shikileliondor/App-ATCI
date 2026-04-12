<?php

declare(strict_types=1);

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ComiteStoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'nom' => ['required', 'string', 'max:150', Rule::unique('comites', 'nom')],
            'description' => ['nullable', 'string', 'max:1500'],
            'statut' => ['sometimes', Rule::in(['actif', 'inactif'])],
        ];
    }

    public function attributes(): array
    {
        return [
            'departement_id' => 'département associé',
        ];
    }

    public function messages(): array
    {
        return [
            'departement_id.required' => 'Veuillez sélectionner un département associé.',
            'departement_id.exists' => 'Le département sélectionné est invalide.',
        ];
    }
}
