import React from 'react';
import { Plus, Trash2, Printer, Download, Percent } from 'lucide-react';
import { DENTAL_PROCEDURES } from './constants.js';

let budgetSeq = 0;
const nextId = () => `b-${Date.now()}-${budgetSeq++}`;

const fmt = (n) =>
  new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(n || 0);

export function DentalBudgetTable({ data = {}, onChange, onPrint }) {
  const budget = data.budget || { items: [], discountPercent: 0, notes: '', validUntil: '' };
  const items = budget.items || [];

  const update = (patch) => onChange({ ...data, budget: { ...budget, ...patch } });

  const addItem = () => {
    update({
      items: [
        ...items,
        { id: nextId(), tooth: '', procedureId: '', procedureLabel: '', price: 0, qty: 1, notes: '' }
      ]
    });
  };

  const updateItem = (id, patch) => {
    update({ items: items.map(i => (i.id === id ? { ...i, ...patch } : i)) });
  };

  const removeItem = (id) => {
    update({ items: items.filter(i => i.id !== id) });
  };

  const handleProcedureChange = (id, procedureId) => {
    const proc = DENTAL_PROCEDURES.find(p => p.id === procedureId);
    updateItem(id, { procedureId, procedureLabel: proc?.label || '', price: proc?.price ?? 0 });
  };

  const importFromPlan = () => {
    const treatments = data.treatments || [];
    if (treatments.length === 0) return;
    const imported = treatments.map(t => ({
      id: nextId(),
      tooth: t.tooth || '',
      procedureId: t.procedureId || '',
      procedureLabel: t.procedureLabel || '',
      price: Number(t.price) || 0,
      qty: 1,
      notes: t.notes || ''
    }));
    update({ items: [...items, ...imported] });
  };

  const lineTotal = (i) => (Number(i.price) || 0) * (Number(i.qty) || 1);
  const subtotal = items.reduce((s, i) => s + lineTotal(i), 0);
  const discount = Math.round((subtotal * (Number(budget.discountPercent) || 0)) / 100);
  const total = subtotal - discount;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs text-slate-500">
          Confeccione el presupuesto odontológico y genere una versión imprimible para el paciente.
        </p>
        <div className="flex items-center gap-2">
          {(data.treatments?.length || 0) > 0 && (
            <button
              type="button"
              onClick={importFromPlan}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-700 transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>Importar del plan</span>
            </button>
          )}
          <button
            type="button"
            onClick={addItem}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg bg-slate-900 hover:bg-slate-800 text-white transition-colors"
          >
            <Plus className="w-3.5 h-3.5 text-emerald-400" />
            <span>Agregar ítem</span>
          </button>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="bg-white rounded-xl border border-dashed border-slate-300 p-8 text-center text-slate-400 text-xs">
          Sin ítems en el presupuesto. Agregue el primero o impórtelos del plan de tratamiento.
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left min-w-[720px]">
              <thead>
                <tr className="bg-slate-50 text-slate-500 uppercase text-[10px] font-black">
                  <th className="p-2.5 w-16">Pieza</th>
                  <th className="p-2.5">Procedimiento</th>
                  <th className="p-2.5 w-16 text-center">Cant.</th>
                  <th className="p-2.5 w-28">P. Unit.</th>
                  <th className="p-2.5 w-28 text-right">Subtotal</th>
                  <th className="p-2.5 w-10"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {items.map(i => (
                  <tr key={i.id} className="hover:bg-slate-50/60">
                    <td className="p-2">
                      <input
                        type="text"
                        placeholder="N°"
                        value={i.tooth}
                        onChange={(e) => updateItem(i.id, { tooth: e.target.value })}
                        className="w-14 px-2 py-1 text-center bg-slate-50 border border-slate-200 rounded-md font-bold outline-none"
                      />
                    </td>
                    <td className="p-2">
                      <select
                        value={i.procedureId}
                        onChange={(e) => handleProcedureChange(i.id, e.target.value)}
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
                        min="1"
                        value={i.qty ?? 1}
                        onChange={(e) => updateItem(i.id, { qty: Number(e.target.value) })}
                        className="w-14 px-2 py-1 text-center bg-slate-50 border border-slate-200 rounded-md font-bold outline-none"
                      />
                    </td>
                    <td className="p-2">
                      <input
                        type="number"
                        min="0"
                        value={i.price ?? 0}
                        onChange={(e) => updateItem(i.id, { price: Number(e.target.value) })}
                        className="w-24 px-2 py-1 bg-slate-50 border border-slate-200 rounded-md font-bold outline-none"
                      />
                    </td>
                    <td className="p-2 text-right font-extrabold text-slate-900">{fmt(lineTotal(i))}</td>
                    <td className="p-2">
                      <button
                        type="button"
                        onClick={() => removeItem(i.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {items.length > 0 && (
        <>
          {/* Options */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <div className="bg-white rounded-xl border border-slate-200 p-3">
              <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1 flex items-center gap-1">
                <Percent className="w-3 h-3" /> Descuento (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={budget.discountPercent ?? 0}
                onChange={(e) => update({ discountPercent: Number(e.target.value) })}
                className="w-full px-2 py-1 text-xs bg-slate-50 border border-slate-200 rounded-md font-bold outline-none"
              />
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-3">
              <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">Válido hasta</label>
              <input
                type="date"
                value={budget.validUntil || ''}
                onChange={(e) => update({ validUntil: e.target.value })}
                className="w-full px-2 py-1 text-xs bg-slate-50 border border-slate-200 rounded-md outline-none"
              />
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-3">
              <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">Observaciones</label>
              <input
                type="text"
                placeholder="Ej. Incluye materiales..."
                value={budget.notes || ''}
                onChange={(e) => update({ notes: e.target.value })}
                className="w-full px-2 py-1 text-xs bg-slate-50 border border-slate-200 rounded-md outline-none"
              />
            </div>
          </div>

          {/* Totals */}
          <div className="bg-slate-900 rounded-xl p-4 text-white space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Subtotal</span>
              <span className="font-bold">{fmt(subtotal)}</span>
            </div>
            {discount > 0 && (
              <div className="flex items-center justify-between text-xs text-emerald-300">
                <span>Descuento ({budget.discountPercent}%)</span>
                <span className="font-bold">- {fmt(discount)}</span>
              </div>
            )}
            <div className="flex items-center justify-between pt-2 border-t border-slate-700">
              <span className="text-sm font-black uppercase tracking-wider">Total</span>
              <span className="text-lg font-black text-emerald-400">{fmt(total)}</span>
            </div>
            <button
              type="button"
              onClick={() =>
                onPrint &&
                onPrint({
                  items,
                  subtotal,
                  discount,
                  discountPercent: Number(budget.discountPercent) || 0,
                  total,
                  notes: budget.notes,
                  validUntil: budget.validUntil
                })
              }
              className="mt-2 w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-bold rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-900 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimir / Generar Presupuesto</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
}
