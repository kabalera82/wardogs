import { fetchConToken, API_URL } from './api';

export const newsService = {
    obtenerNoticias: async () => {
        try {
            const response = await fetch(`${API_URL}/news`);
            return await response.json();
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    crearNoticia: async (datos) => {
        return fetchConToken('/news', {
            method: 'POST',
            body: JSON.stringify(datos),
        });
    },

    actualizarNoticia: async (id, datos) => {
        return fetchConToken(`/news/${id}`, {
            method: 'PUT',
            body: JSON.stringify(datos),
        });
    },

    eliminarNoticia: async (id) => {
        return fetchConToken(`/news/${id}`, {
            method: 'DELETE',
        });
    }
};
