import React, { useState, useEffect } from 'react';
import { eventService } from '../../services/eventService';
import { BACKEND_URL } from '../../services/api';
import { FaCalendarAlt, FaMapMarkerAlt, FaInfoCircle } from 'react-icons/fa';

const UserEvents = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const res = await eventService.obtenerEventos();
                if (res.success) {
                    setEvents(res.data);
                }
            } catch (error) {
                console.error("Error fetching events:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchEvents();
    }, []);

    if (loading) return <div className="text-center py-10 text-gray-500">Cargando eventos...</div>;

    if (events.length === 0) {
        return (
            <div className="text-center py-20 bg-[#1a1a1a] rounded-xl border border-zinc-800">
                <FaCalendarAlt className="text-6xl text-zinc-700 mx-auto mb-4" />
                <p className="text-gray-400 text-xl">No hay eventos próximos.</p>
                <p className="text-gray-600 mt-2">Mantente atento a las actualizaciones.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
            {events.map(event => (
                <div key={event._id} className="bg-[#1a1a1a] rounded-xl overflow-hidden border border-zinc-800 hover:border-red-600 transition-all shadow-lg hover:shadow-red-900/20 group">
                    <div className="aspect-video bg-zinc-900 relative overflow-hidden">
                        {event.imagen ? (
                            <img
                                src={`${BACKEND_URL}${event.imagen}`}
                                alt={event.titulo}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-zinc-700">
                                <FaCalendarAlt className="text-4xl" />
                            </div>
                        )}
                        <div className="absolute top-4 right-4 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                            {new Date(event.fecha).toLocaleDateString()}
                        </div>
                    </div>

                    <div className="p-6">
                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-red-500 transition-colors">{event.titulo}</h3>

                        <div className="space-y-2 mb-4">
                            <div className="flex items-center gap-2 text-sm text-gray-400">
                                <FaMapMarkerAlt className="text-red-500" />
                                <span>{event.ubicacion}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-400">
                                <FaCalendarAlt className="text-red-500" />
                                <span>{new Date(event.fecha).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                        </div>

                        <p className="text-gray-500 text-sm line-clamp-3 mb-4">
                            {event.descripcion}
                        </p>

                        <button className="w-full bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-2 rounded-lg transition-colors border border-zinc-700 flex items-center justify-center gap-2">
                            <FaInfoCircle /> Más Información
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default UserEvents;
