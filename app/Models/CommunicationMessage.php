<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CommunicationMessage extends Model
{
    use HasFactory;

    protected $fillable = [
        'content',
        'recipient_count',
        'status',
        'recipient_type',
        'channel',
        'sent_at',
        'error_details',
    ];

    protected $casts = [
        'sent_at' => 'datetime',
    ];
}
