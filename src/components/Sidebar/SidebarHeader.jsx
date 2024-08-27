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
              <a href="/dashboard" className="sidebar-item">Dashboard</a>
              <a href="/productos" className="sidebar-item">Productos</a>
              <a href="/inventario" className="sidebar-item">Inventario</a>
              <a href="/alertas" className="sidebar-item">Alertas</a>
              <a href="/manual" className="sidebar-item">Gestión manual</a>
            </div>
          </div>
        </div>
      </CSSTransition>

    </>
  );
};

export default SidebarHeader;
