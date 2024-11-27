import React, { useEffect, useState } from 'react';
import './css/inicio.css';
import Header from '../components/Header/header';
import Footer from '../components/Footer/Footer';
import { useWindowScroll } from '@uidotdev/usehooks';
import PurchasesManager from '../components/Card/PurchasesManager';
const Movimientos = () => {
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
      <div className="overflow-x-auto">
      <Header scrollPosition={scrollPosition} className="fixed-header" />
      <div className="cuerpo">
        <div className='Cabaña-Inicio' data-aos="fade-up">
          <PurchasesManager />
        </div>
        <div className='outer-div-Footer'>
          <Footer />
        </div> 
      </div>
      </div>
    </div>
  );
};

export default Movimientos;
