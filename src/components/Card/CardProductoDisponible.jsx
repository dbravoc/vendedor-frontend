import React, { useState, useEffect } from 'react';
import { useShoppingCart } from '../Context/ShoppingCartContext';

const CardProductoDisponible = ({ producto }) => {
  const [productoState, setProductoState] = useState(producto);
  const { addItemToCart } = useShoppingCart();
  const [stock, setStock] = useState(null); // Estado para almacenar el stock actual

  const handleAddItem = () => {
    addItemToCart(productoState);
  };

  useEffect(() => {
    if (!productoState.cantidad) {
      setProductoState({ ...productoState, cantidad: 1 });
    }

    // Fetch para obtener el stock actual desde el backend
    const fetchStock = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/stock/${producto.id}`);
        if (!response.ok) {
          throw new Error(`Error al obtener el stock: ${response.statusText}`);
        }
        const data = await response.json();
        setStock(data.currentStock); // Actualizar el estado con el stock actual
      } catch (error) {
        console.error('Error fetching stock:', error);
      }
    };

    fetchStock(); // Llamar al fetch cuando el componente se monte

  }, [producto]);

  return (
    <div className={`contenedor grid grid-row-2 bg-gray-100 rounded-md shadow-lg relative`}>
      <div className='carrusel-info grid grid-cols-1 gap-4'>
        <div className='carrusel'>
          <img className='w-full h-64 object-cover rounded-md' src={producto.image_1} alt={producto.name} />
        </div>

        <div className='info text-center flex flex-col justify-between'>
          <div className='info-titulo text-xl font-bold pt-4'>
            {producto.name}
            <p className='mx-1 text-center text-xs'>{stock !== null ? `Stock: ${stock} (u)` : 'Cargando inventario...'}</p>

          </div>
          {/* DESCRIPCION 
          <div className='info-descripcion text-xs text-justify pt-2 px-4'>
            {producto.description}
          </div>
          */}
          <div className='flex flex-col items-center pt-2'>
            <p className='mx-1 text-center w-min'>${producto.price}</p>
          </div>
        </div>
      </div>

      <div className='tarifa-boton flex flex-col justify-end my-4'>
        <div className='boton'>
          <button className='bg-elqui w-3/4 py-2 text-white h-auto border-none cursor-pointer font-bold' onClick={handleAddItem} disabled={stock === 0}>
            {stock === 0 ? 'SIN STOCK' : 'AGREGAR'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CardProductoDisponible;