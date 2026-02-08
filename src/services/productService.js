import { fetchAPI, fetchConToken, API_URL } from './api';

export const productService = {
    // Obtener productos públicos
    obtenerProductos: async () => {
        return await fetchAPI('/productos');
    },

    // Obtener todos los productos (Admin)
    obtenerTodosAdmin: async () => {
        return await fetchConToken('/productos/admin/all');
    },

    // Crear producto (Admin)
    crearProducto: async (formData) => {
        try {
            const token = localStorage.getItem('wardogs_token');
            const response = await fetch(`${API_URL}/productos`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData // FormData no necesita Content-Type
            });
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || data.mensaje || 'Error al crear producto');
            }

            return data;
        } catch (error) {
            console.error('[productService] Error creating product:', error);
            throw error;
        }
    },

    // Actualizar producto (Admin)
    actualizarProducto: async (id, formData) => {
        try {
            const token = localStorage.getItem('wardogs_token');
            const response = await fetch(`${API_URL}/productos/${id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData // FormData no necesita Content-Type
            });
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || data.mensaje || 'Error al actualizar producto');
            }

            return data;
        } catch (error) {
            console.error('[productService] Error updating product:', error);
            throw error;
        }
    },

    // Eliminar producto (Admin)
    eliminarProducto: async (id) => {
        return await fetchConToken(`/productos/${id}`, {
            method: 'DELETE'
        });
    }
};
