import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    UtensilsCrossed,
    Tags,
    ShoppingBag,
    TicketPercent,
    Users,
    Mail,
    Settings,
    LogOut,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/auth/AuthContext';

const Sidebar = ({ collapsed, setCollapsed }) => {
    const location = useLocation();
    const { logout, user } = useAuth();
    const is_admin = user?.role === 'admin';

    const menuItems = [
        { icon: LayoutDashboard, label: 'Ringkasan', path: '/dashboard' },
        { icon: UtensilsCrossed, label: 'Kelola Menu', path: '/dashboard/menus' },
        { icon: Tags, label: 'Kategori', path: '/dashboard/categories' },
        { icon: ShoppingBag, label: 'Pesanan', path: '/dashboard/orders' },
        { icon: TicketPercent, label: 'Promo', path: '/dashboard/promos' },
        ...(is_admin ? [
            { icon: Users, label: 'Pengguna', path: '/dashboard/users' },
            { icon: Mail, label: 'Kontak', path: '/dashboard/contacts' }
        ] : []),
    ];

    return (
        <div className={cn(
            "relative flex flex-col bg-sidebar border-r border-sidebar-border transition-all duration-300",
            collapsed ? "w-20" : "w-64"
        )}>
            <div className="p-6 flex items-center justify-between border-b border-sidebar-border h-16">
                {!collapsed && <span className="text-xl font-bold text-primary truncate">Golden Dragon</span>}
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setCollapsed(!collapsed)}
                    className="ml-auto"
                >
                    {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
                </Button>
            </div>

            <nav className="flex-grow p-4 space-y-2 mt-4">
                {menuItems.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={cn(
                            "flex items-center p-3 rounded-md transition-colors",
                            location.pathname === item.path
                                ? "bg-primary text-primary-foreground shadow-sm"
                                : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                        )}
                        title={collapsed ? item.label : ""}
                    >
                        <item.icon className={cn("h-5 w-5", collapsed ? "mx-auto" : "mr-3")} />
                        {!collapsed && <span className="font-medium">{item.label}</span>}
                    </Link>
                ))}
            </nav>

            <div className="p-4 border-t border-sidebar-border space-y-2">
                <Link
                    to="/dashboard/settings"
                    className={cn(
                        "flex items-center p-3 rounded-md text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors",
                        location.pathname === '/dashboard/settings' && "bg-sidebar-accent"
                    )}
                    title={collapsed ? "Pengaturan" : ""}
                >
                    <Settings className={cn("h-5 w-5", collapsed ? "mx-auto" : "mr-3")} />
                    {!collapsed && <span className="font-medium">Pengaturan</span>}
                </Link>
                <button
                    onClick={logout}
                    className="w-full flex items-center p-3 rounded-md text-destructive hover:bg-destructive/10 transition-colors"
                    title={collapsed ? "Keluar" : ""}
                >
                    <LogOut className={cn("h-5 w-5", collapsed ? "mx-auto" : "mr-3")} />
                    {!collapsed && <span className="font-medium">Keluar</span>}
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
