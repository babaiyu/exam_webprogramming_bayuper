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
            ->leftJoin('transaksi_detail', 'transaksi.id', '=', 'transaksi_detail.transaksi_id')
            ->select('transaksi.*', DB::raw('SUM(transaksi_detail.price) as price'))
            ->groupBy('transaksi.id')
            ->orderBy('transaksi.tanggal', 'desc')
            ->simplePaginate(10);

        return response()->json([
            'success' => true,
            'data' => $transaksis,
        ]);
    }

    public function getTransaksiDetail(Request $request, $id)
    {
        $transaksi = DB::table('transaksi')
            ->where('id', $id)
            ->first();

        $transaksiDetail = DB::table('transaksi_detail')
            ->where('transaksi_id', $id)
            ->leftJoin('barang', 'transaksi_detail.product_id', '=', 'barang.id')
            ->leftJoin('nomor_seri', 'transaksi_detail.serial_no', '=', 'nomor_seri.serial_no')
            ->select(
                'transaksi_detail.*',
                'barang.product_name',
                'nomor_seri.prod_date',
                'nomor_seri.warranty_start',
                'nomor_seri.warranty_duration'
            )
            ->groupBy('transaksi_detail.id')
            ->get();

        return response()->json([
            'success' => true,
            'data' => [
                'transaksi' => $transaksi,
                'transaksi_detail' => $transaksiDetail
            ],
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

    public function insertTransaksiV2(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'transaksi.tanggal' => 'required',
            'transaksi.no_trans' => 'required',
            'transaksi.customer_vendor' => 'required',
            'transaksi.tipe_trans' => 'required',
            'transaksi_detail' => 'required'
            // 'transaksi_detail.product_id' => 'required',
            // 'transaksi_detail.serial_no' => 'required',
            // 'transaksi_detail.price' => 'required',
            // 'transaksi_detail.discount' => 'required',
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

        foreach ($request->input('transaksi_detail') as $key => $value) {
            DB::table('transaksi_detail')->insert([
                'transaksi_id' => $transaksiId,
                'product_id' => $value['product_id'],
                'serial_no' => $value['serial_no'],
                'price' => $value['price'],
                'discount' => $value['discount'],
            ]);

            if ($request->input('transaksi.tipe_trans') == 'pembelian') {
                DB::table('nomor_seri')->insert([
                    'product_id' => $value['nomor_seri']['product_id'],
                    'serial_no' => $value['nomor_seri']['serial_no'],
                    'price' => $value['nomor_seri']['price'],
                    'prod_date' => $value['nomor_seri']['prod_date'],
                    'warranty_start' => $value['nomor_seri']['warranty_start'],
                    'warranty_duration' => $value['nomor_seri']['warranty_duration'],
                    'used' => 0,
                ]);
            }
            if ($request->input('transaksi.tipe_trans') == 'penjualan') {
                DB::table('nomor_seri')->where('id', $value['nomor_seri']['nomor_seri_id'])
                    ->update([
                        'product_id' => $value['nomor_seri']['product_id'],
                        'serial_no' => $value['nomor_seri']['serial_no'],
                        'price' => $value['nomor_seri']['price'],
                        'prod_date' => $value['nomor_seri']['prod_date'],
                        'warranty_start' => $value['nomor_seri']['warranty_start'],
                        'warranty_duration' => $value['nomor_seri']['warranty_duration'],
                        'used' => 1,
                    ]);
            }
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

        DB::table('transaksi_detail')
            ->where('transaksi_id', $id)
            ->delete();

        DB::table('transaksi')->where('id', $id)->delete();

        return response()->json([
            'success' => true,
            'message' => 'Transaksi berhasil dihapus',
        ]);
    }
}
