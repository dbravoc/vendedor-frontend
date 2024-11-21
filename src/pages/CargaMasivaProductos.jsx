import React, { useEffect, useState } from 'react';
import './css/inicio.css';
import Header from '../components/Header/header';
import Footer from '../components/Footer/Footer';
import { useWindowScroll } from '@uidotdev/usehooks';
import FormCargaMasivaProductos from '../components/Form/FormCargaMasivaProductos';
const CargaMasivaProductos = () => {
  const [{ y }] = useWindowScroll();
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    if (y > 700) {
      setScrollPosition(1);
    } else {
      setScrollPosition(0);
    }
  }, [y]);


  return (
    <div className="contenedorInicio" >
      <Header scrollPosition={scrollPosition} className="fixed-header" />
      <div className="cuerpo">
        <div className='Cabaña-Inicio' data-aos="fade-up">
        <FormCargaMasivaProductos />
        </div>
        <div className='outer-div-Footer'>
          <Footer />
        </div> 
      </div>
    </div>
  );
};

export default CargaMasivaProductos;
