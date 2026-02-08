import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
    const { estaAutenticado, cargando } = useAuth();

    if (cargando) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-red-600 mx-auto mb-4"></div>
                    <p className="text-gray-400">Cargando...</p>
                </div>
            </div>
        );
    }

    if (!estaAutenticado()) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRoute;
