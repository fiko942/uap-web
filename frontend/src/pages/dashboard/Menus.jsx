import React, { useState, useEffect } from 'react';
import { Image as ImageIcon, Upload, Search } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { getMenus } from "@/api/menu.api";
import client from "@/api/client";

const Menus = () => {
    const [menus, setMenus] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
    const [selectedMenu, setSelectedMenu] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    useEffect(() => {
        fetchMenus();
    }, []);

    const fetchMenus = async () => {
        setLoading(true);
        try {
            const res = await getMenus();
            setMenus(res.data?.data || []);
        } catch (error) {
            console.error(error);
            toast.error("Gagal memuat data menu.");
        } finally {
            setLoading(false);
        }
    };

    const handleOpenUploadDialog = (menu) => {
        setSelectedMenu(menu);
        setImageFile(null);
        setImagePreview(null);
        setIsUploadDialogOpen(true);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                toast.error("File harus berupa gambar!");
                return;
            }
            // Validate file size (5MB)
            if (file.size > 5 * 1024 * 1024) {
                toast.error("Ukuran file maksimal 5MB!");
                return;
            }
            setImageFile(file);
            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleUpload = async () => {
        if (!imageFile || !selectedMenu) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('image', imageFile);

        try {
            const res = await client.post(`/menus/${selectedMenu.slug}/image`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            toast.success(res.data?.pesan || "Gambar berhasil diperbarui!");
            setIsUploadDialogOpen(false);
            fetchMenus();
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.pesan || "Gagal mengunggah gambar.");
        } finally {
            setUploading(false);
        }
    };

    const getImageUrl = (imagePath) => {
        if (!imagePath) return null;
        // Assuming Laravel storage is linked to public/storage
        return `${import.meta.env.VITE_API_BASE_URL.replace('/api', '')}/storage/${imagePath}`;
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(amount || 0);
    };

    const filteredMenus = menus.filter(menu =>
        menu.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black uppercase tracking-tight">Manajemen Gambar Menu</h1>
                    <p className="text-muted-foreground font-medium mt-1">Kelola gambar untuk setiap menu</p>
                </div>
            </div>

            <Card className="border-none shadow-sm rounded-[30px]">
                <CardHeader>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                            placeholder="Cari nama menu..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 rounded-2xl border-gray-200"
                        />
                    </div>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {[1, 2, 3, 4, 5, 6].map(i => <Skeleton key={i} className="h-64 rounded-2xl" />)}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredMenus.length === 0 ? (
                                <div className="col-span-full text-center py-12 text-muted-foreground">
                                    Tidak ada menu ditemukan
                                </div>
                            ) : (
                                filteredMenus.map((menu) => (
                                    <Card key={menu.id} className="border-2 border-gray-100 rounded-2xl overflow-hidden hover:border-primary/30 transition-all">
                                        <div className="aspect-video bg-gray-100 relative overflow-hidden">
                                            {menu.image_path ? (
                                                <img
                                                    src={getImageUrl(menu.image_path)}
                                                    alt={menu.name}
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                        e.target.src = `https://placehold.co/400x300/e5e7eb/6b7280?text=${encodeURIComponent(menu.name)}`;
                                                    }}
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                                                    <ImageIcon className="h-16 w-16 text-gray-400" />
                                                </div>
                                            )}
                                        </div>
                                        <CardContent className="p-4">
                                            <h3 className="font-bold text-sm mb-1 line-clamp-1">{menu.name}</h3>
                                            <p className="text-xs text-primary font-black mb-3">{formatCurrency(menu.price)}</p>
                                            <Button
                                                onClick={() => handleOpenUploadDialog(menu)}
                                                className="w-full rounded-2xl font-black uppercase text-[10px] tracking-widest"
                                                size="sm"
                                            >
                                                <Upload className="mr-2 h-3 w-3" />
                                                {menu.image_path ? 'Ganti Gambar' : 'Upload Gambar'}
                                            </Button>
                                        </CardContent>
                                    </Card>
                                ))
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Upload Dialog */}
            <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
                <DialogContent className="rounded-[30px]">
                    <DialogHeader>
                        <DialogTitle className="font-black uppercase tracking-tight">
                            Upload Gambar Menu
                        </DialogTitle>
                        <DialogDescription>
                            {selectedMenu?.name}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="image" className="font-black uppercase text-[10px] tracking-widest">
                                Pilih Gambar
                            </Label>
                            <Input
                                id="image"
                                type="file"
                                accept="image/jpeg,image/jpg,image/png,image/webp"
                                onChange={handleImageChange}
                                className="rounded-2xl"
                            />
                            <p className="text-xs text-muted-foreground">
                                Format: JPEG, JPG, PNG, WEBP. Maksimal 5MB.
                            </p>
                        </div>
                        {imagePreview && (
                            <div className="space-y-2">
                                <Label className="font-black uppercase text-[10px] tracking-widest">Preview</Label>
                                <div className="aspect-video rounded-2xl overflow-hidden border-2 border-gray-200">
                                    <img
                                        src={imagePreview}
                                        alt="Preview"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsUploadDialogOpen(false)}
                            className="rounded-2xl"
                        >
                            Batal
                        </Button>
                        <Button
                            onClick={handleUpload}
                            disabled={!imageFile || uploading}
                            className="rounded-2xl font-black uppercase text-[10px] tracking-widest"
                        >
                            {uploading ? 'Mengunggah...' : 'Upload'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default Menus;
