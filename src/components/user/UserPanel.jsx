import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../hooks/useUser';
import AvatarUpload from './AvatarUpload';
import EventManagement from '../admin/EventManagement';
import ProductManagement from '../admin/ProductManagement';
import UserManagement from '../admin/UserManagement';
import NewsManagement from '../admin/NewsManagement';
import { GalleryManagement } from '../admin/GalleryManagement';
import UserEvents from './UserEvents';
import './UserPanel.css';
import { FaUser, FaCalendarAlt, FaShoppingBag, FaUsers, FaSignOutAlt, FaEdit, FaSave, FaTimes, FaArrowLeft, FaEnvelope, FaPhone, FaIdCard, FaInfoCircle, FaNewspaper, FaImage } from 'react-icons/fa';

const UserPanel = () => {
    const { profile, loading, error, updateProfile, isAdmin } = useUser();
    const [activeTab, setActiveTab] = useState('profile');
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        nombre: '',
        apellidos: '',
        seudonimo: '',
        email: '',
        telefono: '',
        biografia: '',
        rol: 'usuario',
        activo: false
    });
    const [avatarFile, setAvatarFile] = useState(null);
    const [msg, setMsg] = useState(null);
    const navigate = useNavigate();

    // Inicializar form data cuando carga el perfil
    useEffect(() => {
        if (profile) {
            setFormData({
                nombre: profile.nombre || '',
                apellidos: profile.apellidos || '',
                seudonimo: profile.seudonimo || '',
                email: profile.email || '',
                telefono: profile.telefono || '',
                biografia: profile.biografia || '',
                rol: profile.rol || 'usuario',
                activo: profile.activo || false
            });
        }
    }, [profile]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMsg(null);

        const result = await updateProfile({
            ...formData,
            avatarFile
        });

        if (result.success) {
            setMsg({ type: 'success', text: result.message });
            setIsEditing(false);
            setAvatarFile(null);
        } else {
            setMsg({ type: 'error', text: result.message });
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('wardogs_token');
        navigate('/login');
    };

    if (loading && !profile) return <div className="text-white text-center py-20">Cargando perfil...</div>;
    if (error) return <div className="text-red-500 text-center py-20">{error}</div>;
    if (!profile) return null;

    const adminMode = isAdmin();

    return (
        <div className="max-w-7xl mx-auto px-4 py-8 min-h-screen">
            {/* Header del Panel */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 bg-[#111] p-6 rounded-2xl border border-zinc-800 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

                <div className="flex flex-col md:flex-row items-center gap-6 z-10 w-full md:w-auto">
                    <button
                        onClick={() => navigate('/')}
                        className="absolute top-6 right-6 md:relative md:top-auto md:right-auto md:order-last text-gray-500 hover:text-white transition-colors"
                        title="Volver al Inicio"
                    >
                        <FaArrowLeft />
                    </button>

                    <div className="relative group">
                        <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-zinc-800 shadow-2xl bg-zinc-900">
                            <AvatarUpload
                                currentAvatar={profile.avatar}
                                editMode={isEditing}
                                onFileSelect={setAvatarFile}
                            />
                        </div>
                    </div>

                    <div className="text-center md:text-left">
                        <h1 className="text-3xl font-bold text-white uppercase tracking-wider mb-1">{profile.nombre} {profile.apellidos}</h1>
                        <div className="flex items-center justify-center md:justify-start gap-2 text-sm">
                            <span className="bg-zinc-800 px-3 py-1 rounded-full text-red-500 font-bold uppercase tracking-widest border border-zinc-700 shadow-sm">
                                {profile.rol}
                            </span>
                            <span className="text-gray-400 flex items-center gap-1">
                                <FaEnvelope className="text-xs" /> {profile.email}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex gap-3 mt-6 md:mt-0 z-10">
                    {activeTab === 'profile' && !isEditing && (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-2 rounded-lg transition-colors border border-zinc-700 font-medium"
                        >
                            <FaEdit /> Editar Perfil
                        </button>
                    )}
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white px-4 py-2 rounded-lg transition-all border border-red-600/20 hover:border-red-600 font-medium"
                    >
                        <FaSignOutAlt /> Cerrar Sesión
                    </button>
                </div>
            </div>

            {/* Navegación de Pestañas */}
            <div className="flex overflow-x-auto gap-2 mb-8 border-b border-zinc-800 pb-1 scrollbar-hide">
                <button
                    className={`flex items-center gap-2 px-6 py-3 rounded-t-lg font-bold transition-all whitespace-nowrap ${activeTab === 'profile' ? 'bg-[#111] text-red-500 border-t border-x border-zinc-800' : 'text-gray-400 hover:text-white hover:bg-zinc-900'}`}
                    onClick={() => setActiveTab('profile')}
                >
                    <FaUser /> Mi Perfil
                </button>

                <button
                    className={`flex items-center gap-2 px-6 py-3 rounded-t-lg font-bold transition-all whitespace-nowrap ${activeTab === 'events' ? 'bg-[#111] text-red-500 border-t border-x border-zinc-800' : 'text-gray-400 hover:text-white hover:bg-zinc-900'}`}
                    onClick={() => setActiveTab('events')}
                >
                    <FaCalendarAlt /> Eventos
                </button>

                {adminMode && (
                    <>
                        <button
                            className={`flex items-center gap-2 px-6 py-3 rounded-t-lg font-bold transition-all whitespace-nowrap ${activeTab === 'products' ? 'bg-[#111] text-red-500 border-t border-x border-zinc-800' : 'text-gray-400 hover:text-white hover:bg-zinc-900'}`}
                            onClick={() => setActiveTab('products')}
                        >
                            <FaShoppingBag /> Productos
                        </button>
                        <button
                            className={`flex items-center gap-2 px-6 py-3 rounded-t-lg font-bold transition-all whitespace-nowrap ${activeTab === 'users' ? 'bg-[#111] text-red-500 border-t border-x border-zinc-800' : 'text-gray-400 hover:text-white hover:bg-zinc-900'}`}
                            onClick={() => setActiveTab('users')}
                        >
                            <FaUsers /> Usuarios
                        </button>
                        <button
                            className={`flex items-center gap-2 px-6 py-3 rounded-t-lg font-bold transition-all whitespace-nowrap ${activeTab === 'news' ? 'bg-[#111] text-red-500 border-t border-x border-zinc-800' : 'text-gray-400 hover:text-white hover:bg-zinc-900'}`}
                            onClick={() => setActiveTab('news')}
                        >
                            <FaNewspaper /> Noticias
                        </button>
                        <button
                            className={`flex items-center gap-2 px-6 py-3 rounded-t-lg font-bold transition-all whitespace-nowrap ${activeTab === 'gallery' ? 'bg-[#111] text-red-500 border-t border-x border-zinc-800' : 'text-gray-400 hover:text-white hover:bg-zinc-900'}`}
                            onClick={() => setActiveTab('gallery')}
                        >
                            <FaImage /> Galería
                        </button>
                    </>
                )}
            </div>

            {msg && (
                <div className={`mb-6 p-4 rounded-lg flex items-center gap-2 ${msg.type === 'success' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}>
                    {msg.type === 'success' ? <FaSave /> : <FaInfoCircle />}
                    {msg.text}
                </div>
            )}

            {/* Contenido de las Pestañas */}
            <div className="bg-[#111] p-8 rounded-2xl border border-zinc-800 shadow-xl min-h-[500px] animate-fade-in">
                {activeTab === 'profile' ? (
                    <form className="max-w-4xl mx-auto" onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">

                            {/* Columna Izquierda */}
                            <div className="space-y-6">
                                <h3 className="text-xl font-bold text-white flex items-center gap-2 border-b border-zinc-800 pb-2">
                                    <FaIdCard className="text-red-500" /> Información Personal
                                </h3>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm text-gray-400 block">Nombre</label>
                                        <input
                                            type="text" name="nombre"
                                            value={formData.nombre} onChange={handleChange}
                                            disabled={!isEditing}
                                            className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-3 text-white focus:border-red-600 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm text-gray-400 block">Apellidos</label>
                                        <input
                                            type="text" name="apellidos"
                                            value={formData.apellidos} onChange={handleChange}
                                            disabled={!isEditing}
                                            className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-3 text-white focus:border-red-600 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm text-gray-400 block">Seudónimo (Apodo)</label>
                                    <input
                                        type="text" name="seudonimo"
                                        value={formData.seudonimo} onChange={handleChange}
                                        disabled={!isEditing}
                                        className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-3 text-white focus:border-red-600 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm text-gray-400 block">Teléfono</label>
                                    <div className="relative">
                                        <FaPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                                        <input
                                            type="tel" name="telefono"
                                            value={formData.telefono} onChange={handleChange}
                                            disabled={!isEditing}
                                            className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-3 pl-10 text-white focus:border-red-600 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Columna Derecha */}
                            <div className="space-y-6">
                                <h3 className="text-xl font-bold text-white flex items-center gap-2 border-b border-zinc-800 pb-2">
                                    <FaInfoCircle className="text-red-500" /> Cuenta & Bio
                                </h3>

                                <div className="space-y-2">
                                    <label className="text-sm text-gray-400 block">Email</label>
                                    <div className="relative">
                                        <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                                        <input
                                            type="email" name="email"
                                            value={formData.email} onChange={handleChange}
                                            disabled={!isEditing || !adminMode}
                                            className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-3 pl-10 text-white focus:border-red-600 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        />
                                    </div>
                                    {isEditing && !adminMode && <p className="text-xs text-gray-600">Contacta a admin para cambiar email</p>}
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm text-gray-400 block">Biografía</label>
                                    <textarea
                                        name="biografia"
                                        value={formData.biografia} onChange={handleChange}
                                        disabled={!isEditing}
                                        rows="4"
                                        className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-3 text-white focus:border-red-600 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-colors resize-none"
                                    />
                                </div>

                                {adminMode && (
                                    <div className="flex gap-4">
                                        <div className="space-y-2 w-1/2">
                                            <label className="text-sm text-gray-400 block">Rol</label>
                                            {isEditing ? (
                                                <select
                                                    name="rol"
                                                    value={formData.rol}
                                                    onChange={handleChange}
                                                    className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-3 text-white focus:border-red-600 focus:outline-none appearance-none"
                                                >
                                                    <option value="usuario">Usuario</option>
                                                    <option value="luchador">Luchador</option>
                                                    <option value="entrenador">Entrenador</option>
                                                    <option value="admin">Admin</option>
                                                </select>
                                            ) : (
                                                <input type="text" value={formData.rol} disabled className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-3 text-white disabled:opacity-50" />
                                            )}
                                        </div>
                                        <div className="space-y-2 w-1/2">
                                            <label className="text-sm text-gray-400 block">Estado</label>
                                            <div className="flex items-center h-[50px]">
                                                {isEditing ? (
                                                    <label className="flex items-center cursor-pointer relative">
                                                        <input type="checkbox" name="activo" checked={formData.activo} onChange={handleChange} class="sr-only peer" />
                                                        <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                                                        <span className="ml-3 text-sm font-medium text-gray-300">{formData.activo ? 'Activo' : 'Inactivo'}</span>
                                                    </label>
                                                ) : (
                                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${formData.activo ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                                                        {formData.activo ? 'ACTIVO' : 'INACTIVO'}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {isEditing && (
                            <div className="flex justify-end gap-4 mt-8 pt-8 border-t border-zinc-800 animate-slide-up">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsEditing(false);
                                        setAvatarFile(null);
                                        setFormData(profile);
                                    }}
                                    className="flex items-center gap-2 px-6 py-3 rounded-lg text-gray-400 hover:text-white hover:bg-zinc-800 transition-colors font-bold"
                                >
                                    <FaTimes /> Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex items-center gap-2 px-8 py-3 rounded-lg bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-900/20 hover:shadow-red-900/40 transition-all font-bold"
                                >
                                    <FaSave /> {loading ? 'Guardando...' : 'Guardar Cambios'}
                                </button>
                            </div>
                        )}
                    </form>
                ) : activeTab === 'events' ? (
                    adminMode ? <EventManagement /> : <UserEvents />
                ) : activeTab === 'products' ? (
                    <ProductManagement />
                ) : activeTab === 'news' ? (
                    <NewsManagement />
                ) : activeTab === 'gallery' ? (
                    <GalleryManagement />
                ) : (
                    <UserManagement />
                )}
            </div>
        </div>
    );
};

export default UserPanel;
