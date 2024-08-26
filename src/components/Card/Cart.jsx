import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-regular-svg-icons';
import { useShoppingCart } from '../Context/ShoppingCartContext';
import { useNavigate } from 'react-router-dom';

const DetallesCompra = () => {  
  const { cart, clearCart, removeItemFromCart, addItemToCart } = useShoppingCart();  
  const navigate = useNavigate();

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.cantidad, 0);
  const total = subtotal;

  const handleContinue = () => {
    navigate('/Compra/FormularioPago');
  };

  const handleClearCart = () => {
    clearCart();
  };

  const handleIncreaseQuantity = (item) => {
    addItemToCart({ ...item, cantidad: 1 });
  };

  const handleDecreaseQuantity = (item) => {
    if (item.cantidad > 1) {
      addItemToCart({ ...item, cantidad: -1 });
    } else {
      removeItemFromCart(item.id); // Remueve el item si la cantidad es 1 y se quiere disminuir
    }
  };

  return (
    <div className="contenedor grid grid-row-2 bg-gray-100 shadow-lg font-montserrat gap-2 relative p-4">
      <div className="titulo font-bold text-xl pb-4">
        <p>
          DETALLES DE COMPRA
        </p>
      </div>
      <div className="calculadora flex flex-col gap-y-4">
        {cart.map((item, index) => (
          <div key={index} className="producto border-b-2 flex justify-between items-center">
            <div>
              <p className="text-left font-bold">{item.name}</p>
              <div className="flex items-center mt-2">
                <button 
                  className="bg-gray-300 px-2 py-1 rounded-md"
                  onClick={() => handleDecreaseQuantity(item)}
                >
                  -
                </button>
                <span className="mx-4">{item.cantidad}</span>
                <button 
                  className="bg-gray-300 px-2 py-1 rounded-md"
                  onClick={() => handleIncreaseQuantity(item)}
                >
                  +
                </button>
              </div>
            </div>
            <div className='flex justify-end'>
              <p>${item.price}</p>
              <button 
                onClick={() => removeItemFromCart(item.id)} 
                className="ml-4 text-red-500 hover:text-red-700"
              >
                <FontAwesomeIcon icon={faTrashAlt} />
              </button>
            </div>
          </div>
        ))}
        <div className="total flex justify-between font-bold text-xl">
          <p className="">TOTAL</p>
          <p>${total.toFixed(0)}</p>
        </div>
      </div>
      <button 
        onClick={handleContinue} 
        className={`mt-6 py-2 h-auto border-none cursor-pointer font-bold ${
          cart.length === 0 ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-elqui text-white'
        }`}
        disabled={cart.length === 0}
      >
        CONTINUAR
      </button>
      <button onClick={handleClearCart} className="mt-2 text-elqui h-auto border-none cursor-pointer text-sm">
        Limpiar carrito
      </button>
    </div>
  );
};

export default DetallesCompra;