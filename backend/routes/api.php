<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Api\AuthorsController;
use App\Http\Controllers\Api\BooksController;
use App\Http\Controllers\Api\BorrowingsController;
use App\Http\Controllers\Api\CategoriesController;
use App\Http\Controllers\Api\FinesController;
use App\Http\Controllers\Api\MembersController;
use App\Http\Controllers\Api\NotificationsController;
use App\Http\Controllers\Api\ProfileController;
use App\Http\Controllers\Api\ReportsController;
use App\Http\Controllers\Api\ReservationsController;
use App\Http\Controllers\Api\SettingsController;

Route::get('/health', fn () => ['ok' => true]);

Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login', [AuthController::class, 'login']);
Route::post('/auth/forgot-password', [AuthController::class, 'forgotPassword']);
Route::post('/auth/reset-password', [AuthController::class, 'resetPassword']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me', fn () => ['user' => request()->user()]);
    Route::post('/auth/logout', [AuthController::class, 'logout']);

    Route::get('/categories', [CategoriesController::class, 'index']);
    Route::get('/authors', [AuthorsController::class, 'index']);

    Route::get('/books', [BooksController::class, 'index']);
    Route::get('/books/{book}', [BooksController::class, 'show']);

    Route::get('/borrowings', [BorrowingsController::class, 'index']);
    Route::post('/reservations', [ReservationsController::class, 'store']);
    Route::get('/reservations', [ReservationsController::class, 'index']);
    Route::post('/reservations/{reservation}/cancel', [ReservationsController::class, 'cancel']);

    Route::get('/fines', [FinesController::class, 'index']);
    Route::get('/notifications', [NotificationsController::class, 'index']);
    Route::post('/notifications/{notification}/read', [NotificationsController::class, 'markRead']);

    Route::put('/profile', [ProfileController::class, 'update']);
    Route::put('/settings', [SettingsController::class, 'update']);

    Route::get('/reports/overview', [ReportsController::class, 'overview'])->middleware('role:admin,librarian');

    Route::post('/borrowings/borrow', [BorrowingsController::class, 'borrow'])->middleware('role:admin,librarian');
    Route::post('/borrowings/{borrowing}/return', [BorrowingsController::class, 'return']);

    Route::post('/fines/{fine}/pay', [FinesController::class, 'pay'])->middleware('role:admin,librarian');

    Route::get('/members', [MembersController::class, 'index'])->middleware('role:admin,librarian');
    Route::post('/members', [MembersController::class, 'store'])->middleware('role:admin,librarian');
    Route::put('/members/{member}', [MembersController::class, 'update'])->middleware('role:admin,librarian');
    Route::delete('/members/{member}', [MembersController::class, 'destroy'])->middleware('role:admin,librarian');

    Route::post('/categories', [CategoriesController::class, 'store'])->middleware('role:admin,librarian');
    Route::put('/categories/{category}', [CategoriesController::class, 'update'])->middleware('role:admin,librarian');
    Route::delete('/categories/{category}', [CategoriesController::class, 'destroy'])->middleware('role:admin,librarian');

    Route::post('/authors', [AuthorsController::class, 'store'])->middleware('role:admin,librarian');
    Route::put('/authors/{author}', [AuthorsController::class, 'update'])->middleware('role:admin,librarian');
    Route::delete('/authors/{author}', [AuthorsController::class, 'destroy'])->middleware('role:admin,librarian');

    Route::post('/books', [BooksController::class, 'store'])->middleware('role:admin,librarian');
    Route::put('/books/{book}', [BooksController::class, 'update'])->middleware('role:admin,librarian');
    Route::delete('/books/{book}', [BooksController::class, 'destroy'])->middleware('role:admin,librarian');
    Route::post('/books/{book}/cover', [BooksController::class, 'uploadCover'])->middleware('role:admin,librarian');
});

