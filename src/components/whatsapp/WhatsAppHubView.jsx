import React, { useState } from 'react';
import { useClinic } from '../../context/ClinicContext.jsx';
import { AppointmentStatusBadge, WhatsappStatusBadge } from '../common/Badge.jsx';
import { 
  MessageSquare, 
  Send, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Smartphone, 
  ExternalLink, 
  Filter, 
  Calendar,
  Sparkles
} from 'lucide-react';
import { formatHumanDate } from '../../utils/dateUtils.js';

export function WhatsAppHubView() {
  const { 
    selectedDate, 
    setSelectedDate, 
    appointments, 
    sendWhatsappBatch, 
    sendWhatsappReminder,
    openModal 
  } = useClinic();

  const [statusFilter, setStatusFilter] = useState('all');

  const dayAppointments = appointments.filter(a => a.date === selectedDate);
  const filteredAppointments = statusFilter === 'all' 
    ? dayAppointments 
    : dayAppointments.filter(a => a.whatsappStatus === statusFilter);

  const sentCount = dayAppointments.filter(a => a.whatsappStatus !== 'not_sent').length;
  const confirmedCount = dayAppointments.filter(a => a.whatsappStatus === 'confirmed_by_patient').length;
  const cancelledCount = dayAppointments.filter(a => a.whatsappStatus === 'cancelled_by_patient').length;

  return (
    <div className="space-y-4">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 rounded-2xl p-6 text-white shadow-card border border-emerald-800/40">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400">
              <MessageSquare className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black">Centro de WhatsApp & Recordatorios</h2>
                <span className="text-[10px] font-bold uppercase bg-emerald-500/30 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-400/30">
                  Bot de Confirmación Activo
                </span>
              </div>
              <p className="text-xs text-emerald-200/80 mt-0.5">
                Envío de recordatorios con botones interactivos [Aceptar / Cancelar] y sincronización automática.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <button
              onClick={() => sendWhatsappBatch(selectedDate)}
              className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs rounded-xl shadow-md transition-all"
            >
              <Send className="w-4 h-4" />
              <span>Enviar Masivo a Todos ({dayAppointments.length})</span>
            </button>

            <button
              onClick={() => openModal('whatsappSimulator', { appointment: dayAppointments[0] || null })}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl border border-white/20 transition-colors"
            >
              <Smartphone className="w-4 h-4" />
              <span>Simulador</span>
            </button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-4 border-t border-emerald-800/60">
          <div className="bg-emerald-950/60 rounded-xl p-3 border border-emerald-800/40">
            <span className="text-[10px] font-semibold text-emerald-300/70 uppercase">Turnos del Día</span>
            <p className="text-xl font-black text-white">{dayAppointments.length}</p>
          </div>
          <div className="bg-emerald-950/60 rounded-xl p-3 border border-emerald-800/40">
            <span className="text-[10px] font-semibold text-emerald-300/70 uppercase">Recordatorios Enviados</span>
            <p className="text-xl font-black text-emerald-400">{sentCount}</p>
          </div>
          <div className="bg-emerald-950/60 rounded-xl p-3 border border-emerald-800/40">
            <span className="text-[10px] font-semibold text-emerald-300/70 uppercase">Aceptados / Confirmados</span>
            <p className="text-xl font-black text-emerald-300">{confirmedCount}</p>
          </div>
          <div className="bg-emerald-950/60 rounded-xl p-3 border border-emerald-800/40">
            <span className="text-[10px] font-semibold text-emerald-300/70 uppercase">Cancelados por Paciente</span>
            <p className="text-xl font-black text-rose-400">{cancelledCount}</p>
          </div>
        </div>
      </div>

      {/* Filter and Date Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-subtle flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-slate-400" />
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3 py-1.5 text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl outline-hidden focus:ring-2 focus:ring-emerald-500/20"
          />
          <span className="text-xs font-semibold text-slate-600 hidden md:inline">
            {formatHumanDate(selectedDate)}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl outline-hidden"
          >
            <option value="all">Todos los estados de WhatsApp</option>
            <option value="not_sent">Sin enviar</option>
            <option value="sent">Recordatorio Enviado</option>
            <option value="confirmed_by_patient">Confirmado por Paciente</option>
            <option value="cancelled_by_patient">Cancelado por Paciente</option>
          </select>
        </div>
      </div>

      {/* Appointments List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-subtle overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-extrabold text-sm text-slate-900">
            Pacientes Citados para {selectedDate} ({filteredAppointments.length})
          </h3>
        </div>

        <div className="divide-y divide-slate-100">
          {filteredAppointments.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs">
              No hay turnos para los filtros seleccionados.
            </div>
          ) : (
            filteredAppointments.map(apt => {
              const cleanPhone = (apt.patientPhone || '').replace(/\D/g, '');
              const directWa = `https://wa.me/${cleanPhone}`;

              return (
                <div key={apt.id} className="p-4 hover:bg-slate-50/80 transition-colors flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 font-extrabold text-xs text-slate-700 flex items-center justify-center shrink-0 border border-slate-200">
                      {apt.time}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-sm text-slate-900 truncate">{apt.patientName}</h4>
                        <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-brand-50 text-brand-700 border border-brand-200">
                          {apt.ficheroNumber}
                        </span>
                        {apt.isOverturn && (
                          <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-amber-500 text-white">
                            SOBRETURNO
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {apt.doctorName} • {apt.specialty} • Tel: {apt.patientPhone || 'Sin número'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end md:self-center">
                    <WhatsappStatusBadge status={apt.whatsappStatus} />

                    {/* Action buttons */}
                    <button
                      onClick={() => openModal('whatsappSimulator', { appointment: apt })}
                      className="px-3 py-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl flex items-center gap-1.5 transition-colors"
                    >
                      <Smartphone className="w-3.5 h-3.5" />
                      <span>Simular Interacción</span>
                    </button>

                    <a
                      href={directWa}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-slate-500 hover:text-emerald-600 bg-slate-100 hover:bg-emerald-50 rounded-xl transition-colors"
                      title="Abrir chat en WhatsApp Web"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

    </div>
  );
}
