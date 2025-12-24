import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
    Search,
    ShoppingBag,
    Star,
    UtensilsCrossed,
    LayoutGrid,
    List,
    ArrowUpDown,
    Flame
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { getMenus } from "@/api/menu.api";
import { getCategories } from "@/api/category.api";
import { toast } from "sonner";
import { cn } from '@/lib/utils';
import { useCart } from "@/context/CartContext";

const MenuList = () => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const { addToCart } = useCart();

    // States
    const [menus, setMenus] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState('grid');

    // Filters from URL
    const activeCategory = searchParams.get('category') || 'all';
    const searchQuery = searchParams.get('search') || '';
    const sortBy = searchParams.get('sort') || 'name';

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [menuRes, catRes] = await Promise.all([
                    getMenus({ category: activeCategory !== 'all' ? activeCategory : undefined, search: searchQuery, sort: sortBy }),
                    getCategories()
                ]);

                setMenus(menuRes.data?.data || menuRes.data || []);
                setCategories(catRes.data?.data || catRes.data || []);
            } catch (error) {
                console.error(error);
                toast.error("Gagal memuat daftar menu.");
                setMenus([]);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [activeCategory, searchQuery, sortBy]);

    const handleCategoryChange = (val) => {
        setSearchParams(prev => {
            if (val === 'all') prev.delete('category');
            else prev.set('category', val);
            return prev;
        });
    };

    const handleSearch = (e) => {
        const val = e.target.value;
        setSearchParams(prev => {
            if (!val) prev.delete('search');
            else prev.set('search', val);
            return prev;
        });
    };

    const handleSort = (val) => {
        setSearchParams(prev => {
            prev.set('sort', val);
            return prev;
        });
    };

    const handleQuickAdd = (e, item) => {
        e.stopPropagation();
        addToCart(item, 1);
        toast.success(`${item.name} berhasil ditambahkan!`, {
            description: "Menu telah masuk ke keranjang belanja Anda.",
            action: {
                label: "Checkout",
                onClick: () => navigate('/pesanan')
            }
        });
    };

    return (
        <div className="bg-[#fafafa] min-h-screen">
            {/* Page Header */}
            <div className="bg-primary pt-24 pb-32 relative overflow-hidden">
                <div className="absolute top-0 left-0 p-8 opacity-5">
                    <UtensilsCrossed className="h-64 w-64 text-white" />
                </div>
                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-xl">
                        <Badge className="bg-white/20 text-white border-none px-3 py-1 text-[10px] font-black uppercase tracking-widest mb-4 backdrop-blur-md italic">Cita Rasa Otentik</Badge>
                        <h1 className="text-4xl md:text-5xl font-black text-white mb-4 uppercase tracking-tight leading-none">Katalog Menu Kami</h1>
                        <p className="text-white/80 text-lg font-medium">Hidangan Kanton & Szechuan pilihan yang disiapkan dengan bahan segar melalui teknik tradisional.</p>
                    </div>
                </div>
            </div>

            <main className="container mx-auto px-4 mt-16 pb-20">
                {/* Filters Bar */}
                <Card className="border-none shadow-2xl bg-white mb-8 overflow-hidden rounded-[30px]">
                    <CardContent className="p-4 md:p-6">
                        <div className="flex flex-col lg:flex-row items-center gap-6">
                            {/* Search */}
                            <div className="relative w-full lg:max-w-md">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <Input
                                    placeholder="Cari menu, bahan makanan..."
                                    className="pl-10 h-12 border-gray-100 bg-gray-50/50 focus-visible:ring-primary/20 rounded-2xl font-medium"
                                    defaultValue={searchQuery}
                                    onChange={handleSearch}
                                />
                            </div>

                            {/* Category Filter */}
                            <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
                                <Button
                                    variant={activeCategory === 'all' ? 'default' : 'outline'}
                                    className={cn(
                                        "rounded-full h-10 px-6 font-black uppercase text-[10px] tracking-widest transition-all",
                                        activeCategory === 'all' ? "bg-primary shadow-lg shadow-primary/20" : "hover:border-primary hover:text-primary"
                                    )}
                                    onClick={() => handleCategoryChange('all')}
                                >
                                    Semua
                                </Button>
                                {categories.map(cat => (
                                    <Button
                                        key={cat.slug || cat.id}
                                        variant={activeCategory === (cat.slug || cat.id).toLowerCase() ? 'default' : 'outline'}
                                        className={cn(
                                            "rounded-full h-10 px-6 font-black uppercase text-[10px] tracking-widest transition-all",
                                            activeCategory === (cat.slug || cat.id).toLowerCase() ? "bg-primary shadow-lg shadow-primary/20" : "hover:border-primary hover:text-primary"
                                        )}
                                        onClick={() => handleCategoryChange(cat.slug || cat.id)}
                                    >
                                        {cat.name}
                                    </Button>
                                ))}
                            </div>

                            {/* Sorting & View Mode */}
                            <div className="flex items-center gap-4 w-full lg:w-auto lg:ml-auto">
                                <Select defaultValue={sortBy} onValueChange={handleSort}>
                                    <SelectTrigger className="w-[200px] h-12 rounded-2xl border-gray-100 font-black uppercase text-[10px] tracking-widest bg-gray-50/50">
                                        <div className="flex items-center gap-2">
                                            <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
                                            <SelectValue placeholder="Urutkan Berdasarkan" />
                                        </div>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="name" className="font-bold uppercase text-[10px] tracking-widest">Nama (A-Z)</SelectItem>
                                        <SelectItem value="price_asc" className="font-bold uppercase text-[10px] tracking-widest">Harga: Terendah</SelectItem>
                                        <SelectItem value="price_desc" className="font-bold uppercase text-[10px] tracking-widest">Harga: Tertinggi</SelectItem>
                                        <SelectItem value="popular" className="font-bold uppercase text-[10px] tracking-widest">Paling Populer</SelectItem>
                                    </SelectContent>
                                </Select>

                                <div className="hidden sm:flex items-center border border-gray-100 rounded-2xl p-1 bg-gray-50/50 h-12">
                                    <Button
                                        variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                                        size="icon"
                                        className={cn("rounded-xl h-10 w-10", viewMode === 'grid' && "bg-white shadow-sm")}
                                        onClick={() => setViewMode('grid')}
                                    >
                                        <LayoutGrid className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                                        size="icon"
                                        className={cn("rounded-xl h-10 w-10", viewMode === 'list' && "bg-white shadow-sm")}
                                        onClick={() => setViewMode('list')}
                                    >
                                        <List className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Content */}
                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                            <div key={i} className="space-y-4">
                                <Skeleton className="h-52 w-full rounded-[30px]" />
                                <Skeleton className="h-6 w-3/4 rounded-lg" />
                                <Skeleton className="h-4 w-1/2 rounded-lg" />
                                <div className="flex justify-between items-center pt-2">
                                    <Skeleton className="h-8 w-1/4 rounded-lg" />
                                    <Skeleton className="h-10 w-10 rounded-full" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : menus.length > 0 ? (
                    <div className={cn(
                        viewMode === 'grid'
                            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
                            : "space-y-6"
                    )}>
                        {menus.map((item) => (
                            <Card
                                key={item.uuid}
                                className={cn(
                                    "group border-2 border-gray-200 shadow-lg hover:translate-y-[-8px] hover:shadow-2xl hover:shadow-primary/10 hover:border-primary/30 transition-all duration-500 overflow-hidden cursor-pointer bg-white",
                                    viewMode === 'list' ? "flex flex-col md:flex-row h-auto md:h-44 rounded-[30px]" : "flex flex-col rounded-[35px]"
                                )}
                                onClick={() => navigate(`/menu/${item.slug}`)}
                            >
                                <div className={cn(
                                    "relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100",
                                    viewMode === 'grid' ? "h-56 w-full" : "h-48 md:h-full w-full md:w-56 shrink-0"
                                )}>
                                    <img
                                        src={item.image_url || `https://placehold.co/400x300?text=${item.name.replace(/ /g, '+')}`}
                                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                        alt={item.name}
                                    />
                                    {item.is_recommended && (
                                        <Badge className="absolute top-4 left-4 bg-secondary text-white border-none py-1 h-6 font-black text-[9px] uppercase tracking-widest shadow-lg">Bestseller 🔥</Badge>
                                    )}
                                    {item.is_spicy && (
                                        <div className="absolute top-4 right-4 bg-red-600/90 backdrop-blur-md rounded-full p-1.5 shadow-lg">
                                            <Flame className="h-3 w-3 text-white" />
                                        </div>
                                    )}
                                </div>
                                <div className="flex flex-col flex-grow p-6">
                                    <div className="flex flex-col flex-grow">
                                        <div className="flex items-center gap-1 mb-2">
                                            <Star className="h-3.5 w-3.5 fill-secondary text-secondary" />
                                            <span className="text-sm font-black text-gray-900">{item.rating || '4.5'}</span>
                                            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-tighter ml-1">Teruji & Lezat</span>
                                        </div>
                                        <h3 className="font-black text-lg leading-tight mb-2 group-hover:text-primary transition-colors tracking-tight uppercase text-gray-900">{item.name}</h3>
                                        <p className="text-[11px] text-gray-600 line-clamp-2 leading-relaxed mb-4 font-medium">
                                            {item.description || 'Resep tradisional yang disiapkan dengan teknik wok otentik.'}
                                        </p>
                                    </div>
                                    <div className="flex items-center justify-between border-t-2 border-gray-100 pt-4 mt-auto">
                                        <div className="flex flex-col">
                                            <span className="text-[9px] text-gray-400 font-black uppercase tracking-widest">Mulai dari</span>
                                            <span className="text-xl font-black text-primary">Rp {(item.price || 0).toLocaleString('id-ID')}</span>
                                        </div>
                                        <Button
                                            size="icon"
                                            className="rounded-2xl h-11 w-11 shadow-lg shadow-primary/20 bg-primary hover:bg-primary-dark transition-all group-hover:scale-110 active:scale-95"
                                            onClick={(e) => handleQuickAdd(e, item)}
                                        >
                                            <ShoppingBag className="h-5 w-5 text-white" />
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-[40px] p-16 text-center shadow-xl border border-gray-50">
                        <div className="h-24 w-24 bg-primary/5 rounded-full flex items-center justify-center mx-auto mb-8">
                            <UtensilsCrossed className="h-12 w-12 text-primary opacity-20" />
                        </div>
                        <h2 className="text-3xl font-black mb-4 uppercase tracking-tight">Menu Tidak Ditemukan</h2>
                        <p className="text-muted-foreground max-w-sm mx-auto mb-10 font-medium italic">Kami tidak menemukan hidangan yang sesuai dengan kriteria Anda. Coba sesuaikan pencarian atau pilihan kategori.</p>
                        <Button variant="outline" className="rounded-full h-14 px-10 font-black uppercase text-[10px] tracking-widest border-primary text-primary hover:bg-primary hover:text-white transition-all shadow-lg" onClick={() => handleCategoryChange('all')}>Reset Pencarian</Button>
                    </div>
                )}
            </main>
        </div>
    );
};

export default MenuList;
