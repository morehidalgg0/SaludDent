import React, { useState, useEffect } from 'react';
import { useClinic } from '../../context/ClinicContext.jsx';
import { X, Stethoscope, User, Phone, Mail, Award, Clock } from 'lucide-react';

export function NewDoctorModal() {
  const { modals, closeModal, createDoctor, updateDoctor } = useClinic();
  const isOpen = modals.newDoctor?.isOpen;
  const existingDoctor = modals.newDoctor?.doctor;

  const [formData, setFormData] = useState({
    name: '',
    specialty: 'Medicina General',
    room: 'Consultorio 1',
    phone: '',
    email: '',
    license: '',
    defaultSlotMinutes: 15,
    color: '#0d9488'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (existingDoctor) {
      setFormData({
        name: existingDoctor.name || '',
        specialty: existingDoctor.specialty || 'Medicina General',
        room: existingDoctor.room || 'Consultorio 1',
        phone: existingDoctor.phone || '',
        email: existingDoctor.email || '',
        license: existingDoctor.license || '',
        defaultSlotMinutes: existingDoctor.defaultSlotMinutes || 15,
        color: existingDoctor.color || '#0d9488'
      });
    } else {
      setFormData({
        name: '',
        specialty: 'Medicina General',
        room: 'Consultorio 1',
        phone: '',
        email: '',
        license: '',
        defaultSlotMinutes: 15,
        color: '#0d9488'
      });
    }
  }, [existingDoctor, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (existingDoctor) {
        await updateDoctor(existingDoctor.id, formData);
      } else {
        await createDoctor(formData);
      }
      closeModal('newDoctor');
    } catch (err) {
      alert('Error guardando profesional: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-floating border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
              <Stethoscope className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base">
                {existingDoctor ? 'Editar Profesional' : 'Añadir Nuevo Profesional'}
              </h3>
              <p className="text-xs text-slate-400">Asigna consultorio, especialidad e intervalo</p>
            </div>
          </div>
          <button
            onClick={() => closeModal('newDoctor')}
            className="text-slate-400 hover:text-white p-1 rounded transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Nombre y Apellido *
            </label>
            <input
              type="text"
              required
              placeholder="Ej. Dra. Florencia Rossi"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg outline-hidden focus:bg-white focus:border-slate-400 font-bold"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Especialidad *
              </label>
              <select
                value={formData.specialty}
                onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg outline-hidden font-medium"
              >
                <option value="Medicina General">Medicina General</option>
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

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Consultorio Asignado
              </label>
              <input
                type="text"
                placeholder="Ej. Consultorio 1"
                value={formData.room}
                onChange={(e) => setFormData({ ...formData, room: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg outline-hidden"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Matrícula Profesional (MN / MP)
              </label>
              <input
                type="text"
                placeholder="Ej. MN 142.890"
                value={formData.license}
                onChange={(e) => setFormData({ ...formData, license: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg outline-hidden font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Duración de Consulta Habitual
              </label>
              <select
                value={formData.defaultSlotMinutes}
                onChange={(e) => setFormData({ ...formData, defaultSlotMinutes: Number(e.target.value) })}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg outline-hidden font-medium"
              >
                <option value={15}>15 minutos (Consulta estándar)</option>
                <option value={30}>30 minutos (Atención media)</option>
                <option value={45}>45 minutos (Sesión extendida)</option>
                <option value={60}>60 minutos (1 hora)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Teléfono / WhatsApp
              </label>
              <input
                type="text"
                placeholder="+54 9 11 1234-5678"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Email
              </label>
              <input
                type="email"
                placeholder="doctor@clinica.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg outline-hidden"
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => closeModal('newDoctor')}
              className="px-3.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-md transition-colors"
            >
              Cancelar
            </button>
            
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-md shadow-2xs transition-colors"
            >
              {isSubmitting ? 'Guardando...' : existingDoctor ? 'Actualizar Profesional' : 'Guardar Profesional'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
