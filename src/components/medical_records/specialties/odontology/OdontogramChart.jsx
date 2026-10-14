import React, { useState } from 'react';
import { Check, Info, Trash2 } from 'lucide-react';
import {
  CONDITIONS,
  UPPER_TEETH,
  LOWER_TEETH,
  UPPER_TEETH_PRIMARY,
  LOWER_TEETH_PRIMARY,
  DENTITIONS,
  MOBILITY_GRADES
} from './constants.js';

const emptyFaces = () => ({
  oclusal: 'sano',
  vestibular: 'sano',
  lingual: 'sano',
  mesial: 'sano',
  distal: 'sano'
});

const defaultTooth = () => ({
  status: 'sano',
  faces: emptyFaces(),
  mobility: 0,
  notes: ''
});

export function OdontogramChart({ data = {}, onChange }) {
  const [selectedCondition, setSelectedCondition] = useState('caries');
  const [selectedTooth, setSelectedTooth] = useState(null);
  const dentition = data.dentition || 'permanent';
  const odontogram = data.odontogram || {};

  const update = (newOdontogram, patch = {}) => {
    onChange({ ...data, odontogram: newOdontogram, dentition, ...patch });
  };

  const setTooth = (toothNumber, nextTooth) => {
    update({ ...odontogram, [toothNumber]: nextTooth });
  };

  const handleFaceClick = (toothNumber, face) => {
    const currentTooth = odontogram[toothNumber] || defaultTooth();
    const newFaces = {
      ...currentTooth.faces,
      [face]: currentTooth.faces?.[face] === selectedCondition ? 'sano' : selectedCondition
    };
    const hasCaries = Object.values(newFaces).includes('caries');
    const hasRestoration = Object.values(newFaces).includes('restoration');
    const overallStatus = hasCaries ? 'caries' : hasRestoration ? 'restoration' : selectedCondition;

    setTooth(toothNumber, { ...currentTooth, status: overallStatus, faces: newFaces });
  };

  const handleToothStatusClick = (toothNumber, status) => {
    const currentTooth = odontogram[toothNumber] || defaultTooth();
    const newStatus = currentTooth.status === status ? 'sano' : status;
    const newFaces = status === 'sano' ? emptyFaces() : currentTooth.faces;
    setTooth(toothNumber, { ...currentTooth, status: newStatus, faces: newFaces });
  };

  const setToothMobility = (toothNumber, mobility) => {
    const currentTooth = odontogram[toothNumber] || defaultTooth();
    setTooth(toothNumber, { ...currentTooth, mobility: Number(mobility) });
  };

  const setToothNotes = (toothNumber, notes) => {
    const currentTooth = odontogram[toothNumber] || defaultTooth();
    setTooth(toothNumber, { ...currentTooth, notes });
  };

  const resetTooth = (toothNumber) => {
    const next = { ...odontogram };
    delete next[toothNumber];
    update(next);
  };

  const clearAll = () => {
    if (window.confirm('¿Borrar todos los hallazgos del odontograma?')) {
      update({});
      setSelectedTooth(null);
    }
  };

  const getFaceColor = (toothNumber, face) => {
    const tooth = odontogram[toothNumber];
    const conditionId = tooth?.faces?.[face] || 'sano';
    const cond = CONDITIONS.find(c => c.id === conditionId);
    return cond ? cond.color : '#ffffff';
  };

  const renderTooth = (num) => {
    const tooth = odontogram[num] || {};
    const isMissing = tooth.status === 'missing';
    const isExtraction = tooth.status === 'extraction';
    const isImplant = tooth.status === 'implant';
    const isSelected = selectedTooth === num;
    const hasMobility = tooth.mobility > 0;

    return (
      <div key={num} className="flex flex-col items-center gap-1 group">
        <span className="text-[10px] font-extrabold text-slate-700">{num}</span>

        <div
          className={`relative w-8 h-8 cursor-pointer rounded-md ${isSelected ? 'ring-2 ring-slate-900 ring-offset-1' : ''}`}
          onClick={() => setSelectedTooth(isSelected ? null : num)}
        >
          <svg viewBox="0 0 40 40" className="w-full h-full drop-shadow-2xs">
            <polygon
              points="0,0 40,0 30,10 10,10"
              fill={getFaceColor(num, 'vestibular')}
              stroke="#94a3b8"
              strokeWidth="1.2"
              onClick={(e) => { e.stopPropagation(); handleFaceClick(num, 'vestibular'); }}
              className="hover:opacity-80 transition-opacity"
            />
            <polygon
              points="40,0 40,40 30,30 30,10"
              fill={getFaceColor(num, 'distal')}
              stroke="#94a3b8"
              strokeWidth="1.2"
              onClick={(e) => { e.stopPropagation(); handleFaceClick(num, 'distal'); }}
              className="hover:opacity-80 transition-opacity"
            />
            <polygon
              points="40,40 0,40 10,30 30,30"
              fill={getFaceColor(num, 'lingual')}
              stroke="#94a3b8"
              strokeWidth="1.2"
              onClick={(e) => { e.stopPropagation(); handleFaceClick(num, 'lingual'); }}
              className="hover:opacity-80 transition-opacity"
            />
            <polygon
              points="0,40 0,0 10,10 10,30"
              fill={getFaceColor(num, 'mesial')}
              stroke="#94a3b8"
              strokeWidth="1.2"
              onClick={(e) => { e.stopPropagation(); handleFaceClick(num, 'mesial'); }}
              className="hover:opacity-80 transition-opacity"
            />
            <rect
              x="10"
              y="10"
              width="20"
              height="20"
              fill={getFaceColor(num, 'oclusal')}
              stroke="#94a3b8"
              strokeWidth="1.2"
              onClick={(e) => { e.stopPropagation(); handleFaceClick(num, 'oclusal'); }}
              className="hover:opacity-80 transition-opacity"
            />

            {isExtraction && <line x1="2" y1="2" x2="38" y2="38" stroke="#dc2626" strokeWidth="3.5" />}
            {isMissing && (
              <>
                <line x1="2" y1="2" x2="38" y2="38" stroke="#64748b" strokeWidth="2.5" />
                <line x1="38" y1="2" x2="2" y2="38" stroke="#64748b" strokeWidth="2.5" />
              </>
            )}
            {isImplant && <circle cx="20" cy="20" r="7" fill="#8b5cf6" stroke="#ffffff" strokeWidth="1.5" />}
          </svg>

          {hasMobility && (
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-amber-500 text-white text-[8px] font-black flex items-center justify-center">
              {tooth.mobility}
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={() => handleToothStatusClick(num, selectedCondition)}
          className="text-[9px] px-1 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold w-full truncate"
          title="Aplicar condición a toda la pieza"
        >
          {tooth.status && tooth.status !== 'sano' ? tooth.status.substring(0, 6) : 'Pieza'}
        </button>
      </div>
    );
  };

  const upperTeeth = dentition === 'primary' ? UPPER_TEETH_PRIMARY : UPPER_TEETH;
  const lowerTeeth = dentition === 'primary' ? LOWER_TEETH_PRIMARY : LOWER_TEETH;
  const activeTooth = selectedTooth != null ? (odontogram[selectedTooth] || defaultTooth()) : null;

  return (
    <div className="space-y-4">
      {/* Dentition selector + clear */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-600">Dentición:</span>
          <div className="flex bg-white rounded-lg border border-slate-200 p-0.5">
            {DENTITIONS.map(d => (
              <button
                key={d.id}
                type="button"
                onClick={() => update(odontogram, { dentition: d.id })}
                className={`px-2.5 py-1 text-[11px] font-bold rounded-md transition-colors ${
                  dentition === d.id ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>
        <button
          type="button"
          onClick={clearAll}
          className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Limpiar odontograma</span>
        </button>
      </div>

      {/* Condition palette */}
      <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs space-y-2">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
          Herramienta activa (clic en las caras para pintar)
        </span>
        <div className="flex flex-wrap gap-1.5">
          {CONDITIONS.map(cond => {
            const isSelected = selectedCondition === cond.id;
            return (
              <button
                key={cond.id}
                type="button"
                onClick={() => setSelectedCondition(cond.id)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                  isSelected ? 'ring-2 ring-slate-900 shadow-xs' : 'opacity-80 hover:opacity-100'
                }`}
                style={{ backgroundColor: cond.color, color: cond.textColor, border: `1px solid ${cond.border}` }}
              >
                <span className="w-2.5 h-2.5 rounded-full border border-slate-400" style={{ backgroundColor: cond.color }} />
                <span>{cond.label}</span>
                {isSelected && <Check className="w-3.5 h-3.5 ml-0.5" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Charts */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-4 overflow-x-auto">
        <div>
          <div className="flex items-center justify-between text-xs font-bold text-slate-400 mb-2 border-b border-slate-100 pb-1">
            <span>Arcada Superior Derecha (Q1)</span>
            <span className="text-slate-600 uppercase font-black text-[10px]">Maxilar Superior</span>
            <span>Arcada Superior Izquierda (Q2)</span>
          </div>
          <div className="flex items-center justify-center gap-1.5 sm:gap-2">
            {upperTeeth.map(renderTooth)}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between text-xs font-bold text-slate-400 mb-2 border-b border-slate-100 pb-1">
            <span>Arcada Inferior Derecha (Q4)</span>
            <span className="text-slate-600 uppercase font-black text-[10px]">Mandíbula Inferior</span>
            <span>Arcada Inferior Izquierda (Q3)</span>
          </div>
          <div className="flex items-center justify-center gap-1.5 sm:gap-2">
            {lowerTeeth.map(renderTooth)}
          </div>
        </div>
      </div>

      {/* Selected tooth detail */}
      {selectedTooth != null && activeTooth && (
        <div className="bg-slate-900 text-white p-3.5 rounded-xl space-y-3 animate-in fade-in duration-150">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider">
              Pieza {selectedTooth} — Detalle
            </span>
            <button
              type="button"
              onClick={() => resetTooth(selectedTooth)}
              className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-300 hover:text-rose-300"
            >
              <Trash2 className="w-3 h-3" />
              <span>Reiniciar pieza</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Movilidad (Miller)</label>
              <select
                value={activeTooth.mobility || 0}
                onChange={(e) => setToothMobility(selectedTooth, e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs bg-slate-800 border border-slate-700 rounded-lg text-white font-semibold outline-none"
              >
                {MOBILITY_GRADES.map(g => (
                  <option key={g.value} value={g.value}>{g.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Hallazgo general</label>
              <div className="px-2.5 py-1.5 text-xs bg-slate-800 border border-slate-700 rounded-lg font-semibold capitalize">
                {activeTooth.status || 'sano'}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Observaciones de la pieza</label>
            <input
              type="text"
              placeholder="Ej. Sensibilidad a frío, restauración desadaptada..."
              value={activeTooth.notes || ''}
              onChange={(e) => setToothNotes(selectedTooth, e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs bg-slate-800 border border-slate-700 rounded-lg text-white outline-none placeholder-slate-500"
            />
          </div>
        </div>
      )}

      {/* Periodontal notes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-[11px] font-bold text-slate-700 mb-1">Salud Periodontal / Índice de Placa</label>
          <input
            type="text"
            placeholder="Ej. Gingivitis marginal moderada en sector anterior"
            value={data.periodontalHealth || ''}
            onChange={(e) => onChange({ ...data, periodontalHealth: e.target.value, dentition, odontogram })}
            className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-slate-900/10"
          />
        </div>
        <div>
          <label className="block text-[11px] font-bold text-slate-700 mb-1">Observaciones Oclusales / Ortodoncia</label>
          <input
            type="text"
            placeholder="Ej. Clase I de Angle, mordida profunda 2mm..."
            value={data.occlusionNotes || ''}
            onChange={(e) => onChange({ ...data, occlusionNotes: e.target.value, dentition, odontogram })}
            className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-slate-900/10"
          />
        </div>
      </div>

      <p className="flex items-center gap-1.5 text-[11px] text-slate-400">
        <Info className="w-3.5 h-3.5" />
        Clic en una cara dental para pintarla con la herramienta activa. Clic en el centro de la pieza para ver detalles.
      </p>
    </div>
  );
}
