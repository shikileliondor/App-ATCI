<?php

declare(strict_types=1);

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ComptabiliteStoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'type' => ['required', Rule::in(['dime', 'offrande', 'don', 'autre'])],
            'montant' => ['required', 'numeric', 'min:0'],
            'description' => ['nullable', 'string'],
            'date_operation' => ['required', 'date'],
        ];
    }
}
