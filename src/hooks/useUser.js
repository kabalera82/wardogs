import { useState, useEffect } from 'react';
import { userService } from '../services/userService.js';
import { uploadService } from '../services/uploadService.js';
import { useAuth } from '../context/AuthContext.jsx';

export const useUser = () => {
    const { user, login } = useAuth(); // login se usa para actualizar el estado global
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [profile, setProfile] = useState(null);

    // Cargar perfil al montar
    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        setLoading(true);
        try {
            const data = await userService.obtenerPerfil();
            if (data.success) {
                setProfile(data.data);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const updateProfile = async (formData) => {
        setLoading(true);
        setError(null);
        try {
            // 1. Si hay imagen, subirla primero
            let avatarUrl = profile.avatar;
            if (formData.avatarFile) {
                const uploadRes = await uploadService.subirAvatar(formData.avatarFile);
                if (uploadRes.success) {
                    avatarUrl = uploadRes.data.avatar;
                }
            }

            // 2. Actualizar datos del perfil
            const dataToUpdate = {
                ...formData,
                avatar: avatarUrl
            };

            // Eliminar archivo del objeto antes de enviar al update
            delete dataToUpdate.avatarFile;

            const response = await userService.actualizarPerfil(dataToUpdate);

            if (response.success) {
                setProfile(response.data);
                // Actualizar usuario en el contexto si es necesario (opcional)
                // login(response.data, localStorage.getItem('wardogs_token'));
                return { success: true, message: 'Perfil actualizado correctamente' };
            }
        } catch (err) {
            setError(err.message);
            return { success: false, message: err.message };
        } finally {
            setLoading(false);
        }
    };

    const isAdmin = () => {
        return profile?.rol === 'admin';
    };

    return {
        profile,
        loading,
        error,
        updateProfile,
        isAdmin,
        reloadProfile: loadProfile
    };
};
