import React from 'react';
import { useClinic } from '../../context/ClinicContext.jsx';
import { getBiweeklyDays, getDayOfWeekName, formatShortDate } from '../../utils/dateUtils.js';
import { Plus } from 'lucide-react';

export function BiweeklyView() {
  const { 
    selectedDate, 
    setSelectedDate, 
    setAgendaView,
    appointments, 
    daysSummaries,
    openModal 
  } = useClinic();

  const biweeklyDays = getBiweeklyDays(selectedDate);

  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-2xs p-4 space-y-3">
      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
        <div>
          <h3 className="font-bold text-slate-900 text-sm">Vista Quincenal (15 Días)</h3>
          <p className="text-xs text-slate-500">
            Período: {formatShortDate(biweeklyDays[0])} al {formatShortDate(biweeklyDays[14])}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-2.5">
        {biweeklyDays.map(dateStr => {
          const isCurrentAnchor = dateStr === selectedDate;
          const daySummary = daysSummaries[dateStr] || { total: 0, confirmed: 0, overturns: 0, pending: 0, cancelled: 0 };
          const dayAppts = appointments.filter(a => a.date === dateStr);

          return (
            <div 
              key={dateStr}
              className={`rounded-lg border p-2.5 flex flex-col justify-between transition-all ${
                isCurrentAnchor 
                  ? 'border-slate-400 bg-slate-50/70 ring-1 ring-slate-400' 
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      {getDayOfWeekName(dateStr)}
                    </span>
                    <span className="text-xs font-bold text-slate-900">
                      {formatShortDate(dateStr)}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="px-1.5 py-0.5 rounded text-[11px] font-bold bg-slate-100 text-slate-800">
                      {daySummary.total} {daySummary.total === 1 ? 'turno' : 'turnos'}
                    </span>
                    {daySummary.overturns > 0 && (
                      <span className="block text-[10px] font-bold text-amber-700 mt-0.5">
                        +{daySummary.overturns} sob.
                      </span>
                    )}
                  </div>
                </div>

                {/* Status Chips */}
                <div className="flex flex-wrap gap-1 mb-2">
                  {daySummary.confirmed > 0 && (
                    <span className="px-1 py-0.2 text-[9px] font-semibold rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                      {daySummary.confirmed} conf.
                    </span>
                  )}
                  {daySummary.pending > 0 && (
                    <span className="px-1 py-0.2 text-[9px] font-semibold rounded bg-amber-50 text-amber-800 border border-amber-200">
                      {daySummary.pending} pend.
                    </span>
                  )}
                </div>

                {/* Mini turn list */}
                <div className="space-y-1 mb-2 max-h-32 overflow-y-auto pr-0.5">
                  {dayAppts.length === 0 ? (
                    <p className="text-[11px] text-slate-400 italic py-1 text-center">Sin turnos</p>
                  ) : (
                    dayAppts.slice(0, 3).map(apt => (
                      <div 
                        key={apt.id}
                        onClick={() => openModal('appointmentDetail', { appointment: apt })}
                        className="p-1 rounded bg-slate-50 hover:bg-slate-100 border border-slate-200 text-[11px] cursor-pointer flex items-center justify-between"
                      >
                        <span className="font-bold text-slate-800 mr-1">{apt.time}</span>
                        <span className="text-slate-600 truncate flex-1">{apt.patientName}</span>
                      </div>
                    ))
                  )}
                  {dayAppts.length > 3 && (
                    <p className="text-[10px] text-slate-500 font-medium text-center">
                      +{dayAppts.length - 3} más...
                    </p>
                  )}
                </div>
              </div>

              {/* Action */}
              <div className="pt-1.5 border-t border-slate-100 flex items-center gap-1">
                <button
                  onClick={() => {
                    setSelectedDate(dateStr);
                    setAgendaView('diaria');
                  }}
                  className="flex-1 py-1 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded text-center transition-colors"
                >
                  Ver día
                </button>
                <button
                  onClick={() => openModal('newAppointment', { prefill: { date: dateStr } })}
                  className="p-1 text-slate-500 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded"
                  title="Agendar turno"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
}
