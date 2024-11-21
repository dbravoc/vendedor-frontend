import { useState, useEffect } from 'react';

const useProducts = () => {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editingProductId, setEditingProductId] = useState(null);
    const [formData, setFormData] = useState({});

    const backendUrl = process.env.REACT_APP_BACKEND_URL;

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setIsLoading(true);
                const response = await fetch(`${backendUrl}/api/products`);
                
                if (!response.ok) {
                    const errorText = await response.text(); // Obtener texto de error
                    throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
                }

                const contentType = response.headers.get("content-type");
                if (contentType && contentType.indexOf("application/json") !== -1) {
                    const data = await response.json();
                    setProducts(data.product);
                    setError(null);
                } else {
                    throw new Error('La respuesta no es un JSON válido.');
                }
            } catch (err) {
                console.error('Error al obtener los productos:', err);
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProducts();
    }, [backendUrl]);

    const handleInputChange = (e, id) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [id]: {
                ...prevData[id],
                [name]: value,
            },
        }));
    };

    const handleSaveProduct = async (id) => {
        console.log("llego hasta handle save product")
        try {
            const response = await fetch(`${backendUrl}/api/products/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData[id]),
            });

            if (!response.ok) {
                const errorText = await response.text(); // Obtener texto de error
                throw new Error(`Error al actualizar el producto: ${errorText}`);
            }

            const data = await response.json();
            setProducts((prevProducts) => 
                prevProducts.map((product) => (product.id === id ? { ...product, ...formData[id] } : product))
            );
            setEditingProductId(null);
            setError(null);
        } catch (err) {
            console.error('Error al actualizar el producto:', err);
            setError(err.message);
        }
    };

    return {
        products,
        isLoading,
        error,
        editingProductId,
        setEditingProductId,
        formData,
        handleInputChange,
        handleSaveProduct,
    };
};

export default useProducts;