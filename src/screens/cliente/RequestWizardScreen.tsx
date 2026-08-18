import React, { useState } from 'react';
import { useApp, ISSUE_OPTIONS } from '../../context/AppContext';
import { IssueType, IssueOption } from '../../types';
import { InteractiveMap } from '../../components/shared/InteractiveMap';
import { AppImage } from '../../components/shared/AppImage';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonBackButton,
  IonContent,
  IonCard,
  IonCardContent,
  IonButton,
  IonTextarea,
  IonProgressBar,
} from '../../components/ionic/IonicComponents';

export const RequestWizardScreen: React.FC = () => {
  const { navigateTo, vehicles, createAssistanceRequest } = useApp();
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);

  // Form states
  const activeVehicle = vehicles.find((v) => v.isPrimary) || vehicles[0];
  const [selectedIssue, setSelectedIssue] = useState<IssueOption>(ISSUE_OPTIONS[0]);
  const [address, setAddress] = useState<string>('Av. Insurgentes Sur 1024, Col. Del Valle');
  const [coordinates, setCoordinates] = useState<string>('19.3824° N, 99.1765° W');
  const [description, setDescription] = useState<string>(
    'El vehículo no arranca y se escucha un chasquido continuo en el encendido.'
  );
  const [photoUrl, setPhotoUrl] = useState<string | undefined>(
    'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&auto=format&fit=crop&q=60'
  );

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep((prev) => (prev + 1) as 1 | 2 | 3 | 4);
    } else {
      // Final confirmation
      createAssistanceRequest({
        vehicle: activeVehicle,
        issue: selectedIssue.id,
        issueTitle: selectedIssue.title,
        description,
        photoUrl,
        location: {
          address,
          city: 'Ciudad de México',
          lat: 19.3824,
          lng: -99.1765,
        },
      });
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as 1 | 2 | 3 | 4);
    } else {
      navigateTo('/cliente/home');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <IonHeader>
        <IonToolbar>
          <IonBackButton onClick={handleBack} />
          <IonTitle>Solicitar Asistencia</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="max-w-xl mx-auto py-4">
        {/* Stepper Progress Bar */}
        <div className="mb-6 px-2">
          <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">
            <span className={currentStep >= 1 ? 'text-blue-600' : ''}>1. Ubicación</span>
            <span className={currentStep >= 2 ? 'text-blue-600' : ''}>2. Problema</span>
            <span className={currentStep >= 3 ? 'text-blue-600' : ''}>3. Detalles</span>
            <span className={currentStep >= 4 ? 'text-blue-600' : ''}>4. Confirmar</span>
          </div>
          <IonProgressBar value={currentStep / 4} color="#2563eb" className="h-1.5" />
        </div>

        {/* STEP 1: Confirm Location */}
        {currentStep === 1 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="text-center mb-2">
              <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">Paso 1 de 4</span>
              <h2 className="text-xl font-bold text-slate-900 mt-0.5">Confirma tu ubicación</h2>
              <p className="text-xs text-slate-500">
                Asegúrate de que el pin en el mapa coincida con la posición exacta de tu vehículo.
              </p>
            </div>

            <div className="w-full h-64 rounded-2xl overflow-hidden shadow-xs border border-slate-200 relative">
              <InteractiveMap showRoute={false} />
            </div>

            <IonCard>
              <IonCardContent className="p-4 space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-lg">location_on</span>
                  </div>
                  <div className="flex-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
                      Dirección Detectada por GPS
                    </label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full font-semibold text-sm text-slate-900 bg-transparent border-b border-slate-200 py-1 focus:outline-none focus:border-blue-600"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-100">
                  <span className="flex items-center gap-1 font-mono text-[11px]">
                    <span className="material-symbols-outlined text-sm text-blue-600">satellite_alt</span>
                    {coordinates}
                  </span>
                  <span className="text-emerald-600 font-bold text-[11px]">Precisión ± 3m</span>
                </div>
              </IonCardContent>
            </IonCard>

            <IonButton expand="block" size="large" onClick={handleNext}>
              Confirmar ubicación y continuar
            </IonButton>
          </div>
        )}

        {/* STEP 2: Select Issue */}
        {currentStep === 2 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            {/* Selected Vehicle Context */}
            <div className="bg-white rounded-2xl p-3.5 shadow-xs border border-slate-200 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700 shrink-0">
                <span className="material-symbols-outlined text-xl">directions_car</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Vehículo asignado</p>
                <h3 className="font-bold text-sm text-slate-900">
                  {activeVehicle.make} {activeVehicle.model} ({activeVehicle.year})
                </h3>
                <p className="text-xs text-slate-500">
                  {activeVehicle.color} • Placas: {activeVehicle.plate}
                </p>
              </div>
            </div>

            <div className="text-center">
              <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">Paso 2 de 4</span>
              <h2 className="text-xl font-bold text-slate-900 mt-0.5">Selecciona el tipo de falla</h2>
              <p className="text-xs text-slate-500">
                Identifica el problema para asignar la unidad y herramientas idóneas.
              </p>
            </div>

            {/* 8 Issue Cards Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
              {ISSUE_OPTIONS.map((opt) => {
                const isSelected = selectedIssue.id === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setSelectedIssue(opt)}
                    className={`p-3.5 rounded-2xl border flex flex-col items-center justify-center text-center gap-2 transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-blue-50/70 border-blue-600 shadow-xs'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div
                      className={`w-11 h-11 rounded-full flex items-center justify-center transition-colors ${
                        isSelected
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      <span className="material-symbols-outlined text-xl">{opt.icon}</span>
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-900 block leading-tight">
                        {opt.title}
                      </span>
                      <span className="text-[10px] font-semibold text-slate-400 mt-0.5 block">
                        Desde ${opt.suggestedCost} MXN
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            <IonButton expand="block" size="large" onClick={handleNext}>
              Continuar con {selectedIssue.title}
            </IonButton>
          </div>
        )}

        {/* STEP 3: Description & Photo */}
        {currentStep === 3 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="text-center mb-2">
              <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">Paso 3 de 4</span>
              <h2 className="text-xl font-bold text-slate-900 mt-0.5">Describe la situación</h2>
              <p className="text-xs text-slate-500">
                Proporciona detalles para que el técnico acuda con los repuestos específicos.
              </p>
            </div>

            <IonCard>
              <IonCardContent className="p-5 space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                    ¿Qué síntomas presenta el auto?
                  </label>
                  <IonTextarea
                    placeholder="Ej. Me detuve en la lateral y se apagó el tablero, no enciende..."
                    value={description}
                    onIonChange={(v) => setDescription(v)}
                    rows={4}
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                    Fotografía del daño / vehículo (Opcional)
                  </label>

                  {photoUrl ? (
                    <div className="relative rounded-2xl overflow-hidden h-36 border border-slate-200">
                      <AppImage
                        src={photoUrl}
                        alt="Foto incidencia"
                        type="incident"
                        className="w-full h-full object-cover"
                      />
                      <button
                        onClick={() => setPhotoUrl(undefined)}
                        className="absolute top-2 right-2 bg-slate-900/70 text-white p-1 rounded-full hover:bg-slate-900 cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-base">close</span>
                      </button>
                    </div>
                  ) : (
                    <div
                      onClick={() =>
                        setPhotoUrl(
                          'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&auto=format&fit=crop&q=60'
                        )
                      }
                      className="border-2 border-dashed border-slate-200 rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-slate-50 transition-colors"
                    >
                      <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 mb-2">
                        <span className="material-symbols-outlined text-xl">add_a_photo</span>
                      </div>
                      <span className="text-xs font-bold text-slate-800">Tocar para subir fotografía</span>
                      <span className="text-[10px] text-slate-400 mt-0.5">JPG, PNG hasta 10MB</span>
                    </div>
                  )}
                </div>
              </IonCardContent>
            </IonCard>

            <IonButton expand="block" size="large" onClick={handleNext}>
              Revisar y Confirmar Solicitud
            </IonButton>
          </div>
        )}

        {/* STEP 4: Confirmation & Summary */}
        {currentStep === 4 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="text-center mb-2">
              <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">Paso 4 de 4</span>
              <h2 className="text-xl font-bold text-slate-900 mt-0.5">Confirmación de Solicitud</h2>
              <p className="text-xs text-slate-500">
                Verifica los datos antes de emitir la señal a los técnicos cercanos.
              </p>
            </div>

            <IonCard>
              <IonCardContent className="p-5 space-y-4 divide-y divide-slate-100">
                {/* Vehicle summary */}
                <div className="flex items-center justify-between pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700">
                      <span className="material-symbols-outlined text-xl">directions_car</span>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Vehículo</p>
                      <p className="font-bold text-sm text-slate-900">
                        {activeVehicle.make} {activeVehicle.model}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg border border-slate-200">
                    {activeVehicle.plate}
                  </span>
                </div>

                {/* Problem summary */}
                <div className="flex items-center gap-3 py-3">
                  <div className="w-10 h-10 rounded-xl bg-yellow-100 flex items-center justify-center text-yellow-700">
                    <span className="material-symbols-outlined text-xl">{selectedIssue.icon}</span>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Problema Reportado</p>
                    <p className="font-bold text-sm text-slate-900">{selectedIssue.title}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{description}</p>
                  </div>
                </div>

                {/* Location summary */}
                <div className="flex items-center gap-3 py-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                    <span className="material-symbols-outlined text-xl">place</span>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Ubicación</p>
                    <p className="font-bold text-xs text-slate-900">{address}</p>
                  </div>
                </div>

                {/* Pricing estimate */}
                <div className="flex items-center justify-between pt-3">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tarifa Base Estimada</p>
                    <p className="text-xs text-slate-500">Incluye diagnóstico y traslado</p>
                  </div>
                  <p className="text-2xl font-bold text-slate-900">${selectedIssue.suggestedCost} MXN</p>
                </div>
              </IonCardContent>
            </IonCard>

            <IonButton expand="block" size="large" onClick={handleNext}>
              <span className="material-symbols-outlined text-xl">emergency_share</span>
              Solicitar auxilio vial ahora
            </IonButton>
          </div>
        )}
      </IonContent>
    </div>
  );
};
