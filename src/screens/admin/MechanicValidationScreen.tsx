import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PendingMechanic } from '../../types';
import { AppImage } from '../../components/shared/AppImage';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonBackButton,
  IonContent,
  IonCard,
  IonCardContent,
  IonBadge,
  IonModal,
} from '../../components/ionic/IonicComponents';

export const MechanicValidationScreen: React.FC = () => {
  const { pendingMechanics, approveMechanic, rejectMechanic, navigateTo } = useApp();
  const [selectedMechanic, setSelectedMechanic] = useState<PendingMechanic | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  const filtered = pendingMechanics.filter((m) => {
    if (filter === 'all') return true;
    return m.status === filter;
  });

  const handleApprove = (id: string) => {
    approveMechanic(id);
    setSelectedMechanic(null);
  };

  const handleReject = (id: string) => {
    rejectMechanic(id, 'Documentación de póliza ilegible');
    setSelectedMechanic(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 pb-24">
      <IonHeader className="bg-white/80 backdrop-blur-md border-b border-slate-200">
        <IonToolbar>
          <IonBackButton onClick={() => navigateTo('/admin/dashboard')} />
          <IonTitle>Validación de Mecánicos</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="max-w-4xl mx-auto py-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Auditoría</span>
            <h2 className="text-xl font-bold text-slate-900">Expedientes de Técnicos</h2>
            <p className="text-xs text-slate-500">
              Revisa la documentación y antecedentes de los mecánicos postulantes
            </p>
          </div>

          <div className="flex gap-1.5">
            {(['all', 'pending', 'approved', 'rejected'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  filter === f
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {f === 'all'
                  ? 'Todos'
                  : f === 'pending'
                  ? 'Pendientes'
                  : f === 'approved'
                  ? 'Aprobados'
                  : 'Rechazados'}
              </button>
            ))}
          </div>
        </div>

        {/* List of applications */}
        <div className="space-y-3">
          {filtered.map((mech) => (
            <IonCard key={mech.id} className="hover:border-slate-300 transition-all shadow-2xs">
              <IonCardContent className="p-4">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <div className="w-14 h-14 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shadow-2xs shrink-0">
                      <AppImage
                        src={mech.avatarUrl}
                        alt={mech.name}
                        type="mechanic"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-sm text-slate-900">{mech.name}</h3>
                        <IonBadge
                          color={
                            mech.status === 'pending'
                              ? 'warning'
                              : mech.status === 'approved'
                              ? 'success'
                              : 'danger'
                          }
                        >
                          {mech.status === 'pending'
                            ? 'Pendiente'
                            : mech.status === 'approved'
                            ? 'Aprobado'
                            : 'Rechazado'}
                        </IonBadge>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {mech.email} • {mech.phone}
                      </p>
                      <p className="text-xs font-semibold text-slate-700 mt-1">
                        Unidad: {mech.serviceVehicle.type} ({mech.serviceVehicle.make} {mech.serviceVehicle.model} •{' '}
                        {mech.serviceVehicle.plate})
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                    <button
                      onClick={() => setSelectedMechanic(mech)}
                      className="px-3.5 py-1.5 bg-slate-50 text-blue-600 rounded-xl text-xs font-semibold hover:bg-slate-100 border border-slate-200 transition-all cursor-pointer"
                    >
                      Ver Expediente
                    </button>

                    {mech.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleApprove(mech.id)}
                          className="px-3.5 py-1.5 bg-emerald-600 text-white rounded-xl text-xs font-semibold hover:bg-emerald-700 active:scale-95 transition-all shadow-2xs cursor-pointer"
                        >
                          Aprobar
                        </button>
                        <button
                          onClick={() => handleReject(mech.id)}
                          className="px-3 py-1.5 bg-red-50 text-red-600 border border-red-200 rounded-xl text-xs font-semibold hover:bg-red-100 active:scale-95 transition-all cursor-pointer"
                        >
                          Rechazar
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* Specialties chips */}
                <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-slate-100">
                  {mech.specialties.map((s, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-50 text-slate-600 border border-slate-200"
                    >
                      {s}
                    </span>
                  ))}
                  <span className="text-[10px] text-slate-400 ml-auto">
                    {mech.experienceYears} años exp • {mech.submittedDate}
                  </span>
                </div>
              </IonCardContent>
            </IonCard>
          ))}
        </div>
      </IonContent>

      {/* Detailed Mechanic Inspector Modal */}
      <IonModal
        isOpen={!!selectedMechanic}
        onDidDismiss={() => setSelectedMechanic(null)}
        title="Expediente de Técnico"
      >
        {selectedMechanic && (
          <div className="space-y-4 text-xs">
            {/* Header info */}
            <div className="flex items-center gap-3.5 pb-3 border-b border-slate-100">
              <div className="w-14 h-14 rounded-2xl overflow-hidden border border-slate-200">
                <AppImage
                  src={selectedMechanic.avatarUrl}
                  alt={selectedMechanic.name}
                  type="mechanic"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">{selectedMechanic.name}</h3>
                <p className="text-slate-500">{selectedMechanic.email} • {selectedMechanic.phone}</p>
                <p className="text-[11px] text-blue-600 font-semibold mt-0.5">
                  Experiencia: {selectedMechanic.experienceYears} años
                </p>
              </div>
            </div>

            {/* Service unit */}
            <div>
              <h4 className="font-bold text-slate-400 uppercase text-[10px] tracking-widest mb-1.5">Unidad de Auxilio</h4>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-0.5">
                <p className="font-bold text-slate-900">{selectedMechanic.serviceVehicle.type}</p>
                <p className="text-slate-500">
                  {selectedMechanic.serviceVehicle.make} {selectedMechanic.serviceVehicle.model} ({selectedMechanic.serviceVehicle.year}) • Placas: {selectedMechanic.serviceVehicle.plate}
                </p>
              </div>
            </div>

            {/* Documents checklist */}
            <div>
              <h4 className="font-bold text-slate-400 uppercase text-[10px] tracking-widest mb-1.5">Documentación</h4>
              <div className="space-y-2">
                {selectedMechanic.documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="p-2.5 bg-white border border-slate-200 rounded-xl flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-base text-blue-600">description</span>
                      <div>
                        <p className="font-bold text-slate-900">{doc.title}</p>
                        <p className="text-[10px] text-slate-400">Verificado digitalmente</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                      {doc.verified ? 'Verificado' : 'Revisar'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal actions */}
            {selectedMechanic.status === 'pending' && (
              <div className="grid grid-cols-2 gap-2.5 pt-2">
                <button
                  onClick={() => handleReject(selectedMechanic.id)}
                  className="py-2.5 bg-red-50 text-red-600 border border-red-200 rounded-xl font-bold hover:bg-red-100 cursor-pointer"
                >
                  Rechazar
                </button>
                <button
                  onClick={() => handleApprove(selectedMechanic.id)}
                  className="py-2.5 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 cursor-pointer"
                >
                  Aprobar
                </button>
              </div>
            )}
          </div>
        )}
      </IonModal>
    </div>
  );
};
