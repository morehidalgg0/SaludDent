import React from 'react';
import { useClinic } from '../../context/ClinicContext.jsx';
import { AppointmentStatusBadge, OverturnBadge } from '../common/Badge.jsx';
import { MessageSquare, ChevronRight, XCircle, RotateCcw } from 'lucide-react';
import { calculateEndTime } from '../../utils/dateUtils.js';

export function AppointmentCard({ appointment, compact = false }) {
  const { openModal, quickChangeStatus } = useClinic();

  const isOverturn = appointment.isOverturn;
  const isCancelled = appointment.status === 'cancelled';
  const endTime = calculateEndTime(appointment.time, appointment.durationMinutes);

  const handleCancelTurn = (e) => {
    e.stopPropagation();
    if (confirm(`¿Desea anular el turno de las ${appointment.time} hs (${appointment.patientName})?`)) {
      quickChangeStatus(appointment.id, 'cancelled');
    }
  };

  const handleReactivateTurn = (e) => {
    e.stopPropagation();
    quickChangeStatus(appointment.id, 'pending');
  };

  return (
    <div
      onClick={() => openModal('appointmentDetail', { appointment })}
      className={`group rounded-md border bg-white transition-all cursor-pointer hover:border-slate-400 ${
        isOverturn
          ? 'border-amber-300 bg-amber-50/40'
          : isCancelled
          ? 'border-slate-200 opacity-70 bg-slate-50'
          : 'border-slate-200 hover:shadow-xs'
      } px-2 py-1`}
    >
      {/* Line 1: time + patient + fichero + flags + actions */}
      <div className="flex items-center gap-1.5 min-w-0">
        <span className={`text-[11px] font-bold tabular-nums shrink-0 ${isCancelled ? 'line-through text-slate-400' : 'text-slate-900'}`}>
          {appointment.time}
        </span>
        <span className={`text-[11px] font-semibold truncate flex-1 min-w-0 ${isCancelled ? 'text-slate-500 line-through' : 'text-slate-800'}`}>
          {appointment.patientName}
        </span>
        <span className="px-1 rounded font-mono text-[9px] font-bold bg-slate-100 text-slate-600 border border-slate-200 shrink-0 hidden lg:inline">
          {appointment.ficheroNumber || 'S/F'}
        </span>
        {isOverturn && <OverturnBadge size="xs" />}

        <div className="flex items-center gap-0.5 shrink-0">
          {!isCancelled ? (
            <button
              onClick={handleCancelTurn}
              className="p-0.5 rounded text-slate-300 hover:text-rose-600 hover:bg-rose-50 transition-colors"
              title="Anular turno"
            >
              <XCircle className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={handleReactivateTurn}
              className="p-0.5 rounded text-slate-300 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              title="Reactivar turno"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              openModal('whatsappSimulator', { appointment });
            }}
            className="p-0.5 rounded text-slate-300 hover:text-emerald-700 hover:bg-slate-100 transition-colors"
            title="Recordatorio WhatsApp"
          >
            <MessageSquare className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Line 2: status + duration/doctor */}
      <div className="flex items-center justify-between gap-1.5 mt-0.5">
        <div className="flex items-center gap-1.5 min-w-0">
          <AppointmentStatusBadge status={appointment.status} size="xs" />
          {!compact && (
            <span className="text-[10px] text-slate-400 truncate">
              {appointment.doctorName} <span className="text-slate-300">•</span> {appointment.durationMinutes}m
            </span>
          )}
        </div>
        <ChevronRight className="w-3 h-3 text-slate-300 group-hover:text-slate-600 shrink-0" />
      </div>
    </div>
  );
}
