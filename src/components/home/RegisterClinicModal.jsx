import React, { useState } from 'react';
import { useClinic } from '../../context/ClinicContext.jsx';
import { 
  X, 
  Building2, 
  User, 
  Mail, 
  Lock, 
  Phone, 
  Stethoscope, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  Sparkles,
  ArrowRight,
  ChevronLeft
} from 'lucide-react';

export function RegisterClinicModal() {
  const { modals, closeModal, registerClinicAccount } = useClinic();
  const isOpen = modals.registerClinicModal?.isOpen;

  const [step, setStep] = useState(1); // 1: Clinic & Admin info, 2: Doctors setup, 3: Confirmation
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Clinic & Admin form
  const [clinicData, setClinicData] = useState({
    adminName: '',
    email: '',
    password: '',
    clinicName: '',
    phone: '',
    specialty: 'Policonsultorio Médico',
    planId: 'professional'
  });

  // Doctors list to onboard
  const [doctorsList, setDoctorsList] = useState([
    {
      name: 'Dr. Santiago Valenzuela',
      specialty: 'Medicina General',
      room: 'Consultorio 1',
      color: '#0d9488',
      defaultSlotMinutes: 15
    },
    {
      name: 'Dra. Florencia Rossi',
      specialty: 'Odontología',
      room: 'Consultorio 2',
      color: '#0284c7',
      defaultSlotMinutes: 30
    }
  ]);

  if (!isOpen) return null;

  const handleAddDoctorField = () => {
    setDoctorsList([
      ...doctorsList,
      {
        name: '',
        specialty: 'Consulta General',
        room: `Consultorio ${doctorsList.length + 1}`,
        color: '#6366f1',
        defaultSlotMinutes: 15
      }
    ]);
  };

  const handleRemoveDoctorField = (index) => {
    if (doctorsList.length === 1) {
      alert('Debe incluir al menos 1 profesional en la clínica.');
      return;
    }
    setDoctorsList(doctorsList.filter((_, idx) => idx !== index));
  };

  const handleDoctorChange = (index, field, value) => {
    const updated = [...doctorsList];
    updated[index][field] = value;
    setDoctorsList(updated);
  };

  const handleNextStep = (e) => {
    e.preventDefault();
    if (step === 1) {
      if (!clinicData.adminName || !clinicData.email || !clinicData.clinicName) {
        alert('Por favor complete los campos obligatorios.');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      // Validate doctors
      const invalid = doctorsList.some(d => !d.name.trim());
      if (invalid) {
        alert('Por favor complete el nombre de todos los profesionales.');
        return;
      }
      handleFinalSubmit();
    }
  };

  const handleFinalSubmit = async () => {
    setIsSubmitting(true);
    try {
      await registerClinicAccount({
        ...clinicData,
        initialDoctors: doctorsList
      });
      closeModal('registerClinicModal');
    } catch (err) {
      alert('Error registrando cuenta: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-floating border border-slate-200 w-full max-w-2xl overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500 text-slate-950 font-bold flex items-center justify-center text-sm">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base">Registro de Nueva Clínica</h3>
              <p className="text-xs text-slate-400">
                Paso {step} de 2: {step === 1 ? 'Datos de la Cuenta y Centro Médico' : 'Añadir Profesionales del Equipo'}
              </p>
            </div>
          </div>
          <button
            onClick={() => closeModal('registerClinicModal')}
            className="text-slate-400 hover:text-white p-1 rounded transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="h-1 w-full bg-slate-100">
          <div 
            className="h-full bg-slate-900 transition-all duration-300"
            style={{ width: step === 1 ? '50%' : '100%' }}
          ></div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleNextStep} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          
          {/* STEP 1: CLINIC & ADMIN DATA */}
          {step === 1 && (
            <div className="space-y-4">
              
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-600 flex items-center justify-between">
                <span>Tu registro incluye <strong>14 días de prueba gratuita</strong> sin cargos.</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                  Prueba Gratis
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nombre del Administrador *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Dr. Santiago Valenzuela"
                    value={clinicData.adminName}
                    onChange={(e) => setClinicData({ ...clinicData, adminName: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg outline-hidden focus:bg-white focus:border-slate-400 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Email de Acceso *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="admin@tuclinica.com"
                    value={clinicData.email}
                    onChange={(e) => setClinicData({ ...clinicData, email: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg outline-hidden focus:bg-white focus:border-slate-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nombre de la Clínica / Centro Médico *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Centro Médico San Lucas"
                    value={clinicData.clinicName}
                    onChange={(e) => setClinicData({ ...clinicData, clinicName: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg outline-hidden focus:bg-white focus:border-slate-400 font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Teléfono / WhatsApp de la Clínica *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="+54 9 11 4455-8899"
                    value={clinicData.phone}
                    onChange={(e) => setClinicData({ ...clinicData, phone: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg outline-hidden focus:bg-white focus:border-slate-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Tipo de Centro / Especialidad Principal
                  </label>
                  <select
                    value={clinicData.specialty}
                    onChange={(e) => setClinicData({ ...clinicData, specialty: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg outline-hidden font-medium"
                  >
                    <option value="Policonsultorio Médico">Policonsultorio Multidisciplinario</option>
                    <option value="Clínica Odontológica">Clínica Odontológica</option>
                    <option value="Centro de Kinesiología y Rehabilitación">Centro de Kinesiología y Fisiatría</option>
                    <option value="Centro Pediátrico">Centro Pediátrico</option>
                    <option value="Centro Oftalmológico">Centro Oftalmológico</option>
                    <option value="Consultorio Particular">Consultorio Particular</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Plan Mensual Inicial
                  </label>
                  <select
                    value={clinicData.planId}
                    onChange={(e) => setClinicData({ ...clinicData, planId: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg outline-hidden font-bold"
                  >
                    <option value="basic">Plan Básico ($15.000 / mes - 1 Profesional)</option>
                    <option value="professional">Plan Profesional ($29.000 / mes - Hasta 5 Profesionales)</option>
                    <option value="enterprise">Plan Corporativo ($55.000 / mes - Ilimitado)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Contraseña de Seguridad *
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={clinicData.password}
                  onChange={(e) => setClinicData({ ...clinicData, password: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg outline-hidden focus:bg-white focus:border-slate-400 font-mono"
                />
              </div>

            </div>
          )}

          {/* STEP 2: DOCTORS TEAM SETUP */}
          {step === 2 && (
            <div className="space-y-4">
              
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div>
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Profesionales del Equipo ({doctorsList.length})
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Añade a los médicos que tendrán consultorio y agenda asignada en tu clínica.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleAddDoctorField}
                  className="px-2.5 py-1 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Añadir Profesional</span>
                </button>
              </div>

              <div className="space-y-3">
                {doctorsList.map((doc, idx) => (
                  <div 
                    key={idx}
                    className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/60 space-y-2.5 relative group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-slate-600">
                        Profesional #{idx + 1}
                      </span>
                      {doctorsList.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveDoctorField(idx)}
                          className="text-slate-400 hover:text-rose-600 p-0.5 rounded transition-colors"
                          title="Eliminar profesional"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] font-medium text-slate-600 mb-0.5">
                          Nombre y Apellido *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="Ej. Dr. Carlos Benítez"
                          value={doc.name}
                          onChange={(e) => handleDoctorChange(idx, 'name', e.target.value)}
                          className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded outline-hidden font-medium"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-medium text-slate-600 mb-0.5">
                          Especialidad *
                        </label>
                        <select
                          value={doc.specialty}
                          onChange={(e) => handleDoctorChange(idx, 'specialty', e.target.value)}
                          className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded outline-hidden"
                        >
                          <option value="Medicina General">Medicina General / Clínica Médica</option>
                          <option value="Odontología">Odontología</option>
                          <option value="Kinesiología">Kinesiología & Fisiatría</option>
                          <option value="Nutrición">Nutrición</option>
                          <option value="Pediatría">Pediatría</option>
                          <option value="Oftalmología">Oftalmología</option>
                          <option value="Psicología">Psicología</option>
                          <option value="Traumatología">Traumatología</option>
                          <option value="Cardiología">Cardiología</option>
                          <option value="Dermatología">Dermatología</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] font-medium text-slate-600 mb-0.5">
                          Consultorio Asignado
                        </label>
                        <input
                          type="text"
                          placeholder="Ej. Consultorio 1"
                          value={doc.room}
                          onChange={(e) => handleDoctorChange(idx, 'room', e.target.value)}
                          className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded outline-hidden"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-medium text-slate-600 mb-0.5">
                          Duración de Consulta Habitual
                        </label>
                        <select
                          value={doc.defaultSlotMinutes}
                          onChange={(e) => handleDoctorChange(idx, 'defaultSlotMinutes', Number(e.target.value))}
                          className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded outline-hidden"
                        >
                          <option value={15}>15 minutos (Consulta estándar)</option>
                          <option value={30}>30 minutos (Atención media)</option>
                          <option value={45}>45 minutos (Sesión extendida)</option>
                          <option value={60}>60 minutos (1 hora)</option>
                        </select>
                      </div>
                    </div>

                  </div>
                ))}
              </div>

            </div>
          )}

          {/* Footer Buttons */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-100">
            {step === 2 ? (
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-md transition-colors flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Volver</span>
              </button>
            ) : (
              <div></div>
            )}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => closeModal('registerClinicModal')}
                className="px-3.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-md transition-colors"
              >
                Cancelar
              </button>
              
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-md shadow-2xs transition-colors flex items-center gap-1.5"
              >
                {isSubmitting ? (
                  <span>Configurando clínica...</span>
                ) : step === 1 ? (
                  <>
                    <span>Siguiente: Añadir Profesionales</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Finalizar y Abrir Agenda</span>
                  </>
                )}
              </button>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
}
