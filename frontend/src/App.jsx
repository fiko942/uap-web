import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PublicLayout from './components/layout/PublicLayout';
import DashboardLayout from './components/layout/DashboardLayout';
import Home from './pages/public/Home';
import Login from './pages/public/Login';
import Register from './pages/public/Register';
import MenuList from './pages/public/MenuList';
import MenuDetail from './pages/public/MenuDetail';
import About from './pages/public/About';
import Contact from './pages/public/Contact';
import Overview from './pages/dashboard/Overview';
import Menus from './pages/dashboard/Menus';
import Categories from './pages/dashboard/Categories';
import Orders from './pages/dashboard/Orders';
import OrderDetail from './pages/dashboard/OrderDetail';
import Users from './pages/dashboard/Users';
import Promos from './pages/dashboard/Promos';
import Contacts from './pages/dashboard/Contacts';
import MenuForm from './pages/dashboard/MenuForm';
import Cart from './pages/public/Cart';
import MyOrders from './pages/public/MyOrders';
import MyOrderDetail from './pages/public/MyOrderDetail';
import { AuthProvider } from './auth/AuthContext';
import { CartProvider } from './context/CartContext';
import ProtectedRoute from './auth/ProtectedRoute';
import { Toaster } from 'sonner';
import { Button } from '@/components/ui/button';

// Generic Placeholder for remaining internal dashboard pages
const Placeholder = ({ title }) => (
  <div className="p-8 rounded-2xl bg-white border border-dashed border-gray-200 flex flex-col items-center justify-center text-center min-h-[400px]">
    <div className="h-20 w-20 rounded-full bg-primary/5 flex items-center justify-center mb-6">
      <span className="text-4xl">🏗️</span>
    </div>
    <h2 className="text-3xl font-black font-sans tracking-tight text-gray-900">{title}</h2>
    <p className="text-muted-foreground mt-2 max-w-sm font-bold opacity-60 uppercase text-[10px] tracking-widest leading-relaxed">Modul ini sedang dalam tahap optimalisasi untuk peluncuran produksi portal Golden Dragon.</p>
    <Button variant="outline" className="mt-8 px-8 rounded-full font-black uppercase text-[10px] tracking-widest" onClick={() => window.history.back()}>Kembali</Button>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Toaster position="top-right" richColors />
        <Routes>
          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Public Routes */}
          <Route path="/" element={<PublicLayout />}>
            <Route index element={<Home />} />
            <Route path="menu" element={<MenuList />} />
            <Route path="menu/:slug" element={<MenuDetail />} />
            <Route path="about" element={<About />} />
            <Route path="contact" element={<Contact />} />
            <Route path="pesanan" element={<Cart />} />
            <Route path="pesanan-saya" element={
              <ProtectedRoute>
                <MyOrders />
              </ProtectedRoute>
            } />
            <Route path="pesanan-saya/:uuid" element={
              <ProtectedRoute>
                <MyOrderDetail />
              </ProtectedRoute>
            } />
          </Route>

          {/* Protected Dashboard Routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }>
            <Route index element={<Overview />} />
            <Route path="menus" element={<Menus />} />
            <Route path="menus/new" element={<MenuForm />} />
            <Route path="menus/:slug/edit" element={<MenuForm />} />

            <Route path="categories" element={<Categories />} />

            <Route path="orders" element={<Orders />} />
            <Route path="orders/:uuid" element={<OrderDetail />} />

            <Route path="promos" element={<Promos />} />

            <Route path="users" element={<Users />} />
            <Route path="contacts" element={<Contacts />} />

            <Route path="settings" element={<Placeholder title="Pengaturan Dasbor" />} />
          </Route>
        </Routes>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
