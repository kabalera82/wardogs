import React, { useState } from 'react';
import { useUser } from '../hooks/useUser';

// Estilos de colores basados en tu imagen
const CLASS_TYPES = {
    fisico: { bg: '#00bcd4', text: '#fff', label: 'Físico (Azul)' },      // Cyan
    striking: { bg: '#ff5722', text: '#fff', label: 'Boxeo/Kick (Naranja)' }, // Naranja
    grappling: { bg: '#9c27b0', text: '#fff', label: 'Grappling (Morado)' }, // Morado
    kids: { bg: '#ff9800', text: '#fff', label: 'Kids (Amarillo)' },      // Amarillo
    junior: { bg: '#4caf50', text: '#fff', label: 'Junior (Verde)' },     // Verde
    judo: { bg: '#7986cb', text: '#fff', label: 'Judo (Índigo)' },        // Azul claro
    femenino: { bg: '#e91e63', text: '#fff', label: 'Femenino (Rosa)' },  // Rosa
    lucha: { bg: '#f44336', text: '#fff', label: 'Lucha (Rojo)' },        // Rojo
    empty: { bg: '#333333', text: '#555', label: 'Vacío' }                // Gris oscuro
};

// Datos iniciales basados en tu imagen (cargados manualmente como ejemplo)
const INITIAL_DATA = {
    lunes: [
        { id: 'l1', type: 'fisico', title: 'FÍSICO', time: '10:00 - 11:00' },
        { id: 'l2', type: 'striking', title: 'BOXEO MMA', time: '11:00 - 12:30' },
        { id: 'l3', type: 'empty', title: '', time: '' }, // Hueco vacío
        { id: 'l4', type: 'empty', title: '', time: '' },
        { id: 'l5', type: 'empty', title: '', time: '' },
        { id: 'l6', type: 'empty', title: '', time: '' },
        { id: 'l7', type: 'empty', title: '', time: '' },
        { id: 'l8', type: 'empty', title: '', time: '' },
    ],
    martes: [
        { id: 'm1', type: 'fisico', title: 'FÍSICO', time: '10:00 - 11:00' },
        { id: 'm2', type: 'grappling', title: 'GRAPPLING MMA', time: '11:00 - 12:30' },
        { id: 'm3', type: 'fisico', title: 'FÍSICO', time: '17:00 - 18:00' },
        { id: 'm4', type: 'striking', title: 'KICKBOXING MMA', time: '18:00 - 19:30' },
        { id: 'm5', type: 'kids', title: 'KIDS MMA', time: '19:30 - 20:30' },
        { id: 'm6', type: 'junior', title: 'JUNIOR MMA', time: '19:30 - 21:00' },
        { id: 'm7', type: 'empty', title: '', time: '' },
        { id: 'm8', type: 'striking', title: 'MUAY THAI MMA', time: '21:00 - 22:30' },
    ],
    miercoles: [
        { id: 'x1', type: 'fisico', title: 'FÍSICO', time: '10:00 - 11:00' },
        { id: 'x2', type: 'striking', title: 'BOXEO MMA', time: '11:00 - 12:30' },
        { id: 'x3', type: 'empty', title: '', time: '' },
        { id: 'x4', type: 'empty', title: '', time: '' },
        { id: 'x5', type: 'empty', title: '', time: '' },
        { id: 'x6', type: 'empty', title: '', time: '' },
        { id: 'x7', type: 'judo', title: 'JUDO', time: '20:00 - 21:30' },
        { id: 'x8', type: 'empty', title: '', time: '' },
    ],
    jueves: [
        { id: 'j1', type: 'fisico', title: 'FÍSICO', time: '10:00 - 11:00' },
        { id: 'j2', type: 'grappling', title: 'GRAPPLING MMA', time: '11:00 - 12:30' },
        { id: 'j3', type: 'fisico', title: 'FÍSICO', time: '17:00 - 18:00' },
        { id: 'j4', type: 'grappling', title: 'GRAPPLING MMA', time: '18:00 - 19:30' },
        { id: 'j5', type: 'kids', title: 'KIDS MMA', time: '19:30 - 20:30' },
        { id: 'j6', type: 'junior', title: 'JUNIOR MMA', time: '19:30 - 21:00' },
        { id: 'j7', type: 'empty', title: '', time: '' },
        { id: 'j8', type: 'grappling', title: 'GRAPPLING MMA', time: '21:00 - 22:30' },
    ],
    viernes: [
        { id: 'v1', type: 'empty', title: '', time: '' },
        { id: 'v2', type: 'empty', title: '', time: '' },
        { id: 'v3', type: 'empty', title: '', time: '' },
        { id: 'v4', type: 'empty', title: '', time: '' },
        { id: 'v5', type: 'empty', title: '', time: '' },
        { id: 'v6', type: 'empty', title: '', time: '' },
        { id: 'v7', type: 'judo', title: 'JUDO', time: '20:00 - 21:30' },
        { id: 'v8', type: 'empty', title: '', time: '' },
    ],
    sabado: [
        { id: 's1', type: 'femenino', title: 'FEMENINO MMA', time: '10:30 - 12:00' },
        { id: 's2', type: 'striking', title: 'SPARRING MMA', time: 'A partir de 12:00' },
        { id: 's3', type: 'lucha', title: 'LUCHA', time: 'A partir de 12:00' },
        { id: 's4', type: 'empty', title: '', time: '' },
        { id: 's5', type: 'empty', title: '', time: '' },
        { id: 's6', type: 'empty', title: '', time: '' },
        { id: 's7', type: 'empty', title: '', time: '' },
        { id: 's8', type: 'empty', title: '', time: '' },
    ]
};

const ClassSchedule = ({ initialAdminMode = false }) => {
    const { isAdmin } = useUser();
    const [schedule, setSchedule] = useState(INITIAL_DATA);
    const [isAdminMode, setIsAdminMode] = useState(initialAdminMode);
    const [editingSlot, setEditingSlot] = useState(null); // Slot seleccionado para editar

    const days = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'];
    const dayLabels = ['L', 'M', 'X', 'J', 'V', 'S'];

    // Guardar cambios del modal
    const handleSave = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const newTitle = formData.get('title');
        const newTime = formData.get('time');
        const newType = formData.get('type');

        setSchedule(prev => ({
            ...prev,
            [editingSlot.day]: prev[editingSlot.day].map(slot =>
                slot.id === editingSlot.id
                    ? { ...slot, title: newTitle, time: newTime, type: newType }
                    : slot
            )
        }));
        setEditingSlot(null);
    };

    // Función para guardar en Base de Datos (Simulada)
    const saveToDatabase = async () => {
        console.log("Guardando JSON en base de datos...", schedule);
        alert("Configuración guardada (Ver consola)");
        // Aquí harías: await axios.post('/api/horario', schedule);
    };

    const isUserAdmin = isAdmin(); // Calcular una vez

    return (
        <div className="bg-[#111] text-white p-4 rounded-xl border border-zinc-800 font-sans">

            {/* Panel de Control Admin (Solo si se habilita el prop o toggle interno) */}
            <div className="mb-5 p-3 border border-zinc-700 rounded-lg flex gap-4 items-center bg-zinc-900 justify-between">
                <h3 className="m-0 font-bold text-lg flex items-center gap-2">📅 Horario Wardogs</h3>

                {isUserAdmin && (
                    <div className="flex items-center gap-4">
                        <label className="flex items-center cursor-pointer gap-2 select-none">
                            <input
                                type="checkbox"
                                checked={isAdminMode}
                                onChange={(e) => setIsAdminMode(e.target.checked)}
                                className="accent-red-600 w-4 h-4"
                            />
                            <span className="text-sm text-gray-300">Modo Edición</span>
                        </label>
                        {isAdminMode && (
                            <button
                                onClick={saveToDatabase}
                                className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded text-sm font-bold transition-colors shadow-lg shadow-red-900/20"
                            >
                                Guardar Cambios
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Grid del Horario */}
            <div className="grid grid-cols-6 gap-1 text-center overflow-x-auto">
                {/* Cabeceras */}
                {dayLabels.map(day => (
                    <div key={day} className="font-bold p-2 text-lg bg-zinc-900 text-red-500 border-b-2 border-red-600 mb-2">{day}</div>
                ))}

                {/* Columnas de Días */}
                {days.map(day => (
                    <div key={day} className="flex flex-col gap-1 min-w-[100px]">
                        {schedule[day].map((slot) => {
                            const style = CLASS_TYPES[slot.type] || CLASS_TYPES.empty;
                            const isEmpty = slot.type === 'empty';

                            return (
                                <div
                                    key={slot.id}
                                    onClick={() => isAdminMode && setEditingSlot({ ...slot, day })}
                                    style={{
                                        backgroundColor: isEmpty ? '#1a1a1a' : style.bg,
                                        color: isEmpty ? '#333' : style.text,
                                        border: isAdminMode ? (isEmpty ? '1px dashed #444' : '1px solid transparent') : 'none',
                                    }}
                                    className={`
                    p-2 min-h-[80px] flex flex-col justify-center items-center rounded relative transition-all
                    ${isAdminMode ? 'cursor-pointer hover:brightness-110 hover:scale-[1.02] z-0 hover:z-10 shadow-sm' : ''}
                    ${isEmpty && !isAdminMode ? 'opacity-30' : 'opacity-100'}
                  `}
                                >
                                    {slot.title && <strong className="uppercase text-xs md:text-sm block mb-1 leading-tight">{slot.title}</strong>}
                                    {slot.time && <span className="text-[10px] md:text-xs opacity-90">{slot.time}</span>}

                                    {isAdminMode && isEmpty && <span className="text-xl text-zinc-700">+</span>}
                                </div>
                            );
                        })}
                    </div>
                ))}
            </div>

            {/* Modal de Edición */}
            {editingSlot && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex justify-center items-center z-[100] p-4 animate-fade-in">
                    <form onSubmit={handleSave} className="bg-[#1a1a1a] p-6 rounded-2xl w-full max-w-sm border border-zinc-700 shadow-2xl space-y-4 animate-scale-up">
                        <h3 className="m-0 text-xl font-bold flex items-center justify-between">
                            Editar Clase <span className="text-red-500 uppercase">{editingSlot.day}</span>
                        </h3>

                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Título de la clase</label>
                            <input name="title" defaultValue={editingSlot.title} className="w-full bg-zinc-900 border border-zinc-700 rounded p-2 text-white focus:border-red-600 focus:outline-none" placeholder="Ej: BOXEO" />
                        </div>

                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Horario</label>
                            <input name="time" defaultValue={editingSlot.time} className="w-full bg-zinc-900 border border-zinc-700 rounded p-2 text-white focus:border-red-600 focus:outline-none" placeholder="Ej: 10:00 - 11:30" />
                        </div>

                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Tipo / Color</label>
                            <select name="type" defaultValue={editingSlot.type} className="w-full bg-zinc-900 border border-zinc-700 rounded p-2 text-white focus:border-red-600 focus:outline-none">
                                {Object.entries(CLASS_TYPES).map(([key, val]) => (
                                    <option key={key} value={key}>{val.label}</option>
                                ))}
                            </select>
                        </div>

                        <div className="flex gap-2 pt-2">
                            <button type="button" onClick={() => setEditingSlot(null)} className="flex-1 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg font-bold transition-colors">Cancelar</button>
                            <button type="submit" className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold transition-colors">Guardar</button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default ClassSchedule;
