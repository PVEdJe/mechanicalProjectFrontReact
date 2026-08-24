import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { AppImage } from '../../components/shared/AppImage';
import {
  IonHeader, IonToolbar, IonTitle, IonBackButton, IonContent,
  IonCard, IonCardContent, IonButton, IonModal, IonInput,
} from '../../components/ionic/IonicComponents';

export const VehiclesScreen: React.FC = () => {
  const { navigateTo, showToast } = useApp();
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [vehiculos, setVehiculos] = useState<any[]>([]); 
  const [formData, setFormData] = useState({ make: '', model: '', year: '', color: '', plate: '' });

  const cargarVehiculos = async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) return;
      const payload = JSON.parse(atob(token.split('.')[1]));

      const res = await fetch(`http://localhost:3000/vehiculos/usuario/${payload.sub}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setVehiculos(data);
      }
    } catch (error) {
      console.error('Error al cargar vehículos', error);
    }
  };

  useEffect(() => {
    cargarVehiculos();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.make || !formData.model || !formData.plate) {
      showToast('Por favor completa todos los campos requeridos', 'warning');
      return;
    }

    try {
      const token = localStorage.getItem('access_token');
      const payload = JSON.parse(atob(token!.split('.')[1]));

      const res = await fetch('http://localhost:3000/vehiculos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          marca: formData.make,
          modelo: formData.model,
          anio: parseInt(formData.year) || 2024,
          color: formData.color,
          placas: formData.plate,
          userId: payload.sub 
        })
      });

      if (res.ok) {
        showToast('Vehículo agregado exitosamente', 'success', 'check_circle');
        setAddModalOpen(false);
        setFormData({ make: '', model: '', year: '', color: '', plate: '' });
        cargarVehiculos(); 
      } else {
        showToast('Error al guardar el vehículo', 'danger');
      }
    } catch (error) {
      showToast('Error de conexión', 'danger');
    }
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
          {vehiculos.length === 0 && (
            <p className="text-xs text-slate-500 text-center py-8">No tienes vehículos registrados aún.</p>
          )}
          {vehiculos.map((v) => (
            <IonCard key={v.id} className={v.esPrincipal ? 'border-blue-600 ring-1 ring-blue-600/30' : ''}>
              <IonCardContent className="p-4">
                <div className="flex gap-3.5 items-center">
                  <div className="w-14 h-14 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 shrink-0 overflow-hidden relative border border-slate-200">
                    <span className="material-symbols-outlined text-3xl">directions_car</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-sm text-slate-900 truncate">
                        {v.marca} {v.modelo}
                      </h3>
                      {v.esPrincipal && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                          Principal
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Año {v.anio} • {v.color}
                    </p>
                    <p className="text-xs font-mono font-bold text-slate-700 mt-1 bg-slate-100 inline-block px-2 py-0.5 rounded border border-slate-200">
                      {v.placas}
                    </p>
                  </div>
                </div>
              </IonCardContent>
            </IonCard>
          ))}
        </div>
      </IonContent>

      <IonModal isOpen={addModalOpen} onDidDismiss={() => setAddModalOpen(false)} title="Registrar Nuevo Vehículo">
        <form onSubmit={handleAdd} className="space-y-4">
          <IonInput label="Marca" placeholder="Ej. Nissan, Toyota" value={formData.make} onIonChange={(v) => setFormData({ ...formData, make: v as string })} required />
          <IonInput label="Modelo" placeholder="Ej. Versa, Corolla" value={formData.model} onIonChange={(v) => setFormData({ ...formData, model: v as string })} required />
          <div className="grid grid-cols-2 gap-3">
            <IonInput label="Año" type="number" placeholder="2024" value={formData.year} onIonChange={(v) => setFormData({ ...formData, year: v as string })} required />
            <IonInput label="Color" placeholder="Ej. Gris Plata" value={formData.color} onIonChange={(v) => setFormData({ ...formData, color: v as string })} required />
          </div>
          <IonInput label="Placas" placeholder="Ej. NXM-9201" value={formData.plate} onIonChange={(v) => setFormData({ ...formData, plate: v as string })} required />
          <IonButton type="submit" expand="block" size="large" className="mt-4">Guardar Vehículo</IonButton>
        </form>
      </IonModal>
    </div>
  );
};