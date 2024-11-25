import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faChartLine,
  faBoxes,
  faWarehouse,
  faBell,
  faFileAlt,
  faReceipt,
  faCartShopping,
  faCashRegister,
  faTableList,
  faTruckField,
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
    name: 'Gestión de inventario',
    description:
      'Controle el stock de sus productos, actualice manualmente y vea el historial de movimientos.',
    icon: faWarehouse,
    link: "/inventario"
  },
  {
    name: 'Ingresar una compra',
    description:
      'Ingrese una compra de productos al sistema',
    icon: faCartShopping,
    link: "/nueva_compra"
  },
  {
    name: 'Ingresar una venta',
    description:
      'Ingrese una venta de productos al sistema',
    icon: faCashRegister,
    link: "/nuevo_movimiento"
  },
  {
    name: 'Ventas',
    description:
      'Revise en detalle todas las ventas',
    icon: faTableList,
    link: "/movimientos"
  },
  {
    name: 'Compras',
    description:
      'Revise en detalle todas las compras a proveedor',
    icon: faTableList,
    link: "/compras"
  },
  {
    name: 'Proveedores',
    description:
      'Revise todos los proveedores en sistema',
    icon: faTruckField,
    link: "/proveedores"
  },
];

export default function Vendedor() {
  const groupedFeatures = [];
  for (let i = 0; i < features.length; i += 2) {
    groupedFeatures.push(features.slice(i, i + 2));
  }
  return (
    <div className="bg-white min-h-screen py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-3xl font-bold text-bu2">Gestor de tienda</p>
          <p className="mt-2 text-lg text-bu1">
            Controla tu negocio desde un solo panel intuitivo y optimizado.
          </p>
        </div>
  
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="space-y-6">
              <div className="flex items-center mb-2">
              <FontAwesomeIcon icon={feature.icon} className="h-8 w-8 text-bu2 mr-4" />

                <Link to={feature.link} className="text-xl text-bu2 hover:underline">
                  {feature.name}
                </Link>
              </div>
              <p className="text-base text-bu1 text-left">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
  
  
}