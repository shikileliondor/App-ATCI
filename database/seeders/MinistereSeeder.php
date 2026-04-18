<?php

namespace Database\Seeders;

use App\Models\Comite;
use App\Models\Departement;
use App\Models\Membre;
use App\Models\Visiteur;
use Illuminate\Database\Seeder;

class MinistereSeeder extends Seeder
{
    public function run(): void
    {
        $jeunesse = Departement::query()->where('nom', 'Jeunesse')->firstOrFail();
        $intercession = Departement::query()->where('nom', 'Intercession')->firstOrFail();

        $media = Comite::query()->where('nom', 'Média')->first();
        $evangelisation = Comite::query()->where('nom', 'Évangélisation')->first();

        $membres = [
            [
                'nom' => 'Kabila',
                'prenom' => 'Grace',
                'sexe' => 'femme',
                'date_naissance' => '1994-08-18',
                'telephone' => '243810000001',
                'email' => 'grace.kabila@atci.local',
                'adresse' => 'Gombe, Kinshasa',
                'departement_id' => $jeunesse->id,
                'comite_id' => $media?->id,
                'est_converti' => true,
                'date_conversion' => '2015-06-21',
                'est_baptise' => true,
                'date_bapteme' => '2016-01-10',
                'situation_matrimoniale' => 'celibataire',
                'profession' => 'Ingénieure réseau',
                'fonction_eglise' => 'Responsable média',
                'niveau_etude' => 'Licence',
                'contact_urgence_nom' => 'Sarah Kabila',
                'contact_urgence_telephone' => '243810009999',
                'statut' => 'actif',
                'date_inscription' => '2016-02-01',
                'observations' => 'Assidue aux répétitions.',
            ],
            [
                'nom' => 'Mwamba',
                'prenom' => 'David',
                'sexe' => 'homme',
                'date_naissance' => '1989-04-04',
                'telephone' => '243810000002',
                'email' => 'david.mwamba@atci.local',
                'adresse' => 'Limete, Kinshasa',
                'departement_id' => $intercession->id,
                'comite_id' => $evangelisation?->id,
                'est_converti' => true,
                'date_conversion' => '2012-03-15',
                'est_baptise' => true,
                'date_bapteme' => '2012-08-12',
                'situation_matrimoniale' => 'marie',
                'profession' => 'Comptable',
                'fonction_eglise' => 'Ancien',
                'niveau_etude' => 'Master',
                'contact_urgence_nom' => 'Ruth Mwamba',
                'contact_urgence_telephone' => '243810008888',
                'statut' => 'actif',
                'date_inscription' => '2012-09-01',
                'observations' => null,
            ],
        ];

        foreach ($membres as $membre) {
            Membre::query()->updateOrCreate(
                ['telephone' => $membre['telephone']],
                $membre
            );
        }

        $visiteurs = [
            [
                'nom' => 'Ilunga',
                'prenom' => 'Patrick',
                'sexe' => 'homme',
                'telephone' => '243810000101',
                'motif_visite' => 'Invitation par un ami',
                'date_visite' => '2026-04-06',
                'invite_par' => 'David Mwamba',
                'adresse' => 'Bandalungwa, Kinshasa',
                'commentaire' => 'Souhaite rejoindre la cellule de prière.',
            ],
            [
                'nom' => 'Mbuyi',
                'prenom' => 'Naomie',
                'sexe' => 'femme',
                'telephone' => '243810000102',
                'motif_visite' => 'Découverte de l\'église',
                'date_visite' => '2026-04-13',
                'invite_par' => 'Grace Kabila',
                'adresse' => 'Ngaliema, Kinshasa',
                'commentaire' => null,
            ],
        ];

        foreach ($visiteurs as $visiteur) {
            Visiteur::query()->updateOrCreate(
                [
                    'nom' => $visiteur['nom'],
                    'prenom' => $visiteur['prenom'],
                    'date_visite' => $visiteur['date_visite'],
                ],
                $visiteur
            );
        }
    }
}
