import React, { useState, useEffect } from 'react';
import { CSSTransition } from 'react-transition-group';
import './css/SidebarHeader.css'; // Importa el archivo de estilos CSS

const SidebarHeader = () => {
  const logo = "https://lqieogqayryfoykmpoey.supabase.co/storage/v1/object/public/imagenes/logo%20bucont%20azul%20png";
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(prevIsOpen => !prevIsOpen);
  };

  const closeSidebar = (event) => {
    if (!event.target.closest('.sidebar')) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.body.addEventListener('click', closeSidebar);
    return () => {
      document.body.removeEventListener('click', closeSidebar);
    };
  }, []);

  return (
    <>
      <div className={`sidebar ${isOpen ? 'open' : ''}`} onClick={toggleSidebar}>
        <div className="line"></div>
        <div className="line"></div>
        <div className="line"></div>
      </div>
      <CSSTransition
        in={isOpen}
        timeout={500}
        classNames="sidebar"
        unmountOnExit
      >
        <div className="sidebar-background">
          <div className="sidebar-content">
            <div className="sidebar-header">
              <div className="logo-container-Sidebar">
                <a href="/">
                  <img src={logo} alt="Logo de la empresa" className="logo" />

                </a>
              </div>
            </div>
            <div className="sidebar-body">
              <a href="/" className="menu-item">Inicio</a>
              <a href="/tienda" className="sidebar-item">Todo</a>
              <div className="experiencias-item" onClick={toggleSidebar}>
                <div className="experiencias-content">
                  Categorías
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="arrow-icon">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 5.25 7.5 7.5 7.5-7.5m-15 6 7.5 7.5 7.5-7.5" />
                  </svg>
                </div>
                <div className="submenu">
                  <a href="/Experiencias/Observatorio" className="submenu-item">Categoría 1</a>
                  <a href="/Experiencias/Tours" className="submenu-item">Categoría 2</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CSSTransition>

    </>
  );
};

export default SidebarHeader;
