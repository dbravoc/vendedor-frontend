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
                    <table className='text-sm border-2 w-full'>
                        <thead className='border-2'>
                            <tr>
                                <th className="px-2">Nombre</th>
                                <th className="px-2">SKU</th>
                                <th className="px-2">Descripción</th>
                                <th className="px-2">Precio</th>
                                <th className="px-2">Categoría</th>
                                <th className="px-2">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((product) => (
                                <tr className='border-2' key={product.id}>
                                    {editingProductId === product.id ? (
                                        <>
                                            <td className="px-2 bg-blue-100">
                                                <input
                                                    type="text"
                                                    name="name"
                                                    className="w-full bg-blue-100"
                                                    value={formData[product.id]?.name || product.name}
                                                    onChange={(e) => handleInputChange(e, product.id)}
                                                />
                                            </td>
                                            <td className="px-2 bg-blue-100">
                                                <input
                                                    type="text"
                                                    name="sku"
                                                    className="w-full bg-blue-100"
                                                    value={formData[product.id]?.sku || product.sku}
                                                    onChange={(e) => handleInputChange(e, product.id)}
                                                />
                                            </td>
                                            <td className="px-2 bg-blue-100">
                                                <textarea
                                                    name="description"
                                                    className="w-full min-w-0 bg-blue-100"
                                                    value={formData[product.id]?.description || product.description}
                                                    onChange={(e) => handleInputChange(e, product.id)}
                                                />
                                            </td>
                                            <td className="px-2 bg-blue-100">
                                                <input
                                                    type="number"
                                                    name="price"
                                                    className="w-full bg-blue-100"
                                                    value={formData[product.id]?.price || product.price}
                                                    onChange={(e) => handleInputChange(e, product.id)}
                                                />
                                            </td>
                                            <td className="px-2 bg-blue-100">
                                                <input
                                                    type="text"
                                                    name="categories"
                                                    className="w-full bg-blue-100"
                                                    value={formData[product.id]?.categories || product.categories}
                                                    onChange={(e) => handleInputChange(e, product.id)}
                                                />
                                            </td>
                                            <td className="px-2 space-x-4 bg-blue-100">
                                                <button onClick={() => handleSaveProduct(product.id)}><FontAwesomeIcon className='text-green-600' icon={faCircleCheck} /></button>
                                                <button onClick={() => setEditingProductId(null)}><FontAwesomeIcon className='text-red-600' icon={faXmark} /></button>
                                            </td>
                                        </>
                                    ) : (
                                        <>
                                            <td className="px-2">{product.name}</td>
                                            <td className="px-2">{product.sku}</td>
                                            <td className="px-2">{product.description}</td>
                                            <td className="px-2">{product.price}</td>
                                            <td className="px-2">{product.categories}</td>
                                            <td className="px-2">
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
    );
};

export default ProductManager;