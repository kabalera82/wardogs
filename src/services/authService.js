// Servicio de autenticación

import { fetchAPI } from './api.js';

export const authService = {
    // Login
    login: async (email, contrasena) => {
        return fetchAPI('/usuarios/login', {
            method: 'POST',
            body: JSON.stringify({ email, contrasena }),
        });
    },

    // Registro
    registro: async (datosUsuario) => {
        return fetchAPI('/usuarios/registro', {
            method: 'POST',
            body: JSON.stringify(datosUsuario),
        });
    },
};
