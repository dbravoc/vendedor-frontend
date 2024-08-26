import React from 'react';

const PaymentDetails = ({ cart, total, shippingCost }) => {
    return (
        <div className="contenedor grid grid-row-2 bg-gray-100 shadow-lg font-montserrat gap-2 relative p-4">
            <div className="titulo font-bold text-xl pb-4">
                <p>
                    DETALLES DE PAGO
                </p>
            </div>
            <div className="calculadora flex flex-col gap-y-4">
                {cart.map((item, index) => (
                    <div key={index} className="producto border-b-2 flex justify-between items-center">
                        <div>
                            <p className="text-left">{item.name}</p>
                        </div>
                        <div className='flex justify-end'>
                            <p>${item.price}</p>
                        </div>
                    </div>
                ))}
                <div className="total flex justify-between font-bold">
                    <p className="">TOTAL</p>
                    <p>${(total - shippingCost).toFixed(0)}</p>
                </div>
                <div className="total flex justify-between">
                    <p className="">DESPACHO</p>
                    <p>${shippingCost.toFixed(0)}</p>
                </div>
                <div className="total flex justify-between font-bold text-xl">
                    <p className="">TOTAL + DESPACHO</p>
                    <p>${total.toFixed(0)}</p>
                </div>
            </div>
        </div>
    );
};

export default PaymentDetails;