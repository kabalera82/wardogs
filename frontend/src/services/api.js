// Configuración base de API
export const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';
export const API_URL = `${BACKEND_URL}/api`;

// Función helper para hacer peticiones
export const fetchAPI = async (endpoint, options = {}) => {
    const url = `${API_URL}${endpoint}`;

    const config = {
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
        ...options,
    };

    try {
        const response = await fetch(url, config);
        const data = await response.json();

        // Log con safe parsing del body
        let bodyParsed = null;
        if (config.body) {
            try {
                bodyParsed = typeof config.body === 'string' ? JSON.parse(config.body) : config.body;
            } catch (e) {
                bodyParsed = '[Cannot parse body]';
            }
        }

        console.log('[API] Request:', JSON.stringify({ url, method: config.method || 'GET', bodyParsed }, null, 2));
        console.log('[API] Response:', JSON.stringify({ status: response.status, ok: response.ok, data }, null, 2));

        if (!response.ok) {
            console.error('[API] Backend error response:', JSON.stringify(data, null, 2));
            throw new Error(data.error || data.mensaje || 'Error en la petición');
        }

        return data;
    } catch (error) {
        console.error('[API] Error completo:', error);
        throw error;
    }
};

// Función helper para peticiones autenticadas
export const fetchConToken = async (endpoint, options = {}) => {
    const token = localStorage.getItem('wardogs_token');

    return fetchAPI(endpoint, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
            Authorization: token ? `Bearer ${token}` : '',
        },
    });
};

