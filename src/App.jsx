import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import ResetURL from './components/Common/ResetUrl';
import 'aos/dist/aos.css';
import AOS from 'aos';
import { useLocation } from 'react-router-dom';
import Inicio from './pages/Inicio';
import Productos from './pages/Productos'; // Asegúrate de importar el nuevo componente

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

function App() {
  useEffect(() => {
    AOS.init({
      once: false,
      duration: 1000,
    }); 
  }, []);

  return (
    <Router> {/* Router envuelve todo */}
      <ScrollToTop />
      <div className="App font-poppins">
        <Routes>
          <Route path="/" element={<Inicio />} /> {/* Ruta principal */}
          <Route path="/productos" element={<Productos />} /> {/* Nueva ruta para Gestión de Productos */}
          <Route path="*" element={<ResetURL />} /> {/* Ruta de manejo de errores */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;