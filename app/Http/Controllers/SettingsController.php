<?php

namespace App\Http\Controllers;

use App\Models\AppSetting;
use App\Models\Comite;
use App\Models\Departement;
use App\Models\EventType;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class SettingsController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Settings/Index', [
            'general' => AppSetting::getValue('general', [
                'church_name' => '',
                'email' => '',
                'phone' => '',
                'address' => '',
                'logo_path' => null,
            ]),
            'financial' => AppSetting::getValue('financial', [
                'offerings' => ['Dîme', 'Offrande spéciale'],
                'payment_methods' => ['Espèces', 'Mobile money', 'Virement'],
                'currency' => 'XOF',
            ]),
            'statistics' => AppSetting::getValue('statistics', [
                'presence' => true,
                'revenues' => true,
                'new_members' => true,
                'visitors' => true,
            ]),
            'notifications' => AppSetting::getValue('notifications', [
                'email' => true,
                'sms' => false,
                'in_app' => true,
            ]),
            'security' => AppSetting::getValue('security', [
                'min_password_length' => 8,
                'require_special_char' => true,
                'force_password_rotation' => false,
                'two_factor' => false,
            ]),
            'appearance' => AppSetting::getValue('appearance', [
                'theme' => 'light',
                'primary_color' => '#1a56a0',
            ]),
            'pdf' => AppSetting::getValue('pdf', [
                'show_logo' => true,
                'show_church_name' => true,
                'document_title' => 'Fiche de membre',
            ]),
            'users' => User::query()->select('id', 'name', 'email', 'role', 'created_at')->orderBy('name')->get(),
            'departements' => Departement::query()->select('id', 'nom', 'description', 'statut')->orderBy('nom')->get(),
            'comites' => Comite::query()->select('id', 'nom', 'description', 'statut')->orderBy('nom')->get(),
            'eventTypes' => EventType::query()->orderBy('name')->get(),
            'roles' => ['admin', 'secretaire', 'pasteur', 'tresorier', 'responsable'],
        ]);
    }

    public function updateGeneral(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'church_name' => ['required', 'string', 'max:255'],
            'email' => ['nullable', 'email', 'max:255'],
            'phone' => ['nullable', 'string', 'max:50'],
            'address' => ['nullable', 'string', 'max:1000'],
            'logo' => ['nullable', 'image', 'max:2048'],
            'remove_logo' => ['nullable', 'boolean'],
        ]);

        $current = AppSetting::getValue('general');

        if ($request->boolean('remove_logo')) {
            $current['logo_path'] = null;
        }

        if ($request->hasFile('logo')) {
            $current['logo_path'] = $request->file('logo')->store('settings', 'public');
        }

        AppSetting::putValue('general', [
            'church_name' => $validated['church_name'],
            'email' => $validated['email'] ?? '',
            'phone' => $validated['phone'] ?? '',
            'address' => $validated['address'] ?? '',
            'logo_path' => $current['logo_path'] ?? null,
        ]);

        return back()->with('success', 'Informations générales mises à jour.');
    }

    public function updateFinancial(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'offerings' => ['array'],
            'offerings.*' => ['string', 'max:100'],
            'payment_methods' => ['array'],
            'payment_methods.*' => ['string', 'max:100'],
            'currency' => ['required', 'string', 'max:10'],
        ]);

        AppSetting::putValue('financial', [
            'offerings' => array_values(array_filter($validated['offerings'] ?? [])),
            'payment_methods' => array_values(array_filter($validated['payment_methods'] ?? [])),
            'currency' => $validated['currency'],
        ]);

        return back()->with('success', 'Paramètres financiers enregistrés.');
    }

    public function updateStatistics(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'presence' => ['required', 'boolean'],
            'revenues' => ['required', 'boolean'],
            'new_members' => ['required', 'boolean'],
            'visitors' => ['required', 'boolean'],
        ]);

        AppSetting::putValue('statistics', $validated);

        return back()->with('success', 'Préférences statistiques enregistrées.');
    }

    public function updateNotifications(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'email' => ['required', 'boolean'],
            'sms' => ['required', 'boolean'],
            'in_app' => ['required', 'boolean'],
        ]);

        AppSetting::putValue('notifications', $validated);

        return back()->with('success', 'Notifications mises à jour.');
    }

    public function updateSecurity(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'min_password_length' => ['required', 'integer', 'min:6', 'max:64'],
            'require_special_char' => ['required', 'boolean'],
            'force_password_rotation' => ['required', 'boolean'],
            'two_factor' => ['required', 'boolean'],
        ]);

        AppSetting::putValue('security', $validated);

        return back()->with('success', 'Règles de sécurité enregistrées.');
    }

    public function updateAppearance(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'theme' => ['required', Rule::in(['light', 'dark'])],
            'primary_color' => ['required', 'regex:/^#[a-fA-F0-9]{6}$/'],
        ]);

        AppSetting::putValue('appearance', $validated);

        return back()->with('success', 'Apparence enregistrée.');
    }

    public function updatePdf(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'show_logo' => ['required', 'boolean'],
            'show_church_name' => ['required', 'boolean'],
            'document_title' => ['required', 'string', 'max:255'],
        ]);

        AppSetting::putValue('pdf', $validated);

        return back()->with('success', 'Paramètres PDF enregistrés.');
    }

    public function storeUser(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'role' => ['required', 'string', 'max:50'],
            'password' => ['required', 'string', 'min:8'],
        ]);

        User::query()->create([
            ...$validated,
            'password' => Hash::make($validated['password']),
        ]);

        return back()->with('success', 'Utilisateur ajouté.');
    }

    public function updateUser(Request $request, User $user): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', Rule::unique('users', 'email')->ignore($user->id)],
            'role' => ['required', 'string', 'max:50'],
            'password' => ['nullable', 'string', 'min:8'],
        ]);

        $user->fill([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'role' => $validated['role'],
        ]);

        if (! empty($validated['password'])) {
            $user->password = Hash::make($validated['password']);
        }

        $user->save();

        return back()->with('success', 'Utilisateur modifié.');
    }

    public function destroyUser(User $user): RedirectResponse
    {
        if (auth()->id() === $user->id) {
            return back()->with('error', 'Vous ne pouvez pas supprimer votre propre compte.');
        }

        $user->delete();

        return back()->with('success', 'Utilisateur supprimé.');
    }

    public function storeEventType(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:255'],
            'is_active' => ['required', 'boolean'],
        ]);

        EventType::query()->create($validated);

        return back()->with('success', 'Type d\'événement ajouté.');
    }

    public function updateEventType(Request $request, EventType $eventType): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:255'],
            'is_active' => ['required', 'boolean'],
        ]);

        $eventType->update($validated);

        return back()->with('success', 'Type d\'événement modifié.');
    }

    public function destroyEventType(EventType $eventType): RedirectResponse
    {
        $eventType->delete();

        return back()->with('success', 'Type d\'événement supprimé.');
    }
}
