import React, { useState } from 'react';

import { useNavigate } from 'react-router-dom';


const FormMovement = ({ onSubmit }) => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        client: '',
        product: '',
        quantity: '',
        price: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <div className="sale-form-container bg-gray-100 shadow-lg font-montserrat p-4">
            <div className="title font-bold text-xl pb-4">
                <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl text-left">
                    Ingresar movimiento</p>
            </div>
            <div className="form-container max-w-7xl px-6 lg:px-8">
                <form onSubmit={handleSubmit} >
                        <input
                            type="text"
                            name="client"
                            value={formData.client}
                            onChange={handleChange}
                            placeholder="Nombre del cliente (Opcional)"
                        />
                        <input
                            type="text"
                            name="product"
                            value={formData.product}
                            onChange={handleChange}
                            placeholder="Nombre del producto"
                        />
                        <input
                            type="number"
                            name="quantity"
                            value={formData.quantity}
                            onChange={handleChange}
                            placeholder="Cantidad"
                        />
                        <input
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            placeholder="Precio"
                        />
                    <button type="submit" className="submit-button bg-blue-500 text-white p-2 rounded mt-4">
                        Registrar Movimiento
                    </button>
                </form>
            </div>
        </div>
    );
};
export default FormMovement;