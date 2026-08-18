import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { InteractiveMap } from '../../components/shared/InteractiveMap';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonBackButton,
  IonModal,
} from '../../components/ionic/IonicComponents';

export const GlobalMapScreen: React.FC = () => {
  const { navigateTo, showToast } = useApp();
  const [activeFilter, setActiveFilter] = useState<'all' | 'idle' | 'busy' | 'incidents'>('all');
  const [selectedMarker, setSelectedMarker] = useState<any | null>(null);

  const handleMarkerClick = (marker: any) => {
    setSelectedMarker(marker);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden flex flex-col bg-slate-50">
      {/* Admin Top Header */}
      <IonHeader className="absolute top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <IonToolbar>
          <IonBackButton onClick={() => navigateTo('/admin/dashboard')} />
          <IonTitle>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>Mapa Global de Flota</span>
            </div>
          </IonTitle>
        </IonToolbar>
      </IonHeader>

      {/* Fullscreen interactive fleet map */}
      <div className="flex-1 w-full h-full relative">
        <InteractiveMap
          showRoute={true}
          onMarkerClick={handleMarkerClick}
          nearbyMechanics={[
            { id: 'm1', lat: 19.398, lng: -99.182, name: 'Grúa Norte (Arturo G.)' },
            { id: 'm2', lat: 19.375, lng: -99.165, name: 'Taller Móvil (Roberto S.)' },
            { id: 'm3', lat: 19.389, lng: -99.155, name: 'Moto Asistencia (Luis T.)' },
          ]}
          incidentCoords={{
            lat: 19.3824,
            lng: -99.1765,
            title: 'Incidencia #SR-4092 (Batería)',
          }}
        />

        {/* Floating Filter Bar */}
        <div className="absolute top-16 left-4 right-4 z-30 max-w-md mx-auto">
          <div className="bg-white/95 backdrop-blur-md p-1 rounded-2xl border border-slate-200 shadow-md flex gap-1 justify-between">
            <button
              onClick={() => setActiveFilter('all')}
              className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeFilter === 'all' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              Todos (22)
            </button>
            <button
              onClick={() => setActiveFilter('idle')}
              className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeFilter === 'idle' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              Libres (14)
            </button>
            <button
              onClick={() => setActiveFilter('busy')}
              className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeFilter === 'busy' ? 'bg-blue-800 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              Ocupados (8)
            </button>
            <button
              onClick={() => setActiveFilter('incidents')}
              className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeFilter === 'incidents' ? 'bg-red-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              Alertas (2)
            </button>
          </div>
        </div>

        {/* Quick legend footer */}
        <div className="absolute bottom-6 left-4 right-4 z-30 max-w-md mx-auto">
          <div className="bg-white/95 backdrop-blur-md text-slate-800 p-3 rounded-2xl border border-slate-200 shadow-lg flex items-center justify-between text-xs font-semibold">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>34 Libres</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-600" />
              <span>8 En Turno</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-red-500" />
              <span>2 Solicitudes</span>
            </div>
          </div>
        </div>
      </div>

      {/* Marker Detail Drawer / Modal */}
      <IonModal
        isOpen={!!selectedMarker}
        onDidDismiss={() => setSelectedMarker(null)}
        title="Detalle de Unidad / Incidencia"
      >
        {selectedMarker && (
          <div className="space-y-4 text-xs">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold">
                <span className="material-symbols-outlined text-xl">local_shipping</span>
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900">
                  {selectedMarker.name || 'Unidad de Rescate Activa'}
                </h3>
                <p className="text-slate-400">Coordenadas: 19.3824, -99.1765</p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Estado:</span>
                <span className="font-bold text-emerald-600">En Servicio Activo</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Vehículo:</span>
                <span className="font-semibold text-slate-900">{selectedMarker.vehicle || 'Ford F-450 Grúa'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Servicios hoy:</span>
                <span className="font-bold text-slate-900">4 rescates</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                onClick={() => {
                  showToast('Reasignación de despacho efectuada', 'success');
                  setSelectedMarker(null);
                }}
                className="py-2.5 bg-slate-50 text-blue-600 rounded-xl font-bold border border-slate-200 hover:bg-slate-100 cursor-pointer"
              >
                Reasignar
              </button>
              <button
                onClick={() => {
                  showToast('Enlace de radio establecido', 'success');
                  setSelectedMarker(null);
                }}
                className="py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 cursor-pointer"
              >
                Llamada Radio
              </button>
            </div>
          </div>
        )}
      </IonModal>
    </div>
  );
};
