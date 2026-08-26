import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { InteractiveMap } from '../../components/shared/InteractiveMap';
import { AppImage } from '../../components/shared/AppImage';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonAvatar,
  IonModal,
  IonButton,
} from '../../components/ionic/IonicComponents';

export const ClientHomeScreen: React.FC = () => {
  const { navigateTo, createAssistanceRequest, showToast } = useApp();
  const [vehicleModalOpen, setVehicleModalOpen] = useState(false);
  
  // Estados reales de la base de datos
  const [vehiculos, setVehiculos] = useState<any[]>([]);
  const [activeVehicle, setActiveVehicle] = useState<any>(null);
  
  const [clientData, setClientData] = useState({ avatarUrl: '' });

  const cargarDatos = async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) return;
      
      const payload = JSON.parse(atob(token.split('.')[1]));
      
      const userRes = await fetch(`http://localhost:3000/users/${payload.sub}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (userRes.ok) {
        const userData = await userRes.json();
        setClientData({ avatarUrl: userData.avatarUrl || '' });
      }

      const vehRes = await fetch(`http://localhost:3000/vehiculos/usuario/${payload.sub}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (vehRes.ok) {
        const data = await vehRes.json();
        setVehiculos(data);
        const principal = data.find((v: any) => v.esPrincipal) || data[0];
        setActiveVehicle(principal || null);
      }
    } catch (error) {
      console.error('Error al cargar datos:', error);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const handleSetPrincipal = async (id: string) => {
    try {
      const token = localStorage.getItem('access_token');
      const res = await fetch(`http://localhost:3000/vehiculos/${id}/principal`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (res.ok) {
        cargarDatos(); 
        setVehicleModalOpen(false);
        showToast('Vehículo activo actualizado', 'success', 'directions_car');
      }
    } catch (error) {
      showToast('Error al cambiar vehículo', 'danger');
    }
  };

  const handleQuickRequest = (issueType: 'battery' | 'tire') => {
    if (!activeVehicle) {
      showToast('Debes registrar un vehículo primero', 'warning');
      return;
    }
    createAssistanceRequest({
      issue: issueType,
      issueTitle: issueType === 'battery' ? 'Batería descargada' : 'Llanta ponchada',
      vehicle: activeVehicle,
      description: `Asistencia rápida para ${activeVehicle.marca} ${activeVehicle.modelo}`,
    });
  };

  return (
    <div className="relative w-full h-screen overflow-hidden flex flex-col bg-slate-50">
      <IonHeader className="absolute top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <IonToolbar>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-yellow-400 text-slate-900 rounded-lg flex items-center justify-center font-bold text-xs shadow-xs">
              AR
            </div>
            <IonTitle className="text-slate-900 font-bold">AutoRescate</IonTitle>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => navigateTo('/cliente/history')}
              className="relative p-2 rounded-full text-slate-500 hover:text-slate-900 hover:bg-slate-100 active:scale-95 transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-2xl">notifications</span>
            </button>

            <button
              onClick={() => navigateTo('/cliente/profile')}
              className="cursor-pointer active:scale-95 transition-transform"
            >
              <IonAvatar size="sm" className="border border-slate-200 overflow-hidden flex items-center justify-center bg-slate-100">
                {/* 👇 USAMOS LA FOTO REAL CARGADA DE LA BD 👇 */}
                {clientData.avatarUrl ? (
                  <AppImage
                    src={clientData.avatarUrl}
                    alt="Perfil"
                    type="avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="material-symbols-outlined text-slate-400">person</span>
                )}
              </IonAvatar>
            </button>
          </div>
        </IonToolbar>
      </IonHeader>

      <div className="flex-1 w-full h-full relative">
        <InteractiveMap showRoute={false} />

        {/* Badge Flotante del Vehículo Activo Real */}
        <div className="absolute top-16 left-4 right-4 z-30 max-w-md mx-auto">
          <div className="bg-white/90 backdrop-blur-md rounded-2xl p-3 border border-slate-200 shadow-sm flex items-center justify-between gap-3">
            <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-700 shrink-0">
              <span className="material-symbols-outlined text-xl">directions_car</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest truncate">
                Vehículo Activo
              </p>
              {activeVehicle ? (
                <p className="text-sm font-bold text-slate-900 truncate">
                  {activeVehicle.marca} {activeVehicle.modelo} ({activeVehicle.color})
                </p>
              ) : (
                <p className="text-sm font-bold text-red-500 truncate">
                  Sin vehículo registrado
                </p>
              )}
            </div>
            <button
              onClick={() => setVehicleModalOpen(true)}
              className="p-2 text-slate-600 hover:text-blue-600 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-xl">swap_horiz</span>
            </button>
          </div>
        </div>

        {/* Panel Inferior */}
        <div className="absolute bottom-16 left-0 right-0 z-30 px-4 pb-4 max-w-md mx-auto">
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl border border-slate-200 shadow-[0_-10px_30px_rgba(0,0,0,0.08)] p-5 flex flex-col gap-3">
            <div className="w-12 h-1 bg-slate-200 rounded-full mx-auto mb-1" />
            <div className="text-center">
              <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">Auxilio Vial Inmediato</span>
              <h2 className="text-lg font-bold text-slate-900 mt-0.5">¿Necesitas asistencia?</h2>
            </div>

            <button
              onClick={() => activeVehicle ? navigateTo('/cliente/request') : showToast('Registra un vehículo primero', 'warning')}
              className="w-full h-12 bg-blue-600 text-white font-bold text-xs md:text-sm rounded-xl flex items-center justify-center gap-2 shadow-md shadow-blue-200 hover:bg-blue-700 active:scale-[0.98] transition-all cursor-pointer uppercase tracking-wider"
            >
              <span className="material-symbols-outlined text-xl">car_repair</span>
              SOLICITAR AUXILIO VIAL
            </button>
          </div>
        </div>
      </div>

      {/* Modal Real de Selección de Vehículo */}
      <IonModal isOpen={vehicleModalOpen} onDidDismiss={() => setVehicleModalOpen(false)} title="Seleccionar Vehículo Activo">
        <div className="space-y-3">
          {vehiculos.length === 0 && (
            <p className="text-center text-xs text-slate-500 py-4">No tienes vehículos registrados.</p>
          )}
          
          {vehiculos.map((v) => {
            const isSelected = activeVehicle && v.id === activeVehicle.id;
            return (
              <div
                key={v.id}
                onClick={() => handleSetPrincipal(v.id)}
                className={`p-3.5 rounded-2xl border flex items-center gap-3 cursor-pointer transition-all ${
                  isSelected ? 'border-blue-600 bg-blue-50/60' : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700">
                  <span className="material-symbols-outlined text-xl">directions_car</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-sm text-slate-900">
                    {v.marca} {v.modelo} ({v.anio})
                  </h4>
                  <p className="text-xs text-slate-500">
                    {v.color} • Placas: {v.placas}
                  </p>
                </div>
                {isSelected && (
                  <span className="material-symbols-outlined text-blue-600 text-xl">check_circle</span>
                )}
              </div>
            );
          })}

          <IonButton
            expand="block" fill="outline"
            onClick={() => {
              setVehicleModalOpen(false);
              navigateTo('/cliente/vehicles');
            }}
            className="mt-4"
          >
            + Gestionar garaje de vehículos
          </IonButton>
        </div>
      </IonModal>
    </div>
  );
};