<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Document extends Model
{
    use HasFactory;

    protected $fillable = [
        'titre',
        'type',
        'fichier',
        'categorie',
        'description',
        'uploaded_by',
        'file_size',
    ];
}
