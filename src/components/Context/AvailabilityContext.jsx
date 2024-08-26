import React from 'react';

const AvailabilityDate = async (DateStar, DateEnd) => {  
    try {
        const response = await fetch(process.env.REACT_APP_BACKEND_URL + '/api/CheckDisponibilidad', 
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                dateStart: DateStar,
                dateEnd: DateEnd,
            }),
        });

        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }

        const data = await response.json();
        return data;
    } catch (error) { 
        console.error('There was a problem with the fetch operation:', error);
    }   
};

export default AvailabilityDate;
