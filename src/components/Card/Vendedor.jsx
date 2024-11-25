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

import './css/Vendedor.css';

const features = [

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
    name: 'Gestión manual',
    description:
      'Gestione las salidas e ingresos manuales del inventario.',
    icon: faReceipt,
    link: "/ventas"
  },
  {
    name: 'Ingresar una compra',
    description:
      'Ingrese una compra de productos al sistema',
    icon: faReceipt,
    link: "/nueva_compra"
  },
  {
    name: 'Ingresar una venta',
    description:
      'Ingrese una venta de productos al sistema',
    icon: faReceipt,
    link: "/nuevo_movimiento"
  },
  {
    name: 'Movimientos',
    description:
      'Revise en detalle todos los movimientos',
    icon: faReceipt,
    link: "/movimientos"
  },
  {
    name: 'Compras',
    description:
      'Revise en detalle todas las compras a proveedor',
    icon: faReceipt,
    link: "/compras"
  },
];

export default function Vendedor() {
  return (
    <div className="bg-white min-h-screen w-screen py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <p className="mt-2 text-3xl font-bold tracking-tight text-bu2 bg sm:text-4xl">
            Gestor de tienda
          </p>
          <p className="mt-6 text-lg leading-8 text-bu1">
           Controla tu negocio desde un solo panel intuitivo y optimizado.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none text-justify lg:gap-y-16">
            {features.map((feature) => (
              <div key={feature.name} className="relative pl-16">
                <dt className="text-base font-semibold leading-7 text-bu1">
                  <div className="bg-bu2 absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg">
                    <FontAwesomeIcon icon={feature.icon} aria-hidden="true" className="h-6 w-6 text-white" />
                  </div>
                  <Link to={feature.link} className="text-bu2 text-xl hover:underline">{feature.name}</Link>
                </dt>
                <dd className="mt-2 text-base leading-7 text-bu1">{feature.description}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  )
}