import React, { useState, useEffect } from 'react';
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
  IonAvatar,
  IonToggle,
  IonButton,
  IonInput,
} from '../../components/ionic/IonicComponents';

export const ClientProfileScreen: React.FC = () => {
  const { currentUser, logout, navigateTo, showToast } = useApp();
  
  const [userData, setUserData] = useState({
    firstName: 'Cargando...',
    lastName: '',
    email: 'cargando@...',
  });

  const [notifications, setNotifications] = useState(true);
  const [locationSharing, setLocationSharing] = useState(true);
  const [emergencyPhone, setEmergencyPhone] = useState('');


  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const token = localStorage.getItem('access_token');
        if (!token) return;

        const payload = JSON.parse(atob(token.split('.')[1]));
        const userId = payload.sub;

        const respuesta = await fetch(`http://localhost:3000/users/${userId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (respuesta.ok) {
          const datosReales = await respuesta.json();
          setUserData({
            firstName: datosReales.firstName,
            lastName: datosReales.lastName,
            email: datosReales.email,
          });
          
          if (datosReales.emergencyPhone) {
            setEmergencyPhone(datosReales.emergencyPhone);
          }
        }
      } catch (error) {
        console.error('Error al cargar el perfil real:', error);
      }
    };

    fetchProfileData();
  }, []);

  const handleSave = () => {
    showToast('Preferencias actualizadas con éxito', 'success', 'check_circle');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 pb-24">
      <IonHeader>
        <IonToolbar>
          <IonBackButton onClick={() => navigateTo('/cliente/home')} />
          <IonTitle>Mi Perfil</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="max-w-md mx-auto py-6">
        {/* User Card */}
        <div className="text-center mb-6">
          <div className="relative inline-block">
            <IonAvatar  className="border-3 border-white shadow-md mx-auto">
              <AppImage
                src={currentUser.avatarUrl}
                alt="Avatar"
                type="avatar"
                className="w-full h-full object-cover"
              />
            </IonAvatar>
            <div className="absolute bottom-0 right-0 bg-yellow-400 text-slate-900 p-1.5 rounded-full shadow-xs">
              <span className="material-symbols-outlined text-xs">edit</span>
            </div>
          </div>
          <h2 className="text-lg font-bold text-slate-900 mt-3">
            {userData.firstName} {userData.lastName}
          </h2>
          <p className="text-xs text-slate-500">{userData.email}</p>
          <div className="inline-block mt-2 px-3 py-1 bg-blue-50 text-blue-700 text-[10px] font-bold rounded-full border border-blue-200">
            Cliente Verificado
          </div>
        </div>

        {/* Profile Sections */}
        <div className="space-y-3">
          {/* Emergency Contact */}
          <IonCard>
            <IonCardContent className="p-4 space-y-3">
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                <span className="material-symbols-outlined text-base text-red-500">emergency</span>
                Contacto de Emergencia
              </h3>
              <p className="text-xs text-slate-500">
                Se enviará una alerta automática por SMS a este número al solicitar auxilio.
              </p>
              <IonInput
                label="Teléfono de Emergencia"
                type="tel"
                value={emergencyPhone}
                placeholder="Ej. +52 55 1234 5678"
                onIonChange={(v) => setEmergencyPhone(v as string)}
              />
            </IonCardContent>
          </IonCard>

          {/* Payment Methods */}
          <IonCard>
            <IonCardContent className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-base text-blue-600">credit_card</span>
                  Método de Pago
                </h3>
                <span className="text-xs text-blue-600 font-bold cursor-pointer hover:underline">Cambiar</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-7 bg-slate-900 rounded text-white flex items-center justify-center font-bold text-[10px] tracking-wider">
                    VISA
                  </div>
                  <div>
                    <p className="font-bold text-xs text-slate-900">•••• •••• •••• 4242</p>
                    <p className="text-[10px] text-slate-400">Vence 12/28</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">Activa</span>
              </div>
            </IonCardContent>
          </IonCard>

          {/* Preferences & Toggles */}
          <IonCard>
            <IonCardContent className="p-4 space-y-3">
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                <span className="material-symbols-outlined text-base text-slate-600">tune</span>
                Preferencias
              </h3>
              <div className="space-y-3 divide-y divide-slate-100">
                <div className="flex items-center justify-between pt-1">
                  <div>
                    <p className="text-xs font-bold text-slate-900">Notificaciones en Vivo</p>
                    <p className="text-[11px] text-slate-500">Alertas de llegada del técnico</p>
                  </div>
                  <IonToggle checked={notifications} onIonChange={setNotifications} />
                </div>

                <div className="flex items-center justify-between pt-3">
                  <div>
                    <p className="text-xs font-bold text-slate-900">GPS de Alta Precisión</p>
                    <p className="text-[11px] text-slate-500">Permite ubicación en tiempo real</p>
                  </div>
                  <IonToggle checked={locationSharing} onIonChange={setLocationSharing} />
                </div>
              </div>
            </IonCardContent>
          </IonCard>

          <IonButton expand="block" size="default" onClick={handleSave}>
            Guardar Cambios
          </IonButton>

          <IonButton 
            expand="block" 
            fill="outline" 
            color="danger" 
            size="default" 
            onClick={logout}
          >
            <span className="material-symbols-outlined text-base mr-1">logout</span>
            Cerrar Sesión
          </IonButton>
        </div>
      </IonContent>
    </div>
  );
};