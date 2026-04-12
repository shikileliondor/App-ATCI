<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\MembreStoreRequest;
use App\Http\Requests\MembreUpdateRequest;
use App\Models\Comite;
use App\Models\Departement;
use App\Models\Membre;
use App\Services\MembreService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;

class MembreController extends Controller
{
    public function __construct(private readonly MembreService $membreService)
    {
    }

    public function index(): InertiaResponse
    {
        return Inertia::render('Membres/Index', [
            'membres' => $this->membreService->paginate(),
        ]);
    }

    public function create(): InertiaResponse
    {
        return Inertia::render('Membres/Create', [
            'departements' => Departement::query()->select('id', 'nom')->orderBy('nom')->get(),
            'comites' => Comite::query()->select('id', 'nom')->orderBy('nom')->get(),
        ]);
    }

    public function store(MembreStoreRequest $request): JsonResponse|RedirectResponse
    {
        $membre = $this->membreService->create($request->validated());

        if (! $request->expectsJson() && ! $request->is('api/*')) {
            return redirect()->route('membres.index')->with('success', 'Membre créé avec succès.');
        }

        return response()->json([
            'message' => 'Membre créé avec succès.',
            'data' => $membre,
        ], 201);
    }

    public function show(Request $request, Membre $membre): JsonResponse|RedirectResponse
    {
        if (! $request->expectsJson() && ! $request->is('api/*')) {
            return redirect()->route('membres.edit', $membre);
        }

        return response()->json([
            'message' => 'Membre récupéré avec succès.',
            'data' => $this->membreService->findOrFail($membre->id),
        ]);
    }

    public function edit(Membre $membre): InertiaResponse
    {
        return Inertia::render('Membres/Edit', [
            'membre' => $membre,
            'departements' => Departement::query()->select('id', 'nom')->orderBy('nom')->get(),
            'comites' => Comite::query()->select('id', 'nom')->orderBy('nom')->get(),
        ]);
    }

    public function update(MembreUpdateRequest $request, Membre $membre): JsonResponse|RedirectResponse
    {
        $updatedMembre = $this->membreService->update($membre, $request->validated());

        if (! $request->expectsJson() && ! $request->is('api/*')) {
            return redirect()->route('membres.index')->with('success', 'Membre mis à jour avec succès.');
        }

        return response()->json([
            'message' => 'Membre mis à jour avec succès.',
            'data' => $updatedMembre,
        ]);
    }

    public function destroy(Request $request, Membre $membre): JsonResponse|RedirectResponse
    {
        $this->membreService->delete($membre);

        if (! $request->expectsJson() && ! $request->is('api/*')) {
            return redirect()->route('membres.index')->with('success', 'Membre supprimé avec succès.');
        }

        return response()->json([
            'message' => 'Membre supprimé avec succès.',
        ]);
    }
}
