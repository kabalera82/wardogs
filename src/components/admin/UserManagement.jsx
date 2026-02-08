import React, { useState, useEffect } from 'react';
import { userService } from '../../services/userService';
import { BACKEND_URL } from '../../services/api';
import { FaUserPlus, FaEdit, FaTrash, FaCheck, FaTimes, FaSearch, FaUserShield, FaUserNinja, FaUserTie, FaUser } from 'react-icons/fa';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [formData, setFormData] = useState({
        nombre: '',
        apellidos: '',
        email: '',
        contrasena: '',
        rol: 'usuario',
        telefono: '',
        dni: '',
        estadoFederacion: 'no_aplica',
        numeroLicencia: '',
        activo: true
    });

    const fetchUsers = async () => {
        try {
            const res = await userService.obtenerUsuarios();
            if (res.success) {
                setUsers(res.data.usuarios);
            }
        } catch (error) {
            console.error("Error fetching users:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        // Si cambia el rol a 'luchador' o 'entrenador', asegurar que estadoFederacion sea válido
        if (name === 'rol' && (value === 'luchador' || value === 'entrenador')) {
            setFormData({
                ...formData,
                [name]: value,
                estadoFederacion: formData.estadoFederacion === 'no_aplica' ? 'no_federado' : formData.estadoFederacion
            });
        }
        // Si cambia el rol de 'luchador'/'entrenador' a otro, resetear estadoFederacion a 'no_aplica'
        else if (name === 'rol' && (formData.rol === 'luchador' || formData.rol === 'entrenador') && value !== 'luchador' && value !== 'entrenador') {
            setFormData({
                ...formData,
                [name]: value,
                estadoFederacion: 'no_aplica',
                numeroLicencia: ''
            });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('[UserManagement] Submitting data:', formData);
        console.log('[UserManagement] Editing user:', editingUser);

        // AUTO-FIX: Si el rol es luchador o entrenador y estadoFederacion es 'no_aplica', corregir a 'no_federado'
        const dataToSubmit = { ...formData };
        if ((dataToSubmit.rol === 'luchador' || dataToSubmit.rol === 'entrenador') && dataToSubmit.estadoFederacion === 'no_aplica') {
            console.log('[UserManagement] Auto-correcting estadoFederacion from no_aplica to no_federado');
            dataToSubmit.estadoFederacion = 'no_federado';
        }

        try {
            let res;
            if (editingUser) {
                res = await userService.actualizarUsuarioAdmin(editingUser._id, dataToSubmit);
            } else {
                res = await userService.crearUsuario(dataToSubmit);
            }

            console.log('[UserManagement] Backend response:', res);

            if (res.success) {
                alert(editingUser ? 'Usuario actualizado correctamente' : 'Usuario creado correctamente');
                closeModal();
                fetchUsers();
            } else {
                const errorMsg = res.error || res.mensaje || 'Hubo un incidente';
                console.error('[UserManagement] Backend error:', errorMsg);
                alert('Error: ' + errorMsg);
            }
        } catch (error) {
            console.error('[UserManagement] Error details:', error);
            console.error('[UserManagement] Error message:', error.message);
            console.error('[UserManagement] Error stack:', error.stack);
            alert('Error: ' + (error.message || 'Hubo un incidente'));
        }
    };

    const handleCreate = () => {
        setEditingUser(null);
        setFormData({
            nombre: '',
            apellidos: '',
            email: '',
            contrasena: '',
            rol: 'usuario',
            telefono: '',
            dni: '',
            estadoFederacion: 'no_aplica',
            numeroLicencia: '',
            activo: true
        });
        setIsModalOpen(true);
    };

    const handleEdit = (user) => {
        setEditingUser(user);
        setFormData({
            nombre: user.nombre || '',
            apellidos: user.apellidos || '',
            email: user.email || '',
            telefono: user.telefono || '',
            dni: user.dni || '',
            rol: user.rol || 'usuario',
            estadoFederacion: user.estadoFederacion || 'no_aplica',
            numeroLicencia: user.numeroLicencia || '',
            contrasena: '', // No mostramos contraseña
            activo: user.activo
        });
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('¿Estás seguro de desactivar este usuario?')) {
            try {
                await userService.desactivarUsuario(id);
                fetchUsers();
            } catch (error) {
                console.error(error);
            }
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingUser(null);
    };

    const getRoleIcon = (rol) => {
        switch (rol) {
            case 'admin': return <FaUserShield className="text-red-500" />;
            case 'entrenador': return <FaUserTie className="text-blue-500" />;
            case 'luchador': return <FaUserNinja className="text-orange-500" />;
            default: return <FaUser className="text-gray-400" />;
        }
    };

    if (loading) return <div className="text-white text-center py-10">Cargando usuarios...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <FaUserShield /> Gestión de Usuarios
                </h2>
                <button
                    onClick={handleCreate}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors font-bold shadow-lg shadow-red-900/20"
                >
                    <FaUserPlus /> Nuevo Usuario
                </button>
            </div>

            <div className="overflow-x-auto bg-[#1a1a1a] rounded-xl border border-zinc-800 shadow-md">
                <table className="w-full text-left text-gray-300">
                    <thead className="bg-zinc-900 text-gray-100 uppercase text-xs tracking-wider">
                        <tr>
                            <th className="p-4">Avatar</th>
                            <th className="p-4">Usuario</th>
                            <th className="p-4">Rol</th>
                            <th className="p-4">Estado</th>
                            <th className="p-4 text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800">
                        {users.map(user => (
                            <tr key={user._id} className="hover:bg-zinc-800/50 transition-colors">
                                <td className="p-4">
                                    <div className="w-10 h-10 rounded-full bg-zinc-700 overflow-hidden flex items-center justify-center">
                                        {user.avatar ? (
                                            <img src={`${BACKEND_URL}${user.avatar}`} alt="avatar" className="w-full h-full object-cover" />
                                        ) : (
                                            <FaUser className="text-gray-400" />
                                        )}
                                    </div>
                                </td>
                                <td className="p-4">
                                    <div className="font-bold text-white">{user.nombre} {user.apellidos}</div>
                                    <div className="text-xs text-gray-500">{user.email}</div>
                                </td>
                                <td className="p-4">
                                    <div className="flex items-center gap-2 capitalize">
                                        {getRoleIcon(user.rol)}
                                        {user.rol}
                                    </div>
                                </td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${user.activo ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                                        {user.activo ? 'Activo' : 'Inactivo'}
                                    </span>
                                </td>
                                <td className="p-4 text-right space-x-2">
                                    <button
                                        onClick={() => handleEdit(user)}
                                        className="text-blue-400 hover:text-blue-300 p-2 hover:bg-blue-500/10 rounded-lg transition-colors"
                                        title="Editar Usuario"
                                    >
                                        <FaEdit />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(user._id)}
                                        className="text-red-400 hover:text-red-300 p-2 hover:bg-red-500/10 rounded-lg transition-colors"
                                        title={user.activo ? "Desactivar" : "Activar"}
                                    >
                                        {user.activo ? <FaTrash /> : <FaCheck />}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal Crear/Editar */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="bg-[#1a1a1a] border border-zinc-700 rounded-2xl w-full max-w-md p-6 relative shadow-2xl animate-fade-in">
                        <button
                            onClick={closeModal}
                            className="absolute top-4 right-4 text-gray-400 hover:text-white"
                        >
                            <FaTimes />
                        </button>

                        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                            {editingUser ? <FaEdit /> : <FaUserPlus />}
                            {editingUser ? 'Editar Usuario' : 'Nuevo Usuario'}
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Nombre</label>
                                    <input
                                        type="text"
                                        name="nombre"
                                        value={formData.nombre}
                                        onChange={handleInputChange}
                                        className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-3 text-white focus:border-red-600 focus:outline-none"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Apellidos</label>
                                    <input
                                        type="text"
                                        name="apellidos"
                                        value={formData.apellidos || ''}
                                        onChange={handleInputChange}
                                        className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-3 text-white focus:border-red-600 focus:outline-none"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-3 text-white focus:border-red-600 focus:outline-none"
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Teléfono</label>
                                    <input
                                        type="tel"
                                        name="telefono"
                                        value={formData.telefono || ''}
                                        onChange={handleInputChange}
                                        className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-3 text-white focus:border-red-600 focus:outline-none"
                                    />
                                </div>
                                {editingUser && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-1">Estado</label>
                                        <select
                                            name="activo"
                                            value={formData.activo}
                                            onChange={(e) => setFormData({ ...formData, activo: e.target.value === 'true' })}
                                            className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-3 text-white focus:border-red-600 focus:outline-none"
                                        >
                                            <option value="true">Activo</option>
                                            <option value="false">Inactivo</option>
                                        </select>
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Contraseña {editingUser && '(Opcional)'}</label>
                                <input
                                    type="password"
                                    name="contrasena"
                                    value={formData.contrasena}
                                    onChange={handleInputChange}
                                    className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-3 text-white focus:border-red-600 focus:outline-none"
                                    placeholder={editingUser ? "Dejar en blanco para no cambiar" : ""}
                                    required={!editingUser}
                                    minLength={6}
                                />
                            </div>

                            {/* Solo mostramos Rol si estamos editando o creando */}
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Rol</label>
                                <select
                                    name="rol"
                                    value={formData.rol}
                                    onChange={handleInputChange}
                                    className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-3 text-white focus:border-red-600 focus:outline-none appearance-none"
                                >
                                    <option value="usuario">Usuario</option>
                                    <option value="luchador">Luchador</option>
                                    <option value="entrenador">Entrenador</option>
                                    <option value="admin">Administrador</option>
                                    <option value="cliente">Cliente (legacy)</option>
                                </select>
                            </div>

                            {/* DNI Field - Optional, Private */}
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">DNI (Opcional, Privado)</label>
                                <input
                                    type="text"
                                    name="dni"
                                    value={formData.dni || ''}
                                    onChange={handleInputChange}
                                    className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-3 text-white focus:border-red-600 focus:outline-none"
                                    placeholder="Documento de identidad"
                                />
                                <p className="text-xs text-gray-500 mt-1">Campo privado, no visible públicamente</p>
                            </div>

                            {/* Federation Fields - Only for Fighters and Trainers */}
                            {(formData.rol === 'luchador' || formData.rol === 'entrenador') && (
                                <div className="space-y-4 bg-zinc-800/30 p-4 rounded-lg border border-zinc-700">
                                    <h4 className="text-sm font-bold text-red-500 uppercase">Datos de Federación</h4>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-1">Estado de Federación *</label>
                                        <select
                                            name="estadoFederacion"
                                            value={formData.estadoFederacion}
                                            onChange={handleInputChange}
                                            className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-3 text-white focus:border-red-600 focus:outline-none"
                                            required
                                        >
                                            <option value="no_federado">No Federado</option>
                                            <option value="federado">Federado</option>
                                        </select>
                                    </div>
                                    {formData.estadoFederacion === 'federado' && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-400 mb-1">Número de Licencia (Opcional)</label>
                                            <input
                                                type="text"
                                                name="numeroLicencia"
                                                value={formData.numeroLicencia || ''}
                                                onChange={handleInputChange}
                                                className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-3 text-white focus:border-red-600 focus:outline-none"
                                                placeholder="Ej: FED-2024-1234"
                                            />
                                        </div>
                                    )}
                                </div>
                            )}

                            <button
                                type="submit"
                                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg transition-colors mt-4"
                            >
                                {editingUser ? 'Guardar Cambios' : 'Crear Usuario'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserManagement;
