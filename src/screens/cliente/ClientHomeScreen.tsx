import React, { useState } from 'react';
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
  const { currentUser, vehicles, setPrimaryVehicle, navigateTo, createAssistanceRequest } = useApp();
  const [vehicleModalOpen, setVehicleModalOpen] = useState(false);

  const activeVehicle = vehicles.find((v) => v.isPrimary) || vehicles[0] || {
    id: 'v-1',
    make: 'Tesla',
    model: 'Model 3',
    color: 'Blanco',
    plate: 'ABC-1234',
  };

  const handleQuickRequest = (issueType: 'battery' | 'tire') => {
    createAssistanceRequest({
      issue: issueType,
      issueTitle: issueType === 'battery' ? 'Batería descargada' : 'Llanta ponchada',
      vehicle: activeVehicle,
      description: `Asistencia rápida para ${activeVehicle.make} ${activeVehicle.model}`,
    });
  };

  return (
    <div className="relative w-full h-screen overflow-hidden flex flex-col bg-slate-50">
      {/* Top App Bar */}
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
              title="Historial de solicitudes"
            >
              <span className="material-symbols-outlined text-2xl">notifications</span>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-600 rounded-full ring-2 ring-white" />
            </button>

            <button
              onClick={() => navigateTo('/cliente/profile')}
              className="cursor-pointer active:scale-95 transition-transform"
            >
              <IonAvatar size="sm" className="border border-slate-200">
                <AppImage
                  src={currentUser.avatarUrl}
                  alt={currentUser.name}
                  type="avatar"
                  className="w-full h-full object-cover"
                />
              </IonAvatar>
            </button>
          </div>
        </IonToolbar>
      </IonHeader>

      {/* Fullscreen Interactive Map */}
      <div className="flex-1 w-full h-full relative">
        <InteractiveMap showRoute={false} />

        {/* Floating Quick Access: Active Vehicle Badge */}
        <div className="absolute top-16 left-4 right-4 z-30 max-w-md mx-auto">
          <div className="bg-white/90 backdrop-blur-md rounded-2xl p-3 border border-slate-200 shadow-sm flex items-center justify-between gap-3">
            <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-700 shrink-0">
              <span className="material-symbols-outlined text-xl">directions_car</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest truncate">
                Vehículo Activo
              </p>
              <p className="text-sm font-bold text-slate-900 truncate">
                {activeVehicle.make} {activeVehicle.model} ({activeVehicle.color})
              </p>
            </div>
            <button
              onClick={() => setVehicleModalOpen(true)}
              className="p-2 text-slate-600 hover:text-blue-600 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
              title="Cambiar vehículo"
            >
              <span className="material-symbols-outlined text-xl">swap_horiz</span>
            </button>
          </div>
        </div>

        {/* Bottom Request Area Card */}
        <div className="absolute bottom-16 left-0 right-0 z-30 px-4 pb-4 max-w-md mx-auto">
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl border border-slate-200 shadow-[0_-10px_30px_rgba(0,0,0,0.08)] p-5 flex flex-col gap-3">
            <div className="w-12 h-1 bg-slate-200 rounded-full mx-auto mb-1" />

            <div className="text-center">
              <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">Auxilio Vial Inmediato</span>
              <h2 className="text-lg font-bold text-slate-900 mt-0.5">¿Necesitas asistencia?</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                4 unidades de auxilio vial activas en tu zona.
              </p>
            </div>

            {/* Primary Action Button */}
            <button
              onClick={() => navigateTo('/cliente/request')}
              className="w-full h-12 bg-blue-600 text-white font-bold text-xs md:text-sm rounded-xl flex items-center justify-center gap-2 shadow-md shadow-blue-200 hover:bg-blue-700 active:scale-[0.98] transition-all cursor-pointer uppercase tracking-wider"
            >
              <span className="material-symbols-outlined text-xl">car_repair</span>
              SOLICITAR AUXILIO VIAL
            </button>

            {/* Secondary Quick Action Buttons */}
            <div className="grid grid-cols-2 gap-2.5">
              <button
                onClick={() => handleQuickRequest('battery')}
                className="flex items-center justify-center gap-2 py-2.5 px-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 active:scale-95 transition-all text-xs font-semibold text-slate-800 shadow-2xs cursor-pointer"
              >
                <span className="material-symbols-outlined text-yellow-600 text-base">battery_alert</span>
                Sin Batería
              </button>

              <button
                onClick={() => handleQuickRequest('tire')}
                className="flex items-center justify-center gap-2 py-2.5 px-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 active:scale-95 transition-all text-xs font-semibold text-slate-800 shadow-2xs cursor-pointer"
              >
                <span className="material-symbols-outlined text-blue-600 text-base">tire_repair</span>
                Neumático
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Vehicle Selection Modal */}
      <IonModal
        isOpen={vehicleModalOpen}
        onDidDismiss={() => setVehicleModalOpen(false)}
        title="Seleccionar Vehículo Activo"
      >
        <div className="space-y-3">
          {vehicles.map((v) => {
            const isSelected = v.id === activeVehicle.id;
            return (
              <div
                key={v.id}
                onClick={() => {
                  setPrimaryVehicle(v.id);
                  setVehicleModalOpen(false);
                }}
                className={`p-3.5 rounded-2xl border flex items-center gap-3 cursor-pointer transition-all ${
                  isSelected
                    ? 'border-blue-600 bg-blue-50/60'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700">
                  <span className="material-symbols-outlined text-xl">directions_car</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-sm text-slate-900">
                    {v.make} {v.model} ({v.year})
                  </h4>
                  <p className="text-xs text-slate-500">
                    {v.color} • Placas: {v.plate}
                  </p>
                </div>
                {isSelected && (
                  <span className="material-symbols-outlined text-blue-600 text-xl">check_circle</span>
                )}
              </div>
            );
          })}

          <IonButton
            expand="block"
            fill="outline"
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
