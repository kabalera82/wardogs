import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [formulario, setFormulario] = useState({
        email: '',
        contrasena: ''
    });
    const [error, setError] = useState('');
    const [cargando, setCargando] = useState(false);

    const manejarCambio = (e) => {
        setFormulario({
            ...formulario,
            [e.target.name]: e.target.value
        });
        setError(''); // Limpiar error al escribir
    };

    const manejarSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setCargando(true);

        // Validación básica
        if (!formulario.email || !formulario.contrasena) {
            setError('Por favor completa todos los campos');
            setCargando(false);
            return;
        }

        try {
            const resultado = await login(formulario.email, formulario.contrasena);

            if (resultado.success) {
                navigate('/dashboard');
            } else {
                setError(resultado.error || 'Credenciales inválidas');
            }
        } catch (err) {
            setError('Error al conectar con el servidor');
        } finally {
            setCargando(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black px-4">
            <div className="max-w-md w-full">
                {/* Logo/Título */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-white mb-2">
                        WAR<span className="text-red-600">DOGS</span>
                    </h1>
                    <p className="text-gray-400">Inicia sesión en tu cuenta</p>
                </div>

                {/* Formulario */}
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-gray-700">
                    <form onSubmit={manejarSubmit} className="space-y-6">
                        {/* Email */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                                Correo Electrónico
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                value={formulario.email}
                                onChange={manejarCambio}
                                className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all"
                                placeholder="tu@email.com"
                            />
                        </div>

                        {/* Contraseña */}
                        <div>
                            <label htmlFor="contrasena" className="block text-sm font-medium text-gray-300 mb-2">
                                Contraseña
                            </label>
                            <input
                                id="contrasena"
                                name="contrasena"
                                type="password"
                                autoComplete="current-password"
                                required
                                value={formulario.contrasena}
                                onChange={manejarCambio}
                                className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all"
                                placeholder="••••••••"
                            />
                        </div>

                        {/* Error */}
                        {error && (
                            <div className="bg-red-900/20 border border-red-600/50 rounded-lg p-3">
                                <p className="text-red-400 text-sm text-center">{error}</p>
                            </div>
                        )}

                        {/* Botón Submit */}
                        <button
                            type="submit"
                            disabled={cargando}
                            className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg shadow-red-900/50"
                        >
                            {cargando ? (
                                <span className="flex items-center justify-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Iniciando...
                                </span>
                            ) : (
                                'Iniciar Sesión'
                            )}
                        </button>
                    </form>

                    {/* Credenciales de prueba */}
                    <div className="mt-6 pt-6 border-t border-gray-700">
                        <p className="text-xs text-gray-500 text-center mb-2">Credenciales de prueba:</p>
                        <div className="bg-gray-900/50 rounded-lg p-3 text-xs text-gray-400 space-y-1">
                            <p><span className="text-gray-500">Email:</span> admin@wardogs.com</p>
                            <p><span className="text-gray-500">Contraseña:</span> admin123</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
