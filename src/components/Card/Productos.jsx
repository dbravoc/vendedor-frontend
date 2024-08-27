import React, { useState, useEffect } from 'react';
import './css/ListaProductosDisponibles.css';

const ListaProductosDisponibles = () => {
  const [productos, setProductos] = useState([]);
  const [editingProductId, setEditingProductId] = useState(null);
  const [editingProductData, setEditingProductData] = useState({});
  const [error, setError] = useState(null);

  // Obtener la URL del backend desde la variable de entorno
  const apiUrl = process.env.REACT_APP_BACKEND_URL.replace(/\/$/, '');

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        console.log('API URL:', apiUrl);

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
        console.log('Datos recibidos:', data);

        setProductos(data.product || []);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Error al cargar los productos.');
      }
    };

    fetchProductos();
  }, [apiUrl]);

  const handleEditClick = (producto) => {
    setEditingProductId(producto.id);
    setEditingProductData(producto);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditingProductData({
      ...editingProductData,
      [name]: value,
    });
  };

  const handleSaveClick = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/products/${editingProductData.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editingProductData),
      });

      if (!response.ok) {
        throw new Error(`Error updating product: ${response.statusText}`);
      }

      const result = await response.json();
      console.log('Producto actualizado:', result);
      setEditingProductId(null);
    } catch (error) {
      console.error('Error updating product:', error);
      setError('Error al actualizar el producto.');
    }
  };

  return (
    <div className='w-full bg-white p-4'>
      {error && <p style={{ color: 'red' }}>{error}</p>} {/* Mostrar mensaje de error si existe */}
      <table className="w-full table-auto">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>SKU</th>
            <th>Descripción</th>
            <th>Precio</th>
            <th>Categorías</th>
            <th>Cantidad Inicial</th>
            <th>Costo Unitario</th>
            <th>Consignación</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productos.length > 0 ? (
            productos.map(producto => (
              <tr key={producto.id}>
                <td>{producto.id}</td>
                {editingProductId === producto.id ? (
                  <>
                    <td><input name="name" value={editingProductData.name || ''} onChange={handleInputChange} /></td>
                    <td>{producto.sku}</td> {/* SKU no editable */}
                    <td><input name="description" value={editingProductData.description || ''} onChange={handleInputChange} /></td>
                    <td><input name="price" value={editingProductData.price || ''} onChange={handleInputChange} /></td>
                    <td><input name="categories" value={editingProductData.categories || ''} onChange={handleInputChange} /></td>
                    <td><input name="initial_quantity" value={editingProductData.initial_quantity || ''} onChange={handleInputChange} /></td>
                    <td><input name="unit_cost" value={editingProductData.unit_cost || ''} onChange={handleInputChange} /></td>
                    <td><input name="consignment" value={editingProductData.consignment || ''} onChange={handleInputChange} /></td>
                    <td>
                      <button onClick={handleSaveClick}>Guardar</button>
                      <button onClick={() => setEditingProductId(null)}>Cancelar</button>
                    </td>
                  </>
                ) : (
                  <>
                    <td>{producto.name}</td>
                    <td>{producto.sku}</td>
                    <td>{producto.description}</td>
                    <td>{producto.price}</td>
                    <td>{producto.categories}</td>
                    <td>{producto.initial_quantity}</td>
                    <td>{producto.unit_cost}</td>
                    <td>{producto.consignment}</td>
                    <td>
                      <button onClick={() => handleEditClick(producto)}>Editar</button>
                    </td>
                  </>
                )}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="10" className='text-center'>No hay productos disponibles.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ListaProductosDisponibles;