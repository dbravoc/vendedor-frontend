import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import Logo from '../../../assets/img/laboraljuridico/Logo_sinfondo.png';

const RotatingText = () => {
  const texts = 
  [
    'Despido injustificado', 
    'Asesoría legal', 
    'Accidente laboral', 
    'Cotizaciones impagas', 
    'Vulneración de derechos', 
    'Ley Bustos', 
    'Autodespido', 
    'Indemnización laboral',
    'Ley Karin',
  ];
  const [currentTextIndex, setCurrentTextIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTextIndex((prevIndex) => (prevIndex + 1) % texts.length);
    }, 700);

    return () => clearInterval(interval);
  }, []);

  return (
    
    <h1 className='rounded-md rounded-bl-3xl px-3 py-2 text-center text-lg font-semibold shadow-sm bg-indigo-600 text-indigo-100'>
      {texts[currentTextIndex]}
    </h1>
  );
};

export default function Inicio() {
  return (
        <div className="flex flex-col justify-center items-center">

          <div className="tracking-tight font-bold text-cyan-100 text-6xl">
          <img className='w-32 h-32' src={Logo} alt="Logo" />
          </div>

         
        </div>
  );
}
