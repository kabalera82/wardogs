import React, { useState, useEffect } from 'react';
import { eventService } from '../../services/eventService';
import { BACKEND_URL } from '../../services/api';
import './EventManagement.css';

const EventManagement = () => {
    const [eventos, setEventos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [msg, setMsg] = useState(null);
    const [newEvent, setNewEvent] = useState({
        titulo: '',
        fecha: '',
        ubicacion: '',
        descripcion: '',
        imagen: null
    });

    useEffect(() => {
        loadEvents();
    }, []);

    const loadEvents = async () => {
        try {
            const res = await eventService.obtenerEventos();
            if (res.success) {
                setEventos(res.data);
            }
        } catch (error) {
            console.error('Error cargando eventos:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewEvent(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        if (e.target.files[0]) {
            setNewEvent(prev => ({ ...prev, imagen: e.target.files[0] }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMsg(null);

        try {
            const formData = new FormData();
            formData.append('titulo', newEvent.titulo);
            formData.append('fecha', newEvent.fecha);
            formData.append('ubicacion', newEvent.ubicacion);
            formData.append('descripcion', newEvent.descripcion);
            formData.append('publicado', 'true');

            if (newEvent.imagen) {
                formData.append('imagen', newEvent.imagen);
            }

            const res = await eventService.crearEvento(formData);

            if (res.success) {
                setMsg({ type: 'success', text: 'Evento creado exitosamente' });
                setNewEvent({
                    titulo: '',
                    fecha: '',
                    ubicacion: '',
                    descripcion: '',
                    imagen: null
                });
                // Limpiar input file
                document.getElementById('event-image-input').value = '';
                loadEvents(); // Recargar lista
            }
        } catch (error) {
            setMsg({ type: 'error', text: error.message });
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('¿Estás seguro de eliminar este evento?')) {
            try {
                const res = await eventService.eliminarEvento(id);
                if (res.success) {
                    setEventos(prev => prev.filter(ev => ev._id !== id));
                    setMsg({ type: 'success', text: 'Evento eliminado' });
                }
            } catch (error) {
                setMsg({ type: 'error', text: error.message });
            }
        }
    };

    return (
        <div className="event-management">
            <h2>Gestión de Featured Fights</h2>

            {msg && <div className={`message ${msg.type}`}>{msg.text}</div>}

            <div className="event-dashboard-grid">
                {/* Formulario de Creación */}
                <div className="event-form-card">
                    <h3>Nuevo Evento</h3>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Título del Evento</label>
                            <input
                                type="text" name="titulo" required
                                value={newEvent.titulo} onChange={handleInputChange}
                                placeholder="Ej: WarDogs Championship 5"
                            />
                        </div>
                        <div className="form-group">
                            <label>Fecha</label>
                            <input
                                type="datetime-local" name="fecha" required
                                value={newEvent.fecha} onChange={handleInputChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>Ubicación</label>
                            <input
                                type="text" name="ubicacion" required
                                value={newEvent.ubicacion} onChange={handleInputChange}
                                placeholder="Ej: Arena Madrid"
                            />
                        </div>
                        <div className="form-group">
                            <label>Descripción</label>
                            <textarea
                                name="descripcion"
                                value={newEvent.descripcion} onChange={handleInputChange}
                                rows="3"
                            />
                        </div>
                        <div className="form-group">
                            <label>Imagen Promocional</label>
                            <input
                                type="file" id="event-image-input"
                                onChange={handleFileChange}
                                accept="image/*"
                            />
                        </div>
                        <button type="submit" className="btn-add-event" disabled={loading}>
                            {loading ? 'Procesando...' : '➕ Añadir Evento'}
                        </button>
                    </form>
                </div>

                {/* Lista de Eventos */}
                <div className="event-list-card">
                    <h3>Eventos Activos</h3>
                    {eventos.length === 0 ? (
                        <p className="no-events">No hay eventos registrados</p>
                    ) : (
                        <div className="events-scroll">
                            {eventos.map(evento => (
                                <div key={evento._id} className="event-item">
                                    <div className="event-item-img">
                                        {evento.imagen ? (
                                            <img src={`${BACKEND_URL}${evento.imagen}`} alt={evento.titulo} />
                                        ) : (
                                            <div className="placeholder-img">📷</div>
                                        )}
                                    </div>
                                    <div className="event-item-info">
                                        <h4>{evento.titulo}</h4>
                                        <p className="event-date">
                                            {new Date(evento.fecha).toLocaleDateString()}
                                        </p>
                                        <p className="event-location">📍 {evento.ubicacion}</p>
                                    </div>
                                    <button
                                        className="btn-delete-event"
                                        onClick={() => handleDelete(evento._id)}
                                        title="Eliminar Evento"
                                    >
                                        🗑️
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EventManagement;
