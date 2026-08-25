import React, { useEffect, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { InteractiveMap } from '../../components/shared/InteractiveMap';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonSpinner,
  IonButton,
} from '../../components/ionic/IonicComponents';

export const SearchingScreen: React.FC = () => {
  const { navigateTo, updateServiceStatus, cancelActiveRequest } = useApp();
  const [seconds, setSeconds] = useState(3);

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          updateServiceStatus('on_the_way');
          navigateTo('/cliente/tracking');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigateTo, updateServiceStatus]);

  return (
    <div className="relative w-full h-screen overflow-hidden flex flex-col bg-slate-50">
      <IonHeader className="absolute top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <IonToolbar>
          <IonTitle>Localizando Auxilio Vial</IonTitle>
        </IonToolbar>
      </IonHeader>

      <div className="flex-1 w-full h-full relative">
        <InteractiveMap showRoute={false} />

        {/* Pulsing Radar Overlay Center */}
        <div className="absolute inset-0 z-20 pointer-events-none flex items-center justify-center">
          <div className="relative flex items-center justify-center">
            <div className="w-48 h-48 rounded-full border border-blue-500/40 animate-ping absolute" />
            <div className="w-32 h-32 rounded-full border border-blue-400/50 animate-pulse absolute" />
            <div className="w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-xl pulse-halo">
              <span className="material-symbols-outlined text-2xl animate-spin">radar</span>
            </div>
          </div>
        </div>

        {/* Bottom Status Card */}
        <div className="absolute bottom-6 left-4 right-4 z-30 max-w-md mx-auto">
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-5 border border-slate-200 shadow-xl flex flex-col items-center text-center gap-4">
            <div className="flex items-center gap-3">
              <IonSpinner size={26} color="#2563eb" />
              <div className="text-left">
                <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest block">Buscando unidad</span>
                <h3 className="font-bold text-sm text-slate-900">Contactando mecánicos cercanos...</h3>
              </div>
            </div>

            

            <div className="w-full flex gap-2.5">
              <IonButton
                expand="block"
                fill="outline"
                color="danger"
                size="default"
                onClick={cancelActiveRequest}
                className="flex-1"
              >
                Cancelar
              </IonButton>

              <IonButton
                expand="block"
                size="default"
                onClick={() => {
                  updateServiceStatus('on_the_way');
                  navigateTo('/cliente/tracking');
                }}
                className="flex-1"
              >
                Asignar ahora
              </IonButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
