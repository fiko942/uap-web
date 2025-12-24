import React, { useState, useEffect } from 'react';
import {
    Tag,
    Plus,
    Edit,
    Trash2,
    Search,
    Calendar,
    Percent,
    DollarSign,
    Link as LinkIcon,
    CheckCircle,
    XCircle
} from 'lucide-react';
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { getPromos, createPromo, updatePromo, deletePromo, assignPromoToMenus } from "@/api/promo.api";
import { getMenus } from "@/api/menu.api";

const Promos = () => {
    const [promos, setPromos] = useState([]);
    const [menus, setMenus] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
    const [editingPromo, setEditingPromo] = useState(null);
    const [deletingPromo, setDeletingPromo] = useState(null);
    const [assigningPromo, setAssigningPromo] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [selectedMenus, setSelectedMenus] = useState([]);

    const [formData, setFormData] = useState({
        name: '',
        type: 'persen',
        value: '',
        start_date: '',
        end_date: '',
        is_active: true
    });

    useEffect(() => {
        fetchPromos();
        fetchMenus();
    }, []);

    const fetchPromos = async () => {
        setLoading(true);
        try {
            const res = await getPromos(true); // Get all promos including inactive
            setPromos(res.data || []);
        } catch (error) {
            console.error(error);
            toast.error("Gagal memuat data promo.");
        } finally {
            setLoading(false);
        }
    };

    const fetchMenus = async () => {
        try {
            const res = await getMenus();
            setMenus(res.data?.data || []); // Extract data from axios response
        } catch (error) {
            console.error(error);
        }
    };

    const handleOpenDialog = (promo = null) => {
        if (promo) {
            setEditingPromo(promo);
            setFormData({
                name: promo.name,
                type: promo.type,
                value: promo.value,
                start_date: promo.start_date,
                end_date: promo.end_date,
                is_active: promo.is_active
            });
        } else {
            setEditingPromo(null);
            setFormData({
                name: '',
                type: 'persen',
                value: '',
                start_date: '',
                end_date: '',
                is_active: true
            });
        }
        setIsDialogOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            if (editingPromo) {
                const res = await updatePromo(editingPromo.uuid, formData);
                toast.success(res.pesan || "Promo berhasil diperbarui.");
            } else {
                const res = await createPromo(formData);
                toast.success(res.pesan || "Promo berhasil ditambahkan.");
            }
            setIsDialogOpen(false);
            fetchPromos();
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.pesan || "Terjadi kesalahan.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async () => {
        if (!deletingPromo) return;
        setSubmitting(true);

        try {
            const res = await deletePromo(deletingPromo.uuid);
            toast.success(res.pesan || "Promo berhasil dihapus.");
            setIsDeleteDialogOpen(false);
            setDeletingPromo(null);
            fetchPromos();
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.pesan || "Gagal menghapus promo.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleOpenAssignDialog = (promo) => {
        setAssigningPromo(promo);
        // Get current assigned menu IDs
        const currentMenuIds = promo.menus?.map(m => m.id) || [];
        setSelectedMenus(currentMenuIds);
        setIsAssignDialogOpen(true);
    };

    const handleAssignSubmit = async () => {
        if (!assigningPromo) return;
        setSubmitting(true);

        try {
            const res = await assignPromoToMenus(assigningPromo.uuid, selectedMenus);
            toast.success(res.pesan || "Promo berhasil diterapkan ke menu.");
            setIsAssignDialogOpen(false);
            setAssigningPromo(null);
            setSelectedMenus([]);
            fetchPromos();
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.pesan || "Gagal menerapkan promo.");
        } finally {
            setSubmitting(false);
        }
    };

    const toggleMenuSelection = (menuId) => {
        setSelectedMenus(prev =>
            prev.includes(menuId)
                ? prev.filter(id => id !== menuId)
                : [...prev, menuId]
        );
    };

    const filteredPromos = promos.filter(promo =>
        promo.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    const isPromoActive = (promo) => {
        if (!promo.is_active) return false;
        const now = new Date();
        const start = new Date(promo.start_date);
        const end = new Date(promo.end_date);
        return now >= start && now <= end;
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black uppercase tracking-tight">Manajemen Promo</h1>
                    <p className="text-muted-foreground font-medium mt-1">Kelola promo dan diskon menu</p>
                </div>
                <Button onClick={() => handleOpenDialog()} className="rounded-2xl font-black uppercase text-[10px] tracking-widest">
                    <Plus className="mr-2 h-4 w-4" /> Tambah Promo
                </Button>
            </div>

            <Card className="border-none shadow-sm rounded-[30px]">
                <CardHeader>
                    <div className="flex items-center gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                                placeholder="Cari nama promo..."
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
                                        <TableHead className="font-black uppercase text-[10px] tracking-widest">Nama Promo</TableHead>
                                        <TableHead className="font-black uppercase text-[10px] tracking-widest">Tipe</TableHead>
                                        <TableHead className="font-black uppercase text-[10px] tracking-widest">Nilai</TableHead>
                                        <TableHead className="font-black uppercase text-[10px] tracking-widest">Periode</TableHead>
                                        <TableHead className="font-black uppercase text-[10px] tracking-widest">Status</TableHead>
                                        <TableHead className="font-black uppercase text-[10px] tracking-widest">Menu</TableHead>
                                        <TableHead className="text-right font-black uppercase text-[10px] tracking-widest">Aksi</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredPromos.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                                                Tidak ada promo ditemukan
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        filteredPromos.map((promo) => (
                                            <TableRow key={promo.uuid}>
                                                <TableCell className="font-bold">{promo.name}</TableCell>
                                                <TableCell>
                                                    <Badge variant="outline" className="font-black uppercase text-[9px]">
                                                        {promo.type === 'persen' ? (
                                                            <><Percent className="mr-1 h-3 w-3" /> Persen</>
                                                        ) : (
                                                            <><DollarSign className="mr-1 h-3 w-3" /> Nominal</>
                                                        )}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="font-bold text-primary">
                                                    {promo.type === 'persen' ? `${promo.value}%` : `Rp ${Number(promo.value).toLocaleString('id-ID')}`}
                                                </TableCell>
                                                <TableCell className="text-sm text-muted-foreground">
                                                    <div className="flex items-center gap-1">
                                                        <Calendar className="h-3 w-3" />
                                                        {formatDate(promo.start_date)} - {formatDate(promo.end_date)}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    {isPromoActive(promo) ? (
                                                        <Badge variant="outline" className="font-black uppercase text-[9px] border-emerald-500 text-emerald-700">
                                                            <CheckCircle className="mr-1 h-3 w-3" /> Aktif
                                                        </Badge>
                                                    ) : (
                                                        <Badge variant="outline" className="font-black uppercase text-[9px] border-gray-300 text-gray-500">
                                                            <XCircle className="mr-1 h-3 w-3" /> Nonaktif
                                                        </Badge>
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    <span className="text-sm text-muted-foreground">
                                                        {promo.menus_count || 0} menu
                                                    </span>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => handleOpenAssignDialog(promo)}
                                                            className="h-8 w-8 rounded-lg hover:bg-blue-500/10 hover:text-blue-600"
                                                            title="Assign ke Menu"
                                                        >
                                                            <LinkIcon className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => handleOpenDialog(promo)}
                                                            className="h-8 w-8 rounded-lg hover:bg-primary/10 hover:text-primary"
                                                        >
                                                            <Edit className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => {
                                                                setDeletingPromo(promo);
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
                <DialogContent className="rounded-[30px] max-w-md">
                    <DialogHeader>
                        <DialogTitle className="font-black uppercase tracking-tight">
                            {editingPromo ? 'Edit Promo' : 'Tambah Promo Baru'}
                        </DialogTitle>
                        <DialogDescription>
                            {editingPromo ? 'Perbarui informasi promo' : 'Buat promo diskon baru untuk menu'}
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit}>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="name" className="font-black uppercase text-[10px] tracking-widest">Nama Promo</Label>
                                <Input
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="rounded-2xl"
                                    placeholder="Contoh: Diskon Akhir Tahun"
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="type" className="font-black uppercase text-[10px] tracking-widest">Tipe Diskon</Label>
                                    <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                                        <SelectTrigger className="rounded-2xl">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="persen">Persentase (%)</SelectItem>
                                            <SelectItem value="nominal">Nominal (Rp)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="value" className="font-black uppercase text-[10px] tracking-widest">Nilai</Label>
                                    <Input
                                        id="value"
                                        type="number"
                                        value={formData.value}
                                        onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                                        className="rounded-2xl"
                                        placeholder={formData.type === 'persen' ? '10' : '5000'}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="start_date" className="font-black uppercase text-[10px] tracking-widest">Tanggal Mulai</Label>
                                    <Input
                                        id="start_date"
                                        type="date"
                                        value={formData.start_date}
                                        onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                                        className="rounded-2xl"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="end_date" className="font-black uppercase text-[10px] tracking-widest">Tanggal Selesai</Label>
                                    <Input
                                        id="end_date"
                                        type="date"
                                        value={formData.end_date}
                                        onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                                        className="rounded-2xl"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="is_active"
                                    checked={formData.is_active}
                                    onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                                />
                                <Label htmlFor="is_active" className="font-medium cursor-pointer">
                                    Aktifkan promo
                                </Label>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} className="rounded-2xl">
                                Batal
                            </Button>
                            <Button type="submit" disabled={submitting} className="rounded-2xl font-black uppercase text-[10px] tracking-widest">
                                {submitting ? 'Menyimpan...' : (editingPromo ? 'Perbarui' : 'Tambah')}
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
                            Apakah Anda yakin ingin menghapus promo <strong>{deletingPromo?.name}</strong>? Promo akan dihapus dari semua menu yang terkait.
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

            {/* Assign to Menus Dialog */}
            <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
                <DialogContent className="rounded-[30px] max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="font-black uppercase tracking-tight">Terapkan Promo ke Menu</DialogTitle>
                        <DialogDescription>
                            Pilih menu yang akan mendapatkan promo <strong>{assigningPromo?.name}</strong>
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        <div className="space-y-2">
                            {menus.map((menu) => (
                                <div key={menu.id} className="flex items-center space-x-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                                    <Checkbox
                                        id={`menu-${menu.id}`}
                                        checked={selectedMenus.includes(menu.id)}
                                        onCheckedChange={() => toggleMenuSelection(menu.id)}
                                    />
                                    <Label htmlFor={`menu-${menu.id}`} className="flex-1 cursor-pointer">
                                        <div className="font-bold">{menu.name}</div>
                                        <div className="text-sm text-muted-foreground">Rp {Number(menu.price).toLocaleString('id-ID')}</div>
                                    </Label>
                                </div>
                            ))}
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsAssignDialogOpen(false)} className="rounded-2xl">
                            Batal
                        </Button>
                        <Button onClick={handleAssignSubmit} disabled={submitting} className="rounded-2xl font-black uppercase text-[10px] tracking-widest">
                            {submitting ? 'Menyimpan...' : `Terapkan ke ${selectedMenus.length} Menu`}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default Promos;
