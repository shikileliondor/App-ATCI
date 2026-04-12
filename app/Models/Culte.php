<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Culte extends Model
{
    use HasFactory;

    protected $fillable = [
        'titre',
        'date_culte',
        'theme',
        'pasteur',
        'hommes_adultes',
        'femmes_adultes',
        'jeunes_hommes',
        'jeunes_filles',
        'enfants',
        'visiteurs',
        'total_personnes',
        'observations',
    ];

    protected $casts = [
        'date_culte' => 'date',
    ];
}
