<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class LaporanController extends Controller
{
    public function getReport(Request $request)
    {
        $tipe_trans = $request->query('tipe_trans');
        $month = $request->query('month');
        $year = $request->query('year');

        $transaksis = DB::table('transaksi')
            ->leftJoin('transaksi_detail', 'transaksi.id', '=', 'transaksi_detail.transaksi_id')
            ->select('transaksi.*', DB::raw('SUM(transaksi_detail.price) as price'))
            ->where('transaksi.tipe_trans', '=', $tipe_trans)
            ->whereMonth('transaksi.tanggal', '=', $month)
            ->whereYear('transaksi.tanggal', '=', $year)
            ->groupBy('transaksi.id')
            ->orderBy('transaksi.tanggal', 'desc')
            ->get();

        $countIncome = DB::table('transaksi')
            ->join('transaksi_detail', 'transaksi.id', '=', 'transaksi_detail.transaksi_id')
            ->where('transaksi.tipe_trans', 'penjualan')
            ->whereMonth('transaksi.tanggal', '=', $month)
            ->whereYear('transaksi.tanggal', '=', $year)
            ->sum('transaksi_detail.price');

        $countOutcome = DB::table('transaksi')
            ->join('transaksi_detail', 'transaksi.id', '=', 'transaksi_detail.transaksi_id')
            ->where('transaksi.tipe_trans', 'pembelian')
            ->whereMonth('transaksi.tanggal', '=', $month)
            ->whereYear('transaksi.tanggal', '=', $year)
            ->sum('transaksi_detail.price');

        return response()->json([
            'success' => true,
            'reports' => $transaksis,
            'info' => [
                'month_income' => $countIncome,
                'month_outcome' => $countOutcome,
            ]
        ]);
    }

    public function getProductsStock(Request $request)
    {
        $barangs = DB::table('barang')
            ->leftJoin('nomor_seri', 'barang.id', '=', 'nomor_seri.product_id')
            ->select('barang.product_name', DB::raw('SUM(nomor_seri.used=0) as stocks'))
            ->groupBy('barang.id')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $barangs,
        ]);
    }
}
