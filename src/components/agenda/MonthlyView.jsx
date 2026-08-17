import React from 'react';
import { useClinic } from '../../context/ClinicContext.jsx';
import { getMonthDays, formatHumanDate, calculateEndTime } from '../../utils/dateUtils.js';
import { AppointmentStatusBadge, OverturnBadge } from '../common/Badge.jsx';
import { 
  Plus, 
  Calendar, 
  Clock, 
  User, 
  Stethoscope, 
  XCircle, 
  RotateCcw, 
  MessageSquare, 
  ChevronRight,
  Send
} from 'lucide-react';

export function MonthlyView() {
  const { 
    selectedDate, 
    setSelectedDate, 
    setAgendaView,
    appointments, 
    daysSummaries,
    openModal,
    quickChangeStatus,
    sendWhatsappBatch
  } = useClinic();

  const monthInfo = getMonthDays(selectedDate);
  const weekDayHeaders = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

  // All appointments of the currently selected day in the monthly view
  const selectedDayAppointments = appointments.filter(a => a.date === selectedDate);
  const selectedDaySummary = daysSummaries[selectedDate] || { total: 0, confirmed: 0, overturns: 0, pending: 0, cancelled: 0 };

  const handleCancelTurn = (apt) => {
    if (confirm(`¿Desea anular el turno de las ${apt.time} hs (${apt.patientName})?`)) {
      quickChangeStatus(apt.id, 'cancelled');
    }
  };

  const handleReactivateTurn = (apt) => {
    quickChangeStatus(apt.id, 'pending');
  };

  return (
    <div className="space-y-4">
      
      {/* Top Monthly Calendar Matrix Card */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-2xs p-4 space-y-3">
        
        {/* Month Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-slate-900 text-base">
              {monthInfo.monthName} {monthInfo.year}
            </h3>
            <p className="text-xs text-slate-500">
              Selecciona cualquier día del mes para ver y gestionar la totalidad de sus turnos.
            </p>
          </div>
          <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded">
            Día activo: <strong>{formatHumanDate(selectedDate)}</strong>
          </span>
        </div>

        {/* Days of Week Header */}
        <div className="grid grid-cols-7 gap-1.5 mb-1 text-center">
          {weekDayHeaders.map(day => (
            <div key={day} className="py-1.5 text-[11px] font-bold text-slate-500 bg-slate-50 rounded border border-slate-100">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1.5">
          {monthInfo.days.map((cell, idx) => {
            const dateStr = cell.date;
            const isSelected = dateStr === selectedDate;
            const daySummary = daysSummaries[dateStr] || { total: 0, confirmed: 0, overturns: 0, pending: 0, cancelled: 0 };
            const dayAppts = appointments.filter(a => a.date === dateStr);

            return (
              <div
                key={idx}
                onClick={() => {
                  setSelectedDate(dateStr);
                }}
                className={`min-h-[115px] p-2 rounded-lg border flex flex-col justify-between transition-all cursor-pointer ${
                  !cell.isCurrentMonth
                    ? 'bg-slate-50/40 border-slate-100 text-slate-300'
                    : isSelected
                    ? 'bg-slate-50 border-slate-900 ring-2 ring-slate-900/20 shadow-xs'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                {/* Day Number and Total Counter */}
                <div className="flex items-start justify-between">
                  <span className={`text-xs font-bold ${
                    isSelected ? 'text-slate-950 font-black' : cell.isCurrentMonth ? 'text-slate-700' : 'text-slate-300'
                  }`}>
                    {cell.dayNumber}
                  </span>

                  {cell.isCurrentMonth && daySummary.total > 0 && (
                    <div className="text-right">
                      <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                        isSelected ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {daySummary.total}
                      </span>
                      {daySummary.overturns > 0 && (
                        <span className="block text-[9px] font-bold text-amber-700">
                          +{daySummary.overturns} sob
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Day Turn Pills (Displays all appointments) */}
                <div className="space-y-1 my-1 max-h-24 overflow-y-auto pr-0.5">
                  {cell.isCurrentMonth && dayAppts.map(apt => {
                    const isCancelled = apt.status === 'cancelled';
                    return (
                      <div 
                        key={apt.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedDate(dateStr);
                          openModal('appointmentDetail', { appointment: apt });
                        }}
                        className={`text-[10px] px-1 py-0.5 rounded truncate border flex items-center justify-between transition-colors ${
                          isCancelled ? 'bg-slate-100 text-slate-400 border-slate-200 line-through opacity-70' :
                          apt.isOverturn ? 'bg-amber-50 text-amber-900 border-amber-300 font-semibold' :
                          apt.status === 'confirmed' ? 'bg-emerald-50 text-emerald-900 border-emerald-200' :
                          'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200'
                        }`}
                        title={`${apt.time} - ${apt.patientName} (${apt.status})`}
                      >
                        <span className="truncate"><strong>{apt.time}</strong> {apt.patientName}</span>
                      </div>
                    );
                  })}
                </div>

                {/* Bottom bar on active day */}
                {cell.isCurrentMonth && (
                  <div className="pt-1 border-t border-slate-100 flex items-center justify-between text-[10px]">
                    <span className="text-slate-400 text-[9px]">
                      {dayAppts.length === 0 ? 'Sin turnos' : `${dayAppts.length} agendados`}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openModal('newAppointment', { prefill: { date: dateStr } });
                      }}
                      className="p-0.5 text-slate-400 hover:text-slate-900 hover:bg-slate-200 rounded"
                      title="Agendar turno en este día"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                )}

              </div>
            );
          })}
        </div>
      </div>

      {/* 2. PANEL DE DETALLE COMPLETO: TODOS LOS TURNOS DEL DÍA SELECCIONADO */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-2xs p-4 space-y-3">
        
        {/* Header of the Selected Day Detail Panel */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-slate-500" />
              <h3 className="font-bold text-slate-900 text-sm">
                Turnos del Día: {formatHumanDate(selectedDate)}
              </h3>
              <span className="px-2 py-0.2 rounded text-xs font-bold bg-slate-100 text-slate-700">
                {selectedDayAppointments.length} turnos agendados
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Puedes revisar los detalles de cada turno, confirmar WhatsApp y <strong>anular turnos directamente</strong>.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => sendWhatsappBatch(selectedDate)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-md transition-colors"
            >
              <Send className="w-3.5 h-3.5 text-emerald-600" />
              <span>Recordatorios WhatsApp</span>
            </button>

            <button
              onClick={() => setAgendaView('diaria')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
            >
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              <span>Ver Grilla Diaria (15m)</span>
            </button>

            <button
              onClick={() => openModal('newAppointment', { prefill: { date: selectedDate } })}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-md transition-colors shadow-2xs"
            >
              <Plus className="w-3.5 h-3.5 text-emerald-400" />
              <span>+ Nuevo Turno</span>
            </button>
          </div>
        </div>

        {/* List of All Appointments for this Selected Day */}
        {selectedDayAppointments.length === 0 ? (
          <div className="p-8 text-center border border-dashed border-slate-200 rounded-lg text-slate-400 text-xs space-y-2">
            <Calendar className="w-6 h-6 mx-auto text-slate-300" />
            <p className="font-semibold text-slate-600">No hay turnos agendados para este día ({formatHumanDate(selectedDate)}).</p>
            <button
              onClick={() => openModal('newAppointment', { prefill: { date: selectedDate } })}
              className="mt-2 text-xs font-bold text-slate-900 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded transition-colors"
            >
              + Agendar Primer Turno
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {selectedDayAppointments.map(apt => {
              const isCancelled = apt.status === 'cancelled';
              const isOverturn = apt.isOverturn;
              const endTime = calculateEndTime(apt.time, apt.durationMinutes);

              return (
                <div
                  key={apt.id}
                  className={`rounded-lg border p-3 flex flex-col justify-between transition-all ${
                    isCancelled
                      ? 'bg-slate-50 border-slate-200 opacity-65'
                      : isOverturn
                      ? 'bg-amber-50/40 border-amber-300'
                      : 'bg-white border-slate-200 shadow-2xs hover:border-slate-300'
                  }`}
                >
                  <div>
                    {/* Header: Time + Overturn */}
                    <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-slate-100">
                      <div className="flex items-center gap-1.5 text-xs font-bold">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span className={isCancelled ? 'line-through text-slate-400' : 'text-slate-900'}>
                          {apt.time} - {endTime} hs
                        </span>
                        <span className="text-[10px] text-slate-400 font-normal">({apt.durationMinutes}m)</span>
                      </div>

                      {isOverturn && <OverturnBadge size="xs" />}
                    </div>

                    {/* Patient & Fichero */}
                    <div className="mb-2">
                      <div className="flex items-center gap-1.5">
                        <h4 className={`text-xs font-bold truncate ${isCancelled ? 'line-through text-slate-500' : 'text-slate-900'}`}>
                          {apt.patientName}
                        </h4>
                      </div>
                      <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-500">
                        <span className="px-1 py-0.2 rounded font-mono text-[9px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                          {apt.ficheroNumber || 'S/F'}
                        </span>
                        {apt.patientPhone && (
                          <span className="text-[10px] text-slate-400">{apt.patientPhone}</span>
                        )}
                      </div>
                    </div>

                    {/* Doctor & Specialty */}
                    <div className="text-[11px] text-slate-500 mb-2 flex items-center gap-1.5">
                      <Stethoscope className="w-3 h-3 text-slate-400 shrink-0" />
                      <span className="truncate font-medium">{apt.doctorName}</span>
                      <span className="text-slate-300">•</span>
                      <span className="text-slate-400 truncate">{apt.specialty}</span>
                    </div>

                    {/* Status Badge */}
                    <div className="mb-3">
                      <AppointmentStatusBadge status={apt.status} size="xs" />
                    </div>
                  </div>

                  {/* DIRECT ACTION BUTTONS (INCLUYE ANULAR TURNO DIRECTO) */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-1.5">
                    
                    {/* Anular o Reactivar */}
                    {!isCancelled ? (
                      <button
                        onClick={() => handleCancelTurn(apt)}
                        className="px-2.5 py-1 rounded text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 flex items-center gap-1 transition-colors"
                        title="Anular este turno"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Anular Turno</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => handleReactivateTurn(apt)}
                        className="px-2.5 py-1 rounded text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 flex items-center gap-1 transition-colors"
                        title="Reactivar este turno"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Reactivar</span>
                      </button>
                    )}

                    {/* WhatsApp & Detalle */}
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => openModal('whatsappSimulator', { appointment: apt })}
                        className="p-1 rounded text-slate-500 hover:text-emerald-700 hover:bg-slate-100 transition-colors"
                        title="WhatsApp"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => openModal('appointmentDetail', { appointment: apt })}
                        className="px-2 py-1 rounded text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                      >
                        Detalles
                      </button>
                    </div>

                  </div>

                </div>
              );
            })}
          </div>
        )}

      </div>

    </div>
  );
}
