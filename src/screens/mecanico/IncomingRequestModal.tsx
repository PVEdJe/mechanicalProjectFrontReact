    import React, { useEffect, useState } from 'react';
    import { useApp } from '../../context/AppContext';

    export const IncomingRequestModal: React.FC = () => {
    const {
        incomingOrderModal,
        setIncomingOrderModal,
        acceptIncomingRequest,
        showToast,
    } = useApp();

    const [countdown, setCountdown] = useState(15);

    useEffect(() => {
        if (!incomingOrderModal) {
        setCountdown(15);
        return;
        }

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

    if (!incomingOrderModal) return null;

    const handleAccept = () => {
        acceptIncomingRequest();
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

            {/* Client & Vehicle Card */}
            <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
                <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Cliente</p>
                <h3 className="font-bold text-base text-slate-900">Salvador Hernández</h3>
                </div>
                <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold">
                ★ 4.9 (Verificado)
                </span>
            </div>

            <div className="flex items-center gap-3 pt-2 border-t border-slate-200">
                <div className="w-9 h-9 rounded-xl bg-slate-200 text-slate-700 flex items-center justify-center font-bold shrink-0">
                <span className="material-symbols-outlined text-xl">directions_car</span>
                </div>
                <div className="flex-1 min-w-0">
                <p className="font-bold text-xs text-slate-900 truncate">Tesla Model 3 (2023)</p>
                <p className="text-[11px] text-slate-500">Blanco Perla • Placas: ABC-1234</p>
                </div>
            </div>
            </div>

            {/* Issue & Location Details */}
            <div className="grid grid-cols-2 gap-2.5">
            <div className="bg-slate-50 rounded-xl p-3 border border-slate-200">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Problema</p>
                <p className="text-xs font-bold text-slate-900 mt-0.5 flex items-center gap-1">
                <span className="material-symbols-outlined text-base text-yellow-600">battery_alert</span>
                Sin Batería
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
            <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">Ubicación</p>
            <p className="text-slate-800 font-medium mt-0.5 truncate">
                Av. Insurgentes Sur 1024, Col. Del Valle
            </p>
            </div>

            {/* Payout Tag */}
            <div className="flex items-center justify-between bg-blue-50/70 p-3 rounded-2xl border border-blue-200">
            <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-blue-700">Tarifa Estimada</p>
                <p className="text-[11px] text-slate-500">Incluye diagnóstico y traslado</p>
            </div>
            <p className="text-xl font-bold text-slate-900">$350 MXN</p>
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
                className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-200 transition-all active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
            >
                <span className="material-symbols-outlined text-base">check</span>
                ACEPTAR ({countdown}s)
            </button>
            </div>
        </div>
        </div>
    );
    };
