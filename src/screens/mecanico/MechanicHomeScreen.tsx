import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { InteractiveMap } from '../../components/shared/InteractiveMap';
import { AppImage } from '../../components/shared/AppImage';
import {
  IonHeader, IonToolbar, IonTitle, IonAvatar, IonToggle,
  IonCard, IonCardContent, IonButton, IonBadge,
} from '../../components/ionic/IonicComponents';

export const MechanicHomeScreen: React.FC = () => {
  const {
    isMechanicOnline,
    setIsMechanicOnline,
    activeRequest,
    navigateTo,
    setIncomingOrderModal,
  } = useApp();

  const [mechanicData, setMechanicData] = useState({
    firstName: 'Cargando...',
    lastName: '',
    avatarUrl: '',
  });
  const [vehicleData, setVehicleData] = useState({
    marca: '',
    modelo: '',
    placas: ''
  });

  useEffect(() => {
    const loadRealData = async () => {
      try {
        const token = localStorage.getItem('access_token');
        if (!token) return;
        const payload = JSON.parse(atob(token.split('.')[1]));

        // Buscar al usuario
        const userRes = await fetch(`http://localhost:3000/users/${payload.sub}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (userRes.ok) {
          const userData = await userRes.json();
          setMechanicData({
            firstName: userData.firstName || '',
            lastName: userData.lastName || '',
            avatarUrl: userData.avatarUrl || ''
          });
        }

        const vehRes = await fetch(`http://localhost:3000/vehiculos/usuario/${payload.sub}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (vehRes.ok) {
          const vehData = await vehRes.json();
          if (vehData.length > 0) {
            setVehicleData({
              marca: vehData[0].marca || 'Sin vehículo',
              modelo: vehData[0].modelo || '',
              placas: vehData[0].placas || 'Sin Placas'
            });
          }
        }
      } catch (error) {
        console.error('Error al cargar datos del mecánico:', error);
      }
    };

    loadRealData();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 pb-24">
      {/* Top Header */}
      <IonHeader className="bg-white/80 backdrop-blur-md border-b border-slate-200">
        <IonToolbar>
          <div
            onClick={() => navigateTo('/mecanico/profile')}
            className="flex items-center gap-3 cursor-pointer group active:scale-98 transition-transform"
          >
            <IonAvatar size="md" className="border border-slate-200 group-hover:border-blue-500 transition-colors flex items-center justify-center bg-slate-100">
              {mechanicData.avatarUrl ? (
                <AppImage src={mechanicData.avatarUrl} alt={mechanicData.firstName} type="mechanic" className="w-full h-full object-cover" />
              ) : (
                <span className="material-symbols-outlined text-slate-400">person</span>
              )}
            </IonAvatar>
            <div>
              <h2 className="font-bold text-sm text-slate-900 group-hover:text-blue-600 transition-colors">
                {mechanicData.firstName} {mechanicData.lastName}
              </h2>
              <p className="text-[10px] text-slate-400">
                {vehicleData.marca} {vehicleData.modelo} ({vehicleData.placas})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-200">
              <span className={`w-2 h-2 rounded-full ${isMechanicOnline ? 'bg-emerald-500 animate-ping' : 'bg-slate-400'}`} />
              <span className="text-xs font-semibold text-slate-700">
                {isMechanicOnline ? 'En Línea' : 'Pausa'}
              </span>
              <IonToggle checked={isMechanicOnline} onIonChange={setIsMechanicOnline} />
            </div>
          </div>
        </IonToolbar>
      </IonHeader>

      <div className="flex-1 max-w-2xl w-full mx-auto p-4 space-y-4">
        {/* Active Service In-Progress Alert Banner */}
        {activeRequest && (
          <div className="bg-slate-900 text-white p-4 rounded-2xl border border-slate-800 shadow-md flex items-center justify-between gap-3 animate-in fade-in">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
                <span className="material-symbols-outlined text-2xl animate-spin">autorenew</span>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-blue-400">Servicio Activo en Curso</span>
                <h3 className="font-bold text-sm text-white">{activeRequest.clientName} • {activeRequest.issueTitle}</h3>
                <p className="text-xs text-slate-400">Estado: <span className="text-blue-400 font-semibold">{activeRequest.status}</span></p>
              </div>
            </div>
            <button onClick={() => navigateTo('/mecanico/service-flow')} className="px-3.5 py-2 bg-blue-600 text-white rounded-xl font-bold text-xs flex items-center gap-1 shadow-sm hover:bg-blue-700 active:scale-95 transition-all cursor-pointer whitespace-nowrap">
              <span>Abrir Mapa</span>
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          </div>
        )}

        {/* Daily Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Ganancias Hoy</span>
            <p className="text-2xl font-bold text-slate-900 mt-1">$1,420</p>
            <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-0.5 mt-1">
              <span className="material-symbols-outlined text-xs">trending_up</span> +18%
            </span>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Servicios Hoy</span>
            <p className="text-2xl font-bold text-slate-900 mt-1">4</p>
            <span className="text-[10px] text-slate-400 font-medium mt-1">Meta: 6</span>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Calificación</span>
            <p className="text-2xl font-bold text-yellow-600 mt-1 flex items-center gap-1">4.9 <span className="text-sm">★</span></p>
            <span className="text-[10px] text-slate-400 font-medium mt-1">124 reseñas</span>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Turno Activo</span>
            <p className="text-2xl font-bold text-blue-600 mt-1">5.2 h</p>
            <span className="text-[10px] text-emerald-600 font-semibold mt-1">Óptimo</span>
          </div>
        </div>

        {/* Live Radar Area Preview */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-slate-900">Radar de Cobertura y Demanda</h3>
              <p className="text-xs text-slate-500">Radio operativo: 5 km • Zona activa: Del Valle / Condesa</p>
            </div>
            <button onClick={() => setIncomingOrderModal(true)} className="px-3 py-1.5 bg-yellow-400 text-slate-900 rounded-xl text-xs font-bold flex items-center gap-1 shadow-2xs hover:bg-yellow-300 active:scale-95 cursor-pointer">
              <span className="material-symbols-outlined text-sm">notification_important</span>
              Simular Solicitud
            </button>
          </div>
          <div className="w-full h-52 rounded-xl overflow-hidden border border-slate-200 relative">
            <InteractiveMap showRoute={false} />
          </div>
        </div>

        {/* Recent Service History for Mechanic */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs space-y-3">
          <h3 className="font-bold text-sm text-slate-900">Últimos Servicios Realizados</h3>
          <div className="space-y-2">
            {[
              { id: 'SR-3920', client: 'Mariana López', vehicle: 'Mazda CX-5', service: 'Paso de Corriente', time: 'Hace 1 hora', amount: '$350 MXN', rating: 5.0 },
              { id: 'SR-3918', client: 'Jorge Ortiz', vehicle: 'Volkswagen Golf', service: 'Grúa de Arrastre', time: 'Hace 3 horas', amount: '$750 MXN', rating: 4.8 },
              { id: 'SR-3912', client: 'Lucía Morales', vehicle: 'Honda Civic', service: 'Cambio de Neumático', time: 'Hace 5 horas', amount: '$320 MXN', rating: 5.0 },
            ].map((s) => (
              <div key={s.id} className="p-3 bg-slate-50 rounded-xl flex items-center justify-between gap-3 text-xs border border-slate-200">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-white text-emerald-600 flex items-center justify-center font-bold border border-slate-200">
                    <span className="material-symbols-outlined text-base">check_circle</span>
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">{s.client} ({s.vehicle})</p>
                    <p className="text-[11px] text-slate-500">{s.service} • {s.time}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-slate-900 text-sm">{s.amount}</p>
                  <p className="text-[10px] text-yellow-600 font-bold">★ {s.rating}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};