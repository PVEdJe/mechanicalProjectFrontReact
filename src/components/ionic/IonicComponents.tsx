import React, { ReactNode } from 'react';

// IonApp
export const IonApp: React.FC<{ children: ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div id="ion-app" className={`min-h-screen w-full flex flex-col bg-slate-50 text-slate-900 relative overflow-x-hidden font-sans ${className}`}>
    {children}
  </div>
);

// IonHeader
export const IonHeader: React.FC<{ children: ReactNode; className?: string; translucent?: boolean }> = ({
  children,
  className = '',
  translucent = true,
}) => (
  <header
    className={`sticky top-0 z-40 w-full ${
      translucent ? 'bg-white/80 backdrop-blur-md' : 'bg-white'
    } border-b border-slate-200 shadow-xs transition-all ${className}`}
  >
    {children}
  </header>
);

// IonToolbar
export const IonToolbar: React.FC<{ children: ReactNode; className?: string; color?: string }> = ({
  children,
  className = '',
}) => (
  <div className={`h-14 px-4 flex items-center justify-between gap-2 max-w-7xl mx-auto w-full ${className}`}>
    {children}
  </div>
);

// IonTitle
export const IonTitle: React.FC<{ children: ReactNode; className?: string; size?: 'small' | 'large' }> = ({
  children,
  className = '',
}) => (
  <h1 className={`font-bold text-base md:text-lg text-slate-900 tracking-tight truncate flex-1 ${className}`}>
    {children}
  </h1>
);

// IonButtons
export const IonButtons: React.FC<{
  children: ReactNode;
  slot?: 'start' | 'end' | 'primary' | 'secondary';
  className?: string;
}> = ({ children, slot = 'start', className = '' }) => (
  <div className={`flex items-center gap-2 ${slot === 'end' ? 'justify-end' : 'justify-start'} ${className}`}>
    {children}
  </div>
);

// IonBackButton
export const IonBackButton: React.FC<{
  defaultHref?: string;
  onClick?: () => void;
  text?: string;
  className?: string;
}> = ({ onClick, text, className = '' }) => (
  <button
    onClick={onClick}
    className={`p-2 -ml-2 rounded-full text-slate-700 hover:bg-slate-100 active:scale-95 transition-all flex items-center gap-1 cursor-pointer ${className}`}
    aria-label="Regresar"
  >
    <span className="material-symbols-outlined text-2xl">arrow_back</span>
    {text && <span className="text-sm font-medium text-slate-700">{text}</span>}
  </button>
);

// IonButton
export const IonButton: React.FC<{
  children: ReactNode;
  color?: 'primary' | 'secondary' | 'tertiary' | 'success' | 'warning' | 'danger' | 'light' | 'medium' | 'dark' | 'accent';
  fill?: 'clear' | 'outline' | 'solid' | 'default';
  size?: 'small' | 'default' | 'large';
  expand?: 'block' | 'full';
  shape?: 'round';
  disabled?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  id?: string;
}> = ({
  children,
  color = 'primary',
  fill = 'solid',
  size = 'default',
  expand,
  shape,
  disabled = false,
  onClick,
  type = 'button',
  className = '',
  id,
}) => {
  let baseColorStyles = '';

  if (fill === 'solid' || fill === 'default') {
    switch (color) {
      case 'primary':
        baseColorStyles = 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm shadow-blue-200';
        break;
      case 'accent':
      case 'warning':
        baseColorStyles = 'bg-yellow-400 text-slate-900 hover:bg-yellow-500 font-bold shadow-xs';
        break;
      case 'secondary':
        baseColorStyles = 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200';
        break;
      case 'tertiary':
      case 'dark':
        baseColorStyles = 'bg-slate-900 text-white hover:bg-slate-800 shadow-sm';
        break;
      case 'danger':
        baseColorStyles = 'bg-red-600 text-white hover:bg-red-700 shadow-xs';
        break;
      case 'success':
        baseColorStyles = 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-xs';
        break;
      case 'light':
      default:
        baseColorStyles = 'bg-white text-slate-800 hover:bg-slate-50 border border-slate-200 shadow-xs';
        break;
    }
  } else if (fill === 'outline') {
    switch (color) {
      case 'primary':
        baseColorStyles = 'border border-blue-600 text-blue-600 bg-transparent hover:bg-blue-50';
        break;
      case 'danger':
        baseColorStyles = 'border border-red-600 text-red-600 bg-transparent hover:bg-red-50';
        break;
      case 'dark':
        baseColorStyles = 'border border-slate-900 text-slate-900 bg-transparent hover:bg-slate-100';
        break;
      default:
        baseColorStyles = 'border border-slate-200 text-slate-700 bg-white hover:bg-slate-50';
        break;
    }
  } else if (fill === 'clear') {
    switch (color) {
      case 'primary':
        baseColorStyles = 'text-blue-600 bg-transparent hover:bg-blue-50';
        break;
      case 'danger':
        baseColorStyles = 'text-red-600 bg-transparent hover:bg-red-50';
        break;
      default:
        baseColorStyles = 'text-slate-600 bg-transparent hover:bg-slate-100';
        break;
    }
  }

  const sizeStyles =
    size === 'large'
      ? 'h-13 px-6 text-sm md:text-base font-bold'
      : size === 'small'
      ? 'h-8 px-3 text-xs font-semibold'
      : 'h-11 px-4 text-sm font-semibold';

  const widthStyle = expand === 'block' || expand === 'full' ? 'w-full' : 'inline-flex';
  const radiusStyle = shape === 'round' ? 'rounded-full' : 'rounded-xl';

  return (
    <button
      id={id}
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 ${baseColorStyles} ${sizeStyles} ${widthStyle} ${radiusStyle} ${className}`}
    >
      {children}
    </button>
  );
};

// IonContent
export const IonContent: React.FC<{
  children: ReactNode;
  className?: string;
  fullscreen?: boolean;
  scrollEvents?: boolean;
}> = ({ children, className = '', fullscreen = false }) => (
  <main className={`flex-1 w-full ${fullscreen ? 'relative overflow-hidden' : 'overflow-y-auto px-4 py-4'} ${className}`}>
    {children}
  </main>
);

// IonCard
export const IonCard: React.FC<{ children: ReactNode; className?: string; onClick?: () => void; id?: string }> = ({
  children,
  className = '',
  onClick,
  id,
}) => (
  <div
    id={id}
    onClick={onClick}
    className={`bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden transition-all ${
      onClick ? 'cursor-pointer hover:shadow-sm hover:border-slate-300 active:scale-[0.99]' : ''
    } ${className}`}
  >
    {children}
  </div>
);

// IonCardHeader
export const IonCardHeader: React.FC<{ children: ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`p-4 pb-2 ${className}`}>{children}</div>
);

// IonCardTitle
export const IonCardTitle: React.FC<{ children: ReactNode; className?: string }> = ({ children, className = '' }) => (
  <h3 className={`font-bold text-base md:text-lg text-slate-900 leading-tight ${className}`}>{children}</h3>
);

// IonCardSubtitle
export const IonCardSubtitle: React.FC<{ children: ReactNode; className?: string }> = ({ children, className = '' }) => (
  <p className={`text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-0.5 ${className}`}>{children}</p>
);

// IonCardContent
export const IonCardContent: React.FC<{ children: ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`p-4 pt-1 text-sm text-slate-600 ${className}`}>{children}</div>
);

// IonList
export const IonList: React.FC<{ children: ReactNode; className?: string; lines?: 'full' | 'inset' | 'none' }> = ({
  children,
  className = '',
}) => (
  <div className={`flex flex-col rounded-2xl bg-white border border-slate-200 overflow-hidden divide-y divide-slate-100 ${className}`}>
    {children}
  </div>
);

// IonItem
export const IonItem: React.FC<{
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  button?: boolean;
}> = ({ children, className = '', onClick, button = false }) => (
  <div
    onClick={onClick}
    className={`flex items-center gap-3 p-3.5 transition-colors ${
      button || onClick ? 'cursor-pointer hover:bg-slate-50 active:bg-slate-100' : ''
    } ${className}`}
  >
    {children}
  </div>
);

// IonLabel
export const IonLabel: React.FC<{
  children: ReactNode;
  className?: string;
  position?: 'stacked' | 'floating' | 'fixed';
}> = ({ children, className = '' }) => (
  <label className={`block text-sm font-semibold text-slate-900 ${className}`}>{children}</label>
);

// IonInput
export const IonInput: React.FC<{
  type?: string;
  placeholder?: string;
  value?: string | number;
  onIonChange?: (val: string) => void;
  disabled?: boolean;
  className?: string;
  label?: string;
  id?: string;
  required?: boolean;
}> = ({
  type = 'text',
  placeholder = '',
  value,
  onIonChange,
  disabled = false,
  className = '',
  label,
  id,
  required,
}) => (
  <div className="w-full">
    {label && <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">{label}</label>}
    <input
      id={id}
      type={type}
      value={value}
      required={required}
      placeholder={placeholder}
      disabled={disabled}
      onChange={(e) => onIonChange && onIonChange(e.target.value)}
      className={`w-full h-11 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white focus:border-transparent transition-all disabled:opacity-50 ${className}`}
    />
  </div>
);

// IonTextarea
export const IonTextarea: React.FC<{
  placeholder?: string;
  value?: string;
  onIonChange?: (val: string) => void;
  rows?: number;
  disabled?: boolean;
  className?: string;
  label?: string;
  id?: string;
}> = ({ placeholder = '', value, onIonChange, rows = 3, disabled = false, className = '', label, id }) => (
  <div className="w-full">
    {label && <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">{label}</label>}
    <textarea
      id={id}
      rows={rows}
      value={value}
      placeholder={placeholder}
      disabled={disabled}
      onChange={(e) => onIonChange && onIonChange(e.target.value)}
      className={`w-full p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white focus:border-transparent transition-all resize-none disabled:opacity-50 ${className}`}
    />
  </div>
);

// IonSelect
export const IonSelect: React.FC<{
  children: ReactNode;
  value?: string;
  onIonChange?: (val: string) => void;
  placeholder?: string;
  label?: string;
  className?: string;
}> = ({ children, value, onIonChange, placeholder, label, className = '' }) => (
  <div className="w-full">
    {label && <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">{label}</label>}
    <select
      value={value}
      onChange={(e) => onIonChange && onIonChange(e.target.value)}
      className={`w-full h-11 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white focus:border-transparent transition-all cursor-pointer ${className}`}
    >
      {placeholder && <option value="" disabled>{placeholder}</option>}
      {children}
    </select>
  </div>
);

export const IonSelectOption: React.FC<{ value: string; children: ReactNode }> = ({ value, children }) => (
  <option value={value}>{children}</option>
);

// IonToggle
export const IonToggle: React.FC<{
  checked: boolean;
  onIonChange?: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
}> = ({ checked, onIonChange, disabled = false, className = '' }) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    disabled={disabled}
    onClick={() => onIonChange && onIonChange(!checked)}
    className={`w-12 h-7 flex items-center rounded-full p-0.5 transition-colors duration-200 focus:outline-none cursor-pointer ${
      checked ? 'bg-blue-600' : 'bg-slate-300'
    } ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
  >
    <div
      className={`bg-white w-6 h-6 rounded-full shadow-sm transform transition-transform duration-200 flex items-center justify-center ${
        checked ? 'translate-x-5' : 'translate-x-0'
      }`}
    >
      {checked && <span className="material-symbols-outlined text-blue-600 text-xs font-bold">check</span>}
    </div>
  </button>
);

// IonSegment & IonSegmentButton
export const IonSegment: React.FC<{
  value: string;
  onIonChange?: (val: string) => void;
  children: ReactNode;
  className?: string;
}> = ({ value, onIonChange, children, className = '' }) => (
  <div className={`flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200 gap-1 ${className}`}>
    {React.Children.map(children, (child) => {
      if (React.isValidElement(child)) {
        return React.cloneElement(child as React.ReactElement<any>, {
          activeValue: value,
          onSelect: onIonChange,
        });
      }
      return child;
    })}
  </div>
);

export const IonSegmentButton: React.FC<{
  value: string;
  children: ReactNode;
  activeValue?: string;
  onSelect?: (val: string) => void;
  className?: string;
}> = ({ value, children, activeValue, onSelect, className = '' }) => {
  const isActive = value === activeValue;
  return (
    <button
      type="button"
      onClick={() => onSelect && onSelect(value)}
      className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer truncate ${
        isActive
          ? 'bg-white text-slate-900 shadow-xs border border-slate-200'
          : 'text-slate-500 hover:text-slate-900 hover:bg-white/50'
      } ${className}`}
    >
      {children}
    </button>
  );
};

// IonRouterOutlet
export const IonRouterOutlet: React.FC<{ children: ReactNode; className?: string }> = ({
  children,
  className = '',
}) => (
  <div className={`flex-1 w-full h-full relative overflow-hidden flex flex-col ${className}`}>
    {children}
  </div>
);

// IonTabs, IonTabBar, IonTabButton
export const IonTabs: React.FC<{ children: ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`w-full h-full flex flex-col relative ${className}`}>{children}</div>
);

export const IonTabBar: React.FC<{ children: ReactNode; className?: string }> = ({ children, className = '' }) => (
  <nav
    className={`fixed bottom-0 left-0 right-0 z-50 flex justify-around items-center px-4 py-2 pb-safe bg-white/90 backdrop-blur-xl border-t border-slate-200 shadow-[0_-4px_20px_rgba(0,0,0,0.03)] rounded-t-2xl max-w-lg mx-auto md:max-w-xl ${className}`}
  >
    {children}
  </nav>
);

export const IonTabButton: React.FC<{
  tab: string;
  selected?: boolean;
  onClick?: () => void;
  title?: string;
  icon?: string;
  children?: ReactNode;
  className?: string;
}> = ({ selected = false, onClick, title, icon, children, className = '' }) => (
  <button
    onClick={onClick}
    className={`flex flex-col items-center justify-center py-1.5 px-3 min-w-[64px] rounded-xl transition-all duration-150 cursor-pointer ${
      selected
        ? 'bg-blue-50 text-blue-700 font-bold'
        : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
    } ${className}`}
  >
    {icon && (
      <span className={`material-symbols-outlined text-2xl ${selected ? 'text-blue-600' : 'text-slate-400'}`}>
        {icon}
      </span>
    )}
    {title && <span className="text-[11px] font-semibold mt-0.5 tracking-tight">{title}</span>}
    {children}
  </button>
);

// IonBadge
export const IonBadge: React.FC<{
  children: ReactNode;
  color?: 'primary' | 'secondary' | 'tertiary' | 'success' | 'warning' | 'danger' | 'light';
  className?: string;
}> = ({ children, color = 'primary', className = '' }) => {
  let colorStyles = 'bg-blue-50 text-blue-700 border border-blue-200';
  if (color === 'success') colorStyles = 'bg-emerald-50 text-emerald-700 border border-emerald-200';
  if (color === 'danger') colorStyles = 'bg-red-50 text-red-700 border border-red-200';
  if (color === 'tertiary') colorStyles = 'bg-slate-100 text-slate-800 border border-slate-300';
  if (color === 'secondary') colorStyles = 'bg-slate-100 text-slate-600 border border-slate-200';
  if (color === 'warning') colorStyles = 'bg-yellow-50 text-yellow-800 border border-yellow-300';
  if (color === 'light') colorStyles = 'bg-slate-50 text-slate-700 border border-slate-200';

  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${colorStyles} ${className}`}>
      {children}
    </span>
  );
};

// IonAvatar
export const IonAvatar: React.FC<{ children: ReactNode; className?: string; size?: 'sm' | 'md' | 'lg' }> = ({
  children,
  className = '',
  size = 'md',
}) => {
  const sizeClasses = size === 'sm' ? 'w-8 h-8' : size === 'lg' ? 'w-16 h-16' : 'w-11 h-11';
  return (
    <div className={`relative rounded-full overflow-hidden shrink-0 border border-slate-200 bg-slate-100 flex items-center justify-center ${sizeClasses} ${className}`}>
      {children}
    </div>
  );
};

// IonProgressBar
export const IonProgressBar: React.FC<{ value?: number; color?: string; className?: string }> = ({
  value = 0,
  color = '#2563eb',
  className = '',
}) => (
  <div className={`w-full h-2 bg-slate-200 rounded-full overflow-hidden ${className}`}>
    <div
      className="h-full rounded-full transition-all duration-300"
      style={{ width: `${Math.min(Math.max(value * 100, 0), 100)}%`, backgroundColor: color }}
    />
  </div>
);

// IonSpinner
export const IonSpinner: React.FC<{ color?: string; size?: number; className?: string }> = ({
  color = '#2563eb',
  size = 28,
  className = '',
}) => (
  <svg
    className={`animate-spin ${className}`}
    style={{ width: size, height: size }}
    viewBox="0 0 24 24"
    fill="none"
  >
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke={color} strokeWidth="3" />
    <path
      className="opacity-75"
      fill={color}
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    />
  </svg>
);

// IonIcon helper
export const IonIcon: React.FC<{ name: string; className?: string; filled?: boolean }> = ({
  name,
  className = '',
  filled = true,
}) => {
  return (
    <span className={`material-symbols-outlined ${filled ? '' : 'unfilled'} ${className}`}>
      {name}
    </span>
  );
};

// IonModal
export const IonModal: React.FC<{
  isOpen: boolean;
  onDidDismiss: () => void;
  children: ReactNode;
  title?: string;
  className?: string;
}> = ({ isOpen, onDidDismiss, children, title, className = '' }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-4 animate-in fade-in duration-200">
      <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onDidDismiss} />
      <div
        className={`relative z-10 w-full max-w-lg bg-white rounded-t-3xl md:rounded-3xl shadow-2xl border border-slate-200 max-h-[90vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-300 ${className}`}
      >
        {/* Header with grab handle */}
        <div className="pt-3 pb-3 px-6 flex flex-col items-center border-b border-slate-100 bg-slate-50">
          <div className="w-12 h-1.5 bg-slate-300 rounded-full mb-3" />
          <div className="w-full flex items-center justify-between">
            <h3 className="font-bold text-base text-slate-900">{title || ''}</h3>
            <button
              onClick={onDidDismiss}
              className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 active:scale-95 transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
        </div>
        <div className="p-6 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
};

// IonAlert
export const IonAlert: React.FC<{
  isOpen: boolean;
  header: string;
  subHeader?: string;
  message?: string;
  buttons: Array<{
    text: string;
    role?: 'cancel' | 'destructive';
    handler?: () => void;
  }>;
  onDidDismiss: () => void;
}> = ({ isOpen, header, subHeader, message, buttons, onDidDismiss }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={onDidDismiss} />
      <div className="relative z-10 w-full max-w-sm bg-white rounded-2xl p-6 shadow-2xl border border-slate-200 text-center animate-in zoom-in-95 duration-200">
        <h3 className="font-bold text-lg text-slate-900 mb-1">{header}</h3>
        {subHeader && <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">{subHeader}</h4>}
        {message && <p className="text-sm text-slate-600 mb-6">{message}</p>}
        <div className="flex gap-2 justify-center">
          {buttons.map((btn, idx) => (
            <button
              key={idx}
              onClick={() => {
                if (btn.handler) btn.handler();
                onDidDismiss();
              }}
              className={`flex-1 py-2.5 px-4 rounded-xl font-bold text-sm transition-all cursor-pointer active:scale-95 ${
                btn.role === 'destructive'
                  ? 'bg-red-600 text-white hover:bg-red-700'
                  : btn.role === 'cancel'
                  ? 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                  : 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm'
              }`}
            >
              {btn.text}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// IonToast
export const IonToast: React.FC<{
  isOpen: boolean;
  message: string;
  color?: 'primary' | 'success' | 'danger' | 'warning';
  icon?: string;
  duration?: number;
  onDidDismiss: () => void;
}> = ({ isOpen, message, color = 'primary', icon, onDidDismiss }) => {
  React.useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onDidDismiss();
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [isOpen, onDidDismiss]);

  if (!isOpen) return null;

  let bg = 'bg-slate-900 text-white';
  if (color === 'success') bg = 'bg-emerald-700 text-white';
  if (color === 'danger') bg = 'bg-red-600 text-white';
  if (color === 'warning') bg = 'bg-yellow-400 text-slate-900';

  return (
    <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 w-11/12 max-w-md animate-in slide-in-from-top duration-300">
      <div className={`p-3.5 rounded-2xl shadow-xl flex items-center justify-between gap-3 border border-white/10 ${bg}`}>
        <div className="flex items-center gap-3">
          {icon && <span className="material-symbols-outlined text-xl">{icon}</span>}
          <span className="text-sm font-semibold">{message}</span>
        </div>
        <button onClick={onDidDismiss} className="p-1 opacity-80 hover:opacity-100 cursor-pointer">
          <span className="material-symbols-outlined text-lg">close</span>
        </button>
      </div>
    </div>
  );
};
