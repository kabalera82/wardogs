import React, { useState, useEffect } from 'react';
import { productService } from '../../services/productService';
import { BACKEND_URL } from '../../services/api';
import './EventManagement.css'; // Reutilizamos estilos por ahora
import { FaEdit, FaTrash, FaPlus, FaBoxOpen, FaSave, FaTimes, FaImage, FaTag, FaEuroSign, FaLayerGroup, FaRulerCombined } from 'react-icons/fa';

const ProductManagement = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newItem, setNewItem] = useState({
        nombre: '',
        descripcion: '',
        precio: '',
        stock: '',
        categoria: 'General',
        tallas: '', // String separado por comas
        imagen: null
    });
    const [preview, setPreview] = useState(null);
    const [msg, setMsg] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        try {
            const res = await productService.obtenerTodosAdmin();
            if (res.success) {
                setProducts(res.data);
            }
        } catch (error) {
            console.error("Error loading products:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewItem(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setNewItem(prev => ({ ...prev, imagen: file }));
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMsg(null);

        const formData = new FormData();
        formData.append('nombre', newItem.nombre);
        formData.append('descripcion', newItem.descripcion);
        formData.append('precio', newItem.precio);
        formData.append('stock', newItem.stock);
        formData.append('categoria', newItem.categoria);
        formData.append('tallas', newItem.tallas);
        if (newItem.imagen instanceof File) {
            formData.append('imagen', newItem.imagen);
        }

        let res;
        if (isEditing) {
            res = await productService.actualizarProducto(editId, formData);
        } else {
            res = await productService.crearProducto(formData);
        }

        if (res.success) {
            setMsg({ type: 'success', text: isEditing ? 'Producto actualizado' : 'Producto creado exitosamente' });
            resetForm();
            loadProducts();
        } else {
            setMsg({ type: 'error', text: res.error || 'Error al guardar producto' });
        }
    };

    const handleEdit = (product) => {
        setIsEditing(true);
        setEditId(product._id);
        setNewItem({
            nombre: product.nombre,
            descripcion: product.descripcion,
            precio: product.precio,
            stock: product.stock,
            categoria: product.categoria,
            tallas: product.tallas.join(', '),
            imagen: null // Keep null unless changed
        });
        if (product.imagen) {
            setPreview(product.imagen.startsWith('/assets') ? product.imagen : `${BACKEND_URL}${product.imagen}`);
        } else {
            setPreview(null);
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const resetForm = () => {
        setIsEditing(false);
        setEditId(null);
        setNewItem({
            nombre: '',
            descripcion: '',
            precio: '',
            stock: '',
            categoria: 'General',
            tallas: '',
            imagen: null
        });
        setPreview(null);
    };

    const handleDelete = async (id) => {
        if (window.confirm('¿Estás seguro de eliminar este producto?')) {
            const res = await productService.eliminarProducto(id);
            if (res.success) {
                loadProducts();
            } else {
                alert('Error al eliminar');
            }
        }
    };

    return (
        <div className="event-management-container space-y-8">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <FaBoxOpen className="text-red-600" /> Gestión de Productos
            </h2>

            {msg && <div className={`message ${msg.type} p-4 rounded-lg flex items-center gap-2 ${msg.type === 'success' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>{msg.text}</div>}

            <div className="admin-grid grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Formulario de Creación */}
                <div className="bg-[#1a1a1a] p-6 rounded-xl border border-zinc-800 lg:col-span-1 h-fit sticky top-4">
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                        {isEditing ? <FaEdit /> : <FaPlus />}
                        {isEditing ? 'Editar Producto' : 'Nuevo Producto'}
                    </h3>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="form-group">
                            <label className="text-sm text-gray-400 block mb-1">Nombre del Producto</label>
                            <div className="relative">
                                <FaTag className="absolute left-3 top-3 text-gray-500 text-xs" />
                                <input
                                    type="text"
                                    name="nombre"
                                    value={newItem.nombre}
                                    onChange={handleChange}
                                    required
                                    placeholder="Ej: Rashguard Modelo X"
                                    className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-3 pl-8 text-white focus:border-red-600 focus:outline-none"
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="text-sm text-gray-400 block mb-1">Descripción</label>
                            <textarea
                                name="descripcion"
                                value={newItem.descripcion}
                                onChange={handleChange}
                                required
                                rows="3"
                                className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-3 text-white focus:border-red-600 focus:outline-none resize-none"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="form-group">
                                <label className="text-sm text-gray-400 block mb-1">Precio (€)</label>
                                <div className="relative">
                                    <FaEuroSign className="absolute left-3 top-3 text-gray-500 text-xs" />
                                    <input
                                        type="number"
                                        name="precio"
                                        value={newItem.precio}
                                        onChange={handleChange}
                                        required
                                        min="0"
                                        step="0.01"
                                        className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-3 pl-8 text-white focus:border-red-600 focus:outline-none"
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="text-sm text-gray-400 block mb-1">Stock Total</label>
                                <div className="relative">
                                    <FaLayerGroup className="absolute left-3 top-3 text-gray-500 text-xs" />
                                    <input
                                        type="number"
                                        name="stock"
                                        value={newItem.stock}
                                        onChange={handleChange}
                                        required
                                        min="0"
                                        className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-3 pl-8 text-white focus:border-red-600 focus:outline-none"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="text-sm text-gray-400 block mb-1">Tallas (separadas por comas)</label>
                            <div className="relative">
                                <FaRulerCombined className="absolute left-3 top-3 text-gray-500 text-xs" />
                                <input
                                    type="text"
                                    name="tallas"
                                    value={newItem.tallas}
                                    onChange={handleChange}
                                    placeholder="Ej: S, M, L, XL"
                                    className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-3 pl-8 text-white focus:border-red-600 focus:outline-none"
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="text-sm text-gray-400 block mb-1">Categoría</label>
                            <select
                                name="categoria"
                                value={newItem.categoria}
                                onChange={handleChange}
                                className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-3 text-white focus:border-red-600 focus:outline-none"
                            >
                                <option value="General">General</option>
                                <option value="Ropa">Ropa</option>
                                <option value="Equipamiento">Equipamiento</option>
                                <option value="Accesorios">Accesorios</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label className="text-sm text-gray-400 block mb-1">Imagen del Producto</label>
                            <div className="border-2 border-dashed border-zinc-700 rounded-lg p-4 text-center cursor-pointer hover:border-red-600 transition-colors relative">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                />
                                <div className="flex flex-col items-center gap-2 text-gray-500">
                                    <FaImage className="text-2xl" />
                                    <span className="text-xs">Click para subir imagen</span>
                                </div>
                            </div>
                            {preview && (
                                <div className="mt-4 rounded-lg overflow-hidden border border-zinc-700 h-40">
                                    <img src={preview} alt="Vista previa" className="w-full h-full object-cover" />
                                </div>
                            )}
                        </div>

                        <div className="pt-2 flex flex-col gap-2">
                            <button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2">
                                {isEditing ? <FaSave /> : <FaPlus />}
                                {isEditing ? 'Actualizar' : 'Crear'}
                            </button>
                            {isEditing && (
                                <button type="button" className="w-full bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2" onClick={resetForm}>
                                    <FaTimes /> Cancelar
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                {/* Lista de Productos */}
                <div className="bg-[#1a1a1a] p-6 rounded-xl border border-zinc-800 lg:col-span-2">
                    <h3 className="text-xl font-bold text-white mb-6 border-b border-zinc-800 pb-2">Inventario Actual</h3>
                    {loading ? (
                        <p className="text-gray-400">Cargando productos...</p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {products.map(product => (
                                <div key={product._id} className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 flex gap-4 hover:border-red-600/50 transition-colors group">
                                    <div className="w-20 h-20 bg-black rounded-lg overflow-hidden flex-shrink-0">
                                        {product.imagen ? (
                                            <img
                                                src={product.imagen.startsWith('/assets') ? product.imagen : `${BACKEND_URL}${product.imagen}`}
                                                alt={product.nombre}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-zinc-700">
                                                <FaBoxOpen className="text-2xl" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-bold text-white truncate">{product.nombre}</h4>
                                        <p className="text-red-500 font-bold">{product.precio}€</p>
                                        <div className="flex flex-wrap gap-2 text-xs text-gray-500 mt-1">
                                            <span className="bg-zinc-800 px-2 py-0.5 rounded">Stock: {product.stock}</span>
                                            <span className="bg-zinc-800 px-2 py-0.5 rounded truncate max-w-[100px]">{product.tallas.join(', ')}</span>
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <button
                                            onClick={() => handleEdit(product)}
                                            className="text-blue-400 hover:text-white hover:bg-blue-600 p-2 rounded-lg transition-colors"
                                            title="Editar"
                                        >
                                            <FaEdit />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(product._id)}
                                            className="text-red-400 hover:text-white hover:bg-red-600 p-2 rounded-lg transition-colors"
                                            title="Eliminar"
                                        >
                                            <FaTrash />
                                        </button>
                                    </div>
                                </div>
                            ))}
                            {products.length === 0 && <p className="text-gray-500 col-span-2 text-center py-10">No hay productos registrados.</p>}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductManagement;
