import React, { useState, useEffect } from 'react';
import { galleryService } from '../../services/galleryService';
import { BACKEND_URL } from '../../services/api';
import { FaImage, FaPlus, FaEdit, FaTrash, FaTimes } from 'react-icons/fa';

export const GalleryManagement = () => {
    const [imagenes, setImagenes] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingImage, setEditingImage] = useState(null);
    const [formData, setFormData] = useState({
        titulo: '',
        descripcion: '',
        orden: 0,
        activo: true
    });
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    useEffect(() => {
        fetchImagenes();
    }, []);

    const fetchImagenes = async () => {
        try {
            const res = await galleryService.obtenerTodasAdmin();
            if (res.success) {
                setImagenes(res.data);
            }
        } catch (error) {
            console.error('Error fetching gallery:', error);
        }
    };

    const openModal = (imagen = null) => {
        if (imagen) {
            setEditingImage(imagen);
            setFormData({
                titulo: imagen.titulo || '',
                descripcion: imagen.descripcion || '',
                orden: imagen.orden || 0,
                activo: imagen.activo !== undefined ? imagen.activo : true
            });
            setImagePreview(`${BACKEND_URL}${imagen.imagen}`);
        } else {
            setEditingImage(null);
            setFormData({ titulo: '', descripcion: '', orden: 0, activo: true });
            setImagePreview(null);
        }
        setImageFile(null);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingImage(null);
        setFormData({ titulo: '', descripcion: '', orden: 0, activo: true });
        setImageFile(null);
        setImagePreview(null);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const formDataToSend = new FormData();
            formDataToSend.append('titulo', formData.titulo);
            formDataToSend.append('descripcion', formData.descripcion);
            formDataToSend.append('orden', formData.orden);
            formDataToSend.append('activo', formData.activo);

            if (imageFile) {
                formDataToSend.append('imagen', imageFile);
            }

            let res;
            if (editingImage) {
                res = await galleryService.actualizarImagen(editingImage._id, formDataToSend);
            } else {
                if (!imageFile) {
                    alert('Debe seleccionar una imagen');
                    return;
                }
                res = await galleryService.crearImagen(formDataToSend);
            }

            if (res.success) {
                alert(editingImage ? 'Imagen actualizada' : 'Imagen agregada');
                closeModal();
                fetchImagenes();
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error: ' + (error.message || 'Hubo un problema'));
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('¿Eliminar esta imagen?')) return;

        try {
            const res = await galleryService.eliminarImagen(id);
            if (res.success) {
                alert('Imagen eliminada');
                fetchImagenes();
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error al eliminar imagen');
        }
    };

    return (
        <div className="p-6 bg-zinc-900 min-h-screen">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-white">Gestión de Galería</h2>
                <button
                    onClick={() => openModal()}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                >
                    <FaPlus /> Agregar Imagen
                </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {imagenes.map(img => (
                    <div key={img._id} className="bg-zinc-800 rounded-lg overflow-hidden group relative">
                        <img
                            src={`${BACKEND_URL}${img.imagen}`}
                            alt={img.titulo}
                            className="w-full aspect-square object-cover"
                        />
                        <div className="p-3">
                            <h3 className="text-white font-bold truncate">{img.titulo || 'Sin título'}</h3>
                            <p className="text-zinc-400 text-sm truncate">{img.descripcion || 'Sin descripción'}</p>
                            <div className="flex items-center gap-2 mt-2">
                                <span className={`text-xs px-2 py-1 rounded ${img.activo ? 'bg-green-600' : 'bg-gray-600'}`}>
                                    {img.activo ? 'Activa' : 'Inactiva'}
                                </span>
                                <span className="text-xs text-zinc-500">Orden: {img.orden}</span>
                            </div>
                        </div>
                        <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                                onClick={() => openModal(img)}
                                className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded"
                            >
                                <FaEdit />
                            </button>
                            <button
                                onClick={() => handleDelete(img._id)}
                                className="bg-red-600 hover:bg-red-700 text-white p-2 rounded"
                            >
                                <FaTrash />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-zinc-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-2xl font-bold text-white">
                                    {editingImage ? 'Editar Imagen' : 'Nueva Imagen'}
                                </h3>
                                <button onClick={closeModal} className="text-white hover:text-red-500">
                                    <FaTimes size={24} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                {/* Image Preview */}
                                {imagePreview && (
                                    <div className="mb-4">
                                        <img src={imagePreview} alt="Preview" className="w-full max-h-64 object-contain rounded" />
                                    </div>
                                )}

                                {/* Image Upload */}
                                <div>
                                    <label className="block text-white mb-2">
                                        Imagen {editingImage && '(dejar vacío para mantener actual)'}
                                    </label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="w-full bg-zinc-700 text-white p-2 rounded"
                                    />
                                </div>

                                {/* Título */}
                                <div>
                                    <label className="block text-white mb-2">Título (opcional)</label>
                                    <input
                                        type="text"
                                        value={formData.titulo}
                                        onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                                        className="w-full bg-zinc-700 text-white p-2 rounded"
                                        placeholder="Título de la imagen"
                                    />
                                </div>

                                {/* Descripción */}
                                <div>
                                    <label className="block text-white mb-2">Descripción (opcional)</label>
                                    <textarea
                                        value={formData.descripcion}
                                        onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                                        className="w-full bg-zinc-700 text-white p-2 rounded"
                                        rows="3"
                                        placeholder="Descripción de la imagen"
                                    />
                                </div>

                                {/* Orden */}
                                <div>
                                    <label className="block text-white mb-2">Orden (mayor = aparece primero)</label>
                                    <input
                                        type="number"
                                        value={formData.orden}
                                        onChange={(e) => setFormData({ ...formData, orden: parseInt(e.target.value) || 0 })}
                                        className="w-full bg-zinc-700 text-white p-2 rounded"
                                    />
                                </div>

                                {/* Activo */}
                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={formData.activo}
                                        onChange={(e) => setFormData({ ...formData, activo: e.target.checked })}
                                        className="w-4 h-4"
                                    />
                                    <label className="text-white">Imagen activa (visible en la galería pública)</label>
                                </div>

                                {/* Buttons */}
                                <div className="flex gap-2 pt-4">
                                    <button
                                        type="submit"
                                        className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded"
                                    >
                                        {editingImage ? 'Actualizar' : 'Crear'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        className="flex-1 bg-zinc-600 hover:bg-zinc-700 text-white py-2 rounded"
                                    >
                                        Cancelar
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
