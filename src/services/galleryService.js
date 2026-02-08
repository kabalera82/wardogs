import { fetchAPI, fetchConToken, API_URL } from './api';

export const galleryService = {
    // Obtener galería pública (activas)
    obtenerGaleria: async () => {
        return await fetchAPI('/galeria');
    },

    // Obtener todas las imágenes (Admin)
    obtenerTodasAdmin: async () => {
        return await fetchConToken('/galeria/admin/all');
    },

    // Crear imagen de galería (Admin)
    crearImagen: async (formData) => {
        try {
            const token = localStorage.getItem('wardogs_token');
            const response = await fetch(`${API_URL}/galeria`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData // FormData no necesita Content-Type
            });
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || data.mensaje || 'Error al crear imagen');
            }

            return data;
        } catch (error) {
            console.error('[galleryService] Error creating image:', error);
            throw error;
        }
    },

    // Actualizar imagen de galería (Admin)
    actualizarImagen: async (id, formData) => {
        try {
            const token = localStorage.getItem('wardogs_token');
            const response = await fetch(`${API_URL}/galeria/${id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData // FormData no necesita Content-Type
            });
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || data.mensaje || 'Error al actualizar imagen');
            }

            return data;
        } catch (error) {
            console.error('[galleryService] Error updating image:', error);
            throw error;
        }
    },

    // Eliminar imagen de galería (Admin)
    eliminarImagen: async (id) => {
        return await fetchConToken(`/galeria/${id}`, {
            method: 'DELETE'
        });
    }
};
