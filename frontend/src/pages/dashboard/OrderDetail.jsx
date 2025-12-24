import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    User,
    Calendar,
    Package,
    Download
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import client from "@/api/client";

const OrderDetail = () => {
    const { uuid } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        fetchOrderDetail();
    }, [uuid]);

    const fetchOrderDetail = async () => {
        setLoading(true);
        try {
            const res = await client.get(`/orders/${uuid}`);
            setOrder(res.data?.data);
        } catch (error) {
            console.error(error);
            toast.error("Gagal memuat detail pesanan.");
            navigate('/dashboard/orders');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (newStatus) => {
        setUpdating(true);
        try {
            const res = await client.put(`/orders/${uuid}/status`, { status: newStatus });
            toast.success(res.data?.pesan || "Status pesanan berhasil diperbarui.");
            fetchOrderDetail();
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.pesan || "Gagal memperbarui status.");
        } finally {
            setUpdating(false);
        }
    };

    const handleDownloadStruk = async () => {
        try {
            const response = await client.get(`/orders/${uuid}/struk`, {
                responseType: 'blob'
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `struk-${uuid}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();

            toast.success("Struk berhasil diunduh!");
        } catch (error) {
            console.error(error);
            toast.error("Gagal mengunduh struk.");
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
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusBadge = (status) => {
        const variants = {
            'diproses': { variant: 'outline', className: 'border-yellow-500 text-yellow-700 bg-yellow-50', label: 'Diproses' },
            'dibayar': { variant: 'outline', className: 'border-blue-500 text-blue-700 bg-blue-50', label: 'Dibayar' },
            'selesai': { variant: 'outline', className: 'border-emerald-500 text-emerald-700 bg-emerald-50', label: 'Selesai' },
            'dibatalkan': { variant: 'outline', className: 'border-red-500 text-red-700 bg-red-50', label: 'Dibatalkan' }
        };
        const config = variants[status] || variants['diproses'];
        return <Badge variant={config.variant} className={`${config.className} font-black uppercase text-[10px] px-3 py-1`}>{config.label}</Badge>;
    };

    if (loading) {
        return (
            <div className="space-y-6">
                <Skeleton className="h-12 w-64" />
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <Skeleton className="h-96 lg:col-span-2" />
                    <Skeleton className="h-96" />
                </div>
            </div>
        );
    }

    if (!order) return null;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => navigate('/dashboard/orders')}
                        className="rounded-2xl"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <div>
                        <h1 className="text-3xl font-black uppercase tracking-tight">Detail Pesanan</h1>
                        <p className="text-muted-foreground font-medium mt-1">
                            ID: #{order.uuid.substring(0, 8).toUpperCase()}
                        </p>
                    </div>
                </div>
                <Button
                    onClick={handleDownloadStruk}
                    className="rounded-2xl font-black uppercase text-[10px] tracking-widest"
                >
                    <Download className="mr-2 h-4 w-4" />
                    Download Struk
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Order Items */}
                <Card className="border-none shadow-sm rounded-[30px] lg:col-span-2">
                    <CardHeader>
                        <CardTitle className="font-black uppercase tracking-tight flex items-center gap-2">
                            <Package className="h-5 w-5" />
                            Item Pesanan
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {order.order_items?.map((item, index) => (
                                <div key={index}>
                                    <div className="flex items-center justify-between py-3">
                                        <div className="flex-1">
                                            <div className="font-bold">{item.menu?.name}</div>
                                            <div className="text-sm text-muted-foreground">
                                                {formatCurrency(item.price)} × {item.qty}
                                            </div>
                                        </div>
                                        <div className="font-black text-primary">
                                            {formatCurrency(item.line_total)}
                                        </div>
                                    </div>
                                    {index < order.order_items.length - 1 && <Separator />}
                                </div>
                            ))}
                        </div>

                        <Separator className="my-6" />

                        {/* Totals */}
                        <div className="space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Subtotal</span>
                                <span className="font-bold">{formatCurrency(order.subtotal)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Diskon</span>
                                <span className="font-bold text-emerald-600">- {formatCurrency(order.discount_total)}</span>
                            </div>
                            <Separator />
                            <div className="flex justify-between">
                                <span className="font-black uppercase text-sm">Total Bayar</span>
                                <span className="font-black text-xl text-primary">{formatCurrency(order.grand_total)}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Order Info & Status */}
                <div className="space-y-6">
                    {/* Customer Info */}
                    <Card className="border-none shadow-sm rounded-[30px]">
                        <CardHeader>
                            <CardTitle className="font-black uppercase tracking-tight flex items-center gap-2 text-base">
                                <User className="h-4 w-4" />
                                Info Pelanggan
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div>
                                <div className="text-xs text-muted-foreground uppercase tracking-widest font-black mb-1">Nama</div>
                                <div className="font-bold">{order.user?.name}</div>
                            </div>
                            <div>
                                <div className="text-xs text-muted-foreground uppercase tracking-widest font-black mb-1">Email</div>
                                <div className="text-sm">{order.user?.email}</div>
                            </div>
                            <div>
                                <div className="text-xs text-muted-foreground uppercase tracking-widest font-black mb-1">Tanggal Pesan</div>
                                <div className="text-sm flex items-center gap-2">
                                    <Calendar className="h-3 w-3" />
                                    {formatDate(order.created_at)}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Status Management */}
                    <Card className="border-none shadow-sm rounded-[30px]">
                        <CardHeader>
                            <CardTitle className="font-black uppercase tracking-tight text-base">Status Pesanan</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">Status Saat Ini:</span>
                                {getStatusBadge(order.status)}
                            </div>
                            <Separator />
                            <div className="space-y-2">
                                <label className="text-xs text-muted-foreground uppercase tracking-widest font-black">Ubah Status</label>
                                <Select
                                    value={order.status}
                                    onValueChange={handleStatusUpdate}
                                    disabled={updating}
                                >
                                    <SelectTrigger className="rounded-2xl">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="diproses">Diproses</SelectItem>
                                        <SelectItem value="dibayar">Dibayar</SelectItem>
                                        <SelectItem value="selesai">Selesai</SelectItem>
                                        <SelectItem value="dibatalkan">Dibatalkan</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default OrderDetail;
