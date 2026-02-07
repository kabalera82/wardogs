import React from 'react';

export const Header = () => {

    // Función para scroll suave
    const scrollToSection = (id) => {
        const section = document.getElementById(id);
        if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <nav className="flex justify-between items-center px-6 py-4 bg-black fixed top-0 left-0 right-0 z-50 shadow-lg">
            
            <div className="flex items-center">
                <div className="text-2xl font-bold text-white tracking-tighter uppercase cursor-pointer">
                    <span className="text-red-600">War</span>Dogs
                </div>
            </div>

            {/* MENÚ DE NAVEGACIÓN */}
            <ul className="flex items-center gap-1 md:gap-4 lg:gap-8">
                <li>
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
                </li>
                <li>
                    <a
                        href="#noticias"
                        className="text-white font-bold text-sm uppercase px-3 py-2 hover:text-red-500 transition-colors tracking-wide"
                        onClick={(e) => {
                            e.preventDefault();
                            // scrollToSection('noticias'); // Asumiendo que existe
                        }}
                    >
                        News
                    </a>
                </li>
                <li>
                    <a
                        href="#luchadores"
                        className="text-white font-bold text-sm uppercase px-3 py-2 hover:text-red-500 transition-colors tracking-wide"
                        onClick={(e) => {
                            e.preventDefault();
                            scrollToSection('luchadores');
                        }}
                    >
                        Fighters
                    </a>
                </li>
                <li>
                    <a
                        href="#galeria"
                        className="text-white font-bold text-sm uppercase px-3 py-2 hover:text-red-500 transition-colors tracking-wide"
                        onClick={(e) => {
                            e.preventDefault();
                            scrollToSection('Galería'); // Nota: Evita acentos en IDs si es posible
                        }}
                    >
                        Gallery
                    </a>
                </li>
                <li>
                    <a
                        href="#comunidad"
                        className="text-white font-bold text-sm uppercase px-3 py-2 hover:text-red-500 transition-colors tracking-wide"
                        onClick={(e) => {
                            e.preventDefault();
                            scrollToSection('Communidad');
                        }}
                    >
                        Community
                    </a>
                </li>
                <li>
                    <a
                        href="#tienda"
                        className="text-white font-bold text-sm uppercase px-3 py-2 hover:text-red-500 transition-colors tracking-wide"
                        onClick={(e) => {
                            e.preventDefault();
                            scrollToSection('Tienda');
                        }}
                    >
                        Store
                    </a>
                </li>
            </ul>

            {/* BOTÓN DE LOGIN (Añadido para coincidir con la imagen) */}
            <div>
                <button className="bg-red-600 hover:bg-red-700 text-white font-bold text-sm uppercase px-6 py-2 rounded-sm transition-colors shadow-md tracking-wider">
                    Login/Singup
                </button>
            </div>
        </nav>
    );
}