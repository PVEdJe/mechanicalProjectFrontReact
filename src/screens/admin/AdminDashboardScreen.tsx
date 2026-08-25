import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { AppImage } from '../../components/shared/AppImage';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonAvatar,
} from '../../components/ionic/IonicComponents';

export const AdminDashboardScreen: React.FC = () => {
  const { currentUser, navigateTo } = useApp();
  
  // Estados para datos reales
  const [rescues, setRescues] = useState<any[]>([]);
  const [pendingMechanicsCount, setPendingMechanicsCount] = useState(0); // Estado real
  const [stats, setStats] = useState({
    activos: 0,
    enRuta: 0,
    enSitio: 0,
    flotaTotal: 0,
    flotaDisponible: 0,
    facturacion: 0
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('access_token');
        if (!token) return;

        // Cargar todos los rescates
        const rescuesRes = await fetch(`http://localhost:3000/rescues`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        // Cargar todos los usuarios para armar la flota y validaciones
        const usersRes = await fetch(`http://localhost:3000/users/mecanicos/lista`, {
           headers: { 'Authorization': `Bearer ${token}` }
        });

        if (rescuesRes.ok && usersRes.ok) {
          const allRescues = await rescuesRes.json();
          const allMechanics = await usersRes.json();

          //Conteo de mecánicos pendientes 
          const pendientes = allMechanics.filter((m: any) => m.validationStatus === 'pending');
          setPendingMechanicsCount(pendientes.length);

          // Cálculos de Rescates Activos
          const activeRescues = allRescues.filter((r: any) => ['PENDING', 'ACCEPTED', 'EN_ROUTE', 'ON_SITE', 'IN_PROGRESS'].includes(r.status));
          const enRutaCount = allRescues.filter((r: any) => ['ACCEPTED', 'EN_ROUTE'].includes(r.status)).length;
          const enSitioCount = allRescues.filter((r: any) => ['ON_SITE', 'IN_PROGRESS'].includes(r.status)).length;

          // Cálculo de Facturación (Suma de los finalizados)
          const facturacionTotal = allRescues
            .filter((r: any) => r.status === 'COMPLETED' && r.totalCost)
            .reduce((acc: number, r: any) => acc + Number(r.totalCost), 0);

          // Cálculos de Flota
          const activosCount = allMechanics.filter((m: any) => m.isAvailable).length;

          setStats({
            activos: activeRescues.length,
            enRuta: enRutaCount,
            enSitio: enSitioCount,
            flotaTotal: allMechanics.length,
            flotaDisponible: activosCount,
            facturacion: facturacionTotal
          });

          setRescues(allRescues.reverse().slice(0, 10));
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 4000); // Refresco cada 4 segundos
    return () => clearInterval(interval);
  }, []);

  // Helper para asignar colores a la tabla
  const getBadgeStyle = (status: string) => {
    if (['PENDING'].includes(status)) return 'bg-yellow-50 text-yellow-800 border-yellow-200';
    if (['ACCEPTED', 'EN_ROUTE'].includes(status)) return 'bg-blue-50 text-blue-700 border-blue-200';
    if (['ON_SITE', 'IN_PROGRESS'].includes(status)) return 'bg-purple-50 text-purple-700 border-purple-200';
    if (['COMPLETED'].includes(status)) return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    return 'bg-red-50 text-red-700 border-red-200'; // Cancelled
  };

  const getStatusText = (status: string) => {
    const map: Record<string, string> = {
      'PENDING': 'Buscando',
      'ACCEPTED': 'En camino',
      'EN_ROUTE': 'En camino',
      'ON_SITE': 'En sitio',
      'IN_PROGRESS': 'Reparando',
      'COMPLETED': 'Completado',
      'CANCELLED': 'Cancelado'
    };
    return map[status] || status;
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
              {pendingMechanicsCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-red-600 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {pendingMechanicsCount}
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
            Validación de Mecánicos ({pendingMechanicsCount})
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
        {pendingMechanicsCount > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-2xl flex items-center justify-between gap-3 shadow-2xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-yellow-400 text-slate-900 flex items-center justify-center font-bold shrink-0">
                <span className="material-symbols-outlined text-xl">pending_actions</span>
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-900">
                  {pendingMechanicsCount} Expediente(s) Pendientes de Validación
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
            <p className="text-2xl font-bold text-slate-900 mt-2">{stats.activos}</p>
            <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1 mt-1">
              <span className="material-symbols-outlined text-xs">trending_up</span> {stats.enRuta} en ruta • {stats.enSitio} en sitio
            </span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Flota Registrada
              </span>
              <span className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <span className="material-symbols-outlined text-base">local_shipping</span>
              </span>
            </div>
            <p className="text-2xl font-bold text-slate-900 mt-2">{stats.flotaTotal}</p>
            <span className="text-[10px] text-slate-400 font-medium mt-1">{stats.flotaDisponible} en turno recibiendo viajes</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Facturación Total
              </span>
              <span className="w-7 h-7 rounded-lg bg-yellow-50 text-yellow-700 flex items-center justify-center">
                <span className="material-symbols-outlined text-base">payments</span>
              </span>
            </div>
            <p className="text-2xl font-bold text-slate-900 mt-2">${stats.facturacion.toLocaleString('es-MX')}</p>
            <span className="text-[10px] text-emerald-600 font-semibold mt-1">En tiempo real</span>
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
                  <th className="p-3">Estado</th>
                  <th className="p-3 rounded-r-xl text-right">Monto</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rescues.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-slate-400">No hay servicios registrados aún.</td>
                  </tr>
                ) : (
                  rescues.map((row) => (
                    <tr key={row.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-3 font-mono font-bold text-slate-900">{row.id.substring(0,8).toUpperCase()}</td>
                      <td className="p-3">
                        <p className="font-bold text-slate-900">{row.client ? `${row.client.firstName} ${row.client.lastName}` : 'Desconocido'}</p>
                        <p className="text-[10px] text-slate-400 truncate max-w-[150px]">{row.vehicle ? `${row.vehicle.marca} ${row.vehicle.modelo} (${row.vehicle.placas})` : 'Vehículo'}</p>
                      </td>
                      <td className="p-3 font-medium text-slate-700 truncate max-w-[150px]">{row.description}</td>
                      <td className="p-3 text-blue-600 font-medium">
                        {row.mechanic ? `${row.mechanic.firstName} ${row.mechanic.lastName}` : 'Buscando...'}
                      </td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getBadgeStyle(row.status)}`}>
                          {getStatusText(row.status)}
                        </span>
                      </td>
                      <td className="p-3 text-right font-bold text-slate-900">
                        ${row.totalCost || row.estimatedCost || 0}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};