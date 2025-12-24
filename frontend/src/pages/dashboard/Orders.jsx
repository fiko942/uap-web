import React, { useState, useEffect } from 'react';
import {
    ShoppingCart,
    Search,
    Eye,
    Download,
    Filter
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import client from "@/api/client";

const Orders = () => {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const res = await client.get('/orders');
            setOrders(res.data?.data || []);
        } catch (error) {
            console.error(error);
            toast.error("Gagal memuat data pesanan.");
        } finally {
            setLoading(false);
        }
    };

    const handleDownloadStruk = async (uuid) => {
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
            month: 'short',
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
        return <Badge variant={config.variant} className={`${config.className} font-black uppercase text-[9px]`}>{config.label}</Badge>;
    };

    const filteredOrders = orders.filter(order => {
        const matchesSearch =
            order.user?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order.uuid.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black uppercase tracking-tight">Manajemen Pesanan</h1>
                    <p className="text-muted-foreground font-medium mt-1">Kelola semua pesanan pelanggan</p>
                </div>
            </div>

            <Card className="border-none shadow-sm rounded-[30px]">
                <CardHeader>
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                                placeholder="Cari nama pelanggan atau ID pesanan..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 rounded-2xl border-gray-200"
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <Filter className="h-4 w-4 text-gray-400" />
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger className="w-[180px] rounded-2xl">
                                    <SelectValue placeholder="Filter Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Semua Status</SelectItem>
                                    <SelectItem value="diproses">Diproses</SelectItem>
                                    <SelectItem value="dibayar">Dibayar</SelectItem>
                                    <SelectItem value="selesai">Selesai</SelectItem>
                                    <SelectItem value="dibatalkan">Dibatalkan</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="space-y-3">
                            {[1, 2, 3, 4, 5].map(i => <Skeleton key={i} className="h-16 w-full rounded-xl" />)}
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="font-black uppercase text-[10px] tracking-widest">ID Pesanan</TableHead>
                                        <TableHead className="font-black uppercase text-[10px] tracking-widest">Pelanggan</TableHead>
                                        <TableHead className="font-black uppercase text-[10px] tracking-widest">Tanggal</TableHead>
                                        <TableHead className="font-black uppercase text-[10px] tracking-widest">Total</TableHead>
                                        <TableHead className="font-black uppercase text-[10px] tracking-widest">Status</TableHead>
                                        <TableHead className="text-right font-black uppercase text-[10px] tracking-widest">Aksi</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredOrders.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                                {searchQuery || statusFilter !== 'all'
                                                    ? 'Tidak ada pesanan yang sesuai filter'
                                                    : 'Belum ada pesanan'}
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        filteredOrders.map((order) => (
                                            <TableRow key={order.uuid} className="hover:bg-gray-50">
                                                <TableCell className="font-mono text-sm font-bold">
                                                    #{order.uuid.substring(0, 8).toUpperCase()}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="font-bold">{order.user?.name}</div>
                                                    <div className="text-xs text-muted-foreground">{order.user?.email}</div>
                                                </TableCell>
                                                <TableCell className="text-sm text-muted-foreground">
                                                    {formatDate(order.created_at)}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="font-black text-primary">{formatCurrency(order.grand_total)}</div>
                                                    <div className="text-xs text-muted-foreground">{order.order_items?.length || 0} item</div>
                                                </TableCell>
                                                <TableCell>
                                                    {getStatusBadge(order.status)}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => navigate(`/dashboard/orders/${order.uuid}`)}
                                                            className="h-8 w-8 rounded-lg hover:bg-primary/10 hover:text-primary"
                                                            title="Lihat Detail"
                                                        >
                                                            <Eye className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => handleDownloadStruk(order.uuid)}
                                                            className="h-8 w-8 rounded-lg hover:bg-emerald-500/10 hover:text-emerald-600"
                                                            title="Download Struk"
                                                        >
                                                            <Download className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default Orders;
