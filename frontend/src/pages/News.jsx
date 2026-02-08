import React, { useState, useEffect } from 'react';
import { Header } from '../components/Header';
import Footer from '../components/Footer';
import ClassSchedule from '../components/ClassSchedule';
import { newsService } from '../services/newsService';
import { eventService } from '../services/eventService';
import { FaNewspaper, FaCalendarAlt, FaFistRaised, FaClock, FaMapMarkerAlt, FaCalendarDay, FaExpandArrowsAlt, FaTimes } from 'react-icons/fa';

const News = () => {
    const [news, setNews] = useState([]);
    const [fights, setFights] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isScheduleExpanded, setIsScheduleExpanded] = useState(false);
    const [isFightsExpanded, setIsFightsExpanded] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [newsRes, eventsRes] = await Promise.all([
                    newsService.obtenerNoticias(),
                    eventService.obtenerEventos()
                ]);

                if (newsRes.success) setNews(newsRes.data);
                if (eventsRes.success) setFights(eventsRes.data);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
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
                    <div className="mb-16">
                        <h1 className="text-5xl md:text-7xl font-bold text-white uppercase tracking-tighter mb-6 relative inline-block">
                            Wardogs <span className="text-red-600">Noticias</span>
                            <div className="absolute -bottom-2 left-0 w-1/2 h-2 bg-red-600 skew-x-12"></div>
                        </h1>
                        <p className="text-zinc-400 text-lg md:text-xl max-w-2xl font-light">
                            Mantente informado sobre los últimos anuncios, resultados de combates y novedades del gimnasio.
                        </p>
                    </div>

                    {/* News Grid - Full Width */}
                    <section className="mb-20">
                        {news.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {news.map((item) => (
                                    <div key={item._id} className="bg-[#111] rounded-xl overflow-hidden border border-zinc-800 hover:border-red-900/50 transition-all duration-300 flex flex-col">
                                        <div className="p-6 flex-grow">
                                            <div className="flex items-center justify-between mb-4">
                                                <span className="text-xs font-bold text-red-500 uppercase tracking-widest flex items-center gap-2 bg-red-900/10 px-3 py-1 rounded border border-red-900/20">
                                                    <FaCalendarAlt />
                                                    {new Date(item.fecha).toLocaleDateString('es-ES', {
                                                        day: 'numeric',
                                                        month: 'short',
                                                        year: 'numeric'
                                                    })}
                                                </span>
                                            </div>
                                            <h3 className="text-2xl font-bold text-white mb-3 line-clamp-2">{item.titulo}</h3>
                                            <p className="text-zinc-400 leading-relaxed whitespace-pre-wrap">{item.descripcion}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-24 bg-[#111] rounded-xl border border-zinc-800 border-dashed">
                                <FaNewspaper className="text-6xl text-zinc-700 mx-auto mb-6" />
                                <h3 className="text-2xl font-bold text-white mb-2">Aún no hay noticias</h3>
                                <p className="text-zinc-500">Vuelve más tarde para ver actualizaciones.</p>
                            </div>
                        )}
                    </section>

                    {/* Events and Schedule Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-20">

                        {/* Featured Fights */}
                        <div className="bg-[#111] border border-zinc-800 rounded-xl overflow-hidden shadow-2xl flex flex-col relative group">
                            <div className="bg-gradient-to-r from-red-900 to-black p-5 border-b border-zinc-700/50 flex items-center gap-4">
                                <div className="p-3 bg-red-600 rounded-lg shadow-lg">
                                    <FaFistRaised className="text-xl text-white" />
                                </div>
                                <h2 className="text-2xl font-bold text-white uppercase tracking-wider">Eventos</h2>
                            </div>

                            <div
                                className="p-5 bg-[#111] relative cursor-pointer flex-grow"
                                onClick={() => setIsFightsExpanded(true)}
                            >
                                {fights.length > 0 ? (
                                    <div className="space-y-3 h-64 overflow-hidden relative opacity-50 group-hover:opacity-100 transition-opacity duration-300">
                                        {fights.slice(0, 3).map(fight => (
                                            <div key={fight._id} className="bg-[#0a0a0a] border border-zinc-800 rounded-lg p-4 hover:border-red-900/50 transition-all">
                                                <div className="flex justify-between items-start mb-2">
                                                    <span className="text-xs font-bold text-red-500 uppercase flex items-center gap-1">
                                                        <FaCalendarDay /> {new Date(fight.fecha).toLocaleDateString('es-ES', { month: 'short', day: 'numeric' })}
                                                    </span>
                                                </div>
                                                <h3 className="text-lg font-bold text-white truncate">{fight.titulo || `${fight.luchador1} vs ${fight.luchador2}`}</h3>
                                                <p className="text-sm text-gray-400 truncate mt-1">{fight.descripcion}</p>
                                            </div>
                                        ))}
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 hover:bg-black/20 transition-colors z-10">
                                            <div className="bg-black/80 text-white px-4 py-2 rounded-full flex items-center gap-2 border border-zinc-700 backdrop-blur-sm shadow-xl transform group-hover:scale-110 transition-transform">
                                                <FaExpandArrowsAlt /> <span>Click para expandir</span>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="h-64 flex items-center justify-center text-zinc-500">
                                        No hay eventos programados
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Class Schedule */}
                        <div className="bg-[#111] border border-zinc-800 rounded-xl overflow-hidden shadow-2xl flex flex-col relative group">
                            <div className="bg-gradient-to-r from-zinc-800 to-black p-5 border-b border-zinc-700/50 flex items-center gap-4">
                                <div className="p-3 bg-zinc-700 rounded-lg shadow-lg">
                                    <FaClock className="text-xl text-white" />
                                </div>
                                <h2 className="text-2xl font-bold text-white uppercase tracking-wider">Horarios</h2>
                            </div>

                            <div
                                className="p-5 bg-[#111] relative cursor-pointer flex-grow"
                                onClick={() => setIsScheduleExpanded(true)}
                            >
                                <div className="h-64 overflow-hidden relative opacity-50 group-hover:opacity-100 transition-opacity duration-300">
                                    <div className="transform scale-75 origin-top-left w-[133%]">
                                        <ClassSchedule initialAdminMode={false} />
                                    </div>
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 hover:bg-black/20 transition-colors z-10">
                                        <div className="bg-black/80 text-white px-4 py-2 rounded-full flex items-center gap-2 border border-zinc-700 backdrop-blur-sm shadow-xl transform group-hover:scale-110 transition-transform">
                                            <FaExpandArrowsAlt /> <span>Click para expandir</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>

                </div>
            </main>

            {/* Fights Modal */}
            {isFightsExpanded && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in" onClick={() => setIsFightsExpanded(false)}>
                    <div className="relative w-full max-w-4xl max-h-[90vh] overflow-auto bg-[#111] rounded-2xl border border-zinc-700 shadow-2xl animate-scale-up" onClick={e => e.stopPropagation()}>
                        <button
                            onClick={() => setIsFightsExpanded(false)}
                            className="absolute top-4 right-4 z-10 p-2 bg-zinc-800 text-white rounded-full hover:bg-red-600 transition-colors"
                        >
                            <FaTimes size={24} />
                        </button>
                        <div className="p-8">
                            <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                                <FaFistRaised className="text-red-500" /> Eventos Destacados
                            </h2>
                            <div className="divide-y divide-zinc-800">
                                {fights.map(fight => (
                                    <div key={fight._id} className="p-5 hover:bg-zinc-800/40 transition-colors">
                                        <div className="flex items-start gap-4">
                                            <div className="flex-grow">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <span className="text-xs font-bold text-red-500 uppercase bg-red-900/20 px-3 py-1 rounded border border-red-900/30">
                                                        <FaCalendarDay className="inline mr-1" /> {new Date(fight.fecha).toLocaleDateString('es-ES')}
                                                    </span>
                                                </div>
                                                <h3 className="text-xl font-bold text-white mb-2">{fight.titulo || `${fight.luchador1} vs ${fight.luchador2}`}</h3>
                                                <p className="text-zinc-400 mb-2">{fight.descripcion}</p>
                                                <div className="flex items-center gap-2 text-sm text-zinc-500">
                                                    <FaMapMarkerAlt className="text-red-500" /> {fight.ubicacion}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Schedule Modal */}
            {isScheduleExpanded && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in" onClick={() => setIsScheduleExpanded(false)}>
                    <div className="relative w-full max-w-6xl max-h-[90vh] overflow-auto bg-[#111] rounded-2xl border border-zinc-700 shadow-2xl animate-scale-up" onClick={e => e.stopPropagation()}>
                        <button
                            onClick={() => setIsScheduleExpanded(false)}
                            className="absolute top-4 right-4 z-10 p-2 bg-zinc-800 text-white rounded-full hover:bg-red-600 transition-colors"
                        >
                            <FaTimes size={24} />
                        </button>
                        <div className="p-8">
                            <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                                <FaClock className="text-red-500" /> Horario Completo de Clases
                            </h2>
                            <ClassSchedule initialAdminMode={false} />
                        </div>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
};

export default News;
