import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
    ArrowLeft,
    Package,
    Clock,
    CheckCircle2,
    XCircle,
    CreditCard,
    Calendar,
    User,
    Receipt,
    MapPin
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { getMyOrderDetails } from "@/api/order.api";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const MyOrderDetail = () => {
    const { uuid } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrder = async () => {
            setLoading(true);
            try {
                const res = await getMyOrderDetails(uuid);
                setOrder(res.data || null);
            } catch (error) {
                console.error(error);
                toast.error("Pesanan tidak ditemukan.");
                navigate('/pesanan-saya');
            } finally {
                setLoading(false);
            }
        };

        fetchOrder();
    }, [uuid, navigate]);

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
            <Badge className={cn("border font-black uppercase text-[10px] tracking-widest flex items-center gap-2 px-4 py-2", config.variant)}>
                <Icon className="h-4 w-4" />
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
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-6">
                            <Skeleton className="h-96 w-full rounded-[30px]" />
                        </div>
                        <div>
                            <Skeleton className="h-64 w-full rounded-[30px]" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!order) return null;

    return (
        <div className="min-h-screen bg-[#fafafa] pt-24 pb-20">
            <div className="container mx-auto px-4">
                <div className="mb-8">
                    <Link to="/pesanan-saya" className="inline-flex items-center text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors group italic mb-4">
                        <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" /> Kembali ke Riwayat
                    </Link>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-4xl font-black uppercase tracking-tight mb-2">Detail <span className="text-primary">Pesanan</span></h1>
                            <p className="text-muted-foreground font-medium italic">#{order.uuid.toUpperCase()}</p>
                        </div>
                        {getStatusBadge(order.status)}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Order Items */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card className="border-none shadow-sm rounded-[30px] overflow-hidden bg-white">
                            <CardContent className="p-8">
                                <h2 className="text-2xl font-black uppercase tracking-tight mb-6 flex items-center gap-3">
                                    <div className="h-10 w-10 bg-primary/5 rounded-xl flex items-center justify-center">
                                        <Package className="h-5 w-5 text-primary" />
                                    </div>
                                    Daftar Menu
                                </h2>

                                <div className="space-y-4">
                                    {order.order_items?.map((item, idx) => (
                                        <div key={idx} className="flex items-center gap-6 p-4 rounded-2xl bg-gray-50/50 border border-gray-100 hover:border-primary/20 transition-colors">
                                            <div className="h-20 w-20 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                                                <img
                                                    src={item.menu?.image_url || `https://placehold.co/200x200?text=${item.menu?.name.replace(/ /g, '+')}`}
                                                    alt={item.menu?.name}
                                                    className="h-full w-full object-cover"
                                                />
                                            </div>
                                            <div className="flex-grow">
                                                <h3 className="font-black text-lg uppercase tracking-tight leading-none mb-2">{item.menu?.name}</h3>
                                                <div className="flex items-center gap-4 text-sm">
                                                    <p className="text-muted-foreground font-bold">
                                                        <span className="text-[10px] uppercase tracking-widest italic">Harga:</span> Rp {(item.price || 0).toLocaleString('id-ID')}
                                                    </p>
                                                    <span className="text-gray-300">•</span>
                                                    <p className="text-muted-foreground font-bold">
                                                        <span className="text-[10px] uppercase tracking-widest italic">Jumlah:</span> {item.qty}×
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[9px] font-black uppercase text-muted-foreground tracking-widest mb-1 opacity-40">Subtotal</p>
                                                <p className="text-xl font-black text-primary">Rp {(item.line_total || 0).toLocaleString('id-ID')}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Order Timeline */}
                        <Card className="border-none shadow-sm rounded-[30px] overflow-hidden bg-white">
                            <CardContent className="p-8">
                                <h2 className="text-2xl font-black uppercase tracking-tight mb-6 flex items-center gap-3">
                                    <div className="h-10 w-10 bg-primary/5 rounded-xl flex items-center justify-center">
                                        <Clock className="h-5 w-5 text-primary" />
                                    </div>
                                    Informasi Waktu
                                </h2>

                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-4 rounded-2xl bg-gray-50/50">
                                        <div className="flex items-center gap-3">
                                            <Calendar className="h-5 w-5 text-primary" />
                                            <div>
                                                <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest mb-1 italic">Waktu Pemesanan</p>
                                                <p className="font-black text-sm">{formatDate(order.created_at)}</p>
                                            </div>
                                        </div>
                                    </div>
                                    {order.updated_at !== order.created_at && (
                                        <div className="flex items-center justify-between p-4 rounded-2xl bg-gray-50/50">
                                            <div className="flex items-center gap-3">
                                                <Clock className="h-5 w-5 text-primary" />
                                                <div>
                                                    <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest mb-1 italic">Terakhir Diperbarui</p>
                                                    <p className="font-black text-sm">{formatDate(order.updated_at)}</p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Order Summary */}
                    <div className="space-y-6">
                        <Card className="border-none shadow-xl rounded-[40px] overflow-hidden bg-white sticky top-32">
                            <CardContent className="p-8">
                                <h2 className="text-2xl font-black uppercase tracking-tight mb-8">Ringkasan <span className="text-primary">Tagihan</span></h2>

                                <div className="space-y-4 mb-8">
                                    <div className="flex justify-between items-center text-sm font-bold uppercase tracking-widest text-muted-foreground italic">
                                        <span>Subtotal</span>
                                        <span className="text-gray-900">Rp {(order.subtotal || 0).toLocaleString('id-ID')}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm font-bold uppercase tracking-widest text-muted-foreground italic">
                                        <span>Diskon</span>
                                        <span className="text-emerald-500">-Rp {(order.discount_total || 0).toLocaleString('id-ID')}</span>
                                    </div>
                                    <Separator className="bg-gray-50" />
                                    <div className="flex justify-between items-end pt-2">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-black uppercase text-primary tracking-widest italic">Total Pembayaran</span>
                                            <span className="text-3xl font-black tracking-tighter text-gray-900 leading-none">Rp {(order.grand_total || 0).toLocaleString('id-ID')}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                                        <div className="flex items-center gap-3 mb-3">
                                            <User className="h-5 w-5 text-primary" />
                                            <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest italic">Pemesan</p>
                                        </div>
                                        <p className="font-black text-sm uppercase tracking-tight">{order.user?.name || 'Tamu'}</p>
                                        <p className="text-[10px] text-muted-foreground font-medium italic">{order.user?.email || '-'}</p>
                                    </div>

                                    <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                                        <div className="flex items-center gap-3 mb-3">
                                            <Receipt className="h-5 w-5 text-primary" />
                                            <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest italic">Nomor Pesanan</p>
                                        </div>
                                        <p className="font-black text-xs uppercase tracking-tight break-all">{order.uuid}</p>
                                    </div>

                                    {order.status === 'pending' && (
                                        <div className="p-4 rounded-2xl bg-yellow-50 border border-yellow-200">
                                            <p className="text-[10px] font-black uppercase text-yellow-700 tracking-widest mb-2 italic">Catatan Penting</p>
                                            <p className="text-[10px] text-yellow-700 font-medium leading-relaxed">
                                                Silakan selesaikan pembayaran di kasir untuk memproses pesanan Anda.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyOrderDetail;
