<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class TransaksiController extends Controller
{
    public function getAllTransaksi(Request $request)
    {
        $transaksis = DB::table('transaksi')
            ->join('transaksi_detail', 'transaksi.id', '=', 'transaksi_detail.transaksi_id')
            ->join('barang', 'barang.id', '=', 'transaksi_detail.product_id')
            ->select(
                'transaksi.*',
                'transaksi_detail.serial_no',
                'transaksi_detail.price',
                'transaksi_detail.discount',
                'barang.product_name',
                'barang.brand',
                'barang.model_no',
            )
            ->simplePaginate(10);


        return response()->json([
            'success' => true,
            'data' => $transaksis,
        ]);
    }

    public function insertTransaksi(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'transaksi.tanggal' => 'required',
            'transaksi.no_trans' => 'required',
            'transaksi.customer_vendor' => 'required',
            'transaksi.tipe_trans' => 'required',
            'transaksi_detail.product_id' => 'required',
            'transaksi_detail.serial_no' => 'required',
            'transaksi_detail.price' => 'required',
            'transaksi_detail.discount' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $transaksiId = DB::table('transaksi')->insertGetId([
            'tanggal' => $request->input('transaksi.tanggal'),
            'no_trans' => $request->input('transaksi.no_trans'),
            'customer_vendor' => $request->input('transaksi.customer_vendor'),
            'tipe_trans' => $request->input('transaksi.tipe_trans'),
        ]);

        if (!$transaksiId) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal membuat transaksi!',
            ], 400);
        }

        $transaksi_detail = DB::table('transaksi_detail')->insert([
            'transaksi_id' => $transaksiId,
            'product_id' => $request->input('transaksi_detail.product_id'),
            'serial_no' => $request->input('transaksi_detail.serial_no'),
            'price' => $request->input('transaksi_detail.price'),
            'discount' => $request->input('transaksi_detail.discount'),
        ]);

        if (!$transaksi_detail) {
            DB::table('transaksi')
                ->where('id', $transaksiId)
                ->delete();

            return response()->json([
                'success' => false,
                'message' => 'Gagal membuat detail transaksi!',
            ], 400);
        }

        return response()->json([
            'success' => true,
            'message' => 'Berhasil membuat transaksi',
        ], 200);
    }

    public function deleteTransaksi(Request $request, $id)
    {
        $transaksi = DB::table('transaksi')->where('id', $id)->first();

        if (!$transaksi) {
            return response()->json([
                'success' => false,
                'message' => 'ID Transaksi tidak ditemukan!',
            ], 404);
        }

        $deleteTransaksiDetail = DB::table('transaksi_detail')->where('product_id', $id)->delete();

        if (!$deleteTransaksiDetail) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal menghapus transaksi detail',
            ], 500);
        }

        DB::table('transaksi')->where('id', $id)->delete();

        return response()->json([
            'success' => true,
            'message' => 'Transaksi berhasil dihapus',
        ]);
    }
}
