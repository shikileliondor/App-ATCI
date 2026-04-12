<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\DepartementStoreRequest;
use App\Http\Requests\DepartementUpdateRequest;
use App\Models\Departement;
use App\Services\DepartementService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;

class DepartementController extends Controller
{
    public function __construct(private readonly DepartementService $departementService)
    {
    }

    public function index(Request $request): InertiaResponse
    {
        $filters = $request->only(['search', 'statut']);

        return Inertia::render('Departements/Index', [
            'departements' => $this->departementService->paginate($filters),
            'filters' => $filters,
        ]);
    }

    public function create(): InertiaResponse
    {
        return Inertia::render('Departements/Create');
    }

    public function store(DepartementStoreRequest $request): JsonResponse|RedirectResponse
    {
        $departement = $this->departementService->create($request->validated());

        if (! $request->expectsJson() && ! $request->is('api/*')) {
            return redirect()->route('departements.index')->with('success', 'Département créé avec succès.');
        }

        return response()->json(['data' => $departement, 'message' => 'Département créé avec succès.'], 201);
    }

    public function show(Request $request, Departement $departement): JsonResponse|InertiaResponse
    {
        if (! $request->expectsJson() && ! $request->is('api/*')) {
            return Inertia::render('Departements/Show', [
                'departement' => $departement->loadCount('comites'),
            ]);
        }

        return response()->json(['data' => $departement->loadCount('comites'), 'message' => 'Département récupéré avec succès.']);
    }

    public function edit(Departement $departement): InertiaResponse
    {
        return Inertia::render('Departements/Edit', [
            'departement' => $departement,
        ]);
    }

    public function update(DepartementUpdateRequest $request, Departement $departement): JsonResponse|RedirectResponse
    {
        $updatedDepartement = $this->departementService->update($departement, $request->validated());

        if (! $request->expectsJson() && ! $request->is('api/*')) {
            return redirect()->route('departements.index')->with('success', 'Département mis à jour avec succès.');
        }

        return response()->json(['data' => $updatedDepartement, 'message' => 'Département mis à jour avec succès.']);
    }

    public function destroy(Request $request, Departement $departement): JsonResponse|RedirectResponse
    {
        $this->departementService->delete($departement);

        if (! $request->expectsJson() && ! $request->is('api/*')) {
            return redirect()->route('departements.index')->with('success', 'Département supprimé avec succès.');
        }

        return response()->json(['message' => 'Département supprimé avec succès.']);
    }
}
