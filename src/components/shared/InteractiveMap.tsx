import React, { useState } from 'react';

interface InteractiveMapProps {
  showRoute?: boolean;
  userCoords?: { lat: number; lng: number; label?: string };
  mechanicCoords?: { lat: number; lng: number; name?: string; vehicle?: string };
  nearbyMechanics?: Array<{ id: string; lat: number; lng: number; name: string }>;
  incidentCoords?: { lat: number; lng: number; title?: string };
  className?: string;
  onMarkerClick?: (marker: any) => void;
  interactiveControls?: boolean;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  showRoute = true,
  userCoords = { lat: 19.3824, lng: -99.1765, label: 'Tú' },
  mechanicCoords = { lat: 19.395, lng: -99.168, name: 'Carlos M.', vehicle: 'Ford F-450' },
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
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [mapType, setMapType] = useState<'streets' | 'satellite' | 'dark'>('streets');
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPanOffset({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const resetCenter = () => {
    setPanOffset({ x: 0, y: 0 });
    setZoomLevel(1);
  };

  return (
    <div
      className={`relative w-full h-full overflow-hidden select-none cursor-grab active:cursor-grabbing ${
        mapType === 'dark' ? 'bg-slate-900' : mapType === 'satellite' ? 'bg-slate-800' : 'bg-slate-100'
      } ${className}`}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Map Vector Grid Layer */}
      <div
        className="absolute inset-0 transition-transform duration-75"
        style={{
          transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoomLevel})`,
          transformOrigin: 'center center',
        }}
      >
        {/* City Vector Layout (Streets, Avenues, Blocks) */}
        <svg width="100%" height="100%" className="absolute inset-0 opacity-75">
          <defs>
            <pattern id="roadGrid" width="80" height="80" patternUnits="userSpaceOnUse">
              <rect width="80" height="80" fill={mapType === 'dark' ? '#0f172a' : '#f8fafc'} />
              <path d="M 80 0 L 0 0 0 80" fill="none" stroke={mapType === 'dark' ? '#1e293b' : '#e2e8f0'} strokeWidth="1" strokeOpacity="0.7" />
              {/* Secondary block lines */}
              <path d="M 40 0 L 40 80 M 0 40 L 80 40" fill="none" stroke={mapType === 'dark' ? '#1e293b' : '#f1f5f9'} strokeWidth="0.5" strokeOpacity="0.9" />
            </pattern>
            {/* Gradient for route */}
            <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#1d4ed8" />
            </linearGradient>
          </defs>

          <rect width="100%" height="100%" fill="url(#roadGrid)" />

          {/* Major Avenues */}
          <path d="M -100 280 Q 300 240 700 360 T 1200 320" fill="none" stroke={mapType === 'dark' ? '#334155' : '#ffffff'} strokeWidth="16" />
          <path d="M 280 -100 Q 320 300 380 700 T 420 1200" fill="none" stroke={mapType === 'dark' ? '#334155' : '#ffffff'} strokeWidth="14" />
          <path d="M -50 600 L 1000 100" fill="none" stroke={mapType === 'dark' ? '#1e293b' : '#cbd5e1'} strokeWidth="8" />

          {/* Route path connecting mechanic and client */}
          {showRoute && (
            <>
              {/* Outer glow */}
              <path
                d="M 580 260 Q 420 280 340 380 T 260 480"
                fill="none"
                stroke="#3b82f6"
                strokeWidth="10"
                strokeOpacity="0.25"
              />
              {/* Animated dashed line */}
              <path
                d="M 580 260 Q 420 280 340 380 T 260 480"
                fill="none"
                stroke="url(#routeGradient)"
                strokeWidth="4"
                strokeDasharray="6 4"
                className="animate-pulse"
              />
            </>
          )}

          {/* Area labels */}
          <text x="180" y="240" fill="#94a3b8" fontSize="10" fontWeight="700" letterSpacing="0.05em">AV. INSURGENTES SUR</text>
          <text x="360" y="420" fill="#94a3b8" fontSize="10" fontWeight="700" letterSpacing="0.05em">DEL VALLE CENTRO</text>
          <text x="490" y="190" fill="#94a3b8" fontSize="10" fontWeight="700" letterSpacing="0.05em">PARQUE HUNDIDO</text>
        </svg>

        {/* User Location Marker */}
        <div
          className="absolute top-[52%] left-[32%] -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center cursor-pointer"
          onClick={() => onMarkerClick && onMarkerClick({ type: 'user', ...userCoords })}
        >
          <div className="relative">
            <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg pulse-halo border-2 border-white">
              <span className="material-symbols-outlined text-xl">my_location</span>
            </div>
          </div>
          <div className="mt-1 bg-white/95 px-2 py-0.5 rounded-full shadow-xs border border-slate-200 text-[10px] font-bold text-slate-800 whitespace-nowrap">
            Tu ubicación
          </div>
        </div>

        {/* Assigned Mechanic Marker */}
        {mechanicCoords && (
          <div
            className="absolute top-[28%] left-[62%] -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center cursor-pointer transition-all duration-500"
            onClick={() => onMarkerClick && onMarkerClick({ type: 'mechanic', ...mechanicCoords })}
          >
            <div className="bg-yellow-400 text-slate-900 p-2.5 rounded-full shadow-md border-2 border-white pulse-mechanic">
              <span className="material-symbols-outlined text-2xl font-bold">engineering</span>
            </div>
            <div className="mt-1 bg-slate-900 text-white px-2.5 py-0.5 rounded-lg shadow-sm border border-slate-700 text-[10px] font-bold flex items-center gap-1 whitespace-nowrap">
              <span>{mechanicCoords.name || 'Carlos M.'}</span>
              <span className="text-yellow-400">★ 4.9</span>
            </div>
          </div>
        )}

        {/* Incident Marker (If set) */}
        {incidentCoords && (
          <div className="absolute top-[40%] left-[45%] -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center">
            <div className="w-10 h-10 bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg border-2 border-white animate-bounce">
              <span className="material-symbols-outlined text-xl">warning</span>
            </div>
            <div className="mt-1 bg-white px-2 py-0.5 rounded shadow-xs border border-slate-200 text-[10px] font-bold text-red-600">
              {incidentCoords.title || 'Incidencia Activa'}
            </div>
          </div>
        )}

        {/* Nearby Idle Mechanics */}
        {nearbyMechanics.map((mech, idx) => (
          <div
            key={mech.id || idx}
            style={{
              top: `${40 + (idx === 0 ? -15 : idx === 1 ? 25 : 5)}%`,
              left: `${20 + (idx === 0 ? 55 : idx === 1 ? -5 : 60)}%`,
            }}
            className="absolute -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center opacity-85 hover:opacity-100 transition-all cursor-pointer"
            onClick={() => onMarkerClick && onMarkerClick(mech)}
          >
            <div className="w-7 h-7 bg-yellow-400 rounded-full border-2 border-white shadow-sm flex items-center justify-center text-slate-900 text-xs">
              <span className="material-symbols-outlined text-sm">directions_car</span>
            </div>
          </div>
        ))}
      </div>

      {/* Floating Map Controls */}
      {interactiveControls && (
        <div className="absolute top-20 right-4 z-30 flex flex-col gap-2">
          <button
            onClick={() => setZoomLevel((z) => Math.min(z + 0.25, 2.5))}
            className="w-10 h-10 bg-white shadow-md rounded-full flex items-center justify-center text-slate-700 hover:text-blue-600 hover:bg-slate-50 active:scale-95 transition-all border border-slate-200 cursor-pointer"
            title="Acercar"
          >
            <span className="material-symbols-outlined text-lg">add</span>
          </button>
          <button
            onClick={() => setZoomLevel((z) => Math.max(z - 0.25, 0.7))}
            className="w-10 h-10 bg-white shadow-md rounded-full flex items-center justify-center text-slate-700 hover:text-blue-600 hover:bg-slate-50 active:scale-95 transition-all border border-slate-200 cursor-pointer"
            title="Alejar"
          >
            <span className="material-symbols-outlined text-lg">remove</span>
          </button>
          <button
            onClick={resetCenter}
            className="w-10 h-10 bg-blue-600 text-white shadow-md shadow-blue-200 rounded-full flex items-center justify-center hover:bg-blue-700 active:scale-95 transition-all cursor-pointer"
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
