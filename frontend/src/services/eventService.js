// Servicio de gestión de eventos

import { fetchAPI, fetchConToken, API_URL } from './api.js';

export const eventService = {
    // Obtener todos los eventos (público)
    obtenerEventos: async () => {
        return fetchAPI('/eventos');
    },

    // Crear evento (admin)
    // El argumento 'eventoData' debe ser un FormData si incluye imagen
    crearEvento: async (eventoData) => {
        const token = localStorage.getItem('wardogs_token');

        try {
            const response = await fetch(`${API_URL}/eventos`, {
                method: 'POST',
                headers: {
                    Authorization: token ? `Bearer ${token}` : '',
                    // No Content-Type, el navegador lo pone boundary automatically con FormData
                },
                body: eventoData,
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || data.mensaje || 'Error al crear evento');
            }

            return data;
        } catch (error) {
            console.error('Error creando evento:', error);
            throw error;
        }
    },

    // Eliminar evento (admin)
    eliminarEvento: async (id) => {
        return fetchConToken(`/eventos/${id}`, {
            method: 'DELETE',
        });
    },
};
