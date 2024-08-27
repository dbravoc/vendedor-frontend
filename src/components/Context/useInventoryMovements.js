import { useState, useEffect } from 'react';

const useInventoryMovements = () => {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [stockData, setStockData] = useState({});

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

                    // Fetch current stock for each product
                    await Promise.all(data.product.map(async (product) => {
                        const stockResponse = await fetch(`${backendUrl}/api/stock/${product.id}`);
                        
                        if (!stockResponse.ok) {
                            console.error(`Error fetching stock for product ID ${product.id}`);
                            return;
                        }

                        const stockData = await stockResponse.json();
                        setStockData((prevStockData) => ({
                            ...prevStockData,
                            [product.id]: stockData.currentStock
                        }));
                    }));
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

    return {
        products,
        isLoading,
        error,
        stockData,
    };
};

export default useInventoryMovements;