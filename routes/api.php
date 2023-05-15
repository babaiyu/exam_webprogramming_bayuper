<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\BarangController;
use App\Http\Controllers\Api\NomorSeriController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
//     return $request->user();
// });

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout']);

// Route::middleware('auth:api')->get('/user', [AuthController::class, 'getUser']);
// Route::middleware('auth:api')
Route::middleware('auth:api')->group(function () {
  Route::get('/user', [AuthController::class, 'getUser']);

  // CRUD Barang
  Route::get('/barangs', [BarangController::class, 'getBarang']);
  Route::post('/barang', [BarangController::class, 'insertBarang']);
  Route::patch('/barang/{id}', [BarangController::class, 'updateBarang']);
  Route::delete('/barang/{id}', [BarangController::class, 'deleteBarang']);

  // CRUD Nomor Seri
  Route::get('/nomor-seris', [NomorSeriController::class, 'getNomorSeri']);
  Route::post('/nomor-seri', [NomorSeriController::class, 'insertNomorSeri']);
  Route::patch('/nomor-seri/{id}', [NomorSeriController::class, 'updateNomorSeri']);
  Route::delete('/nomor-seri/{id}', [NomorSeriController::class, 'deleteNomorSeri']);
});
