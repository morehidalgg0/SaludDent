import React, { useState } from 'react';
import { Grid3x3, Activity, ClipboardList, Receipt, FileSignature } from 'lucide-react';
import { OdontogramChart } from './odontology/OdontogramChart.jsx';
import { PeriodontogramChart } from './odontology/PeriodontogramChart.jsx';
import { TreatmentPlanTable } from './odontology/TreatmentPlanTable.jsx';
import { DentalBudgetTable } from './odontology/DentalBudgetTable.jsx';

const TABS = [
  { id: 'odontograma', label: 'Odontograma', icon: Grid3x3 },
  { id: 'periodontograma', label: 'Periodontograma', icon: Activity },
  { id: 'plan', label: 'Plan de tratamiento', icon: ClipboardList },
  { id: 'presupuesto', label: 'Presupuesto', icon: Receipt }
];

export function OdontologyModule({ data = {}, onChange, patient, doctor, onPrintBudget, onPrintConsent }) {
  const [tab, setTab] = useState('odontograma');

  return (
    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-4">
      <div>
        <h4 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
          <span>🦷 Módulo Odontológico</span>
        </h4>
        <p className="text-xs text-slate-500">
          Odontograma digital, periodontograma, plan de tratamiento, presupuesto y consentimiento informado.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-1.5 bg-white p-1 rounded-xl border border-slate-200">
        {TABS.map(t => {
          const Icon = t.icon;
          const isActive = tab === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                isActive ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
              <span>{t.label}</span>
            </button>
          );
        })}
        <button
          type="button"
          onClick={() => onPrintConsent && onPrintConsent()}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors ml-auto"
        >
          <FileSignature className="w-3.5 h-3.5 text-slate-400" />
          <span>Consentimiento informado</span>
        </button>
      </div>

      {/* Content */}
      <div className="animate-in fade-in duration-150">
        {tab === 'odontograma' && (
          <OdontogramChart data={data} onChange={onChange} />
        )}
        {tab === 'periodontograma' && (
          <PeriodontogramChart data={data} onChange={onChange} />
        )}
        {tab === 'plan' && (
          <TreatmentPlanTable data={data} onChange={onChange} />
        )}
        {tab === 'presupuesto' && (
          <DentalBudgetTable
            data={data}
            onChange={onChange}
            onPrint={(budget) => onPrintBudget && onPrintBudget(budget)}
          />
        )}
      </div>
    </div>
  );
}
