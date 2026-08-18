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
    IonInput,
    IonTextarea,
    IonButton,
    IonSpinner,
} from '../../components/ionic/IonicComponents';

export const FinalizeServiceScreen: React.FC = () => {
    const { activeRequest, completeActiveService, navigateTo } = useApp();
    const [baseCost] = useState(350);
    const [extraCost, setExtraCost] = useState(50);
    const [extraConcept, setExtraConcept] = useState('Terminal de batería reforzada');
    const [notes, setNotes] = useState('Se realizó pase de corriente y limpieza de terminales sulfatadas.');
    const [photoUploaded, setPhotoUploaded] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

    const totalCost = baseCost + (Number(extraCost) || 0);

    const handleFinish = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setTimeout(() => {
        setIsLoading(false);
        completeActiveService(totalCost, 5);
        navigateTo('/mecanico/home');
        }, 1000);
    };

    return (
        <div className="min-h-screen flex flex-col bg-slate-50 pb-12">
        <IonHeader>
            <IonToolbar>
            <IonBackButton onClick={() => navigateTo('/mecanico/service-flow')} />
            <IonTitle>Finalizar Asistencia</IonTitle>
            </IonToolbar>
        </IonHeader>

        <IonContent className="max-w-lg mx-auto py-4">
            <div className="text-center mb-4">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl mx-auto flex items-center justify-center mb-2 border border-emerald-200">
                <span className="material-symbols-outlined text-2xl">task_alt</span>
            </div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Liquidación</span>
            <h2 className="text-xl font-bold text-slate-900">Cierre de Servicio</h2>
            <p className="text-xs text-slate-500">
                Ingresa los costos finales y adjunta la evidencia para liberar el pago.
            </p>
            </div>

            <IonCard>
            <IonCardContent className="p-5">
                <form onSubmit={handleFinish} className="space-y-4">
                {/* Service info summary */}
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between text-xs">
                    <div>
                    <p className="font-bold text-slate-900">
                        {activeRequest?.clientName || 'Salvador Hernández'}
                    </p>
                    <p className="text-slate-500">
                        {activeRequest?.vehicle.make || 'Tesla'} {activeRequest?.vehicle.model || 'Model 3'} (
                        {activeRequest?.vehicle.plate || 'ABC-1234'})
                    </p>
                    </div>
                    <span className="px-2.5 py-1 bg-yellow-400 text-slate-900 rounded-full font-bold text-[11px]">
                    {activeRequest?.issueTitle || 'Batería descargada'}
                    </span>
                </div>

                {/* Breakdown */}
                <div className="space-y-3 pt-2">
                    <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Desglose de Tarifas
                    </h3>

                    <div className="flex items-center justify-between text-xs py-1">
                    <span className="text-slate-500">Tarifa Base / Diagnóstico:</span>
                    <span className="font-bold text-slate-900">${baseCost} MXN</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                    <IonInput
                        label="Concepto Adicional"
                        placeholder="Refacción / Maniobra"
                        value={extraConcept}
                        onIonChange={(v) => setExtraConcept(v)}
                    />
                    <IonInput
                        label="Monto ($ MXN)"
                        type="number"
                        value={extraCost.toString()}
                        onIonChange={(v) => setExtraCost(Number(v) || 0)}
                    />
                    </div>

                    <div className="flex items-center justify-between p-3.5 bg-blue-50/60 rounded-xl border border-blue-200">
                    <span className="font-bold text-xs text-slate-900">Total a Cobrar:</span>
                    <span className="text-2xl font-bold text-blue-700">${totalCost} MXN</span>
                    </div>
                </div>

                {/* Notes */}
                <div>
                    <IonTextarea
                    label="Notas y Diagnóstico Final"
                    value={notes}
                    onIonChange={(v) => setNotes(v)}
                    rows={2}
                    />
                </div>

                {/* Photo Evidence */}
                <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                    Evidencia Fotográfica
                    </label>
                    {photoUploaded ? (
                    <div className="relative rounded-2xl overflow-hidden h-32 border border-slate-200">
                        <AppImage
                        src="https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=800&auto=format&fit=crop&q=60"
                        alt="Evidencia"
                        type="incident"
                        className="w-full h-full object-cover"
                        />
                        <span className="absolute bottom-2 left-2 bg-slate-900/80 text-white text-[10px] font-bold px-2 py-1 rounded">
                        ✓ Foto adjunta
                        </span>
                    </div>
                    ) : (
                    <div
                        onClick={() => setPhotoUploaded(true)}
                        className="border-2 border-dashed border-slate-200 rounded-2xl p-4 text-center cursor-pointer hover:bg-slate-50 transition-colors"
                    >
                        <span className="material-symbols-outlined text-2xl text-blue-600">add_a_photo</span>
                        <p className="text-xs font-bold text-slate-900 mt-1">Tomar foto del vehículo reparado</p>
                    </div>
                    )}
                </div>

                {/* Signature simulation */}
                <div className="pt-1">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                    Firma de Conformidad del Cliente
                    </label>
                    <div className="h-18 bg-white border border-slate-200 rounded-2xl flex items-center justify-center relative p-2">
                    <span className="font-cursive text-xl text-slate-800 italic select-none">
                        Salvador Hernández
                    </span>
                    <span className="absolute bottom-1 right-2 text-[9px] text-slate-400">
                        Firma digital verificada
                    </span>
                    </div>
                </div>

                <div className="pt-2">
                    <IonButton type="submit" expand="block" size="large" color="success" disabled={isLoading}>
                    {isLoading ? (
                        <div className="flex items-center gap-2">
                        <IonSpinner size={20} color="#ffffff" />
                        <span>Procesando cobro...</span>
                        </div>
                    ) : (
                        'Completar servicio y emitir cobro'
                    )}
                    </IonButton>
                </div>
                </form>
            </IonCardContent>
            </IonCard>
        </IonContent>
        </div>
    );
    };
