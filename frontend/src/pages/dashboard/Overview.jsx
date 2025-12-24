import React, { useState, useEffect } from 'react';
import {
    TrendingUp,
    ShoppingCart,
    Users,
    UtensilsCrossed,
    DollarSign,
    AlertTriangle,
    Package,
    Calendar
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import client from "@/api/client";

const Overview = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            const res = await client.get('/dashboard');
            setData(res.data.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(amount || 0);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: '2-digit',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusBadge = (status) => {
        const variants = {
            'diproses': { variant: 'outline', className: 'border-yellow-500 text-yellow-700', label: 'Diproses' },
            'dibayar': { variant: 'outline', className: 'border-blue-500 text-blue-700', label: 'Dibayar' },
            'selesai': { variant: 'outline', className: 'border-emerald-500 text-emerald-700', label: 'Selesai' },
            'dibatalkan': { variant: 'outline', className: 'border-red-500 text-red-700', label: 'Dibatalkan' }
        };
        const config = variants[status] || variants['diproses'];
        return <Badge variant={config.variant} className={`${config.className} font-black uppercase text-[9px]`}>{config.label}</Badge>;
    };

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32 rounded-[30px]" />)}
                </div>
            </div>
        );
    }

    const stats = data?.statistics || {};

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-black uppercase tracking-tight">Dashboard Overview</h1>
                <p className="text-muted-foreground font-medium mt-1">Ringkasan performa restoran Anda</p>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="border-none shadow-sm rounded-[30px] bg-gradient-to-br from-blue-50 to-white">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-black uppercase tracking-widest text-gray-600">Total Pesanan</CardTitle>
                        <ShoppingCart className="h-5 w-5 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-black text-blue-600">{stats.total_orders || 0}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            <span className="font-bold text-blue-600">{stats.today_orders || 0}</span> pesanan hari ini
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-sm rounded-[30px] bg-gradient-to-br from-emerald-50 to-white">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-black uppercase tracking-widest text-gray-600">Total Pendapatan</CardTitle>
                        <DollarSign className="h-5 w-5 text-emerald-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-black text-emerald-600">{formatCurrency(stats.total_revenue)}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            <span className="font-bold text-emerald-600">{formatCurrency(stats.today_revenue)}</span> hari ini
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-sm rounded-[30px] bg-gradient-to-br from-purple-50 to-white">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-black uppercase tracking-widest text-gray-600">Total Pelanggan</CardTitle>
                        <Users className="h-5 w-5 text-purple-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-black text-purple-600">{stats.total_customers || 0}</div>
                        <p className="text-xs text-muted-foreground mt-1">Pengguna terdaftar</p>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-sm rounded-[30px] bg-gradient-to-br from-orange-50 to-white">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-black uppercase tracking-widest text-gray-600">Total Menu</CardTitle>
                        <UtensilsCrossed className="h-5 w-5 text-orange-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-black text-orange-600">{stats.total_menus || 0}</div>
                        <p className="text-xs text-muted-foreground mt-1">Menu tersedia</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Orders */}
                <Card className="border-none shadow-sm rounded-[30px]">
                    <CardHeader>
                        <CardTitle className="font-black uppercase tracking-tight flex items-center gap-2">
                            <Calendar className="h-5 w-5" />
                            Pesanan Terbaru
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {data?.recent_orders?.length === 0 ? (
                                <p className="text-center text-muted-foreground py-8">Belum ada pesanan</p>
                            ) : (
                                data?.recent_orders?.map((order) => (
                                    <div key={order.uuid} className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors">
                                        <div className="flex-1">
                                            <div className="font-bold text-sm">{order.user?.name}</div>
                                            <div className="text-xs text-muted-foreground">{formatDate(order.created_at)}</div>
                                        </div>
                                        <div className="text-right mr-4">
                                            <div className="font-black text-primary">{formatCurrency(order.grand_total)}</div>
                                            <div className="text-xs text-muted-foreground">{order.order_items?.length || 0} item</div>
                                        </div>
                                        {getStatusBadge(order.status)}
                                    </div>
                                ))
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Low Stock Alert */}
                <Card className="border-none shadow-sm rounded-[30px]">
                    <CardHeader>
                        <CardTitle className="font-black uppercase tracking-tight flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5 text-yellow-600" />
                            Stok Menipis
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {data?.low_stock_menus?.length === 0 ? (
                                <p className="text-center text-muted-foreground py-8">Semua stok aman</p>
                            ) : (
                                data?.low_stock_menus?.map((menu) => (
                                    <div key={menu.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors">
                                        <div className="flex-1">
                                            <div className="font-bold text-sm">{menu.name}</div>
                                            <div className="text-xs text-muted-foreground">{formatCurrency(menu.price)}</div>
                                        </div>
                                        <Badge variant={menu.stock <= 5 ? 'destructive' : 'outline'} className="font-black">
                                            <Package className="mr-1 h-3 w-3" />
                                            {menu.stock} tersisa
                                        </Badge>
                                    </div>
                                ))
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Popular Menus */}
            <Card className="border-none shadow-sm rounded-[30px]">
                <CardHeader>
                    <CardTitle className="font-black uppercase tracking-tight flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-emerald-600" />
                        Menu Terpopuler
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                        {data?.popular_menus?.length === 0 ? (
                            <p className="col-span-full text-center text-muted-foreground py-8">Belum ada data penjualan</p>
                        ) : (
                            data?.popular_menus?.map((menu, index) => (
                                <div key={menu.id} className="p-4 rounded-2xl bg-gradient-to-br from-gray-50 to-white border-2 border-gray-100 hover:border-primary/30 transition-all">
                                    <div className="flex items-start justify-between mb-2">
                                        <Badge variant="outline" className="font-black text-[10px]">#{index + 1}</Badge>
                                        <Badge className="font-black text-[9px]">{menu.order_items_count || 0} terjual</Badge>
                                    </div>
                                    <div className="font-bold text-sm mb-1">{menu.name}</div>
                                    <div className="text-xs text-primary font-black">{formatCurrency(menu.price)}</div>
                                </div>
                            ))
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default Overview;
