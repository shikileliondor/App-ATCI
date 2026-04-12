<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Comptabilite extends Model
{
    use HasFactory;

    protected $table = 'comptabilite';

    protected $fillable = [
        'type',
        'montant',
        'description',
        'date_operation',
    ];

    protected $casts = [
        'montant' => 'decimal:2',
        'date_operation' => 'date',
    ];
}
