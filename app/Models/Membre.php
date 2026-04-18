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
        'photo_path',
        'adresse',
        'departement_id',
        'comite_id',
        'est_converti',
        'date_conversion',
        'est_baptise',
        'date_bapteme',
        'situation_matrimoniale',
        'profession',
        'fonction_eglise',
        'niveau_etude',
        'contact_urgence_nom',
        'contact_urgence_telephone',
        'statut',
        'date_inscription',
        'observations',
        'pdf_afficher_logo',
        'pdf_afficher_nom_eglise',
        'pdf_titre_document',
    ];

    protected $casts = [
        'est_converti' => 'boolean',
        'est_baptise' => 'boolean',
        'date_naissance' => 'date',
        'date_conversion' => 'date',
        'date_bapteme' => 'date',
        'date_inscription' => 'date',
        'pdf_afficher_logo' => 'boolean',
        'pdf_afficher_nom_eglise' => 'boolean',
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
