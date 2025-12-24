import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import { Loader2, Utensils, ArrowRight, User, Mail, Lock, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { register } from "@/api/auth.api";

const Register = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '', password_confirmation: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.password_confirmation) {
            toast.error("Konfirmasi kata sandi tidak cocok");
            return;
        }

        setIsSubmitting(true);
        try {
            await register(formData);
            toast.success("Akun berhasil dibuat!", {
                description: "Anda sekarang dapat masuk menggunakan kredensial Anda."
            });
            setTimeout(() => navigate('/login'), 1500);
        } catch (error) {
            console.error(error);
            const errors = error.response?.data;
            if (errors) {
                const firstError = errors.pesan || Object.values(errors.errors || {})[0]?.[0] || "Pendaftaran gagal.";
                toast.error(firstError);
            } else {
                toast.error("Terjadi kesalahan yang tidak terduga.");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#fafaf9] p-4 py-12 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-[-10%] left-[-5%] w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
            <div className="absolute bottom-[-10%] right-[-5%] w-80 h-80 bg-secondary/5 rounded-full blur-3xl"></div>

            <div className="w-full max-w-[500px] space-y-8 relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="flex flex-col items-center text-center">
                    <div className="h-16 w-16 rounded-2xl bg-secondary flex items-center justify-center mb-6 shadow-2xl shadow-secondary/20 -rotate-3 transition-transform hover:rotate-0">
                        <Utensils className="h-8 w-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-black tracking-tight uppercase text-gray-900 leading-none">Bergabunglah</h1>
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mt-3 opacity-60">Daftarkan akun pelanggan untuk mulai memesan</p>
                </div>

                <Card className="border-none shadow-2xl shadow-gray-200/50 bg-white/90 backdrop-blur-xl rounded-[40px] overflow-hidden">
                    <CardHeader className="pb-4 pt-10">
                        <CardTitle className="text-2xl font-black text-center uppercase tracking-tight">Registrasi Akun</CardTitle>
                        <CardDescription className="text-center font-medium italic">
                            Menjadi anggota eksklusif Golden Dragon Wok
                        </CardDescription>
                    </CardHeader>
                    <form onSubmit={handleSubmit}>
                        <CardContent className="space-y-5 px-8">
                            <div className="space-y-2">
                                <Label htmlFor="name" className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1 italic">Nama Lengkap</Label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-300" />
                                    <Input
                                        id="name"
                                        placeholder="Contoh: Budi Santoso"
                                        className="h-14 pl-12 border-gray-100 bg-gray-50/50 focus-visible:ring-primary/20 rounded-2xl font-medium"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1 italic">Alamat Email</Label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-300" />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="nama@email.com"
                                        className="h-14 pl-12 border-gray-100 bg-gray-50/50 focus-visible:ring-primary/20 rounded-2xl font-medium"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="space-y-2">
                                    <Label htmlFor="password" className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1 italic">Kata Sandi</Label>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-300" />
                                        <Input
                                            id="password"
                                            type="password"
                                            placeholder="••••••••"
                                            className="h-14 pl-12 border-gray-100 bg-gray-50/50 focus-visible:ring-primary/20 rounded-2xl font-medium"
                                            value={formData.password}
                                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="password_confirmation" className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1 italic">Konfirmasi</Label>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-300" />
                                        <Input
                                            id="password_confirmation"
                                            type="password"
                                            placeholder="••••••••"
                                            className="h-14 pl-12 border-gray-100 bg-gray-50/50 focus-visible:ring-primary/20 rounded-2xl font-medium"
                                            value={formData.password_confirmation}
                                            onChange={(e) => setFormData({ ...formData, password_confirmation: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="flex flex-col gap-6 mt-6 pb-10 px-8">
                            <Button type="submit" className="w-full h-16 text-lg font-black rounded-2xl shadow-2xl shadow-secondary/20 bg-secondary hover:bg-secondary/90 hover:scale-[1.02] active:scale-95 transition-all uppercase text-white tracking-widest" disabled={isSubmitting}>
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                                        Memproses...
                                    </>
                                ) : (
                                    <>DAFTAR SEKARANG <ArrowRight className="ml-2 h-5 w-5" /></>
                                )}
                            </Button>
                            <div className="text-xs text-center text-muted-foreground font-black uppercase tracking-widest opacity-60">
                                Sudah memiliki akun? <Link to="/login" className="text-primary hover:underline ml-1">Masuk di sini</Link>
                            </div>
                        </CardFooter>
                    </form>
                </Card>

                <div className="flex flex-col items-center gap-4">
                    <div className="flex items-center gap-2 bg-gray-100/50 px-4 py-2 rounded-full border border-gray-100">
                        <ShieldCheck className="h-4 w-4 text-emerald-600" />
                        <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Privasi Data Terjamin</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
