import React from 'react';
import { Plus, Trash2, CheckCircle2, Clock, CircleDashed } from 'lucide-react';
import { DENTAL_PROCEDURES, TREATMENT_STATUS } from './constants.js';

let treatmentSeq = 0;
const nextId = () => `t-${Date.now()}-${treatmentSeq++}`;

export function TreatmentPlanTable({ data = {}, onChange }) {
  const treatments = data.treatments || [];

  const update = (next) => onChange({ ...data, treatments: next });

  const addTreatment = () => {
    update([
      ...treatments,
      {
        id: nextId(),
        tooth: '',
        procedureId: '',
        procedureLabel: '',
        price: 0,
        status: 'planned',
        date: new Date().toISOString().split('T')[0],
        notes: ''
      }
    ]);
  };

  const updateTreatment = (id, patch) => {
    update(treatments.map(t => (t.id === id ? { ...t, ...patch } : t)));
  };

  const removeTreatment = (id) => {
    update(treatments.filter(t => t.id !== id));
  };

  const handleProcedureChange = (id, procedureId) => {
    const proc = DENTAL_PROCEDURES.find(p => p.id === procedureId);
    updateTreatment(id, {
      procedureId,
      procedureLabel: proc?.label || '',
      price: proc?.price ?? 0
    });
  };

  const counts = TREATMENT_STATUS.map(s => ({
    ...s,
    count: treatments.filter(t => (t.status || 'planned') === s.id).length
  }));

  const total = treatments.reduce((sum, t) => sum + (Number(t.price) || 0), 0);
  const planned = treatments.filter(t => (t.status || 'planned') === 'planned').reduce((s, t) => s + (Number(t.price) || 0), 0);
  const done = treatments.filter(t => t.status === 'done').reduce((s, t) => s + (Number(t.price) || 0), 0);

  const fmt = (n) => new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(n || 0);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs text-slate-500">
          Planifique los tratamientos por pieza y siga su estado (planificado, en proceso, realizado).
        </p>
        <button
          type="button"
          onClick={addTreatment}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg bg-slate-900 hover:bg-slate-800 text-white transition-colors"
        >
          <Plus className="w-3.5 h-3.5 text-emerald-400" />
          <span>Agregar tratamiento</span>
        </button>
      </div>

      {/* Counters */}
      <div className="grid grid-cols-3 gap-2">
        {counts.map(s => (
          <div key={s.id} className="rounded-xl border p-2.5" style={{ backgroundColor: s.bg, borderColor: s.border }}>
            <span className="text-[10px] font-black uppercase tracking-wider" style={{ color: s.color }}>{s.label}</span>
            <p className="text-lg font-extrabold text-slate-900">{s.count}</p>
          </div>
        ))}
      </div>

      {treatments.length === 0 ? (
        <div className="bg-white rounded-xl border border-dashed border-slate-300 p-8 text-center text-slate-400 text-xs">
          Sin tratamientos en el plan. Agregue el primero para comenzar.
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left min-w-[760px]">
              <thead>
                <tr className="bg-slate-50 text-slate-500 uppercase text-[10px] font-black">
                  <th className="p-2.5 w-16">Pieza</th>
                  <th className="p-2.5">Procedimiento</th>
                  <th className="p-2.5 w-28">Precio (ARS)</th>
                  <th className="p-2.5 w-36">Estado</th>
                  <th className="p-2.5 w-36">Fecha</th>
                  <th className="p-2.5">Notas</th>
                  <th className="p-2.5 w-10"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {treatments.map(t => {
                  const status = (t.status || 'planned');
                  return (
                    <tr key={t.id} className="hover:bg-slate-50/60">
                      <td className="p-2">
                        <input
                          type="text"
                          placeholder="N°"
                          value={t.tooth}
                          onChange={(e) => updateTreatment(t.id, { tooth: e.target.value })}
                          className="w-14 px-2 py-1 text-center bg-slate-50 border border-slate-200 rounded-md font-bold outline-none"
                        />
                      </td>
                      <td className="p-2">
                        <select
                          value={t.procedureId}
                          onChange={(e) => handleProcedureChange(t.id, e.target.value)}
                          className="w-full px-2 py-1 bg-slate-50 border border-slate-200 rounded-md font-semibold outline-none"
                        >
                          <option value="">— Seleccionar procedimiento —</option>
                          {DENTAL_PROCEDURES.map(p => (
                            <option key={p.id} value={p.id}>{p.label}</option>
                          ))}
                        </select>
                      </td>
                      <td className="p-2">
                        <input
                          type="number"
                          min="0"
                          value={t.price ?? 0}
                          onChange={(e) => updateTreatment(t.id, { price: Number(e.target.value) })}
                          className="w-24 px-2 py-1 bg-slate-50 border border-slate-200 rounded-md font-bold outline-none"
                        />
                      </td>
                      <td className="p-2">
                        <select
                          value={status}
                          onChange={(e) => updateTreatment(t.id, { status: e.target.value })}
                          className="w-full px-2 py-1 rounded-md font-bold outline-none border"
                          style={{ color: TREATMENT_STATUS.find(s => s.id === status)?.color }}
                        >
                          {TREATMENT_STATUS.map(s => (
                            <option key={s.id} value={s.id}>{s.label}</option>
                          ))}
                        </select>
                      </td>
                      <td className="p-2">
                        <input
                          type="date"
                          value={t.date || ''}
                          onChange={(e) => updateTreatment(t.id, { date: e.target.value })}
                          className="w-full px-2 py-1 bg-slate-50 border border-slate-200 rounded-md outline-none"
                        />
                      </td>
                      <td className="p-2">
                        <input
                          type="text"
                          placeholder="Observaciones"
                          value={t.notes || ''}
                          onChange={(e) => updateTreatment(t.id, { notes: e.target.value })}
                          className="w-full px-2 py-1 bg-slate-50 border border-slate-200 rounded-md outline-none"
                        />
                      </td>
                      <td className="p-2">
                        <button
                          type="button"
                          onClick={() => removeTreatment(t.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Totals */}
      {treatments.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <div className="bg-white rounded-xl border border-slate-200 p-3 flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase flex items-center gap-1">
              <CircleDashed className="w-3.5 h-3.5 text-amber-500" /> Planificado
            </span>
            <span className="text-sm font-extrabold text-slate-900">{fmt(planned)}</span>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-3 flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Realizado
            </span>
            <span className="text-sm font-extrabold text-slate-900">{fmt(done)}</span>
          </div>
          <div className="bg-slate-900 rounded-xl p-3 flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-300 uppercase flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-emerald-400" /> Total plan
            </span>
            <span className="text-sm font-extrabold text-white">{fmt(total)}</span>
          </div>
        </div>
      )}
    </div>
  );
}
