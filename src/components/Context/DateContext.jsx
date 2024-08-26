import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Función para obtener la fecha de hoy
const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
};

// Función para obtener la fecha de mañana
const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
};

// Crear el contexto
const DateContext = createContext();

// Proveedor del contexto
export const DateProvider = ({ children }) => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    
    const urlStartDate = queryParams.get('fechaInicio');
    const urlEndDate = queryParams.get('fechaFin');
    
    const [startDate, setStartDate] = useState(() => urlStartDate || getTodayDate());
    const [endDate, setEndDate] = useState(() => urlEndDate || getTomorrowDate());

    useEffect(() => {
        if (urlStartDate) {
            setStartDate(urlStartDate);
        }
        if (urlEndDate) {
            setEndDate(urlEndDate);
        }
    }, [urlStartDate, urlEndDate]);

    return (
        <DateContext.Provider value={{ startDate, setStartDate, endDate, setEndDate }}>
            {children}
        </DateContext.Provider>
    );
};

// Hook personalizado para usar el contexto
export const useDate = () => useContext(DateContext);