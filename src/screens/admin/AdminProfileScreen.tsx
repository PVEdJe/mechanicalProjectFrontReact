import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { AppImage } from '../../components/shared/AppImage';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonAvatar,
  IonCard,
  IonCardContent,
  IonButton,
  IonBadge,
  IonToggle,
  IonModal,
} from '../../components/ionic/IonicComponents';

export const AdminProfileScreen: React.FC = () => {
  const { currentUser, updateUserProfile, navigateTo, logout, showToast, pendingMechanics } = useApp();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  const [name, setName] = useState('Cargando...');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [emergencyAlertsEnabled, setEmergencyAlertsEnabled] = useState(true);
  const [auditLogNotification, setAuditLogNotification] = useState(true);

  const cargarPerfil = async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) return;
      
      const payload = JSON.parse(atob(token.split('.')[1]));
      const res = await fetch(`http://localhost:3000/users/${payload.sub}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.ok) {
        const data = await res.json();
        setName(data.firstName || '');
        setLastName(data.lastName || '');
        setEmail(data.email || '');
        setPhone(data.phone || '');
      }
    } catch (error) {
      console.error('Error al cargar perfil:', error);
    }
  };

  useEffect(() => {
    cargarPerfil();
  }, []);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('access_token');
      const payload = JSON.parse(atob(token!.split('.')[1]));

      const res = await fetch(`http://localhost:3000/users/${payload.sub}/perfil`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          firstName: name,
          lastName,
          phone,
          email,
        })
      });

      if (res.ok) {
        showToast('Perfil de administrador actualizado', 'success', 'check_circle');
        updateUserProfile({ name, lastName, email, phone });
        setIsEditModalOpen(false);
      } else {
        showToast('Error al actualizar perfil', 'danger');
      }
    } catch (error) {
      showToast('Error de conexión con el servidor', 'danger');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 pb-24">
      {/* Top Admin Bar */}
      <IonHeader className="bg-white/80 backdrop-blur-md border-b border-slate-200">
        <IonToolbar>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-yellow-400 text-slate-900 flex items-center justify-center font-bold text-xs">
              AR
            </div>
            <div>
              <IonTitle className="text-slate-900 font-bold">AutoRescate Control</IonTitle>
              <p className="text-[10px] text-slate-400">Perfil y Permisos de Administrador</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors cursor-pointer"
              title="Editar Perfil"
            >
              <span className="material-symbols-outlined text-xl">manage_accounts</span>
            </button>
          </div>
        </IonToolbar>
      </IonHeader>

      {/* Main Container */}
      <div className="flex-1 max-w-5xl w-full mx-auto p-4 space-y-5">
        {/* Navigation Quick Pills */}
        <div className="flex gap-2 overflow-x-auto pb-1 hide-scrollbar">
          <button
            onClick={() => navigateTo('/admin/dashboard')}
            className="px-4 py-2 rounded-xl bg-white text-slate-700 border border-slate-200 text-xs font-bold flex items-center gap-1.5 hover:bg-slate-50 whitespace-nowrap cursor-pointer shadow-2xs"
          >
            <span className="material-symbols-outlined text-sm">dashboard</span>
            Dashboard
          </button>

          <button
            onClick={() => navigateTo('/admin/mechanics')}
            className="px-4 py-2 rounded-xl bg-white text-slate-700 border border-slate-200 text-xs font-bold flex items-center gap-1.5 hover:bg-slate-50 whitespace-nowrap cursor-pointer shadow-2xs"
          >
            <span className="material-symbols-outlined text-sm text-blue-600">verified_user</span>
            Validación ({pendingMechanics.filter((m) => m.status === 'pending').length})
          </button>

          <button
            onClick={() => navigateTo('/admin/map')}
            className="px-4 py-2 rounded-xl bg-white text-slate-700 border border-slate-200 text-xs font-bold flex items-center gap-1.5 hover:bg-slate-50 whitespace-nowrap cursor-pointer shadow-2xs"
          >
            <span className="material-symbols-outlined text-sm text-emerald-600">map</span>
            Mapa de Flota
          </button>

          <button
            onClick={() => navigateTo('/admin/profile')}
            className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm whitespace-nowrap cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">admin_panel_settings</span>
            Perfil Admin
          </button>
        </div>

        {/* Administrator Identity Header Card */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs relative overflow-hidden">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
            <div className="relative">
              <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-slate-900 shadow-sm">
                <AppImage
                  src={currentUser.avatarUrl}
                  alt={name}
                  type="avatar"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-1 -right-1 bg-slate-900 text-yellow-400 w-6 h-6 rounded-full flex items-center justify-center shadow-xs">
                <span className="material-symbols-outlined text-xs">shield_person</span>
              </div>
            </div>

            <div className="flex-1 text-center sm:text-left space-y-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h2 className="text-xl font-bold text-slate-900">
                  {name} {lastName}
                </h2>
                <span className="px-2.5 py-0.5 rounded-lg bg-slate-900 text-yellow-400 font-bold text-[10px] uppercase tracking-wider">
                  Super Administrador
                </span>
              </div>

              <p className="text-xs text-slate-500 font-medium">{email}</p>
              <p className="text-xs text-slate-600 flex items-center justify-center sm:justify-start gap-1">
                <span className="material-symbols-outlined text-sm text-slate-400">call</span>
                {phone}
              </p>

              <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-2 text-xs">
                <span className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 font-bold border border-blue-200 flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs">vpn_key</span>
                  Credencial ADM-004
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 font-bold border border-emerald-200 flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs">security</span>
                  Nivel 1 (Control Total)
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-yellow-50 text-yellow-800 font-bold border border-yellow-200 flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs">domain</span>
                  Torre de Control CDMX
                </span>
              </div>
            </div>

            <div className="text-right">
              <button
                onClick={() => setIsEditModalOpen(true)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">edit</span>
                <span>Editar Datos</span>
              </button>
            </div>
          </div>
        </div>

        {/* Global Access & Permission Matrix */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-slate-900">Matriz de Permisos y Privilegios</h3>
              <p className="text-xs text-slate-500">Capacidades asignadas a tu cuenta de operador maestro</p>
            </div>
            <IonBadge color="success" className="font-bold text-[10px]">
              Privilegios Activos
            </IonBadge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              {
                title: 'Despacho y Radar de Flota en Vivo',
                desc: 'Visualización de unidades GPS, telemetría y reasignación de grúas.',
                icon: 'radar',
                color: 'text-blue-600 bg-blue-50 border-blue-100',
              },
              {
                title: 'Validación de Prestadores y Documentos',
                desc: 'Aprobación, bloqueo temporal o revocación de expedientes de mecánicos.',
                icon: 'verified_user',
                color: 'text-emerald-600 bg-emerald-50 border-emerald-100',
              },
              {
                title: 'Resolución de Disputas Financieras',
                desc: 'Aprobación de reembolsos, ajustes de tarifa y cobros directos.',
                icon: 'gavel',
                color: 'text-purple-600 bg-purple-50 border-purple-100',
              },
              {
                title: 'Auditoría Forense y Logs de Seguridad',
                desc: 'Consulta de bitácoras de servidor, accesos y transacciones.',
                icon: 'policy',
                color: 'text-slate-700 bg-slate-100 border-slate-200',
              },
            ].map((perm, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3"
              >
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold shrink-0 border ${perm.color}`}>
                  <span className="material-symbols-outlined text-lg">{perm.icon}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-xs text-slate-900">{perm.title}</h4>
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-100/60 px-1.5 py-0.5 rounded">
                      Habilitado
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">{perm.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Security & System Session Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-2xs space-y-4">
            <h3 className="font-bold text-sm text-slate-900">Seguridad y Autenticación</h3>

            <div className="space-y-3 divide-y divide-slate-100 text-xs">
              <div className="flex items-center justify-between pt-1">
                <div>
                  <p className="font-bold text-slate-900">Autenticación en Dos Pasos (2FA)</p>
                  <p className="text-slate-500 text-[11px]">Llave de seguridad FIDO2 / Authenticator activo</p>
                </div>
                <IonToggle checked={twoFactorEnabled} onIonChange={setTwoFactorEnabled} />
              </div>

              <div className="flex items-center justify-between pt-3">
                <div>
                  <p className="font-bold text-slate-900">Alertas de Código Rojo en Vivo</p>
                  <p className="text-slate-500 text-[11px]">Notificaciones push inmediatas de accidentes graves</p>
                </div>
                <IonToggle checked={emergencyAlertsEnabled} onIonChange={setEmergencyAlertsEnabled} />
              </div>

              <div className="flex items-center justify-between pt-3">
                <div>
                  <p className="font-bold text-slate-900">Registro de Auditoría de Sesión</p>
                  <p className="text-slate-500 text-[11px]">Guardar bitácora de cada acción administrativa</p>
                </div>
                <IonToggle checked={auditLogNotification} onIonChange={setAuditLogNotification} />
              </div>
            </div>
          </div>

          {/* Session Diagnostics */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-2xs space-y-4 flex flex-col justify-between">
            <div>
              <h3 className="font-bold text-sm text-slate-900 mb-3">Diagnóstico de Conexión de Torre</h3>
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-slate-500">Dirección IP de Enlace:</span>
                  <span className="font-mono font-bold text-slate-800">189.240.12.88 (TLS 1.3)</span>
                </div>
                <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-slate-500">Nodo de Control:</span>
                  <span className="font-bold text-emerald-700">Torre Central Insurgentes</span>
                </div>
                <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-slate-500">Latencia de Telemetría:</span>
                  <span className="font-bold text-slate-800">18 ms (Óptimo)</span>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => showToast('Auditoría de seguridad ejecutada: Cero anomalías detectadas', 'success', 'shield')}
                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">security_update_good</span>
                <span>Ejecutar Verificación de Integridad</span>
              </button>
            </div>
          </div>
        </div>

        {/* Recent Administrative Audit Trail */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900">Bitácora Reciente de Acciones Administrativas</h3>
            <button
              onClick={() => showToast('Exportando reporte de auditoría en formato CSV cifrado', 'primary', 'download')}
              className="text-xs text-blue-600 font-bold hover:underline cursor-pointer flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-sm">download</span>
              Descargar Log
            </button>
          </div>

          <div className="space-y-2">
            {[
              {
                action: 'Aprobación de Expediente Técnico',
                detail: 'Validó documentación del mecánico Carlos Mendoza (ID: MEC-88)',
                time: 'Hace 2 horas',
                icon: 'verified_user',
                badge: 'Aprobación',
                color: 'text-emerald-600',
              },
              {
                action: 'Ajuste de Tarifa Operativa',
                detail: 'Actualizó tarifa de arrastre nocturno en zona Periférico Sur',
                time: 'Hace 4 horas',
                icon: 'price_change',
                badge: 'Tarifas',
                color: 'text-blue-600',
              },
              {
                action: 'Resolución de Disputa Financiera',
                detail: 'Resolvió solicitud de aclaración SR-4010 con compensación de $200 MXN',
                time: 'Ayer, 16:40',
                icon: 'gavel',
                badge: 'Disputa',
                color: 'text-purple-600',
              },
            ].map((log, idx) => (
              <div
                key={idx}
                className="p-3 bg-slate-50 rounded-xl flex items-center justify-between gap-3 text-xs border border-slate-200"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white text-slate-700 flex items-center justify-center font-bold border border-slate-200 shadow-2xs">
                    <span className={`material-symbols-outlined text-base ${log.color}`}>{log.icon}</span>
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">{log.action}</p>
                    <p className="text-[11px] text-slate-500">{log.detail}</p>
                  </div>
                </div>
                <div className="text-right whitespace-nowrap">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-200 text-slate-700">
                    {log.badge}
                  </span>
                  <p className="text-[10px] text-slate-400 mt-1">{log.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Danger Zone & Logout */}
        <div className="bg-white rounded-3xl p-4 border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            <h4 className="font-bold text-sm text-slate-900">Sesión Administrativa</h4>
            <p className="text-xs text-slate-500">Cierra tu sesión cuando abandones la estación de control.</p>
          </div>
          <button
            onClick={logout}
            className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer whitespace-nowrap"
          >
            <span className="material-symbols-outlined text-base">logout</span>
            <span>Cerrar Sesión de Administrador</span>
          </button>
        </div>
      </div>

      {/* Edit Admin Modal */}
      <IonModal isOpen={isEditModalOpen} onDidDismiss={() => setIsEditModalOpen(false)}>
        <div className="p-5 max-w-lg mx-auto bg-white min-h-screen sm:min-h-0 sm:rounded-3xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-bold text-base text-slate-900">Editar Perfil de Administrador</h3>
            <button
              onClick={() => setIsEditModalOpen(false)}
              className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200 cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">close</span>
            </button>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nombre</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:border-blue-600 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Apellidos</label>
                <input
                  type="text"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:border-blue-600 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Correo Institucional</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:border-blue-600 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Teléfono Directo de Torre</label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:border-blue-600 outline-none"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="flex-1 py-3 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl hover:bg-slate-200 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex-1 py-3 bg-blue-600 text-white font-bold text-xs rounded-xl shadow-sm hover:bg-blue-700 active:scale-98 cursor-pointer"
              >
                Guardar Cambios
              </button>
            </div>
          </form>
        </div>
      </IonModal>
    </div>
  );
};