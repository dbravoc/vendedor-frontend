import React, { useState, useEffect, useMemo } from 'react';
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
        subcategoria: false,
        fecha: false,
    });
    const [dateFilter, setDateFilter] = useState({ start: '', end: '' });

    useEffect(() => {
        const fetchPurchases = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/purchases`);
                setPurchases(response.data.data || []);

            } catch (error) {
                console.error('Error fetching purchases:', error);
            }
        };

        fetchPurchases();
    }, []);


    const requestSort = (key) => {
        setSortConfig((prevConfig) => ({
            key,
            direction: prevConfig.key === key && prevConfig.direction === 'ascending' ? 'descending' : 'ascending',
        }));
    };

    const filteredAndSortedPurchases = useMemo(() => {
        const filterBySearchTerm = (field) =>
            field?.toString().toLowerCase().includes(searchTerm.toLowerCase());

        const matchesFilters = (purchase) => {
            const matchesDate = () => {
                if (!filters.fecha || (!dateFilter.start && !dateFilter.end)) return true;
                const purchaseDate = new Date(purchase.time);
                const startDate = dateFilter.start ? new Date(dateFilter.start) : null;
                const endDate = dateFilter.end ? new Date(dateFilter.end) : null;
                return (!startDate || purchaseDate >= startDate) && (!endDate || purchaseDate <= endDate);
            };

            return (
                (filters.proveedor && filterBySearchTerm(purchase?.suppliers?.name)) ||
                (filters.producto && filterBySearchTerm(purchase?.products?.name)) ||
                (filters.descripcion && filterBySearchTerm(purchase?.products?.description)) ||
                (filters.categoria &&
                    (purchase?.categories || [])
                        .some((category) => filterBySearchTerm(category))) ||
                (filters.subcategoria &&
                    (purchase?.subcategories || [])
                        .some((subcategory) => filterBySearchTerm(subcategory))) ||
                (filters.fecha && matchesDate())
            );
        };

        const sorted = purchases
            .filter((purchase) => {
                if (searchTerm === '' && Object.values(filters).every((value) => !value)) return true;
                return matchesFilters(purchase);
            })
            .sort((a, b) => {
                const getValue = (item, key) => {
                    if (key === 'supplier') return item.suppliers?.name?.toLowerCase() || '';
                    if (key === 'product') return item.products?.name?.toLowerCase() || '';
                    if (key === 'description') return item.products?.description?.toLowerCase() || '';
                    if (key === 'categories') 
                        return (Array.isArray(item.categories) ? item.categories : []).join(', ').toLowerCase();
                    
                    if (key === 'subcategories') 
                        return (Array.isArray(item.subcategories) ? item.subcategories : []).join(', ').toLowerCase();
                    
                    return item[key];
                };

                const aValue = getValue(a, sortConfig.key);
                const bValue = getValue(b, sortConfig.key);

                if (aValue < bValue) return sortConfig.direction === 'ascending' ? -1 : 1;
                if (aValue > bValue) return sortConfig.direction === 'ascending' ? 1 : -1;
                return 0;
            });

        return sorted;
    }, [purchases, searchTerm, filters, dateFilter, sortConfig]);

    const totalCost = filteredAndSortedPurchases.reduce(
        (sum, purchase) => sum + (purchase.unit_cost || 0) * (purchase.quantity || 0),
        0
    );
    const totalPrice = filteredAndSortedPurchases.reduce(
        (sum, purchase) => sum + (purchase.products?.price || 0) * (purchase.quantity || 0),
        0
    );
console.log(purchases[25].categories)
    return (
        <div className="bg-white min-h-screen w-screen py-24 sm:py-32">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto text-justify">
                    <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                        Detalles de Compras
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

                    {/* Totales */}
                    <table className="mb-4 w-full max-w-md ml-0 border border-gray-200 rounded-lg shadow-lg">
                        <thead>
                            <tr className="bg-gray-100 text-gray-700 text-left">
                                <th className="py-2 px-4 border-b border-gray-200">Costo Total</th>
                                <th className="py-2 px-4 border-b border-gray-200">Precio Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="text-left text-gray-600">
                                <td className="py-2 px-4 border-b border-gray-200">
                                    ${Number(totalCost.toFixed(0)).toLocaleString('es-CL')}
                                </td>
                                <td className="py-2 px-4 border-b border-gray-200">
                                    ${Number(totalPrice.toFixed(0)).toLocaleString('es-CL')}
                                </td>
                            </tr>
                        </tbody>
                    </table>

                    {/* Tabla de compras */}
                    <table className="text-xs border-2 w-full">
                        <thead>
                            <tr>
                                <th className="border p-2 cursor-pointer" onClick={() => requestSort('supplier')}>Proveedor</th>
                                <th className="border p-2 cursor-pointer" onClick={() => requestSort('product')}>Producto</th>
                                <th className="border p-2 cursor-pointer" onClick={() => requestSort('quantity')}>Cantidad</th>
                                <th className="border p-2 cursor-pointer" onClick={() => requestSort('unit_cost')}>Costo unitario</th>
                                <th className="border p-2 cursor-pointer" onClick={() => requestSort('unit_cost')}>Costo total</th>
                                <th className="border p-2 cursor-pointer" onClick={() => requestSort('price')}>Precio unitario</th>
                                <th className="border p-2 cursor-pointer" onClick={() => requestSort('price')}>Precio total</th>
                                <th className="border p-2 cursor-pointer" onClick={() => requestSort('time')}>Fecha y hora</th>
                                <th className="border p-2 cursor-pointer" onClick={() => requestSort('description')}>Descripción</th>
                                <th className="border p-2 cursor-pointer" onClick={() => requestSort('categories')}>Categorías</th>
                                <th className="border p-2 cursor-pointer" onClick={() => requestSort('subcategories')}>Subcategorías</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredAndSortedPurchases.map((purchase, index) => (
                                <tr key={index}>
                                    <td className="border p-2">{purchase.suppliers?.name || 'N/A'}</td>
                                    <td className="border p-2">{purchase.products?.name || 'N/A'}</td>
                                    <td className="border p-2">{purchase.quantity}</td>
                                    <td className="border p-2">${purchase.unit_cost?.toLocaleString('es-CL')}</td>
                                    <td className="border p-2">${(purchase.unit_cost * purchase.quantity)?.toLocaleString('es-CL')}</td>
                                    <td className="border p-2">${purchase.products?.price?.toLocaleString('es-CL')}</td>
                                    <td className="border p-2">${(purchase.products?.price * purchase.quantity)?.toLocaleString('es-CL')}</td>
                                    <td className="border p-2">{new Date(purchase.time).toLocaleString('es-CL')}</td>
                                    <td className="border p-2">{purchase.products?.description || 'N/A'}</td>
                                    <td className="border p-2">
                                        {Array.isArray(purchase.categories) 
                                            ? purchase.categories.join(', ') 
                                            : ''}
                                    </td>
                                    <td className="border p-2">
                                        {Array.isArray(purchase.subcategories) 
                                            ? purchase.subcategories.join(', ') 
                                            : ''}
                                    </td>

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
