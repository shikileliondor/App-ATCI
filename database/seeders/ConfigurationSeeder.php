<?php

namespace Database\Seeders;

use App\Models\AppSetting;
use App\Models\CommunicationTemplate;
use App\Models\EventType;
use Illuminate\Database\Seeder;

class ConfigurationSeeder extends Seeder
{
    public function run(): void
    {
        $eventTypes = [
            ['name' => 'Culte dominical', 'description' => 'Culte principal du dimanche', 'is_active' => true],
            ['name' => 'Veillée de prière', 'description' => 'Programme de prière nocturne', 'is_active' => true],
            ['name' => 'Séminaire', 'description' => 'Formation thématique', 'is_active' => true],
        ];

        foreach ($eventTypes as $eventType) {
            EventType::query()->updateOrCreate(
                ['name' => $eventType['name']],
                $eventType
            );
        }

        $settings = [
            'church_profile' => [
                'name' => 'Assemblée Temple de Christ International',
                'city' => 'Kinshasa',
                'country' => 'RDC',
            ],
            'communication_defaults' => [
                'channel' => 'sms',
                'sender' => 'ATCI',
            ],
        ];

        foreach ($settings as $key => $value) {
            AppSetting::query()->updateOrCreate(
                ['key' => $key],
                ['value' => $value]
            );
        }

        $templates = [
            ['name' => 'Rappel culte', 'content' => 'Shalom, nous vous rappelons le culte de ce dimanche à 9h.'],
            ['name' => 'Invitation programme', 'content' => 'Vous êtes cordialement invité(e) à notre programme spécial de prière.'],
        ];

        foreach ($templates as $template) {
            CommunicationTemplate::query()->updateOrCreate(
                ['name' => $template['name']],
                $template
            );
        }
    }
}
