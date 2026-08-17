import React, { useState } from 'react';
import { Sparkles, Info, ShieldCheck, Check } from 'lucide-react';

const CONDITIONS = [
  { id: 'sano', label: 'Sano / Normal', color: '#ffffff', textColor: '#0f172a', border: '#cbd5e1' },
  { id: 'caries', label: 'Caries Activa', color: '#ef4444', textColor: '#ffffff', border: '#b91c1c' },
  { id: 'restoration', label: 'Resina / Obturación', color: '#0284c7', textColor: '#ffffff', border: '#0369a1' },
  { id: 'crown', label: 'Corona / Prótesis', color: '#f59e0b', textColor: '#ffffff', border: '#d97706' },
  { id: 'endodontics', label: 'Endodoncia (Conducto)', color: '#10b981', textColor: '#ffffff', border: '#047857' },
  { id: 'extraction', label: 'Indicación Extracción', color: '#dc2626', textColor: '#ffffff', border: '#991b1b', isCross: true },
  { id: 'missing', label: 'Pieza Ausente', color: '#64748b', textColor: '#ffffff', border: '#475569', isMissing: true },
  { id: 'implant', label: 'Implante', color: '#8b5cf6', textColor: '#ffffff', border: '#6d28d9' }
];

// 32 Permanent Teeth numbers (FDI System)
const UPPER_TEETH = [18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28];
const LOWER_TEETH = [48, 47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37, 38];

export function OdontologyModule({ data = {}, onChange }) {
  const [selectedCondition, setSelectedCondition] = useState('caries');
  const odontogram = data.odontogram || {};

  const handleFaceClick = (toothNumber, face) => {
    const currentTooth = odontogram[toothNumber] || {
      status: 'sano',
      faces: { oclusal: 'sano', vestibular: 'sano', lingual: 'sano', mesial: 'sano', distal: 'sano' }
    };

    const newFaces = {
      ...currentTooth.faces,
      [face]: currentTooth.faces?.[face] === selectedCondition ? 'sano' : selectedCondition
    };

    // Determine overall tooth status
    const hasCaries = Object.values(newFaces).includes('caries');
    const hasRestoration = Object.values(newFaces).includes('restoration');
    const overallStatus = hasCaries ? 'caries' : hasRestoration ? 'restoration' : selectedCondition;

    const newOdontogram = {
      ...odontogram,
      [toothNumber]: {
        ...currentTooth,
        status: overallStatus,
        faces: newFaces
      }
    };

    onChange({
      ...data,
      odontogram: newOdontogram
    });
  };

  const handleToothStatusClick = (toothNumber, status) => {
    const currentTooth = odontogram[toothNumber] || {
      status: 'sano',
      faces: { oclusal: 'sano', vestibular: 'sano', lingual: 'sano', mesial: 'sano', distal: 'sano' }
    };

    const newStatus = currentTooth.status === status ? 'sano' : status;
    const newFaces = status === 'sano' ? { oclusal: 'sano', vestibular: 'sano', lingual: 'sano', mesial: 'sano', distal: 'sano' } : currentTooth.faces;

    const newOdontogram = {
      ...odontogram,
      [toothNumber]: {
        ...currentTooth,
        status: newStatus,
        faces: newFaces
      }
    };

    onChange({
      ...data,
      odontogram: newOdontogram
    });
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

    return (
      <div key={num} className="flex flex-col items-center gap-1 group">
        <span className="text-[10px] font-extrabold text-slate-700">{num}</span>
        
        {/* 2D Tooth SVG with 5 faces */}
        <div className="relative w-8 h-8 cursor-pointer">
          <svg viewBox="0 0 40 40" className="w-full h-full drop-shadow-2xs">
            {/* Top / Vestibular */}
            <polygon
              points="0,0 40,0 30,10 10,10"
              fill={getFaceColor(num, 'vestibular')}
              stroke="#94a3b8"
              strokeWidth="1.2"
              onClick={() => handleFaceClick(num, 'vestibular')}
              className="hover:opacity-80 transition-opacity"
            />
            {/* Right / Distal */}
            <polygon
              points="40,0 40,40 30,30 30,10"
              fill={getFaceColor(num, 'distal')}
              stroke="#94a3b8"
              strokeWidth="1.2"
              onClick={() => handleFaceClick(num, 'distal')}
              className="hover:opacity-80 transition-opacity"
            />
            {/* Bottom / Lingual */}
            <polygon
              points="40,40 0,40 10,30 30,30"
              fill={getFaceColor(num, 'lingual')}
              stroke="#94a3b8"
              strokeWidth="1.2"
              onClick={() => handleFaceClick(num, 'lingual')}
              className="hover:opacity-80 transition-opacity"
            />
            {/* Left / Mesial */}
            <polygon
              points="0,40 0,0 10,10 10,30"
              fill={getFaceColor(num, 'mesial')}
              stroke="#94a3b8"
              strokeWidth="1.2"
              onClick={() => handleFaceClick(num, 'mesial')}
              className="hover:opacity-80 transition-opacity"
            />
            {/* Center / Oclusal */}
            <rect
              x="10"
              y="10"
              width="20"
              height="20"
              fill={getFaceColor(num, 'oclusal')}
              stroke="#94a3b8"
              strokeWidth="1.2"
              onClick={() => handleFaceClick(num, 'oclusal')}
              className="hover:opacity-80 transition-opacity"
            />

            {/* Special Overlays */}
            {isExtraction && (
              <line x1="2" y1="2" x2="38" y2="38" stroke="#dc2626" strokeWidth="3.5" />
            )}
            {isMissing && (
              <>
                <line x1="2" y1="2" x2="38" y2="38" stroke="#64748b" strokeWidth="2.5" />
                <line x1="38" y1="2" x2="2" y2="38" stroke="#64748b" strokeWidth="2.5" />
              </>
            )}
            {isImplant && (
              <circle cx="20" cy="20" r="7" fill="#8b5cf6" stroke="#ffffff" strokeWidth="1.5" />
            )}
          </svg>
        </div>

        {/* Quick Tooth Action Dropdown / status button */}
        <button
          type="button"
          onClick={() => handleToothStatusClick(num, selectedCondition)}
          className="text-[9px] px-1 py-0.2 rounded bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold"
          title="Aplicar condición a toda la pieza"
        >
          {tooth.status && tooth.status !== 'sano' ? tooth.status.substring(0, 4) : 'Pieza'}
        </button>
      </div>
    );
  };

  return (
    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-4">
      
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
            <span>🦷 Odontograma Interactivo Digital (Sistema FDI)</span>
          </h4>
          <p className="text-xs text-slate-500">
            Haga clic en las caras dentales (Oclusal, Vestibular, Lingual, Mesial, Distal) para registrar hallazgos.
          </p>
        </div>
      </div>

      {/* Conditions Tool Palette */}
      <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs space-y-2">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
          Herramienta Activa (Seleccione para pintar caras)
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
                  isSelected
                    ? 'ring-2 ring-brand-500 shadow-xs'
                    : 'opacity-80 hover:opacity-100'
                }`}
                style={{
                  backgroundColor: cond.color,
                  color: cond.textColor,
                  border: `1px solid ${cond.border}`
                }}
              >
                <span className="w-2.5 h-2.5 rounded-full border border-slate-400" style={{ backgroundColor: cond.color }}></span>
                <span>{cond.label}</span>
                {isSelected && <Check className="w-3.5 h-3.5 ml-0.5" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Interactive Odontogram Grid */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-4 overflow-x-auto">
        
        {/* Upper Arch (Maxilar Superior) */}
        <div>
          <div className="flex items-center justify-between text-xs font-bold text-slate-400 mb-2 border-b border-slate-100 pb-1">
            <span>Arcada Superior Derecha (Q1)</span>
            <span className="text-slate-600 uppercase font-black text-[10px]">Maxilar Superior</span>
            <span>Arcada Superior Izquierda (Q2)</span>
          </div>
          <div className="flex items-center justify-center gap-1.5 sm:gap-2">
            {UPPER_TEETH.map(renderTooth)}
          </div>
        </div>

        {/* Lower Arch (Mandíbula Inferior) */}
        <div>
          <div className="flex items-center justify-between text-xs font-bold text-slate-400 mb-2 border-b border-slate-100 pb-1">
            <span>Arcada Inferior Derecha (Q4)</span>
            <span className="text-slate-600 uppercase font-black text-[10px]">Mandíbula Inferior</span>
            <span>Arcada Inferior Izquierda (Q3)</span>
          </div>
          <div className="flex items-center justify-center gap-1.5 sm:gap-2">
            {LOWER_TEETH.map(renderTooth)}
          </div>
        </div>

      </div>

      {/* Periodontal & Dental Notes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-[11px] font-bold text-slate-700 mb-1">Salud Periodontal / Índice de Placa</label>
          <input
            type="text"
            placeholder="Ej. Gingivitis marginal moderada en sector anterior"
            value={data.periodontalHealth || ''}
            onChange={(e) => onChange({ ...data, periodontalHealth: e.target.value })}
            className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg outline-hidden focus:ring-2 focus:ring-brand-500/20"
          />
        </div>
        <div>
          <label className="block text-[11px] font-bold text-slate-700 mb-1">Observaciones Oclusales / Ortodoncia</label>
          <input
            type="text"
            placeholder="Ej. Clase I de Angle, mordida profunda 2mm..."
            value={data.occlusionNotes || ''}
            onChange={(e) => onChange({ ...data, occlusionNotes: e.target.value })}
            className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg outline-hidden focus:ring-2 focus:ring-brand-500/20"
          />
        </div>
      </div>

    </div>
  );
}
