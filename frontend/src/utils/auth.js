// Utilidades para manejo de tokens JWT

const TOKEN_KEY = 'wardogs_token';

// Guardar token en localStorage
export const guardarToken = (token) => {
    localStorage.setItem(TOKEN_KEY, token);
};

// Obtener token de localStorage
export const obtenerToken = () => {
    return localStorage.getItem(TOKEN_KEY);
};

// Eliminar token de localStorage
export const eliminarToken = () => {
    localStorage.removeItem(TOKEN_KEY);
};

// Verificar si hay un token guardado
export const tieneToken = () => {
    return !!obtenerToken();
};

// Decodificar token JWT (sin verificar firma)
export const decodificarToken = (token) => {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        );
        return JSON.parse(jsonPayload);
    } catch (error) {
        console.error('Error al decodificar token:', error);
        return null;
    }
};

// Verificar si el token ha expirado
export const tokenExpirado = (token) => {
    const decoded = decodificarToken(token);
    if (!decoded || !decoded.exp) return true;

    const ahora = Date.now() / 1000;
    return decoded.exp < ahora;
};

// Obtener datos del usuario del token
export const obtenerUsuarioDelToken = () => {
    const token = obtenerToken();
    if (!token) return null;

    if (tokenExpirado(token)) {
        eliminarToken();
        return null;
    }

    return decodificarToken(token);
};
