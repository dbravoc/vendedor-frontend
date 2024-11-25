import React, { useEffect, useState } from 'react';
import { useWindowScroll } from '@uidotdev/usehooks';
import { useNavigate } from 'react-router-dom';

import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import axios from 'axios';

const FormPurchase = () => {
    const navigate = useNavigate();
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const [{ y }] = useWindowScroll();
    const [scrollPosition, setScrollPosition] = useState(0);

    const [products, setProducts] = useState([]);
    const [selectedSupplier, setSelectedSupplier] = useState(null); // Proveedor seleccionado
    const [filteredProducts, setFilteredProducts] = useState([]); // Productos filtrados
    const [suppliers, setSuppliers] = useState([]);
    const [purchase, setPurchase] = useState([
        {
            product_id: '',
            quantity: 1,
            unit_cost: 0,
/*             name: '',
            sku: '',
            description: '',
            type: '',
            categories: '',
            price: 0,
            consignment: false,
            min_diameter: '',
            max_diameter: '',
            pot_diameter: '',
            commission_type: '',
            commission: '', */
        }
    ]);
    const [commonFields, setCommonFields] = useState({
        supplier_id: '',
        date: new Date().toISOString().split('T')[0] // Obtiene la fecha en formato YYYY-MM-DD
    });
    
    useEffect(() => {
        if (y > 700) {
            setScrollPosition(1);
        } else {
            setScrollPosition(0);
        }
    }, [y]);

    // Obtener los proveedores
    useEffect(() => {
        
        const fetchSuppliers = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/suppliers`);
                setSuppliers(response.data.data);
            } catch (error) {
                console.error("Error al obtener los proveedores:", error);
            }
        };

        fetchSuppliers();
    }, []);

    // Obtener los productos
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/products`);
                setProducts(response.data.product);
            } catch (error) {
                console.error("Error al obtener los productos:", error);
            }
        };

        fetchProducts();
    }, []);

    // Filtrar productos según el proveedor seleccionado
    useEffect(() => {
        if (selectedSupplier) {
            const filtered = products.filter((product) => product.supplier_id === selectedSupplier.id);
            setFilteredProducts(filtered);
        } else {
            setFilteredProducts([]);
        }
    }, [selectedSupplier, products]);

    const handleChange = (e, index) => {
        const { name, value } = e.target;
        if (['supplier_id'].includes(name)) {
            setCommonFields((prevState) => ({
                ...prevState,
                [name]: value,
            }));
        } else if (name === 'date') {
            setCommonFields((prevState) => ({
                ...prevState,
                date: value,
            }));
        } else {
            const newPurchase = [...purchase];
            newPurchase[index][name] = value;
            setPurchase(newPurchase);
        }
    };
    

    const handlePurchaseChange = (event, newValue, index) => {
        const newPurchase = [...purchase];
        newPurchase[index] = {
            product_id: newValue ? newValue.id : '',
            quantity: newPurchase[index]?.quantity || 1,
            unit_cost: newValue ? newValue.unit_cost : 0,
/*             name: newValue ? newValue.name : '',
            sku: newValue ? newValue.sku : '',
            description: newValue ? newValue.description : '',
            type: newValue ? newValue.type : '',
            categories: newValue ? newValue.categories : '',
            price: newValue ? newValue.price : 0,
            consignment: newValue ? newValue.consignment : false,
            min_diameter: newValue ? newValue.min_diameter : '',
            max_diameter: newValue ? newValue.max_diameter : '',
            pot_diameter: newValue ? newValue.pot_diameter : '',
            commission_type: newValue ? newValue.commission_type : '',
            commission: newValue ? newValue.commission : '', */
        };
        setPurchase(newPurchase);
    };
    

/*     const addRow = () => {
        setPurchase([...purchase, {
            product_id: '',
            quantity: 1,
            unit_cost: 0,
        }]);
    }; */

    // Agregar nueva fila de producto
    const addRow = () => {
        setPurchase([...purchase, { product: null }]);
    };
    // Manejar cambio de producto
    const handleProductChange = (index, newValue) => {
        const updatedPurchase = [...purchase];
        updatedPurchase[index].product = newValue;
        setPurchase(updatedPurchase);
    };

    const handleQuantityChange = (index, value) => {
        setPurchase((prev) =>
            prev.map((item, i) =>
                i === index ? { ...item, quantity: value } : item
            )
        );
    };
    
    const handleCostChange = (index, value) => {
        setPurchase((prev) =>
            prev.map((item, i) =>
                i === index ? { ...item, cost: value } : item
            )
        );
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {

            const productslist = purchase.map(item => ({
                product_id: item.product.id, // Asegúrate de que esto sea un string válido
                quantity: parseInt(item.quantity, 10), // Convertir la cantidad a un número entero
                unit_cost: parseFloat(item.cost), // Convertir el costo a número decimal
            }));
            
            // Ahora vamos a asegurar que productslist se pase correctamente en dataToSend
            const dataToSend = {
                productslist: productslist, // Asegurarse de que es un arreglo no vacío
                date: commonFields.date, // Asegúrate de que la fecha sea válida en formato "YYYY-MM-DD"
                supplier_id: parseInt(selectedSupplier.id, 10), // Convertir a número entero
            };
            console.log(dataToSend.date)
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/purchase`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dataToSend)
            });    

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
                <div className="mx-auto max-w-lg text-left mb-6">
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
                        Ingresar Compra
                    </p>
                </div>
                
                <div className="movement-form-container max-w-7xl px-6 lg:px-8">

                <div className="mt-0 text-xl font-semibold text-gray-900">
                    Proveedor
                </div>

                <div className="my-4 border-t border-gray-300"></div>

                    <form onSubmit={handleSubmit}>
                        {/* Selección inicial de proveedor */}
                        <div className="mb-6">
                            <Autocomplete
                                options={suppliers}
                                getOptionLabel={(option) => option.name || ""}
                                onChange={(event, newValue) => setSelectedSupplier(newValue)}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Selecciona un proveedor"
                                        variant="outlined"
                                        required
                                        fullWidth
                                    />
                                )}
                            />
                        </div>

                        <div className="mt-4 text-xl font-semibold text-gray-900">
                            Productos
                        </div>
                        <div className="my-4 border-t border-gray-300"></div> {/* Separador delgado con color gris claro */}
                        {/* Campos dinámicos de productos */}
                        {purchase.map((item, index) => (
                            <div key={index} className="flex items-center gap-4 mb-4">
                                {/* Campo de selección de producto */}
                                <div className="flex-grow">
                                    <Autocomplete
                                        options={filteredProducts}
                                        getOptionLabel={(option) => option.name || ""}
                                        onChange={(event, newValue) => handleProductChange(index, newValue)}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label="Selecciona un producto"
                                                variant="outlined"
                                                required
                                                fullWidth
                                            />
                                        )}
                                        disabled={!selectedSupplier}
                                    />
                                </div>

                                {/* Campo de cantidad */}
                                <TextField
                                    label="Cantidad"
                                    type="number"
                                    value={item.quantity || ""}
                                    onChange={(e) => handleQuantityChange(index, e.target.value)}
                                    variant="outlined"
                                    required
                                    className="w-24"
                                />

                                {/* Campo de costo */}
                                <TextField
                                    label="Costo"
                                    type="number"
                                    value={item.cost || ""}
                                    onChange={(e) => handleCostChange(index, e.target.value)}
                                    variant="outlined"
                                    required
                                    className="w-24"
                                />

                                {/* Campo de total (cantidad * costo) */}
                                <TextField
                                    label="Total"
                                    value={item.quantity && item.cost ? item.quantity * item.cost : 0}
                                    variant="outlined"
                                    InputProps={{
                                        readOnly: true,  // Deshabilita la edición pero mantiene el estilo
                                    }}
                                    className="w-24"
                                />
                            </div>
                        ))}

                        {/* Botón para agregar más productos */}
                        <button
                            type="button"
                            onClick={addRow}
                            className="bg-blue-500 text-white p-2 rounded mt-4 mb-6"
                            disabled={!selectedSupplier} // Deshabilitar si no hay un proveedor seleccionado
                        >
                            Agregar producto
                        </button>
    
                        {/* Información adicional */}
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

export default FormPurchase;