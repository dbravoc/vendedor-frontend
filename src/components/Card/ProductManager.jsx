import React from 'react';
import useProducts from '../Context/useProduct'; // Asegúrate de importar el hook desde la ubicación correcta
import { faCircleCheck, faPenToSquare, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const ProductManager = () => {
    const {
        products,
        isLoading,
        error,
        editingProductId,
        setEditingProductId,
        formData,
        handleInputChange,
        handleSaveProduct,
    } = useProducts();

    if (isLoading) return <p>Cargando...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className="bg-white min-h-screen w-screen py-24 sm:py-32">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto text-justify">
                    <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                        Gestión de productos
                    </p>
                    <p className="my-6 text-lg leading-8 text-gray-600">
                        Añada, edite y elimine productos del inventario con facilidad.
                    </p>
                    {/* Contenedor con scroll horizontal */}
                    <div className="overflow-x-auto">
                        <table className='text-xs border-2 w-full'>
                            <thead className='border-2'>
                                <tr>
                                    <th className="px-2">Nombre</th>
                                    <th className="px-2">Descripción</th>
                                    <th className="px-2">Precio</th>
                                    <th className="px-2">Cantidad Inicial</th>
                                    <th className="px-2">Imagen</th>
                                    <th className="px-2">Comisión</th>
                                    <th className="px-2">Costo Unitario</th>
                                    <th className="px-2">Consignación</th>
                                    <th className="px-2">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                            {products.map((product) => (
                            <tr className='border-2' key={product.id}>
                                {editingProductId === product.id ? (
                                    <>
                                        <td className="px-2 bg-blue-100 border-2">
                                            <input
                                                type="text"
                                                name="name"
                                                className="w-full bg-blue-100"
                                                value={formData[product.id]?.name || product.name}
                                                onChange={(e) => handleInputChange(e, product.id)}
                                            />
                                        </td>
                                        <td className="px-2 bg-blue-100 border-2">
                                            <textarea
                                                name="description"
                                                className="w-full min-w-0 bg-blue-100"
                                                value={formData[product.id]?.description || product.description}
                                                onChange={(e) => handleInputChange(e, product.id)}
                                            />
                                        </td>
                                        <td className="px-2 bg-blue-100 border-2">
                                            <input
                                                type="number"
                                                name="price"
                                                className="w-full bg-blue-100"
                                                value={formData[product.id]?.price || product.price}
                                                onChange={(e) => handleInputChange(e, product.id)}
                                            />
                                        </td>
                                        <td className="px-2 bg-blue-100 border-2">
                                            <input
                                                type="number"
                                                name="initial_quantity"
                                                className="w-full bg-blue-100"
                                                value={formData[product.id]?.initial_quantity || product.initial_quantity}
                                                onChange={(e) => handleInputChange(e, product.id)}
                                            />
                                        </td>
                                        <td className="px-2 bg-blue-100 border-2">
                                            <input
                                                type="text"
                                                name="image_1"
                                                className="w-full bg-blue-100"
                                                value={formData[product.id]?.image_1 || product.image_1}
                                                onChange={(e) => handleInputChange(e, product.id)}
                                            />
                                        </td>
                                        <td className="px-2 bg-blue-100 border-2">
                                            <input
                                                type="text"
                                                name="commission"
                                                className="w-full bg-blue-100"
                                                value={formData[product.id]?.commission || product.commission}
                                                onChange={(e) => handleInputChange(e, product.id)}
                                            />
                                        </td>
                                        <td className="px-2 bg-blue-100 border-2">
                                            <input
                                                type="number"
                                                name="unit_cost"
                                                className="w-full bg-blue-100"
                                                value={formData[product.id]?.unit_cost || product.unit_cost}
                                                onChange={(e) => handleInputChange(e, product.id)}
                                            />
                                        </td>
                                        <td className="px-2 bg-blue-100 border-2">
                                            <input
                                                type="text"
                                                name="consignment"
                                                className="w-full bg-blue-100"
                                                value={formData[product.id]?.consignment || product.consignment}
                                                onChange={(e) => handleInputChange(e, product.id)}
                                            />
                                        </td>
                                        <td className="px-2 text-center space-x-4 bg-blue-100 border-2">
                                            <button onClick={() => handleSaveProduct(product.id)}>
                                                <FontAwesomeIcon className='text-green-600' icon={faCircleCheck} />
                                            </button>
                                            <button onClick={() => setEditingProductId(null)}>
                                                <FontAwesomeIcon className='text-red-600 ' icon={faXmark} />
                                            </button>
                                        </td>
                                    </>
                                ) : (
                                    <>
                                        <td className="px-2 border-2">{product.name}</td>
                                        <td className="px-2 border-2">{product.description}</td>
                                        <td className="px-2 border-2">{product.price}</td>
                                        <td className="px-2 border-2">{product.initial_quantity}</td>
                                        <td className="px-2 border-2">{product.image_1 ? 'Cargada' : 'Pendiente'}</td>
                                        <td className="px-2 border-2">{product.commission}</td>
                                        <td className="px-2 border-2">{product.unit_cost}</td>
                                        <td className="px-2 border-2">{product.consignment}</td>
                                        <td className="px-2 text-center space-x-2">
                                            <button onClick={() => setEditingProductId(product.id)}>
                                                <FontAwesomeIcon className='text-blue-600' icon={faPenToSquare} />
                                            </button>
                                        </td>
                                    </>
                                )}
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

export default ProductManager;