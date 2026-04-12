<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Membre extends Model
{
    use HasFactory;

    protected $fillable = [
        'nom',
        'prenom',
        'sexe',
        'date_naissance',
        'telephone',
        'email',
        'adresse',
        'departement_id',
        'comite_id',
        'est_converti',
        'date_conversion',
        'est_baptise',
        'date_bapteme',
        'situation_matrimoniale',
        'profession',
        'statut',
        'date_inscription',
        'observations',
    ];

    protected $casts = [
        'est_converti' => 'boolean',
        'est_baptise' => 'boolean',
        'date_naissance' => 'date',
        'date_conversion' => 'date',
        'date_bapteme' => 'date',
        'date_inscription' => 'date',
    ];

    public function departement(): BelongsTo
    {
        return $this->belongsTo(Departement::class);
    }

    public function comite(): BelongsTo
    {
        return $this->belongsTo(Comite::class);
    }
}
