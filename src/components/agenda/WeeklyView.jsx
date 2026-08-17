import React from 'react';
import { useClinic } from '../../context/ClinicContext.jsx';
import { getWeekDays, getDayOfWeekName, formatShortDate } from '../../utils/dateUtils.js';
import { AppointmentCard } from './AppointmentCard.jsx';
import { Plus, Calendar } from 'lucide-react';

export function WeeklyView() {
  const { 
    selectedDate, 
    setSelectedDate, 
    setAgendaView,
    appointments, 
    daysSummaries,
    openModal 
  } = useClinic();

  const weekDays = getWeekDays(selectedDate);

  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-2xs overflow-hidden">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 divide-y sm:divide-y-0 lg:divide-x divide-slate-200">
        {weekDays.map(dateStr => {
          const isSelected = dateStr === selectedDate;
          const daySummary = daysSummaries[dateStr] || { total: 0, confirmed: 0, overturns: 0, pending: 0, cancelled: 0 };
          const dayAppts = appointments.filter(a => a.date === dateStr);

          return (
            <div key={dateStr} className={`flex flex-col min-h-[500px] ${isSelected ? 'bg-slate-50/50' : 'bg-white'}`}>
              
              {/* Day Header */}
              <div 
                onClick={() => {
                  setSelectedDate(dateStr);
                }}
                className={`p-2.5 border-b border-slate-200 cursor-pointer transition-colors ${
                  isSelected ? 'bg-slate-900 text-white' : 'bg-slate-50 hover:bg-slate-100 text-slate-900'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-[11px] font-bold uppercase tracking-wider ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                    {getDayOfWeekName(dateStr)}
                  </span>
                  <span className={`text-xs font-bold ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                    {formatShortDate(dateStr)}
                  </span>
                </div>

                {/* Day Summary */}
                <div className="mt-1.5 pt-1.5 border-t border-slate-200/40 flex items-center justify-between text-xs">
                  <span className={`font-semibold ${isSelected ? 'text-white' : 'text-slate-700'}`}>
                    {daySummary.total} turnos
                  </span>
                  
                  <div className="flex items-center gap-1">
                    {daySummary.confirmed > 0 && (
                      <span className={`px-1 py-0.2 rounded text-[10px] font-bold ${
                        isSelected ? 'bg-emerald-600 text-white' : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      }`}>
                        {daySummary.confirmed} conf.
                      </span>
                    )}
                    {daySummary.overturns > 0 && (
                      <span className={`px-1 py-0.2 rounded text-[10px] font-bold ${
                        isSelected ? 'bg-amber-400 text-slate-950' : 'bg-amber-100 text-amber-900 border border-amber-300'
                      }`}>
                        +{daySummary.overturns} sob.
                      </span>
                    )}
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedDate(dateStr);
                    setAgendaView('diaria');
                  }}
                  className={`mt-2 w-full py-1 text-[11px] font-medium rounded text-center transition-colors ${
                    isSelected ? 'bg-white/20 hover:bg-white/30 text-white' : 'bg-slate-200/60 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  Ver día (15 min)
                </button>
              </div>

              {/* Day Appointments List */}
              <div className="p-2 flex-1 space-y-1.5 overflow-y-auto max-h-[600px] bg-slate-50/20">
                {dayAppts.length === 0 ? (
                  <div className="h-32 flex flex-col items-center justify-center text-center p-2 text-slate-400 border border-dashed border-slate-200 rounded my-2">
                    <span className="text-xs">Sin turnos</span>
                    <button
                      onClick={() => openModal('newAppointment', { prefill: { date: dateStr } })}
                      className="mt-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-2 py-0.5 rounded"
                    >
                      + Agendar
                    </button>
                  </div>
                ) : (
                  dayAppts.map(apt => (
                    <AppointmentCard key={apt.id} appointment={apt} compact={true} />
                  ))
                )}
              </div>

              {/* Quick Add Button */}
              <div className="p-2 border-t border-slate-100 bg-white">
                <button
                  onClick={() => openModal('newAppointment', { prefill: { date: dateStr } })}
                  className="w-full py-1 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded flex items-center justify-center gap-1 transition-colors"
                >
                  <Plus className="w-3 h-3" />
                  <span>Nuevo Turno</span>
                </button>
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
}
