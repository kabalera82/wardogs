import React, { useState, useEffect } from 'react';
import { Header } from '../components/Header';
import Footer from '../components/Footer';
import { FaUserTie, FaFistRaised } from 'react-icons/fa';
import { API_URL } from '../services/api';

const Fighters = () => {
    const [data, setData] = useState({ entrenadores: [], luchadores: [] });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTeam = async () => {
            try {
                const res = await fetch(`${API_URL}/usuarios/public/team`);
                const teamData = await res.json();
                if (teamData.success) {
                    setData(teamData.data);
                }
            } catch (error) {
                console.error("Error fetching team:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTeam();
        window.scrollTo(0, 0);
    }, []);

    if (loading) {
        return (
            <div className="bg-[#0a0a0a] min-h-screen flex items-center justify-center">
                <div className="text-white text-xl">Cargando...</div>
            </div>
        );
    }

    return (
        <div className="bg-[#0a0a0a] min-h-screen flex flex-col font-sans">
            <Header />

            <main className="flex-grow pt-32 pb-20 px-4">
                <div className="max-w-7xl mx-auto">

                    {/* Page Header */}
                    <div className="mb-20">
                        <h1 className="text-5xl md:text-7xl font-bold text-white uppercase tracking-tighter mb-6 relative inline-block">
                            Equipo <span className="text-red-600">Wardogs</span>
                            <div className="absolute -bottom-2 left-0 w-1/2 h-2 bg-red-600 skew-x-12"></div>
                        </h1>
                        <p className="text-zinc-400 text-lg md:text-xl max-w-2xl font-light">
                            Conoce a los entrenadores de élite y luchadores dedicados que forman la columna vertebral de nuestra herencia de combate.
                        </p>
                    </div>

                    {/* Coaches Section */}
                    <section className="mb-24">
                        <div className="flex items-center gap-4 mb-12">
                            <div className="p-3 bg-red-600 rounded-lg skew-x-[-10deg]">
                                <FaUserTie className="text-2xl text-white skew-x-[10deg]" />
                            </div>
                            <h2 className="text-4xl font-bold text-white uppercase tracking-wider">Entrenadores</h2>
                            <div className="h-[1px] bg-zinc-800 flex-grow ml-8"></div>
                        </div>

                        {data.entrenadores.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {data.entrenadores.map(coach => (
                                    <div key={coach._id} className="bg-[#111] border border-zinc-800 rounded-xl overflow-hidden hover:border-red-900/50 transition-all duration-300 group">
                                        <div className="aspect-[4/5] bg-zinc-900 relative overflow-hidden">
                                            {coach.avatar ? (
                                                <img src={coach.avatar} alt={coach.nombre} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                                            ) : (
                                                <div className="w-full h-full flex flex-col items-center justify-center text-zinc-700">
                                                    <FaUserTie className="text-6xl mb-4" />
                                                </div>
                                            )}
                                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/80 to-transparent p-6 pt-24">
                                                <h3 className="text-2xl font-bold text-white uppercase italic">{coach.nombre} {coach.apellidos}</h3>
                                                {coach.seudonimo && <p className="text-red-500 font-bold tracking-widest text-sm">"{coach.seudonimo}"</p>}
                                            </div>
                                        </div>
                                        <div className="p-6">
                                            <div className="mb-4">
                                                <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1">Especialidad</h4>
                                                <p className="text-white font-medium">{coach.especializacion || 'General'}</p>
                                            </div>
                                            <p className="text-zinc-400 text-sm leading-relaxed line-clamp-3">
                                                {coach.biografia || 'Entrenador oficial de Wardogs Gym.'}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-zinc-500 italic">No hay entrenadores listados.</p>
                        )}
                    </section>

                    {/* Fighters Section */}
                    <section>
                        <div className="flex items-center gap-4 mb-12">
                            <div className="p-3 bg-zinc-800 rounded-lg skew-x-[-10deg]">
                                <FaFistRaised className="text-2xl text-white skew-x-[10deg]" />
                            </div>
                            <h2 className="text-4xl font-bold text-white uppercase tracking-wider">Luchadores</h2>
                            <div className="h-[1px] bg-zinc-800 flex-grow ml-8"></div>
                        </div>

                        {data.luchadores.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {data.luchadores.map(fighter => (
                                    <div key={fighter._id} className="bg-[#0a0a0a] border border-zinc-800 rounded-xl overflow-hidden hover:translate-y-[-5px] transition-transform duration-300">
                                        <div className="aspect-square bg-zinc-900 relative">
                                            {fighter.avatar ? (
                                                <img src={fighter.avatar} alt={fighter.nombre} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-zinc-800">
                                                    <FaFistRaised className="text-5xl" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="p-5">
                                            <h3 className="text-xl font-bold text-white uppercase mb-1">{fighter.nombre} {fighter.apellidos}</h3>
                                            {fighter.seudonimo && <p className="text-red-600 font-bold text-sm mb-4">"{fighter.seudonimo}"</p>}

                                            <div className="grid grid-cols-2 gap-4 text-sm">
                                                <div>
                                                    <span className="block text-zinc-600 text-xs font-bold uppercase">Récord</span>
                                                    <span className="text-white font-mono">{fighter.record || '0-0-0'}</span>
                                                </div>
                                                <div>
                                                    <span className="block text-zinc-600 text-xs font-bold uppercase">Peso</span>
                                                    <span className="text-white">{fighter.peso ? `${fighter.peso}kg` : 'N/A'}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-zinc-500 italic">No hay luchadores federados listados.</p>
                        )}
                    </section>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Fighters;
