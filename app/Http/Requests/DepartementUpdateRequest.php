<?php

declare(strict_types=1);

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class DepartementUpdateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $departementId = $this->route('departement')?->id;

        return [
            'nom' => ['required', 'string', 'max:150', Rule::unique('departements', 'nom')->ignore($departementId)],
            'description' => ['nullable', 'string', 'max:1500'],
            'statut' => ['required', Rule::in(['actif', 'inactif'])],
        ];
    }
}
