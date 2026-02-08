import { createContext, useContext, useState, useEffect } from 'react';
import { guardarToken, obtenerToken, eliminarToken, obtenerUsuarioDelToken } from '../utils/auth';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth debe usarse dentro de AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [usuario, setUsuario] = useState(null);
    const [cargando, setCargando] = useState(true);

    // Verificar si hay sesión al cargar
    useEffect(() => {
        const verificarSesion = () => {
            const token = obtenerToken();
            if (token) {
                const datosUsuario = obtenerUsuarioDelToken();
                if (datosUsuario) {
                    setUsuario(datosUsuario);
                } else {
                    eliminarToken();
                }
            }
            setCargando(false);
        };

        verificarSesion();
    }, []);

    // Login
    const login = async (email, contrasena) => {
        try {
            const respuesta = await authService.login(email, contrasena);

            if (respuesta.success && respuesta.data.token) {
                guardarToken(respuesta.data.token);
                setUsuario(respuesta.data.usuario);
                return { success: true, usuario: respuesta.data.usuario };
            }

            return { success: false, error: 'Error al iniciar sesión' };
        } catch (error) {
            return { success: false, error: error.message };
        }
    };

    // Logout
    const logout = () => {
        eliminarToken();
        setUsuario(null);
    };

    // Verificar si está autenticado
    const estaAutenticado = () => {
        return !!usuario;
    };

    const valor = {
        usuario,
        cargando,
        login,
        logout,
        estaAutenticado,
    };

    return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>;
};
