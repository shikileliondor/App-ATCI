<?php

namespace Database\Seeders;

use App\Models\CommunicationMessage;
use App\Models\Comptabilite;
use App\Models\Culte;
use App\Models\Document;
use App\Models\Programme;
use App\Models\ProgrammeParticipant;
use App\Models\ProgrammePresence;
use Illuminate\Database\Seeder;

class ActivitesSeeder extends Seeder
{
    public function run(): void
    {
        $culte = Culte::query()->updateOrCreate(
            ['titre' => 'Culte dominical - Avril S3', 'date_culte' => '2026-04-12'],
            [
                'heure' => '09:00',
                'lieu' => 'Temple central',
                'theme' => 'La fidélité de Dieu',
                'pasteur' => 'Ps. Jean Mukendi',
                'hommes_adultes' => 52,
                'femmes_adultes' => 61,
                'jeunes_hommes' => 24,
                'jeunes_filles' => 28,
                'enfants' => 35,
                'visiteurs' => 12,
                'total_personnes' => 212,
                'observations' => 'Bonne participation générale.',
            ]
        );

        Document::query()->updateOrCreate(
            ['titre' => 'Attestation de baptême'],
            [
                'type' => 'attestation',
                'categorie' => 'Administration',
                'fichier' => 'documents/attestation-bapteme-modele.pdf',
                'description' => 'Modèle standard d\'attestation de baptême.',
                'uploaded_by' => 'Administrateur ATCI',
                'file_size' => '245 KB',
            ]
        );

        $programme = Programme::query()->updateOrCreate(
            ['nom' => 'Séminaire des leaders', 'date_debut' => '2026-04-20'],
            [
                'type' => 'Séminaire',
                'date_fin' => '2026-04-22',
                'heure' => '17:00',
                'lieu' => 'Salle annexe',
                'description' => 'Renforcement des capacités des responsables.',
                'statut' => 'actif',
                'participants_enabled' => true,
                'participants_mode' => 'simple',
                'participants_expected' => 40,
                'participants_actual' => 0,
            ]
        );

        ProgrammePresence::query()->updateOrCreate(
            ['programme_id' => $programme->id, 'date' => '2026-04-20'],
            [
                'nombre_participants' => 32,
                'hommes_adultes' => 10,
                'femmes_adultes' => 11,
                'jeunes_hommes' => 4,
                'jeunes_filles' => 5,
                'enfants' => 0,
                'visiteurs' => 2,
            ]
        );

        ProgrammeParticipant::query()->updateOrCreate(
            ['programme_id' => $programme->id, 'nom' => 'Grace Kabila'],
            [
                'sexe' => 'femme',
                'departement' => 'Jeunesse',
            ]
        );

        ProgrammeParticipant::query()->updateOrCreate(
            ['programme_id' => $programme->id, 'nom' => 'David Mwamba'],
            [
                'sexe' => 'homme',
                'departement' => 'Intercession',
            ]
        );

        $operations = [
            ['type' => 'dime', 'montant' => 1800.00, 'description' => 'Dîmes du culte du dimanche', 'date_operation' => '2026-04-12'],
            ['type' => 'offrande', 'montant' => 950.50, 'description' => 'Offrandes spéciales séminaire', 'date_operation' => '2026-04-13'],
            ['type' => 'don', 'montant' => 500.00, 'description' => 'Don pour l\'action sociale', 'date_operation' => '2026-04-14'],
        ];

        foreach ($operations as $operation) {
            Comptabilite::query()->updateOrCreate(
                ['type' => $operation['type'], 'date_operation' => $operation['date_operation']],
                $operation
            );
        }

        CommunicationMessage::query()->updateOrCreate(
            [
                'content' => 'Rappel: séminaire des leaders ce lundi à 17h.',
                'channel' => 'sms',
                'recipient_type' => 'all',
            ],
            [
                'recipient_count' => 120,
                'status' => 'envoye',
                'sent_at' => now()->subDay(),
                'error_details' => null,
            ]
        );
    }
}
