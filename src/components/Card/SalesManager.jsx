import React, { useState, useEffect, useMemo } from 'react';
import obtenerInventarioMovimientos from '../Context/useMovements';
import { format } from 'date-fns';

const SalesManager = () => {
    const { movements, isLoading, error } = obtenerInventarioMovimientos();
    const [productsData, setProductsData] = useState({});
    const [sortConfig, setSortConfig] = useState({ key: 'date_time', direction: 'ascending' });
    const [searchTerm, setSearchTerm] = useState(''); // Estado para el término de búsqueda
    const [filters, setFilters] = useState({
        product: false,
        type: false,
        commission: false,
        seller: false,
        supplier: false,
        client: false,
    });

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


    const calculatedMovements = movements.map((movement) => {
        const price = productsData[movement.id]?.product?.price || 0;
        const quantity = movement.quantity || 0;
        const discount = movement.discount || 0;
    
        const price_total = price * quantity;
        const price_final = price_total * (1 - discount / 100);
        const price_final_noiva = price_final * (1 - 0.19); // Si 0.19 es el IVA
        const unit_cost = productsData[movement.id]?.product?.unit_cost || 0;
        const margen = price_final_noiva - (unit_cost * quantity);
        const margen_porcentual = unit_cost ? (margen / (unit_cost * quantity)) * 100 : 0;
    
        // Cálculo de la comisión basado en el tipo
        const commission_type = movement.commission_type; // Asegúrate de que este campo existe en tus movimientos
        let commission_seller = 0; // Inicializa en 0
    
        if (commission_type === 'tienda') {
            commission_seller = price_final * 0.06; // 6% para tipo tienda
        } else if (commission_type === 'emprendedor') {
            commission_seller = price_final * 0.03; // 3% para tipo emprendedor
        } else  {
            commission_seller = price_final * 0.03; // 3% para cualquier otro tipo
        }
    
        return {
            ...movement,
            price_total,
            price_final,
            price_final_noiva,
            unit_cost,
            margen,
            margen_porcentual,
            commission_seller, // Agrega el monto de la comisión al objeto de movimiento
        };
    });
    


    // Función para ordenar los movimientos
/*     const sortedMovements = [...calculatedMovements].sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];
    
        // Si es necesario, ajusta valores calculados específicos que pueden requerir una lógica adicional
        if (sortConfig.key === 'price' && (aValue === undefined || bValue === undefined)) {
            aValue = productsData[a.id]?.product?.price || 0;
            bValue = productsData[b.id]?.product?.price || 0;
        }
    
        // Comparación de valores (manejo de direcciones ascendentes y descendentes)
        if (aValue < bValue) {
            return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (aValue > bValue) {
            return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
    }); */
    
/*     const sortedMovements = [...calculatedMovements]
    .filter((movement) => {
        const allFiltersUnchecked = Object.values(filters).every((isChecked) => !isChecked);
        const productName = productsData[movement.id]?.product?.name?.toLowerCase() || '';
        const seller = movement.seller?.toLowerCase() || '';
        const type = movement.type?.toLowerCase() || '';
        const commission = productsData[movement.id]?.product?.commission_type?.toLowerCase() || '';
        const supplier = productsData[movement.id]?.product?.suppliers?.name?.toLowerCase() || '';
        const client = movement.client?.toLowerCase() || '';
        const lowerSearchTerm = searchTerm.toLowerCase();

        // Si todos los filtros están desmarcados, busca en todos los campos
        return (
            (allFiltersUnchecked ||
                (filters.product && productName.includes(lowerSearchTerm)) ||
                (filters.seller && seller.includes(lowerSearchTerm)) ||
                (filters.type && type.includes(lowerSearchTerm)) ||
                (filters.commission && commission.includes(lowerSearchTerm)) ||
                (filters.supplier && supplier.includes(lowerSearchTerm)) ||
                (filters.client && client.includes(lowerSearchTerm))
            )
        );
    })
    .sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        if (sortConfig.key === 'price' && (aValue === undefined || bValue === undefined)) {
            aValue = productsData[a.id]?.product?.price || 0;
            bValue = productsData[b.id]?.product?.price || 0;
        }

        if (aValue < bValue) {
            return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (aValue > bValue) {
            return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
    }); */

    const sortedMovements = useMemo(() => {
        return calculatedMovements
            .filter((movement) => {
                const isEmptyFilter = Object.values(filters).every((value) => !value);
    
                // Realiza la búsqueda en todos los campos si no hay filtros seleccionados
                const searchInAllFields = (field) =>
                    field?.toLowerCase().includes(searchTerm.toLowerCase());
    
                return (
                    isEmptyFilter
                        ? // Si no hay filtros activos, busca en todos los campos
                          searchInAllFields(movement.product) ||
                          searchInAllFields(movement.type) ||
                          searchInAllFields(movement.commission) ||
                          searchInAllFields(movement.seller) ||
                          searchInAllFields(movement.supplier) ||
                          searchInAllFields(movement.client)
                        : // Si hay filtros activos, aplica solo en los campos marcados
                          (filters.product && searchInAllFields(movement.product)) ||
                          (filters.type && searchInAllFields(movement.type)) ||
                          (filters.commission && searchInAllFields(String(movement.commission))) ||
                          (filters.seller && searchInAllFields(movement.seller)) ||
                          (filters.supplier && searchInAllFields(movement.supplier)) ||
                          (filters.client && searchInAllFields(movement.client))
                );
            })
            .sort((a, b) => {
                let aValue = a[sortConfig.key];
                let bValue = b[sortConfig.key];
    
                if (sortConfig.key === 'price' && (aValue === undefined || bValue === undefined)) {
                    aValue = productsData[a.id]?.product?.price || 0;
                    bValue = productsData[b.id]?.product?.price || 0;
                }
    
                return sortConfig.direction === 'ascending'
                    ? aValue < bValue ? -1 : aValue > bValue ? 1 : 0
                    : aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
            });
    }, [searchTerm, filters, calculatedMovements, sortConfig, productsData]);
    

    // Calcular la suma total de `price_final_noiva` en movimientos filtrados
    const totalPriceFinalNoIVA = sortedMovements.reduce((sum, movement) => sum + movement.price_final_noiva, 0);
    const totalMargen = sortedMovements.reduce((sum, movement) => sum + (movement.margen || 0), 0);
    const totalCommission = sortedMovements.reduce((sum, movement) => sum + (movement.commission_seller || 0), 0);


    if (isLoading) return <p>Cargando...</p>;
    if (error) return <p>Error: {error}</p>;
    return (
        <div className="bg-white min-h-screen w-screen py-24 sm:py-32">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto text-justify">
                    <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                        Detalles de Movimientos
                    </p>

                    {/* Buscador */}
                    <input
                        type="text"
                        placeholder="Buscar..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="mb-4 p-2 border border-gray-300 rounded"
                    />
                    
                    <div className="flex flex-row space-x-4">
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                checked={filters.product}
                                onChange={() => setFilters({ ...filters, product: !filters.product })}
                                className="mr-2"
                            />
                            Producto
                        </label>
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                checked={filters.type}
                                onChange={() => setFilters({ ...filters, type: !filters.type })}
                                className="mr-2"
                            />
                            Tipo
                        </label>
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                checked={filters.commission}
                                onChange={() => setFilters({ ...filters, commission: !filters.commission })}
                                className="mr-2"
                            />
                            Comisión
                        </label>
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                checked={filters.seller}
                                onChange={() => setFilters({ ...filters, seller: !filters.seller })}
                                className="mr-2"
                            />
                            Vendedor
                        </label>
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                checked={filters.supplier}
                                onChange={() => setFilters({ ...filters, supplier: !filters.supplier })}
                                className="mr-2"
                            />
                            Proveedor
                        </label>
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                checked={filters.client}
                                onChange={() => setFilters({ ...filters, client: !filters.client })}
                                className="mr-2"
                            />
                            Cliente
                        </label>
                    </div>


                    {/* Tabla pequeña para mostrar el total */}
            <table className="mb-4">
                <thead>
                    <tr>
                        <th>Total Final sin IVA</th>
                        <th>Margen</th>
                        <th>Comisión vendedor</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>{totalPriceFinalNoIVA.toFixed(0)}</td>
                        <td>{totalMargen.toFixed(0)}</td>
                        <td>{totalCommission.toFixed(0)}</td>
                    </tr>
                </tbody>
            </table>



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
                                <th className="border border-gray-300 p-2 cursor-pointer" onClick={() => requestSort('commission_type')}>
                                    Comisión {sortConfig.key === 'commission_type' ? (sortConfig.direction === 'ascending' ? '↑' : '↓') : null}
                                </th>
                                <th className="border border-gray-300 p-2 cursor-pointer" onClick={() => requestSort('seller')}>
                                    Vendedor {sortConfig.key === 'seller' ? (sortConfig.direction === 'ascending' ? '↑' : '↓') : null}
                                </th>
                                <th className="border border-gray-300 p-2 cursor-pointer" onClick={() => requestSort('quantity')}>
                                    Cantidad {sortConfig.key === 'quantity' ? (sortConfig.direction === 'ascending' ? '↑' : '↓') : null}
                                </th>
                                <th className="border border-gray-300 p-2 cursor-pointer" onClick={() => requestSort('price')}>
                                    Valor unitario {sortConfig.key === 'price' ? (sortConfig.direction === 'ascending' ? '↑' : '↓') : null}
                                </th>
                                <th className="border border-gray-300 p-2 cursor-pointer" onClick={() => requestSort('price_total')}>
                                    Valor total sin descuento {sortConfig.key === 'price_total' ? (sortConfig.direction === 'ascending' ? '↑' : '↓') : null}
                                </th>
                                <th className="border border-gray-300 p-2 cursor-pointer" onClick={() => requestSort('discount')}>
                                    Descuento {sortConfig.key === 'discount' ? (sortConfig.direction === 'ascending' ? '↑' : '↓') : null}
                                </th>
                                <th className="border border-gray-300 p-2 cursor-pointer" onClick={() => requestSort('price_final')}>
                                    Valor final {sortConfig.key === 'price_final' ? (sortConfig.direction === 'ascending' ? '↑' : '↓') : null}
                                </th>
                                <th className="border border-gray-300 p-2 cursor-pointer" onClick={() => requestSort('price_final_noiva')}>
                                    Valor final sin IVA {sortConfig.key === 'price_final_noiva' ? (sortConfig.direction === 'ascending' ? '↑' : '↓') : null}
                                </th>
                                <th className="border border-gray-300 p-2 cursor-pointer" onClick={() => requestSort('unit_cost')}>
                                    Costo unitario {sortConfig.key === 'unit_cost' ? (sortConfig.direction === 'ascending' ? '↑' : '↓') : null}
                                </th>
                                <th className="border border-gray-300 p-2 cursor-pointer" onClick={() => requestSort('margen')}>
                                    Margen {sortConfig.key === 'margen' ? (sortConfig.direction === 'ascending' ? '↑' : '↓') : null}
                                </th>
                                <th className="border border-gray-300 p-2 cursor-pointer" onClick={() => requestSort('margen_porcentual')}>
                                    Margen porcentual {sortConfig.key === 'margen_porcentual' ? (sortConfig.direction === 'ascending' ? '↑' : '↓') : null}
                                </th>
                                <th className="border border-gray-300 p-2 cursor-pointer" onClick={() => requestSort('commission_seller')}>
                                    Comisión vendedor {sortConfig.key === 'commission_seller' ? (sortConfig.direction === 'ascending' ? '↑' : '↓') : null}
                                </th>
                                <th className="border border-gray-300 p-2 cursor-pointer" onClick={() => requestSort('supplier')}>
                                    Proveedor {sortConfig.key === 'supplier' ? (sortConfig.direction === 'ascending' ? '↑' : '↓') : null}
                                </th>
                                <th className="border border-gray-300 p-2 cursor-pointer" onClick={() => requestSort('client')}>
                                    Cliente {sortConfig.key === 'client' ? (sortConfig.direction === 'ascending' ? '↑' : '↓') : null}
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
                                    <td className="border border-gray-300 p-2">{productsData[movement.id]?.product?.commission_type || 'Cargando...'}</td>
                                    <td className="border border-gray-300 p-2">{movement.seller}</td>
                                    <td className="border border-gray-300 p-2">{movement.quantity}</td>
                                    <td className="border border-gray-300 p-2">{productsData[movement.id]?.product?.price || 'Cargando...'}</td>
                                    <td className="border border-gray-300 p-2">{productsData[movement.id]?.product?.price*movement.quantity || 'Cargando...'}</td>
                                    <td className="border border-gray-300 p-2">{movement.discount}%</td>
                                    <td className="border border-gray-300 p-2">{movement.price_final ? movement.price_final.toFixed(0) : 'Cargando...'}</td>
                                    <td className="border border-gray-300 p-2">{movement.price_final ? movement.price_final_noiva.toFixed(0) : 'Cargando...'}</td>
                                    <td className="border border-gray-300 p-2">{productsData[movement.id]?.product?.unit_cost || 'Cargando...'}</td>
                                    <td className="border border-gray-300 p-2">{movement.price_final ? movement.margen.toFixed(0) : 'Cargando...'}</td>
                                    <td className="border border-gray-300 p-2">{movement.price_final ? movement.margen_porcentual.toFixed(0) : 'Cargando...'}%</td>

                                    <td className="border border-gray-300 p-2">{movement.commission_seller.toFixed(0)}</td>
                                    <td className="border border-gray-300 p-2">{productsData[movement.id]?.product?.suppliers.name || 'Cargando...'}</td>
                                    <td className="border border-gray-300 p-2">{movement.client}</td>
                                    <td className="border border-gray-300 p-2">{movement.date_time ? format(new Date(movement.date_time), 'dd/MM/yyyy - HH:mm') : 'Cargando...'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default SalesManager;