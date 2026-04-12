<?php

declare(strict_types=1);

use App\Http\Controllers\ComptabiliteController;
use App\Http\Controllers\CulteController;
use App\Http\Controllers\DocumentController;
use App\Http\Controllers\MembreController;
use App\Http\Controllers\ProgrammeController;
use App\Http\Controllers\VisiteurController;
use Illuminate\Support\Facades\Route;

Route::apiResource('membres', MembreController::class);
Route::apiResource('visiteurs', VisiteurController::class);
Route::apiResource('comptabilites', ComptabiliteController::class);
Route::apiResource('documents', DocumentController::class);
Route::apiResource('cultes', CulteController::class);

Route::apiResource('programmes', ProgrammeController::class);
