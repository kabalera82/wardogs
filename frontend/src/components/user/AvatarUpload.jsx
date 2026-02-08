import React, { useState, useRef } from 'react';
import { BACKEND_URL } from '../../services/api';
import './AvatarUpload.css'; // Asumimos que crearemos estilos básicos

const AvatarUpload = ({ currentAvatar, onFileSelect, editMode = false }) => {
    const [preview, setPreview] = useState(null);
    const fileInputRef = useRef(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validar tipo y tamaño
            if (!file.type.match('image.*')) {
                alert('Solo se permiten imágenes');
                return;
            }
            if (file.size > 5 * 1024 * 1024) {
                alert('La imagen no puede superar 5MB');
                return;
            }

            // Crear preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
            };
            reader.readAsDataURL(file);

            // Notificar al padre
            onFileSelect(file);
        }
    };

    const handleClick = () => {
        if (editMode) {
            fileInputRef.current.click();
        }
    };

    // Determinar qué mostrar: preview local > avatar actual > placeholder
    const displayImage = preview || (currentAvatar ? `${BACKEND_URL}${currentAvatar}` : 'https://via.placeholder.com/150');

    return (
        <div className={`avatar-upload ${editMode ? 'editable' : ''}`} onClick={handleClick}>
            <div className="avatar-wrapper">
                <img src={displayImage} alt="Avatar de usuario" className="avatar-image" />
                {editMode && (
                    <div className="avatar-overlay">
                        <span>📷 Cambiar</span>
                    </div>
                )}
            </div>
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                style={{ display: 'none' }}
            />
        </div>
    );
};

export default AvatarUpload;
