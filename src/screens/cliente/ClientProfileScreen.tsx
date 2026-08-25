import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { AppImage } from '../../components/shared/AppImage';
import { AvatarUploadModal } from '../../components/shared/AvatarUploadModal';

import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonBackButton,
  IonContent,
  IonCard,
  IonCardContent,
  IonToggle,
  IonButton,
  IonInput,
} from '../../components/ionic/IonicComponents';

export const ClientProfileScreen: React.FC = () => {
  const { currentUser, logout, navigateTo, showToast } = useApp();

  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [userId, setUserId] = useState('');

  const [userData, setUserData] = useState({
    firstName: 'Cargando...',
    lastName: '',
    email: 'cargando@...',
    avatarUrl: ''
  });

  const [notifications, setNotifications] = useState(true);
  const [locationSharing, setLocationSharing] = useState(true);
  const [emergencyPhone, setEmergencyPhone] = useState('');
  
  const [hasPaymentMethod, setHasPaymentMethod] = useState(false);

  const fetchProfileData = async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) return;

      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentId = payload.sub;
      setUserId(currentId);

      const respuesta = await fetch(
        `http://localhost:3000/users/${currentId}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (respuesta.ok) {
        const datosReales = await respuesta.json();

        setUserData({
          firstName: datosReales.firstName,
          lastName: datosReales.lastName,
          email: datosReales.email,
          avatarUrl: datosReales.avatarUrl || ''
        });

        if (datosReales.emergencyPhone) {
          setEmergencyPhone(datosReales.emergencyPhone);
        }
      }
    } catch (error) {
      console.error('Error al cargar el perfil real:', error);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, []);

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const res = await fetch(`http://localhost:3000/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ emergencyPhone })
      });

      if (res.ok) {
        showToast('Preferencias y contacto guardados exitosamente', 'success', 'check_circle');
      } else {
        showToast('Error al guardar en la base de datos', 'danger');
      }
    } catch (error) {
      showToast('Error de red al guardar', 'danger');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 pb-24">
      <IonHeader>
        <IonToolbar>
          <IonBackButton
            onClick={() => navigateTo('/cliente/home')}
          />
          <IonTitle>Mi Perfil</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="max-w-md mx-auto py-6">
        <div className="text-center mb-6">
          <div className="relative inline-block group">
            {/* 👇 FOTO MÁS GRANDE (w-28 h-28) Y BOTÓN DE CÁMARA AFUERA 👇 */}
            <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-white shadow-lg mx-auto ring-2 ring-slate-200 bg-slate-100 flex items-center justify-center relative">
              {userData.avatarUrl || currentUser.avatarUrl ? (
                <AppImage
                  src={userData.avatarUrl || currentUser.avatarUrl}
                  alt={userData.firstName || 'Avatar'}
                  type="avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="material-symbols-outlined text-5xl text-slate-300">person</span>
              )}
            </div>

            <button
              type="button"
              onClick={() => setIsPhotoModalOpen(true)}
              className="absolute bottom-0 right-0 bg-blue-600 text-white p-2.5 rounded-full shadow-md border-2 border-white hover:bg-blue-700 transition-colors cursor-pointer active:scale-95"
              title="Cambiar foto de perfil"
            >
              <span className="material-symbols-outlined text-sm block">
                photo_camera
              </span>
            </button>
          </div>

          <h2 className="text-xl font-bold text-slate-900 mt-4">
            {userData.firstName} {userData.lastName}
          </h2>

          <p className="text-sm text-slate-500">
            {userData.email}
          </p>

          <div className="inline-block mt-2 px-3 py-1 bg-blue-50 text-blue-700 text-[10px] font-bold rounded-full border border-blue-200">
            Cliente Verificado
          </div>
        </div>

        <div className="space-y-3 px-4">
          <IonCard>
            <IonCardContent className="p-4 space-y-3">
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                <span className="material-symbols-outlined text-base text-red-500">
                  emergency
                </span>
                Contacto de Emergencia
              </h3>

              <p className="text-xs text-slate-500">
                Se enviará una alerta automática por SMS a este número al
                solicitar auxilio.
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

          <IonCard>
            <IonCardContent className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-base text-blue-600">
                    credit_card
                  </span>
                  Método de Pago
                </h3>
              </div>


              {hasPaymentMethod ? (
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-7 bg-slate-900 rounded text-white flex items-center justify-center font-bold text-[10px] tracking-wider">
                      VISA
                    </div>
                    <div>
                      <p className="font-bold text-xs text-slate-900">
                        •••• •••• •••• 4242
                      </p>
                      <p className="text-[10px] text-slate-400">
                        Vence 12/28
                      </p>
                    </div>
                  </div>
                  <button onClick={() => setHasPaymentMethod(false)} className="text-[10px] font-bold text-red-600 hover:underline cursor-pointer">
                    Eliminar
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => { setHasPaymentMethod(true); showToast('Tarjeta guardada exitosamente', 'success'); }} 
                  className="w-full py-3 border-2 border-dashed border-slate-300 rounded-xl text-slate-500 font-bold text-xs hover:bg-slate-50 hover:text-blue-600 transition-colors cursor-pointer flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-base">add_circle</span> Agregar Tarjeta
                </button>
              )}
            </IonCardContent>
          </IonCard>

          <IonCard>
            <IonCardContent className="p-4 space-y-3">
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                <span className="material-symbols-outlined text-base text-slate-600">
                  tune
                </span>
                Preferencias
              </h3>

              <div className="space-y-3 divide-y divide-slate-100">
                <div className="flex items-center justify-between pt-1">
                  <div>
                    <p className="text-xs font-bold text-slate-900">
                      Notificaciones en Vivo
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Alertas de llegada del técnico
                    </p>
                  </div>

                  <IonToggle
                    checked={notifications}
                    onIonChange={setNotifications}
                  />
                </div>

                <div className="flex items-center justify-between pt-3">
                  <div>
                    <p className="text-xs font-bold text-slate-900">
                      GPS de Alta Precisión
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Permite ubicación en tiempo real
                    </p>
                  </div>

                  <IonToggle
                    checked={locationSharing}
                    onIonChange={setLocationSharing}
                  />
                </div>
              </div>
            </IonCardContent>
          </IonCard>

          <div className="pt-2 pb-4 space-y-3">
            <IonButton
              expand="block"
              size="default"
              onClick={handleSave}
            >
              Guardar Cambios
            </IonButton>

            <IonButton
              expand="block"
              fill="outline"
              color="danger"
              size="default"
              onClick={logout}
            >
              <span className="material-symbols-outlined text-base mr-1">
                logout
              </span>
              Cerrar Sesión
            </IonButton>
          </div>
        </div>
      </IonContent>

      <AvatarUploadModal
        isOpen={isPhotoModalOpen}
        onClose={() => {
          setIsPhotoModalOpen(false);
          fetchProfileData();
        }}
        role="cliente"
      />
    </div>
  );
};