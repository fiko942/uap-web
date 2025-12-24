import React, { useState, useEffect } from 'react';
import { FolderOpen, Plus, Edit, Trash2, Search } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
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
import client from "@/api/client";

const Categories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [deletingCategory, setDeletingCategory] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({ name: '' });

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const res = await client.get('/categories');
            setCategories(res.data?.data || []);
        } catch (error) {
            console.error(error);
            toast.error("Gagal memuat data kategori.");
        } finally {
            setLoading(false);
        }
    };

    const handleOpenDialog = (category = null) => {
        if (category) {
            setEditingCategory(category);
            setFormData({ name: category.name });
        } else {
            setEditingCategory(null);
            setFormData({ name: '' });
        }
        setIsDialogOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            if (editingCategory) {
                const res = await client.put(`/categories/${editingCategory.slug}`, formData);
                toast.success(res.data?.pesan || "Kategori berhasil diperbarui.");
            } else {
                const res = await client.post('/categories', formData);
                toast.success(res.data?.pesan || "Kategori berhasil ditambahkan.");
            }
            setIsDialogOpen(false);
            fetchCategories();
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.pesan || "Terjadi kesalahan.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async () => {
        if (!deletingCategory) return;
        setSubmitting(true);

        try {
            const res = await client.delete(`/categories/${deletingCategory.slug}`);
            toast.success(res.data?.pesan || "Kategori berhasil dihapus.");
            setIsDeleteDialogOpen(false);
            setDeletingCategory(null);
            fetchCategories();
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.pesan || "Gagal menghapus kategori.");
        } finally {
            setSubmitting(false);
        }
    };

    const filteredCategories = categories.filter(cat =>
        cat.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black uppercase tracking-tight">Manajemen Kategori</h1>
                    <p className="text-muted-foreground font-medium mt-1">Kelola kategori menu restoran</p>
                </div>
                <Button onClick={() => handleOpenDialog()} className="rounded-2xl font-black uppercase text-[10px] tracking-widest">
                    <Plus className="mr-2 h-4 w-4" /> Tambah Kategori
                </Button>
            </div>

            <Card className="border-none shadow-sm rounded-[30px]">
                <CardHeader>
                    <div className="flex items-center gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                                placeholder="Cari nama kategori..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 rounded-2xl border-gray-200"
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="space-y-3">
                            {[1, 2, 3].map(i => <Skeleton key={i} className="h-16 w-full rounded-xl" />)}
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="font-black uppercase text-[10px] tracking-widest">Nama Kategori</TableHead>
                                        <TableHead className="font-black uppercase text-[10px] tracking-widest">Slug</TableHead>
                                        <TableHead className="text-right font-black uppercase text-[10px] tracking-widest">Aksi</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredCategories.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
                                                Tidak ada kategori ditemukan
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        filteredCategories.map((category) => (
                                            <TableRow key={category.id}>
                                                <TableCell className="font-bold">{category.name}</TableCell>
                                                <TableCell className="text-muted-foreground font-mono text-sm">{category.slug}</TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => handleOpenDialog(category)}
                                                            className="h-8 w-8 rounded-lg hover:bg-primary/10 hover:text-primary"
                                                        >
                                                            <Edit className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => {
                                                                setDeletingCategory(category);
                                                                setIsDeleteDialogOpen(true);
                                                            }}
                                                            className="h-8 w-8 rounded-lg hover:bg-destructive/10 hover:text-destructive"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
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

            {/* Add/Edit Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="rounded-[30px]">
                    <DialogHeader>
                        <DialogTitle className="font-black uppercase tracking-tight">
                            {editingCategory ? 'Edit Kategori' : 'Tambah Kategori Baru'}
                        </DialogTitle>
                        <DialogDescription>
                            {editingCategory ? 'Perbarui nama kategori' : 'Buat kategori menu baru'}
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit}>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="name" className="font-black uppercase text-[10px] tracking-widest">Nama Kategori</Label>
                                <Input
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ name: e.target.value })}
                                    className="rounded-2xl"
                                    placeholder="Contoh: Nasi & Mie"
                                    required
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} className="rounded-2xl">
                                Batal
                            </Button>
                            <Button type="submit" disabled={submitting} className="rounded-2xl font-black uppercase text-[10px] tracking-widest">
                                {submitting ? 'Menyimpan...' : (editingCategory ? 'Perbarui' : 'Tambah')}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent className="rounded-[30px]">
                    <DialogHeader>
                        <DialogTitle className="font-black uppercase tracking-tight">Konfirmasi Hapus</DialogTitle>
                        <DialogDescription>
                            Apakah Anda yakin ingin menghapus kategori <strong>{deletingCategory?.name}</strong>?
                            Menu dalam kategori ini tidak akan terhapus.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)} className="rounded-2xl">
                            Batal
                        </Button>
                        <Button variant="destructive" onClick={handleDelete} disabled={submitting} className="rounded-2xl font-black uppercase text-[10px] tracking-widest">
                            {submitting ? 'Menghapus...' : 'Hapus'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default Categories;
