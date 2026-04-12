<?php

declare(strict_types=1);

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class DepartementStoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'nom' => ['required', 'string', 'max:150', Rule::unique('departements', 'nom')],
            'description' => ['nullable', 'string', 'max:1500'],
            'statut' => ['required', Rule::in(['actif', 'inactif'])],
        ];
    }
}
