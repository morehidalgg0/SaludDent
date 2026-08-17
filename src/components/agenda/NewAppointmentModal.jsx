import React, { useState, useEffect } from 'react';
import { useClinic } from '../../context/ClinicContext.jsx';
import { 
  X, 
  Search, 
  UserPlus, 
  Calendar, 
  Clock, 
  Stethoscope, 
  Phone, 
  Flame, 
  Send, 
  CheckCircle2, 
  CreditCard, 
  AlertTriangle,
  User,
  Sparkles
} from 'lucide-react';
import { generateTimeSlots, calculateEndTime, formatHumanDate } from '../../utils/dateUtils.js';

export function NewAppointmentModal() {
  const { 
    modals, 
    closeModal, 
    doctors, 
    patients, 
    createAppointment, 
    createPatient,
    sendWhatsappReminder,
    openModal,
    addToast
  } = useClinic();

  const isOpen = modals.newAppointment.isOpen;
  const prefill = modals.newAppointment.prefill || {};

  // Form State
  const [patientMode, setPatientMode] = useState('existing'); // 'existing' | 'new'
  const [selectedPatientId, setSelectedPatientId] = useState('');
  const [patientSearch, setPatientSearch] = useState('');
  
  // New Patient Form fields
  const [newPatientData, setNewPatientData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    dni: '',
    insurance: 'Particular',
    allergies: ''
  });

  // Appointment fields
  const [doctorId, setDoctorId] = useState(doctors[0]?.id || 'doc-1');
  const [date, setDate] = useState(prefill.date || '2026-08-16');
  const [time, setTime] = useState(prefill.time || '09:00');
  const [durationMinutes, setDurationMinutes] = useState(15);
  const [isOverturn, setIsOverturn] = useState(false);
  const [notes, setNotes] = useState('');
  const [sendWhatsappNow, setSendWhatsappNow] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const timeSlots = generateTimeSlots(8, 20);

  useEffect(() => {
    if (prefill.date) setDate(prefill.date);
    if (prefill.time) setTime(prefill.time);
    if (prefill.doctorId) setDoctorId(prefill.doctorId);
    if (prefill.patientId) {
      setSelectedPatientId(prefill.patientId);
      setPatientMode('existing');
    }
  }, [prefill, isOpen]);

  if (!isOpen) return null;

  const selectedDoctor = doctors.find(d => d.id === doctorId) || doctors[0];
  const selectedPatient = patients.find(p => p.id === selectedPatientId);

  const filteredExistingPatients = patientSearch.trim() === '' ? patients.slice(0, 4) : patients.filter(p => {
    const q = patientSearch.toLowerCase();
    return (
      (p.ficheroNumber && p.ficheroNumber.toLowerCase().includes(q)) ||
      (p.firstName && p.firstName.toLowerCase().includes(q)) ||
      (p.lastName && p.lastName.toLowerCase().includes(q)) ||
      (p.dni && p.dni.includes(q)) ||
      (p.phone && p.phone.includes(q))
    );
  }).slice(0, 5);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let finalPatientId = selectedPatientId;
      let finalPatientName = '';
      let finalPatientPhone = '';
      let finalFicheroNumber = '';

      if (patientMode === 'new') {
        if (!newPatientData.firstName || !newPatientData.lastName || !newPatientData.phone) {
          alert('Por favor complete Nombre, Apellido y Teléfono del nuevo paciente.');
          setIsSubmitting(false);
          return;
        }

        const createdPat = await createPatient(newPatientData);
        finalPatientId = createdPat.id;
        finalPatientName = `${createdPat.firstName} ${createdPat.lastName}`;
        finalPatientPhone = createdPat.phone;
        finalFicheroNumber = createdPat.ficheroNumber;
      } else {
        if (!selectedPatient) {
          alert('Por favor seleccione un paciente cargado o cree uno nuevo en la solapa correspondiente.');
          setIsSubmitting(false);
          return;
        }
        finalPatientName = `${selectedPatient.firstName} ${selectedPatient.lastName}`;
        finalPatientPhone = selectedPatient.phone;
        finalFicheroNumber = selectedPatient.ficheroNumber;
      }

      const newApt = await createAppointment({
        patientId: finalPatientId,
        patientName: finalPatientName,
        patientPhone: finalPatientPhone,
        ficheroNumber: finalFicheroNumber,
        doctorId: selectedDoctor.id,
        doctorName: selectedDoctor.name,
        specialty: selectedDoctor.specialty,
        date,
        time,
        durationMinutes: Number(durationMinutes),
        isOverturn: Boolean(isOverturn),
        notes,
        status: 'pending',
        whatsappStatus: sendWhatsappNow ? 'sent' : 'not_sent'
      });

      addToast({
        type: isOverturn ? 'whatsapp' : 'success',
        title: isOverturn ? 'Sobreturno Agendado' : 'Turno Agendado con Éxito',
        message: `${finalPatientName} el ${date} a las ${time} hs con ${selectedDoctor.name}.`,
        appointment: newApt
      });

      closeModal('newAppointment');

      if (sendWhatsappNow) {
        openModal('whatsappSimulator', { appointment: newApt });
      }

    } catch (err) {
      console.error('Error agendando turno:', err);
      alert('Error: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const endTime = calculateEndTime(time, durationMinutes);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-floating border border-slate-200 w-full max-w-xl overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-brand-500/20 text-brand-400 border border-brand-500/30">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-lg">Agendar Cita Médica</h3>
              <p className="text-xs text-slate-400">Selecciona el paciente, horario e intervalo</p>
            </div>
          </div>
          <button
            onClick={() => closeModal('newAppointment')}
            className="text-slate-400 hover:text-white p-1 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[78vh] overflow-y-auto">
          
          {/* PASO 1: PACIENTE */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <User className="w-4 h-4 text-brand-600" />
                <span>Paso 1: ¿Quién es el paciente?</span>
              </label>

              <div className="flex bg-slate-200/80 p-0.5 rounded-lg text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setPatientMode('existing')}
                  className={`px-2.5 py-1 rounded-md transition-all ${
                    patientMode === 'existing' ? 'bg-white text-brand-800 shadow-2xs' : 'text-slate-600'
                  }`}
                >
                  Buscar Fichero
                </button>
                <button
                  type="button"
                  onClick={() => setPatientMode('new')}
                  className={`px-2.5 py-1 rounded-md transition-all ${
                    patientMode === 'new' ? 'bg-white text-brand-800 shadow-2xs' : 'text-slate-600'
                  }`}
                >
                  + Paciente Nuevo
                </button>
              </div>
            </div>

            {patientMode === 'existing' ? (
              <div className="space-y-2">
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Escribe Nombre, DNI o N° de Fichero (ej: F-10240)..."
                    value={patientSearch}
                    onChange={(e) => setPatientSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500/20 outline-hidden font-medium"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-36 overflow-y-auto">
                  {filteredExistingPatients.map(p => {
                    const isSel = selectedPatientId === p.id;
                    return (
                      <div
                        key={p.id}
                        onClick={() => setSelectedPatientId(p.id)}
                        className={`p-2 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                          isSel 
                            ? 'bg-brand-50 border-brand-500 ring-2 ring-brand-500/20 text-brand-950 font-bold' 
                            : 'bg-white border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="min-w-0">
                          <span className="text-xs truncate block">{p.firstName} {p.lastName}</span>
                          <span className="text-[10px] text-brand-700 font-extrabold">{p.ficheroNumber} • DNI: {p.dni}</span>
                        </div>
                        {isSel && <CheckCircle2 className="w-4 h-4 text-brand-600 shrink-0" />}
                      </div>
                    );
                  })}
                </div>

                {selectedPatient && (
                  <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-950 flex items-center justify-between">
                    <span><strong>Paciente seleccionado:</strong> {selectedPatient.firstName} {selectedPatient.lastName} ({selectedPatient.ficheroNumber})</span>
                  </div>
                )}
              </div>
            ) : (
              /* New patient simple fields */
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 bg-white p-3 rounded-xl border border-slate-200">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Nombre *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Martín"
                    value={newPatientData.firstName}
                    onChange={(e) => setNewPatientData({ ...newPatientData, firstName: e.target.value })}
                    className="w-full p-1.5 text-xs bg-slate-50 border rounded-lg outline-hidden font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Apellido *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Gómez"
                    value={newPatientData.lastName}
                    onChange={(e) => setNewPatientData({ ...newPatientData, lastName: e.target.value })}
                    className="w-full p-1.5 text-xs bg-slate-50 border rounded-lg outline-hidden font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Teléfono (WhatsApp) *</label>
                  <input
                    type="text"
                    required
                    placeholder="+54 9 11 1234-5678"
                    value={newPatientData.phone}
                    onChange={(e) => setNewPatientData({ ...newPatientData, phone: e.target.value })}
                    className="w-full p-1.5 text-xs bg-slate-50 border rounded-lg outline-hidden font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-0.5">DNI / Documento</label>
                  <input
                    type="text"
                    placeholder="Ej. 34.901.882"
                    value={newPatientData.dni}
                    onChange={(e) => setNewPatientData({ ...newPatientData, dni: e.target.value })}
                    className="w-full p-1.5 text-xs bg-slate-50 border rounded-lg outline-hidden"
                  />
                </div>
              </div>
            )}
          </div>

          {/* PASO 2: PROFESIONAL, FECHA Y HORARIO */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
            <label className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-brand-600" />
              <span>Paso 2: ¿Cuándo y con quién?</span>
            </label>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Profesional y Consultorio</label>
              <select
                value={doctorId}
                onChange={(e) => setDoctorId(e.target.value)}
                className="w-full p-2 text-xs font-bold bg-white border border-slate-200 rounded-xl outline-hidden"
              >
                {doctors.map(d => (
                  <option key={d.id} value={d.id}>
                    {d.name} — {d.specialty} ({d.room})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Fecha</label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full p-2 text-xs bg-white border border-slate-200 rounded-xl font-bold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Hora Inicio (cada 15m)</label>
                <select
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full p-2 text-xs bg-white border border-slate-200 rounded-xl font-black"
                >
                  {timeSlots.map(slot => (
                    <option key={slot} value={slot}>{slot} hs</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Duración</label>
                <select
                  value={durationMinutes}
                  onChange={(e) => setDurationMinutes(Number(e.target.value))}
                  className="w-full p-2 text-xs bg-white border border-slate-200 rounded-xl font-bold"
                >
                  <option value={15}>15 minutos (Estándar)</option>
                  <option value={30}>30 minutos</option>
                  <option value={45}>45 minutos</option>
                  <option value={60}>60 minutos (1 hora)</option>
                  <option value={90}>90 minutos</option>
                </select>
              </div>
            </div>

            <div className="p-2 rounded-xl bg-slate-200/70 text-slate-800 text-xs font-bold flex items-center justify-between">
              <span>Franja del Turno:</span>
              <span className="text-brand-900">{time} a {endTime} hs ({durationMinutes} min)</span>
            </div>
          </div>

          {/* PASO 3: SOBRETURNO */}
          <div className={`p-3.5 rounded-2xl border transition-all ${
            isOverturn ? 'bg-amber-50 border-amber-400 ring-2 ring-amber-400/30' : 'bg-slate-50 border-slate-200'
          }`}>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={isOverturn}
                onChange={(e) => setIsOverturn(e.target.checked)}
                className="w-4 h-4 text-amber-600 rounded"
              />
              <div>
                <span className="text-xs font-black text-amber-950 flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-amber-600" />
                  Agendar como SOBRETURNO (Urgencia / Doble cupo)
                </span>
                <span className="text-[11px] text-slate-500 block mt-0.5">
                  Permite agendar al paciente en el mismo horario sin desplazar la grilla normal.
                </span>
              </div>
            </label>
          </div>

          {/* PASO 4: WHATSAPP */}
          <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={sendWhatsappNow}
                onChange={(e) => setSendWhatsappNow(e.target.checked)}
                className="w-4 h-4 text-emerald-600 rounded"
              />
              <div>
                <span className="text-xs font-black text-emerald-950 flex items-center gap-1.5">
                  <Send className="w-4 h-4 text-emerald-600" />
                  Enviar recordatorio interactivo de WhatsApp con botones [Aceptar / Cancelar]
                </span>
              </div>
            </label>
          </div>

          {/* Footer Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => closeModal('newAppointment')}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 text-xs font-black text-white bg-brand-600 hover:bg-brand-700 rounded-xl shadow-md transition-all flex items-center gap-2"
            >
              {isSubmitting ? 'Guardando...' : 'Confirmar y Guardar Turno'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
