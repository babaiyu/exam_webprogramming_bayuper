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

Route::get('/', [WebController::class, 'showHome']);
Route::get('/login', [WebController::class, 'showLogin']);

Route::get('/dashboard', [WebController::class, 'showDashboard']);
Route::get('/products', [WebController::class, 'showProducts']);
Route::get('/products/add', [WebController::class, 'showProductAdd']);
Route::get('/products/{id}', [WebController::class, 'showProductById']);
Route::get('/nomor-seri/{product_id}/add', [WebController::class, 'showNomorSeriAdd']);
Route::get('/nomor-seri/{product_id}/{id}', [WebController::class, 'showNomorSeriId']);
