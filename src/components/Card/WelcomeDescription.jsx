import React from 'react';
import './css/WelcomeDescription.css'; // Asegúrate de tener este archivo CSS en la misma carpeta

const WelcomeDescription = () => {
  return (
    <div className="welcome-description">
      <div className='column-welcome'>
        <div className="text-row">
          <div className='Titulo-1-Inicio'>
          VIVERO, TIENDA, ECOMMERCE, ASESORIAS Y TALLERES
          </div> 
          <div className='Titulo-2-Inicio'> 
            SOMOS UN VIVERO URBANO
          </div>
        </div>
      </div>
      <div className='column-welcome'>
        <div className="text-row">
          <div className='Texto-Bienvenida'>
            <p>Conoce todos los servicios que entregamos como vivero urbano. Desde comprar una planta en nuestra tienda o ecommerce, recibir una asesoria en tu hogar o por videollamada o participar en nuestros talleres. Lo hacemos todo.</p>
          </div>
    
        </div>
        

      </div>

    </div>
  );
};

export default WelcomeDescription;