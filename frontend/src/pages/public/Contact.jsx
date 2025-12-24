import React, { useState } from 'react';
import {
    Mail,
    Phone,
    MessageSquare,
    Send,
    CheckCircle2,
    Loader2,
    Globe,
    Instagram,
    Facebook,
    Twitter
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { sendContactMessage } from "@/api/contact.api";

const Contact = () => {
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await sendContactMessage(formData);
            toast.success("Pesan berhasil dikirim!");
            setSubmitted(true);
            setFormData({ name: '', email: '', message: '' });
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.pesan || "Gagal mengirim pesan. Silakan coba lagi.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const contactMethods = [
        { icon: Mail, label: 'Email', value: 'hello@goldendragonwok.app', color: 'bg-blue-50 text-blue-600' },
        { icon: Phone, label: 'Hotline', value: '+62 21 888 999 11', color: 'bg-green-50 text-green-600' },
        { icon: MessageSquare, label: 'WhatsApp', value: '+62 812 3456 7890', color: 'bg-emerald-50 text-emerald-600' },
        { icon: Globe, label: 'Korporat', value: 'www.goldendragonwok.app', color: 'bg-purple-50 text-purple-600' },
    ];

    return (
        <div className="bg-[#fcfcfc] min-h-screen">
            {/* Header */}
            <section className="bg-primary pt-24 pb-32 text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 p-10 opacity-10">
                    <Send className="h-64 w-64 rotate-12 text-white" />
                </div>
                <div className="container mx-auto px-4 relative z-10">
                    <Badge className="bg-white/20 text-white border-none px-3 py-1 text-[10px] font-black uppercase tracking-widest mb-4 backdrop-blur-md italic">Hubungi Kami</Badge>
                    <h1 className="text-4xl md:text-5xl font-black text-white mb-4 uppercase tracking-tight">Mari Berdiskusi</h1>
                    <p className="text-white/80 max-w-xl mx-auto text-lg leading-relaxed font-medium">
                        Punya pertanyaan seputar menu, katering perusahaan, atau informasi karir? Sampaikan pesan Anda dan kami akan membalas dalam 24 jam.
                    </p>
                </div>
            </section>

            <div className="container mx-auto px-4 -mt-12 mb-20">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {/* Contact Info */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
                            {contactMethods.map((method, idx) => (
                                <Card key={idx} className="border-none shadow-sm hover:translate-x-2 transition-transform bg-white rounded-2xl group cursor-pointer overflow-hidden border border-gray-50">
                                    <CardContent className="p-4 flex items-center gap-4">
                                        <div className={`h-12 w-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 ${method.color}`}>
                                            <method.icon className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-60">{method.label}</p>
                                            <p className="font-bold text-gray-900 leading-tight">{method.value}</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        <Card className="bg-white border-none shadow-sm p-6 text-center rounded-[30px] border border-gray-50">
                            <h3 className="font-black uppercase text-xs tracking-widest text-muted-foreground mb-4">Informasi Sosial</h3>
                            <div className="flex justify-center gap-4">
                                <Button variant="outline" size="icon" className="rounded-2xl border-primary/20 hover:bg-primary/5 h-12 w-12 group transition-all">
                                    <Instagram className="h-5 w-5 text-primary group-hover:scale-110" />
                                </Button>
                                <Button variant="outline" size="icon" className="rounded-2xl border-primary/20 hover:bg-primary/5 h-12 w-12 group transition-all">
                                    <Facebook className="h-5 w-5 text-primary group-hover:scale-110" />
                                </Button>
                                <Button variant="outline" size="icon" className="rounded-2xl border-primary/20 hover:bg-primary/5 h-12 w-12 group transition-all">
                                    <Twitter className="h-5 w-5 text-primary group-hover:scale-110" />
                                </Button>
                            </div>
                        </Card>
                    </div>

                    {/* Contact Form */}
                    <Card className="lg:col-span-2 border-none shadow-2xl bg-white overflow-hidden rounded-[40px]">
                        <div className="h-3 bg-secondary w-full"></div>
                        <CardContent className="p-8 md:p-12">
                            {submitted ? (
                                <div className="flex flex-col items-center justify-center text-center py-12 animate-in fade-in zoom-in duration-500">
                                    <div className="h-20 w-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mb-6 shadow-inner border border-green-100">
                                        <CheckCircle2 className="h-10 w-10" />
                                    </div>
                                    <h2 className="text-3xl font-black mb-4 uppercase tracking-tighter">Pesan Terkirim!</h2>
                                    <p className="text-muted-foreground max-w-sm mb-8 font-medium italic">
                                        Terima kasih telah menghubungi Golden Dragon Wok. Tim kami akan segera merespons melalui email yang Anda berikan.
                                    </p>
                                    <Button onClick={() => setSubmitted(false)} variant="outline" className="rounded-full px-10 h-14 font-black uppercase text-[10px] tracking-widest border-primary text-primary hover:bg-primary hover:text-white transition-all shadow-lg">Kirim Pesan Lainnya</Button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-8">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-3">
                                            <Label htmlFor="name" className="text-[10px] font-black uppercase tracking-widest opacity-60 ml-1 italic">Nama Lengkap Anda</Label>
                                            <Input
                                                id="name"
                                                placeholder="Masukkan nama lengkap"
                                                className="h-14 border-gray-100 bg-gray-50/30 focus-visible:ring-primary/20 focus-visible:bg-white rounded-2xl font-medium px-5"
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div className="space-y-3">
                                            <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-widest opacity-60 ml-1 italic">Alamat Email</Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                placeholder="nama@contoh.com"
                                                className="h-14 border-gray-100 bg-gray-50/30 focus-visible:ring-primary/20 focus-visible:bg-white rounded-2xl font-medium px-5"
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <Label htmlFor="message" className="text-[10px] font-black uppercase tracking-widest opacity-60 ml-1 italic">Bagaimana kami bisa membantu Anda?</Label>
                                        <Textarea
                                            id="message"
                                            placeholder="Ceritakan pertanyaan, permintaan katering, atau masukan Anda..."
                                            className="min-h-[200px] border-gray-100 bg-gray-50/30 focus-visible:ring-primary/20 focus-visible:bg-white p-5 rounded-2xl font-medium leading-relaxed"
                                            value={formData.message}
                                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <Button type="submit" className="w-full md:w-fit px-12 h-16 text-lg font-black rounded-2xl shadow-2xl shadow-primary/20 transition-all hover:translate-y-[-4px] active:translate-y-0 uppercase tracking-widest" disabled={isSubmitting}>
                                        {isSubmitting ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Mengirim...</> : <><Send className="mr-2 h-5 w-5" /> Kirim Pesan</>}
                                    </Button>
                                </form>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default Contact;
