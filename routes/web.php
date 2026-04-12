<?php

use App\Http\Controllers\ComiteController;
use App\Http\Controllers\DepartementController;
use App\Http\Controllers\MembreController;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth'])->name('dashboard');


Route::middleware('auth')->group(function () {
    Route::resource('membres', MembreController::class)->except(['show']);
    Route::resource('departements', DepartementController::class);
    Route::resource('comites', ComiteController::class);


    Route::get('/visiteurs', fn () => Inertia::render('Visiteurs/Index'))->name('visiteurs.index');
    Route::get('/visiteurs/create', fn () => Inertia::render('Visiteurs/Create'))->name('visiteurs.create');
    Route::get('/visiteurs/{id}', fn (string $id) => Inertia::render('Visiteurs/Show', ['id' => $id]))->name('visiteurs.show');
    Route::get('/visiteurs/{id}/edit', fn (string $id) => Inertia::render('Visiteurs/Edit', ['id' => $id]))->name('visiteurs.edit');

    Route::get('/comptabilite', fn () => Inertia::render('Comptabilite/Index'))->name('comptabilite.index');
    Route::get('/comptabilite/create', fn () => Inertia::render('Comptabilite/Create'))->name('comptabilite.create');
    Route::get('/comptabilite/{id}', fn (string $id) => Inertia::render('Comptabilite/Show', ['id' => $id]))->name('comptabilite.show');
    Route::get('/comptabilite/{id}/edit', fn (string $id) => Inertia::render('Comptabilite/Edit', ['id' => $id]))->name('comptabilite.edit');

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
