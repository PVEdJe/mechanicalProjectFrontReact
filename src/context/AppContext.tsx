import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  User,
  Vehicle,
  ServiceRequest,
  IssueType,
  IssueOption,
  Dispute,
  CriticalAlert,
  UserRole,
  PendingMechanic,
} from '../types';

export const ISSUE_OPTIONS: IssueOption[] = [
  {
    id: 'tire',
    title: 'Llanta ponchada',
    icon: 'tire_repair',
    description: 'Cambio de neumático o reparación de ponchadura en sitio.',
    suggestedCost: 350,
  },
  {
    id: 'battery',
    title: 'Batería descargada',
    icon: 'battery_charging_full',
    description: 'Paso de corriente con cables o recarga rápida asistida.',
    suggestedCost: 250,
  },
  {
    id: 'engine',
    title: 'Problema de motor',
    icon: 'car_repair',
    description: 'Sobrecalentamiento, ruidos anormales o paro repentino.',
    suggestedCost: 550,
  },
  {
    id: 'fuel',
    title: 'Sin combustible',
    icon: 'local_gas_station',
    description: 'Suministro de gasolina de emergencia (hasta 5 litros).',
    suggestedCost: 300,
  },
  {
    id: 'accident',
    title: 'Accidente',
    icon: 'minor_crash',
    description: 'Colisión o siniestro vial que requiere arrastre o peritaje.',
    suggestedCost: 1200,
  },
  {
    id: 'electrical',
    title: 'Fallo eléctrico',
    icon: 'electric_bolt',
    description: 'Luces, alternador, fusibles o sistema de encendido.',
    suggestedCost: 400,
  },
  {
    id: 'keys',
    title: 'Llaves dentro/perdidas',
    icon: 'key',
    description: 'Apertura cerrajera automotriz especializada sin daño.',
    suggestedCost: 450,
  },
  {
    id: 'other',
    title: 'Otro problema',
    icon: 'help',
    description: 'Diagnóstico general y evaluación mecánica en sitio.',
    suggestedCost: 350,
  },
];

export const INITIAL_VEHICLES: Vehicle[] = [
  {
    id: 'v-1',
    make: 'Tesla',
    model: 'Model 3',
    year: 2023,
    color: 'Blanco Perla',
    plate: 'ABC-1234',
    imageUrl: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800&auto=format&fit=crop&q=60',
    isPrimary: true,
  },
  {
    id: 'v-2',
    make: 'Toyota',
    model: 'Corolla',
    year: 2022,
    color: 'Gris Plata',
    plate: 'XYZ-1234',
    imageUrl: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800&auto=format&fit=crop&q=60',
    isPrimary: false,
  },
  {
    id: 'v-3',
    make: 'Toyota',
    model: 'RAV4',
    year: 2021,
    color: 'Gris Metálico',
    plate: 'XYZ-9876',
    imageUrl: 'https://images.unsplash.com/photo-1581540222194-0def2dda95b8?w=800&auto=format&fit=crop&q=60',
    isPrimary: false,
  },
];

const INITIAL_CLIENT: User = {
  id: 'user-client-1',
  name: 'Salvador',
  lastName: 'Hernández',
  email: 'salvador.hdz@ejemplo.com',
  phone: '+52 55 4192 8830',
  role: 'cliente',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
  vehicles: INITIAL_VEHICLES,
  activeVehicleId: 'v-1',
};

const INITIAL_MECHANIC: User = {
  id: 'user-mech-1',
  name: 'Carlos',
  lastName: 'Mendoza',
  email: 'carlos.m@autorescate.mx',
  phone: '+52 55 7821 9044',
  role: 'mecanico',
  avatarUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&auto=format&fit=crop&q=80',
  specialties: ['Baterías', 'Neumáticos', 'Grúa Plataforma', 'Diagnóstico Eléctrico'],
  yearsExperience: 8,
  description: 'Mecánico certificado con equipo hidráulico móvil y grúa plataforma pesada.',
  serviceVehicle: {
    type: 'Grúa Plataforma',
    make: 'Ford',
    model: 'F-450 Heavy Duty',
    year: 2022,
    plate: 'GR-492-CD',
  },
  validationStatus: 'approved',
  isOnline: true,
  rating: 4.9,
  completedServicesCount: 124,
  dailyEarnings: 1450,
};

const INITIAL_ADMIN: User = {
  id: 'user-admin-1',
  name: 'Valeria',
  lastName: 'Ríos',
  email: 'admin@autorescate.mx',
  phone: '+52 55 9000 1122',
  role: 'admin',
  avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
};

const INITIAL_ACTIVE_REQUEST: ServiceRequest = {
  id: 'SR-4092',
  clientId: 'user-client-1',
  clientName: 'Salvador Hernández',
  clientPhone: '+52 55 4192 8830',
  clientAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
  vehicle: INITIAL_VEHICLES[0],
  issue: 'tire',
  issueTitle: 'Llanta ponchada',
  description: 'Neumático delantero derecho desinflado en lateral de periférico tras caer en bache.',
  location: {
    address: 'Av. Insurgentes Sur 1024, Col. Del Valle',
    city: 'Ciudad de México',
    lat: 19.3824,
    lng: -99.1765,
    reference: 'Frente a Torre Mural',
  },
  mechanic: {
    id: 'user-mech-1',
    name: 'Carlos M.',
    phone: '+52 55 7821 9044',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&auto=format&fit=crop&q=80',
    vehicleType: 'Grúa Plataforma',
    vehicleModel: 'Ford F-450',
    rating: 4.9,
    servicesCount: 124,
    location: {
      lat: 19.395,
      lng: -99.168,
    },
  },
  status: 'on_the_way',
  etaMinutes: 8,
  distanceKm: 2.4,
  estimatedCost: 350,
  createdAt: 'Hoy, 10:42 AM',
  timeline: {
    acceptedAt: '10:42 AM',
    onTheWayAt: 'Ahora',
  },
};

const INITIAL_HISTORY: ServiceRequest[] = [
  {
    id: 'SR-4077',
    clientId: 'user-client-1',
    clientName: 'Salvador Hernández',
    clientPhone: '+52 55 4192 8830',
    clientAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    vehicle: INITIAL_VEHICLES[1],
    issue: 'engine',
    issueTitle: 'Reparación de Motor Ligera',
    description: 'Calentamiento leve de radiador y cambio de abrazadera.',
    location: {
      address: 'Av. Paseo de la Reforma 230, Cuauhtémoc',
      city: 'Ciudad de México',
      lat: 19.429,
      lng: -99.164,
    },
    mechanic: {
      id: 'user-mech-1',
      name: 'Carlos M.',
      phone: '+52 55 7821 9044',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&auto=format&fit=crop&q=80',
      vehicleType: 'Móvil de Taller',
      vehicleModel: 'Nissan NP300',
      rating: 5.0,
      servicesCount: 124,
      location: { lat: 19.429, lng: -99.164 },
    },
    status: 'completed',
    etaMinutes: 0,
    distanceKm: 0,
    estimatedCost: 1250,
    finalCost: 1250,
    createdAt: '12 Oct, 14:30',
    timeline: {
      acceptedAt: '14:30',
      onTheWayAt: '14:35',
      arrivedAt: '14:45',
      startedAt: '14:50',
      completedAt: '15:25',
    },
  },
  {
    id: 'SR-4061',
    clientId: 'user-client-1',
    clientName: 'Salvador Hernández',
    clientPhone: '+52 55 4192 8830',
    clientAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    vehicle: INITIAL_VEHICLES[0],
    issue: 'battery',
    issueTitle: 'Paso de Corriente',
    description: 'Batería auxiliar de 12V descargada en sótano 2.',
    location: {
      address: 'Estacionamiento Plaza Sur, Coyoacán',
      city: 'Ciudad de México',
      lat: 19.345,
      lng: -99.17,
    },
    status: 'cancelled',
    etaMinutes: 0,
    distanceKm: 0,
    estimatedCost: 450,
    createdAt: '08 Oct, 09:15',
    timeline: {
      acceptedAt: '09:15',
    },
  },
];

const INITIAL_DISPUTES: Dispute[] = [
  {
    id: '#D-102',
    serviceId: 'SR-4082',
    reason: 'Daño al vehículo durante grúa',
    status: 'En Revisión',
    clientName: 'Roberto Garza',
    mechanicName: 'Juan Morales',
    amount: 1800,
    date: 'Hace 2 horas',
  },
  {
    id: '#D-101',
    serviceId: 'SR-4080',
    reason: 'Cobro indebido (Extra no autorizado)',
    status: 'Pendiente',
    clientName: 'Mariana Silva',
    mechanicName: 'Pedro Alarcón',
    amount: 450,
    date: 'Ayer',
  },
  {
    id: '#D-099',
    serviceId: 'SR-4071',
    reason: 'Mecánico no se presentó a tiempo',
    status: 'Resuelto',
    clientName: 'Fernando Téllez',
    mechanicName: 'Carlos Mendoza',
    amount: 300,
    date: '10 Oct',
  },
];

const INITIAL_ALERTS: CriticalAlert[] = [
  {
    id: 'ALT-1',
    serviceId: '#4088',
    title: 'Retraso Extremo - Servicio #4088',
    description: 'El mecánico lleva +45 min de retraso en lateral Viaducto. Cliente molesto.',
    severity: 'high',
    time: 'Hace 5 min',
  },
  {
    id: 'ALT-2',
    serviceId: '#4085',
    title: 'Fallo de Pago - Servicio #4085',
    description: 'Tarjeta Visa rechazada al finalizar el servicio de cambio de alternador.',
    severity: 'medium',
    time: 'Hace 18 min',
  },
];

const INITIAL_PENDING_MECHANICS: PendingMechanic[] = [
  {
    id: 'mech-p-1',
    name: 'Alejandro Cruz Ramos',
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80',
    specialties: ['Grúas y Arrastre Pesado', 'Neumáticos de Carga'],
    experienceYears: 6,
    phone: '+52 55 3344 5566',
    email: 'alejandro.cruz@mecanicos.mx',
    serviceVehicle: {
      type: 'Grúa de Arrastre',
      make: 'Chevrolet',
      model: 'Kodiak 5500',
      year: 2020,
      plate: 'GR-882-A',
    },
    documents: [
      { id: 'd1', title: 'Licencia Federal Tipo E', verified: true },
      { id: 'd2', title: 'Póliza de Seguro de Responsabilidad Civil', verified: true },
      { id: 'd3', title: 'Constancia de No Antecedentes Penales', verified: true },
    ],
    submittedDate: '12 Ago 2026',
    status: 'pending',
  },
  {
    id: 'mech-p-2',
    name: 'Jorge Luis Morales',
    avatarUrl: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=400&auto=format&fit=crop&q=80',
    specialties: ['Electricidad Automotriz', 'Diagnóstico OBD2', 'Baterías'],
    experienceYears: 10,
    phone: '+52 55 8899 0011',
    email: 'jorge.morales@tallerobd.com',
    serviceVehicle: {
      type: 'Taller Móvil',
      make: 'Nissan',
      model: 'NV350 Urvan',
      year: 2022,
      plate: 'CD-491-B',
    },
    documents: [
      { id: 'd1', title: 'Certificación ASE Master Tech', verified: true },
      { id: 'd2', title: 'Identificación Oficial INE', verified: true },
      { id: 'd3', title: 'Póliza de Taller Móvil Cobertura Amplia', verified: true },
    ],
    submittedDate: '11 Ago 2026',
    status: 'pending',
  },
  {
    id: 'mech-p-3',
    name: 'María Fernanda Ruiz',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80',
    specialties: ['Baterías', 'Neumáticos', 'Cerrajería Automotriz'],
    experienceYears: 4,
    phone: '+52 55 6677 8899',
    email: 'mafer.ruiz@asistenciamov.mx',
    serviceVehicle: {
      type: 'Unidad Rápida',
      make: 'Toyota',
      model: 'Hilux Doble Cabina',
      year: 2021,
      plate: 'MX-992-P',
    },
    documents: [
      { id: 'd1', title: 'Licencia de Conducir Tipo A', verified: true },
      { id: 'd2', title: 'Constancia de Cursos Cerrajeros', verified: true },
      { id: 'd3', title: 'Póliza de Seguro Vigente', verified: false },
    ],
    submittedDate: '09 Ago 2026',
    status: 'pending',
  },
];

interface AppContextType {
  currentUser: User;
  currentRole: UserRole;
  currentRoute: string;
  activeRequest: ServiceRequest | null;
  history: ServiceRequest[];
  vehicles: Vehicle[];
  disputes: Dispute[];
  alerts: CriticalAlert[];
  pendingMechanics: PendingMechanic[];
  mechanicOnline: boolean;
  isMechanicOnline: boolean;
  incomingOrderModal: boolean;
  toast: { isOpen: boolean; message: string; color?: 'primary' | 'success' | 'danger' | 'warning'; icon?: string } | null;
  // Actions
  setCurrentRole: (role: UserRole) => void;
  navigateTo: (route: string) => void;
  loginWithRole: (role: UserRole) => void;
  logout: () => void;
  showToast: (message: string, color?: 'primary' | 'success' | 'danger' | 'warning', icon?: string) => void;
  hideToast: () => void;
  createAssistanceRequest: (data: Partial<ServiceRequest>) => void;
  cancelActiveRequest: () => void;
  updateServiceStatus: (status: ServiceRequest['status']) => void;
  setMechanicOnline: (online: boolean) => void;
  setIsMechanicOnline: (online: boolean) => void;
  setIncomingOrderModal: (open: boolean) => void;
  acceptIncomingOrder: () => void;
  acceptIncomingRequest: () => void;
  rejectIncomingOrder: () => void;
  finishServiceAsMechanic: (labor: number, parts: number, pieces: string) => void;
  completeActiveService: (totalCost: number, rating?: number) => void;
  approveMechanic: (id: string) => void;
  rejectMechanic: (id: string, reason?: string) => void;
  addVehicle: (vehicle: Omit<Vehicle, 'id'>) => void;
  setPrimaryVehicle: (id: string) => void;
  deleteVehicle: (id: string) => void;
  removeVehicle: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentRole, setCurrentRoleState] = useState<UserRole>('cliente');
  const [currentUser, setCurrentUser] = useState<User>(INITIAL_CLIENT);
  const [currentRoute, setCurrentRoute] = useState<string>('/cliente/home');
  const [activeRequest, setActiveRequest] = useState<ServiceRequest | null>(INITIAL_ACTIVE_REQUEST);
  const [history, setHistory] = useState<ServiceRequest[]>(INITIAL_HISTORY);
  const [vehicles, setVehicles] = useState<Vehicle[]>(INITIAL_VEHICLES);
  const [disputes, setDisputes] = useState<Dispute[]>(INITIAL_DISPUTES);
  const [alerts, setAlerts] = useState<CriticalAlert[]>(INITIAL_ALERTS);
  const [pendingMechanics, setPendingMechanics] = useState<PendingMechanic[]>(INITIAL_PENDING_MECHANICS);
  const [mechanicOnline, setMechanicOnlineState] = useState<boolean>(true);
  const [incomingOrderModal, setIncomingOrderModal] = useState<boolean>(false);
  const [toast, setToast] = useState<{
    isOpen: boolean;
    message: string;
    color?: 'primary' | 'success' | 'danger' | 'warning';
    icon?: string;
  } | null>(null);

  const showToast = (message: string, color: 'primary' | 'success' | 'danger' | 'warning' = 'primary', icon?: string) => {
    setToast({ isOpen: true, message, color, icon });
  };

  const hideToast = () => {
    setToast(null);
  };

  const setCurrentRole = (role: UserRole) => {
    setCurrentRoleState(role);
    if (role === 'cliente') {
      setCurrentUser(INITIAL_CLIENT);
      setCurrentRoute('/cliente/home');
    } else if (role === 'mecanico') {
      setCurrentUser(INITIAL_MECHANIC);
      setCurrentRoute('/mecanico/home');
    } else if (role === 'admin') {
      setCurrentUser(INITIAL_ADMIN);
      setCurrentRoute('/admin/dashboard');
    }
  };

  const navigateTo = (route: string) => {
    setCurrentRoute(route);
  };

  const loginWithRole = (role: UserRole) => {
    setCurrentRole(role);
    showToast(`Bienvenido a AutoRescate (${role === 'cliente' ? 'Cliente' : role === 'mecanico' ? 'Mecánico' : 'Administrador'})`, 'success', 'check_circle');
  };

  const logout = () => {
    setCurrentRoute('/auth/welcome');
    showToast('Sesión cerrada correctamente', 'primary', 'logout');
  };

  const createAssistanceRequest = (data: Partial<ServiceRequest>) => {
    const primaryVeh = vehicles.find((v) => v.isPrimary) || vehicles[0];
    const newReq: ServiceRequest = {
      id: `SR-${Math.floor(4000 + Math.random() * 900)}`,
      clientId: currentUser.id,
      clientName: `${currentUser.name} ${currentUser.lastName}`,
      clientPhone: currentUser.phone,
      clientAvatar: currentUser.avatarUrl,
      vehicle: data.vehicle || primaryVeh,
      issue: data.issue || 'battery',
      issueTitle: data.issueTitle || 'Batería descargada',
      description: data.description || 'Asistencia solicitada en carretera',
      photoUrl: data.photoUrl,
      location: data.location || {
        address: 'Av. Insurgentes Sur 1024, Col. Del Valle',
        city: 'Ciudad de México',
        lat: 19.3824,
        lng: -99.1765,
      },
      mechanic: {
        id: 'user-mech-1',
        name: 'Carlos M.',
        phone: '+52 55 7821 9044',
        avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&auto=format&fit=crop&q=80',
        vehicleType: 'Grúa Plataforma',
        vehicleModel: 'Ford F-450',
        rating: 4.9,
        servicesCount: 124,
        location: { lat: 19.395, lng: -99.168 },
      },
      status: 'searching',
      etaMinutes: 8,
      distanceKm: 2.4,
      estimatedCost: 350,
      createdAt: 'Ahora mismo',
      timeline: {
        acceptedAt: 'Ahora',
      },
    };

    setActiveRequest(newReq);
    setCurrentRoute('/cliente/searching');
  };

  const cancelActiveRequest = () => {
    if (activeRequest) {
      const cancelled: ServiceRequest = {
        ...activeRequest,
        status: 'cancelled',
      };
      setHistory((prev) => [cancelled, ...prev]);
      setActiveRequest(null);
      showToast('Solicitud de asistencia cancelada', 'danger', 'cancel');
      setCurrentRoute('/cliente/home');
    }
  };

  const updateServiceStatus = (status: ServiceRequest['status']) => {
    if (!activeRequest) return;
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const updatedTimeline = { ...activeRequest.timeline };

    if (status === 'accepted') updatedTimeline.acceptedAt = now;
    if (status === 'on_the_way') updatedTimeline.onTheWayAt = now;
    if (status === 'arrived') updatedTimeline.arrivedAt = now;
    if (status === 'in_progress') updatedTimeline.startedAt = now;
    if (status === 'completed') updatedTimeline.completedAt = now;

    const updated = {
      ...activeRequest,
      status,
      timeline: updatedTimeline,
    };
    setActiveRequest(updated);

    if (status === 'completed') {
      setHistory((prev) => [updated, ...prev]);
    }
  };

  const setMechanicOnline = (online: boolean) => {
    setMechanicOnlineState(online);
    showToast(online ? '🟢 Estás en línea - Recibiendo solicitudes' : '⚪ Fuera de línea', online ? 'success' : 'primary');
  };

  const acceptIncomingOrder = () => {
    setIncomingOrderModal(false);
    updateServiceStatus('accepted');
    setCurrentRoute('/mecanico/service');
    showToast('¡Solicitud aceptada! Dirígete a la ubicación del cliente.', 'success', 'check_circle');
  };

  const rejectIncomingOrder = () => {
    setIncomingOrderModal(false);
    showToast('Solicitud rechazada', 'danger', 'close');
  };

  const finishServiceAsMechanic = (labor: number, parts: number, pieces: string) => {
    if (!activeRequest) return;
    const total = labor + parts;
    const finished: ServiceRequest = {
      ...activeRequest,
      status: 'completed',
      finalCost: total,
      breakdown: { labor, parts, piecesUsed: pieces },
    };
    setActiveRequest(null);
    setHistory((prev) => [finished, ...prev]);
    setCurrentRoute('/mecanico/home');
    showToast(`Servicio #${finished.id} finalizado con éxito ($${total} MXN)`, 'success', 'verified');
  };

  const completeActiveService = (totalCost: number) => {
    finishServiceAsMechanic(totalCost - 50, 50, 'Mano de obra y refacciones');
  };

  const approveMechanic = (id: string) => {
    setPendingMechanics((prev) =>
      prev.map((m) => (m.id === id ? { ...m, status: 'approved' } : m))
    );
    showToast('Mecánico aprobado satisfactoriamente', 'success', 'verified_user');
  };

  const rejectMechanic = (id: string) => {
    setPendingMechanics((prev) =>
      prev.map((m) => (m.id === id ? { ...m, status: 'rejected' } : m))
    );
    showToast('Solicitud de mecánico rechazada', 'danger', 'block');
  };

  const addVehicle = (vehData: Omit<Vehicle, 'id'>) => {
    const newVeh: Vehicle = {
      ...vehData,
      id: `v-${Date.now()}`,
    };
    setVehicles((prev) => [...prev, newVeh]);
    showToast(`${newVeh.make} ${newVeh.model} agregado a tu flota`, 'success', 'directions_car');
  };

  const setPrimaryVehicle = (id: string) => {
    setVehicles((prev) =>
      prev.map((v) => ({ ...v, isPrimary: v.id === id }))
    );
    showToast('Vehículo principal actualizado', 'primary', 'check');
  };

  const deleteVehicle = (id: string) => {
    setVehicles((prev) => prev.filter((v) => v.id !== id));
    showToast('Vehículo eliminado', 'danger', 'delete');
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        currentRole,
        currentRoute,
        activeRequest,
        history,
        vehicles,
        disputes,
        alerts,
        pendingMechanics,
        mechanicOnline,
        isMechanicOnline: mechanicOnline,
        incomingOrderModal,
        toast,
        setCurrentRole,
        navigateTo,
        loginWithRole,
        logout,
        showToast,
        hideToast,
        createAssistanceRequest,
        cancelActiveRequest,
        updateServiceStatus,
        setMechanicOnline,
        setIsMechanicOnline: setMechanicOnline,
        setIncomingOrderModal,
        acceptIncomingOrder,
        acceptIncomingRequest: acceptIncomingOrder,
        rejectIncomingOrder,
        finishServiceAsMechanic,
        completeActiveService,
        approveMechanic,
        rejectMechanic,
        addVehicle,
        setPrimaryVehicle,
        deleteVehicle,
        removeVehicle: deleteVehicle,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
