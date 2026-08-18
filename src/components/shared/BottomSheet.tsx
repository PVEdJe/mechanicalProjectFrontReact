import React, { useState, ReactNode } from 'react';

interface BottomSheetProps {
  children: ReactNode;
  initialCollapsed?: boolean;
  className?: string;
  maxHeight?: string;
}

export const BottomSheet: React.FC<BottomSheetProps> = ({
  children,
  initialCollapsed = false,
  className = '',
}) => {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(initialCollapsed);

  return (
    <div
      className={`absolute bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl rounded-t-3xl shadow-[0_-10px_30px_rgba(0,0,0,0.08)] border-t border-slate-200 transition-transform duration-300 ease-out max-w-lg mx-auto md:left-1/2 md:-translate-x-1/2 flex flex-col ${
        isCollapsed ? 'translate-y-[calc(100%-110px)]' : 'translate-y-0'
      } ${className}`}
      style={{ maxHeight: '85vh' }}
    >
      {/* Grab Handle */}
      <div
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="w-full py-2.5 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 active:bg-slate-100 rounded-t-3xl transition-colors"
      >
        <div className="w-12 h-1.5 bg-slate-200 rounded-full mb-1.5" />
        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">
          {isCollapsed ? 'Desliza para ver detalles' : 'Toca para contraer'}
        </span>
      </div>

      {/* Content Container */}
      <div className="px-5 pb-safe overflow-y-auto flex-1 hide-scrollbar">
        {children}
      </div>
    </div>
  );
};
