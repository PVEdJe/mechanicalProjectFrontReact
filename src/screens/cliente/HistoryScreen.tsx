import React, { useState, useEffect } from 'react';
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

export const HistoryScreen: React.FC = () => {
  const { navigateTo } = useApp();
  const [activeFilter, setActiveFilter] = useState<'all' | 'COMPLETED' | 'CANCELLED'>('all');
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const [realHistory, setRealHistory] = useState<any[]>([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem('access_token');
        if (!token) return;

        const res = await fetch(`http://localhost:3000/rescues/client/history`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (res.ok) {
          const myHistory = await res.json();
          // El backend ya los envía ordenados, solo filtramos los terminados por seguridad
          const finishedRescues = myHistory.filter((r: any) => 
            r.status === 'COMPLETED' || r.status === 'CANCELLED'
          );
          setRealHistory(finishedRescues);
        }
      } catch (error) {
        console.error('Error fetching history', error);
      }
    };
    fetchHistory();
  }, []);

  const filteredHistory = realHistory.filter((item) => {
    if (activeFilter === 'all') return true;
    return item.status === activeFilter;
  });

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Fecha desconocida';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-MX', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

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
            onIonChange={(v) => setActiveFilter(v as 'all' | 'COMPLETED' | 'CANCELLED')}
          >
            <IonSegmentButton value="all">Todos</IonSegmentButton>
            <IonSegmentButton value="COMPLETED">Completados</IonSegmentButton>
            <IonSegmentButton value="CANCELLED">Cancelados</IonSegmentButton>
          </IonSegment>
        </div>

        {filteredHistory.length === 0 ? (
          <div className="text-center py-12 text-slate-400">
            <span className="material-symbols-outlined text-4xl text-slate-300 mb-2">history_toggle_off</span>
            <p className="font-semibold text-xs">No se encontraron registros</p>
          </div>
        ) : (
          <div className="space-y-2.5 px-4">
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
                           build
                        </span>
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-slate-900">
                          {item.description ? item.description.substring(0, 25) + '...' : 'Asistencia Vial'}
                        </h4>
                        <p className="text-xs text-slate-500">
                          ID Vehículo: {item.vehicle?.placas || item.vehicleId?.substring(0,6)} • {formatDate(item.createdAt)}
                        </p>
                      </div>
                    </div>

                    <IonBadge color={item.status === 'COMPLETED' ? 'success' : 'danger'}>
                      {item.status === 'COMPLETED' ? 'Completado' : 'Cancelado'}
                    </IonBadge>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-500 flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm text-blue-600">engineering</span>
                      {item.mechanic ? `${item.mechanic.firstName} ${item.mechanic.lastName}` : 'Técnico AutoRescate'}
                    </span>
                    <div className="flex items-center gap-2.5">
                      <span className="font-bold text-slate-900 text-sm">
                        ${item.totalCost || 0} MXN
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
          <div className="space-y-4 text-xs p-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Folio</span>
                <p className="font-mono font-bold text-sm text-slate-900">{selectedItem.id.substring(0,8).toUpperCase()}</p>
              </div>
              <IonBadge color={selectedItem.status === 'COMPLETED' ? 'success' : 'danger'}>
                {selectedItem.status === 'COMPLETED' ? 'Completado' : 'Cancelado'}
              </IonBadge>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Reporte del cliente:</span>
                <span className="font-bold text-slate-900 truncate max-w-[200px] text-right">{selectedItem.description}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Fecha y hora:</span>
                <span className="font-semibold text-slate-900">{formatDate(selectedItem.createdAt)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Vehículo:</span>
                <span className="font-semibold text-slate-900">
                   {selectedItem.vehicle?.marca} {selectedItem.vehicle?.modelo} ({selectedItem.vehicle?.placas || selectedItem.vehicleId?.substring(0,6)})
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Técnico asignado:</span>
                <span className="font-bold text-blue-600">{selectedItem.mechanic ? `${selectedItem.mechanic.firstName} ${selectedItem.mechanic.lastName}` : 'Sin asignar'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Coordenadas:</span>
                <span className="font-semibold text-slate-900 max-w-[200px] text-right truncate">
                  Lat: {selectedItem.latitude}, Lng: {selectedItem.longitude}
                </span>
              </div>
              
              {selectedItem.mechanicNotes && (
                 <div className="flex justify-between">
                    <span className="text-slate-500">Notas del mecánico:</span>
                    <span className="font-semibold text-slate-900 max-w-[200px] text-right truncate">
                      {selectedItem.mechanicNotes}
                    </span>
                 </div>
              )}

              <div className="flex justify-between pt-2 border-t border-slate-100 text-sm">
                <span className="font-bold text-slate-900">Monto Total:</span>
                <span className="font-bold text-emerald-600">
                  ${selectedItem.totalCost || 0} MXN
                </span>
              </div>
            </div>
          </div>
        )}
      </IonModal>
    </div>
  );
};