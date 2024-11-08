import React, { useEffect, useState } from 'react';
import { useWindowScroll } from '@uidotdev/usehooks';
import { useNavigate } from 'react-router-dom';

import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import axios from 'axios';

const FormMovement = () => {
    const navigate = useNavigate();
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const [{ y }] = useWindowScroll();
    const [scrollPosition, setScrollPosition] = useState(0);

    const [price, setPrice] = useState(0);

    const [productOptions, setProductOptions] = useState([]);
    const [movement, setFormData] = useState({
        product_id: '',
        seller: '',
        client: '',
        quantity: '',
        discount: '',
        payment: '',
        comment: ''
    });

    useEffect(() => {
        if (y > 700) {
            setScrollPosition(1);
        } else {
            setScrollPosition(0);
        }
    }, [y]);

    useEffect(() => {
        // Obtener los nombres de productos
        const fetchProducts = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/products`);
                setProductOptions(response.data);
            } catch (error) {
                console.error("Error al obtener los productos:", error);
            }
        };

        fetchProducts();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...movement, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const dataToSend = {
                type: "venta",
                product_id: movement.product_id,
                seller: movement.seller,
                client: movement.client,
                quantity: movement.quantity,
                discount: parseFloat(movement.discount),
                payment: movement.payment,
                comment: movement.comment
            };
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/stock`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dataToSend),
            });

            if (!response.ok) {
                throw new Error('Error al agregar el movimiento');
            }

            const data = await response.json();
            console.log(data);
            setSuccessMessage('Movimiento agregado exitosamente');
            setTimeout(() => setSuccessMessage(''), 10000);

        } catch (error) {
            console.error(error);
            setErrorMessage(`Ocurrió un error al agregar el movimiento`);
            setSuccessMessage('');
            setTimeout(() => setErrorMessage(''), 10000);
        }
    };
console.log(productOptions.product)
return (
    <div className="bg-white min-h-screen w-full py-24 sm:py-32">
        <div className="mx-auto w-full px-6 lg:px-8">
            <div className="mx-auto max-w-lg text-center mb-6">
                {successMessage && (
                    <div className="bg-green-100 text-green-800 p-4 rounded mb-4">
                        {successMessage}
                    </div>
                )}

                {errorMessage && (
                    <div className="bg-red-100 text-red-800 p-4 rounded mb-4">
                        {errorMessage}
                    </div>
                )}

                <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl text-left">
                    Ingresar movimiento
                </p>
            </div>
            <div className="form-container max-w-7xl px-6 lg:px-8">
                <form onSubmit={handleSubmit}>
                    <div className="flex items-center space-x-4">
                        <div className="flex-1">
                            <Autocomplete
                                options={productOptions.product}
                                getOptionLabel={(option) => option.name} // Mostrar el nombre en el dropdown
                                onChange={(event, newValue) => {
                                    setFormData({ ...movement, product_id: newValue ? newValue.id : '' });
                                    setPrice(newValue ? newValue.price : 0); // Actualizar el precio
                                }}
                                renderInput={(params) => (
                                    <TextField 
                                        {...params} 
                                        label="Nombre del producto" 
                                        variant="outlined" 
                                        required 
                                        fullWidth // Esto hará que el campo ocupe todo el espacio disponible
                                    />
                                )}
                                filterOptions={(options, state) =>
                                    options.filter((option) =>
                                        option.name.toLowerCase().includes(state.inputValue.toLowerCase())
                                    )
                                }
                            />
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="flex flex-col w-20">
                                <label htmlFor="quantity" className="text-sm font-semibold text-gray-700 text-left">
                                    Cantidad
                                </label>
                                <input
                                    type="number"
                                    name="quantity"
                                    value={movement.quantity}
                                    onChange={handleChange}
                                    placeholder=""
                                    className="w-full mt-1 p-2 border border-gray-300 rounded" // Esto hace que el campo sea más amplio
                                />
                            </div>
                            <div className="flex flex-col w-24">
                                <label htmlFor="discount" className="text-sm font-semibold text-gray-700 text-left">
                                    % Descuento
                                </label>
                                <input
                                    type="number"
                                    name="discount"
                                    value={movement.discount}
                                    onChange={handleChange}
                                    placeholder=""
                                    className="w-full mt-1 p-2 border border-gray-300 rounded" // Esto hace que el campo sea más amplio
                                />
                            </div>

                            {price > 0 && (
                                <div className="flex flex-col items-center">
                                    <span className="text-sm text-gray-600">Precio Unitario</span>
                                    <span className="text-xl text-gray-700">
                                        ${price.toFixed(0)}
                                    </span>
                                </div>
                            )}
                            {price > 0 && movement.quantity > 0 && (
                                <div className="flex flex-col items-center ml-4">
                                    <span className="text-sm text-gray-600">Precio Total</span>
                                    <span className="text-xl text-gray-700">
                                        ${(price * movement.quantity).toFixed(0)}
                                    </span>
                                </div>
                            )}
                            {price > 0 && movement.discount > 0 && (
                                <div className="flex flex-col items-center ml-4">
                                    <span className="text-sm text-gray-600">Precio Final</span>
                                    <span className="text-xl text-gray-700">
                                        ${(price * movement.quantity * (1-(movement.discount/100))).toFixed(0)}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>



                    <input
                        type="text"
                        name="seller"
                        value={movement.seller}
                        onChange={handleChange}
                        placeholder="Nombre del vendedor"
                    />
                    <input
                        type="text"
                        name="client"
                        value={movement.client}
                        onChange={handleChange}
                        placeholder="Nombre del cliente (Opcional)"
                    />
                    <input
                        type="text"
                        name="payment"
                        value={movement.payment}
                        onChange={handleChange}
                        placeholder="Metodo de pago (Opcional)"
                    />
                    <input
                        type="text"
                        name="comment"
                        value={movement.comment}
                        onChange={handleChange}
                        placeholder="Comentario (Opcional)"
                    />
                    <button type="submit" className="submit-button bg-blue-500 text-white p-2 rounded mt-4">
                        Registrar Movimiento
                    </button>
                </form>
            </div>
        </div>
    </div>
);





};

export default FormMovement;
