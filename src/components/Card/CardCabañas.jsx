import React from 'react';
import ImageSlider from './ImageSlider';
import cabanaFamiliar from '../../images/Cabañas/CabañaFamiliar.png';
import cabanaDoble from '../../images/Cabañas/CabañaDoble.png';
import cabanaDobleDeluxe from '../../images/Cabañas/CabañaDobleDeluxe.png';
import interiorCabañaFamiliar2 from '../../images/CabanaInterior/InteriorCabanaPreliminar1.png';
import interiorCabañaFamiliar3 from '../../images/CabanaInterior/InteriorCabanaPreliminar2.png';
import interiorCabañaFamiliar1 from '../../images/CabanaInterior/InteriorCabanaPreliminar3.png';
import interiorCabañaFamiliar4 from '../../images/CabanaInterior/InteriorCabanaPreliminar4.png';
import interiorCabañaDoble2 from '../../images/CabanaInterior/InteriorCabanaPreliminar1.png';
import interiorCabañaDoble3 from '../../images/CabanaInterior/InteriorCabanaPreliminar2.png';
import interiorCabañaDoble1 from '../../images/CabanaInterior/InteriorCabanaPreliminar3.png';
import interiorCabañaDoble4 from '../../images/CabanaInterior/InteriorCabanaPreliminar4.png';
import interiorCabañaDobleDeluxe2 from '../../images/CabanaInterior/InteriorCabanaPreliminar1.png';
import interiorCabañaDobleDeluxe3 from '../../images/CabanaInterior/InteriorCabanaPreliminar2.png';
import interiorCabañaDobleDeluxe1 from '../../images/CabanaInterior/InteriorCabanaPreliminar3.png';
import interiorCabañaDobleDeluxe4 from '../../images/CabanaInterior/InteriorCabanaPreliminar4.png';
import Calendar from '../Calendar/Calendar';

import './css/CardCabañas.css';

const CardCabañas = ({ Tipo }) => {
    let imagenTipo;
    let imagenInterior1;
    let imagenInterior2;
    let imagenInterior3;
    let imagenInterior4;
    let Descripcion;
    let TipoCabaña;
    let Contenido = [];
    switch (Tipo) {
        case 'CabañaFamiliar':
            TipoCabaña = 'Cabaña Familiar';
            imagenInterior1 = interiorCabañaFamiliar1;
            imagenInterior2 = interiorCabañaFamiliar2;
            imagenInterior3 = interiorCabañaFamiliar3;
            imagenInterior4 = interiorCabañaFamiliar4;
            imagenTipo = cabanaFamiliar;
            Descripcion = 'Cabañas para 4 personas con dormitorio matrimonial con cama King y otro dormitorio con una cama de plaza y media y un sofá cama de una plaza y media en el living.';
            Contenido = ['Cama king', 'Pequeña Cocina', 'Frigobar', 'Desayuno', 'Aire Acondicionado', 'Calefacción', 'Toallas', 'Baños Privados', 'Televisión Satelital', 'Terraza Privada', 'Zona de Wifi(Starlink)', 'Segundo dormitorio con una cama de plaza y media', 'Sofá cama en el living'];
            break
        case 'CabañaDoble':
            TipoCabaña = 'Cabaña Doble';
            imagenInterior1 = interiorCabañaDoble1;
            imagenInterior2 = interiorCabañaDoble2;
            imagenInterior3 = interiorCabañaDoble3;
            imagenInterior4 = interiorCabañaDoble4;
            imagenTipo = cabanaDoble;
            Descripcion = 'Cabaña para 2 personas con dormitorio matrimonial cama King.';
            Contenido = ['Cama king', 'Frigobar', 'Desayuno', 'Aire Acondicionado', 'Calefacción', 'Toallas', 'Baños Privados', 'Televisión Satelital', 'Terraza Privada', 'Zona de Wifi(Starlink)'];
            break
        default:
            TipoCabaña = 'Cabaña Doble Deluxe';
            imagenInterior1 = interiorCabañaDobleDeluxe1;
            imagenInterior2 = interiorCabañaDobleDeluxe2;
            imagenInterior3 = interiorCabañaDobleDeluxe3;
            imagenInterior4 = interiorCabañaDobleDeluxe4;
            imagenTipo = cabanaDobleDeluxe;
            Descripcion = 'Cabaña para 2 personas con dormitorio matrimonial cama King.';
            Contenido = ['Cama king', 'Frigobar', 'Desayuno', 'Aire Acondicionado', 'Calefacción', 'Toallas', 'Baños Privados', 'Televisión Satelital', 'Terraza Privada', 'Zona de Wifi(Starlink)', 'Sala de estar', 'Dos ambientes'];
    }
    const elementosColumna1 = Contenido
    const elementosColumna2 = Contenido.slice(7);
    return (
        <div className="CardCabañas">

            <div className='CardCabanasDescripcion'>
                <ImageSlider tipo={Tipo} />
                <Calendar />
            </div>
            <div className='InformacionCabañas' data-aos="fade-left">
                <div className='BotonVolverCabañas'>
                    <a href="/Cabañas">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="arrow-left">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                        </svg>
                        <p className='Volver' >Volver</p>
                    </a>
                </div>
                <div className='TituloCabañas'>
                    <p className='Titulo'>{TipoCabaña}</p>
                    <p className='Descripcion'>{Descripcion}</p>
                </div>
                <div className='ContenedorImagenes' data-aos="fade-up">
                    <div className='FilasImagenes'>
                        <div className='Box'>

                            <img src={imagenInterior1} alt="" />
                        </div>
                        <div className='Box'>

                            <img src={imagenInterior2} alt="" />

                        </div>
                    </div>
                    <div className='FilasImagenes'>
                        <div className='Box'>

                            <img src={imagenInterior3} alt="" />

                        </div>
                        <div className='Box'>
                            <img src={imagenInterior4} alt="" />
                        </div>
                    </div>
                    <div className='ContenidoCabañas' data-aos="fade-up">
                        <p className='Titulo py-4'>CONTENIDO DE LA HABITACIÓN</p>
                        <div className='Columnas'>
                            <div className='Columna'>
                                {elementosColumna1.map((elemento, index) => (
                                    <li key={index}>{elemento}</li>
                                ))}
                            </div>
                            
                        </div>



                    </div>
                </div>
            </div>
        </div>

    );
};

export default CardCabañas;
