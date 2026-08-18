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
  IonInput,
  IonTextarea,
  IonSelect,
  IonSelectOption,
  IonButton,
  IonSpinner,
} from '../../components/ionic/IonicComponents';

export const RegisterMechanicScreen: React.FC = () => {
  const { navigateTo, showToast } = useApp();
  const [step, setStep] = useState<'form' | 'pending_status'>('form');
  const [formData, setFormData] = useState({
    name: 'Carlos',
    lastName: 'Mendoza',
    email: 'carlos.m@autorescate.mx',
    phone: '+52 55 7821 9044',
    specialties: 'Grúas, Baterías, Neumáticos, Mecánica Ligera',
    experienceYears: '8',
    description: 'Técnico automotriz certificado con grúa plataforma y equipo neumático pesado para asistencia.',
    serviceVehicleType: 'Grúa Plataforma',
    make: 'Ford',
    model: 'F-450 Heavy Duty',
    year: '2022',
    plate: 'GR-492-CD',
    hasId: true,
    hasLicense: true,
    hasInsurance: true,
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStep('pending_status');
      showToast('Solicitud enviada correctamente', 'warning', 'schedule');
    }, 1200);
  };

  if (step === 'pending_status') {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <IonHeader>
          <IonToolbar>
            <IonTitle>Estado de Solicitud</IonTitle>
          </IonToolbar>
        </IonHeader>

        <IonContent className="max-w-md mx-auto py-12 text-center">
          <div className="w-20 h-20 bg-yellow-50 text-yellow-700 rounded-3xl mx-auto flex items-center justify-center mb-5 border border-yellow-200 shadow-2xs">
            <span className="material-symbols-outlined text-4xl">hourglass_top</span>
          </div>

          <div className="inline-block px-3.5 py-1 rounded-full bg-yellow-50 border border-yellow-200 text-yellow-800 font-bold text-xs mb-3">
            Pendiente de validación
          </div>

          <h2 className="text-xl font-bold text-slate-900 mb-2">¡Solicitud recibida!</h2>
          <p className="text-xs text-slate-500 leading-relaxed mb-6 px-4">
            Tu expediente y documentación han sido registrados. El equipo de administración revisará tus
            credenciales en un plazo no mayor a 24 horas.
          </p>

          <div className="space-y-2.5 px-4">
            <IonButton
              expand="block"
              size="large"
              onClick={() => navigateTo('/auth/login')}
            >
              Ir a Iniciar sesión
            </IonButton>

            <IonButton
              expand="block"
              fill="outline"
              onClick={() => navigateTo('/auth/welcome')}
            >
              Volver al inicio
            </IonButton>
          </div>
        </IonContent>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <IonHeader>
        <IonToolbar>
          <IonBackButton onClick={() => navigateTo('/auth/register')} />
          <IonTitle>Registro de Mecánico</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="max-w-lg mx-auto py-6">
        <div className="text-center mb-6">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Red Profesional</span>
          <h2 className="text-xl font-bold text-slate-900">Únete como Prestador</h2>
          <p className="text-xs text-slate-500 mt-0.5">Registra tu perfil técnico y tu unidad de servicio</p>
        </div>

        <IonCard>
          <IonCardContent className="p-5">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Personal Data */}
              <div className="border-b border-slate-100 pb-4">
                <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-sm text-blue-600">person</span>
                  Datos Personales
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <IonInput
                    label="Nombre(s)"
                    placeholder="Carlos"
                    value={formData.name}
                    onIonChange={(v) => setFormData({ ...formData, name: v })}
                    required
                  />
                  <IonInput
                    label="Apellidos"
                    placeholder="Mendoza"
                    value={formData.lastName}
                    onIonChange={(v) => setFormData({ ...formData, lastName: v })}
                    required
                  />
                  <IonInput
                    label="Correo Profesional"
                    type="email"
                    placeholder="mecanico@autorescate.mx"
                    value={formData.email}
                    onIonChange={(v) => setFormData({ ...formData, email: v })}
                    required
                  />
                  <IonInput
                    label="Teléfono Móvil"
                    type="tel"
                    placeholder="+52 55 7821 9044"
                    value={formData.phone}
                    onIonChange={(v) => setFormData({ ...formData, phone: v })}
                    required
                  />
                </div>
              </div>

              {/* Professional Profile */}
              <div className="border-b border-slate-100 pb-4">
                <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-sm text-blue-600">engineering</span>
                  Perfil Profesional
                </h3>
                <div className="space-y-3">
                  <IonInput
                    label="Especialidades principales"
                    placeholder="Ej. Baterías, Neumáticos, Grúa, Diagnóstico"
                    value={formData.specialties}
                    onIonChange={(v) => setFormData({ ...formData, specialties: v })}
                    required
                  />
                  <IonInput
                    label="Años de experiencia"
                    type="number"
                    placeholder="8"
                    value={formData.experienceYears}
                    onIonChange={(v) => setFormData({ ...formData, experienceYears: v })}
                    required
                  />
                  <IonTextarea
                    label="Descripción y certificaciones"
                    placeholder="Describe tu equipo y experiencia..."
                    value={formData.description}
                    onIonChange={(v) => setFormData({ ...formData, description: v })}
                    rows={3}
                  />
                </div>
              </div>

              {/* Service Vehicle */}
              <div className="border-b border-slate-100 pb-4">
                <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-sm text-blue-600">local_shipping</span>
                  Unidad de Servicio
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <IonSelect
                    label="Tipo de Vehículo"
                    value={formData.serviceVehicleType}
                    onIonChange={(v) => setFormData({ ...formData, serviceVehicleType: v })}
                  >
                    <IonSelectOption value="Grúa Plataforma">Grúa Plataforma</IonSelectOption>
                    <IonSelectOption value="Grúa de Arrastre">Grúa de Arrastre</IonSelectOption>
                    <IonSelectOption value="Taller Móvil (Van/Pick-up)">Taller Móvil (Van/Pick-up)</IonSelectOption>
                    <IonSelectOption value="Moto Asistencia Rápida">Moto Asistencia Rápida</IonSelectOption>
                  </IonSelect>
                  <IonInput
                    label="Marca"
                    placeholder="Ford / Chevrolet / Nissan"
                    value={formData.make}
                    onIonChange={(v) => setFormData({ ...formData, make: v })}
                    required
                  />
                  <IonInput
                    label="Modelo"
                    placeholder="F-450 / Kodiak / Hilux"
                    value={formData.model}
                    onIonChange={(v) => setFormData({ ...formData, model: v })}
                    required
                  />
                  <IonInput
                    label="Placas"
                    placeholder="GR-492-CD"
                    value={formData.plate}
                    onIonChange={(v) => setFormData({ ...formData, plate: v })}
                    required
                  />
                </div>
              </div>

              {/* Documentation */}
              <div>
                <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-sm text-blue-600">verified</span>
                  Documentos Requeridos
                </h3>
                <div className="space-y-2 bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.hasId}
                      onChange={(e) => setFormData({ ...formData, hasId: e.target.checked })}
                      className="rounded text-blue-600 focus:ring-blue-600"
                    />
                    <span className="font-medium text-slate-800">Identificación Oficial (INE / Pasaporte)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.hasLicense}
                      onChange={(e) => setFormData({ ...formData, hasLicense: e.target.checked })}
                      className="rounded text-blue-600 focus:ring-blue-600"
                    />
                    <span className="font-medium text-slate-800">Licencia de Conducir Especial</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.hasInsurance}
                      onChange={(e) => setFormData({ ...formData, hasInsurance: e.target.checked })}
                      className="rounded text-blue-600 focus:ring-blue-600"
                    />
                    <span className="font-medium text-slate-800">Póliza de Seguro Vigente de la Unidad</span>
                  </label>
                </div>
              </div>

              <div className="pt-2">
                <IonButton type="submit" expand="block" size="large" disabled={isLoading}>
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <IonSpinner size={18} color="#ffffff" />
                      <span>Enviando solicitud...</span>
                    </div>
                  ) : (
                    'Enviar solicitud'
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
