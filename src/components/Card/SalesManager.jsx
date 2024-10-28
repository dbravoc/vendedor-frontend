import React, { useState, useEffect } from 'react';
import obtenerInventarioMovimientos from '../Context/useMovements';

const SalesManager = () => {
    const { movements, isLoading, error } = obtenerInventarioMovimientos();
    const [productsData, setProductsData] = useState({});
    const [sortConfig, setSortConfig] = useState({ key: 'date_time', direction: 'ascending' });

    // Cargar información del producto cuando los movimientos cambien
    useEffect(() => {
        const fetchProductsData = async () => {
            if (movements.length === 0) return;

            const productIds = [...new Set(movements.map(movement => movement.id))]; // Obtén IDs únicos
            const productsPromises = productIds.map(id => {
                return fetch(`${process.env.REACT_APP_BACKEND_URL}/api/products/${id}`)
                    .then(response => {
                        if (!response.ok) {
                            throw new Error(`Error al obtener el producto con ID ${id}`);
                        }
                        return response.json();
                    })
                    .then(product => ({ id, ...product }));
            });

            try {
                const productsResults = await Promise.all(productsPromises);
                const productsMap = productsResults.reduce((acc, product) => {
                    acc[product.id] = product;
                    return acc;
                }, {});

                setProductsData(productsMap);
            } catch (err) {
                console.error('Error al obtener los productos:', err);
            }
        };

        fetchProductsData();
    }, [movements]);

    // Función para manejar el cambio de orden
    const requestSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    // Función para ordenar los movimientos
    const sortedMovements = [...movements].sort((a, b) => {
        const aValue = a[sortConfig.key] || (sortConfig.key === 'price' ? productsData[a.id]?.product?.price : a[sortConfig.key]);
        const bValue = b[sortConfig.key] || (sortConfig.key === 'price' ? productsData[b.id]?.product?.price : b[sortConfig.key]);

        if (aValue < bValue) {
            return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (aValue > bValue) {
            return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
    });

    if (isLoading) return <p>Cargando...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className="bg-white min-h-screen w-screen py-24 sm:py-32">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Detalles de Movimientos</h2>

                {/* Tabla de movimientos */}
                <table className="min-w-full border-collapse border border-gray-300">
                    <thead>
                        <tr>
                            <th className="border border-gray-300 p-2 cursor-pointer" onClick={() => requestSort('id')}>
                                Producto {sortConfig.key === 'id' ? (sortConfig.direction === 'ascending' ? '↑' : '↓') : null}
                            </th>
                            <th className="border border-gray-300 p-2 cursor-pointer" onClick={() => requestSort('type')}>
                                Tipo {sortConfig.key === 'type' ? (sortConfig.direction === 'ascending' ? '↑' : '↓') : null}
                            </th>
                            <th className="border border-gray-300 p-2 cursor-pointer" onClick={() => requestSort('price')}>
                                Precio {sortConfig.key === 'price' ? (sortConfig.direction === 'ascending' ? '↑' : '↓') : null}
                            </th>
                            <th className="border border-gray-300 p-2 cursor-pointer" onClick={() => requestSort('quantity')}>
                                Cantidad {sortConfig.key === 'quantity' ? (sortConfig.direction === 'ascending' ? '↑' : '↓') : null}
                            </th>
                            <th className="border border-gray-300 p-2 cursor-pointer" onClick={() => requestSort('date_time')}>
                                Fecha y Hora {sortConfig.key === 'date_time' ? (sortConfig.direction === 'ascending' ? '↑' : '↓') : null}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedMovements.map((movement, index) => (
                            <tr key={index}>
                                <td className="border border-gray-300 p-2">{productsData[movement.id]?.product?.name || 'Cargando...'}</td>
                                <td className="border border-gray-300 p-2">{movement.type}</td>
                                <td className="border border-gray-300 p-2">{productsData[movement.id]?.product?.price || 'Cargando...'}</td>
                                <td className="border border-gray-300 p-2">{movement.quantity}</td>
                                <td className="border border-gray-300 p-2">{movement.date_time}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default SalesManager;
