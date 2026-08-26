import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { AppImage } from '../../components/shared/AppImage';
import { AvatarUploadModal } from '../../components/shared/AvatarUploadModal'; // 👈 Se agregó la importación del Modal
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonBadge,
  IonToggle,
  IonModal,
} from '../../components/ionic/IonicComponents';

const AVAILABLE_SPECIALTIES = [
  'Grúa Plataforma',
  'Grúa de Arrastre',
  'Baterías y Corriente',
  'Neumáticos y Ponchaduras',
  'Diagnóstico Eléctrico',
  'Cerrajería Automotriz',
  'Suministro de Combustible',
  'Mecánica Ligera en Sitio',
  'Frenos e Hidráulica',
];

export const MechanicProfileScreen: React.FC = () => {
  // 👇 Se combinaron correctamente las funciones y currentUser 👇
  const {
    isMechanicOnline,
    currentUser,
    setIsMechanicOnline,
    navigateTo,
    logout,
    showToast,
  } = useApp();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false); // 👈 Se agregó el estado faltante para la foto

  const [name, setName] = useState('Cargando...');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [yearsExperience, setYearsExperience] = useState(0);
  const [description, setDescription] = useState('');
  const [specialties, setSpecialties] = useState<string[]>([]);
  const [avatarUrl, setAvatarUrl] = useState('');

  const [rating, setRating] = useState(5.0);
  const [ratingCount, setRatingCount] = useState(0);

  const cargarPerfil = async () => {
    try {
      const token = localStorage.getItem('access_token');

      if (!token) return;

      const payload = JSON.parse(atob(token.split('.')[1]));

      const res = await fetch(
        `http://localhost:3000/users/${payload.sub}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.ok) {
        const data = await res.json();

        setName(data.firstName || '');
        setLastName(data.lastName || '');
        setEmail(data.email || '');
        setPhone(data.phone || '');
        setYearsExperience(data.experiencia || 0);
        setDescription(data.descripcion || '');

        // FOTO DE PERFIL
        setAvatarUrl(data.avatarUrl || '');

        const userRating =
          typeof data.rating !== 'undefined' && data.rating !== null
            ? Number(data.rating)
            : 5.0;

        const userRatingCount =
          typeof data.ratingCount !== 'undefined' &&
          data.ratingCount !== null
            ? Number(data.ratingCount)
            : 0;

        setRating(userRating);
        setRatingCount(userRatingCount);

        if (data.especialidades) {
          const specsArray = data.especialidades
            .split(',')
            .filter((s: string) => s.trim() !== '');

          setSpecialties(specsArray);
        } else {
          setSpecialties([]);
        }
      }
    } catch (error) {
      console.error('Error al cargar perfil de mecánico:', error);
    }
  };

  useEffect(() => {
    cargarPerfil();
  }, []);

  const toggleSpecialty = (spec: string) => {
    if (specialties.includes(spec)) {
      setSpecialties(
        specialties.filter((s) => s !== spec)
      );
    } else {
      setSpecialties([
        ...specialties,
        spec,
      ]);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('access_token');

      if (!token) {
        showToast('No hay sesión activa', 'danger');
        return;
      }

      const payload = JSON.parse(
        atob(token.split('.')[1])
      );

      const especialidadesString =
        specialties.join(',');

      const res = await fetch(
        `http://localhost:3000/users/${payload.sub}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            firstName: name,
            lastName,
            phone,
            email,
            experiencia: Number(yearsExperience),
            descripcion: description,
            especialidades: especialidadesString,
          }),
        }
      );

      if (res.ok) {
        showToast(
          'Perfil actualizado correctamente',
          'success',
          'check_circle'
        );

        setIsEditModalOpen(false);

        await cargarPerfil();
      } else {
        showToast(
          'Error al actualizar el perfil',
          'danger'
        );
      }
    } catch (error) {
      console.error(
        'Error al actualizar perfil:',
        error
      );

      showToast(
        'Error de conexión',
        'danger'
      );
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 pb-24">

      {/* HEADER */}
      <IonHeader className="bg-white/80 backdrop-blur-md border-b border-slate-200">
        <IonToolbar>

          <div className="flex items-center gap-2">

            <button
              onClick={() =>
                navigateTo('/mecanico/home')
              }
              className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-lg">
                arrow_back
              </span>
            </button>

            <div>
              <IonTitle className="text-slate-900 font-bold">
                Perfil del Técnico
              </IonTitle>

              <p className="text-[10px] text-slate-400">
                ID: MEC-88 • Certificado
              </p>
            </div>

          </div>

          <div className="flex items-center gap-2">

            <button
              onClick={() =>
                setIsEditModalOpen(true)
              }
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors cursor-pointer"
              title="Editar Perfil"
            >
              <span className="material-symbols-outlined text-xl">
                edit
              </span>
            </button>

          </div>

        </IonToolbar>
      </IonHeader>

      {/* CONTENIDO */}
      <div className="flex-1 max-w-2xl w-full mx-auto p-4 space-y-4">

        {/* PERFIL */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-2xs relative overflow-hidden">

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
            
            {/* FOTO */}
            <div className="relative flex flex-col items-center group">

              <button
                type="button"
                onClick={() =>
                  setIsPhotoModalOpen(true)
                }
                className="relative cursor-pointer block rounded-2xl focus:outline-hidden ring-offset-2 focus:ring-2 focus:ring-blue-600 transition-transform active:scale-95"
                title="Cambiar foto de perfil"
              >

                <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-yellow-400 shadow-sm ring-2 ring-blue-500/20 bg-slate-100 flex items-center justify-center">

                  {avatarUrl ? (
                    <AppImage
                      src={avatarUrl}
                      alt={`${name} ${lastName}`}
                      type="mechanic"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="material-symbols-outlined text-4xl text-slate-400">person</span>
                  )}

                </div>

                <div className="absolute -bottom-1 -right-1 bg-yellow-400 text-slate-900 w-6 h-6 rounded-full flex items-center justify-center shadow-xs border border-white group-hover:bg-yellow-500 transition-colors">

                  <span className="material-symbols-outlined text-xs">
                    verified
                  </span>

                </div>

              </button>

              {/* BOTÓN CAMBIAR FOTO */}
              <button
                type="button"
                onClick={() =>
                  setIsPhotoModalOpen(true)
                }
                className="mt-2 inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:text-blue-700 bg-blue-50/80 px-2.5 py-0.5 rounded-full border border-blue-200 transition-colors cursor-pointer"
              >

                <span className="material-symbols-outlined text-xs">
                  photo_camera
                </span>

                <span>
                  Cambiar foto
                </span>

              </button>

            </div>

            {/* INFORMACIÓN */}
            <div className="flex-1 text-center sm:text-left space-y-1">

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">

                <h2 className="text-lg font-bold text-slate-900">
                  {name} {lastName}
                </h2>

                <IonBadge
                  color="warning"
                  className="font-bold text-[10px] uppercase"
                >
                  Mecánico Certificado
                </IonBadge>

              </div>

              <p className="text-xs text-slate-500">
                {email}
              </p>

              <p className="text-xs text-slate-600 font-medium flex items-center justify-center sm:justify-start gap-1">

                <span className="material-symbols-outlined text-sm text-slate-400">
                  call
                </span>

                {phone}

              </p>

              <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-2 text-xs">

                <span className="px-2.5 py-1 rounded-lg bg-yellow-50 text-yellow-800 font-bold border border-yellow-200 flex items-center gap-1">

                  <span className="material-symbols-outlined text-xs text-yellow-600">
                    star
                  </span>

                  {rating.toFixed(1)} ({ratingCount} reseñas)

                </span>

                <span className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 font-bold border border-blue-200 flex items-center gap-1">

                  <span className="material-symbols-outlined text-xs">
                    workspace_premium
                  </span>

                  {yearsExperience} años de exp.

                </span>

              </div>

            </div>

          </div>

          {description && (
            <div className="mt-4 pt-4 border-t border-slate-100">

              <p className="text-xs text-slate-600 italic">
                "{description}"
              </p>

            </div>
          )}

        </div>

        {/* ESTADO */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs flex items-center justify-between">

          <div className="flex items-center gap-3">

            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                isMechanicOnline
                  ? 'bg-emerald-100 text-emerald-600'
                  : 'bg-slate-100 text-slate-400'
              }`}
            >

              <span className="material-symbols-outlined text-xl">
                {isMechanicOnline
                  ? 'wifi_tethering'
                  : 'wifi_off'}
              </span>

            </div>

            <div>

              <h4 className="font-bold text-sm text-slate-900">
                Estado en Plataforma
              </h4>

              <p className="text-xs text-slate-500">

                {isMechanicOnline
                  ? 'Recibiendo solicitudes de auxilio en tu radio de cobertura (5 km).'
                  : 'En pausa. No recibirás nuevas solicitudes hasta activarte.'}

              </p>

            </div>

          </div>

          <IonToggle
            checked={isMechanicOnline}
            onIonChange={setIsMechanicOnline}
          />

        </div>

        {/* ESPECIALIDADES */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs space-y-3">

          <div className="flex items-center justify-between">

            <h3 className="font-bold text-sm text-slate-900">
              Especialidades Mecánicas
            </h3>

            <button
              onClick={() =>
                setIsEditModalOpen(true)
              }
              className="text-xs text-blue-600 font-bold hover:underline cursor-pointer"
            >
              Editar
            </button>

          </div>

          <div className="flex flex-wrap gap-2">

            {specialties.length > 0 ? (

              specialties.map((spec) => (

                <span
                  key={spec}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-800 text-xs font-semibold border border-slate-200 flex items-center gap-1.5"
                >

                  <span className="material-symbols-outlined text-xs text-blue-600">
                    check_circle
                  </span>

                  {spec}

                </span>

              ))

            ) : (

              <p className="text-xs text-slate-400">
                Sin especialidades seleccionadas.
              </p>

            )}

          </div>

        </div>

        {/* DOCUMENTACIÓN */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs space-y-3">

          <h3 className="font-bold text-sm text-slate-900">
            Documentación Oficial y Seguridad
          </h3>

          <div className="space-y-2.5">

            {[
              {
                title: 'Identificación Oficial (INE)',
                status: 'Verificado',
                expiry: 'Vigente',
                icon: 'badge',
              },
              {
                title: 'Licencia Federal Tipo E / Chofer',
                status: 'Verificado',
                expiry: 'Vigente',
                icon: 'drive_eta',
              },
              {
                title: 'Póliza de Responsabilidad Civil',
                status: 'Verificado',
                expiry: 'Vigente',
                icon: 'verified_user',
              },
            ].map((doc, idx) => (

              <div
                key={idx}
                className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3 text-xs"
              >

                <div className="flex items-center gap-2.5">

                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold border border-blue-100">

                    <span className="material-symbols-outlined text-base">
                      {doc.icon}
                    </span>

                  </div>

                  <div>

                    <p className="font-bold text-slate-900">
                      {doc.title}
                    </p>

                    <p className="text-[11px] text-slate-500">
                      {doc.expiry}
                    </p>

                  </div>

                </div>

                <span className="px-2 py-1 rounded-md bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                  {doc.status}
                </span>

              </div>

            ))}

          </div>

        </div>

        {/* CUENTA */}
        <div className="bg-white rounded-2xl p-2 border border-slate-200 shadow-2xs divide-y divide-slate-100">

          <button
            onClick={logout}
            className="w-full p-3 flex items-center justify-between text-xs font-bold text-red-600 hover:bg-red-50 transition-colors cursor-pointer rounded-xl"
          >

            <div className="flex items-center gap-2.5">

              <span className="material-symbols-outlined">
                logout
              </span>

              <span>
                Cerrar Sesión del Técnico
              </span>

            </div>

            <span className="material-symbols-outlined text-red-400">
              chevron_right
            </span>

          </button>

        </div>

      </div>

      {/* MODAL EDITAR PERFIL */}
      <IonModal
        isOpen={isEditModalOpen}
        onDidDismiss={() =>
          setIsEditModalOpen(false)
        }
      >

        <div className="p-5 max-w-lg mx-auto bg-white min-h-screen sm:min-h-0 sm:rounded-3xl space-y-4">

          <div className="flex items-center justify-between pb-3 border-b border-slate-100">

            <h3 className="font-bold text-base text-slate-900">
              Editar Perfil del Técnico
            </h3>

            <button
              onClick={() =>
                setIsEditModalOpen(false)
              }
              className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200 cursor-pointer"
            >

              <span className="material-symbols-outlined text-base">
                close
              </span>

            </button>

          </div>

          <form
            onSubmit={handleSaveProfile}
            className="space-y-4"
          >

            <div className="grid grid-cols-2 gap-3">

              <div>

                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nombre
                </label>

                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) =>
                    setName(e.target.value)
                  }
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:border-blue-600 outline-none"
                />

              </div>

              <div>

                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Apellidos
                </label>

                <input
                  type="text"
                  required
                  value={lastName}
                  onChange={(e) =>
                    setLastName(e.target.value)
                  }
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:border-blue-600 outline-none"
                />

              </div>

            </div>

            <div className="grid grid-cols-2 gap-3">

              <div>

                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Teléfono Móvil
                </label>

                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) =>
                    setPhone(e.target.value)
                  }
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:border-blue-600 outline-none"
                />

              </div>

              <div>

                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Años de Experiencia
                </label>

                <input
                  type="number"
                  min="1"
                  max="40"
                  required
                  value={yearsExperience}
                  onChange={(e) =>
                    setYearsExperience(
                      Number(e.target.value)
                    )
                  }
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:border-blue-600 outline-none"
                />

              </div>

            </div>

            <div>

              <label className="block text-xs font-bold text-slate-700 mb-1">
                Correo Electrónico
              </label>

              <input
                type="email"
                required
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:border-blue-600 outline-none"
              />

            </div>

            <div>

              <label className="block text-xs font-bold text-slate-700 mb-1">
                Descripción / Bio Profesional
              </label>

              <textarea
                rows={3}
                value={description}
                onChange={(e) =>
                  setDescription(e.target.value)
                }
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:border-blue-600 outline-none"
                placeholder="Breve reseña..."
              />

            </div>

            <div>

              <label className="block text-xs font-bold text-slate-700 mb-2">
                Especialidades Seleccionadas
              </label>

              <div className="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto p-2 bg-slate-50 rounded-xl border border-slate-200">

                {AVAILABLE_SPECIALTIES.map((spec) => {

                  const isSelected =
                    specialties.includes(spec);

                  return (

                    <button
                      type="button"
                      key={spec}
                      onClick={() =>
                        toggleSpecialty(spec)
                      }
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1 ${
                        isSelected
                          ? 'bg-blue-600 text-white shadow-2xs'
                          : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                      }`}
                    >

                      <span className="material-symbols-outlined text-xs">
                        {isSelected
                          ? 'check'
                          : 'add'}
                      </span>

                      {spec}

                    </button>

                  );
                })}

              </div>

            </div>

            <div className="flex gap-2 pt-2">

              <button
                type="button"
                onClick={() =>
                  setIsEditModalOpen(false)
                }
                className="flex-1 py-3 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl hover:bg-slate-200 cursor-pointer"
              >
                Cancelar
              </button>

              <button
                type="submit"
                className="flex-1 py-3 bg-blue-600 text-white font-bold text-xs rounded-xl shadow-sm hover:bg-blue-700 active:scale-98 cursor-pointer"
              >
                Guardar Cambios
              </button>

            </div>

          </form>

        </div>

      </IonModal>

      {/* MODAL DE FOTO */}
      <AvatarUploadModal
        isOpen={isPhotoModalOpen}
        onClose={() => {
          setIsPhotoModalOpen(false);

          // Recargar perfil para obtener
          // inmediatamente el nuevo avatarUrl
          cargarPerfil();
        }}
        role="mecanico"
      />

    </div>
  );
};