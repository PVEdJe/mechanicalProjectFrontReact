import React from 'react';
import { useApp } from '../../context/AppContext';
import { AppImage } from '../../components/shared/AppImage';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonAvatar,
} from '../../components/ionic/IonicComponents';

export const AdminDashboardScreen: React.FC = () => {
  const { currentUser, pendingMechanics, navigateTo } = useApp();

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
              <p className="text-[10px] text-slate-400">Panel Administrativo Global</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigateTo('/admin/mechanics')}
              className="relative p-2 text-slate-500 hover:text-slate-900 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
              title="Solicitudes pendientes"
            >
              <span className="material-symbols-outlined text-2xl">person_add</span>
              {pendingMechanics.filter((m) => m.status === 'pending').length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-red-600 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {pendingMechanics.filter((m) => m.status === 'pending').length}
                </span>
              )}
            </button>

            <div
              onClick={() => navigateTo('/admin/profile')}
              className="cursor-pointer active:scale-95 transition-transform"
              title="Ver Perfil de Administrador"
            >
              <IonAvatar size="sm" className="border border-slate-200 hover:border-blue-500">
                <AppImage
                  src={currentUser.avatarUrl}
                  alt={currentUser.name}
                  type="avatar"
                  className="w-full h-full object-cover"
                />
              </IonAvatar>
            </div>
          </div>
        </IonToolbar>
      </IonHeader>

      {/* Main Container */}
      <div className="flex-1 max-w-5xl w-full mx-auto p-4 space-y-5">
        {/* Navigation Quick Pills */}
        <div className="flex gap-2 overflow-x-auto pb-1 hide-scrollbar">
          <button
            onClick={() => navigateTo('/admin/dashboard')}
            className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm whitespace-nowrap cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">dashboard</span>
            Dashboard
          </button>

          <button
            onClick={() => navigateTo('/admin/mechanics')}
            className="px-4 py-2 rounded-xl bg-white text-slate-700 border border-slate-200 text-xs font-bold flex items-center gap-1.5 hover:bg-slate-50 whitespace-nowrap cursor-pointer shadow-2xs"
          >
            <span className="material-symbols-outlined text-sm text-blue-600">verified_user</span>
            Validación de Mecánicos ({pendingMechanics.filter((m) => m.status === 'pending').length})
          </button>

          <button
            onClick={() => navigateTo('/admin/map')}
            className="px-4 py-2 rounded-xl bg-white text-slate-700 border border-slate-200 text-xs font-bold flex items-center gap-1.5 hover:bg-slate-50 whitespace-nowrap cursor-pointer shadow-2xs"
          >
            <span className="material-symbols-outlined text-sm text-emerald-600">map</span>
            Mapa de Flota en Vivo
          </button>

          <button
            onClick={() => navigateTo('/admin/profile')}
            className="px-4 py-2 rounded-xl bg-white text-slate-700 border border-slate-200 text-xs font-bold flex items-center gap-1.5 hover:bg-slate-50 whitespace-nowrap cursor-pointer shadow-2xs"
          >
            <span className="material-symbols-outlined text-sm text-slate-600">admin_panel_settings</span>
            Perfil Admin
          </button>
        </div>

        {/* Pending Mechanic Alert Banner */}
        {pendingMechanics.filter((m) => m.status === 'pending').length > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-2xl flex items-center justify-between gap-3 shadow-2xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-yellow-400 text-slate-900 flex items-center justify-center font-bold shrink-0">
                <span className="material-symbols-outlined text-xl">pending_actions</span>
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-900">
                  {pendingMechanics.filter((m) => m.status === 'pending').length} Expediente(s) Pendientes de Validación
                </h4>
                <p className="text-xs text-slate-600">
                  Hay técnicos en espera de revisión documental para operar en la plataforma.
                </p>
              </div>
            </div>
            <button
              onClick={() => navigateTo('/admin/mechanics')}
              className="px-3.5 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 active:scale-95 transition-all whitespace-nowrap cursor-pointer"
            >
              Revisar
            </button>
          </div>
        )}

        {/* Operational Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Servicios Activos
              </span>
              <span className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <span className="material-symbols-outlined text-base">electric_bolt</span>
              </span>
            </div>
            <p className="text-2xl font-bold text-slate-900 mt-2">18</p>
            <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1 mt-1">
              <span className="material-symbols-outlined text-xs">trending_up</span> 6 en ruta • 12 en sitio
            </span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Flota Conectada
              </span>
              <span className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <span className="material-symbols-outlined text-base">local_shipping</span>
              </span>
            </div>
            <p className="text-2xl font-bold text-slate-900 mt-2">42</p>
            <span className="text-[10px] text-slate-400 font-medium mt-1">34 disponibles • 8 en turno</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Facturación Hoy
              </span>
              <span className="w-7 h-7 rounded-lg bg-yellow-50 text-yellow-700 flex items-center justify-center">
                <span className="material-symbols-outlined text-base">payments</span>
              </span>
            </div>
            <p className="text-2xl font-bold text-slate-900 mt-2">$48,920</p>
            <span className="text-[10px] text-emerald-600 font-semibold mt-1">+24% vs promedio</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Tiempo de Respuesta
              </span>
              <span className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <span className="material-symbols-outlined text-base">timer</span>
              </span>
            </div>
            <p className="text-2xl font-bold text-blue-600 mt-2">7.4 min</p>
            <span className="text-[10px] text-emerald-600 font-semibold mt-1">Meta &lt; 10 min cumplida</span>
          </div>
        </div>

        {/* Live Operational Dispatch Monitor */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-slate-900">Monitoreo de Despachos en Tiempo Real</h3>
              <p className="text-xs text-slate-500">Últimos eventos y solicitudes registradas en la red</p>
            </div>
            <button
              onClick={() => navigateTo('/admin/map')}
              className="px-3 py-1.5 bg-slate-50 text-blue-600 rounded-xl text-xs font-bold border border-slate-200 flex items-center gap-1 hover:bg-slate-100 cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">open_in_new</span>
              Ver en Mapa
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold">
                <tr>
                  <th className="p-3 rounded-l-xl">Folio</th>
                  <th className="p-3">Cliente / Vehículo</th>
                  <th className="p-3">Incidencia</th>
                  <th className="p-3">Mecánico Asignado</th>
                  <th className="p-3">Ubicación</th>
                  <th className="p-3">Estado</th>
                  <th className="p-3 rounded-r-xl text-right">Monto</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {[
                  {
                    id: 'SR-4092',
                    client: 'Salvador Hernández',
                    car: 'Tesla Model 3',
                    issue: 'Batería descargada',
                    mech: 'Carlos Mendoza (Grúa F-450)',
                    loc: 'Av. Insurgentes Sur 1024',
                    status: 'En camino (8m)',
                    badge: 'warning',
                    cost: '$350',
                  },
                  {
                    id: 'SR-4091',
                    client: 'Valeria Méndez',
                    car: 'Nissan Versa',
                    issue: 'Llanta ponchada',
                    mech: 'Roberto Sánchez (Taller Móvil)',
                    loc: 'Paseo de la Reforma 222',
                    status: 'En sitio',
                    badge: 'info',
                    cost: '$280',
                  },
                  {
                    id: 'SR-4090',
                    client: 'Alejandro Cruz',
                    car: 'Ford Mustang',
                    issue: 'Grúa de Arrastre',
                    mech: 'Arturo Gil (Grúa Plataforma)',
                    loc: 'Periférico Sur 4120',
                    status: 'Completado',
                    badge: 'success',
                    cost: '$850',
                  },
                  {
                    id: 'SR-4089',
                    client: 'Claudia Rivas',
                    car: 'Mazda 3',
                    issue: 'Sin Combustible',
                    mech: 'Luis Torres (Moto Asistencia)',
                    loc: 'Av. Patriotismo 560',
                    status: 'Completado',
                    badge: 'success',
                    cost: '$250',
                  },
                ].map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50">
                    <td className="p-3 font-mono font-bold text-slate-900">{row.id}</td>
                    <td className="p-3">
                      <p className="font-bold text-slate-900">{row.client}</p>
                      <p className="text-[10px] text-slate-400">{row.car}</p>
                    </td>
                    <td className="p-3 font-medium text-slate-700">{row.issue}</td>
                    <td className="p-3 text-blue-600 font-medium">{row.mech}</td>
                    <td className="p-3 text-slate-500 truncate max-w-[150px]">{row.loc}</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          row.badge === 'warning'
                            ? 'bg-yellow-50 text-yellow-800 border border-yellow-200'
                            : row.badge === 'info'
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        }`}
                      >
                        {row.status}
                      </span>
                    </td>
                    <td className="p-3 text-right font-bold text-slate-900">{row.cost}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
