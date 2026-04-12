<?php

declare(strict_types=1);

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class VisiteurStoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'nom' => ['required', 'string', 'max:255'],
            'prenom' => ['required', 'string', 'max:255'],
            'sexe' => ['nullable', Rule::in(['homme', 'femme'])],
            'telephone' => ['nullable', 'string', 'max:30'],
            'motif_visite' => ['nullable', 'string', 'max:500'],
            'date_visite' => ['required', 'date'],
            'invite_par' => ['nullable', 'string', 'max:255'],
            'adresse' => ['nullable', 'string', 'max:500'],
            'commentaire' => ['nullable', 'string'],
        ];
    }
}
