import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonBackButton,
  IonContent,
  IonButton,
} from '../../components/ionic/IonicComponents';
import { UserRole } from '../../types';

export const RegisterSelectScreen: React.FC = () => {
  const { navigateTo } = useApp();
  const [selectedRole, setSelectedRole] = useState<UserRole>('cliente');

  const roleOptions = [
    {
      id: 'cliente' as UserRole,
      title: 'Cliente',
      icon: 'person',
      description: 'Necesito solicitar asistencia vial para mi vehículo.',
      badge: 'Acceso inmediato',
      route: '/auth/register/client',
    },
    {
      id: 'mecanico' as UserRole,
      title: 'Mecánico / Grúa',
      icon: 'build',
      description: 'Quiero ofrecer servicios de asistencia y generar ingresos.',
      badge: 'Requiere validación',
      route: '/auth/register/mechanic',
    },
    {
      id: 'admin' as UserRole,
      title: 'Administrador',
      icon: 'shield',
      description: 'Administrar y supervisar la plataforma y flota.',
      badge: 'Código corporativo',
      route: '/auth/register/admin',
    },
  ];

  const handleContinue = () => {
    if (selectedRole === 'cliente') navigateTo('/auth/register/client');
    if (selectedRole === 'mecanico') navigateTo('/auth/register/mechanic');
    if (selectedRole === 'admin') navigateTo('/auth/register/admin');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <IonHeader>
        <IonToolbar>
          <IonBackButton onClick={() => navigateTo('/auth/welcome')} />
          <IonTitle>Tipo de cuenta</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="max-w-md mx-auto py-6">
        <div className="text-center mb-6">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Registro</span>
          <h2 className="text-xl font-bold text-slate-900">Selecciona tu perfil</h2>
          <p className="text-xs text-slate-500 mt-0.5">Elige la modalidad adecuada a tus necesidades</p>
        </div>

        <div className="space-y-3">
          {roleOptions.map((opt) => {
            const isSelected = selectedRole === opt.id;
            return (
              <div
                key={opt.id}
                onClick={() => setSelectedRole(opt.id)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-white border-blue-600 shadow-sm ring-1 ring-blue-600'
                    : 'bg-white border-slate-200 hover:border-slate-300 shadow-2xs'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                      isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    <span className="material-symbols-outlined text-2xl">{opt.icon}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-sm text-slate-900">{opt.title}</h3>
                      <div
                        className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                          isSelected ? 'border-blue-600 bg-blue-600' : 'border-slate-300'
                        }`}
                      >
                        {isSelected && <span className="material-symbols-outlined text-white text-[10px]">check</span>}
                      </div>
                    </div>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">{opt.description}</p>
                    <span className="inline-block mt-2 px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-50 text-slate-600 border border-slate-200">
                      {opt.badge}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6">
          <IonButton expand="block" size="large" onClick={handleContinue}>
            Continuar como {selectedRole === 'cliente' ? 'Cliente' : selectedRole === 'mecanico' ? 'Mecánico' : 'Administrador'}
          </IonButton>
        </div>
      </IonContent>
    </div>
  );
};
