import React from 'react';
import useInventoryMovements from '../Context/useInventoryMovements'; // Asegúrate de importar el hook desde la ubicación correcta

const StockManager = () => {
    const {
        products,
        isLoading,
        error,
        stockData,
    } = useInventoryMovements();

    if (isLoading) return <p>Cargando...</p>;
    if (error) return <p>Error: {error}</p>;
    const totalMargen = products.reduce((total, product) => {
        const margenTotal = (Math.round(product.price * 0.81) - product.unit_cost) * product.initial_quantity;
        return total + margenTotal;
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
                    
                    <table className="mb-4 text-xs border-2 w-full">
                    <thead>
                        <tr>
                            <th className="px-2 py-2 border-2">Margen Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="px-2 py-2 border-2">{totalMargen.toFixed(0)}</td>
                        </tr>
                    </tbody>

                </table>
                    {/* Contenedor con scroll horizontal */}
                    <div className="overflow-x-auto">
                        <table className='text-xs border-2 w-full'>
                            <thead className='border-2'>
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


                                </tr>
                            </thead>
                            <tbody>
                                {products.map((product) => (
                                    <tr className='border-2' key={product.id}>
                                        <td className="px-2 border-2">{product.name}</td>
                                        <td className="px-2 border-2">
                                            {stockData[product.id] !== undefined ? stockData[product.id] : 'Calculando...'}
                                        </td>
                                        <td className="px-2 border-2">{product.initial_quantity}</td>
                                        <td className="px-2 border-2">{product.unit_cost}</td>
                                        <td className="px-2 border-2">{product.unit_cost*product.initial_quantity}</td>
                                        <td className="px-2 border-2">{(product.price * 0.81).toFixed(0)}</td>
                                        <td className="px-2 border-2">{product.price}</td>
                                        <td className="px-2 border-2">{(product.price * 0.81).toFixed(0)-product.unit_cost}</td>
                                        <td className="px-2 border-2">{((product.price * 0.81).toFixed(0)-product.unit_cost)*product.initial_quantity}</td>
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