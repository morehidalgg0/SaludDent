import React, { useState } from 'react';
import { useClinic } from '../../context/ClinicContext.jsx';
import { generateTimeSlots } from '../../utils/dateUtils.js';
import { X, Clock, Ban } from 'lucide-react';

export function TimeBlockModal() {
  const { modals, closeModal, createTimeBlock, doctors } = useClinic();
  const { isOpen, prefill = {} } = modals.timeBlock || {};
  const [date, setDate] = useState(prefill.date || '');
  const [scope, setScope] = useState(prefill.scope || 'range');
  const [startTime, setStartTime] = useState(prefill.time || '10:00');
  const [endTime, setEndTime] = useState(prefill.endTime || '11:00');
  const [allDay, setAllDay] = useState(false);
  const [reason, setReason] = useState('');
  const [doctorId, setDoctorId] = useState(prefill.doctorId || 'all');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;
  const timeSlots = generateTimeSlots(7, 21);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await createTimeBlock({
        date,
        startTime: allDay ? '' : startTime,
        endTime: allDay ? '' : (scope === 'puntual' ? startTime : endTime),
        allDay,
        reason: reason || 'Bloqueo',
        doctorId: doctorId === 'all' ? null : doctorId
      });
      closeModal('timeBlock');
      setReason('');
    } catch (err) {
      console.error(err);
    }
    setIsSubmitting(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-3" onClick={() => closeModal('timeBlock')}>
      <div className="bg-white rounded-lg shadow-2xl max-w-md w-full" onClick={(e) => e.stopPropagation()}>
        <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Ban className="w-5 h-5 text-rose-600" />
            <h3 className="font-bold text-slate-900">Bloquear horario</h3>
          </div>
          <button onClick={() => closeModal('timeBlock')} className="p-1.5 hover:bg-slate-100 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-4 space-y-3">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Fecha</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full px-2.5 py-1.5 text-sm border border-slate-200 rounded" required />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Profesional</label>
            <select value={doctorId} onChange={(e) => setDoctorId(e.target.value)} className="w-full px-2.5 py-1.5 text-sm border border-slate-200 rounded">
              <option value="all">Todos los profesionales</option>
              {doctors.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button type="button" onClick={() => setAllDay(!allDay)} className={`px-2.5 py-1.5 text-xs font-semibold rounded border ${allDay ? 'bg-rose-50 border-rose-300 text-rose-700' : 'bg-slate-50 border-slate-200 text-slate-700'}`}>
              Día completo
            </button>
            <select value={scope} onChange={(e) => setScope(e.target.value)} disabled={allDay} className="px-2.5 py-1.5 text-xs font-semibold border border-slate-200 rounded">
              <option value="puntual">Horario puntual</option>
              <option value="range">Rango de horas</option>
            </select>
          </div>
          {!allDay && (
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs text-slate-500 mb-1">Desde</label>
                <select value={startTime} onChange={(e) => setStartTime(e.target.value)} className="w-full px-2.5 py-1.5 text-sm border border-slate-200 rounded">
                  {timeSlots.map(ts => <option key={ts} value={ts}>{ts}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">Hasta</label>
                <select value={endTime} onChange={(e) => setEndTime(e.target.value)} className="w-full px-2.5 py-1.5 text-sm border border-slate-200 rounded">
                  {timeSlots.map(ts => <option key={ts} value={ts}>{ts}</option>)}
                </select>
              </div>
            </div>
          )}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Motivo</label>
            <input value={reason} onChange={(e) => setReason(e.target.value)} className="w-full px-2.5 py-1.5 text-sm border border-slate-200 rounded" placeholder="Ej.: Clínica cerrada, Desayuno, Reunión" />
          </div>
          <div className="flex items-center justify-end gap-2 pt-2">
            <button type="button" onClick={() => closeModal('timeBlock')} className="px-3 py-1.5 text-sm font-semibold text-slate-600 bg-slate-50 hover:bg-slate-100 rounded">Cancelar</button>
            <button type="submit" disabled={isSubmitting || !date} className="px-3 py-1.5 text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded disabled:opacity-50">
              Bloquear
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
