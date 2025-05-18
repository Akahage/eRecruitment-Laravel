<?php

use App\Enums\UserRole;
use App\Http\Controllers\VacanciesController;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', [VacanciesController::class, 'index'])->name('home');

// Redirect based on role
Route::middleware(['auth', 'verified'])->get('/redirect', function () {
    return Auth::user()->role === UserRole::HR
        ? redirect()->route('admin.dashboard')
        : redirect()->route('user.info');
})->name('dashboard');

Route::get('/candidate-status', function () {
    return Inertia::render('candidate/profile/user/candidate-status');
});

Route::get('/nav-user', function () {
    return Inertia::render('components/ui/nav-user');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
require __DIR__.'/candidate.php';
require __DIR__.'/admin.php';
