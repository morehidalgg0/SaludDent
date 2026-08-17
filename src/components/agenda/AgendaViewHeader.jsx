import React from 'react';
import { useClinic } from '../../context/ClinicContext.jsx';
import { 
  ChevronLeft, 
  ChevronRight, 
  Send, 
  Filter
} from 'lucide-react';
import { formatHumanDate, formatDateISO, parseDateISO } from '../../utils/dateUtils.js';

export function AgendaViewHeader() {
  const { 
    agendaView, 
    setAgendaView, 
    selectedDate, 
    setSelectedDate, 
    doctors, 
    selectedDoctorId, 
    setSelectedDoctorId,
    sendWhatsappBatch
  } = useClinic();

  const handlePrev = () => {
    const cur = parseDateISO(selectedDate);
    if (agendaView === 'diaria') {
      cur.setDate(cur.getDate() - 1);
    } else if (agendaView === 'semanal') {
      cur.setDate(cur.getDate() - 7);
    } else if (agendaView === 'quincenal') {
      cur.setDate(cur.getDate() - 15);
    } else if (agendaView === 'mensual') {
      cur.setMonth(cur.getMonth() - 1);
    }
    setSelectedDate(formatDateISO(cur));
  };

  const handleNext = () => {
    const cur = parseDateISO(selectedDate);
    if (agendaView === 'diaria') {
      cur.setDate(cur.getDate() + 1);
    } else if (agendaView === 'semanal') {
      cur.setDate(cur.getDate() + 7);
    } else if (agendaView === 'quincenal') {
      cur.setDate(cur.getDate() + 15);
    } else if (agendaView === 'mensual') {
      cur.setMonth(cur.getMonth() + 1);
    }
    setSelectedDate(formatDateISO(cur));
  };

  const handleToday = () => {
    setSelectedDate('2026-08-16');
  };

  const viewTabs = [
    { id: 'diaria', label: 'Diaria (15 min)' },
    { id: 'semanal', label: 'Semanal' },
    { id: 'quincenal', label: 'Quincenal' },
    { id: 'mensual', label: 'Mensual' }
  ];

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-3 shadow-2xs space-y-3">
      
      {/* Top row: Section title, Date Stepper & View Switcher */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        
        {/* Left: Date Navigator */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-50 border border-slate-200 rounded-lg p-0.5">
            <button
              onClick={handlePrev}
              className="p-1 hover:bg-white text-slate-600 rounded transition-colors"
              title="Anterior"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleToday}
              className="px-2.5 py-1 text-xs font-semibold text-slate-700 hover:text-slate-950 hover:bg-white rounded transition-colors"
            >
              Hoy
            </button>
            <button
              onClick={handleNext}
              className="p-1 hover:bg-white text-slate-600 rounded transition-colors"
              title="Siguiente"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-2.5 py-1 text-xs font-semibold text-slate-800 bg-slate-50 border border-slate-200 rounded-lg outline-hidden"
          />

          <span className="text-sm font-semibold text-slate-800 hidden sm:inline ml-1">
            {formatHumanDate(selectedDate)}
          </span>
        </div>

        {/* View Switcher Tabs (Classic segmented control) */}
        <div className="inline-flex bg-slate-100 p-0.5 rounded-lg border border-slate-200 self-start lg:self-auto">
          {viewTabs.map(tab => {
            const isActive = agendaView === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setAgendaView(tab.id)}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                  isActive
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

      </div>

      {/* Bottom row: Filter by Professional & WhatsApp trigger */}
      <div className="pt-2.5 border-t border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
        
        {/* Doctor selector */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-500 font-medium shrink-0">Profesional:</span>
          <select
            value={selectedDoctorId}
            onChange={(e) => setSelectedDoctorId(e.target.value)}
            className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-md font-semibold text-slate-800 outline-hidden w-full sm:w-auto"
          >
            <option value="all">Todos los profesionales ({doctors.length})</option>
            {doctors.map(d => (
              <option key={d.id} value={d.id}>
                {d.name} — {d.specialty}
              </option>
            ))}
          </select>
        </div>

        {/* Action: Send batch WhatsApp */}
        <button
          onClick={() => sendWhatsappBatch(selectedDate)}
          className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-md transition-colors"
        >
          <Send className="w-3.5 h-3.5 text-emerald-600" />
          <span>Enviar recordatorios WhatsApp del día</span>
        </button>

      </div>

    </div>
  );
}
