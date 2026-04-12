<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\ComiteStoreRequest;
use App\Http\Requests\ComiteUpdateRequest;
use App\Models\Comite;
use App\Models\Departement;
use App\Services\ComiteService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;

class ComiteController extends Controller
{
    public function __construct(private readonly ComiteService $comiteService)
    {
    }

    public function index(Request $request): InertiaResponse
    {
        $filters = $request->only(['search', 'statut']);

        return Inertia::render('Comites/Index', [
            'comites' => $this->comiteService->paginate($filters),
            'filters' => $filters,
        ]);
    }

    public function create(): InertiaResponse
    {
        return Inertia::render('Comites/Create', [
            'departements' => Departement::query()->select('id', 'nom')->orderBy('nom')->get(),
        ]);
    }

    public function store(ComiteStoreRequest $request): JsonResponse|RedirectResponse
    {
        $comite = $this->comiteService->create($request->validated());

        if (! $request->expectsJson() && ! $request->is('api/*')) {
            return redirect()->route('comites.index')->with('success', 'Comité créé avec succès.');
        }

        return response()->json(['data' => $comite, 'message' => 'Comité créé avec succès.'], 201);
    }

    public function show(Request $request, Comite $comite): JsonResponse|InertiaResponse
    {
        if (! $request->expectsJson() && ! $request->is('api/*')) {
            return Inertia::render('Comites/Show', [
                'comite' => $comite->load('departement:id,nom'),
            ]);
        }

        return response()->json(['data' => $comite->load('departement:id,nom'), 'message' => 'Comité récupéré avec succès.']);
    }

    public function edit(Comite $comite): InertiaResponse
    {
        return Inertia::render('Comites/Edit', [
            'comite' => $comite,
            'departements' => Departement::query()->select('id', 'nom')->orderBy('nom')->get(),
        ]);
    }

    public function update(ComiteUpdateRequest $request, Comite $comite): JsonResponse|RedirectResponse
    {
        $updatedComite = $this->comiteService->update($comite, $request->validated());

        if (! $request->expectsJson() && ! $request->is('api/*')) {
            return redirect()->route('comites.index')->with('success', 'Comité mis à jour avec succès.');
        }

        return response()->json(['data' => $updatedComite, 'message' => 'Comité mis à jour avec succès.']);
    }

    public function destroy(Request $request, Comite $comite): JsonResponse|RedirectResponse
    {
        $this->comiteService->delete($comite);

        if (! $request->expectsJson() && ! $request->is('api/*')) {
            return redirect()->route('comites.index')->with('success', 'Comité supprimé avec succès.');
        }

        return response()->json(['message' => 'Comité supprimé avec succès.']);
    }
}
