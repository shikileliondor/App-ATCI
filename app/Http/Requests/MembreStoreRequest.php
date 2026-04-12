<?php

declare(strict_types=1);

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class MembreStoreRequest extends FormRequest
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
            'sexe' => ['required', Rule::in(['homme', 'femme'])],
            'date_naissance' => ['nullable', 'date', 'before_or_equal:today'],
            'telephone' => ['required', 'string', 'max:30', 'unique:membres,telephone'],
            'email' => ['nullable', 'email:rfc,dns', 'max:255', 'unique:membres,email'],
            'adresse' => ['nullable', 'string', 'max:500'],
            'departement_id' => ['required', 'integer', 'exists:departements,id'],
            'comite_id' => ['nullable', 'integer', 'exists:comites,id'],
            'est_converti' => ['sometimes', 'boolean'],
            'date_conversion' => ['nullable', 'date', 'before_or_equal:today', 'required_if:est_converti,1'],
            'est_baptise' => ['sometimes', 'boolean'],
            'date_bapteme' => ['nullable', 'date', 'before_or_equal:today', 'required_if:est_baptise,1'],
            'situation_matrimoniale' => ['required', Rule::in(['celibataire', 'marie', 'veuf', 'divorce', 'concubin'])],
            'profession' => ['nullable', 'string', 'max:255'],
            'statut' => ['nullable', Rule::in(['actif', 'inactif'])],
            'date_inscription' => ['required', 'date', 'before_or_equal:today'],
            'observations' => ['nullable', 'string'],
        ];
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'est_converti' => $this->boolean('est_converti'),
            'est_baptise' => $this->boolean('est_baptise'),
        ]);
    }
}
