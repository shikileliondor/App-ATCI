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
    ];

    protected $casts = [
        'date' => 'date',
        'nombre_participants' => 'integer',
    ];

    public function programme(): BelongsTo
    {
        return $this->belongsTo(Programme::class);
    }
}
