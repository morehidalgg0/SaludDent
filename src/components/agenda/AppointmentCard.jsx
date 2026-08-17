import React from 'react';
import { useClinic } from '../../context/ClinicContext.jsx';
import { AppointmentStatusBadge, OverturnBadge } from '../common/Badge.jsx';
import { Clock, MessageSquare, ChevronRight, XCircle, RotateCcw } from 'lucide-react';
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
      className={`group rounded-lg border bg-white transition-all cursor-pointer shadow-2xs hover:border-slate-400 ${
        isOverturn
          ? 'border-amber-300 bg-amber-50/30'
          : isCancelled
          ? 'border-slate-200 opacity-65 bg-slate-50'
          : 'border-slate-200 hover:shadow-xs'
      } ${compact ? 'p-2' : 'p-2.5'}`}
    >
      {/* Top row: Time + Duration + Sobreturno Pill */}
      <div className="flex items-center justify-between gap-1 mb-1">
        <div className="flex items-center gap-1.5 text-xs">
          <span className={`font-bold ${isCancelled ? 'line-through text-slate-400' : 'text-slate-900'}`}>
            {appointment.time} - {endTime}
          </span>
          <span className="text-[10px] text-slate-400">
            ({appointment.durationMinutes} min)
          </span>
        </div>

        {isOverturn && <OverturnBadge size="xs" />}
      </div>

      {/* Patient Name + Fichero Tag */}
      <div className="flex items-start justify-between gap-2 mb-1">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <span className={`font-semibold text-xs truncate ${isCancelled ? 'text-slate-500 line-through' : 'text-slate-900 group-hover:text-slate-950'}`}>
              {appointment.patientName}
            </span>
          </div>
          <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-500">
            <span className="px-1 py-0.2 rounded font-mono text-[9px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
              {appointment.ficheroNumber || 'S/F'}
            </span>
            {appointment.patientPhone && (
              <span className="truncate text-[10px] text-slate-400 hidden sm:inline">
                {appointment.patientPhone}
              </span>
            )}
          </div>
        </div>

        {/* Action icons (WhatsApp & Anular) */}
        <div className="flex items-center gap-0.5">
          {!isCancelled && (
            <button
              onClick={handleCancelTurn}
              className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors shrink-0"
              title="Anular turno desde la agenda"
            >
              <XCircle className="w-3.5 h-3.5" />
            </button>
          )}

          {isCancelled && (
            <button
              onClick={handleReactivateTurn}
              className="p-1 rounded text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors shrink-0"
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
            className="p-1 rounded text-slate-400 hover:text-emerald-700 hover:bg-slate-100 transition-colors shrink-0"
            title="Ver o enviar recordatorio WhatsApp"
          >
            <MessageSquare className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Doctor (if not compact) */}
      {!compact && (
        <div className="text-[11px] text-slate-500 mb-1.5 truncate">
          {appointment.doctorName} <span className="text-slate-300">•</span> {appointment.specialty}
        </div>
      )}

      {/* Footer: Status Badge & Quick Actions */}
      <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-xs">
        <AppointmentStatusBadge status={appointment.status} size="xs" />
        
        <div className="flex items-center gap-1.5">
          {!isCancelled ? (
            <button
              onClick={handleCancelTurn}
              className="text-[10px] text-rose-600 hover:text-rose-800 font-semibold opacity-0 group-hover:opacity-100 transition-opacity hover:underline"
            >
              Anular
            </button>
          ) : (
            <button
              onClick={handleReactivateTurn}
              className="text-[10px] text-slate-600 hover:text-slate-900 font-semibold opacity-0 group-hover:opacity-100 transition-opacity hover:underline"
            >
              Reactivar
            </button>
          )}

          <span className="text-[10px] text-slate-400 group-hover:text-slate-700 flex items-center font-medium opacity-0 group-hover:opacity-100 transition-opacity">
            Detalles <ChevronRight className="w-3 h-3 ml-0.5" />
          </span>
        </div>
      </div>
    </div>
  );
}
