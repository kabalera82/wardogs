import React, { useState, useEffect } from 'react';
import { newsService } from '../../services/newsService';
import { FaPlus, FaTrash, FaNewspaper, FaCalendarAlt, FaTimes, FaSave } from 'react-icons/fa';

const NewsManagement = () => {
    const [news, setNews] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({ titulo: '', descripcion: '', fecha: '' });
    const [msg, setMsg] = useState(null);

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
            setMsg({ type: 'success', text: 'Noticia eliminada correctamente' });
            setTimeout(() => setMsg(null), 3000);
        } else {
            setMsg({ type: 'error', text: 'Error al eliminar noticia' });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await newsService.crearNoticia(formData);
        if (res.success) {
            loadNews();
            setShowModal(false);
            setFormData({ titulo: '', descripcion: '', fecha: '' });
            setMsg({ type: 'success', text: 'Noticia creada correctamente' });
            setTimeout(() => setMsg(null), 3000);
        } else {
            setMsg({ type: 'error', text: 'Error al crear noticia' });
        }
    };

    return (
        <div className="text-gray-200">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <FaNewspaper className="text-red-600" /> Gestión de Noticias
                </h2>
                <button
                    onClick={() => setShowModal(true)}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-colors shadow-lg"
                >
                    <FaPlus /> Nueva Noticia
                </button>
            </div>

            {msg && (
                <div className={`mb-4 p-3 rounded text-sm font-bold ${msg.type === 'success' ? 'bg-green-500/20 text-green-500 border border-green-500/30' : 'bg-red-500/20 text-red-500 border border-red-500/30'}`}>
                    {msg.text}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {news.length > 0 ? news.map(item => (
                    <div key={item._id} className="bg-[#0a0a0a] border border-zinc-800 rounded-xl overflow-hidden flex flex-col">
                        <div className="p-5 flex-grow">
                            <div className="flex justify-between items-start mb-4">
                                <span className="text-xs font-bold text-red-500 uppercase tracking-widest flex items-center gap-1 bg-red-900/10 px-2 py-1 rounded border border-red-900/20">
                                    <FaCalendarAlt /> {new Date(item.fecha).toLocaleDateString()}
                                </span>
                                <button
                                    onClick={() => handleDelete(item._id)}
                                    className="text-zinc-500 hover:text-red-500 transition-colors p-2 hover:bg-zinc-900 rounded-full"
                                    title="Eliminar Noticia"
                                >
                                    <FaTrash />
                                </button>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2 line-clamp-2">{item.titulo}</h3>
                            <p className="text-zinc-400 text-sm line-clamp-4 whitespace-pre-wrap">{item.descripcion}</p>
                        </div>
                    </div>
                )) : (
                    <div className="col-span-full text-center py-12 bg-[#0a0a0a] rounded-xl border border-zinc-800 border-dashed">
                        <p className="text-zinc-500">No hay noticias publicadas.</p>
                    </div>
                )}
            </div>

            {/* Modal Crear Noticia */}
            {showModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="bg-[#111] p-8 rounded-2xl w-full max-w-lg border border-zinc-700 shadow-2xl relative animate-scale-up">
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
                                    placeholder="Título..."
                                    value={formData.titulo}
                                    onChange={e => setFormData({ ...formData, titulo: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm text-zinc-400 mb-1">Fecha</label>
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
                                    rows="6"
                                    className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-3 text-white focus:border-red-600 focus:outline-none resize-none"
                                    placeholder="Contenido..."
                                    value={formData.descripcion}
                                    onChange={e => setFormData({ ...formData, descripcion: e.target.value })}
                                />
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg font-bold transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold flex items-center justify-center gap-2 transition-colors"
                                >
                                    <FaSave /> Publicar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NewsManagement;
