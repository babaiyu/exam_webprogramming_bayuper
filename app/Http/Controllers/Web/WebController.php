<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class WebController extends Controller
{
    public function showHome(Request $request)
    {
        return Inertia::render('HomePage');
    }

    public function showLogin(Request $request)
    {
        return Inertia::render('LoginPage');
    }

    public function showDashboard(Request $request)
    {
        return Inertia::render('DashboardPage');
    }

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

    public function showNomorSeriAdd(Request $request, $product_id)
    {
        return Inertia::render('NomorSeriAddPage', ['product_id' => $product_id]);
    }

    public function showNomorSeriId(Request $request, $product_id, $id)
    {
        return Inertia::render('NomorSeriIdPage', ['product_id' => $product_id, 'id' => $id]);
    }
}
