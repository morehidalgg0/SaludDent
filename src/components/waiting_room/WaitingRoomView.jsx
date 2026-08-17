import React from 'react';
import { useClinic } from '../../context/ClinicContext.jsx';
import { AppointmentStatusBadge, OverturnBadge } from '../common/Badge.jsx';
import { 
  Users, 
  UserCheck, 
  Clock, 
  Bell, 
  CheckCircle2, 
  Stethoscope, 
  Calendar, 
  ArrowRight,
  Flame,
  MessageSquare
} from 'lucide-react';
import { formatHumanDate } from '../../utils/dateUtils.js';

export function WaitingRoomView() {
  const { 
    selectedDate, 
    setSelectedDate, 
    appointments, 
    quickChangeStatus, 
    openModal, 
    setCurrentSection,
    patients 
  } = useClinic();

  const todayAppointments = appointments.filter(a => a.date === selectedDate);

  const waitingList = todayAppointments.filter(a => a.status === 'waiting');
  const upcomingList = todayAppointments.filter(a => a.status === 'pending' || a.status === 'confirmed');
  const attendedList = todayAppointments.filter(a => a.status === 'attended');

  return (
    <div className="space-y-4">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-slate-900 rounded-2xl p-6 text-white shadow-card border border-blue-900/40">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-400">
              <Users className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black">Recepción & Sala de Espera en Vivo</h2>
                <span className="text-[10px] font-bold uppercase bg-blue-500/30 text-blue-300 px-2 py-0.5 rounded-full border border-blue-400/30">
                  {waitingList.length} Pacientes en Espera
                </span>
              </div>
              <p className="text-xs text-blue-200/80 mt-0.5">
                Flujo de pacientes en consultorio: Check-in de recepción, llamado al profesional y pase a consulta.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-3 py-1.5 text-xs font-bold bg-slate-800 border border-slate-700 text-white rounded-xl outline-hidden"
            />
          </div>
        </div>
      </div>

      {/* 3 Columns Kanban Flow */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        
        {/* Column 1: Por Llegar / Citados */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-subtle flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-500" />
                <h3 className="font-extrabold text-sm text-slate-900">Por Llegar / Citados ({upcomingList.length})</h3>
              </div>
            </div>

            <div className="space-y-2.5 max-h-[600px] overflow-y-auto">
              {upcomingList.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-6">No hay pacientes pendientes de llegada.</p>
              ) : (
                upcomingList.map(apt => (
                  <div key={apt.id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-black text-xs text-slate-900">{apt.time} hs</span>
                          <span className="font-bold text-xs text-slate-800">{apt.patientName}</span>
                        </div>
                        <span className="text-[11px] text-slate-500 block">{apt.doctorName} • {apt.specialty}</span>
                      </div>
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-extrabold bg-brand-50 text-brand-700 border border-brand-200">
                        {apt.ficheroNumber}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-slate-200/60">
                      <AppointmentStatusBadge status={apt.status} size="xs" />
                      <button
                        onClick={() => quickChangeStatus(apt.id, 'waiting')}
                        className="px-2.5 py-1 text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg flex items-center gap-1 transition-colors"
                      >
                        <UserCheck className="w-3.5 h-3.5" />
                        <span>Marcar Llegada</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Column 2: EN SALA DE ESPERA (Active Queue) */}
        <div className="bg-blue-50/40 rounded-2xl border-2 border-blue-300 p-4 shadow-card flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-blue-200">
              <div className="flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-blue-600" />
                <h3 className="font-black text-sm text-blue-950">EN SALA DE ESPERA ({waitingList.length})</h3>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-600 text-white animate-pulse">
                PRESENTE
              </span>
            </div>

            <div className="space-y-2.5 max-h-[600px] overflow-y-auto">
              {waitingList.length === 0 ? (
                <div className="text-center py-12 text-slate-400 text-xs">
                  <Users className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                  <span>No hay pacientes aguardando en la sala.</span>
                </div>
              ) : (
                waitingList.map(apt => {
                  const patient = patients.find(p => p.id === apt.patientId);

                  return (
                    <div key={apt.id} className="p-3.5 bg-white border border-blue-200 rounded-xl shadow-xs space-y-2.5">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-black text-xs text-blue-700 bg-blue-50 px-2 py-0.5 rounded">{apt.time} hs</span>
                            <h4 className="font-extrabold text-sm text-slate-900">{apt.patientName}</h4>
                          </div>
                          <p className="text-xs text-slate-600 font-semibold mt-0.5">{apt.doctorName}</p>
                          <span className="text-[11px] text-slate-500">{apt.specialty}</span>
                        </div>
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-black bg-brand-50 text-brand-700 border border-brand-200">
                          {apt.ficheroNumber}
                        </span>
                      </div>

                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                        <button
                          onClick={() => {
                            setCurrentSection('historias');
                            openModal('medicalRecordEditor', { patient, doctor: { name: apt.doctorName, specialty: apt.specialty } });
                          }}
                          className="flex-1 py-1.5 px-2.5 text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg flex items-center justify-center gap-1 transition-colors"
                        >
                          <Stethoscope className="w-3.5 h-3.5" />
                          <span>Pasar a Consulta (EHR)</span>
                        </button>

                        <button
                          onClick={() => quickChangeStatus(apt.id, 'attended')}
                          className="py-1.5 px-2.5 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg flex items-center gap-1 transition-colors"
                          title="Marcar como Atendido"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Atendido</span>
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Column 3: Atendidos / Finalizados */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-subtle flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-purple-600" />
                <h3 className="font-extrabold text-sm text-slate-900">Atendidos / Finalizados ({attendedList.length})</h3>
              </div>
            </div>

            <div className="space-y-2 max-h-[600px] overflow-y-auto">
              {attendedList.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-6">Aún no hay pacientes atendidos hoy.</p>
              ) : (
                attendedList.map(apt => (
                  <div key={apt.id} className="p-3 bg-purple-50/40 border border-purple-200 rounded-xl flex items-center justify-between">
                    <div>
                      <span className="font-bold text-xs text-slate-900">{apt.time} hs — {apt.patientName}</span>
                      <p className="text-[11px] text-slate-500">{apt.doctorName} • {apt.specialty}</p>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">
                      Finalizado
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
