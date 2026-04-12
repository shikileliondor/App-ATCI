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
    Routhttps://github.com/shikileliondor/App-ATCI/pull/15/conflict?name=routes%252Fweb.php&ancestor_oid=b21a76ab3cf8e63d84bb9aa6725e1d3922425188&base_oid=57f04490886950319f8af103d669a3b3af0ba5ef&head_oid=0e7a0c83c7124a959d610e505c80794349c92533e::resource('departements', DepartementController::class);
    Route::resource('comites', ComiteController::class);

    Route::get('/documents', fn () => Inertia::render('Documents/Index'))->name('documents.index');
    Route::get('/documents/create', fn () => Inertia::render('Documents/Create'))->name('documents.create');
    Route::get('/documents/{id}', fn () => Inertia::render('Documents/Show'))->name('documents.show');
    Route::get('/documents/{id}/edit', fn () => Inertia::render('Documents/Edit'))->name('documents.edit');

    Route::get('/cultes', fn () => Inertia::render('Cultes/Index'))->name('cultes.index');
    Route::get('/cultes/create', fn () => Inertia::render('Cultes/Create'))->name('cultes.create');
    Route::get('/cultes/{id}', fn () => Inertia::render('Cultes/Show'))->name('cultes.show');
    Route::get('/cultes/{id}/edit', fn () => Inertia::render('Cultes/Edit'))->name('cultes.edit');

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
