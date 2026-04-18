<?php

namespace App\Http\Controllers;

use App\Models\Comite;
use App\Models\CommunicationMessage;
use App\Models\CommunicationTemplate;
use App\Models\Departement;
use App\Models\Membre;
use App\Services\SmsGateway;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Inertia\Inertia;
use Inertia\Response;
use Throwable;

class CommunicationController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Communication/Index', [
            'departements' => Departement::query()->select('id', 'nom')->orderBy('nom')->get(),
            'comites' => Comite::query()->select('id', 'nom')->orderBy('nom')->get(),
            'membres' => Membre::query()
                ->select('id', 'nom', 'prenom', 'telephone', 'departement_id', 'comite_id')
                ->orderBy('nom')
                ->orderBy('prenom')
                ->get(),
            'templates' => CommunicationTemplate::query()->latest()->get(),
            'history' => CommunicationMessage::query()->latest('sent_at')->latest()->take(15)->get(),
        ]);
    }

    public function storeTemplate(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:120'],
            'content' => ['required', 'string', 'max:2000'],
        ]);

        CommunicationTemplate::query()->create($validated);

        return back()->with('success', 'Template créé avec succès.');
    }

    public function updateTemplate(Request $request, CommunicationTemplate $template): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:120'],
            'content' => ['required', 'string', 'max:2000'],
        ]);

        $template->update($validated);

        return back()->with('success', 'Template modifié avec succès.');
    }

    public function destroyTemplate(CommunicationTemplate $template): RedirectResponse
    {
        $template->delete();

        return back()->with('success', 'Template supprimé.');
    }

    public function send(Request $request, SmsGateway $smsGateway): RedirectResponse
    {
        $validated = $request->validate([
            'recipient_mode' => ['required', 'in:all,departement,comite,custom'],
            'departement_id' => ['nullable', 'integer', 'exists:departements,id'],
            'comite_id' => ['nullable', 'integer', 'exists:comites,id'],
            'selected_member_ids' => ['array'],
            'selected_member_ids.*' => ['integer', 'exists:membres,id'],
            'template_id' => ['nullable', 'integer', 'exists:communication_templates,id'],
            'message' => ['required', 'string', 'max:2000'],
        ]);

        $members = $this->resolveRecipients($validated);

        if ($members->isEmpty()) {
            return back()->with('error', 'Aucun destinataire trouvé pour ce filtre.');
        }

        $phones = $members->pluck('telephone')->filter(fn ($value) => filled($value))->unique()->values();

        if ($phones->isEmpty()) {
            return back()->with('error', 'Aucun numéro de téléphone valide trouvé.');
        }

        $failures = [];

        foreach ($phones as $phone) {
            try {
                $smsGateway->send((string) $phone, $validated['message']);
            } catch (Throwable $exception) {
                $failures[] = [
                    'phone' => $phone,
                    'error' => $exception->getMessage(),
                ];
            }
        }

        $hasFailure = ! empty($failures);

        CommunicationMessage::query()->create([
            'content' => $validated['message'],
            'recipient_count' => $phones->count(),
            'status' => $hasFailure ? 'partiel' : 'envoye',
            'recipient_type' => $validated['recipient_mode'],
            'channel' => 'sms',
            'sent_at' => now(),
            'error_details' => $hasFailure ? json_encode($failures, JSON_UNESCAPED_UNICODE) : null,
        ]);

        return back()->with(
            $hasFailure ? 'error' : 'success',
            $hasFailure
                ? 'Message envoyé partiellement. Vérifiez les erreurs de passerelle SMS.'
                : 'Message envoyé avec succès.'
        );
    }

    private function resolveRecipients(array $validated): Collection
    {
        $baseQuery = Membre::query()->select('id', 'telephone');

        $members = match ($validated['recipient_mode']) {
            'all' => $baseQuery->get(),
            'departement' => $baseQuery->where('departement_id', $validated['departement_id'] ?? 0)->get(),
            'comite' => $baseQuery->where('comite_id', $validated['comite_id'] ?? 0)->get(),
            'custom' => $baseQuery->get(),
        };

        if (array_key_exists('selected_member_ids', $validated)) {
            $selectedMemberIds = collect($validated['selected_member_ids'] ?? [])->map(fn ($id) => (int) $id)->all();

            return $members->whereIn('id', $selectedMemberIds)->values();
        }

        return $members;
    }
}
