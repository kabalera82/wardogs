import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const Header = () => {
    const { usuario, estaAutenticado, logout } = useAuth();
    const navigate = useNavigate();

    // Función para scroll suave
    const scrollToSection = (id) => {
        const section = document.getElementById(id);
        if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const handleScroll = (e, id) => {
        e.preventDefault();
        scrollToSection(id);
    };

    const manejarLogout = () => {
        logout();
        navigate('/');
    };

    const isAdmin = () => {
        return usuario?.rol === 'admin';
    };

    return (
        <nav className="flex justify-between items-center px-6 py-4 bg-black fixed top-0 left-0 right-0 z-50 shadow-lg">

            <Link to="/" className="flex items-center">
                <div className="text-2xl font-bold text-white tracking-tighter uppercase cursor-pointer">
                    <span className="text-red-600">War</span>Dogs
                </div>
            </Link>

            {/* MENÚ DE NAVEGACIÓN */}
            <ul className="flex items-center gap-1 md:gap-4 lg:gap-8">
                <nav className="hidden md:flex items-center gap-8">
                    <a
                        href="#inicio"
                        className="text-white font-bold text-sm uppercase px-4 py-2 bg-red-900 rounded-sm hover:bg-red-800 transition-colors tracking-wide"
                        onClick={(e) => {
                            e.preventDefault();
                            scrollToSection('inicio');
                        }}
                    >
                        Inicio
                    </a>
                    <Link
                        to="/news"
                        className="text-white font-bold text-sm uppercase px-3 py-2 hover:text-red-500 transition-colors tracking-wide"
                    >
                        Noticias
                    </Link>
                    <Link
                        to="/fighters"
                        className="text-white font-bold text-sm uppercase px-3 py-2 hover:text-red-500 transition-colors tracking-wide"
                    >
                        Equipo
                    </Link>
                    <a
                        href="#galeria"
                        onClick={(e) => handleScroll(e, 'galeria')}
                        className="text-white font-bold text-sm uppercase px-3 py-2 hover:text-red-500 transition-colors tracking-wide"
                    >
                        Galería
                    </a>
                    <a
                        href="#community"
                        onClick={(e) => handleScroll(e, 'community')}
                        className="text-white font-bold text-sm uppercase px-3 py-2 hover:text-red-500 transition-colors tracking-wide"
                    >
                        Comunidad
                    </a>
                    <Link
                        to="/shop"
                        className="text-white font-bold text-sm uppercase px-3 py-2 hover:text-red-500 transition-colors tracking-wide"
                    >
                        Tienda
                    </Link>

                    {estaAutenticado() && usuario ? (
                        <div className="relative group">
                            <button className="flex items-center gap-2 text-white font-bold text-sm uppercase hover:text-red-500 transition-colors">
                                <span className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
                                    {usuario.nombre?.charAt(0) || usuario.email?.charAt(0) || 'U'}
                                </span>
                                <span className="hidden lg:inline">{usuario.nombre || usuario.email}</span>
                            </button>

                            {/* Dropdown Menu */}
                            <div className="absolute right-0 mt-2 w-48 bg-[#1a1a1a] rounded-lg shadow-xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right z-50 border border-zinc-800">
                                {isAdmin() && (
                                    <Link
                                        to="/admin"
                                        className="block px-4 py-2 text-sm text-gray-300 hover:bg-zinc-800 hover:text-white transition-colors"
                                    >
                                        Panel Admin
                                    </Link>
                                )}
                                <Link
                                    to="/profile"
                                    className="block px-4 py-2 text-sm text-gray-300 hover:bg-zinc-800 hover:text-white transition-colors"
                                >
                                    Mi Perfil
                                </Link>
                                <button
                                    onClick={manejarLogout}
                                    className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-zinc-800 transition-colors"
                                >
                                    Cerrar Sesión
                                </button>
                            </div>
                        </div>
                    ) : (
                        <Link
                            to="/login"
                            className="bg-red-600 hover:bg-red-700 text-white font-bold text-sm uppercase px-6 py-2 rounded transition-colors tracking-wide"
                        >
                            Acceso
                        </Link>
                    )}
                </nav>
            </ul>
        </nav>
    );
}