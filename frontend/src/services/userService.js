// Servicio de gestión de usuarios

import { fetchConToken } from './api.js';

export const userService = {
    // Obtener perfil
    obtenerPerfil: async () => {
        return fetchConToken('/usuarios/perfil');
    },

    // Actualizar perfil
    actualizarPerfil: async (datos) => {
        return fetchConToken('/usuarios/perfil', {
            method: 'PUT',
            body: JSON.stringify(datos),
        });
    },

    // Cambiar contraseña
    cambiarContrasena: async (contrasenaActual, contrasenaNueva) => {
        return fetchConToken('/usuarios/cambiar-contrasena', {
            method: 'PUT',
            body: JSON.stringify({ contrasenaActual, contrasenaNueva }),
        });
    },

    // --- Funciones de Admin ---

    // Obtener todos los usuarios
    obtenerUsuarios: async (filtros = {}) => {
        const queryParams = new URLSearchParams(filtros).toString();
        return fetchConToken(`/usuarios?${queryParams}`);
    },

    // Crear usuario (Admin)
    crearUsuario: async (datos) => {
        return fetchConToken('/usuarios', {
            method: 'PUT',
            body: JSON.stringify(datos),
        });
    },

    // Cambiar rol (Admin)
    cambiarRol: async (id, rol) => {
        return fetchConToken(`/usuarios/${id}/rol`, {
            method: 'PUT',
            body: JSON.stringify({ rol }),
        });
    },

    // Actualizar usuario completo (Admin)
    actualizarUsuarioAdmin: async (id, datos) => {
        return fetchConToken(`/usuarios/${id}`, {
            method: 'PUT',
            body: JSON.stringify(datos),
        });
    },

    // Desactivar usuario (Admin)
    desactivarUsuario: async (id) => {
        return fetchConToken(`/usuarios/${id}`, {
            method: 'DELETE',
        });
    }
};
