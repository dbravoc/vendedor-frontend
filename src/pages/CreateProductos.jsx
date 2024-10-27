import React, { useState } from 'react';
import './css/createProductos.css';

const AgregarProducto = () => {
    const [product, setProduct] = useState({
        name: '',
        sku: '',
        description: '',
        type: '',
        categories: '',
        initial_quantity: '',
        unit_cost: '',
        price: '',
        commission_type: '',
        commission: '',
        supplier: '',
        consignment: false,
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProduct({
            ...product,
            [name]: name === 'consignment' ? e.target.checked : value,
        });
    };

    const handleCategoriesChange = (e) => {
        const { value } = e.target;
        setProduct({ ...product, categories: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const dataToSend = {
                name: product.name,
                sku: product.sku,
                description: product.description,
                type: product.type,
                categories: product.categories.toLowerCase().replace(/\s+/g, ''), // Elimina espacios y convierte a minúsculas
                initial_quantity: parseInt(product.initial_quantity, 10),
                unit_cost: parseFloat(product.unit_cost),
                price: parseFloat(product.price),
                commission_type: product.commission_type,
                commission: parseFloat(product.commission),
                supplier: product.supplier,
                consignment: product.consignment,
            };
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/products`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dataToSend),
            });

            if (!response.ok) {
                throw new Error('Error al agregar el producto');
            }

            const data = await response.json();
            console.log(data);
            // Aquí podrías hacer algo después de agregar el producto (como redirigir o mostrar un mensaje)

        } catch (error) {
            console.error(error);
            // Manejo de errores
        }
    };

    return (
        <div className="form-container">
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="name"
                    placeholder="Nombre del producto"
                    value={product.name}
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="sku"
                    placeholder="SKU del producto"
                    value={product.sku}
                    onChange={handleChange}
                    required
                />
                <textarea
                    name="description"
                    placeholder="Descripción del producto"
                    value={product.description}
                    onChange={handleChange}
                    required
                />
                <select
                    name="type"
                    value={product.type}
                    onChange={(e) => handleChange({ target: { name: 'type', value: e.target.value.toLowerCase() } })} // Convertir a minúsculas
                    required
                >
                    <option value="">Tipo de producto</option>
                    <option value="planta">Planta</option>
                    <option value="macetero">Macetero</option>
                    <option value="otros">Otros</option>
                </select>
                <input
                    type="text"
                    name="categories"
                    placeholder="Categorías (Separadas por comas)"
                    value={product.categories}
                    onChange={handleCategoriesChange}
                />
                <input
                    type="number"
                    name="initial_quantity"
                    placeholder="Cantidad inicial"
                    value={product.initial_quantity}
                    onChange={handleChange}
                    required
                />
                <input
                    type="number"
                    name="unit_cost"
                    placeholder="Costo unitario (Precio Compra)"
                    value={product.unit_cost}
                    onChange={handleChange}
                    required
                />
                <input
                    type="number"
                    name="price"
                    placeholder="Precio del producto (Precio venta)"
                    value={product.price}
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="commission_type"
                    placeholder="Tipo de comisión"
                    value={product.commission_type}
                    onChange={handleChange}
                    required
                />
                <input
                    type="number"
                    name="commission"
                    placeholder="Comisión"
                    value={product.commission}
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="supplier"
                    placeholder="Proveedor"
                    value={product.supplier}
                    onChange={handleChange}
                    required
                />
                <label>
                    <input
                        type="checkbox"
                        name="consignment"
                        checked={product.consignment}
                        onChange={handleChange}
                    />
                    En consignación
                </label>
                <button type="submit">Agregar Producto</button>
            </form>
        </div>
    );
};

export default AgregarProducto;