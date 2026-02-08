import React, { useState, useEffect } from 'react';
import { useUser } from '../hooks/useUser';
import { newsService } from '../services/newsService';
import { FaPlus, FaTrash, FaNewspaper, FaCalendarAlt, FaTimes, FaSave } from 'react-icons/fa';

const NewsSection = () => {
    const { isAdmin } = useUser();
    const [news, setNews] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({ titulo: '', descripcion: '', fecha: '' });

    useEffect(() => {
        loadNews();
    }, []);

    const loadNews = async () => {
        const res = await newsService.obtenerNoticias();
        if (res.success) {
            setNews(res.data);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('¿Seguro que quieres eliminar esta noticia?')) return;
        const res = await newsService.eliminarNoticia(id);
        if (res.success) {
            loadNews();
        } else {
            alert('Error al eliminar noticia');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await newsService.crearNoticia(formData);
        if (res.success) {
            loadNews();
            setShowModal(false);
            setFormData({ titulo: '', descripcion: '', fecha: '' });
        } else {
            alert('Error al crear noticia');
        }
    };

    const isUserAdmin = isAdmin();

    return (
        <section id="noticias" className="py-20 bg-[#0a0a0a] border-t border-zinc-900">
            <div className="max-w-7xl mx-auto px-4">

                {/* Header */}
                <div className="flex justify-between items-end mb-12">
                    <div>
                        <h2 className="text-4xl md:text-5xl font-bold text-white uppercase tracking-tighter mb-4">
                            Latest <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-800">News</span>
                        </h2>
                        <div className="h-1 w-24 bg-red-600 rounded-full"></div>
                    </div>
                    {isUserAdmin && (
                        <button
                            onClick={() => setShowModal(true)}
                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-colors shadow-lg shadow-red-900/20"
                        >
                            <FaPlus /> Nueva Noticia
                        </button>
                    )}
                </div>

                {/* News Grid */}
                {news.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {news.map(item => (
                            <div key={item._id} className="bg-[#111] border border-zinc-800 rounded-xl overflow-hidden hover:border-zinc-600 transition-colors group relative">
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <span className="text-xs font-bold text-red-500 uppercase tracking-widest flex items-center gap-1 bg-red-900/10 px-2 py-1 rounded">
                                            <FaCalendarAlt /> {new Date(item.fecha).toLocaleDateString()}
                                        </span>
                                        {isUserAdmin && (
                                            <button
                                                onClick={() => handleDelete(item._id)}
                                                className="text-zinc-600 hover:text-red-500 transition-colors"
                                            >
                                                <FaTrash />
                                            </button>
                                        )}
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-red-500 transition-colors line-clamp-2">
                                        {item.titulo}
                                    </h3>
                                    <p className="text-zinc-400 text-sm leading-relaxed line-clamp-4">
                                        {item.descripcion}
                                    </p>
                                </div>
                                <div className="h-1 w-full bg-gradient-to-r from-red-600 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-[#111] rounded-xl border border-zinc-800 border-dashed">
                        <FaNewspaper className="text-5xl text-zinc-700 mx-auto mb-4" />
                        <p className="text-zinc-500">No hay noticias publicadas aún.</p>
                    </div>
                )}

                {/* Modal Crear Noticia */}
                {showModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-fade-in">
                        <div className="bg-[#1a1a1a] p-8 rounded-2xl w-full max-w-lg border border-zinc-700 shadow-2xl relative animate-scale-up">
                            <button
                                onClick={() => setShowModal(false)}
                                className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors"
                            >
                                <FaTimes size={24} />
                            </button>

                            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                                <FaNewspaper className="text-red-500" /> Publicar Noticia
                            </h3>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm text-zinc-400 mb-1">Titular</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-3 text-white focus:border-red-600 focus:outline-none"
                                        placeholder="Título de la noticia..."
                                        value={formData.titulo}
                                        onChange={e => setFormData({ ...formData, titulo: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm text-zinc-400 mb-1">Fecha (Opcional)</label>
                                    <input
                                        type="date"
                                        className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-3 text-white focus:border-red-600 focus:outline-none"
                                        value={formData.fecha}
                                        onChange={e => setFormData({ ...formData, fecha: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm text-zinc-400 mb-1">Descripción</label>
                                    <textarea
                                        required
                                        rows="5"
                                        className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-3 text-white focus:border-red-600 focus:outline-none resize-none"
                                        placeholder="Contenido de la noticia..."
                                        value={formData.descripcion}
                                        onChange={e => setFormData({ ...formData, descripcion: e.target.value })}
                                    />
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                        className="flex-1 py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg font-bold"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold flex items-center justify-center gap-2"
                                    >
                                        <FaSave /> Publicar
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

export default NewsSection;
