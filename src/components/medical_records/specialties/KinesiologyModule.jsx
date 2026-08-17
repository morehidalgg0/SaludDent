import React, { useState } from 'react';
import { Activity, Flame, Shield, Check, Plus, Trash2 } from 'lucide-react';

const BODY_ZONES = [
  { id: 'neck', name: 'Columna Cervical / Cuello', category: 'Columna' },
  { id: 'shoulder_r', name: 'Hombro Derecho', category: 'Miembro Superior' },
  { id: 'shoulder_l', name: 'Hombro Izquierdo', category: 'Miembro Superior' },
  { id: 'elbow_r', name: 'Codo Derecho', category: 'Miembro Superior' },
  { id: 'elbow_l', name: 'Codo Izquierdo', category: 'Miembro Superior' },
  { id: 'wrist_r', name: 'Muñeca / Mano Derecha', category: 'Miembro Superior' },
  { id: 'wrist_l', name: 'Muñeca / Mano Izquierda', category: 'Miembro Superior' },
  { id: 'dorsal', name: 'Columna Dorsal', category: 'Columna' },
  { id: 'lumbar', name: 'Columna Lumbar / Sacro', category: 'Columna' },
  { id: 'hip_r', name: 'Cadera / Glúteo Derecho', category: 'Miembro Inferior' },
  { id: 'hip_l', name: 'Cadera / Glúteo Izquierdo', category: 'Miembro Inferior' },
  { id: 'thigh_r', name: 'Cuádriceps / Isquiotibial Derecho', category: 'Miembro Inferior' },
  { id: 'thigh_l', name: 'Cuádriceps / Isquiotibial Izquierdo', category: 'Miembro Inferior' },
  { id: 'knee_r', name: 'Rodilla Derecha', category: 'Miembro Inferior' },
  { id: 'knee_l', name: 'Rodilla Izquierda', category: 'Miembro Inferior' },
  { id: 'calf_r', name: 'Gemelo / Aquiles Derecho', category: 'Miembro Inferior' },
  { id: 'calf_l', name: 'Gemelo / Aquiles Izquierdo', category: 'Miembro Inferior' },
  { id: 'ankle_r', name: 'Tobillo / Pie Derecho', category: 'Miembro Inferior' },
  { id: 'ankle_l', name: 'Tobillo / Pie Izquierdo', category: 'Miembro Inferior' }
];

export function KinesiologyModule({ data = {}, onChange }) {
  const painEva = data.painLevelEva !== undefined ? data.painLevelEva : 5;
  const affectedZones = data.affectedZones || [];
  const rangeOfMotion = data.rangeOfMotion || {};
  const rehabGoals = data.rehabGoals || '';

  const handleEvaChange = (val) => {
    onChange({ ...data, painLevelEva: Number(val) });
  };

  const toggleZone = (zone) => {
    const exists = affectedZones.find(z => z.id === zone.id);
    let newZones;
    if (exists) {
      newZones = affectedZones.filter(z => z.id !== zone.id);
    } else {
      newZones = [...affectedZones, { id: zone.id, label: zone.name, painScore: painEva, severity: painEva > 7 ? 'Severa' : painEva > 4 ? 'Moderada' : 'Leve' }];
    }
    onChange({ ...data, affectedZones: newZones });
  };

  const getEvaColor = (score) => {
    if (score <= 3) return 'text-emerald-600 bg-emerald-100 border-emerald-300';
    if (score <= 6) return 'text-amber-600 bg-amber-100 border-amber-300';
    return 'text-rose-600 bg-rose-100 border-rose-300';
  };

  return (
    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-4">
      
      <div>
        <h4 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
          <span>🏃 Evaluación Kinesiológica & Mapa Anatómico de Dolor</span>
        </h4>
        <p className="text-xs text-slate-500">
          Seleccione las regiones corporales comprometidas, evalúe la escala de dolor EVA y registre el protocolo de rehabilitación.
        </p>
      </div>

      {/* EVA Pain Scale Slider */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Escala Visual Análoga de Dolor (EVA 1 - 10)
          </label>
          <span className={`px-3 py-1 rounded-full text-xs font-black border ${getEvaColor(painEva)}`}>
            {painEva} / 10 — {painEva === 0 ? 'Sin dolor' : painEva <= 3 ? 'Dolor Leve' : painEva <= 6 ? 'Dolor Moderado' : painEva <= 8 ? 'Dolor Severo' : 'Dolor Máximo / Incapacitante'}
          </span>
        </div>

        <input
          type="range"
          min="0"
          max="10"
          step="1"
          value={painEva}
          onChange={(e) => handleEvaChange(e.target.value)}
          className="w-full h-2 bg-gradient-to-r from-emerald-400 via-amber-400 to-rose-600 rounded-lg appearance-none cursor-pointer"
        />

        <div className="flex justify-between text-[10px] text-slate-400 font-bold px-1">
          <span>0 (Sin Dolor)</span>
          <span>5 (Moderado)</span>
          <span>10 (Incapacitante)</span>
        </div>
      </div>

      {/* Anatomical Regions Selector */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Mapa de Regiones Anatómicas Afectadas ({affectedZones.length} seleccionadas)
          </label>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {BODY_ZONES.map(zone => {
            const isSelected = affectedZones.some(z => z.id === zone.id);
            return (
              <button
                key={zone.id}
                type="button"
                onClick={() => toggleZone(zone)}
                className={`p-2 rounded-xl text-xs font-semibold text-left transition-all border flex items-center justify-between ${
                  isSelected
                    ? 'bg-rose-50 border-rose-400 text-rose-900 ring-1 ring-rose-300 font-bold'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span className="truncate">{zone.name}</span>
                {isSelected && <span className="w-2 h-2 rounded-full bg-rose-600 shrink-0"></span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Range of Motion & Biomechanical Analysis */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-2">
          <label className="block text-xs font-bold text-slate-700">Rango de Movilidad Articular (ROM)</label>
          <input
            type="text"
            placeholder="Ej. Flexión limitada a 70° con tope blando doloroso"
            value={rangeOfMotion.notes || ''}
            onChange={(e) => onChange({ ...data, rangeOfMotion: { ...rangeOfMotion, notes: e.target.value } })}
            className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg outline-hidden focus:ring-2 focus:ring-brand-500/20"
          />
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-2">
          <label className="block text-xs font-bold text-slate-700">Objetivos y Pauta Terapéutica</label>
          <input
            type="text"
            placeholder="Ej. 1. Reducción de inflamación. 2. Fortalecimiento excéntrico."
            value={rehabGoals}
            onChange={(e) => onChange({ ...data, rehabGoals: e.target.value })}
            className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg outline-hidden focus:ring-2 focus:ring-brand-500/20"
          />
        </div>
      </div>

    </div>
  );
}
