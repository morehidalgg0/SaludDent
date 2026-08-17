import React, { useState } from 'react';
import { useClinic } from '../../context/ClinicContext.jsx';
import { 
  X, 
  CheckCircle2, 
  XCircle, 
  Send, 
  Smartphone, 
  ShieldCheck, 
  ExternalLink, 
  Clock, 
  Phone, 
  Sparkles,
  RefreshCw
} from 'lucide-react';
import { formatHumanDate } from '../../utils/dateUtils.js';

export function WhatsAppSimulatorModal() {
  const { 
    modals, 
    closeModal, 
    appointments, 
    simulatePatientAction,
    sendWhatsappReminder
  } = useClinic();

  const isOpen = modals.whatsappSimulator.isOpen;
  const initialAppointment = modals.whatsappSimulator.appointment;

  // Selected appointment inside simulator
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(
    initialAppointment ? initialAppointment.id : (appointments[0]?.id || '')
  );

  const [simulatedResponses, setSimulatedResponses] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const currentAppointment = appointments.find(a => a.id === selectedAppointmentId) || initialAppointment || appointments[0];

  if (!currentAppointment) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
        <div className="bg-white rounded-2xl p-6 max-w-sm text-center">
          <p className="text-sm text-slate-600 mb-4">No hay turnos disponibles para simular.</p>
          <button onClick={() => closeModal('whatsappSimulator')} className="px-4 py-2 bg-slate-200 rounded-lg text-xs font-bold">Cerrar</button>
        </div>
      </div>
    );
  }

  const patientResponse = simulatedResponses[currentAppointment.id] || 
    (currentAppointment.whatsappStatus === 'confirmed_by_patient' ? 'confirmed' : 
     currentAppointment.whatsappStatus === 'cancelled_by_patient' ? 'cancelled' : null);

  const handlePatientAction = async (action) => {
    setIsProcessing(true);
    try {
      await simulatePatientAction(currentAppointment.token || currentAppointment.id, action);
      setSimulatedResponses(prev => ({
        ...prev,
        [currentAppointment.id]: action === 'accept' ? 'confirmed' : 'cancelled'
      }));
    } catch (err) {
      console.error('Error simulando respuesta:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const cleanPhone = (currentAppointment.patientPhone || '').replace(/\D/g, '');
  const realWaLink = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
    `Hola ${currentAppointment.patientName}, recordatorio de turno el ${currentAppointment.date} a las ${currentAppointment.time} hs con ${currentAppointment.doctorName}.`
  )}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
      <div className="bg-white rounded-3xl shadow-floating border border-slate-200 w-full max-w-4xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 grid grid-cols-1 md:grid-cols-[1fr_380px] max-h-[90vh]">
        
        {/* Left Side: Controls, Explanations and Turn Selector */}
        <div className="p-6 flex flex-col justify-between border-b md:border-b-0 md:border-r border-slate-200 bg-slate-50/50 overflow-y-auto">
          <div className="space-y-4">
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-emerald-100 text-emerald-700">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-slate-900">Simulador Interactivo de WhatsApp</h3>
                  <p className="text-xs text-slate-500">Notificaciones con botones de confirmación automática</p>
                </div>
              </div>
            </div>

            {/* Turn Selector */}
            <div className="space-y-1.5 bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Seleccionar Turno a Simular
              </label>
              <select
                value={currentAppointment.id}
                onChange={(e) => setSelectedAppointmentId(e.target.value)}
                className="w-full px-3 py-2 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg outline-hidden focus:ring-2 focus:ring-emerald-500/20"
              >
                {appointments.map(apt => (
                  <option key={apt.id} value={apt.id}>
                    {apt.date} {apt.time} hs — {apt.patientName} ({apt.specialty})
                  </option>
                ))}
              </select>
            </div>

            {/* How it works banner */}
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 space-y-2 text-xs text-emerald-950">
              <div className="font-extrabold flex items-center gap-1.5 text-emerald-900">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>¿Cómo funciona el impacto automático?</span>
              </div>
              <p className="text-emerald-800 leading-relaxed">
                Cuando el paciente presiona <strong>[Aceptar Turno]</strong> o <strong>[Cancelar Turno]</strong> en su teléfono, la base de datos se actualiza y <strong>la agenda del administrador impacta de inmediato en vivo</strong> sin necesidad de refrescar la pantalla.
              </p>
            </div>

            {/* Patient Data Card */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2 text-xs">
              <div className="flex items-center justify-between font-bold text-slate-900">
                <span>Datos del Paciente</span>
                <span className="px-2 py-0.5 rounded bg-brand-50 text-brand-700 border border-brand-200">
                  {currentAppointment.ficheroNumber}
                </span>
              </div>
              <div className="text-slate-600 space-y-1">
                <p><strong>Nombre:</strong> {currentAppointment.patientName}</p>
                <p><strong>Teléfono:</strong> {currentAppointment.patientPhone || 'Sin teléfono'}</p>
                <p><strong>Profesional:</strong> {currentAppointment.doctorName} ({currentAppointment.specialty})</p>
                <p><strong>Horario:</strong> {currentAppointment.date} a las {currentAppointment.time} hs</p>
              </div>
            </div>

            {/* Open Direct wa.me Link Button */}
            <a
              href={realWaLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 text-xs font-bold text-emerald-700 bg-white hover:bg-emerald-50 border border-emerald-300 rounded-xl transition-all shadow-2xs"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Abrir en WhatsApp Web Real (wa.me)</span>
            </a>

          </div>

          <div className="pt-4 border-t border-slate-200 flex justify-end">
            <button
              onClick={() => closeModal('whatsappSimulator')}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-200 rounded-xl transition-colors"
            >
              Cerrar Simulador
            </button>
          </div>
        </div>

        {/* Right Side: Realistic Phone Simulation Frame */}
        <div className="bg-slate-900 p-4 flex items-center justify-center">
          
          {/* Mobile Screen Shell */}
          <div className="w-full max-w-[320px] bg-[#0b141a] rounded-[2.5rem] border-[6px] border-slate-800 shadow-2xl overflow-hidden flex flex-col h-[560px]">
            
            {/* Phone Top Speaker & Camera Notch */}
            <div className="bg-slate-800 h-5 flex items-center justify-center">
              <div className="w-12 h-2.5 bg-slate-900 rounded-full"></div>
            </div>

            {/* WhatsApp Chat Header */}
            <div className="bg-[#202c33] px-3 py-2.5 flex items-center justify-between text-white border-b border-slate-800">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-xs font-extrabold shrink-0">
                  SC
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-bold truncate">SaludConnect</span>
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  </div>
                  <span className="text-[10px] text-emerald-400 block truncate">Cuenta oficial de empresa</span>
                </div>
              </div>
              <button
                onClick={() => closeModal('whatsappSimulator')}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Chat Body (Message bubbles) */}
            <div className="flex-1 bg-[#0b141a] p-3 overflow-y-auto space-y-3 text-white text-xs">
              
              {/* Security Pill */}
              <div className="text-center">
                <span className="inline-block bg-[#182229] text-[#ffd279] text-[9px] px-2 py-1 rounded-md max-w-[90%]">
                  🔒 Los mensajes están cifrados de extremo a extremo.
                </span>
              </div>

              {/* Clinic Reminder Bubble */}
              <div className="bg-[#202c33] rounded-2xl rounded-tl-xs p-3 text-slate-200 space-y-2 border border-slate-700/50 shadow-md">
                <div className="font-bold text-emerald-400 text-[11px] flex items-center gap-1">
                  <span>🏥 RECORDATORIO DE TURNO</span>
                </div>
                
                <p className="text-[11px] text-slate-100 leading-snug">
                  Hola <strong className="text-white">{currentAppointment.patientName}</strong>, le recordamos su turno médico:
                </p>

                <div className="bg-[#111b21] p-2.5 rounded-xl space-y-1 text-[10px] text-slate-300 border border-slate-800">
                  <p>📅 <strong>Fecha:</strong> {currentAppointment.date}</p>
                  <p>⏰ <strong>Hora:</strong> {currentAppointment.time} hs</p>
                  <p>🩺 <strong>Profesional:</strong> {currentAppointment.doctorName}</p>
                  <p>🏢 <strong>Especialidad:</strong> {currentAppointment.specialty}</p>
                  <p>📋 <strong>Fichero N°:</strong> {currentAppointment.ficheroNumber}</p>
                </div>

                <p className="text-[10px] text-slate-400">
                  Por favor, elija una opción para actualizar su estado en la clínica:
                </p>

                {/* INTERACTIVE ACTION BUTTONS */}
                <div className="space-y-1.5 pt-1">
                  <button
                    onClick={() => handlePatientAction('accept')}
                    disabled={isProcessing}
                    className={`w-full py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                      patientResponse === 'confirmed'
                        ? 'bg-emerald-500 text-white ring-2 ring-emerald-300'
                        : 'bg-emerald-600/30 hover:bg-emerald-600 text-emerald-300 hover:text-white border border-emerald-500/40'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>✅ Aceptar Turno</span>
                  </button>

                  <button
                    onClick={() => handlePatientAction('cancel')}
                    disabled={isProcessing}
                    className={`w-full py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                      patientResponse === 'cancelled'
                        ? 'bg-rose-500 text-white ring-2 ring-rose-300'
                        : 'bg-rose-600/30 hover:bg-rose-600 text-rose-300 hover:text-white border border-rose-500/40'
                    }`}
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>❌ Cancelar Turno</span>
                  </button>
                </div>

                <div className="text-right text-[9px] text-slate-500">08:00 ✓✓</div>
              </div>

              {/* Patient Response Bubble Simulation */}
              {patientResponse === 'confirmed' && (
                <div className="flex justify-end animate-in fade-in slide-in-from-bottom-2 duration-200">
                  <div className="bg-[#005c4b] rounded-2xl rounded-tr-xs p-2.5 text-white max-w-[85%] space-y-1 shadow-md">
                    <p className="text-[11px] font-semibold">
                      ✅ He confirmado mi asistencia al turno.
                    </p>
                    <div className="text-right text-[9px] text-emerald-200">Justo ahora ✓✓</div>
                  </div>
                </div>
              )}

              {patientResponse === 'cancelled' && (
                <div className="flex justify-end animate-in fade-in slide-in-from-bottom-2 duration-200">
                  <div className="bg-rose-900/90 rounded-2xl rounded-tr-xs p-2.5 text-white max-w-[85%] space-y-1 shadow-md">
                    <p className="text-[11px] font-semibold">
                      ❌ Deseo cancelar mi turno.
                    </p>
                    <div className="text-right text-[9px] text-rose-200">Justo ahora ✓✓</div>
                  </div>
                </div>
              )}

              {/* Clinic Instant Auto-Ack Bubble */}
              {patientResponse && (
                <div className="flex justify-start animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="bg-[#202c33] rounded-2xl rounded-tl-xs p-2.5 text-slate-200 max-w-[85%] space-y-1 shadow-md border border-slate-700">
                    <p className="text-[10px]">
                      {patientResponse === 'confirmed'
                        ? '🎉 ¡Perfecto! Su turno quedó confirmado en la agenda de la clínica.'
                        : '⚠️ Su turno ha sido cancelado en el sistema. Gracias por avisar.'}
                    </p>
                    <div className="text-right text-[9px] text-slate-500">Justo ahora ✓✓</div>
                  </div>
                </div>
              )}

            </div>

            {/* Bottom Input Simulation */}
            <div className="bg-[#202c33] p-2 flex items-center gap-2 border-t border-slate-800">
              <div className="flex-1 bg-[#2a3942] rounded-full px-3 py-1.5 text-[10px] text-slate-400">
                Escribe un mensaje...
              </div>
              <div className="w-7 h-7 rounded-full bg-emerald-600 flex items-center justify-center text-white">
                <Send className="w-3.5 h-3.5" />
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
