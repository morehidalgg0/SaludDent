import React, { useState, useEffect } from 'react';
import { useClinic } from '../../context/ClinicContext.jsx';
import {
  Settings,
  Building2,
  Stethoscope,
  MapPin,
  Phone,
  Mail,
  BadgeCheck,
  Save,
  Loader2,
  MessageSquare,
  CheckCircle2
} from 'lucide-react';

const EMPTY_FORM = {
  name: '',
  dentistName: '',
  license: '',
  ttc: '',
  specialty: '',
  address: '',
  phone: '',
  email: ''
};

export function SettingsView() {
  const { clinic, updateClinic } = useClinic();

  const [form, setForm] = useState(EMPTY_FORM);
  const [isSaving, setIsSaving] = useState(false);
  const [savedAt, setSavedAt] = useState(null);

  useEffect(() => {
    setForm({
      name: clinic?.name || '',
      dentistName: clinic?.dentistName || '',
      license: clinic?.license || '',
      ttc: clinic?.ttc || '',
      specialty: clinic?.specialty || '',
      address: clinic?.address || '',
      phone: clinic?.phone || '',
      email: clinic?.email || ''
    });
  }, [clinic]);

  const set = (key) => (e) => setForm(prev => ({ ...prev, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setSavedAt(null);
    try {
      await updateClinic(form);
      setSavedAt(new Date());
    } catch (err) {
      console.error('Error guardando configuración:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const previewMessage =
`RECORDATORIO DE TURNO - ${(form.name || 'Clínica').toUpperCase()}

Hola [Paciente], le recordamos su turno medico:
Fecha: [fecha]
Hora: [hora] hs
Profesional: [profesional]
Especialidad: [especialidad]${form.address ? `\nDireccion: ${form.address}` : ''}${form.phone ? `\nTel: ${form.phone}` : ''}
N Fichero: [n°]`;

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {/* Header Bar */}
      <div className="bg-white rounded-lg p-3.5 border border-slate-200 shadow-2xs flex items-center gap-2">
        <div className="p-2 rounded-lg bg-slate-900 text-emerald-400">
          <Settings className="w-4 h-4" />
        </div>
        <div>
          <h2 className="text-base font-bold text-slate-900">Configuración</h2>
          <p className="text-xs text-slate-500">
            Datos del odontólogo y de la clínica que aparecen en los recordatorios de WhatsApp.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        {/* Left: forms */}
        <div className="lg:col-span-2 space-y-3">
          {/* Datos del odontólogo */}
          <div className="bg-white rounded-lg border border-slate-200 shadow-2xs p-4 space-y-3">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
              <Stethoscope className="w-4 h-4 text-brand-600" />
              <h3 className="text-sm font-bold text-slate-900">Datos del Odontólogo/a</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Nombre del profesional
                </label>
                <input
                  type="text"
                  value={form.dentistName}
                  onChange={set('dentistName')}
                  placeholder="Ej. Dr. Juan Pérez"
                  className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-md focus:bg-white focus:border-slate-400 outline-hidden"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Matrícula
                </label>
                <input
                  type="text"
                  value={form.license}
                  onChange={set('license')}
                  placeholder="Ej. MP 12345"
                  className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-md focus:bg-white focus:border-slate-400 outline-hidden"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  T.T.C.
                </label>
                <input
                  type="text"
                  value={form.ttc}
                  onChange={set('ttc')}
                  placeholder="Ej. valor de T.T.C."
                  className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-md focus:bg-white focus:border-slate-400 outline-hidden"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Especialidad
                </label>
                <input
                  type="text"
                  value={form.specialty}
                  onChange={set('specialty')}
                  placeholder="Ej. Odontología"
                  className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-md focus:bg-white focus:border-slate-400 outline-hidden"
                />
              </div>
            </div>
          </div>

          {/* Datos de la clínica */}
          <div className="bg-white rounded-lg border border-slate-200 shadow-2xs p-4 space-y-3">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
              <Building2 className="w-4 h-4 text-brand-600" />
              <h3 className="text-sm font-bold text-slate-900">Datos de la Clínica / Consultorio</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Nombre de la clínica
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={set('name')}
                  placeholder="Ej. Odontología Pinamar"
                  className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-md focus:bg-white focus:border-slate-400 outline-hidden"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-[11px] font-bold text-slate-600 mb-1 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-slate-400" />
                  Dirección del consultorio
                </label>
                <input
                  type="text"
                  value={form.address}
                  onChange={set('address')}
                  placeholder="Ej. Av. Principal 123, Piso 2 - Pinamar"
                  className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-md focus:bg-white focus:border-slate-400 outline-hidden"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1 flex items-center gap-1">
                  <Phone className="w-3 h-3 text-slate-400" />
                  Teléfono
                </label>
                <input
                  type="text"
                  value={form.phone}
                  onChange={set('phone')}
                  placeholder="Ej. +54 9 11 1234-5678"
                  className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-md focus:bg-white focus:border-slate-400 outline-hidden"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1 flex items-center gap-1">
                  <Mail className="w-3 h-3 text-slate-400" />
                  Email
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={set('email')}
                  placeholder="Ej. contacto@clinica.com"
                  className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-md focus:bg-white focus:border-slate-400 outline-hidden"
                />
              </div>
            </div>
          </div>

          {/* Save bar */}
          <div className="bg-white rounded-lg border border-slate-200 shadow-2xs p-3 flex items-center justify-between gap-3">
            <div className="text-xs text-slate-500 flex items-center gap-1.5 min-w-0">
              {savedAt ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span className="text-emerald-700 font-semibold">
                    Guardado {savedAt.toLocaleTimeString()}
                  </span>
                </>
              ) : (
                <span className="flex items-center gap-1.5">
                  <BadgeCheck className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  Los cambios impactan en los próximos recordatorios.
                </span>
              )}
            </div>
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 rounded-lg transition-colors disabled:opacity-50 shrink-0"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Guardando...</span>
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" />
                  <span>Guardar Cambios</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right: WhatsApp preview */}
        <div className="space-y-3">
          <div className="bg-white rounded-lg border border-slate-200 shadow-2xs p-4 space-y-3">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
              <MessageSquare className="w-4 h-4 text-emerald-600" />
              <h3 className="text-sm font-bold text-slate-900">Vista previa del mensaje</h3>
            </div>
            <p className="text-[11px] text-slate-500">
              Así verá el paciente el recordatorio que se envía al asignar un turno.
            </p>
            <div className="bg-[#0b141a] rounded-lg p-3">
              <div className="bg-[#202c33] rounded-2xl rounded-tl-xs p-3 text-slate-200 border border-slate-700/50">
                <pre className="whitespace-pre-wrap text-[11px] leading-snug font-sans">
                  {previewMessage}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
