import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ShoppingBag,
    Clock,
    ChevronRight,
    Package,
    CheckCircle2,
    XCircle,
    CreditCard,
    Calendar,
    Receipt,
    ArrowLeft
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { getMyOrders } from "@/api/order.api";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const MyOrders = () => {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            setLoading(true);
            try {
                const res = await getMyOrders();
                setOrders(res.data || []);
            } catch (error) {
                console.error(error);
                toast.error("Gagal memuat riwayat pesanan.");
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    const getStatusBadge = (status) => {
        const statusMap = {
            pending: { label: 'Menunggu', variant: 'bg-yellow-500/10 text-yellow-700 border-yellow-500/20', icon: Clock },
            paid: { label: 'Dibayar', variant: 'bg-blue-500/10 text-blue-700 border-blue-500/20', icon: CreditCard },
            completed: { label: 'Selesai', variant: 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20', icon: CheckCircle2 },
            cancelled: { label: 'Dibatalkan', variant: 'bg-red-500/10 text-red-700 border-red-500/20', icon: XCircle }
        };

        const config = statusMap[status] || statusMap.pending;
        const Icon = config.icon;

        return (
            <Badge className={cn("border font-black uppercase text-[9px] tracking-widest flex items-center gap-1.5 px-3 py-1", config.variant)}>
                <Icon className="h-3 w-3" />
                {config.label}
            </Badge>
        );
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#fafafa] pt-32 pb-20">
                <div className="container mx-auto px-4">
                    <Skeleton className="h-12 w-64 mb-8 rounded-2xl" />
                    <div className="space-y-4">
                        {[1, 2, 3].map(i => (
                            <Skeleton key={i} className="h-48 w-full rounded-[30px]" />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#fafafa] pt-24 pb-20">
            <div className="container mx-auto px-4">
                <div className="mb-8">
                    <h1 className="text-4xl font-black uppercase tracking-tight mb-2">Riwayat <span className="text-primary">Pesanan</span></h1>
                    <p className="text-muted-foreground font-medium italic">Pantau status dan detail pesanan Anda di sini.</p>
                </div>

                {orders.length === 0 ? (
                    <div className="max-w-md mx-auto bg-white p-12 rounded-[40px] shadow-2xl shadow-primary/5 border border-gray-50 text-center">
                        <div className="h-24 w-24 bg-primary/5 rounded-full flex items-center justify-center mx-auto mb-8">
                            <Receipt className="h-10 w-10 text-primary opacity-20" />
                        </div>
                        <h2 className="text-3xl font-black mb-4 uppercase tracking-tight">Belum Ada Pesanan</h2>
                        <p className="text-muted-foreground mb-10 font-medium italic">Anda belum pernah membuat pesanan. Mulai jelajahi menu kami sekarang!</p>
                        <Button className="w-full h-14 rounded-2xl font-black uppercase text-[10px] tracking-widest bg-primary shadow-xl shadow-primary/20" onClick={() => navigate('/menu')}>
                            Jelajahi Menu Sekarang
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.map((order) => (
                            <Card
                                key={order.uuid}
                                className="border-none shadow-sm rounded-[30px] overflow-hidden bg-white hover:shadow-xl hover:translate-y-[-4px] transition-all duration-300 cursor-pointer group"
                                onClick={() => navigate(`/pesanan-saya/${order.uuid}`)}
                            >
                                <CardContent className="p-6 sm:p-8">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                                        <div className="flex items-center gap-4">
                                            <div className="h-14 w-14 bg-primary/5 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-primary/10 transition-colors">
                                                <Package className="h-7 w-7 text-primary" />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-3 mb-1">
                                                    <h3 className="font-black text-lg uppercase tracking-tight">Pesanan #{order.uuid.slice(0, 8).toUpperCase()}</h3>
                                                    {getStatusBadge(order.status)}
                                                </div>
                                                <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-bold uppercase tracking-widest italic">
                                                    <Calendar className="h-3 w-3" />
                                                    {formatDate(order.created_at)}
                                                </div>
                                            </div>
                                        </div>
                                        <ChevronRight className="h-6 w-6 text-gray-300 group-hover:text-primary group-hover:translate-x-1 transition-all hidden sm:block" />
                                    </div>

                                    <div className="space-y-3 mb-6">
                                        {order.order_items?.slice(0, 3).map((item, idx) => (
                                            <div key={idx} className="flex items-center justify-between text-sm">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-12 w-12 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                                                        <img
                                                            src={item.menu?.image_url || `https://placehold.co/100x100?text=${item.menu?.name.replace(/ /g, '+')}`}
                                                            alt={item.menu?.name}
                                                            className="h-full w-full object-cover"
                                                        />
                                                    </div>
                                                    <div>
                                                        <p className="font-black text-sm uppercase tracking-tight leading-none mb-1">{item.menu?.name}</p>
                                                        <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest italic">{item.qty}× Item</p>
                                                    </div>
                                                </div>
                                                <p className="font-black text-primary">Rp {(item.line_total || 0).toLocaleString('id-ID')}</p>
                                            </div>
                                        ))}
                                        {order.order_items?.length > 3 && (
                                            <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest text-center pt-2 italic">
                                                +{order.order_items.length - 3} Menu Lainnya
                                            </p>
                                        )}
                                    </div>

                                    <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                                        <div>
                                            <p className="text-[9px] font-black uppercase text-muted-foreground tracking-widest mb-1 opacity-50">Total Pembayaran</p>
                                            <p className="text-2xl font-black text-gray-900 tracking-tighter">Rp {(order.grand_total || 0).toLocaleString('id-ID')}</p>
                                        </div>
                                        <Button variant="outline" className="rounded-2xl h-12 px-6 font-black uppercase text-[10px] tracking-widest border-primary/20 text-primary hover:bg-primary hover:text-white transition-all group-hover:scale-105">
                                            Lihat Detail
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}

                {orders.length > 0 && (
                    <div className="mt-8 text-center">
                        <Button variant="ghost" className="text-[10px] font-black uppercase tracking-widest text-primary hover:gap-3 transition-all italic group" onClick={() => navigate('/menu')}>
                            <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" /> Pesan Menu Lagi
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyOrders;
