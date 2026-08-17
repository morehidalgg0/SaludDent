import React, { useState, useEffect } from 'react';
import { useClinic } from '../../context/ClinicContext.jsx';
import { api } from '../../services/api.js';
import { SpecialtyDynamicModule } from './specialties/SpecialtyDynamicModule.jsx';
import { 
  X, 
  Stethoscope, 
  User, 
  Calendar, 
  Activity, 
  FileText, 
  Plus, 
  Trash2, 
  Printer, 
  CheckCircle2, 
  HeartPulse, 
  Thermometer, 
  Droplet,
  Sparkles
} from 'lucide-react';

export function MedicalRecordEditorModal() {
  const { modals, closeModal, doctors, patients, addToast, openModal } = useClinic();

  const isOpen = modals.medicalRecordEditor.isOpen;
  const initPatient = modals.medicalRecordEditor.patient;
  const initDoctor = modals.medicalRecordEditor.doctor;
  const initRecord = modals.medicalRecordEditor.record;

  const [patientId, setPatientId] = useState(initPatient?.id || patients[0]?.id || '');
  const [doctorId, setDoctorId] = useState(doctors[0]?.id || 'doc-1');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [reason, setReason] = useState('');
  const [anamnesis, setAnamnesis] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [treatmentPlan, setTreatmentPlan] = useState('');
  
  // Vital signs
  const [vitalSigns, setVitalSigns] = useState({
    bloodPressure: '120/80',
    heartRate: '72',
    temperature: '36.5',
    oxygenSat: '98',
    bloodGlucose: ''
  });

  // Dynamic specialty payload
  const [specialtyData, setSpecialtyData] = useState({});

  // Prescriptions list
  const [prescriptions, setPrescriptions] = useState([
    { medication: '', dosage: '', duration: '' }
  ]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initRecord) {
      setPatientId(initRecord.patientId);
      setDate(initRecord.date);
      setReason(initRecord.reason || '');
      setAnamnesis(initRecord.anamnesis || '');
      setDiagnosis(initRecord.diagnosis || '');
      setTreatmentPlan(initRecord.treatmentPlan || '');
      setVitalSigns(initRecord.vitalSigns || {});
      setSpecialtyData(initRecord.specialtyData || {});
      setPrescriptions(initRecord.prescriptions?.length ? initRecord.prescriptions : [{ medication: '', dosage: '', duration: '' }]);
    } else {
      if (initPatient?.id) setPatientId(initPatient.id);
      if (initDoctor?.id) setDoctorId(initDoctor.id);
      setReason('');
      setAnamnesis('');
      setDiagnosis('');
      setTreatmentPlan('');
      setVitalSigns({ bloodPressure: '120/80', heartRate: '72', temperature: '36.5', oxygenSat: '98' });
      setSpecialtyData({});
      setPrescriptions([{ medication: '', dosage: '', duration: '' }]);
    }
  }, [initRecord, initPatient, initDoctor, isOpen]);

  if (!isOpen) return null;

  const selectedDoctor = doctors.find(d => d.id === doctorId) || doctors[0];
  const selectedPatient = patients.find(p => p.id === patientId) || patients[0];

  const addPrescriptionItem = () => {
    setPrescriptions([...prescriptions, { medication: '', dosage: '', duration: '' }]);
  };

  const updatePrescriptionItem = (idx, field, val) => {
    const updated = [...prescriptions];
    updated[idx][field] = val;
    setPrescriptions(updated);
  };

  const removePrescriptionItem = (idx) => {
    setPrescriptions(prescriptions.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!patientId) {
      alert('Por favor seleccione un paciente.');
      return;
    }

    setIsSubmitting(true);
    try {
      const recordPayload = {
        patientId,
        doctorId: selectedDoctor.id,
        doctorName: selectedDoctor.name,
        specialty: selectedDoctor.specialty,
        specialtySlug: selectedDoctor.specialtySlug,
        date,
        reason,
        vitalSigns,
        anamnesis,
        diagnosis,
        treatmentPlan,
        specialtyData,
        prescriptions: prescriptions.filter(p => p.medication.trim() !== '')
      };

      if (initRecord?.id) {
        await api.updateMedicalRecord(initRecord.id, recordPayload);
        addToast({ type: 'success', title: 'Historia Clínica Actualizada', message: 'Evolución guardada correctamente.' });
      } else {
        await api.createMedicalRecord(recordPayload);
        addToast({ type: 'success', title: 'Nueva Evolución Médica Registrada', message: `Guardada para ${selectedPatient?.firstName} ${selectedPatient?.lastName}.` });
      }

      closeModal('medicalRecordEditor');
    } catch (err) {
      console.error('Error guardando historia clínica:', err);
      alert('Error: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-floating border border-slate-200 w-full max-w-4xl overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Top Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              <Stethoscope className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg">
                {initRecord ? 'Editar Consulta / Evolución Médica' : 'Nueva Consulta en Historia Clínica'}
              </h3>
              <p className="text-xs text-slate-400">
                Módulo multidisciplinar adaptado a {selectedDoctor?.specialty}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                openModal('prescriptionPrint', {
                  record: {
                    patientName: `${selectedPatient?.firstName} ${selectedPatient?.lastName}`,
                    ficheroNumber: selectedPatient?.ficheroNumber,
                    dni: selectedPatient?.dni,
                    doctorName: selectedDoctor?.name,
                    specialty: selectedDoctor?.specialty,
                    license: selectedDoctor?.license,
                    date,
                    diagnosis,
                    treatmentPlan,
                    prescriptions
                  },
                  type: 'receta'
                });
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600/40 hover:bg-indigo-600 text-white rounded-xl text-xs font-bold border border-indigo-500/40 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimir Receta / Certificado</span>
            </button>

            <button onClick={() => closeModal('medicalRecordEditor')} className="text-slate-400 hover:text-white p-1 rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[78vh] overflow-y-auto">
          
          {/* Header Data: Patient & Professional */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Paciente</label>
              <select
                value={patientId}
                onChange={(e) => setPatientId(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg outline-hidden font-bold"
              >
                {patients.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.firstName} {p.lastName} ({p.ficheroNumber})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Profesional & Especialidad</label>
              <select
                value={doctorId}
                onChange={(e) => setDoctorId(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg outline-hidden font-bold"
              >
                {doctors.map(d => (
                  <option key={d.id} value={d.id}>
                    {d.name} — {d.specialty}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Fecha de Consulta</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg outline-hidden font-bold"
              />
            </div>
          </div>

          {/* Vital Signs Row */}
          <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
              Signos Vitales y Parámetros Clínicos
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              <div>
                <label className="block text-[10px] font-semibold text-slate-500">Tensión Arterial</label>
                <input
                  type="text"
                  placeholder="120/80"
                  value={vitalSigns.bloodPressure || ''}
                  onChange={(e) => setVitalSigns({ ...vitalSigns, bloodPressure: e.target.value })}
                  className="w-full p-1.5 text-xs bg-slate-50 border rounded-lg font-bold text-slate-800"
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-slate-500">Frec. Cardíaca (lpm)</label>
                <input
                  type="text"
                  placeholder="72"
                  value={vitalSigns.heartRate || ''}
                  onChange={(e) => setVitalSigns({ ...vitalSigns, heartRate: e.target.value })}
                  className="w-full p-1.5 text-xs bg-slate-50 border rounded-lg font-bold text-slate-800"
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-slate-500">Temperatura (°C)</label>
                <input
                  type="text"
                  placeholder="36.5"
                  value={vitalSigns.temperature || ''}
                  onChange={(e) => setVitalSigns({ ...vitalSigns, temperature: e.target.value })}
                  className="w-full p-1.5 text-xs bg-slate-50 border rounded-lg font-bold text-slate-800"
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-slate-500">Sat. Oxígeno (%)</label>
                <input
                  type="text"
                  placeholder="98"
                  value={vitalSigns.oxygenSat || ''}
                  onChange={(e) => setVitalSigns({ ...vitalSigns, oxygenSat: e.target.value })}
                  className="w-full p-1.5 text-xs bg-slate-50 border rounded-lg font-bold text-slate-800"
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-slate-500">Glucemia (mg/dL)</label>
                <input
                  type="text"
                  placeholder="90"
                  value={vitalSigns.bloodGlucose || ''}
                  onChange={(e) => setVitalSigns({ ...vitalSigns, bloodGlucose: e.target.value })}
                  className="w-full p-1.5 text-xs bg-slate-50 border rounded-lg font-bold text-slate-800"
                />
              </div>
            </div>
          </div>

          {/* Anamnesis & Motivo */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Motivo de Consulta *</label>
              <input
                type="text"
                required
                placeholder="Ej. Control de rutina, dolor lumbar agudo, sensibilidad molar..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-hidden focus:ring-2 focus:ring-indigo-500/20 font-semibold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Diagnóstico Principal (CIE-10)</label>
              <input
                type="text"
                placeholder="Ej. K02.1 - Caries de dentina / M54.5 - Lumbago no especificado"
                value={diagnosis}
                onChange={(e) => setDiagnosis(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-hidden focus:ring-2 focus:ring-indigo-500/20 font-semibold text-indigo-900"
              />
            </div>
          </div>

          {/* Anamnesis / Historia de la Enfermedad Actual */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Anamnesis / Evolución Clínica</label>
            <textarea
              rows={2}
              placeholder="Descripción del cuadro clínico, tiempo de evolución, síntomas asociados..."
              value={anamnesis}
              onChange={(e) => setAnamnesis(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-hidden focus:ring-2 focus:ring-indigo-500/20"
            ></textarea>
          </div>

          {/* DYNAMIC SPECIALTY MODULE (Odontogram / Kinesio Body Map / Nutrition / etc.) */}
          <SpecialtyDynamicModule
            specialtySlug={selectedDoctor?.specialtySlug}
            data={specialtyData}
            onChange={(newData) => setSpecialtyData(newData)}
          />

          {/* Treatment Plan */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Plan de Tratamiento / Conducta Médica</label>
            <textarea
              rows={2}
              placeholder="Procedimientos realizados en consultorio, pautas a seguir, fecha de próximo control..."
              value={treatmentPlan}
              onChange={(e) => setTreatmentPlan(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-hidden focus:ring-2 focus:ring-indigo-500/20"
            ></textarea>
          </div>

          {/* Prescriptions & Medication Generator */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Prescripción de Medicamentos & Recetario
              </span>
              <button
                type="button"
                onClick={addPrescriptionItem}
                className="px-2.5 py-1 text-xs font-bold text-brand-700 bg-white hover:bg-brand-50 border border-brand-200 rounded-lg flex items-center gap-1 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Agregar Fármaco</span>
              </button>
            </div>

            <div className="space-y-2">
              {prescriptions.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Medicamento (Ej. Amoxicilina 500mg)"
                    value={item.medication}
                    onChange={(e) => updatePrescriptionItem(idx, 'medication', e.target.value)}
                    className="flex-2 px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg outline-hidden font-semibold"
                  />
                  <input
                    type="text"
                    placeholder="Posología (Ej. 1 comp cada 8hs)"
                    value={item.dosage}
                    onChange={(e) => updatePrescriptionItem(idx, 'dosage', e.target.value)}
                    className="flex-2 px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg outline-hidden"
                  />
                  <input
                    type="text"
                    placeholder="Duración (Ej. 7 días)"
                    value={item.duration}
                    onChange={(e) => updatePrescriptionItem(idx, 'duration', e.target.value)}
                    className="flex-1 px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg outline-hidden"
                  />
                  {prescriptions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removePrescriptionItem(idx)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => closeModal('medicalRecordEditor')}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 text-xs font-black text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 rounded-xl shadow-md transition-all flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isSubmitting ? 'Guardando...' : 'Guardar en Historia Clínica'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
