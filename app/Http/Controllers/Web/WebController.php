<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class WebController extends Controller
{
    // Auth
    public function showHome(Request $request)
    {
        return Inertia::render('HomePage');
    }

    public function showLogin(Request $request)
    {
        return Inertia::render('LoginPage');
    }

    // Dashboard
    public function showDashboard(Request $request)
    {
        return Inertia::render('DashboardPage');
    }

    // Barang
    public function showProducts(Request $request)
    {
        return Inertia::render('ProductsPage');
    }

    public function showProductAdd(Request $request)
    {
        return Inertia::render('ProductAddPage');
    }

    public function showProductById(Request $request, $id)
    {
        return Inertia::render('ProductIdPage', ['id' => $id]);
    }

    // Nomor Seri
    public function showNomorSeriAdd(Request $request, $product_id)
    {
        return Inertia::render('NomorSeriAddPage', ['product_id' => $product_id]);
    }

    public function showNomorSeriId(Request $request, $product_id, $id)
    {
        return Inertia::render('NomorSeriIdPage', ['product_id' => $product_id, 'id' => $id]);
    }

    // Transaksi
    public function showTransactions(Request $request)
    {
        return Inertia::render('TransactionsPage');
    }

    public function showTransactionAdd(Request $request)
    {
        return Inertia::render('TransactionAddPage');
    }

    public function showTransactionId(Request $request, $id)
    {
        return Inertia::render('TransactionIdPage', ['id' => $id]);
    }

    // Report
    public function showReport(Request $request)
    {
        return Inertia::render('ReportPage');
    }
}
