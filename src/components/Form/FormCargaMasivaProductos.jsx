import React, { useEffect, useState } from 'react';
import { useWindowScroll } from '@uidotdev/usehooks';
import { useNavigate } from 'react-router-dom';

import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import axios from 'axios';
import * as XLSX from "xlsx";

const FormCargaMasivaProductos = () => {
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const file = e.target.file.files[0];
            if (!file) {
                alert("Por favor, sube un archivo Excel.");
                return;
            }
    
            const reader = new FileReader();
            reader.onload = async (event) => {
                const data = event.target.result;
                const workbook = XLSX.read(data, { type: "binary" });
                const firstSheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[firstSheetName];
                const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    
                const productsToSend = [];
    
                for (let i = 1; i < rows.length; i++) {
                    const row = rows[i];
                    const supplierName = row[10].trim();
                    const supplierResponse = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/supplier?name=${supplierName}`);
                    
                    if (!supplierResponse.data || supplierResponse.data.length === 0) {
                        throw new Error(`Proveedor no encontrado: ${supplierName}`);
                    }
                    
                    const supplierId = supplierResponse.data.data.id;
                    
                    const productData = {
                        name: row[0],
                        sku: row[1] != null ? String(row[1]) : null,
                        description: row[2],
                        type: row[3],
                        categories: row[4].toLowerCase().replace(/\s+/g, ''),
                        initial_quantity: parseInt(row[5], 10),
                        unit_cost: parseFloat(row[6]),
                        price: parseFloat(row[7]),
                        commission_type: row[8],
                        commission: parseFloat(row[9]),
                        supplier_id: supplierId,
                        image: row[11] ? row[11].trim() : null,
                        consignment: row[12].toLowerCase() === 'si',
                        range_pot_diameter_min: row[13] ? parseFloat(row[13]) : null,
                        range_pot_diameter_max: row[14] ? parseFloat(row[14]) : null,
                        pot_diameter: row[15] ? parseFloat(row[15]) : null,
                    };
    
                    productsToSend.push(productData);
                }
                console.log(productsToSend);
                const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/masiveproducts`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(productsToSend),
                });
    
                if (!response.ok) {
                    throw new Error('Error al agregar los productos');
                }
    
                const responseData = await response.json();
                console.log(responseData);
    
                // Mensaje de éxito después de todas las solicitudes
                setSuccessMessage('Productos agregados exitosamente');
                setTimeout(() => setSuccessMessage(''), 10000);
            };
    
            // Iniciar la lectura del archivo
            reader.readAsArrayBuffer(file);
        } catch (error) {
            console.error(error);
            setErrorMessage('Ocurrió un error al agregar los productos');
            setSuccessMessage('');
            setTimeout(() => setErrorMessage(''), 10000);
        }
    };
    


    return (
            <div className="bg-white min-h-screen w-full py-24 sm:py-32">
                <div className="mx-auto w-full px-6 lg:px-8">
                    <div className="mx-auto max-w-lg text-left mb-6">
                        {successMessage && (
                            <div className="bg-green-100 text-green-800 p-4 rounded mb-4">
                                {successMessage}
                            </div>
                        )}

                        {errorMessage && (
                            <div className="bg-red-100 text-red-800 p-4 rounded mb-4">
                                {errorMessage}
                            </div>
                        )}
                        <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl text-center">
                            Carga Masiva de Productos
                        </p>
                    </div>
                    <div className="movement-form-container max-w-7xl px-6 lg:px-8">
                        <form onSubmit={handleSubmit} encType="multipart/form-data">
                            {/* Campo para cargar un archivo Excel */}
                            <label className="block mb-2 text-sm font-medium text-gray-900">
                                Subir archivo Excel
                            </label>
                            <input
                                type="file"
                                name="file"
                                accept=".xlsx, .xls" // Acepta solo archivos Excel
                                className="file-input border border-gray-300 p-2 rounded w-full"
                                required
                            />

                            {/* Botón para enviar el formulario */}
                            <button
                                type="submit"
                                className="submit-button bg-blue-500 text-white p-2 rounded mt-4"
                            >
                                Registrar Productos
                            </button>
                        </form>
                    </div>
                </div>
            </div>
    );
};

export default FormCargaMasivaProductos;