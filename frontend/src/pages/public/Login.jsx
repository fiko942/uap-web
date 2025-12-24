import React, { useState } from 'react';
import { useAuth } from '@/auth/AuthContext';
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
import { Loader2, Utensils, ArrowRight, ShieldCheck, Mail, Lock } from "lucide-react";
import { toast } from "sonner";

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            await login(email, password);
            toast.success("Login berhasil!");

            const storedUser = JSON.parse(localStorage.getItem('user'));
            if (storedUser?.role === 'admin') {
                navigate('/dashboard');
            } else {
                navigate('/');
            }
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.pesan || "Kredensial tidak valid. Silakan coba lagi.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#fafaf9] p-4 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
            <div className="absolute bottom-[-5%] left-[-5%] w-80 h-80 bg-secondary/5 rounded-full blur-3xl"></div>

            <div className="w-full max-w-[450px] space-y-8 relative z-10 animate-in fade-in zoom-in duration-500">
                <div className="flex flex-col items-center text-center">
                    <div className="h-16 w-16 rounded-2xl bg-primary flex items-center justify-center mb-6 shadow-2xl shadow-primary/20 rotate-3">
                        <Utensils className="h-8 w-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-black tracking-tight uppercase text-gray-900 leading-none">Golden Dragon</h1>
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mt-3 opacity-60">Portal Manajemen Kuliner Oriental</p>
                </div>

                <Card className="border-none shadow-2xl shadow-gray-200/50 bg-white/80 backdrop-blur-xl rounded-[40px] overflow-hidden">
                    <CardHeader className="space-y-1 pb-4 pt-10">
                        <CardTitle className="text-2xl font-black text-center uppercase tracking-tight">Portal Masuk</CardTitle>
                        <CardDescription className="text-center font-medium italic">
                            Akses personel resmi & pelanggan
                        </CardDescription>
                    </CardHeader>
                    <form onSubmit={handleSubmit}>
                        <CardContent className="space-y-6 px-8">
                            <div className="space-y-3">
                                <Label htmlFor="email" className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1 italic">Alamat Email</Label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-300" />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="nama@email.com"
                                        className="h-14 pl-12 border-gray-100 bg-gray-50/50 focus-visible:ring-primary/20 rounded-2xl font-medium"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-3">
                                <Label htmlFor="password" className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1 italic">Kata Sandi</Label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-300" />
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="••••••••"
                                        className="h-14 pl-12 border-gray-100 bg-gray-50/50 focus-visible:ring-primary/20 rounded-2xl font-medium"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="flex flex-col gap-6 mt-4 pb-10 px-8">
                            <Button type="submit" className="w-full h-16 text-lg font-black rounded-2xl shadow-2xl shadow-primary/20 bg-primary hover:scale-[1.02] active:scale-95 transition-all uppercase tracking-widest" disabled={isSubmitting}>
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                                        Memverifikasi...
                                    </>
                                ) : (
                                    <>MASUK <ArrowRight className="ml-2 h-5 w-5" /></>
                                )}
                            </Button>

                            <div className="flex flex-col items-center gap-2">
                                <p className="text-xs text-center text-muted-foreground font-black uppercase tracking-widest opacity-60">
                                    Belum punya akun? <Link to="/register" className="text-primary hover:underline ml-1">Daftar Sekarang</Link>
                                </p>
                            </div>
                        </CardFooter>
                    </form>
                </Card>

                <div className="flex flex-col items-center gap-6">
                    <div className="flex items-center gap-2 bg-gray-100/50 px-4 py-2 rounded-full border border-gray-100">
                        <ShieldCheck className="h-4 w-4 text-emerald-600" />
                        <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Enkripsi End-to-End Aktif</span>
                    </div>
                    <Link to="/" className="text-xs font-black text-muted-foreground hover:text-primary transition-colors flex items-center uppercase tracking-widest gap-2">
                        <ArrowRight className="h-4 w-4 rotate-180" /> Kembali ke Beranda
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
