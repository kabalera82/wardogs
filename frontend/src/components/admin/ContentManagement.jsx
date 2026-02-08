import React, { useState, useEffect } from 'react';
import { contentService } from '../../services/contentService';
import { BACKEND_URL } from '../../services/api';
import ClassSchedule from '../ClassSchedule';
import { FaFistRaised, FaClock, FaTrash, FaPlus, FaSave, FaTimes, FaImage, FaCalendarDay } from 'react-icons/fa';

const ContentManagement = () => {
    const [activeTab, setActiveTab] = useState('fights'); // 'fights' | 'schedule'
    const [fights, setFights] = useState([]);
    const [schedule, setSchedule] = useState([]);
    const [loading, setLoading] = useState(true);
    const [msg, setMsg] = useState(null);

    // Form states
    const [fightForm, setFightForm] = useState({ luchador1: '', luchador2: '', fecha: '', imagen: null });
    const [scheduleForm, setScheduleForm] = useState({ dia: 'Lunes', horaInicio: '', horaFin: '', actividad: '', entrenador: '' });
    const [preview, setPreview] = useState(null);

    useEffect(() => {
        loadData();
    }, [activeTab]);

    const loadData = async () => {
        setLoading(true);
        try {
            if (activeTab === 'fights') {
                const res = await contentService.obtenerPeleas();
                if (res.success) setFights(res.data);
            } else {
                const res = await contentService.obtenerHorarios();
                if (res.success) setSchedule(res.data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleFightChange = (e) => {
        const { name, value } = e.target;
        setFightForm(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFightForm(prev => ({ ...prev, imagen: file }));
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleScheduleChange = (e) => {
        const { name, value } = e.target;
        setScheduleForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmitFight = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        Object.keys(fightForm).forEach(key => formData.append(key, fightForm[key]));

        try {
            await contentService.crearPelea(formData);
            setMsg({ type: 'success', text: 'Pelea creada exitosamente' });
            setFightForm({ luchador1: '', luchador2: '', fecha: '', imagen: null });
            setPreview(null);
            loadData();
        } catch (error) {
            setMsg({ type: 'error', text: 'Error al crear pelea' });
        }
    };

    const handleSubmitSchedule = async (e) => {
        e.preventDefault();
        try {
            await contentService.crearHorario(scheduleForm);
            setMsg({ type: 'success', text: 'Horario añadido exitosamente' });
            setScheduleForm({ dia: 'Lunes', horaInicio: '', horaFin: '', actividad: '', entrenador: '' });
            loadData();
        } catch (error) {
            setMsg({ type: 'error', text: 'Error al añadir horario' });
        }
    };

    const handleDelete = async (id, type) => {
        if (window.confirm('¿Eliminar este elemento?')) {
            try {
                if (type === 'fight') await contentService.eliminarPelea(id);
                else await contentService.eliminarHorario(id);
                loadData();
            } catch (error) {
                alert('Error al eliminar');
            }
        }
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white mb-6 border-b border-zinc-800 pb-2">Gestión de Contenido Home</h2>

            <div className="flex gap-4 mb-6">
                <button
                    onClick={() => setActiveTab('fights')}
                    className={`px-4 py-2 rounded-lg flex items-center gap-2 font-bold transition-colors ${activeTab === 'fights' ? 'bg-red-600 text-white' : 'bg-zinc-800 text-gray-400 hover:text-white'}`}
                >
                    <FaFistRaised /> Featured Fights
                </button>
                <button
                    onClick={() => setActiveTab('schedule')}
                    className={`px-4 py-2 rounded-lg flex items-center gap-2 font-bold transition-colors ${activeTab === 'schedule' ? 'bg-red-600 text-white' : 'bg-zinc-800 text-gray-400 hover:text-white'}`}
                >
                    <FaClock /> Horarios Clases
                </button>
            </div>

            {msg && <div className={`p-4 rounded-lg mb-4 ${msg.type === 'success' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>{msg.text}</div>}

            {activeTab === 'fights' ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Formulario Peleas */}
                    <div className="bg-[#1a1a1a] p-6 rounded-xl border border-zinc-800 h-fit">
                        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><FaPlus /> Nueva Pelea</h3>
                        <form onSubmit={handleSubmitFight} className="space-y-4">
                            <input type="text" name="luchador1" placeholder="Luchador 1" value={fightForm.luchador1} onChange={handleFightChange} required className="w-full bg-zinc-900 border border-zinc-700 rounded p-2 text-white" />
                            <div className="text-center text-gray-500 font-bold">VS</div>
                            <input type="text" name="luchador2" placeholder="Luchador 2" value={fightForm.luchador2} onChange={handleFightChange} required className="w-full bg-zinc-900 border border-zinc-700 rounded p-2 text-white" />
                            <input type="date" name="fecha" value={fightForm.fecha} onChange={handleFightChange} required className="w-full bg-zinc-900 border border-zinc-700 rounded p-2 text-white" />
                            <div className="border border-dashed border-zinc-700 p-4 rounded text-center cursor-pointer relative">
                                <input type="file" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                                <FaImage className="mx-auto text-gray-500" />
                                <span className="text-xs text-gray-500">Imagen Promo</span>
                            </div>
                            {preview && <img src={preview} alt="preview" className="w-full h-32 object-cover rounded" />}
                            <button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 rounded">Guardar Pelea</button>
                        </form>
                    </div>

                    {/* Lista Peleas */}
                    <div className="md:col-span-2 space-y-4">
                        {fights.map(fight => (
                            <div key={fight._id} className="bg-zinc-900 p-4 rounded-lg flex items-center justify-between border border-zinc-800">
                                <div className="flex items-center gap-4">
                                    {fight.imagen && <img src={`${BACKEND_URL}${fight.imagen}`} alt="promo" className="w-16 h-16 object-cover rounded" />}
                                    <div>
                                        <h4 className="font-bold text-white">{fight.luchador1} vs {fight.luchador2}</h4>
                                        <p className="text-sm text-gray-400">{new Date(fight.fecha).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <button onClick={() => handleDelete(fight._id, 'fight')} className="text-red-500 hover:text-red-400"><FaTrash /></button>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="mt-8">
                    <ClassSchedule initialAdminMode={true} />
                    <p className="mt-4 text-xs text-gray-500 italic">* Nota: La edición de horarios usando este nuevo panel visual se guarda localmente por ahora. La integración con base de datos llegará próximamente.</p>
                </div>
            )}
        </div>
    );
};

export default ContentManagement;
