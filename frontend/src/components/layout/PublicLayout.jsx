import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Utensils, ShoppingBag, Menu, X, Instagram, Facebook, Twitter, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { useAuth } from '@/auth/AuthContext';
import { useCart } from '@/context/CartContext';
import { cn } from '@/lib/utils';

const PublicLayout = () => {
    const location = useLocation();
    const { user, logout, isAuthenticated } = useAuth();
    const { cartCount } = useCart();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const navLinks = [
        { name: 'BERANDA', path: '/' },
        { name: 'MENU', path: '/menu' },
        { name: 'TENTANG KAMI', path: '/about' },
        { name: 'KONTAK', path: '/contact' },
    ];

    const isActive = (path) => location.pathname === path;

    return (
        <div className="flex flex-col min-h-screen font-sans bg-white">
            <header className="bg-white/80 backdrop-blur-xl sticky top-0 z-50 border-b border-gray-100 h-20 flex items-center shadow-sm shadow-gray-100/50 px-4 md:px-0">
                <div className="container mx-auto flex justify-between items-center">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 group shrink-0">
                        <div className="bg-primary p-2 rounded-xl transition-transform group-hover:rotate-12 shadow-lg shadow-primary/20">
                            <Utensils className="h-6 w-6 text-white" />
                        </div>
                        <span className="text-2xl font-black tracking-tighter text-gray-900 group-hover:text-primary transition-colors">
                            GOLDEN<span className="text-secondary">DRAGON</span>
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="hidden lg:flex items-center gap-8 text-[11px] font-black tracking-[0.2em] uppercase">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={cn(
                                    "transition-all border-b-2 py-1 italic",
                                    isActive(link.path)
                                        ? "text-primary border-primary scale-110"
                                        : "text-gray-400 border-transparent hover:text-primary hover:border-primary/30"
                                )}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </nav>

                    {/* Desktop Actions */}
                    <div className="hidden lg:flex items-center gap-4">
                        {isAuthenticated ? (
                            <div className="flex items-center gap-4">
                                <Link to={user?.role === 'admin' ? '/dashboard' : '/pesanan-saya'}>
                                    <Button variant="ghost" className="font-black text-gray-600 hover:text-primary uppercase tracking-widest text-[10px] italic">
                                        Halo, {user?.name?.split(' ')[0]}
                                    </Button>
                                </Link>
                                <Button variant="ghost" size="icon" onClick={logout} className="text-gray-400 hover:text-destructive h-10 w-10 rounded-full hover:bg-destructive/5 transition-colors">
                                    <LogOut className="h-5 w-5" />
                                </Button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Link to="/login">
                                    <Button variant="ghost" className="font-black text-gray-400 hover:text-primary tracking-widest text-[10px] uppercase underline decoration-2 decoration-primary/20 underline-offset-4 italic">MASUK</Button>
                                </Link>
                                <Link to="/register">
                                    <Button className="font-black px-6 shadow-xl shadow-primary/20 rounded-xl bg-primary hover:bg-primary-dark uppercase text-[10px] tracking-widest text-white">DAFTAR</Button>
                                </Link>
                            </div>
                        )}

                        <Link to="/pesanan">
                            <Button variant="secondary" className="font-black px-6 shadow-xl shadow-secondary/20 rounded-xl text-white uppercase text-[10px] tracking-widest relative">
                                <ShoppingBag className="mr-2 h-4 w-4" /> KERANJANG
                                {cartCount > 0 && (
                                    <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 bg-red-500 text-white text-[9px] font-black rounded-full border-2 border-white shadow-lg">
                                        {cartCount}
                                    </Badge>
                                )}
                            </Button>
                        </Link>
                    </div>

                    {/* Mobile Toggle */}
                    <div className="flex lg:hidden items-center gap-3">
                        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl bg-gray-50 border border-gray-100">
                                    <Menu className="h-6 w-6 text-primary" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="right" className="w-[320px] p-0 border-none bg-white rounded-l-[40px] shadow-2xl">
                                <SheetHeader className="p-8 border-b border-gray-50 text-left">
                                    <SheetTitle className="flex items-center gap-2">
                                        <div className="bg-primary p-2 rounded-lg">
                                            <Utensils className="h-5 w-5 text-white" />
                                        </div>
                                        <span className="font-black text-xl tracking-tighter">GOLDEN<span className="text-secondary">DRAGON</span></span>
                                    </SheetTitle>
                                </SheetHeader>
                                <div className="flex flex-col p-8 space-y-8">
                                    <nav className="flex flex-col gap-6">
                                        {navLinks.map((link) => (
                                            <Link
                                                key={link.path}
                                                to={link.path}
                                                onClick={() => setIsMobileMenuOpen(false)}
                                                className={cn(
                                                    "text-lg font-black uppercase tracking-[0.1em] transition-colors italic",
                                                    isActive(link.path) ? "text-primary" : "text-gray-400"
                                                )}
                                            >
                                                {link.name}
                                            </Link>
                                        ))}
                                    </nav>
                                    <div className="h-[1px] bg-gray-100 w-full opacity-50"></div>
                                    <div className="flex flex-col gap-4">
                                        {isAuthenticated ? (
                                            <>
                                                <div className="bg-gray-50/50 p-4 rounded-2xl border border-gray-100">
                                                    <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-1">Masuk sebagai</p>
                                                    <p className="font-black text-primary uppercase italic">{user?.name}</p>
                                                </div>
                                                <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>
                                                    <Button className="w-full h-14 rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg shadow-primary/10">DASBOR SAYA</Button>
                                                </Link>
                                                <Button variant="outline" className="w-full h-14 rounded-2xl font-black uppercase tracking-widest text-xs text-destructive border-destructive/20 hover:bg-destructive/5" onClick={logout}>KELUAR</Button>
                                            </>
                                        ) : (
                                            <>
                                                <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                                                    <Button variant="outline" className="w-full h-14 rounded-2xl font-black uppercase tracking-widest text-xs border-primary text-primary hover:bg-primary/5 italic">MASUK PORTAL</Button>
                                                </Link>
                                                <Link to="/register" onClick={() => setIsMobileMenuOpen(false)}>
                                                    <Button className="w-full h-14 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-primary/20 bg-primary text-white italic">BUAT AKUN BARU</Button>
                                                </Link>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </header>

            <main className="flex-grow">
                <Outlet />
            </main>

            <footer className="bg-[#111111] text-white py-24 mt-auto overflow-hidden relative">
                {/* Decorative background logo */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] pointer-events-none">
                    <Utensils className="h-[600px] w-[600px]" />
                </div>

                <div className="container mx-auto px-4 relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 lg:gap-24">
                        <div className="space-y-8">
                            <Link to="/" className="flex items-center gap-2">
                                <div className="bg-primary p-2 rounded-lg">
                                    <Utensils className="h-6 w-6 text-white" />
                                </div>
                                <span className="text-3xl font-black tracking-tighter">
                                    GOLDEN<span className="text-secondary">DRAGON</span>
                                </span>
                            </Link>
                            <p className="text-gray-400 leading-relaxed mb-8 text-sm font-medium italic">
                                Menjaga legenda 'Wok Hei' dan tradisi kuliner Kanton sejak 1998. Setiap gigitan adalah perjalanan menuju cita rasa klasik yang tak terlupakan.
                            </p>
                        </div>

                        <div>
                            <h4 className="font-black text-xs uppercase tracking-[0.3em] mb-10 text-secondary italic">Navigasi Utama</h4>
                            <ul className="space-y-5 text-gray-400 font-bold uppercase text-[10px] tracking-[0.2em]">
                                <li><Link to="/" className="hover:text-primary transition-colors flex items-center gap-3"><div className="h-1 w-2 bg-primary/40 rounded-full"></div> Beranda</Link></li>
                                <li><Link to="/menu" className="hover:text-primary transition-colors flex items-center gap-3"><div className="h-1 w-2 bg-primary/40 rounded-full"></div> Katalog Menu</Link></li>
                                <li><Link to="/about" className="hover:text-primary transition-colors flex items-center gap-3"><div className="h-1 w-2 bg-primary/40 rounded-full"></div> Kisah Kami</Link></li>
                                <li><Link to="/contact" className="hover:text-primary transition-colors flex items-center gap-3"><div className="h-1 w-2 bg-primary/40 rounded-full"></div> Hubungi Kami</Link></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-black text-xs uppercase tracking-[0.3em] mb-10 text-secondary italic">Pusat Bantuan</h4>
                            <ul className="space-y-5 text-gray-400 text-sm font-medium italic">
                                <li className="flex gap-4">
                                    <X className="h-5 w-5 text-primary shrink-0 rotate-45" />
                                    <span>Jl. Raya Donomulyo No. 123, Donomulyo, Malang, Jawa Timur</span>
                                </li>
                                <li className="flex gap-4">
                                    <X className="h-5 w-5 text-primary shrink-0 rotate-45" />
                                    <span>tobellord@gmail.com</span>
                                </li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-black text-xs uppercase tracking-[0.3em] mb-10 text-secondary italic">Jam Operasional</h4>
                            <div className="space-y-5">
                                <div className="flex justify-between items-center border-b border-white/5 pb-3">
                                    <span className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Hari Kerja</span>
                                    <span className="text-white font-black text-sm">10:00 - 22:00</span>
                                </div>
                                <div className="flex justify-between items-center border-b border-white/5 pb-3">
                                    <span className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Akhir Pekan</span>
                                    <span className="text-white font-black text-sm">10:00 - 00:00</span>
                                </div>
                                <Badge className="bg-emerald-500/10 text-emerald-500 border-none w-full justify-center py-3 mt-4 font-black uppercase text-[10px] tracking-[0.2em] rounded-xl italic">KAMI SEDANG BUKA</Badge>
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-white/5 mt-24 pt-10 flex flex-col md:flex-row justify-between items-center gap-8 text-[9px] font-black text-gray-600 uppercase tracking-[0.3em] italic">
                        <p>© {new Date().getFullYear()} WIJI FIKO TEREN. Keunggulan Kuliner Oriental Tradisional.</p>
                        <div className="flex gap-10">
                            <a href="#" className="hover:text-white transition-colors">Kebijakan Privasi</a>
                            <a href="#" className="hover:text-white transition-colors">Syarat & Ketentuan</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default PublicLayout;
