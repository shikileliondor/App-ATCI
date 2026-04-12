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
            'departement_id' => ['required', 'integer', 'exists:departements,id'],
            'statut' => ['required', Rule::in(['actif', 'inactif'])],
        ];
    }
}
