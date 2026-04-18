<?php

namespace App\Services;

use RuntimeException;

class SmsGateway
{
    public function send(string $phone, string $message): void
    {
        if (strlen(trim($phone)) < 8) {
            throw new RuntimeException('Numéro invalide.');
        }

        if (trim($message) === '') {
            throw new RuntimeException('Message vide.');
        }

        // Stub prêt pour branchement API SMS.
    }
}
