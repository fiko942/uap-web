import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
    ShoppingBag,
    Star,
    Clock,
    ChefHat,
    ArrowLeft,
    Plus,
    Minus,
    AlertTriangle,
    Flame,
    CheckCircle2,
    Info
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { getMenuBySlug } from "@/api/menu.api";
import { toast } from "sonner";
import { useCart } from "@/context/CartContext";

const MenuDetail = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();

    const [menu, setMenu] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [adding, setAdding] = useState(false);

    useEffect(() => {
        const fetchMenu = async () => {
            setLoading(true);
            try {
                const res = await getMenuBySlug(slug);
                setMenu(res.data?.data || res.data);
            } catch (error) {
                console.error(error);
                toast.error("Data menu tidak ditemukan.");
                navigate('/menu');
            } finally {
                setLoading(false);
            }
        };

        fetchMenu();
    }, [slug, navigate]);

    const handleAddToCart = () => {
        setAdding(true);
        addToCart(menu, quantity);

        setTimeout(() => {
            setAdding(false);
            toast.success(`${quantity}× ${menu.name} ditambahkan ke pesanan!`, {
                description: "Anda dapat melihat daftar pesanan di halaman kasir.",
                action: {
                    label: "Lihat Keranjang",
                    onClick: () => navigate('/pesanan')
                }
            });
        }, 800);
    };

    if (loading) {
        return (
            <div className="container mx-auto px-4 pt-32 pb-20">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    <Skeleton className="h-[500px] w-full rounded-[40px]" />
                    <div className="space-y-6">
                        <Skeleton className="h-10 w-3/4 rounded-xl" />
                        <Skeleton className="h-6 w-1/4 rounded-lg" />
                        <Skeleton className="h-24 w-full rounded-2xl" />
                        <Skeleton className="h-20 w-full rounded-3xl" />
                    </div>
                </div>
            </div>
        );
    }

    if (!menu) return null;

    return (
        <div className="bg-[#fcfcfc] min-h-screen pb-20">
            {/* Navigation Header */}
            <div className="container mx-auto px-4 pt-24 pb-8">
                <Link to="/menu" className="inline-flex items-center text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors group italic">
                    <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" /> Kembali ke Katalog Menu
                </Link>
            </div>

            <main className="container mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                    {/* Image Area */}
                    <div className="relative group">
                        <div className="absolute inset-0 bg-primary/5 rounded-[50px] rotate-3 scale-105 group-hover:rotate-0 transition-transform duration-700"></div>
                        <div className="relative aspect-square rounded-[50px] overflow-hidden shadow-2xl bg-white border-[10px] border-white">
                            <img
                                src={menu.image_url || `https://placehold.co/800x800?text=${menu.name.replace(/ /g, '+')}`}
                                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                                alt={menu.name}
                            />
                            {menu.is_spicy && (
                                <Badge className="absolute top-8 right-8 bg-red-600/90 backdrop-blur-md text-white border-none py-2 px-5 font-black flex gap-2 shadow-xl uppercase text-[10px] tracking-widest">
                                    <Flame className="h-4 w-4" /> PEDAS
                                </Badge>
                            )}
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="flex flex-col">
                        <div className="space-y-8">
                            <div className="space-y-3">
                                <div className="flex flex-wrap items-center gap-4">
                                    <Badge variant="outline" className="text-secondary border-secondary/30 bg-secondary/5 font-black uppercase tracking-widest px-4 py-1 italic">{menu.category?.name || 'Spesial Chef'}</Badge>
                                    <div className="flex items-center gap-1.5 text-sm font-black text-gray-700 uppercase tracking-tighter">
                                        <Star className="h-4 w-4 fill-secondary text-secondary" />
                                        {menu.rating || '4.8'} <span className="text-muted-foreground font-bold italic opacity-40 ml-1">(124 Ulasan)</span>
                                    </div>
                                </div>
                                <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight leading-none uppercase">{menu.name}</h1>
                                <p className="text-4xl font-black text-primary tracking-tighter">Rp {(menu.price || 0).toLocaleString('id-ID')}</p>
                            </div>

                            <Card className="border-none shadow-sm bg-gray-50/50 rounded-[30px]">
                                <CardContent className="p-8">
                                    <h3 className="font-black uppercase text-xs tracking-widest flex items-center gap-2 mb-4 opacity-70 italic">
                                        <Info className="h-4 w-4 text-primary" /> Deskripsi Master Chef
                                    </h3>
                                    <p className="text-muted-foreground leading-relaxed font-medium italic">
                                        {menu.description || "Disiapkan dengan keahlian menggunakan teknik tradisional Kanton. Chef kami fokus pada 'Wok Hei' (nafas kuali) untuk menghadirkan kualitas aromatik terdalam dan rasa smoky yang khas pada hidangan ini. Setiap bahan dipilih dengan kesegaran mutlak."}
                                    </p>
                                </CardContent>
                            </Card>

                            <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
                                <div className="p-5 rounded-3xl border border-gray-100 bg-white shadow-sm flex flex-col items-center text-center group hover:border-primary/20 transition-colors">
                                    <Clock className="h-6 w-6 text-gray-300 mb-2 group-hover:text-primary transition-colors" />
                                    <span className="text-[9px] font-black uppercase text-muted-foreground tracking-widest mb-1 opacity-50">Waktu Masak</span>
                                    <span className="font-black text-sm uppercase">15-20 Menit</span>
                                </div>
                                <div className="p-5 rounded-3xl border border-gray-100 bg-white shadow-sm flex flex-col items-center text-center group hover:border-primary/20 transition-colors">
                                    <ChefHat className="h-6 w-6 text-gray-300 mb-2 group-hover:text-primary transition-colors" />
                                    <span className="text-[9px] font-black uppercase text-muted-foreground tracking-widest mb-1 opacity-50">Master Chef</span>
                                    <span className="font-black text-sm uppercase">Chef LIU</span>
                                </div>
                                <div className="p-5 rounded-3xl border border-gray-100 bg-white shadow-sm flex flex-col items-center text-center group hover:border-primary/20 transition-colors md:flex hidden">
                                    <CheckCircle2 className="h-6 w-6 text-emerald-500 mb-2" />
                                    <span className="text-[9px] font-black uppercase text-muted-foreground tracking-widest mb-1 opacity-50">Bebas Babi</span>
                                    <span className="font-black text-sm uppercase">Terverifikasi</span>
                                </div>
                            </div>

                            {/* Order Controls */}
                            <div className="pt-8 space-y-6">
                                <div className="flex flex-col sm:flex-row items-center gap-6">
                                    <div className="flex items-center h-16 border-2 border-gray-100 bg-white rounded-2xl p-1.5 w-full sm:w-fit group focus-within:border-primary/30 transition-colors shadow-sm">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-12 w-12 rounded-xl hover:bg-gray-100"
                                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                            disabled={quantity <= 1}
                                        >
                                            <Minus className="h-5 w-5" />
                                        </Button>
                                        <span className="w-16 text-center font-black text-2xl tracking-tighter">{quantity}</span>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-12 w-12 rounded-xl hover:bg-gray-100"
                                            onClick={() => setQuantity(quantity + 1)}
                                        >
                                            <Plus className="h-5 w-5" />
                                        </Button>
                                    </div>
                                    <div className="w-full">
                                        <Button
                                            className="w-full h-16 text-lg font-black rounded-2xl shadow-2xl shadow-primary/20 bg-primary active:scale-95 transition-all text-white uppercase tracking-widest"
                                            onClick={handleAddToCart}
                                            disabled={adding}
                                        >
                                            <ShoppingBag className="mr-3 h-6 w-6" />
                                            {adding ? 'MENAMBAHKAN...' : 'TAMBAH KE KERANJANG'}
                                        </Button>
                                    </div>
                                </div>
                                <div className="flex items-center justify-center gap-6 text-[9px] font-black text-muted-foreground uppercase tracking-widest italic opacity-40">
                                    <span className="flex items-center gap-1.5"><Star className="h-3 w-3" /> Rating Tertinggi</span>
                                    <span className="flex items-center gap-1.5"><AlertTriangle className="h-3 w-3" /> Bahan Segar Harian</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default MenuDetail;
