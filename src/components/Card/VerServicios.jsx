import React from 'react';
import { Link } from 'react-router-dom';
import './css/VerServicios.css';

function VerServicios() {
    const imagen_tienda = 'https://ezcbvdobzemkdzwavevc.supabase.co/storage/v1/object/public/lalocadelasplantas/servicios/tienda.jpg';
    const imagen_asesorias = 'https://ezcbvdobzemkdzwavevc.supabase.co/storage/v1/object/public/lalocadelasplantas/servicios/asesorias.jpg';
    const imagen_talleres = 'https://ezcbvdobzemkdzwavevc.supabase.co/storage/v1/object/public/lalocadelasplantas/servicios/talleres.jpg';
    const imagen_espacios = 'https://ezcbvdobzemkdzwavevc.supabase.co/storage/v1/object/public/lalocadelasplantas/servicios/espacios.jpg';

    const servicios = [
        { img: imagen_tienda, titulo: "TIENDA ONLINE", link: "tienda" },
        { img: imagen_asesorias, titulo: "ASESORIAS", link: "asesorias" },
        { img: imagen_talleres, titulo: "TALLERES", link: "talleres" },
        { img: imagen_espacios, titulo: "ESPACIOS", link: "espacios" },
    ];

    return (
        <div className="containerVerServicios">
            <div className='Servicios-Container'>
                {servicios.map((servicio, index) => (
                    <Link to={`/${servicio.link}`} key={index} className="Servicio-Wrapper">
                        <div className='contenedor-servicio'>
                            <img className="Imagen-Servicio" src={servicio.img} alt={servicio.titulo} /> 
                            <div className="Titulo-Servicio"> 
                                <p>{servicio.titulo}</p> 
                            </div>  
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}

export default VerServicios;