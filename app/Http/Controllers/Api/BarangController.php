<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class BarangController extends Controller
{
    public function getBarang(Request $request)
    {
        $barangs = DB::table('barang')
            ->leftJoin('nomor_seri', 'barang.id', '=', 'nomor_seri.product_id')
            ->select('barang.*', DB::raw('count(nomor_seri.id) as stocks'))
            ->groupBy('barang.id')
            ->simplePaginate(10);

        return response()->json([
            'success' => true,
            'data' => $barangs,
        ]);
    }

    public function getBarangById(Request $request, $id)
    {
        $barang = DB::table('barang')->where('id', $id)->first();

        return response()->json([
            'success' => true,
            'data' => $barang,
        ]);
    }

    public function insertBarang(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'product_name' => 'required',
            'brand' => 'required',
            'price' => 'required',
            'model_no' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $barang = DB::table('barang')->insert([
            'product_name' => $request->input('product_name'),
            'brand' => $request->input('brand'),
            'price' => $request->input('price'),
            'model_no' => $request->input('model_no'),
        ]);

        if ($barang) {
            return response()->json([
                'success' => true,
                'message' => 'Berhasil input barang!',
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => 'Internal server error!'
        ], 500);
    }

    public function updateBarang(Request $request, $id)
    {
        $getId = DB::table('barang')->where('id', $id)->count();

        if ($getId <= 0) {
            return response()->json([
                'success' => false,
                'message' => 'ID Barang tidak ditemukan!'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'product_name' => 'required',
            'brand' => 'required',
            'price' => 'required',
            'model_no' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $barang = DB::table('barang')
            ->where('id', $id)
            ->update([
                'product_name' => $request->input('product_name'),
                'brand' => $request->input('brand'),
                'price' => $request->input('price'),
                'model_no' => $request->input('model_no'),
            ]);

        if ($barang) {
            return response()->json([
                'success' => true,
                'message' => 'Berhasil update barang!',
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => 'Internal server error!'
        ], 500);
    }

    public function deleteBarang(Request $request, $id)
    {
        $barang = DB::table('barang')->where('id', $id)->first();

        if ($barang) {
            DB::table('barang')->where('id', $id)->delete();
            DB::table('nomor_seri')->where('product_id', $id)->delete();

            return response()->json([
                'success' => true,
                'message' => 'Barang berhasil dihapus!',
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => 'ID Barang tidak ditemukan!',
        ], 404);
    }
}
