    import React, { useState, useRef } from 'react';
    import { useApp } from '../../context/AppContext';
    import { AppImage } from './AppImage';
    import { IonModal, IonButton } from '../ionic/IonicComponents';
    import { UserRole } from '../../types';

    interface AvatarUploadModalProps {
    isOpen: boolean;
    onClose: () => void;
    role?: UserRole;
    }

    const PRESET_AVATARS: Record<UserRole, Array<{ id: string; label: string; url: string }>> = {
    cliente: [
        {
        id: 'c1',
        label: 'Salvador',
        url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
        },
        {
        id: 'c2',
        label: 'Carlos',
        url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
        },
        {
        id: 'c3',
        label: 'Ana',
        url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80',
        },
        {
        id: 'c4',
        label: 'Mateo',
        url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
        },
        {
        id: 'c5',
        label: 'Sofía',
        url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&auto=format&fit=crop&q=80',
        },
        {
        id: 'c6',
        label: 'Diego',
        url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=80',
        },
    ],
    mecanico: [
        {
        id: 'm1',
        label: 'Carlos M. (Técnico)',
        url: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&auto=format&fit=crop&q=80',
        },
        {
        id: 'm2',
        label: 'Alejandro (Grúa)',
        url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80',
        },
        {
        id: 'm3',
        label: 'Jorge (Mecánica)',
        url: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=400&auto=format&fit=crop&q=80',
        },
        {
        id: 'm4',
        label: 'María F. (Taller)',
        url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80',
        },
        {
        id: 'm5',
        label: 'Roberto (Arrastre)',
        url: 'https://images.unsplash.com/photo-1628157582853-a796fa650a6a?w=400&auto=format&fit=crop&q=80',
        },
        {
        id: 'm6',
        label: 'Luis (Auxilio)',
        url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&auto=format&fit=crop&q=80',
        },
    ],
    admin: [
        {
        id: 'a1',
        label: 'Valeria (Torre)',
        url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
        },
        {
        id: 'a2',
        label: 'Fernando (Operaciones)',
        url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
        },
        {
        id: 'a3',
        label: 'Diana (Supervisora)',
        url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80',
        },
        {
        id: 'a4',
        label: 'Gabriel (Despacho)',
        url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
        },
    ],
    };

    export const AvatarUploadModal: React.FC<AvatarUploadModalProps> = ({
    isOpen,
    onClose,
    role = 'cliente',
    }) => {
    const { currentUser, updateUserProfile, showToast } = useApp();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [activeTab, setActiveTab] = useState<'upload' | 'presets' | 'url'>('upload');
    const [selectedAvatar, setSelectedAvatar] = useState<string>(currentUser.avatarUrl);
    const [customUrlInput, setCustomUrlInput] = useState<string>('');
    const [isDragging, setIsDragging] = useState<boolean>(false);
    const [fileName, setFileName] = useState<string>('');

    // Handle local file selection
    const processFile = (file: File) => {
        if (!file.type.startsWith('image/')) {
        showToast('Por favor selecciona un archivo de imagen válido', 'danger', 'error');
        return;
        }

        if (file.size > 5 * 1024 * 1024) {
        showToast('La imagen debe pesar menos de 5 MB', 'warning', 'warning');
        return;
        }

        setFileName(file.name);
        const reader = new FileReader();
        reader.onload = (e) => {
        if (e.target?.result) {
            setSelectedAvatar(e.target.result as string);
            showToast('Foto cargada. Haz clic en Guardar para aplicar los cambios.', 'primary', 'image');
        }
        };
        reader.readAsDataURL(file);
    };

    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
        processFile(file);
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files?.[0];
        if (file) {
        processFile(file);
        }
    };

    const handleApplyUrl = () => {
        if (!customUrlInput.trim()) return;
        setSelectedAvatar(customUrlInput.trim());
        showToast('Enlace de imagen cargado en la vista previa', 'primary', 'link');
    };

    const handleSave = () => {
        updateUserProfile({
        avatarUrl: selectedAvatar,
        });
        showToast('¡Foto de perfil actualizada con éxito!', 'success', 'check_circle');
        onClose();
    };

    const handleResetToDefault = () => {
        const defaultUrl = PRESET_AVATARS[role][0]?.url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80';
        setSelectedAvatar(defaultUrl);
        setFileName('');
        showToast('Foto restablecida a la predeterminada', 'primary', 'refresh');
    };

    const rolePresets = PRESET_AVATARS[role] || PRESET_AVATARS.cliente;

    return (
        <IonModal isOpen={isOpen} onDidDismiss={onClose} title="Cambiar Foto de Perfil">
        <div className="space-y-5">
            {/* Current / Selected Preview */}
            <div className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-2xl border border-slate-200">
            <div className="relative">
                <div className="w-24 h-24 rounded-full overflow-hidden border-3 border-blue-600 shadow-md bg-white">
                <AppImage
                    src={selectedAvatar}
                    alt="Vista previa"
                    type="avatar"
                    className="w-full h-full object-cover"
                />
                </div>
                <div className="absolute bottom-0 right-0 bg-blue-600 text-white w-7 h-7 rounded-full flex items-center justify-center shadow-xs border-2 border-white">
                <span className="material-symbols-outlined text-sm">photo_camera</span>
                </div>
            </div>

            <p className="font-bold text-sm text-slate-900 mt-2.5">
                {currentUser.name} {currentUser.lastName}
            </p>
            <span className="text-[11px] text-slate-500 font-medium">
                {fileName ? `Archivo: ${fileName}` : 'Vista previa de la nueva foto'}
            </span>
            </div>

            {/* Tab Navigation */}
            <div className="flex p-1 bg-slate-100 rounded-xl border border-slate-200 gap-1">
            <button
                type="button"
                onClick={() => setActiveTab('upload')}
                className={`flex-1 py-2 px-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'upload'
                    ? 'bg-white text-blue-600 shadow-2xs border border-slate-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
            >
                <span className="material-symbols-outlined text-sm">upload_file</span>
                Subir Archivo
            </button>

            <button
                type="button"
                onClick={() => setActiveTab('presets')}
                className={`flex-1 py-2 px-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'presets'
                    ? 'bg-white text-blue-600 shadow-2xs border border-slate-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
            >
                <span className="material-symbols-outlined text-sm">face</span>
                Galería ({rolePresets.length})
            </button>

            <button
                type="button"
                onClick={() => setActiveTab('url')}
                className={`flex-1 py-2 px-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'url'
                    ? 'bg-white text-blue-600 shadow-2xs border border-slate-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
            >
                <span className="material-symbols-outlined text-sm">link</span>
                Enlace URL
            </button>
            </div>

            {/* Tab 1: Local Upload & Drag/Drop */}
            {activeTab === 'upload' && (
            <div className="space-y-3">
                <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileInputChange}
                accept="image/*"
                className="hidden"
                />

                <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`p-6 rounded-2xl border-2 border-dashed text-center cursor-pointer transition-all ${
                    isDragging
                    ? 'border-blue-600 bg-blue-50/70 scale-[0.99]'
                    : 'border-slate-300 hover:border-blue-500 bg-slate-50 hover:bg-white'
                }`}
                >
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 mx-auto flex items-center justify-center mb-2 border border-blue-100">
                    <span className="material-symbols-outlined text-2xl">add_photo_alternate</span>
                </div>
                <p className="text-xs font-bold text-slate-800">
                    Haz clic para examinar o arrastra una imagen aquí
                </p>
                <p className="text-[11px] text-slate-400 mt-1">
                    Formatos permitidos: JPG, PNG, WEBP o GIF (máx. 5 MB)
                </p>

                <button
                    type="button"
                    className="mt-3 px-4 py-1.5 bg-blue-600 text-white rounded-xl text-xs font-semibold hover:bg-blue-700 transition-colors pointer-events-none inline-flex items-center gap-1.5 shadow-2xs"
                >
                    <span className="material-symbols-outlined text-sm">folder_open</span>
                    Seleccionar desde mi dispositivo
                </button>
                </div>
            </div>
            )}

            {/* Tab 2: Preset Avatars */}
            {activeTab === 'presets' && (
            <div className="space-y-2">
                <p className="text-xs text-slate-500 font-medium">
                Selecciona una fotografía prediseñada para tu perfil de {role === 'cliente' ? 'cliente' : role === 'mecanico' ? 'mecánico' : 'administrador'}:
                </p>
                <div className="grid grid-cols-3 gap-2.5 max-h-48 overflow-y-auto p-1">
                {rolePresets.map((preset) => {
                    const isSelected = selectedAvatar === preset.url;
                    return (
                    <button
                        type="button"
                        key={preset.id}
                        onClick={() => {
                        setSelectedAvatar(preset.url);
                        setFileName('');
                        }}
                        className={`p-2 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                        isSelected
                            ? 'border-blue-600 bg-blue-50/60 ring-2 ring-blue-500 shadow-2xs'
                            : 'border-slate-200 bg-white hover:border-slate-300'
                        }`}
                    >
                        <div className="w-12 h-12 rounded-full overflow-hidden border border-slate-200 relative">
                        <AppImage
                            src={preset.url}
                            alt={preset.label}
                            type="avatar"
                            className="w-full h-full object-cover"
                        />
                        {isSelected && (
                            <div className="absolute inset-0 bg-blue-600/30 flex items-center justify-center text-white">
                            <span className="material-symbols-outlined text-base font-bold">check</span>
                            </div>
                        )}
                        </div>
                        <span className="text-[10px] font-bold text-slate-700 truncate w-full">
                        {preset.label}
                        </span>
                    </button>
                    );
                })}
                </div>
            </div>
            )}

            {/* Tab 3: URL Direct Link */}
            {activeTab === 'url' && (
            <div className="space-y-3">
                <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Dirección web de la imagen (URL)
                </label>
                <div className="flex gap-2">
                    <input
                    type="url"
                    placeholder="https://ejemplo.com/mi-foto.jpg"
                    value={customUrlInput}
                    onChange={(e) => setCustomUrlInput(e.target.value)}
                    className="flex-1 px-3.5 h-11 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:border-blue-600 outline-none"
                    />
                    <button
                    type="button"
                    onClick={handleApplyUrl}
                    className="px-4 h-11 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors cursor-pointer"
                    >
                    Cargar
                    </button>
                </div>
                <p className="text-[10px] text-slate-400 mt-1">
                    Asegúrate de que el enlace termine en .jpg, .png o .webp y sea público.
                </p>
                </div>
            </div>
            )}

            {/* Action Buttons */}
            <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
            <div className="flex gap-2">
                <button
                type="button"
                onClick={handleResetToDefault}
                className="px-3.5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors cursor-pointer flex items-center gap-1"
                title="Restablecer foto predeterminada"
                >
                <span className="material-symbols-outlined text-sm">restart_alt</span>
                <span>Por defecto</span>
                </button>

                <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl hover:bg-slate-200 transition-colors cursor-pointer"
                >
                Cancelar
                </button>

                <button
                type="button"
                onClick={handleSave}
                className="flex-1 py-3 bg-blue-600 text-white font-bold text-xs rounded-xl shadow-sm hover:bg-blue-700 active:scale-98 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                <span className="material-symbols-outlined text-base">check</span>
                <span>Guardar Foto</span>
                </button>
            </div>
            </div>
        </div>
        </IonModal>
    );
    };
