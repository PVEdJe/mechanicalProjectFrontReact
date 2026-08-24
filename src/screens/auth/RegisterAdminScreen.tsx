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
  IonButton,
  IonSpinner,
} from '../../components/ionic/IonicComponents';

export const RegisterAdminScreen: React.FC = () => {
  const { navigateTo, loginWithRole, showToast } = useApp();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    authCode: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    try {
      const nameParts = formData.name.trim().split(' ');
      const firstName = nameParts[0];
      const lastName = nameParts.slice(1).join(' ') || 'Admin';

      const res = await fetch('http://localhost:3000/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName,
          lastName,
          email: formData.email,
          password: formData.password,
          phone: '+52 55 9000 1122', 
          role: 'ADMIN',
          authCode: formData.authCode,
        })
      });

      if (res.ok) {
        const loginRes = await fetch('http://localhost:3000/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password
          })
        });

        if (loginRes.ok) {
          const data = await loginRes.json();
          localStorage.setItem('access_token', data.access_token); 
          showToast('Acceso administrativo autorizado', 'success', 'verified_user');
          loginWithRole('admin'); 
        }
      } else {
        const errData = await res.json();
        setErrorMsg(errData.message || 'Código inválido o el usuario ya existe.');
      }
    } catch (error) {
      setErrorMsg('Error de conexión con la Torre de Control.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <IonHeader>
        <IonToolbar>
          <IonBackButton onClick={() => navigateTo('/auth/register')} />
          <IonTitle>Acceso Administrativo</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="max-w-md mx-auto py-6">
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-slate-900 text-white rounded-2xl mx-auto flex items-center justify-center shadow-xs mb-2">
            <span className="material-symbols-outlined text-2xl">shield_lock</span>
          </div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Operaciones</span>
          <h2 className="text-xl font-bold text-slate-900">Panel de Control</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Requiere código de verificación corporativa
          </p>
        </div>

        <IonCard>
          <IonCardContent className="p-5">
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMsg && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-semibold">
                  {errorMsg}
                </div>
              )}

              <IonInput
                label="Nombre del Operador"
                placeholder="Valeria Ríos"
                value={formData.name}
                onIonChange={(v) => setFormData({ ...formData, name: v as string })}
                required
              />

              <IonInput
                label="Correo Institucional"
                type="email"
                placeholder="operaciones@autorescate.mx"
                value={formData.email}
                onIonChange={(v) => setFormData({ ...formData, email: v as string })}
                required
              />

              <IonInput
                label="Contraseña"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onIonChange={(v) => setFormData({ ...formData, password: v as string })}
                required
              />

              <div>
                <IonInput
                  label="Código Institucional"
                  placeholder="AUTORESCATE-OPS-2026"
                  value={formData.authCode}
                  onIonChange={(v) => setFormData({ ...formData, authCode: v as string })}
                  required
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  Código de demostración precargado para pruebas de evaluación.
                </p>
              </div>

              <div className="pt-2">
                <IonButton type="submit" expand="block" size="large" disabled={isLoading}>
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <IonSpinner size={18} color="#ffffff" />
                      <span>Validando credenciales...</span>
                    </div>
                  ) : (
                    'Autorizar e Ingresar'
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