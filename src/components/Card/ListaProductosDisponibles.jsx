import React, { useState, useEffect } from 'react';
import CardProductoDisponible from './CardProductoDisponible';
import './css/ListaProductosDisponibles.css';

const ListaProductosDisponibles = () => {
  const [productos, setProductos] = useState([]);

  // Obtener la URL del backend desde la variable de entorno
  const apiUrl = process.env.REACT_APP_BACKEND_URL.replace(/\/$/, ''); // Elimina la barra final si existe

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        console.log('API URL:', apiUrl); // Verifica la URL del API

        const response = await fetch(`${apiUrl}/api/products`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        });

        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.statusText}`);
        }

        const data = await response.json();
        console.log('Datos recibidos:', data); // Verifica la estructura de los datos

        // Cambié 'data.products' por 'data.product' para reflejar la estructura correcta de los datos
        setProductos(data.product || []); // Acceder correctamente a los productos
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchProductos(); // Llamar al fetch al montar el componente
  }, [apiUrl]);

  return (
    <div className='w-full bg-white p-4 grid lg:grid-cols-4 grid-cols-2 gap-4'>
      {productos.length > 0 ? (
        productos.map(producto => (
          <CardProductoDisponible key={producto.id} producto={producto} />
        ))
      ) : (
        <p className='textSinDisponibilidad text-center w-full col-span-3 text-elqui'>No hay productos disponibles.</p>
      )}
    </div>
  );
};

export default ListaProductosDisponibles;