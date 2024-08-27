import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faChartLine,
  faBoxes,
  faWarehouse,
  faBell,
  faFileAlt,
  faReceipt,
} from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

import './css/Anfitrion.css';

const features = [
  {
    name: 'Dashboard',
    description:
      'Vista general de estadísticas clave, incluyendo ventas, productos agotados y alertas de inventario bajo.',
    icon: faChartLine,
    link: "/dashboard"
  },
  {
    name: 'Gestión de productos',
    description:
      'Añada, edite y elimine productos del inventario con facilidad.',
    icon: faBoxes,
    link: "/productos",
  },
  {
    name: 'Control de inventario',
    description:
      'Controle el stock de sus productos, actualice manualmente y vea el historial de movimientos.',
    icon: faWarehouse,
    link: "/inventario"
  },
  {
    name: 'Alertas de inventario bajo',
    description:
      'Configure umbrales de stock mínimo y reciba alertas cuando el stock sea bajo.',
    icon: faBell,
    link: "/alertas"
  },
  {
    name: 'Informes de inventario',
    description:
      'Genere y exporte la data sobre el estado del inventario en formato CSV.',
    icon: faFileAlt,
    link: "/informes"
  },
  {
    name: 'Gestión de ventas y devoluciones',
    description:
      'Gestione las salidas e ingresos manuales del inventario.',
    icon: faReceipt,
    link: "/ventas"
  },
];

export default function Anfitrion() {
  return (
    <div className="bg-white min-h-screen w-screen py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 bg sm:text-4xl">
            Inventory Manager
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
           Controla tu negocio desde un solo panel intuitivo y optimizado.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none text-justify lg:gap-y-16">
            {features.map((feature) => (
              <div key={feature.name} className="relative pl-16">
                <dt className="text-base font-semibold leading-7 text-gray-900">
                  <div className="icono absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg">
                    <FontAwesomeIcon icon={feature.icon} aria-hidden="true" className="h-6 w-6 text-white" />
                  </div>
                  <Link to={feature.link} className="textLink text-xl hover:underline">{feature.name}</Link>
                </dt>
                <dd className="mt-2 text-base leading-7 text-gray-600">{feature.description}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  )
}