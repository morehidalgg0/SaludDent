import React from 'react';
import { useClinic } from '../../context/ClinicContext.jsx';
import { formatHumanDate } from '../../utils/dateUtils.js';

export function DailySummaryBar({ customSummary = null, customDate = null }) {
  const { daySummary, selectedDate } = useClinic();
  const summary = customSummary || daySummary;
  const dateToDisplay = customDate || selectedDate;

  if (!summary) return null;

  const total = summary.total || 0;
  const confirmed = summary.confirmed || 0;
  const pending = summary.pending || 0;
  const waiting = summary.waiting || 0;
  const overturns = summary.overturns || 0;
  const cancelled = summary.cancelled || 0;
  const totalMinutes = summary.totalMinutesScheduled || 0;

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  const formattedTime = `${hours}h ${minutes > 0 ? `${minutes}m` : ''}`;

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-3 shadow-2xs">
      <div className="flex flex-wrap items-center justify-between gap-y-2 text-xs">
        
        {/* Metric 1: Total */}
        <div className="flex items-center gap-2 pr-4 border-r border-slate-200">
          <span className="text-slate-500 font-medium">Total agendados:</span>
          <span className="text-sm font-bold text-slate-900">{total}</span>
        </div>

        {/* Metric 2: Confirmados */}
        <div className="flex items-center gap-2 pr-4 border-r border-slate-200">
          <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
          <span className="text-slate-500 font-medium">Confirmados por WhatsApp:</span>
          <span className="font-bold text-emerald-900 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
            {confirmed}
          </span>
        </div>

        {/* Metric 3: En Sala de Espera */}
        <div className="flex items-center gap-2 pr-4 border-r border-slate-200">
          <span className="w-2 h-2 rounded-full bg-sky-600"></span>
          <span className="text-slate-500 font-medium">En sala de espera:</span>
          <span className="font-bold text-sky-900 bg-sky-50 px-1.5 py-0.2 rounded border border-sky-200">
            {waiting}
          </span>
        </div>

        {/* Metric 4: Sobreturns */}
        <div className="flex items-center gap-2 pr-4 border-r border-slate-200">
          <span className="text-slate-500 font-medium">Sobreturnos:</span>
          <span className={`font-bold px-1.5 py-0.2 rounded ${
            overturns > 0 
              ? 'bg-amber-100 text-amber-900 border border-amber-300 font-extrabold' 
              : 'text-slate-700 bg-slate-100'
          }`}>
            {overturns}
          </span>
        </div>

        {/* Metric 5: Pendientes */}
        <div className="flex items-center gap-2 pr-4 border-r border-slate-200">
          <span className="text-slate-500 font-medium">Pendientes:</span>
          <span className="font-semibold text-slate-700">{pending}</span>
        </div>

        {/* Metric 6: Tiempo total */}
        <div className="flex items-center gap-2 text-slate-500">
          <span>Tiempo programado:</span>
          <span className="font-semibold text-slate-800">{formattedTime}</span>
        </div>

      </div>
    </div>
  );
}
