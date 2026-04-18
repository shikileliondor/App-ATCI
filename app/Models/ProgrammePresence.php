<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProgrammePresence extends Model
{
    use HasFactory;

    protected $fillable = [
        'programme_id',
        'date',
        'nombre_participants',
        'hommes_adultes',
        'femmes_adultes',
        'jeunes_hommes',
        'jeunes_filles',
        'enfants',
        'visiteurs',
    ];

    protected $casts = [
        'date' => 'date',
        'nombre_participants' => 'integer',
        'hommes_adultes' => 'integer',
        'femmes_adultes' => 'integer',
        'jeunes_hommes' => 'integer',
        'jeunes_filles' => 'integer',
        'enfants' => 'integer',
        'visiteurs' => 'integer',
    ];

    public function programme(): BelongsTo
    {
        return $this->belongsTo(Programme::class);
    }
}
