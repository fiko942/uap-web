import React from 'react';
import {
    Bell,
    Search,
    User as UserIcon,
    Menu
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from '@/auth/AuthContext';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Sidebar from './Sidebar';

const Topbar = ({ setMobileMenuOpen }) => {
    const { user, logout } = useAuth();

    return (
        <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-6 sticky top-0 z-30">
            <div className="flex items-center gap-4 flex-1">
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon" className="md:hidden">
                            <Menu className="h-5 w-5" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="p-0 w-64">
                        <Sidebar collapsed={false} setCollapsed={() => { }} />
                    </SheetContent>
                </Sheet>

                <div className="relative w-full max-w-md hidden sm:block">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                        placeholder="Cari di dasbor..."
                        className="pl-10 bg-gray-50 border-none h-9 focus-visible:ring-primary/20"
                    />
                </div>
            </div>

            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    <span className="absolute top-2 right-2 h-2 w-2 bg-primary rounded-full border-2 border-white"></span>
                </Button>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="flex items-center gap-2 pl-2">
                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                {user?.name?.[0]?.toUpperCase() || 'A'}
                            </div>
                            <div className="hidden md:block text-left">
                                <p className="text-sm font-semibold leading-none">{user?.name || 'Admin'}</p>
                                <p className="text-xs text-muted-foreground mt-1 capitalize">{user?.role === 'admin' ? 'Administrator' : 'Staf'}</p>
                            </div>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                        <DropdownMenuLabel>Akun Saya</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                            <UserIcon className="mr-2 h-4 w-4" />
                            <span>Pengaturan Profil</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={logout} className="text-destructive">
                            <span>Keluar</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
};

export default Topbar;
