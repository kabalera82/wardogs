// Servicio de subida de archivos

import { API_URL } from './api';

export const uploadService = {
    // Subir avatar
    subirAvatar: async (file) => {
        const token = localStorage.getItem('wardogs_token');

        const formData = new FormData();
        formData.append('avatar', file);

        try {
            const response = await fetch(`${API_URL}/usuarios/avatar`, {
                method: 'POST',
                headers: {
                    Authorization: token ? `Bearer ${token}` : '',
                },
                body: formData, // No establecer Content-Type, el navegador lo hace automáticamente
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || data.mensaje || 'Error al subir archivo');
            }

            return data;
        } catch (error) {
            console.error('Error en uploadService:', error);
            throw error;
        }
    },
};
