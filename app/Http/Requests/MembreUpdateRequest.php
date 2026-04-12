<?php

declare(strict_types=1);

namespace App\Http\Requests;

use App\Models\Membre;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class MembreUpdateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        /** @var Membre $membre */
        $membre = $this->route('membre');

        return [
            'nom' => ['sometimes', 'required', 'string', 'max:255'],
            'prenom' => ['sometimes', 'required', 'string', 'max:255'],
            'sexe' => ['sometimes', 'required', Rule::in(['homme', 'femme'])],
            'date_naissance' => ['nullable', 'date', 'before_or_equal:today'],
            'telephone' => ['sometimes', 'required', 'string', 'max:30', Rule::unique('membres', 'telephone')->ignore($membre->id)],
            'email' => ['nullable', 'email:rfc,dns', 'max:255', Rule::unique('membres', 'email')->ignore($membre->id)],
            'adresse' => ['nullable', 'string', 'max:500'],
            'departement_id' => ['sometimes', 'required', 'integer', 'exists:departements,id'],
            'comite_id' => ['nullable', 'integer', 'exists:comites,id'],
            'est_converti' => ['sometimes', 'boolean'],
            'date_conversion' => ['nullable', 'date', 'before_or_equal:today', 'required_if:est_converti,1'],
            'est_baptise' => ['sometimes', 'boolean'],
            'date_bapteme' => ['nullable', 'date', 'before_or_equal:today', 'required_if:est_baptise,1'],
            'situation_matrimoniale' => ['sometimes', 'required', Rule::in(['celibataire', 'marie', 'veuf', 'divorce', 'concubin'])],
            'profession' => ['nullable', 'string', 'max:255'],
            'statut' => ['sometimes', 'required', Rule::in(['actif', 'inactif'])],
            'date_inscription' => ['sometimes', 'required', 'date', 'before_or_equal:today'],
            'observations' => ['nullable', 'string'],
        ];
    }

    protected function prepareForValidation(): void
    {
        if ($this->has('est_converti')) {
            $this->merge(['est_converti' => $this->boolean('est_converti')]);
        }

        if ($this->has('est_baptise')) {
            $this->merge(['est_baptise' => $this->boolean('est_baptise')]);
        }
    }
}
