import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ShoppingBag,
    ChevronRight,
    Star,
    Clock,
    ChefHat,
    Utensils,
    TrendingUp,
    TicketPercent,
    ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getMenus } from "@/api/menu.api";
import { getCategories } from "@/api/category.api";
import { getPromos } from "@/api/promo.api";

const Home = () => {
    const navigate = useNavigate();

    const [popularMenus, setPopularMenus] = useState([]);
    const [categories, setCategories] = useState([]);
    const [promos, setPromos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [menuRes, catRes, promoRes] = await Promise.all([
                    getMenus({ limit: 4, sort: 'popular' }),
                    getCategories(),
                    getPromos()
                ]);

                setPopularMenus(menuRes.data?.data?.slice(0, 4) || menuRes.data?.slice(0, 4) || []);
                setCategories(catRes.data?.data || catRes.data || []);
                setPromos(promoRes.data?.data || promoRes.data || []);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="bg-[#fcfcfc] min-h-screen">
            {/* Hero Section */}
            <section className="relative h-[550px] md:h-[650px] flex items-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1552611052-33e04de081de?auto=format&fit=crop&q=80&w=2000"
                        alt="Hero"
                        className="w-full h-full object-cover brightness-50"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent"></div>
                </div>
                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-3xl text-white space-y-8 animate-in slide-in-from-left duration-700">
                        <div className="space-y-4">
                            <Badge className="bg-secondary text-white border-none px-4 py-1.5 text-xs uppercase font-black tracking-widest shadow-lg">Autentik Kanton 🥢</Badge>
                            <h1 className="text-5xl md:text-7xl font-black font-sans tracking-tight mb-4 leading-[1.1] uppercase">
                                Keahlian <span className="text-primary italic">Wok-Fired</span> yang Sempurna
                            </h1>
                            <p className="text-xl md:text-2xl opacity-90 leading-relaxed max-w-xl text-gray-200 font-medium">
                                Rasakan sensasi legendaris 'Wok Hei' dan jiwa sejati hidangan oriental, disiapkan khusus oleh master chef kami.
                            </p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                            <Button size="lg" className="h-[70px] px-10 text-lg font-black rounded-2xl shadow-2xl shadow-primary/40 bg-primary hover:scale-105 transition-transform" onClick={() => navigate('/menu')}>
                                JELAJAHI MENU <ShoppingBag className="ml-3 h-6 w-6" />
                            </Button>
                            <Button size="lg" variant="outline" className="h-[70px] px-10 text-lg font-black rounded-2xl border-white text-white hover:bg-white hover:text-black hover:scale-105 transition-all bg-transparent uppercase tracking-widest" onClick={() => navigate('/about')}>
                                CERITA KAMI
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Floating Stats */}
                <div className="absolute bottom-10 right-10 hidden lg:block animate-in fade-in slide-in-from-bottom duration-1000 delay-300">
                    <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white p-6 rounded-[30px] shadow-2xl">
                        <div className="flex gap-8">
                            <div className="text-center">
                                <p className="text-3xl font-black">25+</p>
                                <p className="text-[9px] font-black uppercase tracking-widest opacity-60">Pilihan Menu</p>
                            </div>
                            <div className="w-[1px] bg-white/20"></div>
                            <div className="text-center">
                                <p className="text-3xl font-black">4.9</p>
                                <p className="text-[9px] font-black uppercase tracking-widest opacity-60">Skor Ulasan</p>
                            </div>
                        </div>
                    </Card>
                </div>
            </section>

            {/* Categories Ticker */}
            <div className="bg-white border-b border-gray-100 py-6 overflow-hidden relative">
                <div className="flex animate-marquee whitespace-nowrap gap-12 items-center">
                    {[...categories, ...categories, ...categories].map((cat, i) => (
                        <div key={i} className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate(`/menu?category=${cat.slug || cat.name.toLowerCase()}`)}>
                            <span className="text-2xl opacity-20 group-hover:opacity-100 transition-opacity">🥢</span>
                            <span className="text-xs font-black uppercase tracking-widest text-gray-400 group-hover:text-primary transition-colors">{cat.name}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Active Promos Section */}
            {promos.length > 0 && (
                <section className="py-20 bg-[#fafafa]">
                    <div className="container mx-auto px-4">
                        <div className="flex items-end justify-between mb-12">
                            <div>
                                <Badge variant="outline" className="text-primary border-primary/20 mb-2 font-black uppercase tracking-widest px-3">Penawaran Musiman</Badge>
                                <h2 className="text-3xl md:text-4xl font-black tracking-tight text-gray-900 uppercase">Promo Waktu Terbatas</h2>
                            </div>
                            <Button variant="ghost" className="hidden sm:flex text-primary font-black text-xs uppercase tracking-widest group" onClick={() => navigate('/menu')}>
                                Lihat Semua Penawaran <ChevronRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {promos.slice(0, 3).map((promo) => (
                                <Card key={promo.id} className="relative overflow-hidden group border-none shadow-xl bg-primary text-white p-8 rounded-[40px] cursor-pointer" onClick={() => navigate('/menu')}>
                                    <div className="absolute top-0 right-0 p-8 opacity-10">
                                        <TicketPercent className="h-40 w-40 rotate-12" />
                                    </div>
                                    <div className="relative z-10 space-y-6">
                                        <div className="h-14 w-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center">
                                            <TrendingUp className="h-8 w-8 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="text-3xl font-black leading-tight uppercase tracking-tight">{promo.title}</h3>
                                            <p className="text-white/80 mt-2 font-bold italic text-sm">Gunakan kode: <span className="text-secondary font-black not-italic">{promo.code || 'DRAGON20'}</span></p>
                                        </div>
                                        <Button className="bg-white text-primary font-black rounded-xl px-8 h-12 hover:bg-secondary hover:text-white transition-colors uppercase text-xs tracking-widest">
                                            KLAIM SEKARANG
                                        </Button>
                                    </div>
                                    {/* Glass reflection */}
                                    <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-white/5 rotate-45 pointer-events-none group-hover:translate-x-20 transition-transform duration-1000"></div>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Popular Menu Section */}
            <section className="py-24 container mx-auto px-4">
                <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
                    <div className="h-12 w-12 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto text-primary">
                        <ChefHat className="h-7 w-7" />
                    </div>
                    <h2 className="text-3xl md:text-4xl font-black tracking-tight uppercase">Menu Terpopuler Bulan Ini</h2>
                    <p className="text-muted-foreground text-lg font-medium">Hidangan andalan yang paling dicintai oleh ribuan pelanggan kami.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
                    {loading ? (
                        [1, 2, 3, 4].map(i => (
                            <div key={i} className="space-y-4">
                                <Skeleton className="h-64 w-full rounded-[30px]" />
                                <Skeleton className="h-8 w-3/4 rounded-lg" />
                                <Skeleton className="h-4 w-1/2 rounded-lg" />
                            </div>
                        ))
                    ) : popularMenus.map((item) => (
                        <Card key={item.uuid} className="group border-none shadow-sm hover:translate-y-[-10px] transition-all duration-500 overflow-hidden rounded-[30px] bg-white flex flex-col cursor-pointer" onClick={() => navigate(`/menu/${item.slug}`)}>
                            <div className="relative h-64 overflow-hidden">
                                <img
                                    src={item.image_url || `https://placehold.co/400x400?text=${item.name.replace(/ /g, '+')}`}
                                    alt={item.name}
                                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                                    <Badge className="bg-white text-black border-none font-black uppercase text-[10px] tracking-widest px-3 py-1">Rp {(item.price || 0).toLocaleString('id-ID')}</Badge>
                                </div>
                            </div>
                            <CardContent className="p-6 flex-grow">
                                <div className="flex items-center gap-1 mb-2">
                                    <Star className="h-3.5 w-3.5 fill-secondary text-secondary" />
                                    <span className="text-sm font-black text-gray-900">{item.rating || '4.8'}</span>
                                    <span className="text-[9px] text-muted-foreground uppercase font-black tracking-widest ml-1 opacity-50 italic">Rasa Terjamin</span>
                                </div>
                                <h3 className="font-black text-lg uppercase leading-tight mb-2 group-hover:text-primary transition-colors tracking-tight">{item.name}</h3>
                                <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed font-medium">
                                    {item.description || "Resep autentik yang berfokus pada bahan-bahan segar dan keahlian master kuali."}
                                </p>
                            </CardContent>
                            <CardFooter className="px-6 pb-6 pt-0 mt-auto">
                                <Button className="w-full rounded-2xl h-11 font-black shadow-lg shadow-primary/10 group-hover:bg-secondary transition-colors uppercase text-xs tracking-widest">
                                    Lihat Detail <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>

                <div className="mt-20 text-center">
                    <Button variant="outline" size="lg" className="h-16 rounded-full px-12 border-primary text-primary hover:bg-primary hover:text-white font-black text-lg shadow-xl shadow-primary/5 transition-all active:scale-95 uppercase tracking-widest" onClick={() => navigate('/menu')}>
                        LIHAT SELURUH MENU <Utensils className="ml-3 h-5 w-5" />
                    </Button>
                </div>
            </section>
        </div>
    );
};

export default Home;
