import React from 'react';
import { useClinic } from '../../context/ClinicContext.jsx';
import { OverturnBadge } from '../common/Badge.jsx';

const STATUS_STYLE = {
  confirmed: { border: '#059669', label: 'Confirmado' },
  waiting: { border: '#0284c7', label: 'En espera' },
  attended: { border: '#475569', label: 'Atendido' },
  pending: { border: '#f59e0b', label: 'Pendiente' },
  cancelled: { border: '#e11d48', label: 'Cancelado' },
  absent: { border: '#94a3b8', label: 'Ausente' }
};

export function WeekAppointmentItem({ appointment, hideTime = false }) {
  const { openModal } = useClinic();

  const isCancelled = appointment.status === 'cancelled';
  const style = STATUS_STYLE[appointment.status] || STATUS_STYLE.pending;

  return (
    <button
      type="button"
      onClick={() => openModal('appointmentDetail', { appointment })}
      title={`${appointment.time} · ${appointment.patientName}`}
      className="w-full text-left rounded-md border border-slate-200 bg-white py-1 pl-2 pr-1.5 transition-all hover:border-slate-400 hover:shadow-xs"
      style={{ borderLeft: `3px solid ${style.border}` }}
    >
      {!hideTime && (
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className={`text-[11px] font-bold tabular-nums ${isCancelled ? 'text-slate-400 line-through' : 'text-slate-900'}`}>
            {appointment.time}
          </span>
          {appointment.isOverturn && <OverturnBadge size="xs" />}
          {isCancelled && <span className="text-[9px] font-black text-rose-600 uppercase">Anulado</span>}
        </div>
      )}
      {hideTime && (appointment.isOverturn || isCancelled) && (
        <div className="flex items-center gap-1 flex-wrap">
          {appointment.isOverturn && <OverturnBadge size="xs" />}
          {isCancelled && <span className="text-[9px] font-black text-rose-600 uppercase">Anulado</span>}
        </div>
      )}

      <p className={`text-xs font-semibold leading-snug mt-0.5 break-words ${
        isCancelled ? 'text-slate-400 line-through' : 'text-slate-900'
      }`}>
        {appointment.patientName}
      </p>

      <div className="flex items-center gap-1.5 mt-0.5">
        <span className="font-mono text-[9px] font-bold text-slate-500 bg-slate-100 border border-slate-200 rounded px-1">
          {appointment.ficheroNumber || 'S/F'}
        </span>
        <span className="text-[9px] text-slate-400">{style.label}</span>
      </div>
    </button>
  );
}
