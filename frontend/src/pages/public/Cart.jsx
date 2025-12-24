import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
    ShoppingBag,
    Trash2,
    Plus,
    Minus,
    ArrowLeft,
    CreditCard,
    ShieldCheck,
    Utensils,
    ChevronRight,
    AlertCircle
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/context/CartContext";
import { createOrder } from "@/api/order.api";
import { toast } from "sonner";
import { useAuth } from "@/auth/AuthContext";

const Cart = () => {
    const { cart, updateQuantity, removeFromCart, clearCart, cartTotal } = useCart();
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleCheckout = async () => {
        if (!isAuthenticated) {
            toast.error("Silakan login terlebih dahulu untuk membuat pesanan.");
            navigate('/login', { state: { from: '/pesanan' } });
            return;
        }

        setIsSubmitting(true);
        try {
            const orderData = {
                items: cart.map(item => ({
                    menu_slug: item.slug,
                    qty: item.quantity
                }))
            };

            const res = await createOrder(orderData);

            if (res.status === 'berhasil') {
                toast.success("Pesanan Berhasil!", {
                    description: "Pesanan Anda sedang diproses oleh dapur kami."
                });
                clearCart();
                navigate('/pesanan-saya');
            } else {
                toast.error(res.pesan || "Terjadi kesalahan saat membuat pesanan.");
            }
        } catch (error) {
            console.error(error);
            const errMsg = error.response?.data?.pesan || "Terjadi kesalahan koneksi. Silakan coba lagi.";
            toast.error(errMsg);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (cart.length === 0) {
        return (
            <div className="min-h-screen bg-[#fafafa] pt-32 pb-20">
                <div className="container mx-auto px-4 text-center">
                    <div className="max-w-md mx-auto bg-white p-12 rounded-[40px] shadow-2xl shadow-primary/5 border border-gray-50">
                        <div className="h-24 w-24 bg-primary/5 rounded-full flex items-center justify-center mx-auto mb-8">
                            <ShoppingBag className="h-10 w-10 text-primary opacity-20" />
                        </div>
                        <h2 className="text-3xl font-black mb-4 uppercase tracking-tight">Keranjang Kosong</h2>
                        <p className="text-muted-foreground mb-10 font-medium italic">Anda belum menambahkan hidangan ke keranjang pesanan.</p>
                        <Button className="w-full h-14 rounded-2xl font-black uppercase text-[10px] tracking-widest bg-primary shadow-xl shadow-primary/20" onClick={() => navigate('/menu')}>
                            Jelajahi Menu Sekarang
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#fafafa] pt-24 pb-20">
            <div className="container mx-auto px-4">
                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Cart Items List */}
                    <div className="flex-grow space-y-8">
                        <div className="flex items-center justify-between">
                            <h1 className="text-4xl font-black uppercase tracking-tight">Keranjang <span className="text-primary">Pesanan</span></h1>
                            <Button variant="ghost" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-destructive" onClick={clearCart}>Hapus Semua</Button>
                        </div>

                        <div className="space-y-4">
                            {cart.map((item) => (
                                <Card key={item.slug} className="border-none shadow-sm rounded-[30px] overflow-hidden bg-white hover:shadow-md transition-shadow">
                                    <CardContent className="p-4 sm:p-6">
                                        <div className="flex items-center gap-6">
                                            <div className="h-24 w-24 sm:h-32 sm:w-32 rounded-2xl overflow-hidden shrink-0 bg-gray-100">
                                                <img
                                                    src={item.image_url || `https://placehold.co/200x200?text=${item.name.replace(/ /g, '+')}`}
                                                    alt={item.name}
                                                    className="h-full w-full object-cover"
                                                />
                                            </div>
                                            <div className="flex-grow">
                                                <div className="flex justify-between items-start mb-2">
                                                    <div>
                                                        <Badge variant="outline" className="text-[8px] font-black uppercase tracking-widest border-primary/20 text-primary mb-1 italic">
                                                            {item.category?.name || 'Spesial'}
                                                        </Badge>
                                                        <h3 className="font-black text-xl uppercase tracking-tighter leading-none">{item.name}</h3>
                                                    </div>
                                                    <Button variant="ghost" size="icon" className="text-gray-300 hover:text-destructive h-8 w-8 rounded-full" onClick={() => removeFromCart(item.slug)}>
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                                <p className="text-primary font-black text-lg mb-4">Rp {item.price.toLocaleString('id-ID')}</p>

                                                <div className="flex items-center justify-between mt-auto">
                                                    <div className="flex items-center gap-4 bg-gray-50 p-1 rounded-xl border border-gray-100">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 rounded-lg hover:bg-white text-gray-400"
                                                            onClick={() => updateQuantity(item.slug, -1)}
                                                        >
                                                            <Minus className="h-4 w-4" />
                                                        </Button>
                                                        <span className="font-black text-sm w-6 text-center">{item.quantity}</span>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 rounded-lg hover:bg-white text-gray-400"
                                                            onClick={() => updateQuantity(item.slug, 1)}
                                                        >
                                                            <Plus className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-[9px] font-black uppercase text-muted-foreground tracking-widest opacity-40">Subtotal</p>
                                                        <p className="font-black text-gray-900">Rp {(item.price * item.quantity).toLocaleString('id-ID')}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        <Link to="/menu" className="inline-flex items-center text-[10px] font-black uppercase tracking-widest text-primary hover:gap-3 transition-all italic mt-4 group">
                            <ArrowLeft className="h-4 w-4 mr-2" /> Tambah Menu Lainnya
                        </Link>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:w-[400px] shrink-0">
                        <div className="sticky top-32 space-y-6">
                            <Card className="border-none shadow-2xl rounded-[40px] overflow-hidden bg-white">
                                <CardContent className="p-8">
                                    <h2 className="text-2xl font-black uppercase tracking-tight mb-8">Ringkasan <span className="text-primary">Tagihan</span></h2>

                                    <div className="space-y-4 mb-8">
                                        <div className="flex justify-between items-center text-sm font-bold uppercase tracking-widest text-muted-foreground italic">
                                            <span>Subtotal</span>
                                            <span className="text-gray-900">Rp {cartTotal.toLocaleString('id-ID')}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-sm font-bold uppercase tracking-widest text-muted-foreground italic">
                                            <span>Pajak (0%)</span>
                                            <span className="text-emerald-500">GRATIS</span>
                                        </div>
                                        <Separator className="bg-gray-50" />
                                        <div className="flex justify-between items-end pt-2">
                                            <div className="flex flex-col">
                                                <span className="text-[10px] font-black uppercase text-primary tracking-widest italic">Total Pembayaran</span>
                                                <span className="text-3xl font-black tracking-tighter text-gray-900 leading-none">Rp {cartTotal.toLocaleString('id-ID')}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 flex items-center gap-4">
                                            <div className="h-10 w-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                                                <CreditCard className="h-5 w-5 text-primary" />
                                            </div>
                                            <div>
                                                <p className="text-[9px] font-black uppercase text-muted-foreground tracking-widest italic">Metode Pembayaran</p>
                                                <p className="font-black text-xs uppercase tracking-tight">Bayar di Kasir / QRIS</p>
                                            </div>
                                            <ChevronRight className="h-4 w-4 text-gray-300 ml-auto" />
                                        </div>

                                        <Button
                                            className="w-full h-16 rounded-2xl bg-primary text-white font-black uppercase tracking-[0.2em] text-[11px] shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
                                            onClick={handleCheckout}
                                            disabled={isSubmitting}
                                        >
                                            {isSubmitting ? 'MEMPROSES PESANAN...' : 'BUAT PESANAN SEKARANG'}
                                        </Button>

                                        <p className="text-center text-[9px] font-bold text-muted-foreground uppercase tracking-widest opacity-50 flex items-center justify-center gap-2 italic">
                                            <ShieldCheck className="h-3 w-3" /> Transaksi Aman & Terenkripsi
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-none shadow-sm rounded-[30px] bg-secondary/5 border border-secondary/10 overflow-hidden group">
                                <CardContent className="p-6">
                                    <div className="flex items-start gap-4">
                                        <div className="bg-secondary/20 p-2 rounded-xl group-hover:rotate-12 transition-transform">
                                            <AlertCircle className="h-5 w-5 text-secondary" />
                                        </div>
                                        <div>
                                            <h4 className="font-black text-[10px] uppercase tracking-widest text-secondary mb-1">Catatan Penting</h4>
                                            <p className="text-[10px] text-secondary font-bold leading-relaxed opacity-70 italic">
                                                Pesanan Anda akan langsung masuk ke antrean dapur. Harap selesaikan pembayaran di kasir saat mengambil pesanan atau setelah makan.
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>

            {/* Background Decorative */}
            <div className="fixed bottom-0 right-0 opacity-[0.02] pointer-events-none -mb-32 -mr-32">
                <Utensils className="h-[600px] w-[600px] text-primary" />
            </div>
        </div>
    );
};

export default Cart;
