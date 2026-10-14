import React, { useState } from 'react';
import { useClinic } from '../../context/ClinicContext.jsx';
import { getWeekDays, getDayOfWeekName, formatShortDate, formatDateISO, generateTimeSlots } from '../../utils/dateUtils.js';
import { WeekAppointmentItem } from './WeekAppointmentItem.jsx';
import { Plus, Lock, Ban } from 'lucide-react';

const SLOT_START_HOUR = 8;
const SLOT_END_HOUR = 20;

export function WeeklyView() {
  const {
    selectedDate,
    setSelectedDate,
    appointments,
    timeBlocks,
    doctors,
    selectedDoctorId,
    openModal,
    deleteTimeBlock
  } = useClinic();

  const weekDays = getWeekDays(selectedDate);
  const todayISO = formatDateISO(new Date());
  const timeSlots = generateTimeSlots(SLOT_START_HOUR, SLOT_END_HOUR);
  const filteredDoctors = selectedDoctorId === 'all' ? doctors : doctors.filter(d => d.id === selectedDoctorId);
  const doctorPrefill = selectedDoctorId === 'all' ? (filteredDoctors[0]?.id || '') : selectedDoctorId;

  const [blockMode, setBlockMode] = useState(false);

  const blockApplies = (b) => {
    if (!b.doctorId) return true;
    if (selectedDoctorId === 'all') return false;
    return b.doctorId === selectedDoctorId;
  };

  const blockCoversSlot = (b, slot) => {
    if (b.allDay) return true;
    if (!b.startTime) return false;
    if (b.endTime && b.endTime > b.startTime) return slot >= b.startTime && slot < b.endTime;
    return slot === b.startTime;
  };

  const getBlock = (dateStr, slot) =>
    timeBlocks.find(b => b.date === dateStr && blockApplies(b) && blockCoversSlot(b, slot));

  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-2xs overflow-hidden">
      {/* Toolbar */}
      <div className="px-2 py-1.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setBlockMode(!blockMode)}
            className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${
              blockMode
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            <Ban className="w-3.5 h-3.5" />
            {blockMode ? 'Bloqueando: activado' : 'Bloquear horarios'}
          </button>
          <button
            onClick={() => openModal('timeBlock', { prefill: { date: selectedDate, doctorId: selectedDoctorId } })}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-slate-600 bg-white border border-slate-200 rounded-md hover:bg-slate-100"
          >
            <Lock className="w-3.5 h-3.5" />
            Nuevo bloqueo
          </button>
        </div>
        <span className="text-[11px] text-slate-400 hidden sm:block">
          {blockMode ? 'Tocá una celda libre para bloquearla · tocá una bloqueada para liberarla' : 'Tocá una celda libre para agendar'}
        </span>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[920px]">
          {/* Day headers */}
          <div className="grid grid-cols-[70px_repeat(7,minmax(112px,1fr))] bg-slate-50 border-b border-slate-200 sticky top-0 z-10">
            <div className="p-1 text-[10px] font-bold text-slate-500 uppercase text-center border-r border-slate-200 flex items-center justify-center">
              Hora
            </div>
            {weekDays.map(dateStr => {
              const isToday = dateStr === todayISO;
              const isSelected = dateStr === selectedDate;
              return (
                <div
                  key={dateStr}
                  onClick={() => setSelectedDate(dateStr)}
                  className={`relative p-1 border-r border-slate-200 cursor-pointer transition-colors ${
                    isSelected ? 'bg-slate-900' : isToday ? 'bg-emerald-50 hover:bg-emerald-100' : 'hover:bg-slate-100'
                  }`}
                >
                  {isToday && !isSelected && <span className="absolute top-0 left-0 right-0 h-0.5 bg-emerald-500" />}
                  <div className={`text-[10px] font-bold uppercase text-center ${isSelected ? 'text-slate-300' : isToday ? 'text-emerald-700' : 'text-slate-500'}`}>
                    {getDayOfWeekName(dateStr)}
                  </div>
                  <div className={`text-[11px] text-center font-bold ${isSelected ? 'text-white' : 'text-slate-800'}`}>
                    {formatShortDate(dateStr)}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Hour/15-min rows */}
          <div className="divide-y divide-slate-100">
            {timeSlots.map(slot => {
              const isHour = slot.endsWith(':00');
              const isHalf = slot.endsWith(':30');
              return (
                <div key={slot} className={`grid grid-cols-[70px_repeat(7,minmax(112px,1fr))] ${isHour ? 'bg-slate-50/70' : isHalf ? 'bg-slate-50/30' : ''}`}>
                  <div className={`px-1 py-0.5 text-center text-[10px] border-r border-slate-200 flex items-center justify-center tabular-nums ${
                    isHour ? 'text-slate-900 font-bold bg-slate-100/50' : 'text-slate-400'
                  }`}>
                    {slot}
                  </div>

                  {weekDays.map(dateStr => {
                    const block = getBlock(dateStr, slot);
                    const slotAppts = appointments.filter(a => a.date === dateStr && a.time === slot);
                    const activeSlotAppts = slotAppts.filter(a => a.status !== 'cancelled');

                    return (
                      <div key={dateStr} className="px-0.5 py-0.5 border-r border-slate-100 min-h-[26px] group">
                        {block ? (
                          <button
                            onClick={() => deleteTimeBlock(block.id)}
                            title={`Bloqueado: ${block.reason || 'sin motivo'}. Click para liberar.`}
                            className="w-full h-full rounded bg-rose-50 border border-rose-200 hover:border-rose-400 px-1 py-0.5 text-left"
                          >
                            <div className="flex items-center gap-1">
                              <Lock className="w-2.5 h-2.5 text-rose-600 shrink-0" />
                              <span className="text-[9px] font-bold text-rose-700 uppercase truncate">
                                {block.allDay ? 'Día cerrado' : 'Bloqueado'}
                              </span>
                            </div>
                            {block.reason && (
                              <span className="block text-[8px] text-rose-600 truncate leading-tight">{block.reason}</span>
                            )}
                          </button>
                        ) : slotAppts.length === 0 ? (
                          <button
                            onClick={() => {
                              if (blockMode) {
                                openModal('timeBlock', { prefill: { date: dateStr, time: slot, scope: 'puntual', doctorId: selectedDoctorId === 'all' ? 'all' : selectedDoctorId } });
                              } else {
                                openModal('newAppointment', { prefill: { date: dateStr, time: slot, doctorId: doctorPrefill } });
                              }
                            }}
                            className={`w-full h-full min-h-[22px] rounded border border-transparent flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 ${
                              blockMode
                                ? 'text-rose-400 hover:text-rose-600 hover:border-rose-300 hover:bg-rose-50'
                                : 'text-slate-300 hover:text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                            }`}
                          >
                            {blockMode ? <Lock className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                          </button>
                        ) : (
                          <div className="flex flex-col gap-0.5">
                            {slotAppts.map(apt => (
                              <WeekAppointmentItem key={apt.id} appointment={apt} hideTime />
                            ))}
                            {activeSlotAppts.length > 0 ? (
                              <button
                                onClick={() => openModal('newAppointment', { prefill: { date: dateStr, time: slot, doctorId: doctorPrefill, isOverturn: true } })}
                                className="w-full py-0.5 rounded border border-dashed border-amber-300 hover:border-amber-500 hover:bg-amber-50 text-amber-600 text-[9px] font-semibold opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                + Sobreturno
                              </button>
                            ) : (
                              <button
                                onClick={() => openModal('newAppointment', { prefill: { date: dateStr, time: slot, doctorId: doctorPrefill } })}
                                className="w-full py-0.5 rounded border border-dashed border-emerald-300 hover:border-emerald-500 hover:bg-emerald-50 text-emerald-600 text-[9px] font-semibold opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                + Agendar
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
