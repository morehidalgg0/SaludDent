import React, { useState } from 'react';
import { useClinic } from '../../context/ClinicContext.jsx';
import { X, Printer, ShieldCheck, FileSignature, Receipt } from 'lucide-react';
import { CONSENT_TEMPLATES } from './specialties/odontology/constants.js';

const fmt = (n) =>
  new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(n || 0);

export function DentalPrintModal() {
  const { modals, closeModal, clinic } = useClinic();

  const isOpen = modals.dentalPrint.isOpen;
  const type = modals.dentalPrint.type || 'presupuesto';
  const budget = modals.dentalPrint.budget;
  const patient = modals.dentalPrint.patient;
  const doctor = modals.dentalPrint.doctor;
  const date = modals.dentalPrint.date || new Date().toISOString().split('T')[0];

  const [consentId, setConsentId] = useState('general');

  if (!isOpen) return null;

  const patientName = patient ? `${patient.firstName} ${patient.lastName}` : 'Paciente';
  const consent = CONSENT_TEMPLATES.find(c => c.id === consentId) || CONSENT_TEMPLATES[0];
  const clinicName = clinic?.name || 'Clínica SaludConnect';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 w-full max-w-3xl overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-150">

        {/* Top controls (no print) */}
        <div className="bg-white border-b border-slate-200 p-4 flex flex-wrap items-center justify-between gap-2 no-print">
          <div className="flex items-center gap-2">
            {type === 'presupuesto'
              ? <Receipt className="w-5 h-5 text-emerald-600" />
              : <FileSignature className="w-5 h-5 text-amber-600" />}
            <h3 className="font-extrabold text-sm text-slate-900">
              {type === 'presupuesto' ? 'Presupuesto Odontológico' : 'Consentimiento Informado'}
            </h3>
          </div>

          <div className="flex items-center gap-2">
            {type === 'consentimiento' && (
              <select
                value={consentId}
                onChange={(e) => setConsentId(e.target.value)}
                className="px-2.5 py-1.5 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg outline-none"
              >
                {CONSENT_TEMPLATES.map(t => (
                  <option key={t.id} value={t.id}>{t.label}</option>
                ))}
              </select>
            )}
            <button
              onClick={() => window.print()}
              className="px-4 py-1.5 text-xs font-black bg-slate-900 hover:bg-slate-800 text-white rounded-lg flex items-center gap-1.5 shadow-sm"
            >
              <Printer className="w-3.5 h-3.5 text-emerald-400" />
              <span>Imprimir / Descargar PDF</span>
            </button>
            <button onClick={() => closeModal('dentalPrint')} className="text-slate-400 hover:text-slate-700 p-1">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable document */}
        <div className="p-8 sm:p-12 printable-area bg-white text-slate-900 space-y-6 min-h-[500px] flex flex-col">
          {/* Letterhead */}
          <div className="border-b-2 border-slate-900 pb-4 flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center font-black text-xl">
                SC
              </div>
              <div>
                <h1 className="text-xl font-extrabold tracking-tight uppercase">{clinicName}</h1>
                <p className="text-xs text-slate-600">Consultorio Odontológico</p>
                <p className="text-[11px] text-slate-500">
                  {clinic?.address || 'Dirección'} • Tel: {clinic?.phone || '—'}
                </p>
              </div>
            </div>
            <div className="text-right text-xs">
              <span className="font-bold text-slate-900 block">
                {type === 'presupuesto' ? 'PRESUPUESTO ODONTOLÓGICO' : 'CONSENTIMIENTO INFORMADO'}
              </span>
              <span className="text-slate-500">Fecha: {date}</span>
            </div>
          </div>

          {/* Patient details */}
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs space-y-1">
            <div className="flex justify-between">
              <p><strong>Paciente:</strong> {patientName}</p>
              <p><strong>N° Fichero:</strong> <span className="font-extrabold">{patient?.ficheroNumber || 'S/F'}</span></p>
            </div>
            <div className="flex justify-between">
              <p><strong>DNI / Doc:</strong> {patient?.dni || 'Sin registrar'}</p>
              <p><strong>Cobertura:</strong> {patient?.insurance || 'Particular'}</p>
            </div>
          </div>

          {type === 'presupuesto' ? (
            <BudgetBody budget={budget} />
          ) : (
            <ConsentBody consent={consent} />
          )}

          {/* Signature */}
          <div className="pt-8 mt-auto border-t border-slate-200 flex items-end justify-between text-xs">
            <div className="text-slate-400 text-[10px] space-y-0.5">
              <div className="flex items-center gap-1 text-emerald-600 font-bold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Documento generado digitalmente por SaludConnect</span>
              </div>
              <p>
                {type === 'presupuesto'
                  ? 'Presupuesto sujeto a variación según hallazgos clínicos.'
                  : 'Documento de consentimiento con validez clínica y legal.'}
              </p>
            </div>

            <div className="text-center w-52">
              <div className="border-b border-slate-400 pb-1 mb-1 font-serif italic text-sm text-slate-700">
                {doctor?.name || 'Profesional'}
              </div>
              <p className="font-extrabold text-slate-900 text-xs">{doctor?.name || 'Profesional'}</p>
              <p className="text-[11px] text-slate-600">{doctor?.specialty || 'Odontología'}</p>
              <p className="text-[10px] text-slate-500">{doctor?.license || 'MP —'}</p>
            </div>
          </div>

          {type === 'consentimiento' && (
            <div className="pt-6 flex items-end justify-between text-xs">
              <div className="text-center w-64">
                <div className="border-b border-slate-400 pb-6 mb-1" />
                <p className="text-slate-600">Firma del Paciente / Representante</p>
                <p className="text-[10px] text-slate-500">{patientName} — DNI {patient?.dni || '—'}</p>
              </div>
              <p className="text-[10px] text-slate-400">Aclaración y firma</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function BudgetBody({ budget }) {
  const items = budget?.items || [];
  const subtotal = budget?.subtotal ?? items.reduce((s, i) => s + (Number(i.price) || 0) * (Number(i.qty) || 1), 0);
  const discount = budget?.discount ?? 0;
  const total = budget?.total ?? subtotal - discount;

  return (
    <div className="space-y-4 flex-1">
      {/* Table */}
      <table className="w-full text-xs text-left border border-slate-200 rounded-lg overflow-hidden">
        <thead>
          <tr className="bg-slate-100 text-slate-600 uppercase text-[10px] font-black">
            <th className="p-2 w-14">Pieza</th>
            <th className="p-2">Procedimiento</th>
            <th className="p-2 w-12 text-center">Cant.</th>
            <th className="p-2 w-24 text-right">P. Unit.</th>
            <th className="p-2 w-24 text-right">Subtotal</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {items.length === 0 ? (
            <tr><td colSpan={5} className="p-3 text-center text-slate-400 italic">Sin ítems.</td></tr>
          ) : (
            items.map((i, idx) => (
              <tr key={i.id || idx}>
                <td className="p-2 font-bold text-center">{i.tooth || '—'}</td>
                <td className="p-2">{i.procedureLabel || '—'}</td>
                <td className="p-2 text-center">{i.qty || 1}</td>
                <td className="p-2 text-right">{fmt(i.price)}</td>
                <td className="p-2 text-right font-bold">{fmt((Number(i.price) || 0) * (Number(i.qty) || 1))}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Totals */}
      <div className="flex justify-end">
        <div className="w-64 space-y-1.5 text-xs">
          <div className="flex justify-between">
            <span className="text-slate-500">Subtotal</span>
            <span className="font-bold">{fmt(subtotal)}</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between text-emerald-600">
              <span>Descuento</span>
              <span className="font-bold">- {fmt(discount)}</span>
            </div>
          )}
          <div className="flex justify-between pt-1.5 border-t border-slate-300 text-sm">
            <span className="font-black uppercase">Total</span>
            <span className="font-black">{fmt(total)}</span>
          </div>
        </div>
      </div>

      {budget?.validUntil && (
        <p className="text-[11px] text-slate-500">Presupuesto válido hasta: <strong>{budget.validUntil}</strong></p>
      )}
      {budget?.notes && (
        <div className="text-[11px] text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
          <strong>Observaciones:</strong> {budget.notes}
        </div>
      )}
    </div>
  );
}

function ConsentBody({ consent }) {
  return (
    <div className="space-y-4 flex-1">
      <h2 className="text-sm font-black text-center uppercase tracking-wide">{consent.title}</h2>

      <p className="text-xs text-slate-700 leading-relaxed">{consent.intro}</p>

      <ol className="space-y-2">
        {consent.items.map((item, idx) => (
          <li key={idx} className="flex items-start gap-2 text-xs text-slate-700">
            <span className="w-4 h-4 mt-0.5 rounded border border-slate-400 shrink-0" />
            <span className="leading-relaxed">{item}</span>
          </li>
        ))}
      </ol>

      <p className="text-[11px] text-slate-500 leading-relaxed pt-2 border-t border-slate-100">
        El/la firmante declara haber leído y comprendido el presente documento, habiendo tenido la oportunidad de
        realizar preguntas y recibir respuestas satisfactorias. Otorga su consentimiento libre, expreso e informado
        para la realización del tratamiento indicado.
      </p>
    </div>
  );
}
