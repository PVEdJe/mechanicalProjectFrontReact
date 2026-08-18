import React from 'react';
import { useApp } from '../../context/AppContext';
import { AppImage } from '../../components/shared/AppImage';

export const WelcomeScreen: React.FC = () => {
  const { navigateTo, loginWithRole } = useApp();

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between p-6 max-w-md mx-auto overflow-hidden bg-slate-50">
      {/* Top / Brand Section */}
      <div className="relative z-10 flex flex-col items-center justify-center flex-1 pt-6 pb-4 text-center">
        {/* Visual Hero Banner */}
        <div className="w-full h-44 rounded-3xl overflow-hidden shadow-sm border border-slate-200 mb-5 relative bg-slate-900">
          <AppImage
            src="https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=800&auto=format&fit=crop&q=80"
            alt="AutoRescate Asistencia Vial"
            type="incident"
            className="w-full h-full object-cover opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/20 to-transparent flex items-end p-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-yellow-400 text-slate-900 rounded-xl flex items-center justify-center font-black text-xs shadow-xs">
                AR
              </div>
              <div className="text-left">
                <span className="text-white font-bold text-sm block leading-tight">Auxilio Vial Inmediato</span>
                <span className="text-yellow-300 text-[10px] font-semibold">Grúas • Baterías • Neumáticos</span>
              </div>
            </div>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          AutoRescate
        </h1>

        {/* Subtitle */}
        <p className="text-xs text-slate-500 max-w-xs mt-1.5 leading-relaxed">
          Asistencia mecánica en carretera y grúas 24/7 a un solo toque.
        </p>

        {/* Trust Indicators */}
        <div className="flex items-center justify-center gap-4 mt-5 py-2 px-4 rounded-full bg-white border border-slate-200 shadow-2xs">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
            <span className="material-symbols-outlined text-blue-600 text-base">timer</span>
            <span>24/7 Rápido</span>
          </div>
          <div className="w-1 h-1 rounded-full bg-slate-300" />
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
            <span className="material-symbols-outlined text-emerald-600 text-base">verified_user</span>
            <span>100% Seguro</span>
          </div>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="relative z-10 flex flex-col gap-2.5 w-full pb-6">
        <button
          onClick={() => navigateTo('/auth/register')}
          className="w-full h-12 bg-blue-600 text-white font-bold text-sm rounded-xl flex items-center justify-center shadow-sm hover:bg-blue-700 active:scale-[0.98] transition-all cursor-pointer"
        >
          Crear cuenta
        </button>

        <button
          onClick={() => navigateTo('/auth/login')}
          className="w-full h-12 bg-white border border-slate-200 text-slate-800 font-bold text-sm rounded-xl flex items-center justify-center shadow-2xs hover:bg-slate-50 active:scale-[0.98] transition-all cursor-pointer"
        >
          Iniciar sesión
        </button>

        <div className="text-center mt-1">
          <button
            onClick={() => loginWithRole('cliente')}
            className="text-xs font-semibold text-blue-600 hover:underline cursor-pointer py-1"
          >
            Continuar como invitado →
          </button>
        </div>
      </div>
    </div>
  );
};
