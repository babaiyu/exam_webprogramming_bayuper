<?php

use App\Http\Controllers\Web\WebController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

// Auth
Route::get('/', [WebController::class, 'showHome']);
Route::get('/login', [WebController::class, 'showLogin']);

Route::get('/dashboard', [WebController::class, 'showDashboard']);
// Barang
Route::get('/products', [WebController::class, 'showProducts']);
Route::get('/products/add', [WebController::class, 'showProductAdd']);
Route::get('/products/{id}', [WebController::class, 'showProductById']);

// Nomor Seri
Route::get('/nomor-seri/{product_id}/add', [WebController::class, 'showNomorSeriAdd']);
Route::get('/nomor-seri/{product_id}/{id}', [WebController::class, 'showNomorSeriId']);

// Transaksi
Route::get('/transactions', [WebController::class, 'showTransactions']);
Route::get('/transactions/add', [WebController::class, 'showTransactionAdd']);
Route::get('/transactions/{id}', [WebController::class, 'showTransactionId']);

// Report
Route::get('/report', [WebController::class, 'showReport']);
