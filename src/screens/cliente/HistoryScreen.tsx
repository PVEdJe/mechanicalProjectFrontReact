import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonBackButton,
  IonContent,
  IonCard,
  IonCardContent,
  IonSegment,
  IonSegmentButton,
  IonBadge,
  IonModal,
} from '../../components/ionic/IonicComponents';
import { ServiceRequest } from '../../types';

export const HistoryScreen: React.FC = () => {
  const { history, navigateTo } = useApp();
  const [activeFilter, setActiveFilter] = useState<'all' | 'completed' | 'cancelled'>('all');
  const [selectedItem, setSelectedItem] = useState<ServiceRequest | null>(null);

  const filteredHistory = history.filter((item) => {
    if (activeFilter === 'all') return true;
    return item.status === activeFilter;
  });

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 pb-24">
      <IonHeader>
        <IonToolbar>
          <IonBackButton onClick={() => navigateTo('/cliente/home')} />
          <IonTitle>Historial de Servicios</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="max-w-md mx-auto py-4">
        {/* Segment Filter */}
        <div className="mb-4">
          <IonSegment
            value={activeFilter}
            onIonChange={(v) => setActiveFilter(v as 'all' | 'completed' | 'cancelled')}
          >
            <IonSegmentButton value="all">Todos ({history.length})</IonSegmentButton>
            <IonSegmentButton value="completed">Completados</IonSegmentButton>
            <IonSegmentButton value="cancelled">Cancelados</IonSegmentButton>
          </IonSegment>
        </div>

        {filteredHistory.length === 0 ? (
          <div className="text-center py-12 text-slate-400">
            <span className="material-symbols-outlined text-4xl text-slate-300 mb-2">history_toggle_off</span>
            <p className="font-semibold text-xs">No se encontraron registros</p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {filteredHistory.map((item) => (
              <IonCard
                key={item.id}
                onClick={() => setSelectedItem(item)}
                className="cursor-pointer hover:border-slate-300 transition-all shadow-xs"
              >
                <IonCardContent className="p-3.5">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-xl">
                          {item.issue === 'tire'
                            ? 'tire_repair'
                            : item.issue === 'battery'
                            ? 'battery_charging_full'
                            : item.issue === 'engine'
                            ? 'car_repair'
                            : item.issue === 'accident'
                            ? 'minor_crash'
                            : item.issue === 'fuel'
                            ? 'local_gas_station'
                            : 'build'}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-slate-900">{item.issueTitle}</h4>
                        <p className="text-xs text-slate-500">
                          {item.vehicle?.make} {item.vehicle?.model} • {item.createdAt}
                        </p>
                      </div>
                    </div>

                    <IonBadge color={item.status === 'completed' ? 'success' : 'danger'}>
                      {item.status === 'completed' ? 'Completado' : 'Cancelado'}
                    </IonBadge>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-500 flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm text-blue-600">engineering</span>
                      {item.mechanic?.name || 'Técnico AutoRescate'}
                    </span>
                    <div className="flex items-center gap-2.5">
                      {item.mechanic?.rating && (
                        <span className="flex items-center text-yellow-600 font-bold text-xs">
                          ★ {item.mechanic.rating}
                        </span>
                      )}
                      <span className="font-bold text-slate-900 text-sm">
                        ${item.finalCost || item.estimatedCost} MXN
                      </span>
                    </div>
                  </div>
                </IonCardContent>
              </IonCard>
            ))}
          </div>
        )}
      </IonContent>

      {/* Detail Modal */}
      <IonModal
        isOpen={!!selectedItem}
        onDidDismiss={() => setSelectedItem(null)}
        title="Detalle del Servicio"
      >
        {selectedItem && (
          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Folio</span>
                <p className="font-mono font-bold text-sm text-slate-900">{selectedItem.id}</p>
              </div>
              <IonBadge color={selectedItem.status === 'completed' ? 'success' : 'danger'}>
                {selectedItem.status === 'completed' ? 'Completado' : 'Cancelado'}
              </IonBadge>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Servicio:</span>
                <span className="font-bold text-slate-900">{selectedItem.issueTitle}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Fecha y hora:</span>
                <span className="font-semibold text-slate-900">{selectedItem.createdAt}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Vehículo atendido:</span>
                <span className="font-semibold text-slate-900">
                  {selectedItem.vehicle?.make} {selectedItem.vehicle?.model} ({selectedItem.vehicle?.plate})
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Técnico asignado:</span>
                <span className="font-bold text-blue-600">{selectedItem.mechanic?.name || 'Asignado'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Ubicación:</span>
                <span className="font-semibold text-slate-900 max-w-[200px] text-right truncate">
                  {selectedItem.location.address}
                </span>
              </div>

              {selectedItem.breakdown && (
                <div className="p-3 bg-slate-50 rounded-xl space-y-1 my-2 border border-slate-200">
                  <p className="font-bold text-slate-900 text-[11px] uppercase tracking-wider">Desglose de Facturación:</p>
                  <div className="flex justify-between text-slate-600">
                    <span>Mano de Obra:</span>
                    <span>${selectedItem.breakdown.labor} MXN</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Refacciones / Insumos:</span>
                    <span>${selectedItem.breakdown.parts} MXN</span>
                  </div>
                  {selectedItem.breakdown.piecesUsed && (
                    <p className="text-[10px] text-slate-400 italic">
                      Piezas: {selectedItem.breakdown.piecesUsed}
                    </p>
                  )}
                </div>
              )}

              <div className="flex justify-between pt-2 border-t border-slate-100 text-sm">
                <span className="font-bold text-slate-900">Monto Total:</span>
                <span className="font-bold text-slate-900">
                  ${selectedItem.finalCost || selectedItem.estimatedCost} MXN
                </span>
              </div>
            </div>
          </div>
        )}
      </IonModal>
    </div>
  );
};
