import React, { useState } from 'react';
import useInventoryMovements from '../Context/useInventoryMovements';

const StockManager = () => {
    const { products, isLoading, error, stockData } = useInventoryMovements();
    const [searchTerm, setSearchTerm] = useState('');
    const [activeFilters, setActiveFilters] = useState({
        name: false,
        stockActual: false,
        stockInicial: false,
        type: false,
        categories: false,
        supplier: false,
    });

    if (isLoading) return <p>Cargando...</p>;
    if (error) return <p>Error: {error}</p>;

    const handleFilterChange = (column) => {
        setActiveFilters((prevFilters) => ({
            ...prevFilters,
            [column]: !prevFilters[column],
        }));
    };

    const isAnyFilterActive = Object.values(activeFilters).some((active) => active);

    const filteredProducts = products.filter((product) => {
        const search = searchTerm.toLowerCase();

        // Buscar en todas las columnas si no hay filtros activos
        if (!isAnyFilterActive) {
            return Object.keys(product).some((key) => {
                // Verificar solo las columnas relevantes
                if (['name', 'initial_quantity', 'type', 'categories'].includes(key)) {
                    const value = key === 'stockActual' ? stockData[product.id] : product[key];
                    return value && value.toString().toLowerCase().includes(search);
                }
                if (key === 'suppliers' && product[key]?.name) {
                    // Si el key es supplier, buscar dentro de su name
                    const value = product[key].name;
                    return value && value.toString().toLowerCase().includes(search);
                }
                return false;
            });
        }


        // Buscar solo en columnas seleccionadas si hay filtros activos
        return Object.keys(activeFilters).some((key) => {
            if (activeFilters[key]) {
                const value = key === 'stockActual' ? stockData[product.id] : product[key];
                return value && value.toString().toLowerCase().includes(search);
            }
            return false;
        });
    });

    const totalMargen = filteredProducts.reduce((total, product) => {
        const margenTotal = (Math.round(product.price * 0.81) - product.unit_cost) * product.initial_quantity;
        return total + margenTotal;
    }, 0);
    const totalCost = filteredProducts.reduce((total, product) => {
        const CostTotal = product.unit_cost * stockData[product.id];
        return total + CostTotal;
    }, 0);
    const totalSiIVA = filteredProducts.reduce((total, product) => {
        const totalSiIVA = product.price * stockData[product.id];
        return total + totalSiIVA;
    }, 0);
    const totalNoIVA = filteredProducts.reduce((total, product) => {
        const NoIVATotal = (product.price * stockData[product.id])*(1-0.19);
        return total + NoIVATotal;
    }, 0);

    return (
        <div className="bg-white min-h-screen w-screen py-24 sm:py-32">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto text-justify">
                    <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                        Control de inventario
                    </p>
                    <p className="my-6 text-lg leading-8 text-gray-600">
                        Revisa los movimientos de inventario con facilidad.
                    </p>

                    {/* Buscador */}
                    <input
                        type="text"
                        placeholder="Buscar..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="mb-4 p-2 border border-gray-300 rounded"
                    />

                    {/* Filtros de columnas */}
                    <div className="flex gap-4 mb-4">
                        {Object.keys(activeFilters).map((column) => {
                            const displayName = column
                                .replace(/([A-Z])/g, ' $1') // Espacio antes de letras mayúsculas
                                .replace(/^./, (str) => str.toUpperCase()) // Primera letra en mayúscula
                                .replace('Stock Actual', 'Stock Actual') // Asegura formato correcto
                                .replace('Stock Inicial', 'Stock Inicial') // Asegura formato correcto
                                .replace('Categories', 'Categorías') // Cambia 'Categories' a 'Categorías'
                                .replace('Name', 'Nombre') // Cambia 'Categories' a 'Categorías'
                                .replace('Supplier', 'Proveedor') // Cambia 'Supplier' a 'Proveedor'
                                .replace('Type', 'Tipo'); // Cambia 'Type' a 'Tipo'

                            return (
                                <label key={column} className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={activeFilters[column]}
                                        onChange={() => handleFilterChange(column)}
                                        className="mr-2"
                                    />
                                    {displayName}
                                </label>
                            );
                        })}
                    </div>

                    {/* Tabla resumen */}
                    <table className="mb-4 text-xs border-2 w-full">
                        <thead>
                            <tr>
                                <th className="px-2 py-2 border-2">Costo Total</th>
                                <th className="px-2 py-2 border-2">Total con IVA</th>
                                <th className="px-2 py-2 border-2">Total sin IVA</th>
                                <th className="px-2 py-2 border-2">Margen Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="px-2 py-2 border-2">${Number(totalCost.toFixed(0)).toLocaleString('es-CL')}</td>
                                <td className="px-2 py-2 border-2">${Number(totalSiIVA.toFixed(0)).toLocaleString('es-CL')}</td>
                                <td className="px-2 py-2 border-2">${Number(totalNoIVA.toFixed(0)).toLocaleString('es-CL')}</td>
                                <td className="px-2 py-2 border-2">${Number(totalMargen.toFixed(0)).toLocaleString('es-CL')}</td>
                                
                            </tr>
                        </tbody>
                    </table>

                    {/* Tabla de productos */}
                    <div className="overflow-x-auto">
                        <table className="text-xs border-2 w-full">
                            <thead className="border-2">
                                <tr>
                                    <th className="px-2 border-2">Nombre</th>
                                    <th className="px-2 border-2">Stock Actual</th>
                                    <th className="px-2 border-2">Stock Inicial</th>
                                    <th className="px-2 border-2">Costo unitario</th>
                                    <th className="px-2 border-2">Costo total</th>
                                    <th className="px-2 border-2">Precio sin IVA</th>
                                    <th className="px-2 border-2">Precio con IVA</th>
                                    <th className="px-2 border-2">Margen unitario</th>
                                    <th className="px-2 border-2">Margen total</th>
                                    <th className="px-2 border-2">Margen total porcentual</th>
                                    <th className="px-2 border-2">Tipo</th>
                                    <th className="px-2 border-2">Categorías</th>
                                    <th className="px-2 border-2">Proveedor</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredProducts.map((product) => (
                                    <tr className="border-2" key={product.id}>
                                        <td className="px-2 border-2">{product.name}</td>
                                        <td className="px-2 border-2">{stockData[product.id] !== undefined ? stockData[product.id] : 'Calculando...'}</td>
                                        <td className="px-2 border-2">{product.initial_quantity.toLocaleString('es-CL')}</td>
                                        <td className="px-2 border-2">${product.unit_cost.toLocaleString('es-CL')}</td>
                                        <td className="px-2 border-2">${(product.unit_cost * product.initial_quantity).toLocaleString('es-CL')}</td>
                                        <td className="px-2 border-2">${Number((product.price * 0.81).toFixed(0)).toLocaleString('es-CL')}</td>
                                        <td className="px-2 border-2">${product.price.toLocaleString('es-CL')}</td>
                                        <td className="px-2 border-2">${Number((product.price * 0.81).toFixed(0) - product.unit_cost).toLocaleString('es-CL')}</td>
                                        <td className="px-2 border-2">${Number(((product.price * 0.81).toFixed(0) - product.unit_cost) * stockData[product.id]).toLocaleString('es-CL')}</td>
                                        <td className="px-2 border-2">{(100*((product.price * 0.81).toFixed(0) - product.unit_cost)/product.unit_cost).toFixed(0)}%</td>
                                        <td className="px-2 border-2">{product.type}</td>
                                        <td className="px-2 border-2">{product.categories}</td>
                                        <td className="px-2 border-2">{product.suppliers.name}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StockManager;
