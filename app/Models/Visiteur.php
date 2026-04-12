<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Visiteur extends Model
{
    use HasFactory;

    protected $fillable = [
        'nom',
        'prenom',
        'sexe',
        'telephone',
        'motif_visite',
        'date_visite',
        'invite_par',
        'adresse',
        'commentaire',
    ];

    protected $casts = [
        'date_visite' => 'date',
    ];
}
