import React from 'react';
import { useClinic } from '../../context/ClinicContext.jsx';
import { generateTimeSlots } from '../../utils/dateUtils.js';
import { AppointmentCard } from './AppointmentCard.jsx';
import { Plus, Clock } from 'lucide-react';

export function DailyView() {
  const { 
    selectedDate, 
    appointments, 
    doctors, 
    selectedDoctorId, 
    openModal 
  } = useClinic();

  const timeSlots = generateTimeSlots(8, 20); // 08:00 to 20:00 every 15 min

  const filteredDoctors = selectedDoctorId === 'all' 
    ? doctors 
    : doctors.filter(d => d.id === selectedDoctorId);

  // Group appointments of the day by doctor
  const appointmentsByDoctor = {};
  filteredDoctors.forEach(doc => {
    appointmentsByDoctor[doc.id] = appointments.filter(
      a => a.date === selectedDate && a.doctorId === doc.id
    );
  });

  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-2xs overflow-hidden">
      <div className="overflow-x-auto">
        <div className="min-w-[750px]">
          
          {/* Header Row: Doctors Columns */}
          <div className="grid grid-cols-[80px_repeat(auto-fit,minmax(220px,1fr))] bg-slate-50 border-b border-slate-200 sticky top-0 z-10">
            <div className="p-2.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-center border-r border-slate-200 flex items-center justify-center">
              <Clock className="w-3.5 h-3.5 mr-1 text-slate-400" />
              Hora
            </div>
            {filteredDoctors.map(doc => {
              const docAppts = appointmentsByDoctor[doc.id] || [];
              const overturnsCount = docAppts.filter(a => a.isOverturn).length;
              return (
                <div key={doc.id} className="p-2.5 border-r border-slate-200 last:border-r-0">
                  <div className="flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <h3 className="font-bold text-xs text-slate-900 truncate">{doc.name}</h3>
                      <p className="text-[11px] text-slate-500 truncate">{doc.specialty}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-[11px] font-semibold text-slate-600">
                        {docAppts.length} turnos
                      </span>
                      {overturnsCount > 0 && (
                        <span className="block text-[10px] font-bold text-amber-700">
                          +{overturnsCount} sobreturno(s)
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Time Slots Grid (Every 15 min) */}
          <div className="divide-y divide-slate-100">
            {timeSlots.map((slot) => {
              const isHour = slot.endsWith(':00');
              const isHalfHour = slot.endsWith(':30');

              return (
                <div 
                  key={slot} 
                  className={`grid grid-cols-[80px_repeat(auto-fit,minmax(220px,1fr))] transition-colors ${
                    isHour ? 'bg-slate-50/70 border-t border-slate-200' : isHalfHour ? 'bg-slate-50/20' : ''
                  }`}
                >
                  {/* Time Label (15-min interval) */}
                  <div className={`p-2 text-center text-xs border-r border-slate-200 flex items-center justify-center ${
                    isHour ? 'text-slate-900 font-bold bg-slate-100/60' : 'text-slate-400 font-normal'
                  }`}>
                    {slot}
                  </div>

                  {/* Doctor Columns for this 15-min slot */}
                  {filteredDoctors.map(doc => {
                    const slotAppts = (appointmentsByDoctor[doc.id] || []).filter(a => a.time === slot);

                    return (
                      <div 
                        key={doc.id}
                        className="p-1 border-r border-slate-100 last:border-r-0 min-h-[46px] relative group flex flex-col gap-1.5"
                      >
                        {slotAppts.length > 0 ? (
                          slotAppts.map(apt => (
                            <AppointmentCard key={apt.id} appointment={apt} compact={slotAppts.length > 1} />
                          ))
                        ) : (
                          /* Empty slot - Clickable to schedule */
                          <button
                            onClick={() => openModal('newAppointment', {
                              prefill: {
                                date: selectedDate,
                                time: slot,
                                doctorId: doc.id
                              }
                            })}
                            className="w-full h-full min-h-[32px] rounded border border-transparent hover:border-slate-300 hover:bg-slate-50 text-slate-300 hover:text-slate-700 flex items-center justify-center gap-1 text-[11px] font-medium opacity-0 group-hover:opacity-100 transition-all"
                          >
                            <Plus className="w-3 h-3" />
                            <span>Agendar {slot}</span>
                          </button>
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
