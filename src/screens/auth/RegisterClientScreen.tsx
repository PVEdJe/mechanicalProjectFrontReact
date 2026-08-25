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

export const RegisterClientScreen: React.FC = () => {
  const { navigateTo, loginWithRole, showToast, addVehicle } = useApp();
  const [formData, setFormData] = useState({
    name: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    make: '',
    model: '',
    year: '',
    color: '',
    plate: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setErrorMsg('Las contraseñas no coinciden');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');

    try {
      const respuesta = await fetch('http://localhost:3000/users/register', { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          firstName: formData.name,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
          phone: formData.phone, 
          // role: 'CLIENTE' // Descomenta si necesitas enviar el rol explícitamente
        
          vehiculo: {
            marca: formData.make,
            modelo: formData.model,
            anio: Number(formData.year),
            color: formData.color,
            placas: formData.plate,
            esPrincipal: true 
          }
        })
      });

      if (respuesta.ok) {
        const usuarioCreado = await respuesta.json();
        
        showToast('¡Cuenta creada correctamente!', 'success', 'check_circle');
        
        navigateTo('/auth/login');
      } else {
        const errorData = await respuesta.json();
        setErrorMsg(errorData.message || 'Error al crear la cuenta. Verifica tus datos.');
      }
    } catch (error) {
      console.error('Error de red:', error);
      setErrorMsg('Error de conexión con el servidor. ¿Está encendido NestJS?');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <IonHeader>
        <IonToolbar>
          <IonBackButton onClick={() => navigateTo('/auth/register')} />
          <IonTitle>Registro de Cliente</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="max-w-lg mx-auto py-6">
        <div className="text-center mb-6">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Nuevo Usuario</span>
          <h2 className="text-xl font-bold text-slate-900">Crea tu cuenta</h2>
          <p className="text-xs text-slate-500 mt-0.5">Registra tus datos y tu vehículo principal</p>
        </div>

        <IonCard>
          <IonCardContent className="p-5">
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMsg && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-semibold">
                  {errorMsg}
                </div>
              )}

              <div className="border-b border-slate-100 pb-4">
                <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-sm text-blue-600">person</span>
                  Datos Personales
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <IonInput
                    label="Nombre(s)"
                    placeholder="Ej. Salvador"
                    value={formData.name}
                    onIonChange={(v) => setFormData({ ...formData, name: v })}
                    required
                  />
                  <IonInput
                    label="Apellidos"
                    placeholder="Ej. Hernández"
                    value={formData.lastName}
                    onIonChange={(v) => setFormData({ ...formData, lastName: v })}
                    required
                  />
                  <IonInput
                    label="Correo electrónico"
                    type="email"
                    placeholder="correo@ejemplo.com"
                    value={formData.email}
                    onIonChange={(v) => setFormData({ ...formData, email: v })}
                    required
                  />
                  <IonInput
                    label="Teléfono Móvil"
                    type="tel"
                    placeholder="+52 55 1234 5678"
                    value={formData.phone}
                    onIonChange={(v) => setFormData({ ...formData, phone: v })}
                    required
                  />
                  <IonInput
                    label="Contraseña"
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onIonChange={(v) => setFormData({ ...formData, password: v })}
                    required
                  />
                  <IonInput
                    label="Confirmar contraseña"
                    type="password"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onIonChange={(v) => setFormData({ ...formData, confirmPassword: v })}
                    required
                  />
                </div>
              </div>

              <div>
                <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-sm text-blue-600">directions_car</span>
                  Vehículo Principal
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <IonInput
                    label="Marca"
                    placeholder="Ej. Tesla, Toyota, Nissan"
                    value={formData.make}
                    onIonChange={(v) => setFormData({ ...formData, make: v })}
                    required
                  />
                  <IonInput
                    label="Modelo"
                    placeholder="Ej. Model 3, Corolla, Versa"
                    value={formData.model}
                    onIonChange={(v) => setFormData({ ...formData, model: v })}
                    required
                  />
                  <IonInput
                    label="Año"
                    type="number"
                    placeholder="2023"
                    value={formData.year}
                    onIonChange={(v) => setFormData({ ...formData, year: v })}
                    required
                  />
                  <IonInput
                    label="Color"
                    placeholder="Ej. Blanco Perla"
                    value={formData.color}
                    onIonChange={(v) => setFormData({ ...formData, color: v })}
                    required
                  />
                  <div className="md:col-span-2">
                    <IonInput
                      label="Placas"
                      placeholder="Ej. ABC-1234"
                      value={formData.plate}
                      onIonChange={(v) => setFormData({ ...formData, plate: v })}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <IonButton type="submit" expand="block" size="large" disabled={isLoading}>
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <IonSpinner size={18} color="#ffffff" />
                      <span>Creando cuenta...</span>
                    </div>
                  ) : (
                    'Crear cuenta'
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
