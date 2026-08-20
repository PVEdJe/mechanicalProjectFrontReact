import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';


const userIcon = L.divIcon({
  className: 'custom-user-marker',
  html: `
    <div class="flex flex-col items-center">
      <div class="relative flex items-center justify-center">
        <span class="absolute w-10 h-10 rounded-full bg-blue-500/30 animate-ping"></span>
        <div class="w-9 h-9 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg border-2 border-white relative z-10">
          <span class="material-symbols-outlined text-lg">my_location</span>
        </div>
      </div>
    </div>
  `,
  iconSize: [36, 36],
  iconAnchor: [18, 18],
});

const mechanicIcon = L.divIcon({
  className: 'custom-mechanic-marker',
  html: `
    <div class="flex flex-col items-center">
      <div class="relative">
        <span class="absolute -inset-1 rounded-full bg-amber-400/40 animate-pulse"></span>
        <div class="relative bg-amber-400 text-slate-900 p-2 rounded-full shadow-md border-2 border-white flex items-center justify-center">
          <span class="material-symbols-outlined text-xl font-bold">engineering</span>
        </div>
      </div>
    </div>
  `,
  iconSize: [36, 36],
  iconAnchor: [18, 18],
});

const nearbyIcon = L.divIcon({
  className: 'custom-nearby-marker',
  html: `
    <div class="w-7 h-7 bg-amber-400 rounded-full border-2 border-white shadow-sm flex items-center justify-center text-slate-900">
      <span class="material-symbols-outlined text-sm">directions_car</span>
    </div>
  `,
  iconSize: [28, 28],
  iconAnchor: [14, 14],
});

const incidentIcon = L.divIcon({
  className: 'custom-incident-marker',
  html: `
    <div class="w-9 h-9 bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg border-2 border-white animate-bounce">
      <span class="material-symbols-outlined text-lg">warning</span>
    </div>
  `,
  iconSize: [36, 36],
  iconAnchor: [18, 18],
});

// Componente auxiliar para recentrar el mapa
const RecenterMap: React.FC<{ center: [number, number]; zoom: number }> = ({ center, zoom }) => {
  const map = useMap();
  React.useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
};

interface InteractiveMapProps {
  showRoute?: boolean;
  userCoords?: { lat: number; lng: number; label?: string };
  mechanicCoords?: { lat: number; lng: number; name?: string; vehicle?: string; eta?: string };
  nearbyMechanics?: Array<{ id: string; lat: number; lng: number; name: string }>;
  incidentCoords?: { lat: number; lng: number; title?: string };
  className?: string;
  onMarkerClick?: (marker: any) => void;
  interactiveControls?: boolean;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  showRoute = true,
  userCoords = { lat: 19.3824, lng: -99.1765, label: 'Tú' },
  mechanicCoords = { lat: 19.395, lng: -99.168, name: 'Carlos M.', vehicle: 'Ford F-450', eta: '8 min' },
  nearbyMechanics = [
    { id: 'm1', lat: 19.398, lng: -99.182, name: 'Mecánico Norte' },
    { id: 'm2', lat: 19.375, lng: -99.165, name: 'Mecánico Sur' },
    { id: 'm3', lat: 19.389, lng: -99.155, name: 'Mecánico Oriente' },
  ],
  incidentCoords,
  className = '',
  onMarkerClick,
  interactiveControls = true,
}) => {
  const [mapType, setMapType] = useState<'streets' | 'satellite' | 'dark'>('streets');
  const [zoomLevel, setZoomLevel] = useState<number>(14);
  const [center, setCenter] = useState<[number, number]>([userCoords.lat, userCoords.lng]);

  // URLs para los proveedores de capas de baldosas (TileLayers)
  const tileUrls = {
    streets: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    satellite: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    dark: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
  };

  const handleResetCenter = () => {
    setCenter([userCoords.lat, userCoords.lng]);
    setZoomLevel(14);
  };

  // Coordenadas para trazar la línea entre el mecánico y el usuario
  const routePositions: [number, number][] = mechanicCoords
    ? [
        [mechanicCoords.lat, mechanicCoords.lng],
        [userCoords.lat, userCoords.lng],
      ]
    : [];

  return (
    <div className={`relative w-full h-full ${className}`}>
      {/* Contenedor principal de Leaflet */}
      <MapContainer
        center={[userCoords.lat, userCoords.lng]}
        zoom={zoomLevel}
        zoomControl={false}
        className="w-full h-full z-10"
      >
        <RecenterMap center={center} zoom={zoomLevel} />

        {/* Capa de Mapa Real */}
        <TileLayer
          url={tileUrls[mapType]}
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />

        {/* Ruta entre mecánico y cliente */}
        {showRoute && mechanicCoords && (
          <Polyline
            positions={routePositions}
            pathOptions={{
              color: '#2563eb',
              weight: 5,
              opacity: 0.8,
              dashArray: '8, 8',
            }}
          />
        )}

        {/* Marcador del Usuario */}
        <Marker
          position={[userCoords.lat, userCoords.lng]}
          icon={userIcon}
          eventHandlers={{
            click: () => onMarkerClick && onMarkerClick({ type: 'user', ...userCoords }),
          }}
        >
          <Popup>
            <div className="text-xs font-bold text-slate-800">{userCoords.label || 'Tu ubicación'}</div>
          </Popup>
        </Marker>

        {/* Marcador del Mecánico Asignado */}
        {mechanicCoords && (
          <Marker
            position={[mechanicCoords.lat, mechanicCoords.lng]}
            icon={mechanicIcon}
            eventHandlers={{
              click: () => onMarkerClick && onMarkerClick({ type: 'mechanic', ...mechanicCoords }),
            }}
          >
            <Popup>
              <div className="text-xs font-bold text-slate-900">{mechanicCoords.name}</div>
              <div className="text-[11px] text-slate-600">{mechanicCoords.vehicle}</div>
            </Popup>
          </Marker>
        )}

        {/* Marcadores de Mecánicos Cercanos */}
        {nearbyMechanics.map((mech) => (
          <Marker
            key={mech.id}
            position={[mech.lat, mech.lng]}
            icon={nearbyIcon}
            eventHandlers={{
              click: () => onMarkerClick && onMarkerClick(mech),
            }}
          >
            <Popup>
              <div className="text-xs font-bold">{mech.name}</div>
            </Popup>
          </Marker>
        ))}

        {/* Marcador de Incidencia */}
        {incidentCoords && (
          <Marker
            position={[incidentCoords.lat, incidentCoords.lng]}
            icon={incidentIcon}
          >
            <Popup>
              <div className="text-xs font-bold text-red-600">{incidentCoords.title || 'Incidencia Activa'}</div>
            </Popup>
          </Marker>
        )}
      </MapContainer>

      {/* Tarjeta flotante de ETA */}
      {showRoute && mechanicCoords && (
        <div className="absolute top-4 left-4 z-20 bg-white/95 backdrop-blur-xs p-3 rounded-xl shadow-lg border border-slate-200 flex items-center gap-3 pointer-events-auto">
          <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
            <span className="material-symbols-outlined text-xl">near_me</span>
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-500">Mecánico en camino</div>
            <div className="text-sm font-bold text-slate-800">Llegada aprox. {mechanicCoords.eta || '8 min'}</div>
          </div>
        </div>
      )}

      {/* Controles flotantes personalizados */}
      {interactiveControls && (
        <div className="absolute top-4 right-4 z-20 flex flex-col gap-2 pointer-events-auto">
          <button
            onClick={() => setZoomLevel((z) => Math.min(z + 1, 18))}
            className="w-10 h-10 bg-white shadow-md rounded-full flex items-center justify-center text-slate-700 hover:bg-slate-50 active:scale-95 transition-all border border-slate-200 cursor-pointer"
            title="Acercar"
          >
            <span className="material-symbols-outlined text-lg">add</span>
          </button>
          <button
            onClick={() => setZoomLevel((z) => Math.max(z - 1, 5))}
            className="w-10 h-10 bg-white shadow-md rounded-full flex items-center justify-center text-slate-700 hover:bg-slate-50 active:scale-95 transition-all border border-slate-200 cursor-pointer"
            title="Alejar"
          >
            <span className="material-symbols-outlined text-lg">remove</span>
          </button>
          <button
            onClick={handleResetCenter}
            className="w-10 h-10 bg-blue-600 text-white shadow-md rounded-full flex items-center justify-center hover:bg-blue-700 active:scale-95 transition-all cursor-pointer"
            title="Centrar GPS"
          >
            <span className="material-symbols-outlined text-lg">my_location</span>
          </button>
          <button
            onClick={() =>
              setMapType((prev) => (prev === 'streets' ? 'satellite' : prev === 'satellite' ? 'dark' : 'streets'))
            }
            className="w-10 h-10 bg-white shadow-md rounded-full flex items-center justify-center text-slate-600 hover:text-slate-900 active:scale-95 transition-all border border-slate-200 cursor-pointer"
            title="Cambiar capa"
          >
            <span className="material-symbols-outlined text-lg">layers</span>
          </button>
        </div>
      )}
    </div>
  );
};