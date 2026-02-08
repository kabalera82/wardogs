import React, { useState, useEffect } from 'react';
import { productService } from '../services/productService';
import { BACKEND_URL } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaShoppingBag, FaTimes, FaCheck, FaTshirt, FaTag, FaInfoCircle, FaSpinner } from 'react-icons/fa';

const Shop = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [orderForm, setOrderForm] = useState({
        nombre: '',
        apellidos: '',
        talla: ''
    });
    const [orderStatus, setOrderStatus] = useState(null); // 'sending', 'success', 'error'
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await productService.obtenerProductos();
                if (res.success) {
                    setProducts(res.data);
                }
            } catch (error) {
                console.error("Error fetching products:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const handleOrderClick = (product) => {
        setSelectedProduct(product);
        setOrderForm({ nombre: '', apellidos: '', talla: product.tallas[0] || '' });
        setIsModalOpen(true);
        setOrderStatus(null);
    };

    const handleFormChange = (e) => {
        setOrderForm({ ...orderForm, [e.target.name]: e.target.value });
    };

    const handleSubmitOrder = async (e) => {
        e.preventDefault();
        setOrderStatus('sending');

        // Simulación de envío a Google API
        setTimeout(() => {
            console.log("Enviando pedido a Google Excel:", {
                producto: selectedProduct.nombre,
                precio: selectedProduct.precio,
                cliente: orderForm
            });
            setOrderStatus('success');
            setTimeout(() => {
                setIsModalOpen(false);
                setOrderStatus(null);
            }, 2000);
        }, 1500);
    };

    if (loading) return <div className="min-h-screen bg-black text-white flex items-center justify-center gap-2"><div className="animate-spin"><FaSpinner /></div> Cargando Wardogs Shop...</div>;

    return (
        <div className="min-h-screen bg-black text-white font-sans">
            {/* Header */}
            <header className="p-4 bg-zinc-900/80 backdrop-blur-md flex justify-between items-center sticky top-0 z-50 border-b border-zinc-800 shadow-lg">
                <div className="flex items-center gap-4 max-w-7xl mx-auto w-full">
                    <button
                        onClick={() => navigate('/')}
                        className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 group"
                    >
                        <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" /> Volver
                    </button>
                    <h1 className="text-2xl font-bold text-red-600 tracking-wider flex items-center gap-2">
                        <FaShoppingBag /> WARDOGS <span className="text-white">STORE</span>
                    </h1>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 py-12">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {products.map((product, index) => {
                        // Calcular precio socio (5 euros menos)
                        const precioSocio = product.precio - 5;
                        const hasImage = product.imagen;

                        return (
                            <div key={product._id} className="bg-[#111] border border-zinc-800 rounded-xl overflow-hidden hover:border-red-600 transition-all duration-300 group shadow-lg hover:shadow-red-900/10">
                                {/* Imagen */}
                                <div className="aspect-[4/3] bg-zinc-900 relative overflow-hidden flex items-center justify-center group">
                                    {hasImage ? (
                                        <img
                                            src={product.imagen.startsWith('/assets') ? product.imagen : `${BACKEND_URL}${product.imagen}`}
                                            alt={product.nombre}
                                            className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = 'https://via.placeholder.com/300x300?text=WARDOGS';
                                            }}
                                        />
                                    ) : (
                                        <img
                                            src={`/assets/tienda/c0${(index % 7) + 1}.png`}
                                            alt={product.nombre}
                                            className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = 'https://via.placeholder.com/300x300?text=WARDOGS';
                                            }}
                                        />
                                    )}
                                    {/* Badge Socio */}
                                    {precioSocio > 0 && (
                                        <div className="absolute top-4 right-4 bg-gradient-to-r from-red-600 to-red-700 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg border border-red-500/20">
                                            SOCIOS AHORRAN 5€
                                        </div>
                                    )}
                                </div>

                                {/* Contenido */}
                                <div className="p-6 space-y-4">
                                    <div>
                                        <h3 className="font-bold text-xl uppercase tracking-wide text-white group-hover:text-red-500 transition-colors">{product.nombre}</h3>
                                        <p className="text-sm text-gray-400 mt-1 line-clamp-2">{product.descripcion}</p>
                                    </div>

                                    {/* Precios */}
                                    <div className="flex flex-col gap-1 bg-zinc-900 p-3 rounded-lg border border-zinc-800">
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-400 text-sm">Precio General</span>
                                            <span className="text-lg font-bold text-white line-through decoration-red-500/50 decoration-2 opacity-70 scale-90 origin-right">{product.precio}€</span>
                                        </div>
                                        <div className="flex justify-between items-center border-t border-zinc-800 pt-1 mt-1">
                                            <span className="text-red-500 text-sm font-bold flex items-center gap-1"><FaTag /> SOCIOS</span>
                                            <span className="text-2xl font-extrabold text-white">{Math.max(0, precioSocio)}€</span>
                                        </div>
                                    </div>

                                    {/* Stock & Tallas */}
                                    <div className="text-xs text-gray-500 flex justify-between items-center bg-zinc-900/50 p-2 rounded">
                                        <span className="flex items-center gap-1"><FaTshirt /> {product.tallas && product.tallas.length > 0 ? product.tallas.join(', ') : 'N/A'}</span>
                                        <span className={`font-bold ${product.stock > 0 ? "text-green-500" : "text-red-500"}`}>
                                            {product.stock > 0 ? 'Disponible' : 'AGOTADO'}
                                        </span>
                                    </div>

                                    <button
                                        className={`w-full font-bold py-3 px-4 rounded-lg transition-all uppercase tracking-wide mt-2 flex items-center justify-center gap-2 ${product.stock > 0
                                            ? 'bg-white text-black hover:bg-gray-200 hover:scale-[1.02] active:scale-95 shadow-lg'
                                            : 'bg-zinc-800 text-gray-500 cursor-not-allowed'
                                            }`}
                                        disabled={product.stock <= 0}
                                        onClick={() => handleOrderClick(product)}
                                    >
                                        {product.stock > 0 ? (
                                            <>Solicitar Pedido <FaArrowLeft className="rotate-180" /></>
                                        ) : (
                                            <>Sin Stock <FaTimes /></>
                                        )}
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {!loading && products.length === 0 && (
                    <div className="text-center py-20 flex flex-col items-center gap-4">
                        <FaShoppingBag className="text-6xl text-zinc-800" />
                        <p className="text-gray-500 text-xl">No hay productos disponibles actualmente.</p>
                        <p className="text-gray-600 text-sm">Vuelve pronto para ver las novedades.</p>
                    </div>
                )}
            </main>

            {/* Modal de Pedido */}
            {isModalOpen && selectedProduct && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
                    <div className="bg-[#1a1a1a] border border-zinc-700 rounded-2xl w-full max-w-md p-6 relative shadow-2xl animate-scale-up">
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                        >
                            <FaTimes className="text-xl" />
                        </button>

                        <h2 className="text-2xl font-bold text-white mb-1 flex items-center gap-2"><FaShoppingBag className="text-red-600" /> Solicitud de Pedido</h2>
                        <p className="text-gray-400 text-sm mb-6 border-b border-zinc-800 pb-4">
                            Reservar: <strong className="text-white">{selectedProduct.nombre}</strong>
                        </p>

                        {!orderStatus && (
                            <form onSubmit={handleSubmitOrder} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">Nombre</label>
                                    <input
                                        type="text"
                                        name="nombre"
                                        required
                                        className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-3 text-white focus:border-red-600 focus:outline-none transition-colors placeholder-gray-600"
                                        placeholder="Tu nombre"
                                        value={orderForm.nombre}
                                        onChange={handleFormChange}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">Apellidos</label>
                                    <input
                                        type="text"
                                        name="apellidos"
                                        required
                                        className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-3 text-white focus:border-red-600 focus:outline-none transition-colors placeholder-gray-600"
                                        placeholder="Tus apellidos"
                                        value={orderForm.apellidos}
                                        onChange={handleFormChange}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">Talla Deseada</label>
                                    <div className="relative">
                                        <FaTshirt className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                                        <select
                                            name="talla"
                                            required
                                            className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-3 pl-10 text-white focus:border-red-600 focus:outline-none transition-colors appearance-none cursor-pointer hover:bg-zinc-800"
                                            value={orderForm.talla}
                                            onChange={handleFormChange}
                                        >
                                            <option value="" disabled>Selecciona una talla</option>
                                            {selectedProduct.tallas.map(t => (
                                                <option key={t} value={t}>{t}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="pt-4">
                                    <button
                                        type="submit"
                                        className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg transition-all shadow-lg shadow-red-900/20 hover:shadow-red-900/40 transform hover:-translate-y-0.5"
                                    >
                                        Enviar Solicitud
                                    </button>
                                </div>
                                <p className="text-xs text-center text-gray-500 mt-2 flex items-center justify-center gap-1">
                                    <FaInfoCircle /> El pago se realiza en el local al recoger.
                                </p>
                            </form>
                        )}

                        {orderStatus === 'sending' && (
                            <div className="py-12 flex flex-col items-center justify-center text-center">
                                <FaSpinner className="text-4xl text-red-600 animate-spin mb-4" />
                                <p className="text-white font-medium">Procesando solicitud...</p>
                            </div>
                        )}

                        {orderStatus === 'success' && (
                            <div className="py-8 flex flex-col items-center justify-center text-center animate-scale-up">
                                <div className="w-16 h-16 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center text-3xl mb-4 border border-green-500/20 shadow-lg shadow-green-900/20">
                                    <FaCheck />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">¡Solicitud Enviada!</h3>
                                <p className="text-gray-400 text-sm">Tu pedido ha sido registrado correctamente.</p>
                                <button
                                    onClick={() => { setIsModalOpen(false); setOrderStatus(null); }}
                                    className="mt-6 text-sm text-gray-400 hover:text-white underline"
                                >
                                    Cerrar ventana
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Shop;
