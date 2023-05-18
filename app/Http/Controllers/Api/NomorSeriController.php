<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class NomorSeriController extends Controller
{
    public function getNomorSeri(Request $request)
    {
        $nomorSeris = DB::table('nomor_seri')->simplePaginate(10);

        return response()->json([
            'success' => true,
            'data' => $nomorSeris,
        ]);
    }

    public function getNomorSeriByProductID(Request $request, $product_id)
    {
        $nomorSeri = DB::table('nomor_seri')->where('product_id', $product_id)->get();

        return response()->json([
            'success' => true,
            'data' => $nomorSeri,
        ]);
    }

    public function getNomorSeriById(Request $request, $id)
    {
        $nomorSeri = DB::table('nomor_seri')->where('id', $id)->first();

        return response()->json([
            'success' => true,
            'data' => $nomorSeri,
        ]);
    }

    public function getNomorSeriProductIdAndUsed(Request $request, $product_id)
    {
        $nomorSeri = DB::table('nomor_seri')
            ->where('product_id', $product_id)
            ->where('used', 0)
            ->get();

        return response()->json([
            'success' => true,
            'data' => $nomorSeri,
        ]);
    }

    public function insertNomorSeri(Request $request)
    {
        $findBarang = DB::table('barang')
            ->where('id', $request->input('product_id'))
            ->count();
        if ($findBarang <= 0) {
            return response()->json([
                'success' => false,
                'message' => 'ID Barang tidak ditemukan!',
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'product_id' => 'required',
            'serial_no' => 'required',
            'price' => 'required',
            'prod_date' => 'required',
            'warranty_start' => 'required',
            'warranty_duration' => 'required',
            'product_id' => 'required',
            'used' => 'required',
        ]);
        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $nomorSeri = DB::table('nomor_seri')->insert([
            'product_id' => $request->input('product_id'),
            'serial_no' => $request->input('serial_no'),
            'price' => $request->input('price'),
            'prod_date' => $request->input('prod_date'),
            'warranty_start' => $request->input('warranty_start'),
            'warranty_duration' => $request->input('warranty_duration'),
            'used' => $request->input('used'),
        ]);
        if ($nomorSeri) {
            return response()->json([
                'success' => true,
                'message' => 'Berhasil input nomor seri!',
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => 'Internal server error!'
        ], 500);
    }

    public function updateNomorSeri(Request $request, $id)
    {
        $getId = DB::table('nomor_seri')->where('id', $id)->count();
        if ($getId <= 0) {
            return response()->json([
                'success' => false,
                'message' => 'ID Nomor Seri tidak ditemukan!',
            ], 404);
        }

        $findBarang = DB::table('barang')
            ->where('id', $request->input('product_id'))
            ->count();
        if ($findBarang <= 0) {
            return response()->json([
                'success' => false,
                'message' => 'ID Barang tidak ditemukan!',
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'product_id' => 'required',
            'serial_no' => 'required',
            'price' => 'required',
            'prod_date' => 'required',
            'warranty_start' => 'required',
            'warranty_duration' => 'required',
            'product_id' => 'required',
            'used' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $nomorSeri = DB::table('nomor_seri')
            ->where('id', $id)
            ->update([
                'product_id' => $request->input('product_id'),
                'serial_no' => $request->input('serial_no'),
                'price' => $request->input('price'),
                'prod_date' => $request->input('prod_date'),
                'warranty_start' => $request->input('warranty_start'),
                'warranty_duration' => $request->input('warranty_duration'),
                'product_id' => $request->input('product_id'),
                'used' => $request->input('used'),
            ]);

        if ($nomorSeri) {
            return response()->json([
                'success' => true,
                'message' => 'Berhasil update nomor seri!',
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => 'Internal server error!'
        ], 500);
    }

    public function deleteNomorSeri(Request $request, $id)
    {
        $nomorSeri = DB::table('nomor_seri')->where('id', $id)->first();

        if ($nomorSeri) {
            DB::table('nomor_seri')->where('id', $id)->delete();

            return response()->json([
                'success' => true,
                'message' => 'Nomor Seri berhasil dihapus!',
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => 'ID Nomor Seri tidak ditemukan!',
        ], 404);
    }
}
