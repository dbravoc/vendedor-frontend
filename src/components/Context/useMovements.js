import { useState, useEffect } from 'react';

const useMovements = () => {
    const [movements, setMovements] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const backendUrl = process.env.REACT_APP_BACKEND_URL;

    useEffect(() => {
        const fetchMovements = async () => {
            try {
                setIsLoading(true);
                const response = await fetch(`${backendUrl}/api/inventory/movements`);
                
                if (!response.ok) {
                    const errorText = await response.text(); // Obtener texto de error
                    throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
                }

                const contentType = response.headers.get("content-type");
                if (contentType && contentType.indexOf("application/json") !== -1) {
                    const data = await response.json();
                    setMovements(data.data); // Asigna la data de movimientos
                    setError(null);
                } else {
                    throw new Error('La respuesta no es un JSON válido.');
                }
            } catch (err) {
                console.error('Error al obtener los movimientos:', err);
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchMovements();
    }, [backendUrl]);

    return {
        movements,
        isLoading,
        error,
    };
};

export default useMovements;
