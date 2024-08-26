import React from 'react';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function Articulo() {
  const { idArticulo } = useParams(); // Obtiene el idArticulo de la URL
  const [articulo, setArticulo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const apiUrl = import.meta.env.REACT_APP_BLOG_URL; // Usar import.meta.env en lugar de process.env
    const fetchArticulo = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/articulos/${idArticulo}`);
        const data = await response.json();
        setArticulo(data);
      } catch (error) {
        console.error('Error al obtener el artículo:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticulo();
  }, [idArticulo]);

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (!articulo) {
    return <div>Artículo no encontrado</div>;
  }

  return (
    <main className="grid min-h-full place-items-center px-6 py-24 sm:py-32 lg:px-8">
      <div className="flex flex-col justify-center text-justify lg:w-2/3 mx-auto">
        <p className="text-base font-semibold text-indigo-600">#{articulo.metadato}</p>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">{articulo.titulo}</h1>
        <div className="relative h-80 w-full overflow-hidden rounded-lg bg-white sm:aspect-h-1 sm:aspect-w-2 lg:aspect-h-1 lg:aspect-w-1 group-hover:opacity-75 sm:h-64">
          <img src={articulo.imagen} alt={articulo.titulo} className="h-full w-full object-cover object-center" />
        </div>
        <p className="mt-6 text-base flex flex-col justify-center text-justify mx-auto leading-7 text-gray-600">
          {articulo.cuerpo.split('\n').map((paragraph, index) => (
            <React.Fragment key={index}>
              <span dangerouslySetInnerHTML={{ __html: paragraph }} />
              <br />
            </React.Fragment>
          ))}
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <a
            href="/blog"
            className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Volver al Blog
          </a>
          <a href="https://wa.me/56952011773?text=Hola,%20quisiera%20más%20información%20de%20Laboral%20Jurídico" className="text-sm font-semibold text-gray-900">
            Escríbenos <span aria-hidden="true">&rarr;</span>
          </a>
        </div>
      </div>
    </main>
  );
}