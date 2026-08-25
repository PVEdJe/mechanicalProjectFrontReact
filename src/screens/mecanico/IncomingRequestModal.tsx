import React, { useEffect, useState } from 'react';
import { useApp } from '../../context/AppContext';

export const IncomingRequestModal: React.FC = () => {
  const {
    incomingOrderModal,
    setIncomingOrderModal,
    navigateTo,
    showToast,
  } = useApp();

  const [countdown, setCountdown] = useState(15);
  
  const [pendingRescue, setPendingRescue] = useState<any>(null);
  const [clientData, setClientData] = useState<any>(null); 
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!incomingOrderModal) {
      setCountdown(15);
      return;
    }

    const fetchPendingRescue = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const res = await fetch('http://localhost:3000/rescues/pending', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (res.ok) {
          const pendingRescues = await res.json();
        
          if (pendingRescues.length > 0) {
            const pending = pendingRescues[0];
            setPendingRescue(pending);
            
            // Buscar el nombre del cliente real
            const clientRes = await fetch(`http://localhost:3000/users/${pending.clientId}`, {
              headers: { 'Authorization': `Bearer ${token}` }
            });
            if (clientRes.ok) {
              const clientInfo = await clientRes.json();
              setClientData(clientInfo);
            }
          } else {
            showToast('No hay rescates cercanos en este momento', 'warning');
            setIncomingOrderModal(false);
          }
        }
      } catch (error) {
        console.error('Error al buscar rescates', error);
      }
    };

    fetchPendingRescue();

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIncomingOrderModal(false);
          showToast('Solicitud expirada', 'warning', 'timer_off');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [incomingOrderModal, setIncomingOrderModal, showToast]);

  if (!incomingOrderModal || !pendingRescue) return null;

  const handleAccept = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('access_token');
      const payload = JSON.parse(atob(token!.split('.')[1])); 
      const res = await fetch(`http://localhost:3000/rescues/${pendingRescue.id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          status: 'ACCEPTED',
          mechanicId: payload.sub 
        })
      });

      if (res.ok) {
        showToast('¡Rescate aceptado! Dirígete al punto.', 'success');
        setIncomingOrderModal(false);
        localStorage.setItem('active_mechanic_rescue_id', pendingRescue.id);
        navigateTo('/mecanico/service-flow');
      } else {
         showToast('Error al aceptar el servicio', 'danger');
      }
    } catch (error) {
      showToast('Error de conexión', 'danger');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReject = () => {
    setIncomingOrderModal(false);
    showToast('Solicitud rechazada', 'danger', 'cancel');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white text-slate-900 rounded-3xl p-5 shadow-2xl border border-slate-200 relative overflow-hidden flex flex-col gap-4">
        {/* Top Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-ping" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-blue-600">
              Nueva Solicitud de Auxilio
            </span>
          </div>

          {/* Countdown badge */}
          <div className="px-3 py-1 rounded-full bg-yellow-400 text-slate-900 font-bold text-xs">
            {countdown}s
          </div>
        </div>

        {/* Client Card */}
        <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-200 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Cliente</p>
              <h3 className="font-bold text-base text-slate-900">
                {clientData ? `${clientData.firstName} ${clientData.lastName}` : 'Cargando...'}
              </h3>
            </div>
            <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold">
              ★ {clientData?.rating ? Number(clientData.rating).toFixed(1) : '5.0'} (Nuevo)
            </span>
          </div>

          <div className="flex items-center gap-3 pt-2 border-t border-slate-200">
            <div className="w-9 h-9 rounded-xl bg-slate-200 text-slate-700 flex items-center justify-center font-bold shrink-0">
              <span className="material-symbols-outlined text-xl">directions_car</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-xs text-slate-900 truncate">Vehículo Registrado</p>
              <p className="text-[11px] text-slate-500">ID Unidad: {pendingRescue.vehicleId.substring(0,8)}...</p>
            </div>
          </div>
        </div>

        {/* Issue & Location Details */}
        <div className="grid grid-cols-2 gap-2.5">
          <div className="bg-slate-50 rounded-xl p-3 border border-slate-200">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Problema</p>
            <p className="text-xs font-bold text-slate-900 mt-0.5 flex items-center gap-1">
              <span className="material-symbols-outlined text-base text-yellow-600">report_problem</span>
              {pendingRescue.description.substring(0, 15)}...
            </p>
          </div>

          <div className="bg-slate-50 rounded-xl p-3 border border-slate-200">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Distancia / ETA</p>
            <p className="text-xs font-bold text-slate-900 mt-0.5 flex items-center gap-1">
              <span className="material-symbols-outlined text-base text-blue-600">near_me</span>
              2.4 km (8 min)
            </p>
          </div>
        </div>

        <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 text-xs">
          <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">Ubicación (GPS)</p>
          <p className="text-slate-800 font-medium mt-0.5 truncate">
            Lat: {pendingRescue.latitude}, Lng: {pendingRescue.longitude}
          </p>
        </div>

        {/* Payout Tag */}
        <div className="flex items-center justify-between bg-blue-50/70 p-3 rounded-2xl border border-blue-200">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-blue-700">Tarifa Estimada</p>
            <p className="text-[11px] text-slate-500">Sujeto a confirmación en sitio</p>
          </div>
          {/* 👇 LEYENDO EL COSTO ESTIMADO REAL DE LA BASE DE DATOS 👇 */}
          <p className="text-xl font-bold text-slate-900">
             ${pendingRescue.estimatedCost ? pendingRescue.estimatedCost : 350} MXN
          </p>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2.5 pt-1">
          <button
            onClick={handleReject}
            className="w-full py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-all active:scale-95 cursor-pointer"
          >
            Rechazar
          </button>

          <button
            onClick={handleAccept}
            disabled={isLoading}
            className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-200 transition-all active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            {isLoading ? (
              'Aceptando...'
            ) : (
              <>
                <span className="material-symbols-outlined text-base">check</span>
                ACEPTAR ({countdown}s)
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};