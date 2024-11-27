import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
const SuppliersManager = () => {
    const [suppliers, setSuppliers] = useState([]);
    const [searchTerm, setSearchTerm] = useState(''); // Estado para el término de búsqueda
    const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'ascending' }); // Configuración de orden
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [showForm, setShowForm] = useState(false); // Estado para mostrar u ocultar el formulario
    const [supplierName, setSupplierName] = useState(''); // Estado para el nombre del proveedor
    const [isSubmitting, setIsSubmitting] = useState(false); // Estado para saber si el formulario está enviando datos
    const [consignment, setConsignment] = useState(false); // Estado para "Sí" o "No"

    // Función para manejar el cambio de orden
    const requestSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    // Función de ordenación
    const sortedSuppliers = React.useMemo(() => {
        let sortableSuppliers = [...suppliers];

        // Ordenamos solo si hay una clave de ordenación
        if (sortConfig.key) {
            sortableSuppliers.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableSuppliers;
    }, [suppliers, sortConfig]); // El useMemo asegura que no se vuelva a ordenar a menos que cambien los proveedores o la configuración de orden

    useEffect(() => {
        const fetchSuppliers = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/suppliers`);
                setSuppliers(response.data.data);
            } catch (error) {
                console.error("Error fetching suppliers:", error);
            }
        };

        fetchSuppliers();
    }, []);

    const toggleForm = () => {
        setShowForm(!showForm); // Cambia la visibilidad del formulario
    };

    const handleNameChange = (e) => {
        setSupplierName(e.target.value); // Actualiza el estado del nombre del proveedor
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true); // Empieza a enviar los datos

        try {
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/suppliers`, {
                name: supplierName,
                consignment: consignment,
            });

            // Mensaje de éxito después de todas las solicitudes
            setSuccessMessage('Productos agregados exitosamente');
            setTimeout(() => setSuccessMessage(''), 10000);
            setSupplierName('');
        } catch (error) {
            console.error(error);
            setErrorMessage('Ocurrió un error al agregar los productos');
            setSuccessMessage('');
            setTimeout(() => setErrorMessage(''), 10000);
        } finally {
            setIsSubmitting(false); // Finaliza el proceso de envío
        }
    };

    return (
        <div className="bg-white min-h-screen w-screen py-24 sm:py-32">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto text-justify">
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
                        <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                            Proveedores
                        </p>
                    <div className="flex items-center justify-between">
                        {/* Buscador y boton agregar proveedor*/}
                        <input
                            type="text"
                            placeholder="Buscar..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="mb-4 p-2 border border-gray-300 rounded"
                        />

                        {/* Botón para mostrar el formulario */}
                        <button
                            onClick={toggleForm}
                            className="agregar-producto-button"
                        >
                            Agregar Proveedor
                        </button>
                    </div>
                        {/* Formulario para agregar un proveedor */}

                    <div className="mt-4 p-4 border rounded bg-gray-100">
                            {showForm && (

                                    <form onSubmit={handleSubmit}>
                                        <div className="mb-4">
                                            
                                            <div className="flex items-center gap-4 mt-1">
                                            <div className="mb-4">
                                                <label htmlFor="supplierName" className="block text-sm font-medium text-gray-700">Nombre del Proveedor</label>
                                                {/* Campo de entrada */}
                                                <input
                                                    type="text"
                                                    id="supplierName"
                                                    value={supplierName}
                                                    onChange={handleNameChange}
                                                    className="p-2 border border-gray-300 rounded w-full"
                                                    required
                                                />
                                                </div>

                                                {/* Selector para "Sí" o "No" */}
                                                <div className="mb-4">
                                                    <label htmlFor="consignment" className="block text-sm font-medium text-gray-700">Consignación</label>
                                                    <select
                                                        id="consignment"
                                                        value={consignment ? 'yes' : 'no'}  // Muestra 'yes' si consignment es true, 'no' si es false
                                                        onChange={(e) => setConsignment(e.target.value === 'yes')} // Actualiza consignment como booleano
                                                        className="p-2 border border-gray-300 rounded w-full"
                                                    >
                                                        <option value="yes">Sí</option>
                                                        <option value="no">No</option>
                                                    </select>
                                                </div>
                                                {/* Botones de acción */}
                                                <button
                                                    type="submit"
                                                    className="bg-blue-500 text-white p-2 rounded"
                                                    disabled={isSubmitting}
                                                >
                                                    {isSubmitting ? 'Enviando...' : 'Agregar'}
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={toggleForm}
                                                    className="border-2 border-blue-500 text-blue-500 p-2 rounded bg-transparent hover:bg-blue-50"
                                                >
                                                    Cancelar
                                                </button>
                                            </div>
                                        </div>
                                    </form>

                            )}
                    </div>
                        {/* Tabla de proveedores */}
                    <table className="text-xs border-2 w-full">
                        <thead>
                            <tr>
                                <th className="border border-gray-300 p-2 cursor-pointer"onClick={() => requestSort('name')}>
                                    Proveedor {sortConfig.key === 'name' ? (sortConfig.direction === 'ascending' ? '↑' : '↓') : null}
                                </th>
                                <th className="border border-gray-300 p-2 cursor-pointer"onClick={() => requestSort('consignment')}>
                                    Consignación {sortConfig.key === 'consignment' ? (sortConfig.direction === 'ascending' ? '↑' : '↓') : null}
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedSuppliers
                                // Filtrado por término de búsqueda después de la ordenación
                                .filter(supplier => supplier.name.toLowerCase().includes(searchTerm.toLowerCase())) 
                                .map((supplier, index) => (
                                    <tr key={index}>
                                        <td className="border border-gray-300 p-2">{supplier.name}</td>
                                        <td className="border border-gray-300 p-2">{supplier.consignment ? "Si" : "No"}</td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default SuppliersManager;
