import React, { useState, useRef, useCallback } from 'react';
import { useClinic } from '../../context/ClinicContext.jsx';
import * as XLSX from 'xlsx';
import Papa from 'papaparse';
import {
  X, Upload, FileSpreadsheet, ArrowRight, ArrowLeft,
  CheckCircle2, AlertTriangle, Loader2
} from 'lucide-react';

// Column names as exported by Dentalink's "Agenda de Citas" report. Each target key lists
// its candidate source columns in priority order — the first one with a non-empty value
// for a given row wins, so slightly different exports (or a blank column) still work.
const COLUMN_CANDIDATES = {
  ficheroNumber: ['# Paciente', 'Número interno', 'N Interno'],
  dni: ['Cédula identidad / DNI Paciente', 'DNI Paciente', 'Cédula identidad / DNI'],
  patientFirstName: ['Nombre Paciente'],
  patientLastName: ['Apellidos Paciente'],
  patientPhone: ['Celular', 'Teléfono'],
  doctorFirstName: ['Nombre Profesional Cita'],
  doctorLastName: ['Apellidos Profesional Cita'],
  date: ['Fecha Cita'],
  time: ['Hora Inicio Cita'],
  endTime: ['Hora Fin Cita'],
  status: ['Estado Cita'],
  notes: ['Observaciones', 'Comentario Cita']
};

function firstNonEmpty(row, candidates) {
  for (const col of candidates) {
    const val = row[col];
    if (val !== undefined && val !== null && String(val).trim() !== '') return String(val).trim();
  }
  return '';
}

function toHHMM(raw) {
  return raw ? raw.slice(0, 5) : '';
}

function mapRow(row, idx) {
  const ficheroRaw = firstNonEmpty(row, COLUMN_CANDIDATES.ficheroNumber);
  const firstName = firstNonEmpty(row, COLUMN_CANDIDATES.patientFirstName);
  const lastName = firstNonEmpty(row, COLUMN_CANDIDATES.patientLastName);
  const docFirst = firstNonEmpty(row, COLUMN_CANDIDATES.doctorFirstName);
  const docLast = firstNonEmpty(row, COLUMN_CANDIDATES.doctorLastName);

  return {
    _row: idx + 2,
    ficheroNumber: /^\d+$/.test(ficheroRaw) ? `F-${ficheroRaw}` : ficheroRaw,
    dni: firstNonEmpty(row, COLUMN_CANDIDATES.dni),
    patientName: [firstName, lastName].filter(Boolean).join(' '),
    patientPhone: firstNonEmpty(row, COLUMN_CANDIDATES.patientPhone),
    doctorName: [docFirst, docLast].filter(Boolean).join(' '),
    date: firstNonEmpty(row, COLUMN_CANDIDATES.date),
    time: toHHMM(firstNonEmpty(row, COLUMN_CANDIDATES.time)),
    endTime: toHHMM(firstNonEmpty(row, COLUMN_CANDIDATES.endTime)),
    status: firstNonEmpty(row, COLUMN_CANDIDATES.status),
    notes: firstNonEmpty(row, COLUMN_CANDIDATES.notes)
  };
}

export function ImportAppointmentsModal() {
  const { modals, closeModal, importAppointments } = useClinic();
  const isOpen = modals.importAppointments?.isOpen;
  const fileInputRef = useRef(null);

  const [step, setStep] = useState(1);
  const [fileName, setFileName] = useState('');
  const [rows, setRows] = useState([]);
  const [isImporting, setIsImporting] = useState(false);
  const [importProgress, setImportProgress] = useState(null);
  const [result, setResult] = useState(null);

  const reset = () => {
    setStep(1);
    setFileName('');
    setRows([]);
    setResult(null);
  };

  const handleClose = () => {
    reset();
    closeModal('importAppointments');
  };

  const processFile = useCallback((file) => {
    setFileName(file.name);
    const ext = file.name.split('.').pop().toLowerCase();

    if (ext === 'csv') {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          setRows((results.data || []).map(mapRow));
          setStep(2);
        }
      });
    } else {
      const reader = new FileReader();
      reader.onload = (e) => {
        const wb = XLSX.read(e.target.result, { type: 'array' });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const json = XLSX.utils.sheet_to_json(ws, { defval: '' });
        setRows(json.map(mapRow));
        setStep(2);
      };
      reader.readAsArrayBuffer(file);
    }
  }, []);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) processFile(file);
  };

  const handleFileDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  };

  const handleImport = async () => {
    setIsImporting(true);
    setImportProgress({ done: 0, total: rows.length });
    try {
      const res = await importAppointments(rows, setImportProgress);
      setResult(res);
      setStep(3);
    } catch (err) {
      setResult({ created: 0, skipped: 0, errors: [{ row: 0, error: err.message }] });
      setStep(3);
    } finally {
      setIsImporting(false);
      setImportProgress(null);
    }
  };

  if (!isOpen) return null;

  const previewRows = rows.slice(0, 50);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-floating border border-slate-200 w-full max-w-4xl overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-150">

        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500 text-slate-950 font-bold flex items-center justify-center text-sm">
              <FileSpreadsheet className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base">Importar Citas</h3>
              <p className="text-xs text-slate-400">
                {step === 1 && 'Subí el reporte "Agenda de Citas" (CSV o Excel)'}
                {step === 2 && `Vista previa — ${rows.length} citas detectadas`}
                {step === 3 && 'Resultado de la importación'}
              </p>
            </div>
          </div>
          <button onClick={handleClose} className="text-slate-400 hover:text-white p-1 rounded transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="h-1 w-full bg-slate-100">
          <div className="h-full bg-emerald-500 transition-all duration-300" style={{ width: `${(step / 3) * 100}%` }}></div>
        </div>

        <div className="p-6 max-h-[70vh] overflow-y-auto">

          {step === 1 && (
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleFileDrop}
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-300 hover:border-slate-400 rounded-xl p-10 text-center transition-colors cursor-pointer"
            >
              <input ref={fileInputRef} type="file" accept=".csv,.xlsx,.xls" onChange={handleFileSelect} className="hidden" />
              <Upload className="w-10 h-10 text-slate-400 mx-auto mb-3" />
              <p className="text-sm font-bold text-slate-700 mb-1">
                Arrastrá tu archivo aquí o hacé click para seleccionar
              </p>
              <p className="text-xs text-slate-500">
                El paciente se relaciona automáticamente por su N° de fichero/paciente, DNI o nombre.
              </p>
              <p className="text-xs text-slate-400 mt-3">
                Si exportás desde Dentalink, usá el reporte "Agenda de Citas"
              </p>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-3">
              <p className="text-xs text-slate-500">
                Archivo: <strong className="text-slate-700">{fileName}</strong> — {rows.length} citas detectadas
              </p>
              <div className="overflow-x-auto border border-slate-200 rounded-lg">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      <th className="px-2 py-1.5 text-left font-bold text-slate-600">#</th>
                      <th className="px-2 py-1.5 text-left font-bold text-slate-600">Fecha</th>
                      <th className="px-2 py-1.5 text-left font-bold text-slate-600">Hora</th>
                      <th className="px-2 py-1.5 text-left font-bold text-slate-600">Paciente</th>
                      <th className="px-2 py-1.5 text-left font-bold text-slate-600">Fichero</th>
                      <th className="px-2 py-1.5 text-left font-bold text-slate-600">Profesional</th>
                      <th className="px-2 py-1.5 text-left font-bold text-slate-600">Estado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {previewRows.map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="px-2 py-1 text-slate-400">{idx + 1}</td>
                        <td className="px-2 py-1 text-slate-700 whitespace-nowrap">{row.date}</td>
                        <td className="px-2 py-1 text-slate-700 whitespace-nowrap">{row.time}</td>
                        <td className="px-2 py-1 text-slate-700 whitespace-nowrap max-w-[150px] truncate">{row.patientName || '—'}</td>
                        <td className="px-2 py-1 text-slate-700 whitespace-nowrap">{row.ficheroNumber || '—'}</td>
                        <td className="px-2 py-1 text-slate-700 whitespace-nowrap max-w-[150px] truncate">{row.doctorName || '—'}</td>
                        <td className="px-2 py-1 text-slate-700 whitespace-nowrap">{row.status || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {rows.length > 50 && (
                <p className="text-xs text-slate-400 text-center">Mostrando primeras 50 de {rows.length} citas</p>
              )}
            </div>
          )}

          {step === 3 && result && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
                <div>
                  <p className="text-sm font-bold text-emerald-900">
                    {result.created} citas importadas exitosamente
                  </p>
                  {result.skipped > 0 && (
                    <p className="text-xs text-emerald-700 mt-0.5">
                      {result.skipped} citas saltadas (profesional no encontrado, o sin fecha/hora)
                    </p>
                  )}
                </div>
              </div>

              {result.errors && result.errors.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">Detalles de errores</p>
                  <div className="max-h-40 overflow-y-auto space-y-1">
                    {result.errors.slice(0, 20).map((err, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-rose-700 bg-rose-50 px-2.5 py-1.5 rounded">
                        <AlertTriangle className="w-3 h-3 shrink-0" />
                        <span>Fila {err.row}: {err.error}</span>
                      </div>
                    ))}
                    {result.errors.length > 20 && (
                      <p className="text-xs text-slate-400">... y {result.errors.length - 20} errores más</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

        </div>

        <div className="flex items-center justify-between p-4 border-t border-slate-100 bg-slate-50/50">
          <div>
            {step === 2 && (
              <button
                onClick={reset}
                className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-md transition-colors flex items-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Cambiar archivo</span>
              </button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleClose}
              className="px-3.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-200 rounded-md transition-colors"
            >
              {step === 3 ? 'Cerrar' : 'Cancelar'}
            </button>
            {step === 2 && (
              <button
                onClick={handleImport}
                disabled={isImporting || rows.length === 0}
                className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-2xs transition-colors flex items-center gap-1.5 disabled:opacity-50"
              >
                {isImporting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>
                      {importProgress ? `Importando... ${importProgress.done}/${importProgress.total}` : 'Importando...'}
                    </span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Importar {rows.length} Citas</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
