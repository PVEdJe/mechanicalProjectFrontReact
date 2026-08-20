// screens/mecanico/MechanicVehicleScreen.tsx
import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AppImage } from '../../components/shared/AppImage';
import { ServiceVehicle } from '../../types';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonCard,
  IonCardContent,
  IonButton,
  IonBadge,
  IonModal,
} from '../../components/ionic/IonicComponents';

const VEHICLE_TYPE_OPTIONS = [
  { id: 'Grúa Plataforma', title: 'Grúa Plataforma Hidráulica', icon: 'local_shipping', desc: 'Para autos y SUVs con plataforma deslizable' },
  { id: 'Grúa de Arrastre', title: 'Grúa de Arrastre / Pluma', icon: 'minor_crash', desc: 'Arrastre con wheel-lift para zonas de difícil acceso' },
  { id: 'Taller Móvil Pick-up', title: 'Taller Móvil (Pick-up 4x4)', icon: 'car_repair', desc: 'Mecánica ligera, baterías, llantas y combustible' },
  { id: 'Moto de Asistencia', title: 'Moto Auxilio Rápido', icon: 'two_wheeler', desc: 'Paso de corriente express, gasolina y cerrajería' },
  { id: 'Rescate Pesado', title: 'Grúa de Rescate Pesado', icon: 'rv_hookup', desc: 'Unidades de carga comercial y autobuses' },
];

const PRESET_EQUIPMENT = [
  'Winche Hidráulico (8 Ton)',
  'Compresor de Aire (150 PSI)',
  'Jumper Booster (12V / 24V)',
  'Gato Hidráulico de Perfil Bajo (3T)',
  'Torretas y Estrobos de Emergencia',
  'Kit de Conos de Señalización Vial',
  'Kit de Apertura Cerrajera Automotriz',
  'Extintor de Polvo Químico Seco (6kg)',
  'Juego de Llaves de Impacto Inalámbricas',
  'Tanques de Combustible de Emergencia (20L)',
];

const PRESET_VEHICLE_IMAGES = [
  {
    title: 'Grúa Plataforma Ford',
    url: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&auto=format&fit=crop&q=80',
    type: 'Grúa Plataforma',
  },
  {
    title: 'Taller Móvil Pick-up',
    url: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&auto=format&fit=crop&q=80',
    type: 'Taller Móvil Pick-up',
  },
  {
    title: 'Grúa de Arrastre Heavy Duty',
    url: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=800&auto=format&fit=crop&q=80',
    type: 'Grúa de Arrastre',
  },
];

// ✅ Asegúrate de que sea export const (NO export default)
export const MechanicVehicleScreen: React.FC = () => {
  const { currentUser, updateMechanicVehicle, navigateTo, showToast } = useApp();

  const currentVeh = currentUser.serviceVehicle || {
    type: 'Grúa Plataforma',
    make: 'Ford',
    model: 'F-450 Heavy Duty',
    year: 2022,
    plate: 'GR-492-CD',
    color: 'Amarillo Auxilio / Blanco',
    vin: '3FDPF47R9NEA19283',
    capacity: '3.5 Toneladas (Plataforma Hidráulica)',
    insurancePolicy: 'GNP-V-8819203',
    insuranceExpiry: 'Noviembre 2026',
    equipment: [
      'Winche Hidráulico (8 Ton)',
      'Compresor de Aire (150 PSI)',
      'Jumper Booster (12V / 24V)',
      'Torretas y Estrobos de Emergencia',
      'Kit de Conos de Señalización Vial',
    ],
    imageUrl: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&auto=format&fit=crop&q=80',
    verified: true,
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [vehicleType, setVehicleType] = useState(currentVeh.type || 'Grúa Plataforma');
  const [make, setMake] = useState(currentVeh.make || 'Ford');
  const [model, setModel] = useState(currentVeh.model || 'F-450 Heavy Duty');
  const [year, setYear] = useState(currentVeh.year || 2022);
  const [plate, setPlate] = useState(currentVeh.plate || 'GR-492-CD');
  const [color, setColor] = useState(currentVeh.color || 'Amarillo Auxilio / Blanco');
  const [vin, setVin] = useState(currentVeh.vin || '3FDPF47R9NEA19283');
  const [capacity, setCapacity] = useState(currentVeh.capacity || '3.5 Toneladas');
  const [insurancePolicy, setInsurancePolicy] = useState(currentVeh.insurancePolicy || 'GNP-V-8819203');
  const [insuranceExpiry, setInsuranceExpiry] = useState(currentVeh.insuranceExpiry || 'Noviembre 2026');
  const [selectedEquipment, setSelectedEquipment] = useState<string[]>(
    currentVeh.equipment || [
      'Winche Hidráulico (8 Ton)',
      'Compresor de Aire (150 PSI)',
      'Jumper Booster (12V / 24V)',
      'Torretas y Estrobos de Emergencia',
    ]
  );
  const [imageUrl, setImageUrl] = useState(currentVeh.imageUrl || PRESET_VEHICLE_IMAGES[0].url);

  const toggleEquipmentItem = (item: string) => {
    if (selectedEquipment.includes(item)) {
      setSelectedEquipment(selectedEquipment.filter((e) => e !== item));
    } else {
      setSelectedEquipment([...selectedEquipment, item]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: ServiceVehicle = {
      type: vehicleType,
      make,
      model,
      year: Number(year),
      plate: plate.toUpperCase(),
      color,
      vin: vin.toUpperCase(),
      capacity,
      insurancePolicy,
      insuranceExpiry,
      equipment: selectedEquipment,
      imageUrl,
      verified: true,
    };

    updateMechanicVehicle(updated);
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 pb-24">
      {/* Header */}
      <IonHeader className="bg-white/80 backdrop-blur-md border-b border-slate-200">
        <IonToolbar>
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigateTo('/mecanico/home')}
              className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-lg">arrow_back</span>
            </button>
            <div>
              <IonTitle className="text-slate-900 font-bold">Unidad de Auxilio Vial</IonTitle>
              <p className="text-[10px] text-slate-400">Equipamiento y Registro Técnico</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-3 py-1.5 bg-blue-600 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-2xs hover:bg-blue-700 active:scale-95 transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">edit</span>
              <span>Editar Unidad</span>
            </button>
          </div>
        </IonToolbar>
      </IonHeader>

      {/* Main Content */}
      <div className="flex-1 max-w-2xl w-full mx-auto p-4 space-y-4">
        {/* Vehicle Hero Card */}
        <div className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-2xs">
          <div className="relative h-48 w-full bg-slate-900">
            <AppImage
              src={currentVeh.imageUrl || imageUrl}
              alt={`${currentVeh.make} ${currentVeh.model}`}
              type="vehicle"
              className="w-full h-full object-cover opacity-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/20 to-transparent flex items-end p-4">
              <div className="flex items-center justify-between w-full">
                <div>
                  <span className="px-2.5 py-1 rounded-lg bg-yellow-400 text-slate-900 font-black text-[10px] uppercase tracking-wider inline-block mb-1 shadow-2xs">
                    {currentVeh.type}
                  </span>
                  <h2 className="text-xl font-bold text-white leading-tight">
                    {currentVeh.make} {currentVeh.model} ({currentVeh.year})
                  </h2>
                </div>

                <div className="bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/20 text-center shadow-xs">
                  <span className="text-[9px] font-bold text-slate-400 block uppercase">Placas</span>
                  <span className="font-mono font-black text-slate-900 text-sm tracking-wider">
                    {currentVeh.plate}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 space-y-4">
            {/* Status & Certification Banner */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-emerald-50 border border-emerald-200">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
                  <span className="material-symbols-outlined text-base">verified</span>
                </div>
                <div>
                  <h4 className="font-bold text-xs text-emerald-950">
                    Unidad Homologada y Certificada
                  </h4>
                  <p className="text-[11px] text-emerald-700">
                    Inspección técnica aprobada para auxilio vial y arrastre en vía pública.
                  </p>
                </div>
              </div>
              <IonBadge color="success" className="font-bold text-[10px]">
                Activa
              </IonBadge>
            </div>

            {/* Technical Specifications Grid */}
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">
                Ficha Técnica de la Unidad
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Capacidad</span>
                  <p className="text-xs font-bold text-slate-900 mt-0.5">
                    {currentVeh.capacity || '3.5 Toneladas'}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Color Oficial</span>
                  <p className="text-xs font-bold text-slate-900 mt-0.5 truncate">
                    {currentVeh.color || 'Amarillo Auxilio'}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Número VIN</span>
                  <p className="text-xs font-mono font-bold text-slate-900 mt-0.5 truncate">
                    {currentVeh.vin || '3FDPF47R9NEA19283'}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Póliza Seguro</span>
                  <p className="text-xs font-bold text-blue-600 mt-0.5 truncate">
                    {currentVeh.insurancePolicy || 'GNP-V-8819203'}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Vigencia Seguro</span>
                  <p className="text-xs font-bold text-emerald-700 mt-0.5 truncate">
                    {currentVeh.insuranceExpiry || 'Noviembre 2026'}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Torre / GPS</span>
                  <p className="text-xs font-bold text-slate-900 mt-0.5 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    Transmisor Activo
                  </p>
                </div>
              </div>
            </div>

            {/* Onboard Tools & Emergency Equipment */}
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Equipamiento y Herramientas a Bordo
                </h3>
                <span className="text-[11px] font-semibold text-slate-500">
                  {(currentVeh.equipment || []).length} herramientas registradas
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {(currentVeh.equipment || [
                  'Winche Hidráulico (8 Ton)',
                  'Compresor de Aire (150 PSI)',
                  'Jumper Booster (12V / 24V)',
                  'Gato Hidráulico de Perfil Bajo (3T)',
                  'Torretas y Estrobos de Emergencia',
                  'Kit de Conos de Señalización Vial',
                ]).map((tool, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2 text-xs"
                  >
                    <span className="material-symbols-outlined text-blue-600 text-base">
                      build_circle
                    </span>
                    <span className="font-semibold text-slate-800">{tool}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Bar */}
            <div className="pt-2 flex flex-col sm:flex-row gap-2">
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex-1 py-3 bg-blue-600 text-white font-bold text-xs rounded-xl shadow-sm hover:bg-blue-700 active:scale-98 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-base">edit_note</span>
                <span>Modificar Datos de la Unidad</span>
              </button>

              <button
                onClick={() =>
                  showToast('Constancia de inspección técnica descargada en PDF', 'success', 'download')
                }
                className="py-3 px-4 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl hover:bg-slate-200 active:scale-98 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-base">picture_as_pdf</span>
                <span>Dictamen Técnico</span>
              </button>
            </div>
          </div>
        </div>

        {/* Safety Requirements Checklist Card */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs space-y-3">
          <h3 className="font-bold text-sm text-slate-900">Protocolo de Operación Segura</h3>
          <div className="space-y-2 text-xs text-slate-600">
            <div className="flex items-start gap-2.5">
              <span className="material-symbols-outlined text-emerald-600 text-base shrink-0">check_circle</span>
              <p>El vehículo cuenta con torreta reglamentaria ámbar para maniobras en autopista.</p>
            </div>
            <div className="flex items-start gap-2.5">
              <span className="material-symbols-outlined text-emerald-600 text-base shrink-0">check_circle</span>
              <p>Seguro vigente con cobertura de arrastre y daños a terceros amparado.</p>
            </div>
            <div className="flex items-start gap-2.5">
              <span className="material-symbols-outlined text-emerald-600 text-base shrink-0">check_circle</span>
              <p>Calibración de presión en compresor e hidrolavadora certificada semestralmente.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Modal: Register / Update Service Vehicle */}
      <IonModal isOpen={isModalOpen} onDidDismiss={() => setIsModalOpen(false)}>
        <div className="p-5 max-w-lg mx-auto bg-white min-h-screen sm:min-h-0 sm:rounded-3xl space-y-4 max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-base text-slate-900">Registrar / Editar Unidad de Servicio</h3>
              <p className="text-[11px] text-slate-400">Actualiza las especificaciones de tu vehículo de trabajo</p>
            </div>
            <button
              onClick={() => setIsModalOpen(false)}
              className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200 cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">close</span>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Vehicle Type Selection */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">Tipo de Unidad</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {VEHICLE_TYPE_OPTIONS.map((opt) => (
                  <button
                    type="button"
                    key={opt.id}
                    onClick={() => setVehicleType(opt.id)}
                    className={`p-3 rounded-xl text-left border transition-all cursor-pointer flex items-start gap-2.5 ${
                      vehicleType === opt.id
                        ? 'border-blue-600 bg-blue-50/60 shadow-2xs ring-1 ring-blue-600'
                        : 'border-slate-200 bg-slate-50 hover:bg-white'
                    }`}
                  >
                    <span
                      className={`material-symbols-outlined text-xl ${
                        vehicleType === opt.id ? 'text-blue-600' : 'text-slate-500'
                      }`}
                    >
                      {opt.icon}
                    </span>
                    <div>
                      <p className="font-bold text-xs text-slate-900">{opt.title}</p>
                      <p className="text-[10px] text-slate-500 leading-tight mt-0.5">{opt.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Brand, Model, Year, Plate */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Marca</label>
                <input
                  type="text"
                  required
                  value={make}
                  onChange={(e) => setMake(e.target.value)}
                  placeholder="Ej. Ford, Chevrolet, Nissan"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:border-blue-600 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Modelo y Versión</label>
                <input
                  type="text"
                  required
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  placeholder="Ej. F-450 Heavy Duty"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:border-blue-600 outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Año</label>
                <input
                  type="number"
                  required
                  min="2000"
                  max="2027"
                  value={year}
                  onChange={(e) => setYear(Number(e.target.value))}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:border-blue-600 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Placas</label>
                <input
                  type="text"
                  required
                  value={plate}
                  onChange={(e) => setPlate(e.target.value)}
                  placeholder="GR-492-CD"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:bg-white focus:border-blue-600 outline-none uppercase"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Capacidad</label>
                <input
                  type="text"
                  value={capacity}
                  onChange={(e) => setCapacity(e.target.value)}
                  placeholder="3.5 Ton"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:border-blue-600 outline-none"
                />
              </div>
            </div>

            {/* VIN and Color */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Número de Serie (VIN)</label>
                <input
                  type="text"
                  value={vin}
                  onChange={(e) => setVin(e.target.value)}
                  placeholder="3FDPF47R9..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-900 focus:bg-white focus:border-blue-600 outline-none uppercase"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Color de la Unidad</label>
                <input
                  type="text"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  placeholder="Amarillo / Blanco"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:border-blue-600 outline-none"
                />
              </div>
            </div>

            {/* Insurance details */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">No. Póliza Seguro</label>
                <input
                  type="text"
                  value={insurancePolicy}
                  onChange={(e) => setInsurancePolicy(e.target.value)}
                  placeholder="GNP-V-8819203"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:border-blue-600 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Vigencia Seguro</label>
                <input
                  type="text"
                  value={insuranceExpiry}
                  onChange={(e) => setInsuranceExpiry(e.target.value)}
                  placeholder="Noviembre 2026"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:border-blue-600 outline-none"
                />
              </div>
            </div>

            {/* Equipment Selection */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                Equipamiento a Bordo ({selectedEquipment.length})
              </label>
              <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto p-2 bg-slate-50 rounded-xl border border-slate-200">
                {PRESET_EQUIPMENT.map((item) => {
                  const isChecked = selectedEquipment.includes(item);
                  return (
                    <button
                      type="button"
                      key={item}
                      onClick={() => toggleEquipmentItem(item)}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
                        isChecked
                          ? 'bg-blue-600 text-white shadow-2xs'
                          : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <span className="material-symbols-outlined text-xs">
                        {isChecked ? 'check_box' : 'check_box_outline_blank'}
                      </span>
                      <span>{item}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Vehicle Image Preset Selection */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">Foto de la Unidad</label>
              <div className="grid grid-cols-3 gap-2">
                {PRESET_VEHICLE_IMAGES.map((img) => (
                  <div
                    key={img.url}
                    onClick={() => setImageUrl(img.url)}
                    className={`relative rounded-xl overflow-hidden h-18 border-2 cursor-pointer transition-all ${
                      imageUrl === img.url ? 'border-blue-600 ring-2 ring-blue-400' : 'border-slate-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <AppImage src={img.url} alt={img.title} type="vehicle" className="w-full h-full object-cover" />
                    <span className="absolute bottom-1 left-1 text-[8px] bg-slate-900/80 text-white px-1 rounded font-bold">
                      {img.title.split(' ')[0]}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-3">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="flex-1 py-3 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl hover:bg-slate-200 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex-1 py-3 bg-blue-600 text-white font-bold text-xs rounded-xl shadow-sm hover:bg-blue-700 active:scale-98 transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span className="material-symbols-outlined text-base">save</span>
                <span>Guardar y Homologar</span>
              </button>
            </div>
          </form>
        </div>
      </IonModal>
    </div>
  );
};