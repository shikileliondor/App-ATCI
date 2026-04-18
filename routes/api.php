<?php

declare(strict_types=1);

use App\Http\Controllers\ComptabiliteController;
use App\Http\Controllers\CulteController;
use App\Http\Controllers\DocumentController;
use App\Http\Controllers\MembreController;
use App\Http\Controllers\ProgrammeController;
use App\Http\Controllers\ProgrammeParticipantController;
use App\Http\Controllers\ProgrammePresenceController;
use App\Http\Controllers\VisiteurController;
use Illuminate\Support\Facades\Route;

Route::apiResource('membres', MembreController::class);
Route::apiResource('visiteurs', VisiteurController::class);
Route::apiResource('comptabilites', ComptabiliteController::class);
Route::apiResource('documents', DocumentController::class);
Route::apiResource('cultes', CulteController::class);

Route::apiResource('programmes', ProgrammeController::class);
Route::post('programmes/{programme}/presences', [ProgrammePresenceController::class, 'store']);
Route::put('programmes/{programme}/presences/{presence}', [ProgrammePresenceController::class, 'update']);
Route::delete('programmes/{programme}/presences/{presence}', [ProgrammePresenceController::class, 'destroy']);

Route::put('programmes/{programme}/participants/settings', [ProgrammeParticipantController::class, 'updateSettings']);
Route::post('programmes/{programme}/participants', [ProgrammeParticipantController::class, 'store']);
Route::delete('programmes/{programme}/participants/{participant}', [ProgrammeParticipantController::class, 'destroy']);
