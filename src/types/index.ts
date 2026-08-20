export type UserRole = 'cliente' | 'mecanico' | 'admin';

export interface User {
  id: string;
  name: string;
  lastName: string;
  email: string;
  phone: string;
  role: UserRole;
  avatarUrl: string;
  // Client specific
  vehicles?: Vehicle[];
  activeVehicleId?: string;
  // Mechanic specific
  specialties?: string[];
  yearsExperience?: number;
  description?: string;
  serviceVehicle?: ServiceVehicle;
  documents?: {
    idCard: boolean;
    license: boolean;
    insurance: boolean;
  };
  validationStatus?: 'approved' | 'pending' | 'rejected';
  isOnline?: boolean;
  rating?: number;
  completedServicesCount?: number;
  dailyEarnings?: number;
}

export interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  color: string;
  plate: string;
  imageUrl?: string;
  isPrimary?: boolean;
}

export interface ServiceVehicle {
  type: string; // e.g. Grúa Plataforma, Taller Móvil, Grúa de Arrastre
  make: string;
  model: string; // e.g. Ford F-450 Heavy Duty
  year: number;
  plate: string;
  color?: string;
  vin?: string;
  capacity?: string;
  insurancePolicy?: string;
  insuranceExpiry?: string;
  equipment?: string[];
  imageUrl?: string;
  verified?: boolean;
}

export type IssueType =
  | 'tire'
  | 'battery'
  | 'engine'
  | 'fuel'
  | 'accident'
  | 'electrical'
  | 'keys'
  | 'tow'
  | 'other';

export interface IssueOption {
  id: IssueType;
  title: string;
  icon: string;
  description: string;
  suggestedCost: number;
}

export type ServiceStatus =
  | 'searching'
  | 'accepted'
  | 'on_the_way'
  | 'arrived'
  | 'in_progress'
  | 'completed'
  | 'cancelled';

export interface ServiceRequest {
  id: string;
  clientId: string;
  clientName: string;
  clientPhone: string;
  clientAvatar: string;
  vehicle: Vehicle;
  issue: IssueType;
  issueTitle: string;
  description: string;
  photoUrl?: string;
  location: {
    address: string;
    city: string;
    lat: number;
    lng: number;
    reference?: string;
  };
  mechanic?: {
    id: string;
    name: string;
    phone: string;
    avatar: string;
    vehicleType: string;
    vehicleModel: string;
    rating: number;
    servicesCount: number;
    location: {
      lat: number;
      lng: number;
    };
  };
  status: ServiceStatus;
  etaMinutes: number;
  distanceKm: number;
  estimatedCost: number;
  finalCost?: number;
  breakdown?: {
    labor: number;
    parts: number;
    piecesUsed: string;
  };
  createdAt: string;
  timeline: {
    acceptedAt?: string;
    onTheWayAt?: string;
    arrivedAt?: string;
    startedAt?: string;
    completedAt?: string;
  };
}

export interface Dispute {
  id: string;
  serviceId: string;
  reason: string;
  status: 'En Revisión' | 'Pendiente' | 'Resuelto';
  clientName: string;
  mechanicName: string;
  amount: number;
  date: string;
}

export interface CriticalAlert {
  id: string;
  serviceId: string;
  title: string;
  description: string;
  severity: 'high' | 'medium';
  time: string;
}

export interface PendingMechanic {
  id: string;
  name: string;
  avatarUrl: string;
  specialties: string[];
  experienceYears: number;
  phone: string;
  email: string;
  serviceVehicle: {
    type: string;
    make: string;
    model: string;
    year: number;
    plate: string;
  };
  documents: Array<{ id: string; title: string; verified: boolean }>;
  submittedDate: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface ServiceHistoryItem {
  id: string;
  serviceTitle: string;
  issueType: IssueType;
  vehicleName: string;
  date: string;
  mechanicName: string;
  cost: number;
  rating?: number;
  status: 'completed' | 'cancelled';
  locationAddress: string;
}
