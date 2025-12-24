import React from 'react';
import {
    Utensils,
    Users,
    MapPin,
    Clock,
    ChefHat,
    Heart,
    ShieldCheck,
    Star
} from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const About = () => {
    const stats = [
        { icon: Utensils, label: 'Resep Tradisional', value: '100+' },
        { icon: Users, label: 'Pelanggan Puas', value: '50rb+' },
        { icon: Star, label: 'Rating Rata-rata', value: '4.8/5' },
        { icon: MapPin, label: 'Cabang Utama', value: '10' },
    ];

    const values = [
        {
            icon: ChefHat,
            title: "Keahlian Master",
            description: "Chef kami membawa pengalaman puluhan tahun dalam seni kuliner Kanton dan Szechuan, memastikan setiap hidangan adalah mahakarya 'wok hei'."
        },
        {
            icon: ShieldCheck,
            title: "Bahan Berkualitas",
            description: "Kami mendatangkan bumbu langsung dari provinsi Szechuan dan makanan laut segar dari pasar lokal setiap hari untuk menjaga autentisitas mutlak."
        },
        {
            icon: Heart,
            title: "Hospitalitas Oriental",
            description: "Berakar pada nilai-nilai tradisional, kami memperlakukan setiap tamu seperti keluarga, memberikan lingkungan yang hangat untuk pengalaman bersantap Anda."
        }
    ];

    return (
        <div className="bg-[#fdfcfb]">
            {/* Hero Section */}
            <section className="relative h-[300px] flex items-center justify-center text-center overflow-hidden">
                <div className="absolute inset-0">
                    <img
                        src="https://images.unsplash.com/photo-1514326640560-7d063ef2aed5?auto=format&fit=crop&q=80&w=2000"
                        className="w-full h-full object-cover brightness-[0.4]"
                        alt="About Hero"
                    />
                </div>
                <div className="relative z-10 container mx-auto px-4">
                    <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-2 uppercase">Legenda Golden Dragon</h1>
                    <div className="h-1 w-24 bg-primary mx-auto mb-4"></div>
                    <p className="text-white/80 text-lg max-w-xl mx-auto font-medium italic opacity-80">Membudayakan keunggulan kuliner oriental sejak 1998.</p>
                </div>
            </section>

            {/* Story Section */}
            <section className="py-20 container mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div className="relative">
                        <img
                            src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=1000"
                            className="rounded-[40px] shadow-2xl z-10 relative border-8 border-white"
                            alt="Kitchen"
                        />
                        <div className="absolute -bottom-8 -right-8 h-64 w-64 bg-primary/10 rounded-full -z-0"></div>
                        <div className="absolute -top-10 -left-10 h-32 w-32 border-4 border-secondary/20 rounded-full -z-0"></div>
                    </div>
                    <div className="space-y-6">
                        <Badge className="bg-primary/10 text-primary border-none text-[10px] uppercase font-black tracking-widest px-4 py-1 italic">Kisah Kami</Badge>
                        <h2 className="text-4xl font-black tracking-tight text-gray-900 leading-tight uppercase">Membawa Jiwa <span className="text-primary italic">Canton</span> Ke Meja Anda</h2>
                        <p className="text-muted-foreground text-lg leading-relaxed font-medium">
                            Golden Dragon Wok UAP didirikan dengan satu misi: melestarikan seni memasak kuali (wok) tradisional yang mulai memudar sambil beradaptasi dengan selera modern. Bermula dari kedai kecil di jantung Pecinan, kini telah berkembang menjadi sensasi regional.
                        </p>
                        <p className="text-muted-foreground text-lg leading-relaxed font-medium">
                            Kami percaya bahwa makanan lebih dari sekadar asupan; ia adalah jembatan antar budaya dan generasi. Setiap dentuman kuali dan kedetailan irisan jahe adalah penghormatan bagi para master terdahulu.
                        </p>
                        <div className="grid grid-cols-2 gap-6 pt-4">
                            {stats.map((stat, i) => (
                                <div key={i} className="flex flex-col">
                                    <span className="text-3xl font-black text-primary tracking-tighter">{stat.value}</span>
                                    <span className="text-[10px] text-muted-foreground font-black uppercase tracking-widest opacity-60 italic">{stat.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="py-24 bg-primary/5">
                <div className="container mx-auto px-4">
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <h2 className="text-3xl font-black uppercase tracking-tight mb-4">Apa Yang Mendefinisikan Kami</h2>
                        <p className="text-muted-foreground font-medium italic">Komitmen kami terhadap kesempurnaan tercermin dalam setiap aspek pengalaman di Golden Dragon.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {values.map((v, i) => (
                            <Card key={i} className="border-none shadow-xl hover:shadow-2xl transition-all duration-500 p-6 bg-white rounded-[35px]">
                                <CardContent className="pt-6 space-y-4 text-center">
                                    <div className="h-16 w-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto text-primary">
                                        <v.icon className="h-8 w-8" />
                                    </div>
                                    <h3 className="text-xl font-black uppercase tracking-tight">{v.title}</h3>
                                    <p className="text-sm text-muted-foreground leading-relaxed font-medium opacity-80">{v.description}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Practical Info Section */}
            <section className="py-24 container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <div className="space-y-8">
                        <div>
                            <h2 className="text-3xl font-black uppercase tracking-tight mb-2">Kunjungi Kami</h2>
                            <p className="text-muted-foreground italic font-medium">Rasakan atmosfer autentik secara langsung.</p>
                        </div>

                        <div className="space-y-8">
                            <div className="flex gap-4 group">
                                <div className="h-14 w-14 bg-secondary/10 rounded-2xl flex items-center justify-center text-secondary shrink-0 transition-transform group-hover:rotate-6 shadow-sm">
                                    <MapPin className="h-6 w-6" />
                                </div>
                                <div>
                                    <p className="font-black text-xs uppercase tracking-widest mb-1">Outlet Utama</p>
                                    <p className="text-muted-foreground font-medium text-sm leading-relaxed">Jl. Naga Emas No. 88, Kawasan Bisnis Pusat, Jakarta 12345</p>
                                </div>
                            </div>

                            <div className="flex gap-4 group">
                                <div className="h-14 w-14 bg-secondary/10 rounded-2xl flex items-center justify-center text-secondary shrink-0 transition-transform group-hover:-rotate-6 shadow-sm">
                                    <Clock className="h-6 w-6" />
                                </div>
                                <div>
                                    <p className="font-black text-xs uppercase tracking-widest mb-1">Jam Operasional</p>
                                    <p className="text-muted-foreground font-medium text-sm leading-tight">Senin - Kamis: 10:00 - 22:00 WIB</p>
                                    <p className="text-muted-foreground font-medium text-sm mt-1">Jumat - Minggu: 10:00 - 23:30 WIB</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-[40px] overflow-hidden shadow-2xl border-8 border-white h-[450px] rotate-1">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126920.24151703644!2d106.74412953289901!3d-6.229386689617304!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f3e945e3faab%3A0x47c0ef9c0d3a046!2sGolden%20Dragon%20Wok!5e0!3m2!1sid!4v1703410000000!5m2!1sid"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen=""
                            loading="lazy"
                            title="lokasi"
                        ></iframe>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default About;
