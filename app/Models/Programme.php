<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Programme extends Model
{
    use HasFactory;

    protected $fillable = [
        'nom',
        'date_debut',
        'date_fin',
        'lieu',
        'description',
        'statut',
    ];

    protected $casts = [
        'date_debut' => 'date',
        'date_fin' => 'date',
    ];

    public function presences(): HasMany
    {
        return $this->hasMany(ProgrammePresence::class)->orderBy('date');
    }
}
