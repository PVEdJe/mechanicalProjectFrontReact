import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AppImage } from '../../components/shared/AppImage';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonBackButton,
  IonContent,
  IonCard,
  IonCardContent,
  IonButton,
  IonModal,
  IonInput,
} from '../../components/ionic/IonicComponents';

export const VehiclesScreen: React.FC = () => {
  const { vehicles, setPrimaryVehicle, addVehicle, removeVehicle, navigateTo, showToast } = useApp();
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    make: '',
    model: '',
    year: '2024',
    color: '',
    plate: '',
  });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.make || !formData.model || !formData.plate) {
      showToast('Por favor completa todos los campos requeridos', 'warning');
      return;
    }

    addVehicle({
      make: formData.make,
      model: formData.model,
      year: parseInt(formData.year) || 2024,
      color: formData.color || 'Color estándar',
      plate: formData.plate,
      imageUrl: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&auto=format&fit=crop&q=60',
      isPrimary: vehicles.length === 0,
    });

    setFormData({ make: '', model: '', year: '2024', color: '', plate: '' });
    setAddModalOpen(false);
    showToast('Vehículo agregado exitosamente', 'success', 'check_circle');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 pb-20">
      <IonHeader>
        <IonToolbar>
          <IonBackButton onClick={() => navigateTo('/cliente/home')} />
          <IonTitle>Mis Vehículos</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="max-w-md mx-auto py-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Garaje</span>
            <h2 className="text-lg font-bold text-slate-900">Vehículos Registrados</h2>
          </div>
          <button
            onClick={() => setAddModalOpen(true)}
            className="px-3.5 py-2 bg-blue-600 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-sm hover:bg-blue-700 active:scale-95 transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">add</span>
            Agregar
          </button>
        </div>

        <div className="space-y-3">
          {vehicles.map((v) => (
            <IonCard key={v.id} className={v.isPrimary ? 'border-blue-600 ring-1 ring-blue-600/30' : ''}>
              <IonCardContent className="p-4">
                <div className="flex gap-3.5 items-center">
                  <div className="w-14 h-14 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 shrink-0 overflow-hidden relative border border-slate-200">
                    <AppImage
                      src={v.imageUrl}
                      alt={`${v.make} ${v.model}`}
                      type="vehicle"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-sm text-slate-900 truncate">
                        {v.make} {v.model}
                      </h3>
                      {v.isPrimary && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                          Principal
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Año {v.year} • {v.color}
                    </p>
                    <p className="text-xs font-mono font-bold text-slate-700 mt-1 bg-slate-100 inline-block px-2 py-0.5 rounded border border-slate-200">
                      {v.plate}
                    </p>
                  </div>
                </div>

                <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-center justify-between">
                  {!v.isPrimary ? (
                    <button
                      onClick={() => setPrimaryVehicle(v.id)}
                      className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-sm">check_circle</span>
                      Establecer como principal
                    </button>
                  ) : (
                    <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm">verified</span>
                      Activo para solicitudes
                    </span>
                  )}

                  {vehicles.length > 1 && (
                    <button
                      onClick={() => removeVehicle(v.id)}
                      className="text-xs text-red-600 hover:text-red-700 p-1 cursor-pointer"
                      title="Eliminar vehículo"
                    >
                      <span className="material-symbols-outlined text-lg">delete</span>
                    </button>
                  )}
                </div>
              </IonCardContent>
            </IonCard>
          ))}
        </div>
      </IonContent>

      {/* Add Vehicle Modal */}
      <IonModal
        isOpen={addModalOpen}
        onDidDismiss={() => setAddModalOpen(false)}
        title="Registrar Nuevo Vehículo"
      >
        <form onSubmit={handleAdd} className="space-y-4">
          <IonInput
            label="Marca"
            placeholder="Ej. Nissan, Toyota, Honda"
            value={formData.make}
            onIonChange={(v) => setFormData({ ...formData, make: v })}
            required
          />
          <IonInput
            label="Modelo"
            placeholder="Ej. Versa, Corolla, Civic"
            value={formData.model}
            onIonChange={(v) => setFormData({ ...formData, model: v })}
            required
          />
          <div className="grid grid-cols-2 gap-3">
            <IonInput
              label="Año"
              type="number"
              placeholder="2024"
              value={formData.year}
              onIonChange={(v) => setFormData({ ...formData, year: v })}
              required
            />
            <IonInput
              label="Color"
              placeholder="Ej. Gris Plata"
              value={formData.color}
              onIonChange={(v) => setFormData({ ...formData, color: v })}
              required
            />
          </div>
          <IonInput
            label="Placas"
            placeholder="Ej. NXM-9201"
            value={formData.plate}
            onIonChange={(v) => setFormData({ ...formData, plate: v })}
            required
          />

          <IonButton type="submit" expand="block" size="large" className="mt-4">
            Guardar Vehículo
          </IonButton>
        </form>
      </IonModal>
    </div>
  );
};
