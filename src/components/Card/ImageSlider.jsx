import React, { useState, useRef } from 'react';
import './css/ImageSlider.css';
import Calendar from '../Calendar/Calendar';

const ImageSlider = ({ tipo }) => {
  const [videoLoaded, setVideoLoaded] = useState(false);
  const videoRef = useRef(null);

  const videoplantas = "https://ezcbvdobzemkdzwavevc.supabase.co/storage/v1/object/public/lalocadelasplantas/videos/plantas.mp4?t=2024-08-17T00%3A43%3A19.877Z";
  const imagenTienda = "https://ezcbvdobzemkdzwavevc.supabase.co/storage/v1/object/public/lalocadelasplantas/servicios/tienda.jpg";

  const handleVideoLoaded = () => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 1;
      videoRef.current.loop = true; // Asegurar que el video esté en bucle
      videoRef.current.play(); // Reproducir el video una vez cargado
    }
    setVideoLoaded(true);
  };

  let imagen;
  let texto;
  let sliderOverlay;

  switch (tipo) {
    case 'Inicio':
      texto = 'CONOCE NUESTRO VIVERO URBANO';
      sliderOverlay = 'Slider-overlay absolute bottom-0 w-full sm:h-5vh md:h-8vh lg:h-10vh xl:h-15vh hidden lg:flex';
      break;
    case 'Tienda':
      imagen = imagenTienda;
      texto = 'EXPLORA NUESTRA TIENDA';
      break;
    default:
      texto = '';
      imagen = '';
  }

  return (
    <div className="image-slider">
      <div className='overlay'></div>
      <div className='Fondo'></div>

      {tipo === 'Inicio' ? (
        <div className='w-screen h-screen object-cover'>
          {!videoLoaded && <img src={imagen} className='w-screen h-screen object-cover' alt="background" />}
          <video
            ref={videoRef}
            className='w-screen h-screen object-cover'
            src={videoplantas}
            autoPlay
            muted
            loop
            controls={false}
            playsInline
            onLoadedData={handleVideoLoaded}
          >
            Your browser does not support the video tag.
          </video>
        </div>
      ) : (
        imagen && <img src={imagen} className='w-screen h-screen object-cover' alt="background" />
      )}

      {(tipo === 'Inicio' || tipo === 'Tienda') && (
        <Calendar />
      )}

      {sliderOverlay && (
        <div className={sliderOverlay}>
          <p>{texto}</p>
          {tipo === 'Tienda' && (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="arrow-down" onClick={() => window.scrollTo({ top: 710, behavior: 'smooth' })}>
              <path fillRule="evenodd" d="M4.22 6.22a.75.75 0 0 1 1.06 0L8 8.94l2.72-2.72a.75.75 0 1 1 1.06 1.06l-3.25 3.25a.75.75 0 0 1-1.06 0L4.22 7.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
            </svg>
          )}
        </div>
      )}
    </div>
  );
};

export default ImageSlider;