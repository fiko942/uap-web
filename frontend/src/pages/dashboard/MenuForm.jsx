import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PageHeader from '@/components/layout/PageHeader';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import {
    ArrowLeft,
    Save,
    Image as ImageIcon,
    Loader2,
    X,
    UtensilsCrossed,
    Flame,
    Star,
    AlertCircle
} from 'lucide-react';
import { getCategories } from "@/api/category.api";
import { getMenuBySlug, createMenu, updateMenu } from "@/api/menu.api";
import { toast } from "sonner";
import { cn } from '@/lib/utils';

const MenuForm = () => {
    const { slug } = useParams();
    const isEdit = !!slug;
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(isEdit);
    const [categories, setCategories] = useState([]);

    const [formData, setFormData] = useState({
        name: '',
        category_id: '',
        price: '',
        stock: '100',
        description: '',
        is_active: true,
        is_spicy: false,
        is_recommended: false
    });

    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);

    useEffect(() => {
        const loadCategories = async () => {
            try {
                const res = await getCategories();
                setCategories(res.data?.data || res.data || []);
            } catch (error) {
                toast.error("Gagal memuat daftar kategori.");
            }
        };

        const loadMenu = async () => {
            if (!isEdit) return;
            try {
                const res = await getMenuBySlug(slug);
                const menu = res.data?.data || res.data;
                setFormData({
                    name: menu.name,
                    category_id: menu.category_id.toString(),
                    price: menu.price.toString(),
                    stock: menu.stock.toString(),
                    description: menu.description || '',
                    is_active: !!menu.is_active,
                    is_spicy: !!menu.is_spicy,
                    is_recommended: !!menu.is_recommended
                });
                if (menu.image_url) setPreview(menu.image_url);
            } catch (error) {
                toast.error("Data menu tidak ditemukan.");
                navigate('/dashboard/menus');
            } finally {
                setFetching(false);
            }
        };

        loadCategories();
        loadMenu();
    }, [slug, isEdit, navigate]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const data = new FormData();
        Object.keys(formData).forEach(key => {
            // Bool to int for Laravel
            if (typeof formData[key] === 'boolean') {
                data.append(key, formData[key] ? '1' : '0');
            } else {
                data.append(key, formData[key]);
            }
        });

        if (image) {
            data.append('image', image);
        }

        try {
            if (isEdit) {
                await updateMenu(slug, data);
                toast.success("Menu berhasil diperbarui!");
            } else {
                await createMenu(data);
                toast.success("Menu baru berhasil ditambahkan!");
            }
            navigate('/dashboard/menus');
        } catch (error) {
            console.error(error);
            const msg = error.response?.data?.pesan || error.response?.data?.message || "Terjadi kesalahan pada sistem.";
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return (
            <div className="flex flex-col items-center justify-center h-64 space-y-4">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="font-black text-muted-foreground uppercase tracking-widest text-[10px]">Mengautentikasi Data Menu...</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="mb-6">
                <Button
                    variant="ghost"
                    className="gap-2 font-black text-[10px] uppercase tracking-widest hover:bg-white"
                    onClick={() => navigate('/dashboard/menus')}
                >
                    <ArrowLeft className="h-4 w-4" /> Kembali Ke Daftar
                </Button>
            </div>

            <PageHeader
                title={isEdit ? "Modifikasi Sumber Daya Menu" : "Buat Sumber Daya Menu Baru"}
                subtitle={isEdit ? `Memperbarui ${formData.name} di dalam katalog master.` : "Tambahkan mahakarya kuliner baru ke dalam katalog menu."}
            />

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
                {/* Left Side: Detail */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="border-none shadow-sm bg-white">
                        <CardContent className="p-8 space-y-6">
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Nama Hidangan</Label>
                                <Input
                                    className="h-12 text-lg font-black border-gray-100 bg-gray-50/30 focus-visible:bg-white uppercase tracking-tight"
                                    placeholder="Contoh: Tumis Daging Sapi Lada Hitam"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Kategori Terpilih</Label>
                                    <Select
                                        value={formData.category_id}
                                        onValueChange={(val) => setFormData({ ...formData, category_id: val })}
                                    >
                                        <SelectTrigger className="h-12 border-gray-100 bg-gray-50/30 font-bold uppercase text-[10px] tracking-widest">
                                            <SelectValue placeholder="Pilih Kategori" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {categories.map(cat => (
                                                <SelectItem key={cat.id} value={cat.id.toString()} className="font-bold uppercase text-[10px] tracking-widest">{cat.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Harga (IDR)</Label>
                                    <Input
                                        type="number"
                                        className="h-12 border-gray-100 bg-gray-50/30 font-black text-sm"
                                        placeholder="0"
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Deskripsi Kuliner</Label>
                                <Textarea
                                    className="min-h-[140px] border-gray-100 bg-gray-50/30 focus-visible:bg-white p-4 font-medium text-sm leading-relaxed"
                                    placeholder="Jelaskan cita rasa, bahan-bahan, dan teknik memasak..."
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-sm bg-white">
                        <CardContent className="p-8 space-y-6">
                            <h3 className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                                <UtensilsCrossed className="h-4 w-4 text-primary" /> Konfigurasi Atribut Menu
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="flex items-center justify-between p-4 rounded-xl border border-gray-50 bg-gray-50/30">
                                    <div className="space-y-0.5">
                                        <Label className="text-[10px] font-black uppercase cursor-pointer" htmlFor="active">Aktif</Label>
                                        <p className="text-[9px] font-bold text-muted-foreground uppercase opacity-50">Tampil di publik</p>
                                    </div>
                                    <Switch
                                        id="active"
                                        checked={formData.is_active}
                                        onCheckedChange={(val) => setFormData({ ...formData, is_active: val })}
                                    />
                                </div>

                                <div className="flex items-center justify-between p-4 rounded-xl border border-gray-50 bg-gray-50/30">
                                    <div className="space-y-0.5">
                                        <Label className="text-[10px] font-black uppercase cursor-pointer flex items-center gap-1" htmlFor="spicy">
                                            Pedas <Flame className="h-3 w-3 text-red-500" />
                                        </Label>
                                        <p className="text-[9px] font-bold text-muted-foreground uppercase opacity-50">Gaya Szechuan</p>
                                    </div>
                                    <Switch
                                        id="spicy"
                                        checked={formData.is_spicy}
                                        onCheckedChange={(val) => setFormData({ ...formData, is_spicy: val })}
                                    />
                                </div>

                                <div className="flex items-center justify-between p-4 rounded-xl border border-gray-50 bg-gray-50/30">
                                    <div className="space-y-0.5">
                                        <Label className="text-[10px] font-black uppercase cursor-pointer flex items-center gap-1" htmlFor="recommended">
                                            Bintang <Star className="h-3 w-3 text-secondary fill-secondary" />
                                        </Label>
                                        <p className="text-[9px] font-bold text-muted-foreground uppercase opacity-50">Tag Terlaris</p>
                                    </div>
                                    <Switch
                                        id="recommended"
                                        checked={formData.is_recommended}
                                        onCheckedChange={(val) => setFormData({ ...formData, is_recommended: val })}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Side: Media & Save */}
                <div className="space-y-8">
                    <Card className="border-none shadow-sm bg-white overflow-hidden">
                        <div className="bg-muted aspect-video relative group border-b border-gray-50">
                            {preview ? (
                                <>
                                    <img src={preview} className="w-full h-full object-cover" alt="Preview" />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <Button type="button" variant="secondary" size="sm" className="font-black uppercase text-[10px] tracking-widest rounded-xl" onClick={() => document.getElementById('image-upload').click()}>Ganti Gambar Utama</Button>
                                    </div>
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        size="icon"
                                        className="absolute top-2 right-2 h-7 w-7 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                                        onClick={() => { setPreview(null); setImage(null); }}
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                </>
                            ) : (
                                <div
                                    className="w-full h-full flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors"
                                    onClick={() => document.getElementById('image-upload').click()}
                                >
                                    <ImageIcon className="h-10 w-10 text-gray-300 mb-2" />
                                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-50">Unggah Visual</p>
                                </div>
                            )}
                            <input
                                id="image-upload"
                                type="file"
                                className="hidden"
                                accept="image/*"
                                onChange={handleImageChange}
                            />
                        </div>
                        <CardContent className="p-6">
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-widest">Stok Inventaris</Label>
                                <div className="flex items-center gap-2">
                                    <Input
                                        type="number"
                                        placeholder="Kuantitas"
                                        className="h-10 font-black border-gray-100 text-sm"
                                        value={formData.stock}
                                        onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                                    />
                                    <span className="text-[10px] font-black text-muted-foreground uppercase opacity-50 italic">Unit</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="space-y-3">
                        <Button
                            className="w-full h-14 text-lg font-black rounded-2xl shadow-xl shadow-primary/20 bg-primary hover:bg-primary-dark transition-all uppercase tracking-tight"
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? (
                                <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Memproses...</>
                            ) : (
                                <><Save className="mr-2 h-5 w-5" /> {isEdit ? "Perbarui Registri" : "Simpan Ke Menu"}</>
                            )}
                        </Button>
                        <Button
                            variant="outline"
                            className="w-full h-12 rounded-xl font-black uppercase tracking-widest text-[10px] italic opacity-70"
                            type="button"
                            onClick={() => navigate('/dashboard/menus')}
                            disabled={loading}
                        >
                            Batalkan Perubahan
                        </Button>
                    </div>

                    <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100">
                        <p className="text-[10px] font-black text-amber-800 uppercase tracking-widest mb-1 flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" /> Peringatan Integritas Data
                        </p>
                        <p className="text-[10px] text-amber-900/60 leading-relaxed font-bold italic">
                            Perubahan pada harga atau nama akan langsung berdampak pada situs publik dan keranjang belanja pelanggan yang ada.
                        </p>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default MenuForm;
