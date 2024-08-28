// src/components/Card/Login.js

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Importa useNavigate para redirección

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate(); // Usa useNavigate para redirigir

  const handleLogin = async (event) => {
    event.preventDefault();
    setError(''); // Limpiar errores anteriores
    setMessage(''); // Limpiar mensajes anteriores

    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.details || 'Error al iniciar sesión');
        return;
      }

      setMessage('¡Inicio de sesión exitoso!');
      console.log('Usuario autenticado:', data.user);
      console.log('Token de acceso:', data.access_token);
      
      // Guarda el token de acceso en el almacenamiento local
      localStorage.setItem('access_token', data.access_token);

      // Redirige al usuario a la página protegida
      navigate('/inicio');

    } catch (error) {
      console.error('Error en la solicitud de inicio de sesión', error);
      setError('Error del servidor. Por favor, inténtalo de nuevo más tarde.');
    }
  };

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img
          alt="Your Company"
          src="./images/icon/logoBUCONT.png"
          className="mx-auto h-36 w-auto"
        />
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Iniciar sesión en tu cuenta
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form onSubmit={handleLogin} className="space-y-6">
          {/* Form Fields */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
              Dirección de correo electrónico
            </label>
            <div className="mt-2">
              <input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-bu2 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                Contraseña
              </label>
              <div className="text-sm">
                <a href="#" className="font-semibold text-bu2 hover:text-bu2">
                  ¿Olvidaste tu contraseña?
                </a>
              </div>
            </div>
            <div className="mt-2">
              <input
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-bu2 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-bu2 bg px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-bu2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bu2"
            >
              Iniciar sesión
            </button>
          </div>
        </form>

        {error && <p className="mt-2 text-center text-sm text-red-600">{error}</p>}
        {message && <p className="mt-2 text-center text-sm text-green-600">{message}</p>}

        <p className="mt-10 text-center text-sm text-gray-500">
          ¿No tienes una cuenta?{' '}
          <p className="font-semibold leading-6 text-bu2 hover:text-bu2">
            Contacta con el administrador
          </p>
        </p>
      </div>
    </div>
  );
};

export default Login;