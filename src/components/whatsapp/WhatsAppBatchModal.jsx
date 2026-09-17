import React, { useState, useMemo } from 'react';
import { useClinic } from '../../context/ClinicContext.jsx';
import { X, Send, CheckCircle2, SkipForward, PartyPopper } from 'lucide-react';
import { formatHumanDate } from '../../utils/dateUtils.js';

export function WhatsAppBatchModal() {
  const { modals, closeModal, appointments, sendWhatsappReminder, addToast } = useClinic();

  const isOpen = modals.whatsappBatch.isOpen;
  const date = modals.whatsappBatch.date;

  const queue = useMemo(() => {
    if (!date) return [];
    return appointments.filter(a => a.date === date && a.status !== 'cancelled');
  }, [appointments, date]);

  const [index, setIndex] = useState(0);
  const [isSending, setIsSending] = useState(false);
  const [sentCount, setSentCount] = useState(0);

  if (!isOpen) return null;

  const handleClose = () => {
    setIndex(0);
    setSentCount(0);
    closeModal('whatsappBatch');
  };

  const current = queue[index];
  const isDone = queue.length === 0 || index >= queue.length;

  const handleSendAndNext = async () => {
    if (!current) return;
    const waWindow = current.patientPhone ? window.open('', '_blank', 'noopener,noreferrer') : null;
    setIsSending(true);
    try {
      const result = await sendWhatsappReminder(current.id);
      if (waWindow) waWindow.location.href = result.waLink;
      setSentCount(c => c + 1);
    } catch (err) {
      if (waWindow) waWindow.close();
      addToast({ type: 'error', title: 'Error al Enviar', message: err.message || `No se pudo enviar a ${current.patientName}.` });
    } finally {
      setIsSending(false);
      setIndex(i => i + 1);
    }
  };

  const handleSkip = () => setIndex(i => i + 1);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-floating border border-slate-200 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">

        <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-white/10">
              <Send className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm">Envío Masivo de Recordatorios</h3>
              <p className="text-[11px] text-slate-300">{date && formatHumanDate(date)}</p>
            </div>
          </div>
          <button onClick={handleClose} className="p-1.5 hover:bg-white/10 rounded-lg">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {!isDone ? (
            <>
              <p className="text-xs text-slate-500 text-center">
                Turno {index + 1} de {queue.length} — cada mensaje se abre en WhatsApp para que lo confirmes manualmente.
              </p>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-1.5 text-sm">
                <p className="font-bold text-slate-900">{current.patientName}</p>
                <p className="text-xs text-slate-600">
                  {current.time} hs — {current.doctorName} ({current.specialty})
                </p>
                <p className="text-xs text-slate-600">
                  Tel: {current.patientPhone || <span className="text-rose-500">Sin teléfono cargado</span>}
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleSkip}
                  disabled={isSending}
                  className="flex-1 py-2.5 px-4 rounded-xl font-semibold text-xs text-slate-600 bg-slate-100 hover:bg-slate-200 flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                >
                  <SkipForward className="w-4 h-4" />
                  <span>Saltar</span>
                </button>
                <button
                  onClick={handleSendAndNext}
                  disabled={isSending || !current.patientPhone}
                  className="flex-[2] py-2.5 px-4 rounded-xl font-semibold text-xs text-white bg-emerald-600 hover:bg-emerald-500 flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSending ? 'Enviando...' : 'Enviar y Continuar'}</span>
                </button>
              </div>
            </>
          ) : (
            <div className="text-center py-4 space-y-3">
              <PartyPopper className="w-10 h-10 text-emerald-500 mx-auto" />
              <p className="font-bold text-slate-900">
                {queue.length === 0 ? 'No hay turnos para este día.' : `Listo: ${sentCount} de ${queue.length} recordatorios enviados.`}
              </p>
              <button
                onClick={handleClose}
                className="px-5 py-2 rounded-xl font-bold text-xs text-white bg-slate-900 hover:bg-slate-800"
              >
                Cerrar
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
