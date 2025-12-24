<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Menu;
use App\Models\User;
use App\Models\Category;
use Illuminate\Support\Facades\DB;
use App\Traits\AdminCheck;

class DashboardController extends Controller
{
    use AdminCheck;

    public function index()
    {
        if ($check = $this->checkAdmin())
            return $check;

        // Total statistics
        $totalOrders = Order::count();
        $totalRevenue = Order::where('status', 'dibayar')->sum('grand_total');
        $totalCustomers = User::where('role', 'customer')->count();
        $totalMenus = Menu::count();

        // Today's statistics
        $todayOrders = Order::whereDate('created_at', today())->count();
        $todayRevenue = Order::whereDate('created_at', today())
            ->where('status', 'dibayar')
            ->sum('grand_total');

        // Recent orders
        $recentOrders = Order::with(['user', 'orderItems'])
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get();

        // Low stock menus
        $lowStockMenus = Menu::where('stock', '<=', 10)
            ->where('is_active', true)
            ->orderBy('stock', 'asc')
            ->limit(5)
            ->get();

        // Popular menus (most ordered)
        $popularMenus = Menu::withCount([
            'orderItems' => function ($query) {
                $query->whereHas('order', function ($q) {
                    $q->where('status', 'dibayar');
                });
            }
        ])
            ->orderBy('order_items_count', 'desc')
            ->limit(5)
            ->get();

        // Orders by status
        $ordersByStatus = Order::select('status', DB::raw('count(*) as total'))
            ->groupBy('status')
            ->get()
            ->pluck('total', 'status');

        // Revenue last 7 days
        $revenueLast7Days = Order::where('status', 'dibayar')
            ->where('created_at', '>=', now()->subDays(7))
            ->select(
                DB::raw('DATE(created_at) as date'),
                DB::raw('SUM(grand_total) as total')
            )
            ->groupBy('date')
            ->orderBy('date', 'asc')
            ->get();

        return response()->json([
            'status' => 'berhasil',
            'data' => [
                'statistics' => [
                    'total_orders' => $totalOrders,
                    'total_revenue' => $totalRevenue,
                    'total_customers' => $totalCustomers,
                    'total_menus' => $totalMenus,
                    'today_orders' => $todayOrders,
                    'today_revenue' => $todayRevenue,
                ],
                'recent_orders' => $recentOrders,
                'low_stock_menus' => $lowStockMenus,
                'popular_menus' => $popularMenus,
                'orders_by_status' => $ordersByStatus,
                'revenue_last_7_days' => $revenueLast7Days,
            ]
        ]);
    }
}
