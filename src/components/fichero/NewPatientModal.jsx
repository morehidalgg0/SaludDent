import React, { useState, useEffect } from 'react';
import { useClinic } from '../../context/ClinicContext.jsx';
import { X, UserPlus, FolderArchive, Phone, CreditCard, Shield, AlertTriangle } from 'lucide-react';

export function NewPatientModal() {
  const { modals, closeModal, createPatient, updatePatient, addToast } = useClinic();

  const isOpen = modals.newPatient.isOpen;
  const editingPatient = modals.newPatient.patient;

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dni: '',
    phone: '',
    email: '',
    birthDate: '',
    insurance: 'Particular',
    insuranceNumber: '',
    allergies: '',
    bloodType: '0+',
    emergencyContact: '',
    notes: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editingPatient) {
      setFormData({
        firstName: editingPatient.firstName || '',
        lastName: editingPatient.lastName || '',
        dni: editingPatient.dni || '',
        phone: editingPatient.phone || '',
        email: editingPatient.email || '',
        birthDate: editingPatient.birthDate || '',
        insurance: editingPatient.insurance || 'Particular',
        insuranceNumber: editingPatient.insuranceNumber || '',
        allergies: editingPatient.allergies || '',
        bloodType: editingPatient.bloodType || '0+',
        emergencyContact: editingPatient.emergencyContact || '',
        notes: editingPatient.notes || ''
      });
    } else {
      setFormData({
        firstName: '',
        lastName: '',
        dni: '',
        phone: '',
        email: '',
        birthDate: '',
        insurance: 'Particular',
        insuranceNumber: '',
        allergies: '',
        bloodType: '0+',
        emergencyContact: '',
        notes: ''
      });
    }
  }, [editingPatient, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.firstName || !formData.lastName || !formData.phone) {
      alert('Nombre, Apellido y Teléfono son campos requeridos.');
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingPatient) {
        await updatePatient(editingPatient.id, formData);
        addToast({
          type: 'success',
          title: 'Ficha Actualizada',
          message: `Se actualizaron los datos de ${formData.firstName} ${formData.lastName}.`
        });
      } else {
        const created = await createPatient(formData);
        addToast({
          type: 'success',
          title: 'Paciente Registrado en Fichero',
          message: `${created.firstName} ${created.lastName} asignado al Fichero N° ${created.ficheroNumber}.`
        });
      }
      closeModal('newPatient');
    } catch (err) {
      console.error('Error guardando paciente:', err);
      alert('Error: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-floating border border-slate-200 w-full max-w-xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-brand-500/20 text-brand-400 border border-brand-500/30">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg">
                {editingPatient ? 'Editar Ficha del Paciente' : 'Nuevo Paciente en Fichero'}
              </h3>
              <p className="text-xs text-slate-400">
                {editingPatient ? `Fichero: ${editingPatient.ficheroNumber}` : 'Se asignará automáticamente el próximo número de fichero correlativo'}
              </p>
            </div>
          </div>
          <button
            onClick={() => closeModal('newPatient')}
            className="text-slate-400 hover:text-white p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Nombre *</label>
              <input
                type="text"
                required
                placeholder="Ej. Sofía"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-hidden focus:ring-2 focus:ring-brand-500/20 font-semibold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Apellido *</label>
              <input
                type="text"
                required
                placeholder="Ej. Morales"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-hidden focus:ring-2 focus:ring-brand-500/20 font-semibold"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">DNI / Documento</label>
              <input
                type="text"
                placeholder="Ej. 36.192.834"
                value={formData.dni}
                onChange={(e) => setFormData({ ...formData, dni: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-hidden focus:ring-2 focus:ring-brand-500/20"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Fecha de Nacimiento</label>
              <input
                type="date"
                value={formData.birthDate}
                onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-hidden focus:ring-2 focus:ring-brand-500/20"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Teléfono (WhatsApp) *</label>
              <input
                type="text"
                required
                placeholder="+54 9 11 5566-7788"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-hidden focus:ring-2 focus:ring-brand-500/20 font-semibold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Correo Electrónico</label>
              <input
                type="email"
                placeholder="paciente@correo.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-hidden focus:ring-2 focus:ring-brand-500/20"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Obra Social / Cobertura</label>
              <input
                type="text"
                placeholder="Ej. OSDE 310, Swiss Medical, Particular..."
                value={formData.insurance}
                onChange={(e) => setFormData({ ...formData, insurance: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-hidden focus:ring-2 focus:ring-brand-500/20 font-semibold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">N° de Afiliado / Credencial</label>
              <input
                type="text"
                placeholder="Ej. 310-994821-0"
                value={formData.insuranceNumber}
                onChange={(e) => setFormData({ ...formData, insuranceNumber: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-hidden focus:ring-2 focus:ring-brand-500/20"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-rose-700 mb-1">Alergias Conocidas</label>
              <input
                type="text"
                placeholder="Ej. Penicilina, AINEs, Yodo, Ninguna"
                value={formData.allergies}
                onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-rose-50/50 border border-rose-200 rounded-xl outline-hidden focus:ring-2 focus:ring-rose-500/20 text-rose-900"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Grupo y Factor Sanguíneo</label>
              <select
                value={formData.bloodType}
                onChange={(e) => setFormData({ ...formData, bloodType: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-hidden"
              >
                <option value="0+">0 Positivo (0+)</option>
                <option value="0-">0 Negativo (0-)</option>
                <option value="A+">A Positivo (A+)</option>
                <option value="A-">A Negativo (A-)</option>
                <option value="B+">B Positivo (B+)</option>
                <option value="B-">B Negativo (B-)</option>
                <option value="AB+">AB Positivo (AB+)</option>
                <option value="AB-">AB Negativo (AB-)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Contacto de Emergencia</label>
            <input
              type="text"
              placeholder="Ej. Martín Pérez (Hermano) - +54 9 11 4455-6677"
              value={formData.emergencyContact}
              onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-hidden focus:ring-2 focus:ring-brand-500/20"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Notas Clínicas Generales / Antecedentes</label>
            <textarea
              rows={2}
              placeholder="Antecedentes médicos relevantes, cirugías previas, patologías crónicas..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-hidden focus:ring-2 focus:ring-brand-500/20"
            ></textarea>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => closeModal('newPatient')}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 text-xs font-black text-white bg-brand-600 hover:bg-brand-700 disabled:opacity-50 rounded-xl shadow-md transition-all"
            >
              {isSubmitting ? 'Guardando...' : editingPatient ? 'Actualizar Ficha' : 'Guardar en Fichero'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
