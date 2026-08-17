import React from 'react';
import { useClinic } from '../../context/ClinicContext.jsx';
import { X, Printer, Activity, CheckCircle, ShieldCheck } from 'lucide-react';

export function PrescriptionPrintModal() {
  const { modals, closeModal } = useClinic();

  const isOpen = modals.prescriptionPrint.isOpen;
  const record = modals.prescriptionPrint.record;
  const type = modals.prescriptionPrint.type || 'receta'; // 'receta' | 'certificado'

  if (!isOpen || !record) return null;

  const handlePrint = () => {
    window.print();
  };

  const prescriptions = record.prescriptions || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-floating border border-slate-200 w-full max-w-2xl overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Top Modal Controls (No print) */}
        <div className="bg-slate-900 text-white p-4 flex items-center justify-between no-print">
          <div className="flex items-center gap-2">
            <Printer className="w-5 h-5 text-brand-400" />
            <h3 className="font-extrabold text-sm">Vista Previa de Impresión (Receta / Certificado)</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-1.5 text-xs font-black bg-brand-500 hover:bg-brand-400 text-slate-950 rounded-lg flex items-center gap-1.5 shadow-md"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimir / Descargar PDF</span>
            </button>
            <button onClick={() => closeModal('prescriptionPrint')} className="text-slate-400 hover:text-white p-1">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Letterhead Document */}
        <div className="p-8 sm:p-12 printable-area bg-white text-slate-900 space-y-6 min-h-[500px] flex flex-col justify-between">
          
          {/* Header */}
          <div className="border-b-2 border-slate-900 pb-4 flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center font-black text-xl">
                SC
              </div>
              <div>
                <h1 className="text-xl font-extrabold tracking-tight">CLÍNICA SALUDCONNECT</h1>
                <p className="text-xs text-slate-600">Centro Médico Multidisciplinario de Alta Complejidad</p>
                <p className="text-[11px] text-slate-500">Av. Santa Fe 2450, CABA • Tel: (011) 4455-8899 • saludconnect.com</p>
              </div>
            </div>

            <div className="text-right text-xs">
              <span className="font-bold text-slate-900 block">RECETARIO MÉDICO OFICIAL</span>
              <span className="text-slate-500">Fecha: {record.date}</span>
            </div>
          </div>

          {/* Patient Details */}
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs space-y-1">
            <div className="flex justify-between">
              <p><strong>Paciente:</strong> {record.patientName}</p>
              <p><strong>N° Fichero:</strong> <span className="font-extrabold">{record.ficheroNumber || 'S/F'}</span></p>
            </div>
            <div className="flex justify-between">
              <p><strong>DNI / Doc:</strong> {record.dni || 'Sin registrar'}</p>
              <p><strong>Especialidad:</strong> {record.specialty}</p>
            </div>
          </div>

          {/* Rx Prescriptions Body */}
          <div className="space-y-4 my-6 flex-1">
            <div className="flex items-center gap-2 text-brand-700 font-extrabold text-lg">
              <span>℞</span>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Indicación Farmacológica</span>
            </div>

            {prescriptions.length === 0 ? (
              <p className="text-xs text-slate-500 italic">No se prescribieron medicamentos en esta consulta.</p>
            ) : (
              <div className="space-y-3">
                {prescriptions.map((p, idx) => (
                  <div key={idx} className="border-b border-slate-100 pb-2">
                    <p className="font-extrabold text-sm text-slate-900">{idx + 1}. {p.medication}</p>
                    <p className="text-xs text-slate-600 mt-0.5 ml-4">
                      <strong>Posología:</strong> {p.dosage} {p.duration ? `• Durante ${p.duration}` : ''}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {record.treatmentPlan && (
              <div className="pt-2">
                <span className="text-xs font-bold text-slate-700 block mb-1">Indicaciones Complementarias:</span>
                <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  {record.treatmentPlan}
                </p>
              </div>
            )}

            {record.diagnosis && (
              <p className="text-[11px] text-slate-500">
                <strong>Diagnóstico:</strong> {record.diagnosis}
              </p>
            )}
          </div>

          {/* Signature & Stamp Line */}
          <div className="pt-8 border-t border-slate-200 flex items-end justify-between text-xs">
            <div className="text-slate-400 text-[10px] space-y-0.5">
              <div className="flex items-center gap-1 text-emerald-600 font-bold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Documento generado digitalmente por SaludConnect</span>
              </div>
              <p>Validez legal en farmacias y centros asistenciales.</p>
            </div>

            <div className="text-center w-52">
              <div className="border-b border-slate-400 pb-1 mb-1 font-serif italic text-sm text-slate-700">
                {record.doctorName}
              </div>
              <p className="font-extrabold text-slate-900 text-xs">{record.doctorName}</p>
              <p className="text-[11px] text-slate-600">{record.specialty}</p>
              <p className="text-[10px] text-slate-500">{record.license || 'MN 54.210'}</p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
