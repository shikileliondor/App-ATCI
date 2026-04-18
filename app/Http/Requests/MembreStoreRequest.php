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
            'photo' => ['nullable', 'image', 'max:4096'],
            'remove_photo' => ['nullable', 'boolean'],
            'adresse' => ['nullable', 'string', 'max:500'],
            'departement_id' => ['required', 'integer', 'exists:departements,id'],
            'comite_id' => ['nullable', 'integer', 'exists:comites,id'],
            'est_baptise' => ['sometimes', 'boolean'],
            'date_bapteme' => ['nullable', 'date', 'before_or_equal:today', 'required_if:est_baptise,1'],
            'situation_matrimoniale' => ['required', Rule::in(['celibataire', 'marie', 'veuf', 'divorce', 'concubin'])],
            'profession' => ['nullable', 'string', 'max:255'],
            'fonction_eglise' => ['nullable', 'string', 'max:255'],
            'niveau_etude' => ['nullable', 'string', 'max:255'],
            'contact_urgence_nom' => ['nullable', 'string', 'max:255'],
            'contact_urgence_telephone' => ['nullable', 'string', 'max:30'],
            'statut' => ['nullable', Rule::in(['actif', 'inactif'])],
            'date_inscription' => ['required', 'date', 'before_or_equal:today'],
            'observations' => ['nullable', 'string'],
            'pdf_afficher_logo' => ['nullable', 'boolean'],
            'pdf_afficher_nom_eglise' => ['nullable', 'boolean'],
            'pdf_titre_document' => ['nullable', 'string', 'max:255'],
        ];
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'est_baptise' => $this->boolean('est_baptise'),
            'remove_photo' => $this->boolean('remove_photo'),
            'pdf_afficher_logo' => $this->boolean('pdf_afficher_logo'),
            'pdf_afficher_nom_eglise' => $this->boolean('pdf_afficher_nom_eglise'),
        ]);
    }
}
