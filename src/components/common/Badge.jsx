import React from 'react';
import { Check, Clock, AlertCircle, X, User } from 'lucide-react';

export function AppointmentStatusBadge({ status, size = 'sm' }) {
  const configs = {
    confirmed: {
      label: 'Confirmado por WhatsApp',
      classes: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      dot: 'bg-emerald-600'
    },
    waiting: {
      label: 'En sala de espera',
      classes: 'bg-sky-50 text-sky-800 border-sky-200',
      dot: 'bg-sky-600'
    },
    attended: {
      label: 'Atendido',
      classes: 'bg-slate-100 text-slate-800 border-slate-300',
      dot: 'bg-slate-600'
    },
    pending: {
      label: 'Pendiente',
      classes: 'bg-amber-50 text-amber-800 border-amber-200',
      dot: 'bg-amber-500'
    },
    cancelled: {
      label: 'Cancelado',
      classes: 'bg-rose-50 text-rose-800 border-rose-200',
      dot: 'bg-rose-600'
    },
    absent: {
      label: 'Ausente',
      classes: 'bg-slate-100 text-slate-600 border-slate-200',
      dot: 'bg-slate-400'
    }
  };

  const config = configs[status] || configs.pending;
  const sizeClasses = size === 'xs' 
    ? 'px-1.5 py-0.5 text-[10px]' 
    : size === 'lg' 
    ? 'px-2.5 py-1 text-xs' 
    : 'px-2 py-0.5 text-xs';

  return (
    <span className={`inline-flex items-center gap-1.5 font-medium rounded-md border ${config.classes} ${sizeClasses}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`}></span>
      <span>{config.label}</span>
    </span>
  );
}

export function OverturnBadge({ size = 'sm' }) {
  return (
    <span className={`inline-flex items-center font-bold rounded tracking-wide border border-amber-300 bg-amber-100 text-amber-900 ${
      size === 'xs' ? 'px-1 py-0.2 text-[9px]' : 'px-1.5 py-0.5 text-[10px]'
    }`}>
      SOBRETURNO
    </span>
  );
}

export function WhatsappStatusBadge({ status }) {
  if (status === 'confirmed_by_patient') {
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
        <Check className="w-3 h-3 text-emerald-600" /> Confirmado por paciente
      </span>
    );
  }
  if (status === 'cancelled_by_patient') {
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-rose-800 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
        <X className="w-3 h-3 text-rose-600" /> Cancelado por paciente
      </span>
    );
  }
  if (status === 'sent') {
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-700 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
        <Clock className="w-3 h-3 text-slate-400" /> Recordatorio enviado
      </span>
    );
  }
  return (
    <span className="inline-flex items-center text-[11px] text-slate-500 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
      Sin enviar
    </span>
  );
}
