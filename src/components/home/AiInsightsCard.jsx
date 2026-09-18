import React, { useState } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';
import { api } from '../../services/api.js';

export function AiInsightsCard() {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const generate = async () => {
    setLoading(true);
    setError('');
    try {
      setText(await api.aiInsights());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-3">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-indigo-600" />
          </div>
          <div>
            <h2 className="text-sm font-extrabold text-slate-900">Resumen inteligente de la clínica</h2>
            <p className="text-[11px] text-slate-500">Analiza tus próximos 14 días de turnos y los últimos 30 días. Usa solo cifras agregadas, sin datos de pacientes.</p>
          </div>
        </div>
        <button
          onClick={generate}
          disabled={loading}
          className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg disabled:opacity-50"
        >
          {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5 text-emerald-400" />}
          <span>{loading ? 'Analizando...' : text ? 'Actualizar' : 'Generar'}</span>
        </button>
      </div>
      {error && <p className="text-xs text-rose-700 bg-rose-50 border border-rose-200 rounded-lg px-3 py-2">{error}</p>}
      {text && <div className="text-xs text-slate-700 whitespace-pre-wrap leading-relaxed">{text}</div>}
    </div>
  );
}
