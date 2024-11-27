import React, { useState } from 'react';
import useProducts from '../Context/useProduct';
import { faCircleCheck, faPenToSquare, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';

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

    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
    const [localProducts, setLocalProducts] = useState(products || []); // Usar un estado local
    // Función para obtener el valor de una propiedad anidada
    const getNestedValue = (obj, key) => {
        return key.split('.').reduce((acc, part) => acc?.[part], obj);
    };

    // Ordenar los productos
    const sortedProducts = [...products].sort((a, b) => {
        if (sortConfig.key) {
            const aValue = getNestedValue(a, sortConfig.key);
            const bValue = getNestedValue(b, sortConfig.key);

            if (aValue < bValue) {
                return sortConfig.direction === 'asc' ? -1 : 1;
            }
            if (aValue > bValue) {
                return sortConfig.direction === 'asc' ? 1 : -1;
            }
        }
        return 0;
    });

    // Función para manejar la ordenación
    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });

        // Aquí hacemos la ordenación al recibir el clic en la columna
        const sortedData = [...localProducts].sort((a, b) => {
            let aValue, bValue;

            // Manejar casos especiales como suppliers.name
            if (key === 'suppliers.name') {
                aValue = a.suppliers?.name || ''; // Maneja valores nulos
                bValue = b.suppliers?.name || ''; // Maneja valores nulos
            } else {
                aValue = a[key];
                bValue = b[key];
            }

            // Comparación de valores
            if (aValue < bValue) return direction === 'asc' ? -1 : 1;
            if (aValue > bValue) return direction === 'asc' ? 1 : -1;
            return 0;
        });

        // Actualizar productos ordenados
        setLocalProducts(sortedData);
    };

    const handleInputChangeWithBool = (e, id) => {
        const { name, value } = e.target;

        let transformedValue = value;

        // Transformar "Si" o "No" a booleano para el campo "consignment"
        if (name === 'consignment') {
            transformedValue = value.trim().toLowerCase() === 'si' ? true : value.trim().toLowerCase() === 'no' ? false : value;
        }

        handleInputChange({ target: { name, value: transformedValue } }, id);
    };

    const handleSaveProductWithBool = (id) => {
        const productData = { ...formData[id] };

        // Asegurar que "consignment" sea booleano antes de guardar
        if (typeof productData.consignment !== 'boolean') {
            productData.consignment =
                productData.consignment.trim().toLowerCase() === 'si'
                    ? true
                    : productData.consignment.trim().toLowerCase() === 'no'
                    ? false
                    : productData.consignment;
        }

        handleSaveProduct(id, productData);
    };

    if (isLoading) return <p>Cargando...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className="bg-white min-h-screen w-screen py-24 sm:py-32">
            <div className="mx-auto px-6 lg:px-8 mx-auto">
                <div className="mx-auto text-justify">
                <div className="flex items-center justify-between">
                    <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl text-left">
                        Gestión de productos
                    </p>
                    <div className="flex items-center gap-2">
                        <Link to="/CargaMasivaProductos" className="agregar-producto-button">Carga Masiva Productos</Link>
                        <Link to="/agregarProducto" className="agregar-producto-button">Agregar Producto</Link>
                    </div>
                </div>

                    <p className="my-6 text-lg leading-8 text-gray-600">
                        Añada, edite y elimine productos del inventario con facilidad.
                    </p>
                    <div className="overflow-x-auto">
                        <table className='text-xs border-2 w-full'>
                            <thead className='border-2'>
                                <tr>
                                    <th onClick={() => handleSort('name')} className="px-2 cursor-pointer">Nombre {sortConfig.key === 'name' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : null}</th>
                                    <th onClick={() => handleSort('description')} className="px-2 cursor-pointer">Descripción {sortConfig.key === 'description' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : null}</th>
                                    <th onClick={() => handleSort('type')} className="px-2 cursor-pointer">Categorías {sortConfig.key === 'type' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : null}</th>
                                    <th onClick={() => handleSort('categories')} className="px-2 cursor-pointer">Filtros {sortConfig.key === 'categories' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : null}</th>
                                    <th
    onClick={() => handleSort('suppliers.name')}
    className="px-2 cursor-pointer"
>
    Proveedor {sortConfig.key === 'suppliers.name' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : null}
</th>
                                    <th onClick={() => handleSort('price')} className="px-2 cursor-pointer">Precio {sortConfig.key === 'price' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : null}</th>
                                    <th onClick={() => handleSort('unit_cost')} className="px-2 cursor-pointer">Costo Unitario {sortConfig.key === 'unit_cost' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : null}</th>
                                    <th onClick={() => handleSort('initial_quantity')} className="px-2 cursor-pointer">Cantidad Inicial {sortConfig.key === 'initial_quantity' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : null}</th>
                                    <th onClick={() => handleSort('commission_type')} className="px-2 cursor-pointer">Tipo de Comisión {sortConfig.key === 'commission_type' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : null}</th>
                                    <th onClick={() => handleSort('commission')} className="px-2 cursor-pointer">% de Comisión {sortConfig.key === 'commission' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : null}</th>
                                    <th onClick={() => handleSort('consignment')} className="px-2 cursor-pointer">Consignación {sortConfig.key === 'consignment' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : null}</th>
                                    <th onClick={() => handleSort('image_1')} className="px-2 cursor-pointer">Imagen {sortConfig.key === 'image_1' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : null}</th>
                                    <th onClick={() => handleSort('range_pot_diameter_min')} className="px-2 cursor-pointer">Diametro Min {sortConfig.key === 'range_pot_diameter_min' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : null}</th>
                                    <th onClick={() => handleSort('range_pot_diameter_max')} className="px-2 cursor-pointer">Diametro Max {sortConfig.key === 'range_pot_diameter_max' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : null}</th>
                                    <th onClick={() => handleSort('pot_diameter')} className="px-2 cursor-pointer">Diametro {sortConfig.key === 'pot_diameter' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : null}</th>
                                    <th className="px-2">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sortedProducts.map((product) => (
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
                                                        type="text"
                                                        name="type"
                                                        className="w-full bg-blue-100"
                                                        value={formData[product.id]?.type || product.type}
                                                        onChange={(e) => handleInputChange(e, product.id)}
                                                    />
                                                </td>
                                                <td className="px-2 bg-blue-100 border-2">
                                                    <input
                                                        type="text"
                                                        name="categories"
                                                        className="w-full bg-blue-100"
                                                        value={formData[product.id]?.categories || product.categories}
                                                        onChange={(e) => handleInputChange(e, product.id)}
                                                    />
                                                </td>
                                                <td className="px-2 bg-blue-100 border-2">
                                                    <input
                                                        type="text"
                                                        name="suppliers"
                                                        className="w-full bg-blue-100"
                                                        value={formData[product.id]?.suppliers?.name || product.suppliers.name}
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
                                                        name="unit_cost"
                                                        className="w-full bg-blue-100"
                                                        value={formData[product.id]?.unit_cost || product.unit_cost}
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
                                                        name="commission_type"
                                                        className="w-full bg-blue-100"
                                                        value={formData[product.id]?.commission_type || product.commission_type}
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
                                                <select
                                                    name="consignment"
                                                    className="w-full bg-blue-100"
                                                    value={(formData[product.id]?.consignment ?? product.consignment) ? "Si" : "No"}
                                                    onChange={(e) => handleInputChangeWithBool(e, product.id)}
                                                >
                                                    <option value="Si">Sí</option>
                                                    <option value="No">No</option>
                                                </select>
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
                                                        type="number"
                                                        name="range_pot_diameter_min"
                                                        className="w-full bg-blue-100"
                                                        value={formData[product.id]?.range_pot_diameter_min || product.range_pot_diameter_min}
                                                        onChange={(e) => handleInputChange(e, product.id)}
                                                    />
                                                </td>
                                                <td className="px-2 bg-blue-100 border-2">
                                                    <input
                                                        type="number"
                                                        name="range_pot_diameter_max"
                                                        className="w-full bg-blue-100"
                                                        value={formData[product.id]?.range_pot_diameter_max || product.range_pot_diameter_max}
                                                        onChange={(e) => handleInputChange(e, product.id)}
                                                    />
                                                </td>
                                                <td className="px-2 bg-blue-100 border-2">
                                                    <input
                                                        type="number"
                                                        name="pot_diameter"
                                                        className="w-full bg-blue-100"
                                                        value={formData[product.id]?.pot_diameter || product.pot_diameter}
                                                        onChange={(e) => handleInputChange(e, product.id)}
                                                    />
                                                </td>
                                            
                                                <td className="px-2 text-center space-x-4 bg-blue-100 border-2">
                                                    <button onClick={() => handleSaveProductWithBool(product.id)}>
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
                                                <td className="px-2 border-2">{product.type}</td>
                                                <td className="px-2 border-2">{product.categories}</td>
                                                <td className="px-2 border-2">{product.suppliers ? product.suppliers.name : "No disponible"}</td>
                                                <td className="px-2 border-2">${product.price.toLocaleString('es-CL')}</td>
                                                <td className="px-2 border-2">${product.unit_cost.toLocaleString('es-CL')}</td>
                                                <td className="px-2 border-2">{product.initial_quantity}</td>
                                                <td className="px-2 border-2">{product.commission_type}</td>
                                                <td className="px-2 border-2">{product.commission}%</td>
                                                <td className="px-2 border-2">{product.consignment ? "Si" : "No"}</td>
                                                <td className="px-2 border-2">{product.image_1 ? 'Cargada' : 'Pendiente'}</td>
                                                <td className="px-2 border-2">{product.range_pot_diameter_min}</td>
                                                <td className="px-2 border-2">{product.range_pot_diameter_max}</td>
                                                <td className="px-2 border-2">{product.pot_diameter}</td>
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
