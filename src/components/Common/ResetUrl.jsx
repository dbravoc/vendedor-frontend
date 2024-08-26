
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ResetURL = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/', { replace: true });
  }, [navigate]);

  return null;
};

export default ResetURL; 

//ResetURL es un componente funcional que redirige al usuario a la página de inicio de la aplicación. 
//Es usado en App.jsx para redirigir al usuario a la página de inicio si intenta acceder a una URL no válida.