import React from 'react';
import { useClinic } from '../../context/ClinicContext.jsx';
import { AppointmentStatusBadge, OverturnBadge, WhatsappStatusBadge } from '../common/Badge.jsx';
import { 
  X, 
  Clock, 
  Calendar, 
  Phone, 
  User, 
  Stethoscope, 
  MessageSquare, 
  CheckCircle2, 
  UserCheck, 
  Trash2, 
  FileText, 
  AlertCircle, 
  ExternalLink,
  Flame,
  Send,
  XCircle,
  RotateCcw
} from 'lucide-react';
import { calculateEndTime, formatHumanDate } from '../../utils/dateUtils.js';

export function AppointmentDetailModal() {
  const { 
    modals, 
    closeModal, 
    quickChangeStatus, 
    deleteAppointment, 
    openModal, 
    sendWhatsappReminder,
    setCurrentSection,
    patients
  } = useClinic();

  const isOpen = modals.appointmentDetail.isOpen;
  const appointment = modals.appointmentDetail.appointment;

  if (!isOpen || !appointment) return null;

  const isCancelled = appointment.status === 'cancelled';
  const endTime = calculateEndTime(appointment.time, appointment.durationMinutes);
  const patient = patients.find(p => p.id === appointment.patientId);

  const cleanPhone = (appointment.patientPhone || '').replace(/\D/g, '');
  const directWaLink = `https://wa.me/${cleanPhone}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-floating border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className={`p-4 text-white flex items-center justify-between ${
          isCancelled ? 'bg-slate-700' : appointment.isOverturn ? 'bg-amber-600' : 'bg-slate-900'
        }`}>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-white/10">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base">Detalle del Turno</h3>
                {appointment.isOverturn && <OverturnBadge size="xs" />}
                {isCancelled && (
                  <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-rose-500 text-white">
                    ANULADO
                  </span>
                )}
              </div>
              <p className="text-xs text-white/80">{formatHumanDate(appointment.date)}</p>
            </div>
          </div>
          <button
            onClick={() => closeModal('appointmentDetail')}
            className="text-white/80 hover:text-white p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
          
          {/* Patient Card Preview */}
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-400">Paciente</span>
                <h4 className="font-extrabold text-base text-slate-900">{appointment.patientName}</h4>
              </div>
              <span className="px-2 py-0.5 rounded text-xs font-black bg-slate-100 text-slate-700 border border-slate-200 font-mono">
                {appointment.ficheroNumber || 'S/F'}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-600 pt-1 border-t border-slate-200/60">
              <span className="flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                {appointment.patientPhone || 'Sin teléfono'}
              </span>
              {patient && (
                <button
                  onClick={() => {
                    closeModal('appointmentDetail');
                    openModal('patientDetail', { patient });
                  }}
                  className="text-xs font-bold text-slate-900 hover:underline"
                >
                  Ver Ficha en Fichero →
                </button>
              )}
            </div>
          </div>

          {/* Appointment Schedule & Doctor */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Horario</span>
              <div className="flex items-center gap-1.5 font-extrabold text-sm text-slate-900">
                <Clock className="w-4 h-4 text-slate-500" />
                <span className={isCancelled ? 'line-through text-slate-400' : ''}>{appointment.time} a {endTime} hs</span>
              </div>
              <span className="text-[11px] text-slate-500">{appointment.durationMinutes} minutos</span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Profesional</span>
              <div className="flex items-center gap-1.5 font-bold text-xs text-slate-900">
                <Stethoscope className="w-3.5 h-3.5 text-slate-500" />
                <span className="truncate">{appointment.doctorName}</span>
              </div>
              <span className="text-[11px] text-slate-500 truncate block">{appointment.specialty}</span>
            </div>
          </div>

          {/* Current Status and WhatsApp Tracking */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700">Estado del Turno</span>
              <AppointmentStatusBadge status={appointment.status} size="sm" />
            </div>
            
            <div className="flex items-center justify-between text-xs text-slate-600 pt-2 border-t border-slate-200/70">
              <span>Sincronización WhatsApp:</span>
              <WhatsappStatusBadge status={appointment.whatsappStatus} />
            </div>
          </div>

          {/* Notes */}
          {appointment.notes && (
            <div className="p-3 bg-amber-50/50 border border-amber-200 rounded-xl text-xs text-amber-900">
              <span className="font-bold block mb-0.5">Observaciones:</span>
              <p>{appointment.notes}</p>
            </div>
          )}

          {/* Fast Status Switcher Bar */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Cambiar Estado Rápido
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              <button
                onClick={() => {
                  quickChangeStatus(appointment.id, 'confirmed');
                  closeModal('appointmentDetail');
                }}
                className={`py-1.5 px-2 rounded-lg text-xs font-bold border transition-colors ${
                  appointment.status === 'confirmed'
                    ? 'bg-emerald-700 text-white border-emerald-700'
                    : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                }`}
              >
                Confirmado
              </button>
              <button
                onClick={() => {
                  quickChangeStatus(appointment.id, 'waiting');
                  closeModal('appointmentDetail');
                }}
                className={`py-1.5 px-2 rounded-lg text-xs font-bold border transition-colors ${
                  appointment.status === 'waiting'
                    ? 'bg-sky-700 text-white border-sky-700'
                    : 'bg-sky-50 text-sky-800 border-sky-200 hover:bg-sky-100'
                }`}
              >
                En Sala
              </button>
              <button
                onClick={() => {
                  quickChangeStatus(appointment.id, 'attended');
                  closeModal('appointmentDetail');
                }}
                className={`py-1.5 px-2 rounded-lg text-xs font-bold border transition-colors ${
                  appointment.status === 'attended'
                    ? 'bg-slate-800 text-white border-slate-800'
                    : 'bg-slate-100 text-slate-800 border-slate-300 hover:bg-slate-200'
                }`}
              >
                Atendido
              </button>
            </div>
          </div>

          {/* Major Actions */}
          <div className="space-y-2 pt-2 border-t border-slate-200">
            
            {/* ANULAR TURNO O REACTIVAR BUTTON */}
            {!isCancelled ? (
              <button
                onClick={async () => {
                  if (confirm(`¿Desea anular el turno de las ${appointment.time} hs (${appointment.patientName})?`)) {
                    await quickChangeStatus(appointment.id, 'cancelled');
                    closeModal('appointmentDetail');
                  }
                }}
                className="w-full py-2.5 px-4 rounded-xl font-bold text-xs text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 flex items-center justify-center gap-2 transition-colors"
              >
                <XCircle className="w-4 h-4 text-rose-600" />
                <span>Anular Turno (Liberar Horario)</span>
              </button>
            ) : (
              <button
                onClick={async () => {
                  await quickChangeStatus(appointment.id, 'pending');
                  closeModal('appointmentDetail');
                }}
                className="w-full py-2.5 px-4 rounded-xl font-bold text-xs text-slate-800 bg-slate-100 hover:bg-slate-200 border border-slate-200 flex items-center justify-center gap-2 transition-colors"
              >
                <RotateCcw className="w-4 h-4 text-slate-600" />
                <span>Reactivar Turno Anulado</span>
              </button>
            )}

            {/* WhatsApp Simulator & Action Button */}
            <button
              onClick={() => {
                closeModal('appointmentDetail');
                openModal('whatsappSimulator', { appointment });
              }}
              className="w-full py-2 px-4 rounded-xl font-semibold text-xs text-emerald-900 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 flex items-center justify-center gap-2 transition-colors"
            >
              <MessageSquare className="w-4 h-4 text-emerald-700" />
              <span>Simulador / Mensaje de WhatsApp</span>
            </button>

            {/* Direct Medical Record Launcher */}
            <button
              onClick={() => {
                closeModal('appointmentDetail');
                setCurrentSection('historias');
                openModal('medicalRecordEditor', {
                  patient: patient || { id: appointment.patientId, firstName: appointment.patientName, lastName: '', ficheroNumber: appointment.ficheroNumber },
                  doctor: { name: appointment.doctorName, specialty: appointment.specialty }
                });
              }}
              className="w-full py-2 px-4 rounded-xl font-semibold text-xs text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 flex items-center justify-center gap-2 transition-colors"
            >
              <FileText className="w-4 h-4 text-slate-500" />
              <span>Abrir Historia Clínica de la Consulta</span>
            </button>

            {/* Delete Turn */}
            <button
              onClick={async () => {
                if (confirm(`¿Desea eliminar definitivamente el registro del turno de ${appointment.patientName}?`)) {
                  await deleteAppointment(appointment.id);
                  closeModal('appointmentDetail');
                }
              }}
              className="w-full py-1.5 px-4 text-center font-medium text-[11px] text-slate-400 hover:text-rose-600 transition-colors"
            >
              Eliminar registro definitivamente
            </button>

          </div>

        </div>

      </div>
    </div>
  );
}
