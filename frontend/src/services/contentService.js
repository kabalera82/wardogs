import { fetchConToken, API_URL } from './api';

export const contentService = {
    // --- Featured Fights ---
    obtenerPeleas: async () => {
        try {
            const response = await fetch(`${API_URL}/content/fights`);
            return await response.json();
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    crearPelea: async (formData) => {
        return fetchConToken('/content/fights', {
            method: 'POST',
            body: formData, // FormData para imagen
        });
    },

    eliminarPelea: async (id) => {
        return fetchConToken(`/content/fights/${id}`, {
            method: 'DELETE',
        });
    },

    // --- Class Schedules ---
    obtenerHorarios: async () => {
        try {
            const response = await fetch(`${API_URL}/content/schedule`);
            return await response.json();
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    crearHorario: async (datos) => {
        return fetchConToken('/content/schedule', {
            method: 'POST',
            body: JSON.stringify(datos),
        });
    },

    eliminarHorario: async (id) => {
        return fetchConToken(`/content/schedule/${id}`, {
            method: 'DELETE',
        });
    }
};
