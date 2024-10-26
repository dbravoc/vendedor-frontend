import React, { useState } from 'react';
import './css/createProductos.css';

const AgregarProducto = () => {
    const [product, setProduct] = useState({
        name: '',
        sku: '',
        description: '',
        price: '',
        category: '',
        initial_quantity: '',
        commission: '',
        unit_cost: '',
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
        setProduct({ ...product, category: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const dataToSend = {
                ...product,
                initial_quantity: parseInt(product.initial_quantity, 10),
                price: parseFloat(product.price),
                commission: parseFloat(product.commission),
                unit_cost: parseFloat(product.unit_cost),
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
                <input
                    type="number"
                    name="price"
                    placeholder="Precio del producto"
                    value={product.price}
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="categories"
                    placeholder="Categorías (separadas por comas)"
                    value={product.category}
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
                    name="commission"
                    placeholder="Comisión"
                    value={product.commission}
                    onChange={handleChange}
                    required
                />
                <input
                    type="number"
                    name="unit_cost"
                    placeholder="Costo unitario"
                    value={product.unit_cost}
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