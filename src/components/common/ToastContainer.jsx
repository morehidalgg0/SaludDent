import React from 'react';
import { useClinic } from '../../context/ClinicContext.jsx';
import { CheckCircle2, AlertCircle, MessageSquare, X, ArrowRight } from 'lucide-react';

export function ToastContainer() {
  const { toasts, removeToast, openModal } = useClinic();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-md w-full pointer-events-none px-4 sm:px-0">
      {toasts.map(toast => {
        const isSuccess = toast.type === 'success' || toast.type === 'whatsapp';
        const isCancel = toast.type === 'cancel' || toast.type === 'error';
        
        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl shadow-floating border transition-all duration-300 transform translate-y-0 bg-white ${
              isSuccess ? 'border-emerald-300 ring-2 ring-emerald-100' :
              isCancel ? 'border-rose-300 ring-2 ring-rose-100' :
              'border-slate-200 ring-2 ring-slate-100'
            }`}
          >
            <div className={`p-2 rounded-lg shrink-0 ${
              isSuccess ? 'bg-emerald-100 text-emerald-600' :
              isCancel ? 'bg-rose-100 text-rose-600' :
              'bg-teal-100 text-teal-600'
            }`}>
              {toast.type === 'whatsapp' ? (
                <MessageSquare className="w-5 h-5" />
              ) : isSuccess ? (
                <CheckCircle2 className="w-5 h-5" />
              ) : isCancel ? (
                <AlertCircle className="w-5 h-5" />
              ) : (
                <CheckCircle2 className="w-5 h-5" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <h4 className="text-sm font-bold text-slate-900">{toast.title}</h4>
                <button
                  onClick={() => removeToast(toast.id)}
                  className="text-slate-400 hover:text-slate-600 p-0.5 rounded"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{toast.message}</p>
              
              {toast.appointment && (
                <button
                  onClick={() => {
                    openModal('appointmentDetail', { appointment: toast.appointment });
                    removeToast(toast.id);
                  }}
                  className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-brand-600 hover:text-brand-700 bg-brand-50 hover:bg-brand-100 px-2.5 py-1 rounded-md transition-colors"
                >
                  <span>Ver Turno</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
