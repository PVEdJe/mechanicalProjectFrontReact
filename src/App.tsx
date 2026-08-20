import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { IncomingRequestModal } from './screens/mecanico/IncomingRequestModal';

// Ionic Components
import {
  IonApp,
  IonRouterOutlet,
  IonTabs,
  IonTabBar,
  IonTabButton,
  IonToast,
} from './components/ionic/IonicComponents';

// Auth Screens
import { WelcomeScreen } from './screens/auth/WelcomeScreen';
import { LoginScreen } from './screens/auth/LoginScreen';
import { RegisterSelectScreen } from './screens/auth/RegisterSelectScreen';
import { RegisterClientScreen } from './screens/auth/RegisterClientScreen';
import { RegisterMechanicScreen } from './screens/auth/RegisterMechanicScreen';
import { RegisterAdminScreen } from './screens/auth/RegisterAdminScreen';

// Client Screens
import { ClientHomeScreen } from './screens/cliente/ClientHomeScreen';
import { RequestWizardScreen } from './screens/cliente/RequestWizardScreen';
import { SearchingScreen } from './screens/cliente/SearchingScreen';
import { TrackingScreen } from './screens/cliente/TrackingScreen';
import { VehiclesScreen } from './screens/cliente/VehiclesScreen';
import { HistoryScreen } from './screens/cliente/HistoryScreen';
import { ClientProfileScreen } from './screens/cliente/ClientProfileScreen';

// Mechanic Screens
import { MechanicHomeScreen } from './screens/mecanico/MechanicHomeScreen';
import { MechanicProfileScreen } from './screens/mecanico/MechanicProfileScreen';
import { MechanicVehicleScreen } from './screens/mecanico/MechanicVehicleScreen';
import { ServiceFlowScreen } from './screens/mecanico/ServiceFlowScreen';
import { FinalizeServiceScreen } from './screens/mecanico/FinalizeServiceScreen';

// Admin Screens
import { AdminDashboardScreen } from './screens/admin/AdminDashboardScreen';
import { MechanicValidationScreen } from './screens/admin/MechanicValidationScreen';
import { GlobalMapScreen } from './screens/admin/GlobalMapScreen';
import { AdminProfileScreen } from './screens/admin/AdminProfileScreen';

const MainRouter: React.FC = () => {
  const { currentRoute, currentRole, navigateTo, toast, hideToast } = useApp();

  // Render view based on route
  const renderScreen = () => {
    switch (currentRoute) {
      // Auth routes
      case '/auth/welcome':
        return <WelcomeScreen />;
      case '/auth/login':
        return <LoginScreen />;
      case '/auth/register':
        return <RegisterSelectScreen />;
      case '/auth/register/client':
        return <RegisterClientScreen />;
      case '/auth/register/mechanic':
        return <RegisterMechanicScreen />;
      case '/auth/register/admin':
        return <RegisterAdminScreen />;

      // Client routes
      case '/cliente/home':
        return <ClientHomeScreen />;
      case '/cliente/request':
        return <RequestWizardScreen />;
      case '/cliente/searching':
        return <SearchingScreen />;
      case '/cliente/tracking':
        return <TrackingScreen />;
      case '/cliente/vehicles':
        return <VehiclesScreen />;
      case '/cliente/history':
        return <HistoryScreen />;
      case '/cliente/profile':
        return <ClientProfileScreen />;

      // Mechanic routes
      case '/mecanico/home':
        return <MechanicHomeScreen />;
      case '/mecanico/vehicle':
        return <MechanicVehicleScreen />;
      case '/mecanico/profile':
        return <MechanicProfileScreen />;
      case '/mecanico/service-flow':
        return <ServiceFlowScreen />;
      case '/mecanico/finalize':
        return <FinalizeServiceScreen />;

      // Admin routes
      case '/admin/dashboard':
        return <AdminDashboardScreen />;
      case '/admin/mechanics':
        return <MechanicValidationScreen />;
      case '/admin/map':
        return <GlobalMapScreen />;
      case '/admin/profile':
        return <AdminProfileScreen />;

      default:
        return <ClientHomeScreen />;
    }
  };

  // Determine if client bottom tab bar should be visible
  const isClientTabRoute =
    currentRole === 'cliente' &&
    ['/cliente/home', '/cliente/history', '/cliente/vehicles', '/cliente/profile'].includes(
      currentRoute
    );

  // Determine if mechanic bottom tab bar should be visible
  const isMechanicTabRoute =
    currentRole === 'mecanico' &&
    ['/mecanico/home', '/mecanico/vehicle', '/mecanico/profile'].includes(
      currentRoute
    );

  return (
    <IonApp>
      

      {/* Mechanic Incoming Order Modal Listener */}
      <IncomingRequestModal />

      {/* Main Screen Outlet */}
      <IonRouterOutlet>{renderScreen()}</IonRouterOutlet>

      {/* Bottom Tabs for Client Role */}
      {isClientTabRoute && (
        <IonTabBar>
          <IonTabButton
            tab="home"
            title="Solicitar"
            icon="emergency"
            selected={currentRoute === '/cliente/home'}
            onClick={() => navigateTo('/cliente/home')}
          />
          <IonTabButton
            tab="history"
            title="Historial"
            icon="history"
            selected={currentRoute === '/cliente/history'}
            onClick={() => navigateTo('/cliente/history')}
          />
          <IonTabButton
            tab="vehicles"
            title="Vehículos"
            icon="directions_car"
            selected={currentRoute === '/cliente/vehicles'}
            onClick={() => navigateTo('/cliente/vehicles')}
          />
          <IonTabButton
            tab="profile"
            title="Perfil"
            icon="person"
            selected={currentRoute === '/cliente/profile'}
            onClick={() => navigateTo('/cliente/profile')}
          />
        </IonTabBar>
      )}

      {/* Bottom Tabs for Mechanic Role */}
      {isMechanicTabRoute && (
        <IonTabBar>
          <IonTabButton
            tab="home"
            title="Radar / Inicio"
            icon="radar"
            selected={currentRoute === '/mecanico/home'}
            onClick={() => navigateTo('/mecanico/home')}
          />
          <IonTabButton
            tab="vehicle"
            title="Mi Unidad"
            icon="local_shipping"
            selected={currentRoute === '/mecanico/vehicle'}
            onClick={() => navigateTo('/mecanico/vehicle')}
          />
          <IonTabButton
            tab="profile"
            title="Mi Perfil"
            icon="badge"
            selected={currentRoute === '/mecanico/profile'}
            onClick={() => navigateTo('/mecanico/profile')}
          />
        </IonTabBar>
      )}

      {/* Global Toast */}
      {toast && toast.isOpen && (
        <IonToast
          isOpen={toast.isOpen}
          message={toast.message}
          color={toast.color}
          icon={toast.icon}
          onDidDismiss={hideToast}
        />
      )}
    </IonApp>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainRouter />
    </AppProvider>
  );
}
