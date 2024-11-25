import { useState, useEffect } from 'react';

const usePurchases = () => {
    const [purchases, setPurchases] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const backendUrl = process.env.REACT_APP_BACKEND_URL;

    useEffect(() => {
        const fetchPurchases = async () => {
            try {
                setIsLoading(true);
                const response = await fetch(`${backendUrl}/api/purchases`);
                
                if (!response.ok) {
                    const errorText = await response.text(); // Obtener texto de error
                    throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
                }

                const contentType = response.headers.get("content-type");
                if (contentType && contentType.indexOf("application/json") !== -1) {
                    const data = await response.json();
                    setPurchases(data.data); // Asigna la data de compras
                    setError(null);
                } else {
                    throw new Error('La respuesta no es un JSON válido.');
                }
            } catch (err) {
                console.error('Error al obtener las compras:', err);
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPurchases();
    }, [backendUrl]);

    return {
        purchases,
        isLoading,
        error,
    };
};

export default usePurchases;
