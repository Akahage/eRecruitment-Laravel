<?php

use App\Enums\UserRole;
use App\Http\Controllers\VacanciesController;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use App\Models\Vacancies;

Route::get('/', [VacanciesController::class, 'index'])->name('home');

// Redirect based on role
Route::middleware(['auth', 'verified'])->get('/redirect', function () {
    return Auth::user()->role === UserRole::HR
    ? redirect()->route('admin.dashboard')
    : redirect()->route('user.info');
})->name('dashboard');

// Job Detail Routes
Route::get('/jobs/{id}', [VacanciesController::class, 'show'])->name('jobs.show');
Route::post('/jobs/{id}/apply', [VacanciesController::class, 'apply'])
    ->middleware(['auth', 'verified'])
    ->name('jobs.apply');

// Detail Pekerjaan Routes
Route::get('/detail-pekerjaan/{id}', [VacanciesController::class, 'show'])->name('detail.pekerjaan.show');
Route::post('/detail-pekerjaan/{id}/apply', [VacanciesController::class, 'apply'])
    ->middleware(['auth', 'verified'])
    ->name('detail.pekerjaan.apply');

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
require __DIR__.'/candidate.php';
require __DIR__.'/admin.php';
