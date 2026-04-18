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
        'type',
        'date_debut',
        'date_fin',
        'heure',
        'lieu',
        'description',
        'statut',
        'participants_enabled',
        'participants_mode',
        'participants_expected',
        'participants_actual',
    ];

    protected $casts = [
        'date_debut' => 'date',
        'date_fin' => 'date',
        'participants_enabled' => 'boolean',
        'participants_expected' => 'integer',
        'participants_actual' => 'integer',
    ];

    public function presences(): HasMany
    {
        return $this->hasMany(ProgrammePresence::class)->orderBy('date');
    }

    public function participants(): HasMany
    {
        return $this->hasMany(ProgrammeParticipant::class)->orderBy('nom');
    }
}
