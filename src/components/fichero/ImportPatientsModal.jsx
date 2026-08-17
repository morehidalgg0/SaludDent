import React, { useState, useRef, useCallback } from 'react';
import { useClinic } from '../../context/ClinicContext.jsx';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import {
  X, Upload, FileSpreadsheet, ArrowRight, ArrowLeft,
  CheckCircle2, AlertTriangle, Loader2, Trash2
} from 'lucide-react';

const PATIENT_FIELDS = [
  { key: 'firstName', label: 'Nombre', required: true },
  { key: 'lastName', label: 'Apellido', required: true },
  { key: 'dni', label: 'DNI / Documento', required: false },
  { key: 'phone', label: 'Teléfono', required: false },
  { key: 'email', label: 'Email', required: false },
  { key: 'birthDate', label: 'Fecha de Nacimiento', required: false },
  { key: 'ficheroNumber', label: 'N° Fichero', required: false },
  { key: 'insurance', label: 'Obra Social / Cobertura', required: false },
  { key: 'insuranceNumber', label: 'N° Afiliado', required: false },
  { key: 'allergies', label: 'Alergias', required: false },
  { key: 'bloodType', label: 'Grupo Sanguíneo', required: false },
  { key: 'emergencyContact', label: 'Contacto de Emergencia', required: false },
  { key: 'notes', label: 'Notas / Observaciones', required: false }
];

const AUTO_MAP = {
  'nombre': 'firstName', 'name': 'firstName', 'first name': 'firstName', 'first_name': 'firstName',
  'apellido': 'lastName', 'lastname': 'lastName', 'last name': 'lastName', 'last_name': 'lastName', 'apellidos': 'lastName',
  'dni': 'dni', 'documento': 'dni', 'document': 'dni', 'id': 'dni', 'n° documento': 'dni', 'num documento': 'dni',
  'teléfono': 'phone', 'telefono': 'phone', 'phone': 'phone', 'celular': 'phone', 'tel': 'phone', 'whatsapp': 'phone', 'movil': 'phone',
  'email': 'email', 'correo': 'email', 'mail': 'email', 'e-mail': 'email',
  'fecha de nacimiento': 'birthDate', 'nacimiento': 'birthDate', 'birth date': 'birthDate', 'birthdate': 'birthDate', 'fnacimiento': 'birthDate', 'fecha_nacimiento': 'birthDate',
  'n° fichero': 'ficheroNumber', 'n fichero': 'ficheroNumber', 'fichero': 'ficheroNumber', 'fichero n°': 'ficheroNumber', 'file number': 'ficheroNumber', 'n_interno': 'ficheroNumber', 'n interno': 'ficheroNumber',
  'obra social': 'insurance', 'cobertura': 'insurance', 'insurance': 'insurance', 'prepaga': 'insurance', 'os': 'insurance',
  'n° afiliado': 'insuranceNumber', 'n afiliado': 'insuranceNumber', 'afiliado': 'insuranceNumber', 'nro afiliado': 'insuranceNumber', 'credential': 'insuranceNumber',
  'alergias': 'allergies', 'alergia': 'allergies', 'allergies': 'allergies', 'alergico': 'allergies',
  'grupo sanguíneo': 'bloodType', 'sangre': 'bloodType', 'blood type': 'bloodType', 'rh': 'bloodType',
  'contacto de emergencia': 'emergencyContact', 'emergencia': 'emergencyContact', 'emergency': 'emergencyContact', 'contacto emergencia': 'emergencyContact',
  'notas': 'notes', 'observaciones': 'notes', 'notes': 'notes', 'obs': 'notes', 'background': 'notes'
};

export function ImportPatientsModal() {
  const { modals, closeModal, importPatients } = useClinic();
  const isOpen = modals.importPatients?.isOpen;
  const fileInputRef = useRef(null);

  const [step, setStep] = useState(1);
  const [rawData, setRawData] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [mapping, setMapping] = useState({});
  const [fileName, setFileName] = useState('');
  const [isImporting, setIsImporting] = useState(false);
  const [result, setResult] = useState(null);
  const [dragOver, setDragOver] = useState(false);

  const reset = () => {
    setStep(1);
    setRawData([]);
    setHeaders([]);
    setMapping({});
    setFileName('');
    setResult(null);
  };

  const handleClose = () => {
    reset();
    closeModal('importPatients');
  };

  const autoDetectMapping = useCallback((cols) => {
    const m = {};
    cols.forEach(col => {
      const normalized = col.toLowerCase().trim();
      if (AUTO_MAP[normalized]) {
        m[col] = AUTO_MAP[normalized];
      }
    });
    return m;
  }, []);

  const processFile = useCallback((file) => {
    setFileName(file.name);
    const ext = file.name.split('.').pop().toLowerCase();

    if (ext === 'csv') {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          setHeaders(results.meta.fields || []);
          setRawData(results.data);
          setMapping(autoDetectMapping(results.meta.fields || []));
          setStep(2);
        }
      });
    } else if (ext === 'xlsx' || ext === 'xls') {
      const reader = new FileReader();
      reader.onload = (e) => {
        const wb = XLSX.read(e.target.result, { type: 'array' });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const json = XLSX.utils.sheet_to_json(ws, { defval: '' });
        if (json.length > 0) {
          setHeaders(Object.keys(json[0]));
          setRawData(json);
          setMapping(autoDetectMapping(Object.keys(json[0])));
          setStep(2);
        }
      };
      reader.readAsArrayBuffer(file);
    }
  }, [autoDetectMapping]);

  const handleFileDrop = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  }, [processFile]);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) processFile(file);
  };

  const getPreviewData = () => {
    return rawData.slice(0, 50).map((row, idx) => {
      const patient = { _row: idx + 2 };
      PATIENT_FIELDS.forEach(field => {
        const sourceCol = Object.keys(mapping).find(col => mapping[col] === field.key);
        if (sourceCol && row[sourceCol] !== undefined) {
          patient[field.key] = String(row[sourceCol] || '').trim();
        }
      });
      return patient;
    });
  };

  const handleImport = async () => {
    setIsImporting(true);
    try {
      const patients = rawData.map((row, idx) => {
        const patient = { _row: idx + 2 };
        PATIENT_FIELDS.forEach(field => {
          const sourceCol = Object.keys(mapping).find(col => mapping[col] === field.key);
          if (sourceCol && row[sourceCol] !== undefined) {
            patient[field.key] = String(row[sourceCol] || '').trim();
          }
        });
        return patient;
      });

      const res = await importPatients(patients);
      setResult(res);
      setStep(4);
    } catch (err) {
      setResult({ created: 0, skipped: 0, errors: [{ row: 0, error: err.message }] });
      setStep(4);
    } finally {
      setIsImporting(false);
    }
  };

  if (!isOpen) return null;

  const previewData = step >= 3 ? getPreviewData() : [];
  const mappedFields = Object.values(mapping).filter(v => v);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-floating border border-slate-200 w-full max-w-4xl overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-150">

        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500 text-slate-950 font-bold flex items-center justify-center text-sm">
              <FileSpreadsheet className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base">Importar Pacientes</h3>
              <p className="text-xs text-slate-400">
                {step === 1 && 'Subí un archivo CSV o Excel (.xlsx)'}
                {step === 2 && 'Mapeá las columnas del archivo a los campos del sistema'}
                {step === 3 && `Vista previa — ${previewData.length} pacientes a importar`}
                {step === 4 && 'Resultado de la importación'}
              </p>
            </div>
          </div>
          <button onClick={handleClose} className="text-slate-400 hover:text-white p-1 rounded transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress */}
        <div className="h-1 w-full bg-slate-100">
          <div className="h-full bg-emerald-500 transition-all duration-300" style={{ width: `${(step / 4) * 100}%` }}></div>
        </div>

        <div className="p-6 max-h-[70vh] overflow-y-auto">

          {/* STEP 1: Upload */}
          {step === 1 && (
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleFileDrop}
              className={`border-2 border-dashed rounded-xl p-10 text-center transition-colors cursor-pointer ${
                dragOver ? 'border-emerald-400 bg-emerald-50' : 'border-slate-300 hover:border-slate-400'
              }`}
              onClick={() => fileInputRef.current?.click()}
            >
              <input ref={fileInputRef} type="file" accept=".csv,.xlsx,.xls" onChange={handleFileSelect} className="hidden" />
              <Upload className="w-10 h-10 text-slate-400 mx-auto mb-3" />
              <p className="text-sm font-bold text-slate-700 mb-1">
                Arrastrá tu archivo aquí o hacé click para seleccionar
              </p>
              <p className="text-xs text-slate-500">
                Formatos aceptados: CSV, Excel (.xlsx, .xls) — Máximo 1000 pacientes
              </p>
              <p className="text-xs text-slate-400 mt-3">
                Si exportás desde Dentalink, usá el reporte "Listado de Pacientes"
              </p>
            </div>
          )}

          {/* STEP 2: Column Mapping */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500">
                    Archivo: <strong className="text-slate-700">{fileName}</strong> — {rawData.length} filas detectadas
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Se detectaron automáticamente {mappedFields.length} de {PATIENT_FIELDS.length} campos
                  </p>
                </div>
                <button onClick={reset} className="text-xs text-slate-500 hover:text-slate-700 underline">
                  Cambiar archivo
                </button>
              </div>

              <div className="bg-slate-50 rounded-lg border border-slate-200 p-4 space-y-3">
                <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">Mapeo de Columnas</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {PATIENT_FIELDS.map(field => (
                    <div key={field.key} className="flex items-center gap-2">
                      <label className="text-xs text-slate-600 w-36 shrink-0 truncate" title={field.label}>
                        {field.label}
                        {field.required && <span className="text-rose-500">*</span>}
                      </label>
                      <select
                        value={mapping[Object.keys(mapping).find(col => mapping[col] === field.key)] || ''}
                        onChange={(e) => {
                          const newMapping = { ...mapping };
                          Object.keys(newMapping).forEach(k => { if (newMapping[k] === field.key) delete newMapping[k]; });
                          if (e.target.value) newMapping[e.target.value] = field.key;
                          setMapping(newMapping);
                        }}
                        className="flex-1 px-2 py-1 text-xs bg-white border border-slate-200 rounded outline-hidden"
                      >
                        <option value="">— No importar —</option>
                        {headers.map(h => (
                          <option key={h} value={h}>{h}</option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Preview */}
          {step === 3 && (
            <div className="space-y-3">
              <div className="flex items-center gap-4 text-xs">
                <span className="text-slate-600">
                  <strong className="text-slate-900">{previewData.length}</strong> pacientes para importar
                </span>
                <span className="text-slate-400">•</span>
                <span className="text-slate-600">
                  Campos mapeados: <strong className="text-slate-900">{mappedFields.length}</strong>
                </span>
              </div>

              <div className="overflow-x-auto border border-slate-200 rounded-lg">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      <th className="px-2 py-1.5 text-left font-bold text-slate-600">#</th>
                      {PATIENT_FIELDS.filter(f => mappedFields.includes(f.key)).map(f => (
                        <th key={f.key} className="px-2 py-1.5 text-left font-bold text-slate-600 whitespace-nowrap">
                          {f.label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {previewData.map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="px-2 py-1 text-slate-400">{idx + 1}</td>
                        {PATIENT_FIELDS.filter(f => mappedFields.includes(f.key)).map(f => (
                          <td key={f.key} className="px-2 py-1 text-slate-700 whitespace-nowrap max-w-[150px] truncate">
                            {row[f.key] || <span className="text-slate-300">—</span>}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {rawData.length > 50 && (
                <p className="text-xs text-slate-400 text-center">
                  Mostrando primeros 50 de {rawData.length} pacientes
                </p>
              )}
            </div>
          )}

          {/* STEP 4: Result */}
          {step === 4 && result && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
                <div>
                  <p className="text-sm font-bold text-emerald-900">
                    {result.created} pacientes importados exitosamente
                  </p>
                  {result.skipped > 0 && (
                    <p className="text-xs text-emerald-700 mt-0.5">
                      {result.skipped} pacientes saltados (duplicados o sin datos válidos)
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

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t border-slate-100 bg-slate-50/50">
          <div>
            {step > 1 && step < 4 && (
              <button
                onClick={() => setStep(step - 1)}
                className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-md transition-colors flex items-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Volver</span>
              </button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleClose}
              className="px-3.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-200 rounded-md transition-colors"
            >
              {step === 4 ? 'Cerrar' : 'Cancelar'}
            </button>
            {step === 2 && (
              <button
                onClick={() => setStep(3)}
                disabled={mappedFields.length === 0}
                className="px-4 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-2xs transition-colors flex items-center gap-1.5 disabled:opacity-50"
              >
                <span>Previsualizar</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
            {step === 3 && (
              <button
                onClick={handleImport}
                disabled={isImporting}
                className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-2xs transition-colors flex items-center gap-1.5"
              >
                {isImporting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Importando...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Importar {rawData.length} Pacientes</span>
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
