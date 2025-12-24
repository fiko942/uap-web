import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState(() => {
        const savedCart = localStorage.getItem('gd_cart');
        return savedCart ? JSON.parse(savedCart) : [];
    });

    useEffect(() => {
        localStorage.setItem('gd_cart', JSON.stringify(cart));
    }, [cart]);

    const addToCart = (menu, quantity = 1) => {
        setCart(prev => {
            const existing = prev.find(item => item.slug === menu.slug);
            if (existing) {
                return prev.map(item =>
                    item.slug === menu.slug
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            }
            return [...prev, { ...menu, quantity }];
        });
    };

    const updateQuantity = (slug, delta) => {
        setCart(prev =>
            prev.map(item =>
                item.slug === slug
                    ? { ...item, quantity: Math.max(1, item.quantity + delta) }
                    : item
            )
        );
    };

    const removeFromCart = (slug) => {
        setCart(prev => prev.filter(item => item.slug !== slug));
    };

    const clearCart = () => setCart([]);

    const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <CartContext.Provider value={{
            cart,
            addToCart,
            updateQuantity,
            removeFromCart,
            clearCart,
            cartTotal,
            cartCount
        }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);
