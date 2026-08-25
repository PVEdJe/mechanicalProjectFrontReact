import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { InteractiveMap } from '../../components/shared/InteractiveMap';
import { BottomSheet } from '../../components/shared/BottomSheet';
import { AppImage } from '../../components/shared/AppImage';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonAvatar,
  IonModal,
  IonAlert,
} from '../../components/ionic/IonicComponents';

export const TrackingScreen: React.FC = () => {
  const { navigateTo, currentUser, showToast } = useApp();

  const [callModalOpen, setCallModalOpen] = useState(false);
  const [chatModalOpen, setChatModalOpen] = useState(false);
  const [cancelAlertOpen, setCancelAlertOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'user' | 'mechanic'; text: string; time: string }>>([
    {
      sender: 'mechanic',
      text: '¡Hola! Ya voy en camino con la grúa. Estoy a unos 8 minutos.',
      time: '10:43 AM',
    },
    {
      sender: 'user',
      text: 'Gracias, estoy en la lateral con las intermitentes puestas.',
      time: '10:44 AM',
    },
  ]);
  const [newMessage, setNewMessage] = useState('');
  
  const [realRescue, setRealRescue] = useState<any>(null);
  const [mechanicInfo, setMechanicInfo] = useState<any>(null);

  useEffect(() => {
    const rescueId = localStorage.getItem('client_active_rescue_id');
    if (!rescueId) return;

    const fetchRescueStatus = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const res = await fetch(`http://localhost:3000/rescues/${rescueId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (res.ok) {
          const data = await res.json();
          setRealRescue(data);

          if ((data.status === 'ACCEPTED' || data.status === 'EN_ROUTE' || data.status === 'ON_SITE') && data.mechanicId) {
            const mechRes = await fetch(`http://localhost:3000/users/${data.mechanicId}`, {
              headers: { 'Authorization': `Bearer ${token}` }
            });
            if (mechRes.ok) {
              const mechData = await mechRes.json();
              setMechanicInfo(mechData);
            }
          }

          if (data.status === 'COMPLETED') {
             showToast('¡Tu servicio ha finalizado con éxito!', 'success', 'task_alt');
             localStorage.removeItem('client_active_rescue_id');
             navigateTo('/cliente/home');
             return;
          }
        }
      } catch (error) {
        console.error('Error rastreando servicio', error);
      }
    };

    fetchRescueStatus();
    const interval = setInterval(fetchRescueStatus, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg = { sender: 'user' as const, text: newMessage, time: now };
    setChatMessages((prev) => [...prev, userMsg]);
    setNewMessage('');

    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        {
          sender: 'mechanic',
          text: 'Enterado, ya veo el punto en el GPS. Llego en un momento.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }, 1500);
  };

  const handleCancelService = async () => {
    try {
      const rescueId = localStorage.getItem('client_active_rescue_id');
      if (!rescueId) {
        navigateTo('/cliente/home');
        return;
      }

      const token = localStorage.getItem('access_token');
      const res = await fetch(`http://localhost:3000/rescues/${rescueId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: 'CANCELLED' })
      });

      if (res.ok) {
        localStorage.removeItem('client_active_rescue_id');
        showToast('Servicio cancelado exitosamente', 'danger');
        setCancelAlertOpen(false);
        navigateTo('/cliente/home');
      } else {
        showToast('Error al cancelar el servicio', 'danger');
      }
    } catch (error) {
      console.error(error);
      showToast('Error de conexión', 'danger');
    }
  };

  const req = {
    status: realRescue?.status || 'PENDING',
    etaMinutes: realRescue?.status === 'PENDING' ? '--' : (realRescue?.status === 'ON_SITE' ? 0 : 8),
    distanceKm: realRescue?.status === 'PENDING' ? '--' : 2.4,
    mechanic: mechanicInfo ? {
      name: `${mechanicInfo.firstName} ${mechanicInfo.lastName}`,
      phone: mechanicInfo.phone || '+52 55 0000 0000',
      avatar: mechanicInfo.avatarUrl || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&auto=format&fit=crop&q=80',
      vehicleType: mechanicInfo.especialidades?.split(',')[0] || 'Unidad de Rescate',
      vehicleModel: 'Vehículo Asignado',
      rating: 4.9,
      location: { lat: 19.395, lng: -99.168 },
    } : null
  };

  const isEnCamino = req.status === 'ACCEPTED' || req.status === 'EN_ROUTE';
  const isOnSite = req.status === 'ON_SITE';

  return (
    <div className="relative w-full h-screen overflow-hidden flex flex-col bg-slate-50">
      {/* Top App Bar */}
      <header className="fixed top-0 w-full z-50 flex justify-between items-center px-4 h-14 bg-white/80 backdrop-blur-md shadow-xs border-b border-slate-200">
        <button
          onClick={() => navigateTo('/cliente/home')}
          className="text-slate-700 hover:bg-slate-100 transition-colors p-2 rounded-full flex items-center justify-center active:scale-95 duration-100 cursor-pointer"
        >
          <span className="material-symbols-outlined text-2xl">arrow_back</span>
        </button>

        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-yellow-400 text-slate-900 rounded-lg flex items-center justify-center font-bold text-xs">
            AR
          </div>
          <h1 className="font-bold text-base text-slate-900 tracking-tight">AutoRescate</h1>
        </div>

        <div
          onClick={() => navigateTo('/cliente/profile')}
          className="w-9 h-9 rounded-full bg-slate-100 overflow-hidden flex items-center justify-center text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer border border-slate-200"
        >
          <img src={currentUser.avatarUrl} alt="User" className="w-full h-full object-cover" />
        </div>
      </header>

      {/* Fullscreen Interactive Map */}
      <div className="flex-1 w-full h-full relative">
        <InteractiveMap
          showRoute={!!req.mechanic}
          mechanicCoords={req.mechanic ? {
            lat: req.mechanic.location.lat,
            lng: req.mechanic.location.lng,
            name: req.mechanic.name,
            vehicle: req.mechanic.vehicleModel,
          } : undefined}
        />
      </div>

      {/* Bottom Sheet for Live Tracking */}
      <BottomSheet initialCollapsed={false}>
        <div className="pt-1 flex flex-col gap-4">
          
          {/* Si el mecánico aún NO ha aceptado */}
          {!req.mechanic ? (
            <div className="flex flex-col items-center justify-center py-6 animate-pulse">
              <div className="w-16 h-16 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mb-4 relative">
                <span className="material-symbols-outlined text-3xl">radar</span>
                <div className="absolute inset-0 rounded-full border-2 border-blue-600 animate-ping opacity-20"></div>
              </div>
              <h2 className="text-xl font-bold text-slate-900">Buscando técnico...</h2>
              <p className="text-xs text-slate-500 mt-1 text-center px-4">
                Estamos enviando tu ubicación a las unidades de auxilio más cercanas a ti.
              </p>
              <button
                onClick={() => setCancelAlertOpen(true)}
                className="mt-6 bg-white border border-red-200 text-red-600 px-6 py-2.5 rounded-full text-xs font-bold hover:bg-red-50 active:scale-95 transition-all cursor-pointer"
              >
                Cancelar Búsqueda
              </button>
            </div>
          ) : (
            <>
              {/* ETA & Status Header */}
              <div className="flex justify-between items-end">
                <div>
                  <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest block mb-0.5">
                    {isOnSite ? 'Mecánico en tu ubicación' : 'En camino'}
                  </span>
                  <div className="flex items-baseline gap-2">
                    <h2 className="text-2xl font-bold text-slate-900">{isOnSite ? 'Arribado' : `${req.etaMinutes} min`}</h2>
                    {!isOnSite && <span className="text-xs font-medium text-slate-400">• {req.distanceKm} km</span>}
                  </div>
                </div>
                <div className="bg-yellow-400 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-slate-900 shadow-2xs">
                  Prioritario
                </div>
              </div>

              {/* Mechanic Info Card */}
              <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-200 flex items-center gap-3.5">
                <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-slate-200 border border-slate-300 shrink-0">
                  <AppImage
                    src={req.mechanic.avatar}
                    alt={req.mechanic.name}
                    type="mechanic"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-sm text-slate-900 leading-tight truncate">
                      {req.mechanic.name}
                    </h3>
                    <span className="text-xs font-semibold text-yellow-600 flex items-center gap-0.5">
                      ★ {req.mechanic.rating}
                    </span>
                  </div>
                  <p className="text-[10px] font-medium text-slate-500 uppercase truncate mt-0.5">
                    {req.mechanic.vehicleType} • {req.mechanic.vehicleModel}
                  </p>
                </div>
              </div>

              {/* Quick Actions (Llamar, Mensaje, Cancelar) */}
              <div className="grid grid-cols-3 gap-2.5">
                <button
                  onClick={() => setCallModalOpen(true)}
                  className="bg-blue-600 text-white py-3 rounded-xl text-xs font-bold shadow-md shadow-blue-200 hover:bg-blue-700 active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-base">call</span>
                  Llamar
                </button>

                <button
                  onClick={() => setChatModalOpen(true)}
                  className="bg-white border border-slate-200 text-slate-700 py-3 rounded-xl text-xs font-bold hover:bg-slate-50 active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer relative"
                >
                  <span className="material-symbols-outlined text-base text-slate-600">chat</span>
                  Mensaje
                  <span className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
                </button>

                <button
                  onClick={() => setCancelAlertOpen(true)}
                  className="bg-white border border-red-200 text-red-600 py-3 rounded-xl text-xs font-bold hover:bg-red-50 active:scale-95 transition-all flex items-center justify-center gap-1 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-base">close</span>
                  Cancelar
                </button>
              </div>

              {/* Timeline of Service */}
              <div className="mt-2 mb-4 relative pl-5 border-l-2 border-slate-200 space-y-5">
                {/* Step 1: Accepted */}
                <div className="relative">
                  <div className="absolute -left-[27px] top-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white shadow-xs" />
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">Solicitud asignada</h4>
                      <p className="text-[11px] text-slate-500">{req.mechanic.name.split(' ')[0]} ha aceptado el auxilio.</p>
                    </div>
                  </div>
                </div>

                {/* Step 2: On the way */}
                <div className={`relative ${!isEnCamino && !isOnSite ? 'opacity-40' : ''}`}>
                  {isOnSite && <div className="absolute -left-[29px] -top-5 w-[2px] h-6 bg-emerald-500" />}
                  {isEnCamino && <div className="absolute -left-[29px] -top-5 w-[2px] h-6 bg-blue-600" />}
                  
                  {isEnCamino ? (
                    <div className="absolute -left-[31px] top-0 w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center pulse-halo">
                      <div className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                    </div>
                  ) : (
                    <div className="absolute -left-[27px] top-0.5 w-3.5 h-3.5 rounded-full border-2 border-white shadow-xs bg-emerald-500" />
                  )}
                  
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className={`text-xs font-bold ${isEnCamino ? 'text-blue-600' : 'text-slate-900'}`}>En camino</h4>
                      <p className="text-[11px] text-slate-500">Unidad de auxilio desplazándose.</p>
                    </div>
                  </div>
                </div>

                {/* Step 3: Arrived */}
                <div className={`relative ${!isOnSite ? 'opacity-40' : ''}`}>
                   {isOnSite && (
                    <div className="absolute -left-[31px] top-0 w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center pulse-halo">
                      <div className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                    </div>
                  )}
                  {!isOnSite && (
                    <div className="absolute -left-[27px] top-0.5 w-3.5 h-3.5 rounded-full bg-slate-300 border-2 border-white" />
                  )}
                  <div>
                    <h4 className={`text-xs font-bold ${isOnSite ? 'text-blue-600' : 'text-slate-700'}`}>En el lugar</h4>
                    <p className="text-[11px] text-slate-400">Inspección del vehículo en curso.</p>
                  </div>
                </div>

                {/* Step 4: Repair */}
                <div className="relative opacity-40">
                  <div className="absolute -left-[27px] top-0.5 w-3.5 h-3.5 rounded-full bg-slate-300 border-2 border-white" />
                  <div>
                    <h4 className="text-xs font-bold text-slate-700">Fase: Reparación en sitio</h4>
                    <p className="text-[11px] text-slate-400">Maniobras o diagnóstico en curso.</p>
                  </div>
                </div>

                {/* Step 5: Completed */}
                <div className="relative opacity-40">
                  <div className="absolute -left-[27px] top-0.5 w-3.5 h-3.5 rounded-full bg-slate-300 border-2 border-white" />
                  <div>
                    <h4 className="text-xs font-bold text-slate-700">Servicio finalizado</h4>
                    <p className="text-[11px] text-slate-400">Firma de conformidad y pago.</p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </BottomSheet>

      {/* Phone Call Modal */}
      <IonModal isOpen={callModalOpen} onDidDismiss={() => setCallModalOpen(false)} title="Llamada de Asistencia">
        <div className="text-center py-4 space-y-4">
          <div className="w-18 h-18 rounded-full overflow-hidden mx-auto border-3 border-yellow-400 shadow-md">
            <AppImage src={req.mechanic?.avatar} alt={req.mechanic?.name || 'Mechanic'} type="mechanic" className="w-full h-full object-cover" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">{req.mechanic?.name}</h3>
            <p className="text-xs font-semibold text-blue-600">{req.mechanic?.phone}</p>
            <p className="text-[11px] text-slate-400 mt-1">Conectando llamada protegida vía AutoRescate...</p>
          </div>
          <div className="flex justify-center gap-4 pt-3">
            <button
              onClick={() => { showToast('Llamada conectada', 'success', 'call'); setCallModalOpen(false); }}
              className="w-12 h-12 bg-emerald-600 text-white rounded-full flex items-center justify-center shadow-md hover:bg-emerald-700 active:scale-95 cursor-pointer"
            >
              <span className="material-symbols-outlined text-xl">call</span>
            </button>
            <button
              onClick={() => setCallModalOpen(false)}
              className="w-12 h-12 bg-red-600 text-white rounded-full flex items-center justify-center shadow-md hover:bg-red-700 active:scale-95 cursor-pointer"
            >
              <span className="material-symbols-outlined text-xl">call_end</span>
            </button>
          </div>
        </div>
      </IonModal>

      {/* In-App Chat Modal */}
      <IonModal isOpen={chatModalOpen} onDidDismiss={() => setChatModalOpen(false)} title={`Chat con ${req.mechanic?.name}`}>
        <div className="flex flex-col h-96">
          <div className="flex-1 overflow-y-auto space-y-3 p-2">
            {chatMessages.map((msg, idx) => (
              <div key={idx} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-2xl text-xs font-medium ${msg.sender === 'user' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-slate-100 text-slate-900 rounded-bl-none border border-slate-200'}`}>
                  <p>{msg.text}</p>
                </div>
                <span className="text-[10px] text-slate-400 mt-0.5 px-1">{msg.time}</span>
              </div>
            ))}
          </div>

          <form onSubmit={handleSendMessage} className="pt-3 flex gap-2 border-t border-slate-100">
            <input
              type="text" placeholder="Escribe un mensaje..." value={newMessage} onChange={(e) => setNewMessage(e.target.value)}
              className="flex-1 h-11 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            <button type="submit" className="h-11 px-4 bg-blue-600 text-white rounded-xl font-bold flex items-center justify-center shadow-sm hover:bg-blue-700 active:scale-95 cursor-pointer">
              <span className="material-symbols-outlined text-base">send</span>
            </button>
          </form>
        </div>
      </IonModal>

      {/* Cancel Service Alert */}
      <IonAlert
        isOpen={cancelAlertOpen}
        header="¿Cancelar Asistencia?"
        subHeader={req.mechanic ? "El mecánico ya se encuentra en camino" : "Buscando unidades..."}
        message="Si cancelas ahora, la unidad asignada será liberada para otras asistencias prioritarias."
        buttons={[
          { text: 'No cancelar', role: 'cancel' },
          { text: 'Sí, Cancelar', role: 'destructive', handler: handleCancelService },
        ]}
        onDidDismiss={() => setCancelAlertOpen(false)}
      />
    </div>
  );
};