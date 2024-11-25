import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation, Navigate } from 'react-router-dom';
import './App.css';
import ResetURL from './components/Common/ResetUrl';
import 'aos/dist/aos.css';
import AOS from 'aos';
import Inicio from './pages/Inicio';
import Productos from './pages/Productos';
import Inventario from './pages/Inventario';
import Login from './components/Login/CardLogin';
import CreateProductos from './pages/CreateProductos';
import Movimientos from './pages/Movimientos';
import Compras from './pages/Compras';
import CargaMasivaProductos from './pages/CargaMasivaProductos';
import CreateMovement from './pages/CreateMovement';
import CreatePurchase from './pages/CreatePurchase';
import Proveedores from './pages/Proveedores';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

function ProtectedRoute({ children }) {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('access_token');
      if (token) {
        // Aquí podrías hacer una llamada a tu backend para verificar el token y el acceso del usuario.
        setIsAuthorized(true);
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  if (!isAuthorized) {
    return <Navigate to="/" replace />;
  }

  return children;
}

function App() {
  useEffect(() => {
    AOS.init({
      once: false,
      duration: 1000,
    }); 
  }, []);

  return (
    <Router>
      <ScrollToTop />
      <div className="App font-poppins">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/inicio" element={<ProtectedRoute><Inicio /></ProtectedRoute>} />
          <Route path="/productos" element={<ProtectedRoute><Productos /></ProtectedRoute>} />
          <Route path="/agregarProducto" element={<ProtectedRoute><CreateProductos /></ProtectedRoute>} />
          <Route path="/CargaMasivaProductos" element={<ProtectedRoute><CargaMasivaProductos /></ProtectedRoute>} />
          <Route path="/inventario" element={<ProtectedRoute><Inventario /></ProtectedRoute>} />
          <Route path="/movimientos" element={<ProtectedRoute><Movimientos /></ProtectedRoute>} />
          <Route path="/compras" element={<ProtectedRoute><Compras /></ProtectedRoute>} />
          <Route path="/nuevo_movimiento" element={<ProtectedRoute><CreateMovement /></ProtectedRoute>} />
          <Route path="/nueva_compra" element={<ProtectedRoute><CreatePurchase /></ProtectedRoute>} />
          <Route path="/proveedores" element={<ProtectedRoute><Proveedores /></ProtectedRoute>} />
          <Route path="*" element={<ResetURL />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;