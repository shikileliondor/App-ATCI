<?php

use App\Http\Controllers\ComiteController;
use App\Http\Controllers\DepartementController;
use App\Http\Controllers\MembreController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\SettingsController;
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

    Route::get('/documents', fn () => Inertia::render('Documents/Index'))->name('documents.index');
    Route::get('/documents/create', fn () => Inertia::render('Documents/Create'))->name('documents.create');
    Route::get('/documents/{id}', fn () => Inertia::render('Documents/Show'))->name('documents.show');
    Route::get('/documents/{id}/edit', fn () => Inertia::render('Documents/Edit'))->name('documents.edit');

    Route::get('/cultes', fn () => Inertia::render('Cultes/Index'))->name('cultes.index');
    Route::get('/cultes/create', fn () => Inertia::render('Cultes/Create'))->name('cultes.create');
    Route::get('/cultes/{id}', fn () => Inertia::render('Cultes/Show'))->name('cultes.show');
    Route::get('/cultes/{id}/edit', fn () => Inertia::render('Cultes/Edit'))->name('cultes.edit');

    Route::get('/programmes', fn () => Inertia::render('Programmes/Index'))->name('programmes.index');
    Route::get('/programmes/create', fn () => Inertia::render('Programmes/Create'))->name('programmes.create');
    Route::get('/programmes/{id}', fn () => Inertia::render('Programmes/Show'))->name('programmes.show');
    Route::get('/programmes/{id}/edit', fn () => Inertia::render('Programmes/Edit'))->name('programmes.edit');

    Route::get('/comptabilite', fn () => Inertia::render('Comptabilite/Index'))->name('comptabilite.index');
    Route::get('/comptabilite/create', fn () => Inertia::render('Comptabilite/Create'))->name('comptabilite.create');
    Route::get('/comptabilite/{id}', fn () => Inertia::render('Comptabilite/Show'))->name('comptabilite.show');
    Route::get('/comptabilite/{id}/edit', fn () => Inertia::render('Comptabilite/Edit'))->name('comptabilite.edit');
    Route::redirect('/transactions', '/comptabilite')->name('transactions.index');
    Route::redirect('/rapport-comptabilite', '/comptabilite')->name('comptabilite.rapport');

    Route::get('/settings', [SettingsController::class, 'index'])->name('settings.index');
    Route::post('/settings/general', [SettingsController::class, 'updateGeneral'])->name('settings.general');
    Route::post('/settings/financial', [SettingsController::class, 'updateFinancial'])->name('settings.financial');
    Route::post('/settings/statistics', [SettingsController::class, 'updateStatistics'])->name('settings.statistics');
    Route::post('/settings/notifications', [SettingsController::class, 'updateNotifications'])->name('settings.notifications');
    Route::post('/settings/security', [SettingsController::class, 'updateSecurity'])->name('settings.security');
    Route::post('/settings/appearance', [SettingsController::class, 'updateAppearance'])->name('settings.appearance');
    Route::post('/settings/pdf', [SettingsController::class, 'updatePdf'])->name('settings.pdf');

    Route::post('/settings/users', [SettingsController::class, 'storeUser'])->name('settings.users.store');
    Route::put('/settings/users/{user}', [SettingsController::class, 'updateUser'])->name('settings.users.update');
    Route::delete('/settings/users/{user}', [SettingsController::class, 'destroyUser'])->name('settings.users.destroy');

    Route::post('/settings/event-types', [SettingsController::class, 'storeEventType'])->name('settings.event-types.store');
    Route::put('/settings/event-types/{eventType}', [SettingsController::class, 'updateEventType'])->name('settings.event-types.update');
    Route::delete('/settings/event-types/{eventType}', [SettingsController::class, 'destroyEventType'])->name('settings.event-types.destroy');

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
