<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Comite extends Model
{
    use HasFactory;

    protected $fillable = [
        'nom',
        'description',
        'departement_id',
        'statut',
    ];

    public function membres(): HasMany
    {
        return $this->hasMany(Membre::class);
    }

    public function departement(): BelongsTo
    {
        return $this->belongsTo(Departement::class);
    }
}
