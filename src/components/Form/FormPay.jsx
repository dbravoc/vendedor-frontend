import React, { useState } from 'react';
import { useShoppingCart } from '../Context/ShoppingCartContext';
import { useNavigate } from 'react-router-dom';
import PaymentDetails from './PaymentDetails';

const FormPay = () => {
    const { cart } = useShoppingCart();
    const navigate = useNavigate();

    // Constante para el valor del despacho
    const DISPATCH_COST = 5000; // Parametrización del costo del despacho

    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [email, setEmail] = useState('');
    const [nationality, setNationality] = useState('');
    const [documentType, setDocumentType] = useState('');
    const [shippingCost, setShippingCost] = useState(0);
    const [documentNumber, setDocumentNumber] = useState('');
    const [shippingAddress, setShippingAddress] = useState('');
    const [dispatchType, setDispatchType] = useState('');

    const handleDispatchTypeChange = (e) => {
        const selectedDispatchType = e.target.value;
        setDispatchType(selectedDispatchType);

        // Sumar el valor del despacho al total
        if (selectedDispatchType === 'Despacho') {
            setShippingCost(DISPATCH_COST); // Asignar el costo del despacho parametrizado
        } else {
            setShippingCost(0); // Si no se selecciona despacho, el costo es 0
        }
    };

    // Calcular el subtotal y total, considerando la cantidad de cada producto y el valor del despacho
    const subtotal = cart.reduce((total, item) => total + item.price * item.cantidad, 0);
    const total = Math.round(subtotal + shippingCost); // Asegurarse de que sea un número entero

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
           
            // Crear la preferencia de pago en Mercado Pago
            const paymentData = {
                title: `Compra de productos - ${firstname} ${lastname}`,
                quantity: 1, // Suponiendo que es una única transacción
                unit_price: total // Asegúrate de que sea un número entero
            };

            const paymentResponse = await fetch(`${process.env.REACT_APP_MERCADOPAGO_URL}/payment`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(paymentData)
            });

            if (!paymentResponse.ok) {
                throw new Error('Error al crear la preferencia de pago en Mercado Pago');
            }

            const paymentResult = await paymentResponse.json();
            console.log('Preferencia de pago creada:', paymentResult);

            if (paymentResult && paymentResult.success && paymentResult.data) {
                window.location.href = paymentResult.data.init_point;
            } else {
                throw new Error('No se pudo obtener el enlace de pago. Respuesta recibida: ' + JSON.stringify(paymentResult));
            }
        } catch (error) {
            console.error('Error en el proceso de orden o pago:', error);
            alert('Hubo un problema al procesar tu solicitud.');
        }
    };

    return (
        <div className="flex justify-center items-start" style={{ backgroundColor: '#433B24', width: '50%', height: 'auto', borderRadius: '15px' }}>
            <div className="relative flex flex-col justify-center">
                <div className="w-full p-6 m-auto bg-transparent">
                    <h1 className="text-3xl text-center text-white">
                        INGRESA TUS DATOS
                    </h1>
                    <form className="mt-6" onSubmit={handleSubmit}>
                        <div className="mb-2 flex flex-row space-x-4">
                            <div className="flex flex-col">
                                <label
                                    htmlFor="firstname"
                                    className="block text-md text-white text-left"
                                >
                                    NOMBRE
                                </label>
                                <input
                                    type="text"
                                    id="firstname"
                                    className="block w-full px-4 py-2 mt-2 text-black bg-white border rounded-md focus:border-white focus:ring-white focus:outline-none focus:ring focus:ring-opacity-40"
                                    value={firstname}
                                    onChange={(e) => setFirstname(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="flex flex-col">
                                <label
                                    htmlFor="lastname"
                                    className="block text-md text-white text-left"
                                >
                                    APELLIDOS
                                </label>
                                <input
                                    type="text"
                                    id="lastname"
                                    className="block w-full px-4 py-2 mt-2 text-black bg-white border rounded-md focus:border-white focus:ring-white focus:outline-none focus:ring focus:ring-opacity-40"
                                    value={lastname}
                                    onChange={(e) => setLastname(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        <div className="mb-2">
                            <label
                                htmlFor="email"
                                className="block text-md text-white text-left"
                            >
                                EMAIL
                            </label>
                            <input
                                type="email"
                                id="email"
                                className="block w-full px-4 py-2 mt-2 text-black bg-white border rounded-md focus:border-white focus:ring-white focus:outline-none focus:ring focus:ring-opacity-40"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-2">
                            <label
                                htmlFor="dispatchType"
                                className="block text-md text-white text-left"
                            >
                                TIPO DE DESPACHO
                            </label>
                            <select
                                id="dispatchType"
                                className="block w-full px-4 py-2 mt-2 text-black bg-white border rounded-md focus:border-white focus:ring-white focus:outline-none focus:ring focus:ring-opacity-40"
                                value={dispatchType}
                                onChange={handleDispatchTypeChange}
                                required
                            >
                                <option value="" disabled>Seleccione una opción</option>
                                <option value="Retiro Local">RETIRO LOCAL: 1-2 Poniente 1316 , Viña del Mar</option>
                                <option value="Despacho">DESPACHO DOMICILIO</option>
                            </select>
                        </div>
                        <div className="mb-2">
                            <label
                                htmlFor="shippingAddress"
                                className="block text-md text-white text-left"
                            >
                                DIRECCIÓN DESPACHO
                            </label>
                            <input
                                type="text"
                                id="shippingAddress"
                                className="block w-full px-4 py-2 mt-2 text-black bg-white border rounded-md focus:border-white focus:ring-white focus:outline-none focus:ring focus:ring-opacity-40"
                                value={shippingAddress}
                                onChange={(e) => setShippingAddress(e.target.value)}
                                required={dispatchType === 'Despacho'}
                                disabled={dispatchType !== 'Despacho'} // Desactivar campo si no es despacho a domicilio
                            />
                        </div>
                        <div className="mb-2">
                            <label
                                htmlFor="documentType"
                                className="block text-md text-white text-left"
                            >
                                TIPO DE DOCUMENTACIÓN
                            </label>
                            <select
                                id="documentType"
                                className="block w-full px-4 py-2 mt-2 text-black bg-white border rounded-md focus:border-white focus:ring-white focus:outline-none focus:ring focus:ring-opacity-40"
                                value={documentType}
                                onChange={(e) => setDocumentType(e.target.value)}
                                required
                            >
                                <option value="" disabled>Seleccione una opción</option>
                                <option value="Cédula Identidad">CÉDULA IDENTIDAD</option>
                                <option value="Pasaporte">PASAPORTE</option>
                            </select>
                        </div>
                        <div className="mb-2">
                            <label
                                htmlFor="documentNumber"
                                className="block text-md text-white text-left"
                            >
                                NÚMERO DE RUT O PASAPORTE
                            </label>
                            <input
                                type="text"
                                id="documentNumber"
                                className="block w-full px-4 py-2 mt

-2 text-black bg-white border rounded-md focus:border-white focus:ring-white focus:outline-none focus:ring focus:ring-opacity-40"
                                value={documentNumber}
                                onChange={(e) => setDocumentNumber(e.target.value)}
                                required
                            />
                        </div>
                        {/* Mostrar el monto total a pagar */}
                        <div className='py-4'>
                        <PaymentDetails cart={cart} total={total} shippingCost={shippingCost} />
                        </div>
                        <button type="submit" className="mt-4 px-4 py-2 bg-gray-100 text-elqui font-bold rounded-md">
                            CONTINUAR AL PAGO
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
export default FormPay;