import React, { createContext, useContext, useState, useEffect } from 'react';

// Crear el contexto
const ShoppingCartContext = createContext();

// Proveedor del contexto
export const ShoppingCartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);

    // Función para consultar el stock disponible desde el backend
    const checkStock = async (itemId) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/stock/${itemId}`);
            if (!response.ok) {
                throw new Error(`Error al consultar el stock: ${response.statusText}`);
            }
            const data = await response.json();
            return data.currentStock;
        } catch (error) {
            console.error('Error al verificar el stock:', error);
            return null;
        }
    };

    // Función para agregar o actualizar un ítem en el carrito
    const addItemToCart = async (item) => {
        const stockDisponible = await checkStock(item.id);

        setCart((prevCart) => {
            const existingItemIndex = prevCart.findIndex(cartItem => cartItem.id === item.id);
            if (existingItemIndex !== -1) {
                // Si el ítem ya existe, actualizar la cantidad si no se excede el stock disponible
                const updatedCart = [...prevCart];
                const newCantidad = updatedCart[existingItemIndex].cantidad + item.cantidad;
                if (newCantidad <= stockDisponible) {
                    updatedCart[existingItemIndex] = {
                        ...updatedCart[existingItemIndex],
                        cantidad: newCantidad,
                    };
                    return updatedCart;
                } else {
                    alert("No hay suficiente stock disponible.");
                    return prevCart;
                }
            } else {
                // Si el ítem no existe, agregarlo al carrito si no se excede el stock disponible
                if (item.cantidad <= stockDisponible) {
                    return [...prevCart, item];
                } else {
                    alert("No hay suficiente stock disponible.");
                    return prevCart;
                }
            }
        });
    };

    // Función para eliminar un ítem del carrito
    const removeItemFromCart = (id) => {
        setCart((prevCart) => prevCart.filter(cartItem => cartItem.id !== id));
    };

    // Función para limpiar el carrito
    const clearCart = () => {
        setCart([]);
    };

    return (
        <ShoppingCartContext.Provider value={{ cart, addItemToCart, removeItemFromCart, clearCart }}>
            {children}
        </ShoppingCartContext.Provider>
    );
};

// Hook personalizado para usar el contexto
export const useShoppingCart = () => useContext(ShoppingCartContext);