import React from 'react';
import SidebarHeader from '../Sidebar/SidebarHeader'; // Importa el componente SidebarHeader 
import './css/header.css'; // Importa el archivo de estilos CSS

const Header = ({ scrollPosition }) => {
  const headerClass = 'header-solid' ; // Selecciona la clase del header en función de scrollPosition
  const logoWhite = "./images/icon/logoBUCONT.png";
  const logoBlack = "./images/icon/logoBUCONT.png";

  const logo = scrollPosition === 1 ? logoBlack : logoWhite; // Selecciona el logo en función de scrollPosition

  return (
    <header className={headerClass}>
      <div className="logo-container-header">
        <a href="/inicio">
          <img src={logo} alt="Logo de la empresa" className="logo" />
        </a>
      </div>
      <div className="button-container">
        <div className="sidebar-container-header">
          <SidebarHeader />
        </div>
      </div>

    </header>
  );
};

export default Header;
