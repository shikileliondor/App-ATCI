<?php

declare(strict_types=1);

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

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
            'type' => ['sometimes', 'required', 'string', 'max:120', 'not_in:culte,cultes,Culte,Cultes'],
            'date_debut' => ['sometimes', 'required', 'date'],
            'date_fin' => ['sometimes', 'required', 'date', 'after_or_equal:date_debut'],
            'heure' => ['nullable', 'date_format:H:i'],
            'lieu' => ['sometimes', 'required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'statut' => ['nullable', 'in:actif,termine'],
            'participants_enabled' => ['sometimes', 'boolean'],
            'participants_mode' => ['nullable', 'in:simple,advanced'],
            'participants_expected' => ['nullable', 'integer', 'min:0'],
            'participants_actual' => ['nullable', 'integer', 'min:0'],
        ];
    }

    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator): void {
            if (! $this->boolean('participants_enabled')) {
                return;
            }

            if ($this->has('participants_enabled') && ! $this->filled('participants_mode')) {
                $validator->errors()->add('participants_mode', 'Le mode participants est requis lorsque le suivi est activé.');
            }
        });
    }
}
