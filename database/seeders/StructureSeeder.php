<?php

namespace Database\Seeders;

use App\Models\Comite;
use App\Models\Departement;
use Illuminate\Database\Seeder;

class StructureSeeder extends Seeder
{
    public function run(): void
    {
        $departements = collect([
            ['nom' => 'Jeunesse', 'description' => 'Encadrement des jeunes', 'statut' => 'actif'],
            ['nom' => 'Intercession', 'description' => 'Prière et soutien spirituel', 'statut' => 'actif'],
            ['nom' => 'Accueil', 'description' => 'Accueil et orientation des visiteurs', 'statut' => 'actif'],
        ])->mapWithKeys(function (array $data) {
            $departement = Departement::query()->updateOrCreate(
                ['nom' => $data['nom']],
                $data
            );

            return [$departement->nom => $departement];
        });

        $comitesData = [
            ['nom' => 'Média', 'description' => 'Sonorisation et diffusion', 'statut' => 'actif', 'departement' => 'Jeunesse'],
            ['nom' => 'Protocole', 'description' => 'Organisation des cultes', 'statut' => 'actif', 'departement' => 'Accueil'],
            ['nom' => 'Évangélisation', 'description' => 'Sorties missionnaires', 'statut' => 'actif', 'departement' => 'Intercession'],
        ];

        foreach ($comitesData as $comiteData) {
            $comite = Comite::query()->updateOrCreate(
                ['nom' => $comiteData['nom']],
                [
                    'nom' => $comiteData['nom'],
                    'description' => $comiteData['description'],
                    'statut' => $comiteData['statut'],
                ]
            );

            $comite->departement_id = $departements[$comiteData['departement']]->id;
            $comite->save();
        }
    }
}
