import React from 'react';
import './css/Calendar.css';

const Calendar = () => {
  const logoblanco = "https://ezcbvdobzemkdzwavevc.supabase.co/storage/v1/object/public/lalocadelasplantas/logos/Tienda%20Digital%20(6).png";

  return (
    <div className="white-box flex flex-col">
      <img className='w-screen h-auto' src={logoblanco} alt="Logo" />
    </div>
  );
};

export default Calendar;