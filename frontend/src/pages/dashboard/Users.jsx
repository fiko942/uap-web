import React, { useState, useEffect } from 'react';
import {
    Users as UsersIcon,
    UserPlus,
    Edit,
    Trash2,
    Ban,
    CheckCircle,
    Shield,
    User,
    Mail,
    Lock,
    Search
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { getUsers, createUser, updateUser, deleteUser, banUser, unbanUser } from "@/api/user.api";

const Users = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [deletingUser, setDeletingUser] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'customer'
    });

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const res = await getUsers();
            setUsers(res.data || []);
        } catch (error) {
            console.error(error);
            toast.error("Gagal memuat data user.");
        } finally {
            setLoading(false);
        }
    };

    const handleOpenDialog = (user = null) => {
        if (user) {
            setEditingUser(user);
            setFormData({
                name: user.name,
                email: user.email,
                password: '',
                role: user.role
            });
        } else {
            setEditingUser(null);
            setFormData({
                name: '',
                email: '',
                password: '',
                role: 'customer'
            });
        }
        setIsDialogOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            if (editingUser) {
                const res = await updateUser(editingUser.uuid, formData);
                toast.success(res.pesan || "User berhasil diperbarui.");
            } else {
                const res = await createUser(formData);
                toast.success(res.pesan || "User berhasil ditambahkan.");
            }
            setIsDialogOpen(false);
            fetchUsers();
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.pesan || "Terjadi kesalahan.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async () => {
        if (!deletingUser) return;
        setSubmitting(true);

        try {
            const res = await deleteUser(deletingUser.uuid);
            toast.success(res.pesan || "User berhasil dihapus.");
            setIsDeleteDialogOpen(false);
            setDeletingUser(null);
            fetchUsers();
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.pesan || "Gagal menghapus user.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleBanToggle = async (user) => {
        try {
            if (user.is_banned) {
                const res = await unbanUser(user.uuid);
                toast.success(res.pesan || "User berhasil diaktifkan.");
            } else {
                const res = await banUser(user.uuid);
                toast.success(res.pesan || "User berhasil ditangguhkan.");
            }
            fetchUsers();
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.pesan || "Terjadi kesalahan.");
        }
    };

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black uppercase tracking-tight">Manajemen User</h1>
                    <p className="text-muted-foreground font-medium mt-1">Kelola akun pengguna sistem</p>
                </div>
                <Button onClick={() => handleOpenDialog()} className="rounded-2xl font-black uppercase text-[10px] tracking-widest">
                    <UserPlus className="mr-2 h-4 w-4" /> Tambah User
                </Button>
            </div>

            <Card className="border-none shadow-sm rounded-[30px]">
                <CardHeader>
                    <div className="flex items-center gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                                placeholder="Cari nama atau email..."
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
                                        <TableHead className="font-black uppercase text-[10px] tracking-widest">Nama</TableHead>
                                        <TableHead className="font-black uppercase text-[10px] tracking-widest">Email</TableHead>
                                        <TableHead className="font-black uppercase text-[10px] tracking-widest">Role</TableHead>
                                        <TableHead className="font-black uppercase text-[10px] tracking-widest">Status</TableHead>
                                        <TableHead className="text-right font-black uppercase text-[10px] tracking-widest">Aksi</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredUsers.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                                Tidak ada user ditemukan
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        filteredUsers.map((user) => (
                                            <TableRow key={user.uuid}>
                                                <TableCell className="font-bold">{user.name}</TableCell>
                                                <TableCell className="text-muted-foreground">{user.email}</TableCell>
                                                <TableCell>
                                                    <Badge variant={user.role === 'admin' ? 'default' : 'secondary'} className="font-black uppercase text-[9px]">
                                                        {user.role === 'admin' ? <Shield className="mr-1 h-3 w-3" /> : <User className="mr-1 h-3 w-3" />}
                                                        {user.role}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    {user.is_banned ? (
                                                        <Badge variant="destructive" className="font-black uppercase text-[9px]">
                                                            <Ban className="mr-1 h-3 w-3" /> Ditangguhkan
                                                        </Badge>
                                                    ) : (
                                                        <Badge variant="outline" className="font-black uppercase text-[9px] border-emerald-500 text-emerald-700">
                                                            <CheckCircle className="mr-1 h-3 w-3" /> Aktif
                                                        </Badge>
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => handleOpenDialog(user)}
                                                            className="h-8 w-8 rounded-lg hover:bg-primary/10 hover:text-primary"
                                                        >
                                                            <Edit className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => handleBanToggle(user)}
                                                            className={`h-8 w-8 rounded-lg ${user.is_banned ? 'hover:bg-emerald-500/10 hover:text-emerald-600' : 'hover:bg-yellow-500/10 hover:text-yellow-600'}`}
                                                        >
                                                            {user.is_banned ? <CheckCircle className="h-4 w-4" /> : <Ban className="h-4 w-4" />}
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => {
                                                                setDeletingUser(user);
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
                            {editingUser ? 'Edit User' : 'Tambah User Baru'}
                        </DialogTitle>
                        <DialogDescription>
                            {editingUser ? 'Perbarui informasi user' : 'Buat akun user baru untuk sistem'}
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit}>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="name" className="font-black uppercase text-[10px] tracking-widest">Nama Lengkap</Label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <Input
                                        id="name"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="pl-10 rounded-2xl"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email" className="font-black uppercase text-[10px] tracking-widest">Email</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <Input
                                        id="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="pl-10 rounded-2xl"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password" className="font-black uppercase text-[10px] tracking-widest">
                                    Password {editingUser && '(Kosongkan jika tidak diubah)'}
                                </Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <Input
                                        id="password"
                                        type="password"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        className="pl-10 rounded-2xl"
                                        required={!editingUser}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="role" className="font-black uppercase text-[10px] tracking-widest">Role</Label>
                                <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
                                    <SelectTrigger className="rounded-2xl">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="customer">Customer</SelectItem>
                                        <SelectItem value="admin">Admin</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} className="rounded-2xl">
                                Batal
                            </Button>
                            <Button type="submit" disabled={submitting} className="rounded-2xl font-black uppercase text-[10px] tracking-widest">
                                {submitting ? 'Menyimpan...' : (editingUser ? 'Perbarui' : 'Tambah')}
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
                            Apakah Anda yakin ingin menghapus user <strong>{deletingUser?.name}</strong>? Tindakan ini tidak dapat dibatalkan.
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

export default Users;
