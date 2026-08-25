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

export const LoginScreen: React.FC = () => {
  const { navigateTo, loginWithRole } = useApp();
  
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Por favor completa todos los campos.');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');

    try {
      const respuesta = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      if (respuesta.ok) {
        const data = await respuesta.json();
        
        localStorage.setItem('access_token', data.access_token);
        console.log('¡Login exitoso! Token guardado:', data.access_token);
        
        const rolUsuario = data.user?.role?.toLowerCase() || 'cliente';
        
        loginWithRole(rolUsuario);
      } else {
        const errorData = await respuesta.json();
        setErrorMsg(errorData.message || 'Correo o contraseña incorrectos');
      }
    } catch (error) {
      console.error('Error de red:', error);
      setErrorMsg('Error de conexión. Verifica que el backend esté corriendo.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoSelect = (role: 'cliente' | 'mecanico' | 'admin') => {
    if (role === 'cliente') {
      setEmail('');
    } else if (role === 'mecanico') {
      setEmail('');
    } else {
      setEmail('');
    }
    setPassword('');
    setErrorMsg('');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <IonHeader>
        <IonToolbar>
          <IonBackButton onClick={() => navigateTo('/auth/welcome')} />
          <IonTitle>Iniciar sesión</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="max-w-md mx-auto py-6">
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl mx-auto flex items-center justify-center border border-blue-100 mb-2">
            <span className="material-symbols-outlined text-2xl">lock</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900">Bienvenido de nuevo</h2>
          <p className="text-xs text-slate-500 mt-0.5">Ingresa a tu cuenta para continuar</p>
        </div>

        {/* Demo Fast Login Buttons */}
        <div className="mb-4 p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
            Accesos rápidos:
          </p>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleDemoSelect('cliente')}
              className="p-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold hover:border-blue-500 text-left transition-all active:scale-95 cursor-pointer"
            >
              <span className="block text-slate-800 font-bold">👤 Cliente</span>
            </button>
            <button
              type="button"
              onClick={() => handleDemoSelect('mecanico')}
              className="p-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold hover:border-blue-500 text-left transition-all active:scale-95 cursor-pointer"
            >
              <span className="block text-blue-600 font-bold">🔧 Mecánico</span>
            </button>
            <button
              type="button"
              onClick={() => handleDemoSelect('admin')}
              className="p-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold hover:border-blue-500 text-left transition-all active:scale-95 cursor-pointer"
            >
              <span className="block text-slate-900 font-bold">🛡️ Admin</span>
            </button>
          </div>
        </div>

        <IonCard>
          <IonCardContent className="p-5">
            <form onSubmit={handleLogin} className="space-y-4">
              {errorMsg && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-semibold flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">error</span>
                  {errorMsg}
                </div>
              )}

              <div>
                <IonInput
                  label="Correo electrónico"
                  type="email"
                  placeholder="ejemplo@correo.com"
                  value={email}
                  onIonChange={(v) => setEmail(v as string)}
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                  Contraseña
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full h-11 px-3.5 pr-11 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-medium text-xs focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-base">
                      {showPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => alert('Se ha enviado un enlace de recuperación a tu correo')}
                  className="text-xs font-medium text-blue-600 hover:underline cursor-pointer"
                >
                  ¿Olvidaste tu contraseña?
                </button>
              </div>

              <div className="pt-1">
                <IonButton
                  type="submit"
                  expand="block"
                  size="large"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <IonSpinner size={18} color="#ffffff" />
                      <span>Iniciando sesión...</span>
                    </div>
                  ) : (
                    'Iniciar sesión'
                  )}
                </IonButton>
              </div>
            </form>
          </IonCardContent>
        </IonCard>

        <div className="text-center mt-6">
          <p className="text-xs text-slate-500">
            ¿No tienes cuenta aún?{' '}
            <button
              onClick={() => navigateTo('/auth/register')}
              className="font-bold text-blue-600 hover:underline cursor-pointer"
            >
              Crear cuenta
            </button>
          </p>
        </div>
      </IonContent>
    </div>
  );
};