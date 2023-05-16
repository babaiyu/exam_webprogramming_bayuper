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
        return Inertia::render('DashboardPage', ['request' => $request]);
    }
}
