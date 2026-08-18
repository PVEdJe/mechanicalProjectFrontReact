    import React, { useState } from 'react';
    import { useApp } from '../../context/AppContext';
    import { InteractiveMap } from '../../components/shared/InteractiveMap';
    import { BottomSheet } from '../../components/shared/BottomSheet';
    import {
    IonHeader,
    IonToolbar,
    IonTitle,
    IonBackButton,
    IonButton,
    IonModal,
    } from '../../components/ionic/IonicComponents';

    export const ServiceFlowScreen: React.FC = () => {
    const { activeRequest, updateServiceStatus, navigateTo, showToast } = useApp();
    const [callModalOpen, setCallModalOpen] = useState(false);
    const [chatModalOpen, setChatModalOpen] = useState(false);
    const [chatInput, setChatInput] = useState('');
    const [chatMessages, setChatMessages] = useState([
        { sender: 'mechanic', text: '¡Hola! Ya estoy en camino hacia tu punto.', time: '10:43 AM' },
        { sender: 'user', text: 'Excelente, estoy junto a la farmacia con intermitentes.', time: '10:44 AM' },
    ]);

    const req = activeRequest || {
        id: 'SR-4092',
        clientName: 'Salvador Hernández',
        vehicle: { make: 'Tesla', model: 'Model 3', color: 'Blanco Perla', plate: 'ABC-1234' },
        issueTitle: 'Batería descargada',
        description: 'El vehículo no arranca y se escucha un chasquido continuo en el encendido.',
        location: {
        address: 'Av. Insurgentes Sur 1024, Col. Del Valle',
        lat: 19.3824,
        lng: -99.1765,
        },
        status: 'on_the_way' as const,
        etaMinutes: 8,
        distanceKm: 2.4,
        estimatedCost: 350,
    };

    const handleNextStatus = () => {
        if (req.status === 'on_the_way' || req.status === 'accepted') {
        updateServiceStatus('arrived');
        showToast('Estado actualizado: En el lugar del incidente', 'success', 'place');
        } else if (req.status === 'arrived') {
        updateServiceStatus('in_progress');
        showToast('Estado actualizado: Reparación iniciada', 'success', 'build');
        } else if (req.status === 'in_progress') {
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

    return (
        <div className="relative w-full h-screen overflow-hidden flex flex-col bg-slate-50">
        {/* Navigation App Bar */}
        <IonHeader className="absolute top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200">
            <IonToolbar>
            <IonBackButton onClick={() => navigateTo('/mecanico/home')} />
            <IonTitle>
                <div className="flex items-center gap-2">
                <span className="text-xs font-mono bg-yellow-400 text-slate-900 px-2 py-0.5 rounded font-bold">
                    {req.id}
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
                    {req.status === 'on_the_way'
                    ? 'En ruta hacia el cliente'
                    : req.status === 'arrived'
                    ? 'En el lugar del auxilio'
                    : 'Reparación / Diagnóstico'}
                </h3>
                </div>

                <span
                className={`px-3 py-1 rounded-full text-xs font-bold ${
                    req.status === 'on_the_way'
                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                    : req.status === 'arrived'
                    ? 'bg-yellow-50 text-yellow-800 border border-yellow-200'
                    : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                }`}
                >
                {req.status === 'on_the_way' ? 'En camino' : req.status === 'arrived' ? 'Arribado' : 'Trabajando'}
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
                    <h4 className="font-bold text-sm text-slate-900">{req.clientName}</h4>
                    <p className="text-xs text-slate-500">{req.vehicle?.make} {req.vehicle?.model} ({req.vehicle?.plate})</p>
                    </div>
                </div>

                {/* Call and chat icons */}
                <div className="flex items-center gap-2">
                    <button
                    onClick={() => setCallModalOpen(true)}
                    className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 active:scale-95 transition-all shadow-xs cursor-pointer"
                    title="Llamar al cliente"
                    >
                    <span className="material-symbols-outlined text-lg">call</span>
                    </button>
                    <button
                    onClick={() => setChatModalOpen(true)}
                    className="w-9 h-9 rounded-xl bg-white border border-slate-200 text-slate-700 flex items-center justify-center hover:bg-slate-100 active:scale-95 transition-all shadow-xs cursor-pointer"
                    title="Mensaje al cliente"
                    >
                    <span className="material-symbols-outlined text-lg">chat</span>
                    </button>
                </div>
                </div>

                {/* Address */}
                <div className="bg-white p-2.5 rounded-xl border border-slate-200 flex items-start gap-2 text-xs">
                <span className="material-symbols-outlined text-base text-blue-600">place</span>
                <div className="flex-1">
                    <span className="font-bold text-slate-900 block">Dirección de Destino:</span>
                    <span className="text-slate-500">{req.location?.address || 'Av. Insurgentes Sur 1024, CDMX'}</span>
                </div>
                </div>

                {/* Issue Description */}
                <div className="p-2.5 bg-yellow-50/60 rounded-xl border border-yellow-200 text-xs">
                <div className="flex items-center gap-1.5 font-bold text-yellow-800 mb-0.5">
                    <span className="material-symbols-outlined text-base">info</span>
                    Reporte: {req.issueTitle}
                </div>
                <p className="text-slate-600">{req.description}</p>
                </div>
            </div>

            {/* Progression Button */}
            <div className="pt-1">
                {req.status === 'on_the_way' && (
                <IonButton expand="block" size="large" onClick={handleNextStatus}>
                    <span className="material-symbols-outlined text-xl">where_to_vote</span>
                    He llegado al lugar
                </IonButton>
                )}

                {req.status === 'arrived' && (
                <IonButton expand="block" size="large" onClick={handleNextStatus}>
                    <span className="material-symbols-outlined text-xl">build</span>
                    Iniciar Reparación
                </IonButton>
                )}

                {req.status === 'in_progress' && (
                <IonButton
                    expand="block"
                    size="large"
                    color="success"
                    onClick={handleNextStatus}
                >
                    <span className="material-symbols-outlined text-xl">task_alt</span>
                    Finalizar Servicio y Cobrar
                </IonButton>
                )}
            </div>
            </div>
        </BottomSheet>

        {/* Call Modal */}
        <IonModal isOpen={callModalOpen} onDidDismiss={() => setCallModalOpen(false)} title="Llamar a Cliente">
            <div className="text-center py-4 space-y-3">
            <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto">
                <span className="material-symbols-outlined text-2xl">call</span>
            </div>
            <h3 className="text-base font-bold text-slate-900">{req.clientName}</h3>
            <p className="text-xs text-slate-500">+52 55 4192 8830</p>
            <IonButton expand="block" size="default" onClick={() => setCallModalOpen(false)}>
                Cerrar
            </IonButton>
            </div>
        </IonModal>

        {/* Chat Modal */}
        <IonModal isOpen={chatModalOpen} onDidDismiss={() => setChatModalOpen(false)} title={`Chat con ${req.clientName}`}>
            <div className="flex flex-col h-80">
            <div className="flex-1 overflow-y-auto space-y-2 p-2">
                {chatMessages.map((m, i) => (
                <div key={i} className={`flex flex-col ${m.sender === 'mechanic' ? 'items-end' : 'items-start'}`}>
                    <div
                    className={`p-3 rounded-2xl text-xs ${
                        m.sender === 'mechanic'
                        ? 'bg-blue-600 text-white rounded-br-none font-medium'
                        : 'bg-slate-100 text-slate-900 rounded-bl-none border border-slate-200'
                    }`}
                    >
                    {m.text}
                    </div>
                    <span className="text-[10px] text-slate-400 mt-0.5">{m.time}</span>
                </div>
                ))}
            </div>

            <form onSubmit={handleSendChat} className="flex gap-2 pt-2 border-t border-slate-100">
                <input
                type="text"
                placeholder="Mensaje..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                className="flex-1 h-10 px-3 rounded-xl bg-slate-50 text-xs border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
                <button
                type="submit"
                className="px-4 bg-blue-600 text-white rounded-xl font-bold text-xs hover:bg-blue-700 cursor-pointer"
                >
                Enviar
                </button>
            </form>
            </div>
        </IonModal>
        </div>
    );
    };
    