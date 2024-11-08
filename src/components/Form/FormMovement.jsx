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
    const [movements, setMovements] = useState([
        {
            product_id: '',
            quantity: 1,
            discount: 0,
            price: 0
        }
    ]);
    const [commonFields, setCommonFields] = useState({
        seller: '',
        client: '',
        payment: '',
        comment: '',
        date: ''
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

    const handleChange = (e, index) => {
        const { name, value } = e.target;
        
        // Si el campo modificado es uno de los campos comunes (seller, client, payment, comment)
        if (['seller', 'client', 'payment', 'comment'].includes(name)) {
            // Actualiza el estado de los campos comunes
            setCommonFields((prevState) => ({
                ...prevState,
                [name]: value,
            }));
        } else if (name === 'date') {
            // Si el campo modificado es la fecha, actualiza el estado de 'commonFields'
            setCommonFields((prevState) => ({
                ...prevState,
                date: value, // Actualiza el valor de la fecha en 'commonFields'
            }));
        } else {
            // Si el campo modificado es parte de un movimiento (como quantity, discount, etc.)
            const newMovements = [...movements];
            newMovements[index][name] = value;
            setMovements(newMovements);
        }
    };
    
    

    const handleProductChange = (event, newValue, index) => {
        const newMovements = [...movements];
        newMovements[index].product_id = newValue ? newValue.id : '';
        newMovements[index].price = newValue ? newValue.price : 0;
        setMovements(newMovements);
    };

    const addRow = () => {
        setMovements([...movements, {
            product_id: '',
            quantity: 0,
            discount: 0,
            price: 0,
        }]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("movimientos");
        console.log(movements);
        console.log("common");
        console.log(commonFields);
        try {
            
            // Recorrer los movimientos y enviar una solicitud por cada uno
            for (let movement of movements) {
                const dataToSend = {
                    product_id: movement.product_id,
                    quantity: movement.quantity,
                    discount: parseInt(movement.discount, 10),
                    type: "venta",
                    seller: commonFields.seller,
                    client: commonFields.client,
                    payment: commonFields.payment,
                    comment: commonFields.comment,
                    date: commonFields.date
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
            }
    
            // Mensaje de éxito después de todas las solicitudes
            setSuccessMessage('Movimientos agregados exitosamente');
            setTimeout(() => setSuccessMessage(''), 10000);
            
        } catch (error) {
            console.error(error);
            setErrorMessage('Ocurrió un error al agregar el movimiento');
            setSuccessMessage('');
            setTimeout(() => setErrorMessage(''), 10000);
        }
    };


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
                            {movements.map((movement, index) => (
                                <div key={index} className="flex items-center space-x-4 mb-4">
                                    {/* Producto */}
                                    <div className="flex-1">
                                        <Autocomplete
                                            options={productOptions.product}
                                            getOptionLabel={(option) => option.name}
                                            onChange={(event, newValue) => handleProductChange(event, newValue, index)}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    label="Nombre del producto"
                                                    variant="outlined"
                                                    required
                                                    fullWidth
                                                />
                                            )}
                                        />
                                    </div>

                                    {/* Cantidad */}
                                    <div className="flex flex-col w-20">
                                        <label htmlFor="quantity" className="text-sm font-semibold text-gray-700 text-left">
                                            Cantidad
                                        </label>
                                        <input
                                            type="number"
                                            name="quantity"
                                            value={movement.quantity}
                                            onChange={(e) => handleChange(e, index)}
                                            className="w-full mt-1 p-2 border border-gray-300 rounded"
                                        />
                                    </div>

                                    {/* Descuento */}
                                    <div className="flex flex-col w-24">
                                        <label htmlFor="discount" className="text-sm font-semibold text-gray-700 text-left">
                                            % Descuento
                                        </label>
                                        <input
                                            type="number"
                                            name="discount"
                                            value={movement.discount}
                                            onChange={(e) => handleChange(e, index)}
                                            className="w-full mt-1 p-2 border border-gray-300 rounded"
                                        />
                                    </div>

                                    {/* Precio Unitario */}
                                    {movement.price > 0 && (
                                        <div className="flex flex-col items-center">
                                            <span className="text-sm text-gray-600">Precio Unitario</span>
                                            <span className="text-xl text-gray-700">
                                                ${movement.price.toFixed(0)}
                                            </span>
                                        </div>
                                    )}

                                    {/* Precio Total */}
                                    {movement.price > 0 && movement.quantity > 0 && (
                                        <div className="flex flex-col items-center ml-4">
                                            <span className="text-sm text-gray-600">Precio Total</span>
                                            <span className="text-xl text-gray-700">
                                                ${(movement.price * movement.quantity).toFixed(0)}
                                            </span>
                                        </div>
                                    )}

                                    {/* Precio Final */}
                                    {movement.price > 0 && movement.discount > 0 && (
                                        <div className="flex flex-col items-center ml-4">
                                            <span className="text-sm text-gray-600">Precio Final</span>
                                            <span className="text-xl text-gray-700">
                                                ${(movement.price * movement.quantity * (1 - movement.discount / 100)).toFixed(0)}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            ))}

                            <div className="mt-6 text-xl font-semibold text-gray-800">
                                <div className="flex justify-between mb-2">
                                    <span>Total: </span>
                                    <span>
                                        $
                                        {movements.reduce((total, movement) => {
                                            const finalPrice = movement.price * movement.quantity;
                                            return total + (finalPrice || 0);
                                        }, 0).toFixed(0)}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Total con descuentos: </span>
                                    <span>
                                        $
                                        {movements.reduce((totaldiscount, movement) => {
                                            const finalPricediscount = movement.price * movement.quantity * (1 - movement.discount / 100);
                                            return totaldiscount + (finalPricediscount || 0);
                                        }, 0).toFixed(0)}
                                    </span>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={addRow}
                                className="bg-blue-500 text-white p-2 rounded mt-4 mb-6"
                            >
                                Agregar producto
                            </button>

                            {/* Información adicional */}
                            {/* Campo de Fecha */}
                            <div className="flex flex-col mb-4">
                                <label htmlFor="date" className="text-sm font-semibold text-gray-700 text-left">
                                    Fecha
                                </label>
                                <input
                                    type="date"
                                    name="date"
                                    value={commonFields.date}
                                    onChange={(e) => handleChange(e, 0)}
                                    className="w-full mt-1 p-2 border border-gray-300 rounded"
                                />
                            </div>
                            <input
                                type="text"
                                name="seller"
                                value={commonFields.seller}
                                onChange={(e) => handleChange(e, 0)}
                                placeholder="Nombre del vendedor"
                            />
                            <input
                                type="text"
                                name="client"
                                value={commonFields.client}
                                onChange={(e) => handleChange(e, 0)}
                                placeholder="Nombre del cliente (Opcional)"
                            />
                            <input
                                type="text"
                                name="payment"
                                value={commonFields.payment}
                                onChange={(e) => handleChange(e, 0)}
                                placeholder="Método de pago (Opcional)"
                            />
                            <input
                                type="text"
                                name="comment"
                                value={commonFields.comment}
                                onChange={(e) => handleChange(e, 0)}
                                placeholder="Comentario (Opcional)"
                            />
                            <button
                                type="submit"
                                className="submit-button bg-blue-500 text-white p-2 rounded mt-4"
                            >
                                Registrar Movimiento
                            </button>

                        </form>
                    </div>
                </div>
            </div>
    );
};

export default FormMovement;