import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';

export const RoleSwitcherBanner: React.FC = () => {
  const { currentRole, setCurrentRole, setIncomingOrderModal } = useApp();

  const roles: Array<{ id: UserRole; label: string; icon: string; desc: string }> = [
    { id: 'cliente', label: 'Cliente', icon: 'person', desc: 'Solicitar y rastrear grúa' },
    { id: 'mecanico', label: 'Mecánico', icon: 'build', desc: 'Recibir órdenes y despachos' },
    { id: 'admin', label: 'Admin', icon: 'shield', desc: 'Backoffice y operaciones' },
  ];

  return (
    <aside aria-label="Demo role selector" className="fixed top-2 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center">
      <div className="bg-slate-900/95 backdrop-blur-md text-white px-3.5 py-1.5 rounded-full shadow-xl border border-slate-700/60 flex items-center gap-2 text-xs font-semibold">
        <span className="text-slate-400 flex items-center gap-1 font-bold text-[11px] uppercase tracking-wider">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
          Rol:
        </span>
        <div className="flex bg-slate-800/90 rounded-full p-0.5 gap-0.5 border border-slate-700/40">
          {roles.map((r) => (
            <button
              key={r.id}
              onClick={() => setCurrentRole(r.id)}
              className={`px-2.5 py-1 rounded-full text-[11px] font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
                currentRole === r.id
                  ? 'bg-blue-600 text-white font-semibold shadow-xs'
                  : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <span className="material-symbols-outlined text-[13px]">{r.icon}</span>
              {r.label}
            </button>
          ))}
        </div>

        {/* Quick action: Simulate incoming dispatch for mechanic */}
        {currentRole === 'mecanico' && (
          <button
            onClick={() => setIncomingOrderModal(true)}
            className="ml-1 px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white rounded-full text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer"
            title="Simular nueva solicitud de rescate"
          >
            <span className="material-symbols-outlined text-[12px]">notifications_active</span>
            Test Orden
          </button>
        )}
      </div>
    </aside>
  );
};
