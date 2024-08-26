import React from 'react';
import { Link } from 'react-router-dom';  // Importación añadida para que funcione el Link
import './css/Footer.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram, faWhatsapp } from '@fortawesome/free-brands-svg-icons';
const Footer = () => {
  const logo = "https://lqieogqayryfoykmpoey.supabase.co/storage/v1/object/public/imagenes/logo%20bucont%20azul%20png";
  return (
    <div className="footer">
      <div className="logo-container-footer">
        <img src={logo} alt="Imagen Logo" className='logo-footer' />

      </div> 
      <div className='column-footer-description'> 
          <p className='p1'>Bucont SpA</p> 
          <p className='p2'>Oficina de soluciones tecnológicas </p>
          <p className='p2'>www.bucont.com </p>

      </div>
      <div className="column-footer-rows">
        <p className="contact-title">Contacto</p> 
        <p className="contact-info">Santiago, Chile</p>
        <p className="contact-info">david@bucont.com</p>
        
      </div>
    </div>
  );
};

export default Footer;