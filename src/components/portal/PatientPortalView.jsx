import React, { useState, useEffect } from 'react';
import { api } from '../../services/api.js';
import { 
  CheckCircle2, 
  XCircle, 
  Calendar, 
  Clock, 
  User, 
  Stethoscope, 
  MapPin, 
  Activity, 
  ShieldCheck, 
  Phone,
  Sparkles
} from 'lucide-react';
import { formatHumanDate } from '../../utils/dateUtils.js';

export function PatientPortalView({ token }) {
  const [appointment, setAppointment] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [status, setStatus] = useState(null); // 'confirmed' | 'cancelled'
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (token) {
      setIsLoading(true);
      api.getPortalAppointment(token)
        .then(data => {
          setAppointment(data);
          if (data.whatsappStatus === 'confirmed_by_patient' || data.status === 'confirmed') {
            setStatus('confirmed');
          } else if (data.whatsappStatus === 'cancelled_by_patient' || data.status === 'cancelled') {
            setStatus('cancelled');
          }
        })
        .catch(err => console.error(err))
        .finally(() => setIsLoading(false));
    }
  }, [token]);

  const handleAction = async (action) => {
    setIsProcessing(true);
    try {
      await api.respondWhatsapp({ token, action });
      setStatus(action === 'accept' ? 'confirmed' : 'cancelled');
    } catch (err) {
      alert('Error al actualizar el turno: ' + err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4 text-white">
        <div className="w-12 h-12 rounded-2xl bg-brand-500 flex items-center justify-center text-slate-950 font-black animate-pulse">
          SC
        </div>
        <p className="mt-4 text-xs font-bold text-slate-400">Cargando datos de su turno...</p>
      </div>
    );
  }

  if (!appointment) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-floating max-w-md w-full text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
            <XCircle className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-black text-slate-900">Enlace No Válido o Expirado</h2>
          <p className="text-xs text-slate-500">
            No se encontró el turno solicitado o ya fue procesado con anterioridad.
          </p>
          <a href="/" className="inline-block mt-2 text-xs font-bold text-brand-600">Volver a la clínica</a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-4 sm:p-6 font-sans">
      
      {/* Container Frame */}
      <div className="w-full max-w-md bg-slate-900 rounded-3xl border border-slate-800 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Clinic Header */}
        <div className="bg-gradient-to-r from-teal-900 to-emerald-950 p-6 text-center border-b border-teal-800/40 relative">
          <div className="w-14 h-14 rounded-2xl bg-brand-500 text-slate-950 flex items-center justify-center font-black text-2xl mx-auto shadow-lg shadow-brand-500/20 mb-3">
            SC
          </div>
          <h1 className="text-xl font-black text-white tracking-tight">Clínica SaludConnect</h1>
          <div className="flex items-center justify-center gap-1.5 text-xs text-brand-300 font-semibold mt-1">
            <ShieldCheck className="w-4 h-4 text-brand-400" />
            <span>Centro Médico Oficial • Portal del Paciente</span>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-6 space-y-5">
          
          <div className="text-center space-y-1">
            <span className="text-xs uppercase font-bold text-slate-400">Confirmación de Asistencia</span>
            <h2 className="text-lg font-black text-white">Hola, {appointment.patientName}</h2>
            <p className="text-xs text-slate-400">
              Por favor revise los detalles de su cita médica y elija una de las dos opciones para actualizar su estado en la clínica:
            </p>
          </div>

          {/* Appointment Summary Box */}
          <div className="bg-slate-800/80 rounded-2xl p-4 border border-slate-700/60 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-700/60">
              <span className="text-xs font-bold text-slate-400">N° de Fichero</span>
              <span className="px-2 py-0.5 rounded text-xs font-black bg-brand-500 text-slate-950">
                {appointment.ficheroNumber || 'S/F'}
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2.5 text-slate-200">
                <Calendar className="w-4 h-4 text-brand-400 shrink-0" />
                <span><strong>Fecha:</strong> {formatHumanDate(appointment.date)}</span>
              </div>

              <div className="flex items-center gap-2.5 text-slate-200">
                <Clock className="w-4 h-4 text-brand-400 shrink-0" />
                <span><strong>Horario:</strong> {appointment.time} hs ({appointment.durationMinutes} min)</span>
              </div>

              <div className="flex items-center gap-2.5 text-slate-200">
                <Stethoscope className="w-4 h-4 text-brand-400 shrink-0" />
                <span><strong>Profesional:</strong> {appointment.doctorName}</span>
              </div>

              <div className="flex items-center gap-2.5 text-slate-200">
                <Activity className="w-4 h-4 text-brand-400 shrink-0" />
                <span><strong>Especialidad:</strong> {appointment.specialty}</span>
              </div>

              <div className="flex items-center gap-2.5 text-slate-200">
                <MapPin className="w-4 h-4 text-brand-400 shrink-0" />
                <span><strong>Dirección:</strong> Av. Santa Fe 2450, Consultorio 1</span>
              </div>
            </div>
          </div>

          {/* INTERACTIVE ACTION BUTTONS */}
          {status === 'confirmed' ? (
            <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-500/50 text-center space-y-2 animate-in fade-in duration-200">
              <div className="w-10 h-10 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center mx-auto font-bold">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="font-black text-sm text-emerald-300">¡Turno Confirmado con Éxito!</h3>
              <p className="text-xs text-emerald-200/80 leading-relaxed">
                Su asistencia ha quedado registrada automáticamente en la agenda del profesional. Le esperamos el {appointment.date} a las {appointment.time} hs.
              </p>
              <button
                onClick={() => setStatus(null)}
                className="mt-2 text-[11px] text-slate-400 hover:text-white underline block mx-auto"
              >
                ¿Desea cambiar su respuesta?
              </button>
            </div>
          ) : status === 'cancelled' ? (
            <div className="p-4 rounded-2xl bg-rose-950/80 border border-rose-500/50 text-center space-y-2 animate-in fade-in duration-200">
              <div className="w-10 h-10 rounded-full bg-rose-500 text-white flex items-center justify-center mx-auto font-bold">
                <XCircle className="w-6 h-6" />
              </div>
              <h3 className="font-black text-sm text-rose-300">Turno Cancelado</h3>
              <p className="text-xs text-rose-200/80 leading-relaxed">
                El turno ha sido cancelado en el sistema de la clínica y el cupo fue liberado. Gracias por notificarnos.
              </p>
              <button
                onClick={() => setStatus(null)}
                className="mt-2 text-[11px] text-slate-400 hover:text-white underline block mx-auto"
              >
                ¿Desea volver a confirmar?
              </button>
            </div>
          ) : (
            <div className="space-y-3 pt-2">
              <button
                onClick={() => handleAction('accept')}
                disabled={isProcessing}
                className="w-full py-3.5 px-4 rounded-2xl font-black text-sm text-slate-950 bg-emerald-400 hover:bg-emerald-300 shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all active:scale-98"
              >
                <CheckCircle2 className="w-5 h-5" />
                <span>{isProcessing ? 'Procesando...' : '✅ Aceptar y Confirmar Turno'}</span>
              </button>

              <button
                onClick={() => handleAction('cancel')}
                disabled={isProcessing}
                className="w-full py-3 px-4 rounded-2xl font-bold text-xs text-rose-400 hover:text-rose-300 bg-rose-950/40 hover:bg-rose-950/80 border border-rose-800/60 flex items-center justify-center gap-2 transition-all"
              >
                <XCircle className="w-4 h-4" />
                <span>❌ Cancelar Turno</span>
              </button>
            </div>
          )}

          <div className="text-center pt-2 text-[11px] text-slate-500">
            Cualquier duda puede comunicarse al teléfono de la clínica (011) 4455-8899.
          </div>

        </div>

      </div>

    </div>
  );
}
