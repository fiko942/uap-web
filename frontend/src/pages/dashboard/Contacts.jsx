import React, { useState, useEffect } from 'react';
import PageHeader from '@/components/layout/PageHeader';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Mail,
    RefreshCw,
    User,
    Calendar,
    MessageCircle,
    CheckCircle2,
    Trash2
} from 'lucide-react';
import { Skeleton } from "@/components/ui/skeleton";
import client from '@/api/client';
import { toast } from "sonner";
import { cn } from '@/lib/utils';

const Contacts = () => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchMessages = async () => {
        setLoading(true);
        try {
            const res = await client.get('/contacts');
            setMessages(res.data?.data || res.data || []);
        } catch (error) {
            console.error(error);
            toast.error("Gagal memuat pesan kontak.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMessages();
    }, []);

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <PageHeader
                title="Kotak Masuk Pertanyaan"
                subtitle="Tinjau dan kelola pesan dari calon pelanggan dan mitra bisnis Anda."
                actions={
                    <Button variant="outline" size="icon" onClick={fetchMessages} disabled={loading} className="rounded-xl">
                        <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
                    </Button>
                }
            />

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <Table>
                    <TableHeader className="bg-gray-50/50">
                        <TableRow>
                            <TableHead className="w-[250px] font-bold uppercase text-[10px] tracking-widest pl-6">Identitas Kontak</TableHead>
                            <TableHead className="font-bold uppercase text-[10px] tracking-widest">Isi Pesan</TableHead>
                            <TableHead className="font-bold uppercase text-[10px] tracking-widest">Dikirim Pada</TableHead>
                            <TableHead className="text-right pr-6 font-bold uppercase text-[10px] tracking-widest">Aksi</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            [1, 2, 3].map(i => (
                                <TableRow key={i}>
                                    <TableCell colSpan={4}><Skeleton className="h-12 w-full" /></TableCell>
                                </TableRow>
                            ))
                        ) : messages.length > 0 ? (
                            messages.map((msg) => (
                                <TableRow key={msg.id} className="hover:bg-gray-50/30 transition-colors border-b-muted/20 group">
                                    <TableCell className="pl-6">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-full bg-primary/5 flex items-center justify-center text-primary border border-primary/10">
                                                <User className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <p className="font-black text-gray-900 leading-tight uppercase text-xs">{msg.name}</p>
                                                <p className="text-[10px] text-muted-foreground font-bold mt-0.5 italic opacity-50">{msg.email}</p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="max-w-md py-2">
                                            <div className="flex items-center gap-1.5 mb-1.5 text-primary">
                                                <MessageCircle className="h-3 w-3" />
                                                <span className="text-[9px] font-black uppercase tracking-widest opacity-40 italic">Jejak Pertanyaan</span>
                                            </div>
                                            <p className="text-sm text-gray-700 leading-relaxed font-bold italic opacity-80">"{msg.message}"</p>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-1.5 text-[10px] font-black text-muted-foreground uppercase opacity-70 italic">
                                            <Calendar className="h-3 w-3" />
                                            {new Date(msg.created_at).toLocaleString('id-ID')}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right pr-6">
                                        <div className="flex justify-end gap-2">
                                            <Button variant="outline" size="sm" className="h-8 rounded-lg hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 border-gray-100 font-black text-[9px] uppercase tracking-widest px-3">
                                                <CheckCircle2 className="h-3.5 w-3.5 mr-1" /> Selesaikan
                                            </Button>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive rounded-full">
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={4} className="h-64 text-center text-muted-foreground uppercase tracking-widest font-black text-xs opacity-20 italic">
                                    Kotak masuk saat ini kosong.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default Contacts;
