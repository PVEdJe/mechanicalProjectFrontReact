import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { InteractiveMap } from '../../components/shared/InteractiveMap';
import { BottomSheet } from '../../components/shared/BottomSheet';
import {
  IonHeader, IonToolbar, IonTitle, IonBackButton, IonButton, IonModal, IonSpinner
} from '../../components/ionic/IonicComponents';

export const ServiceFlowScreen: React.FC = () => {
  const { navigateTo, showToast } = useApp();

  const [activeRescue, setActiveRescue] = useState<any>(null);
  const [clientInfo, setClientInfo] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [callModalOpen, setCallModalOpen] = useState(false);
  const [chatModalOpen, setChatModalOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { sender: 'mechanic', text: '¡Hola! Ya estoy en camino hacia tu punto.', time: '10:43 AM' }
  ]);

  useEffect(() => {
    const fetchActiveService = async () => {
      try {
        const rescueId = localStorage.getItem('active_mechanic_rescue_id');
        if (!rescueId) {
          navigateTo('/mecanico/home');
          return;
        }

        const token = localStorage.getItem('access_token');
        const res = await fetch(`http://localhost:3000/rescues/${rescueId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (res.ok) {
          const rescueData = await res.json();
          setActiveRescue(rescueData);

          const clientRes = await fetch(`http://localhost:3000/users/${rescueData.clientId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (clientRes.ok) {
            setClientInfo(await clientRes.json());
          }
        }
      } catch (error) {
        showToast('Error cargando la asistencia', 'danger');
      } finally {
        setIsLoading(false);
      }
    };

    fetchActiveService();
  }, []);

  const updateStatusInDB = async (newStatus: string) => {
    try {
      const token = localStorage.getItem('access_token');
      const rescueId = activeRescue.id;

      const res = await fetch(`http://localhost:3000/rescues/${rescueId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (res.ok) {
        setActiveRescue({ ...activeRescue, status: newStatus });
      } else {
         showToast('Error al actualizar estado', 'danger');
      }
    } catch (error) {
       showToast('Error de conexión', 'danger');
    }
  };

  const handleNextStatus = async () => {
    if (activeRescue?.status === 'ACCEPTED' || activeRescue?.status === 'EN_ROUTE') {
      await updateStatusInDB('ON_SITE');
      showToast('Estado actualizado: En el lugar del incidente', 'success', 'place');
    } else if (activeRescue?.status === 'ON_SITE') {
      await updateStatusInDB('IN_PROGRESS');
      showToast('Estado actualizado: Reparación iniciada', 'success', 'build');
    } else if (activeRescue?.status === 'IN_PROGRESS') {
      navigateTo('/mecanico/finalize');
    }
  };

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setChatMessages((prev) => [...prev, { sender: 'mechanic', text: chatInput, time: now }]);
    setChatInput('');
  };

  if (isLoading || !activeRescue) {
    return <div className="h-screen w-full flex items-center justify-center bg-slate-50"><IonSpinner /></div>;
  }

  const clientName = clientInfo ? `${clientInfo.firstName} ${clientInfo.lastName}` : 'Cliente';
  
  const displayStatus = (activeRescue.status === 'ACCEPTED' || activeRescue.status === 'EN_ROUTE')
    ? 'on_the_way'
    : (activeRescue.status === 'ON_SITE')
    ? 'arrived'
    : 'in_progress';

  return (
    <div className="relative w-full h-screen overflow-hidden flex flex-col bg-slate-50">
      {/* Navigation App Bar */}
      <IonHeader className="absolute top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <IonToolbar>
          <IonBackButton onClick={() => navigateTo('/mecanico/home')} />
          <IonTitle>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono bg-yellow-400 text-slate-900 px-2 py-0.5 rounded font-bold">
                {activeRescue.id.substring(0,6).toUpperCase()}
              </span>
              <span className="text-sm font-bold text-slate-900">Despacho en Vivo</span>
            </div>
          </IonTitle>
        </IonToolbar>
      </IonHeader>

      {/* Live Navigation Map */}
      <div className="flex-1 w-full h-full relative">
        <InteractiveMap showRoute={true} />
      </div>

      {/* Action Bottom Sheet for Mechanic */}
      <BottomSheet initialCollapsed={false}>
        <div className="space-y-3.5 pt-1">
          {/* Current Stage Indicator */}
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Fase de Asistencia
              </span>
              <h3 className="text-lg font-bold text-slate-900">
                {displayStatus === 'on_the_way'
                  ? 'En ruta hacia el cliente'
                  : displayStatus === 'arrived'
                  ? 'En el lugar del auxilio'
                  : 'Reparación / Diagnóstico'}
              </h3>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold ${
                displayStatus === 'on_the_way'
                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                  : displayStatus === 'arrived'
                  ? 'bg-yellow-50 text-yellow-800 border border-yellow-200'
                  : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              }`}
            >
              {displayStatus === 'on_the_way' ? 'En camino' : displayStatus === 'arrived' ? 'Arribado' : 'Trabajando'}
            </span>
          </div>

          {/* Client & Incident Card */}
          <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-200 text-slate-700 flex items-center justify-center font-bold">
                  <span className="material-symbols-outlined text-xl">person</span>
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900">{clientName}</h4>
                  <p className="text-xs text-slate-500">ID Unidad: {activeRescue.vehicleId.substring(0,8)}</p>
                </div>
              </div>

              {/* Call and chat icons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCallModalOpen(true)}
                  className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 active:scale-95 transition-all shadow-xs cursor-pointer"
                >
                  <span className="material-symbols-outlined text-lg">call</span>
                </button>
                <button
                  onClick={() => setChatModalOpen(true)}
                  className="w-9 h-9 rounded-xl bg-white border border-slate-200 text-slate-700 flex items-center justify-center hover:bg-slate-100 active:scale-95 transition-all shadow-xs cursor-pointer"
                >
                  <span className="material-symbols-outlined text-lg">chat</span>
                </button>
              </div>
            </div>

            {/* Address */}
            <div className="bg-white p-2.5 rounded-xl border border-slate-200 flex items-start gap-2 text-xs">
              <span className="material-symbols-outlined text-base text-blue-600">place</span>
              <div className="flex-1">
                <span className="font-bold text-slate-900 block">Coordenadas de Destino:</span>
                <span className="text-slate-500">{activeRescue.latitude}, {activeRescue.longitude}</span>
              </div>
            </div>

            {/* Issue Description */}
            <div className="p-2.5 bg-yellow-50/60 rounded-xl border border-yellow-200 text-xs">
              <div className="flex items-center gap-1.5 font-bold text-yellow-800 mb-0.5">
                <span className="material-symbols-outlined text-base">info</span>
                Reporte de Asistencia
              </div>
              <p className="text-slate-600">{activeRescue.description}</p>
            </div>
          </div>

          {/* Progression Buttons */}
          <div className="pt-1">
            {(displayStatus === 'on_the_way') && (
              <IonButton expand="block" size="large" onClick={handleNextStatus}>
                <span className="material-symbols-outlined text-xl">where_to_vote</span>
                He llegado al lugar
              </IonButton>
            )}

            {(displayStatus === 'arrived') && (
              <IonButton expand="block" size="large" onClick={handleNextStatus}>
                <span className="material-symbols-outlined text-xl">build</span>
                Iniciar Reparación
              </IonButton>
            )}

            {(displayStatus === 'in_progress') && (
              <IonButton expand="block" size="large" color="success" onClick={handleNextStatus}>
                <span className="material-symbols-outlined text-xl">task_alt</span>
                Finalizar Servicio y Cobrar
              </IonButton>
            )}
          </div>
        </div>
      </BottomSheet>

      {/* Modals de Llamada y Chat */}
      <IonModal isOpen={callModalOpen} onDidDismiss={() => setCallModalOpen(false)} title="Llamar a Cliente">
        <div className="text-center py-4 space-y-3">
          <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto">
            <span className="material-symbols-outlined text-2xl">call</span>
          </div>
          <h3 className="text-base font-bold text-slate-900">{clientName}</h3>
          <p className="text-xs text-slate-500">{clientInfo?.phone || '+52 00 0000 0000'}</p>
          <IonButton expand="block" size="default" onClick={() => setCallModalOpen(false)}>Cerrar</IonButton>
        </div>
      </IonModal>

      <IonModal isOpen={chatModalOpen} onDidDismiss={() => setChatModalOpen(false)} title={`Chat con ${clientName}`}>
        <div className="flex flex-col h-80">
          <div className="flex-1 overflow-y-auto space-y-2 p-2">
            {chatMessages.map((m, i) => (
              <div key={i} className={`flex flex-col ${m.sender === 'mechanic' ? 'items-end' : 'items-start'}`}>
                <div className={`p-3 rounded-2xl text-xs ${m.sender === 'mechanic' ? 'bg-blue-600 text-white rounded-br-none font-medium' : 'bg-slate-100 text-slate-900 rounded-bl-none border border-slate-200'}`}>
                  {m.text}
                </div>
                <span className="text-[10px] text-slate-400 mt-0.5">{m.time}</span>
              </div>
            ))}
          </div>
          <form onSubmit={handleSendChat} className="flex gap-2 pt-2 border-t border-slate-100">
            <input type="text" placeholder="Mensaje..." value={chatInput} onChange={(e) => setChatInput(e.target.value)} className="flex-1 h-10 px-3 rounded-xl bg-slate-50 text-xs border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600" />
            <button type="submit" className="px-4 bg-blue-600 text-white rounded-xl font-bold text-xs hover:bg-blue-700 cursor-pointer">Enviar</button>
          </form>
        </div>
      </IonModal>
    </div>
  );
};