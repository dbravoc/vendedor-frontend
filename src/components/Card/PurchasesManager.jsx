import React, { useState, useEffect, useMemo } from 'react';
import { formatInTimeZone } from 'date-fns-tz';
import axios from 'axios';

const PurchasesManager = () => {
    const [purchases, setPurchases] = useState([]);
    const [sortConfig, setSortConfig] = useState({ key: 'time', direction: 'ascending' });
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({
        proveedor: false,
        producto: false,
        descripcion: false,
        categoria: false,
        filtros: false,
        fecha: false, // Nuevo filtro para fecha
    });
    const [dateFilter, setDateFilter] = useState({ start: '', end: '' }); // Estados para el rango de fechas

    useEffect(() => {
        const fetchPurchases = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/purchases`);
                setPurchases(response.data.purchases);
            } catch (error) {
                console.error("Error fetching purchases:", error);
            }
        };

        fetchPurchases();
    }, []);

    const requestSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    // Filtrar y ordenar las compras
    const sortedPurchases = useMemo(() => {
        return purchases
            .filter((purchase) => {
                const searchInAllFields = (field) =>
                    field?.toString().toLowerCase().includes(searchTerm.toLowerCase());
    
                // Filtrar por fecha si es necesario
                const matchesDate = () => {
                    if (!filters.fecha || (!dateFilter.start && !dateFilter.end)) return true;
                    const purchaseDate = new Date(purchase.time);
                    const startDate = new Date(dateFilter.start);
                    const endDate = new Date(dateFilter.end);
                    return (startDate ? purchaseDate >= startDate : true) && (endDate ? purchaseDate <= endDate : true);
                };
                // Si no hay filtros activos, busca en todos los campos
                if (Object.values(filters).every(value => !value)) {
                    return (
                        searchInAllFields(purchase?.suppliers?.name) ||
                        searchInAllFields(purchase?.products?.name) ||
                        searchInAllFields(purchase?.products?.description) ||
                        searchInAllFields(purchase?.products?.type) ||
                        searchInAllFields(purchase?.products?.categories) ||
                        searchInAllFields(purchase?.commission_type)
                    );
                }
                return (
                    Object.values(filters).every((value) => !value) || 
                    (filters.producto && searchInAllFields(purchase?.products?.name)) ||
                    (filters.descripcion && searchInAllFields(purchase?.products?.description)) ||
                    (filters.categoria && searchInAllFields(purchase?.products?.type)) ||
                    (filters.filtros && searchInAllFields(purchase?.products?.categories)) ||
                    (filters.commission_type && searchInAllFields(purchase?.commission_type)) ||
                    (filters.proveedor && searchInAllFields(purchase?.suppliers?.name)) ||
                    (filters.fecha && matchesDate()) // Añadido filtro por fecha
                );
            })
            .sort((a, b) => {
                let aValue, bValue;
                if (sortConfig.key === 'supplier') {
                    aValue = a?.suppliers?.name?.toLowerCase() || '';
                    bValue = b?.suppliers?.name?.toLowerCase() || '';
                } else if (sortConfig.key === 'product') {
                    aValue = a?.products?.name?.toLowerCase() || '';
                    bValue = b?.products?.name?.toLowerCase() || '';
                } else if (sortConfig.key === 'description') {
                    aValue = a?.products?.description?.toLowerCase() || '';
                    bValue = b?.products?.description?.toLowerCase() || '';
                } else if (sortConfig.key === 'categories') {
                    aValue = a?.products?.categories?.toLowerCase() || '';
                    bValue = b?.products?.categories?.toLowerCase() || '';
                } else if (sortConfig.key === 'type') {
                    aValue = a?.products?.type?.toLowerCase() || '';
                    bValue = b?.products?.type?.toLowerCase() || '';
                } else {
                    aValue = a[sortConfig.key];
                    bValue = b[sortConfig.key];
                }
    
                return sortConfig.direction === 'ascending'
                    ? aValue < bValue
                        ? -1
                        : aValue > bValue
                        ? 1
                        : 0
                    : aValue > bValue
                    ? -1
                    : aValue < bValue
                    ? 1
                    : 0;
            });
    }, [searchTerm, filters, sortConfig, purchases, dateFilter]);
    const totalCost = sortedPurchases.reduce((sum, purchase) => sum + purchase.unit_cost*purchase.quantity, 0);
    const totalPrice = sortedPurchases.reduce((sum, purchase) => sum + purchase.products.price*purchase.quantity, 0);

    return (
        <div className="bg-white min-h-screen w-screen py-24 sm:py-32">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto text-justify">
                    <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                        Detalles de Movimientos
                    </p>

                    {/* Barra de búsqueda */}
                    <input
                        type="text"
                        placeholder="Buscar..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="mb-4 p-2 border border-gray-300 rounded"
                    />

                    {/* Filtros */}
                    <div className="flex flex-row space-x-4 mt-4">
                        {Object.keys(filters).map((filterKey) => (
                            <label key={filterKey} className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={filters[filterKey]}
                                    onChange={() => setFilters({ ...filters, [filterKey]: !filters[filterKey] })}
                                    className="mr-2"
                                />
                                {filterKey.charAt(0).toUpperCase() + filterKey.slice(1)}
                            </label>
                        ))}
                    </div>

                    {/* Filtro de fecha */}
                    {filters.fecha && (
                        <div className="mt-4">
                            <label className="mr-2">Fecha desde:</label>
                            <input
                                type="date"
                                value={dateFilter.start}
                                onChange={(e) => setDateFilter({ ...dateFilter, start: e.target.value })}
                                className="mr-4 p-2 border border-gray-300 rounded"
                            />
                            <label className="mr-2">Fecha hasta:</label>
                            <input
                                type="date"
                                value={dateFilter.end}
                                onChange={(e) => setDateFilter({ ...dateFilter, end: e.target.value })}
                                className="p-2 border border-gray-300 rounded"
                            />
                        </div>
                    )}


                    {/* Tabla pequeña para mostrar el total */}
                    <table className="mb-4 w-full max-w-md ml-0 border border-gray-200 rounded-lg shadow-lg">
                        <thead>
                            <tr className="bg-gray-100 text-gray-700 text-left">
                            <th className="py-2 px-4 border-b border-gray-200">Costo Total</th>
                            <th className="py-2 px-4 border-b border-gray-200">Precio total</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="text-left text-gray-600">
                            <td className="py-2 px-4 border-b border-gray-200">${Number(totalCost.toFixed(0)).toLocaleString('es-CL')}</td>
                            <td className="py-2 px-4 border-b border-gray-200">${Number(totalPrice.toFixed(0)).toLocaleString('es-CL')}</td>
                            </tr>
                        </tbody>
                    </table>

                    {/* Tabla de compras */}
                    <table className="text-xs border-2 w-full">
                        <thead>
                            <tr>
                                <th className="border border-gray-300 p-2 cursor-pointer" onClick={() => requestSort('supplier')}>
                                    Proveedor {sortConfig.key === 'supplier' ? (sortConfig.direction === 'ascending' ? '↑' : '↓') : null}
                                </th>
                                <th className="border border-gray-300 p-2 cursor-pointer" onClick={() => requestSort('product')}>
                                    Producto {sortConfig.key === 'product' ? (sortConfig.direction === 'ascending' ? '↑' : '↓') : null}
                                </th>
                                <th className="border border-gray-300 p-2 cursor-pointer" onClick={() => requestSort('quantity')}>
                                    Cantidad {sortConfig.key === 'quantity' ? (sortConfig.direction === 'ascending' ? '↑' : '↓') : null}
                                </th>
                                <th className="border border-gray-300 p-2 cursor-pointer" onClick={() => requestSort('unit_cost')}>
                                    Costo unitario {sortConfig.key === 'unit_cost' ? (sortConfig.direction === 'ascending' ? '↑' : '↓') : null}
                                </th>
                                <th className="border border-gray-300 p-2 cursor-pointer" onClick={() => requestSort('unit_cost')}>
                                    Costo total {sortConfig.key === 'unit_cost' ? (sortConfig.direction === 'ascending' ? '↑' : '↓') : null}
                                </th>
                                <th className="border border-gray-300 p-2 cursor-pointer" onClick={() => requestSort('price')}>
                                    Precio Unitario{sortConfig.key === 'price' ? (sortConfig.direction === 'ascending' ? '↑' : '↓') : null}
                                </th>
                                <th className="border border-gray-300 p-2 cursor-pointer" onClick={() => requestSort('price')}>
                                    Precio Total{sortConfig.key === 'price' ? (sortConfig.direction === 'ascending' ? '↑' : '↓') : null}
                                </th>
                                <th className="border border-gray-300 p-2 cursor-pointer" onClick={() => requestSort('time')}>
                                    Fecha y Hora {sortConfig.key === 'time' ? (sortConfig.direction === 'ascending' ? '↑' : '↓') : null}
                                </th>
                                <th className="border border-gray-300 p-2 cursor-pointer" onClick={() => requestSort('description')}>
                                    Descripción {sortConfig.key === 'description' ? (sortConfig.direction === 'ascending' ? '↑' : '↓') : null}
                                </th>
                                <th className="border border-gray-300 p-2 cursor-pointer" onClick={() => requestSort('type')}>
                                    Categoría {sortConfig.key === 'type' ? (sortConfig.direction === 'ascending' ? '↑' : '↓') : null}
                                </th>
                                <th className="border border-gray-300 p-2 cursor-pointer" onClick={() => requestSort('categories')}>
                                    Filtros {sortConfig.key === 'categories' ? (sortConfig.direction === 'ascending' ? '↑' : '↓') : null}
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedPurchases.map((purchase, index) => (
                                <tr key={index}>
                                    <td className="border border-gray-300 p-2">{purchase.suppliers?.name}</td>
                                    <td className="border border-gray-300 p-2">{purchase.products?.name}</td>
                                    <td className="border border-gray-300 p-2">{purchase.quantity.toLocaleString('es-CL')}</td>
                                    <td className="border border-gray-300 p-2">${purchase.unit_cost.toLocaleString('es-CL')}</td>
                                    <td className="border border-gray-300 p-2">${(purchase.unit_cost*purchase.quantity).toLocaleString('es-CL')}</td>
                                    <td className="border border-gray-300 p-2">${purchase?.products?.price.toLocaleString('es-CL')}</td>
                                    <td className="border border-gray-300 p-2">${(purchase?.products?.price*purchase.quantity).toLocaleString('es-CL')}</td>
                                    <td className="border border-gray-300 p-2">{formatInTimeZone(purchase.time, 'UTC', 'yyyy-MM-dd HH:mm:ss')}</td>
                                    <td className="border border-gray-300 p-2">{purchase.products?.description}</td>
                                    <td className="border border-gray-300 p-2">{purchase.products?.type}</td>
                                    <td className="border border-gray-300 p-2">{purchase.products?.categories}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default PurchasesManager;
