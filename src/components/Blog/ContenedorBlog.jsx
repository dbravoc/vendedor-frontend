import React, { useState, useEffect } from 'react';

export default function Blog() {
  const [callouts, setCallouts] = useState([]);

  useEffect(() => {
    const apiUrl = process.env.REACT_APP_BLOG_URL; // Usa import.meta.env para acceder a las variables de entorno en Vite
    const fetchArticulos = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/articulos`);
        const data = await response.json();

        // Mapear los datos a la estructura esperada por callouts
        const formattedData = data.map((articulo) => ({
          name: articulo.metadato,
          description: articulo.titulo, // Asegúrate de que 'metadato' es el resumen
          imageSrc: articulo.imagen,      // Asegúrate de que esta columna esté en la base de datos
          href: `/blog/${articulo.id}`,  // Ajusta la ruta según la estructura de tu aplicación
        }));

        setCallouts(formattedData);
      } catch (error) {
        console.error('Error al obtener los artículos:', error);
      }
    };

    fetchArticulos();
  }, []);

return (
    <div style={{ backgroundColor: '#82673B' }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl py-16 sm:py-24 lg:max-w-none lg:py-32">
                <h2 className="text-2xl text-gray-100">Publicaciones del Blog</h2>

                <div className="mt-6 space-y-12 lg:grid lg:grid-cols-3 lg:gap-x-6 lg:space-y-0">
                    {callouts.map((callout) => (
                        <div key={callout.name} className="group relative">
                            <div className="relative h-80 w-full overflow-hidden rounded-lg bg-white sm:aspect-h-1 sm:aspect-w-2 lg:aspect-h-1 lg:aspect-w-1 group-hover:opacity-75 sm:h-64">
                                <img
                                    alt={callout.name}  // Cambia para mostrar el nombre del artículo
                                    src={callout.imageSrc || 'ruta/a/imagen/por/defecto.jpg'}  // Imagen por defecto si no hay imagen
                                    className="h-full w-full object-cover object-center"
                                />
                            </div>
                            <h3 className="mt-6 text-sm text-gray-500">
                                <a href={callout.href}>
                                    <span className="absolute inset-0" />
                                    {callout.name}
                                </a>
                            </h3>
                            <p className="text-base font-semibold text-gray-900">{callout.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </div>
);
}