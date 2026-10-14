import React, { useState } from 'react';
import { Info, Trash2, Droplet } from 'lucide-react';
import {
  UPPER_TEETH,
  LOWER_TEETH,
  UPPER_TEETH_PRIMARY,
  LOWER_TEETH_PRIMARY,
  POCKET_SITES,
  MOBILITY_GRADES,
  FURCATION_GRADES
} from './constants.js';

const emptySites = () => POCKET_SITES.reduce((acc, s) => ({ ...acc, [s.id]: '' }), {});

const defaultToothPerio = () => ({
  depth: emptySites(),
  bleeding: emptySites(),
  plaque: emptySites(),
  recession: emptySites(),
  furcation: 0,
  mobility: 0,
  notes: ''
});

// Color según profundidad de sondaje
const depthColor = (value) => {
  const v = Number(value);
  if (!v) return { bg: '#ffffff', text: '#334155', border: '#e2e8f0' };
  if (v <= 3) return { bg: '#ecfdf5', text: '#065f46', border: '#a7f3d0' };
  if (v <= 5) return { bg: '#fefce8', text: '#854d0e', border: '#fde047' };
  return { bg: '#fef2f2', text: '#991b1b', border: '#fecaca' };
};

export function PeriodontogramChart({ data = {}, onChange }) {
  const [selectedTooth, setSelectedTooth] = useState(null);
  const dentition = data.dentition || 'permanent';
  const perio = data.periodontogram || {};

  const update = (newPerio) => onChange({ ...data, periodontogram: newPerio });

  const setTooth = (num, patch) => {
    const current = perio[num] || defaultToothPerio();
    update({ ...perio, [num]: { ...current, ...patch } });
  };

  const setSite = (num, field, site, value) => {
    const current = perio[num] || defaultToothPerio();
    const nextField = { ...(current[field] || {}), [site]: value };
    setTooth(num, { [field]: nextField });
  };

  const toggleSite = (num, field, site) => {
    const current = perio[num] || defaultToothPerio();
    const nextField = { ...(current[field] || {}), [site]: !current[field]?.[site] };
    setTooth(num, { [field]: nextField });
  };

  const resetTooth = (num) => {
    const next = { ...perio };
    delete next[num];
    update(next);
  };

  const clearAll = () => {
    if (window.confirm('¿Borrar todo el periodontograma?')) {
      update({});
      setSelectedTooth(null);
    }
  };

  const maxDepth = (num) => {
    const t = perio[num];
    if (!t?.depth) return 0;
    return Math.max(0, ...Object.values(t.depth).map(v => Number(v) || 0));
  };

  const renderTooth = (num) => {
    const t = perio[num];
    const max = maxDepth(num);
    const c = depthColor(max);
    const isSelected = selectedTooth === num;
    const hasBleeding = t?.bleeding && Object.values(t.bleeding).some(Boolean);

    return (
      <button
        type="button"
        key={num}
        onClick={() => setSelectedTooth(isSelected ? null : num)}
        className={`flex flex-col items-center gap-0.5 rounded-md px-1 py-1 transition-all ${
          isSelected ? 'ring-2 ring-slate-900 ring-offset-1' : 'hover:bg-slate-50'
        }`}
      >
        <span className="text-[10px] font-extrabold text-slate-700">{num}</span>
        <span
          className="w-7 h-7 rounded-md border flex items-center justify-center text-xs font-black"
          style={{ backgroundColor: c.bg, color: c.text, borderColor: c.border }}
        >
          {max || '·'}
        </span>
        {hasBleeding && <Droplet className="w-2.5 h-2.5 text-rose-500 -mt-0.5" fill="#f43f5e" />}
      </button>
    );
  };

  const upperTeeth = dentition === 'primary' ? UPPER_TEETH_PRIMARY : UPPER_TEETH;
  const lowerTeeth = dentition === 'primary' ? LOWER_TEETH_PRIMARY : LOWER_TEETH;
  const activeTooth = selectedTooth != null ? (perio[selectedTooth] || defaultToothPerio()) : null;
  const filledCount = Object.keys(perio).length;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs text-slate-500">
          Registre profundidad de sondaje (mm), sangrado al sondaje, placa, recesión, furca y movilidad.
        </p>
        <button
          type="button"
          onClick={clearAll}
          className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Limpiar periodontograma</span>
        </button>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-3 text-[10px] font-semibold text-slate-500 bg-white p-2.5 rounded-xl border border-slate-200">
        <span className="uppercase tracking-wider text-slate-400">Profundidad:</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded border border-emerald-200 bg-emerald-50" /> 1-3 mm</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded border border-yellow-300 bg-yellow-50" /> 4-5 mm</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded border border-red-200 bg-red-50" /> &gt; 5 mm</span>
        <span className="flex items-center gap-1"><Droplet className="w-3 h-3 text-rose-500" fill="#f43f5e" /> Sangrado</span>
      </div>

      {/* Arch overview */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-4 overflow-x-auto">
        <div>
          <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 mb-2 border-b border-slate-100 pb-1 uppercase tracking-wider">
            <span>Maxilar Superior</span>
            <span>Profundidad máx. (mm)</span>
          </div>
          <div className="flex items-center justify-center gap-1 sm:gap-1.5">
            {upperTeeth.map(renderTooth)}
          </div>
        </div>
        <div>
          <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 mb-2 border-b border-slate-100 pb-1 uppercase tracking-wider">
            <span>Mandíbula Inferior</span>
            <span>Profundidad máx. (mm)</span>
          </div>
          <div className="flex items-center justify-center gap-1 sm:gap-1.5">
            {lowerTeeth.map(renderTooth)}
          </div>
        </div>
      </div>

      {/* Detail editor */}
      {selectedTooth != null && activeTooth ? (
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-black text-slate-900">Pieza {selectedTooth} — Sondaje periodontal</h4>
            <button
              type="button"
              onClick={() => resetTooth(selectedTooth)}
              className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-500 hover:text-rose-600"
            >
              <Trash2 className="w-3 h-3" />
              <span>Reiniciar pieza</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Vestibular */}
            <div className="bg-white rounded-xl border border-slate-200 p-3 space-y-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Vestibular</span>
              <div className="grid grid-cols-3 gap-2">
                {[POCKET_SITES[0], POCKET_SITES[1], POCKET_SITES[2]].map(site => (
                  <div key={site.id} className="space-y-1">
                    <label className="block text-[10px] font-bold text-slate-500" title={site.full}>{site.label}</label>
                    <input
                      type="number"
                      min="0"
                      max="15"
                      placeholder="mm"
                      value={activeTooth.depth?.[site.id] || ''}
                      onChange={(e) => setSite(selectedTooth, 'depth', site.id, e.target.value)}
                      className="w-full px-1.5 py-1 text-xs text-center bg-white border border-slate-200 rounded-md font-bold outline-none focus:ring-2 focus:ring-slate-900/10"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Lingual */}
            <div className="bg-white rounded-xl border border-slate-200 p-3 space-y-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Lingual / Palatino</span>
              <div className="grid grid-cols-3 gap-2">
                {[POCKET_SITES[3], POCKET_SITES[4], POCKET_SITES[5]].map(site => (
                  <div key={site.id} className="space-y-1">
                    <label className="block text-[10px] font-bold text-slate-500" title={site.full}>{site.label}</label>
                    <input
                      type="number"
                      min="0"
                      max="15"
                      placeholder="mm"
                      value={activeTooth.depth?.[site.id] || ''}
                      onChange={(e) => setSite(selectedTooth, 'depth', site.id, e.target.value)}
                      className="w-full px-1.5 py-1 text-xs text-center bg-white border border-slate-200 rounded-md font-bold outline-none focus:ring-2 focus:ring-slate-900/10"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bleeding & plaque per site */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="bg-white rounded-xl border border-slate-200 p-3 space-y-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-rose-500">Sangrado al sondaje (BoP)</span>
              <div className="flex items-center justify-center gap-2">
                {POCKET_SITES.map(site => {
                  const active = activeTooth.bleeding?.[site.id];
                  return (
                    <button
                      key={site.id}
                      type="button"
                      onClick={() => toggleSite(selectedTooth, 'bleeding', site.id)}
                      className={`w-8 h-8 rounded-md text-[10px] font-black border transition-colors ${
                        active ? 'bg-rose-500 text-white border-rose-600' : 'bg-white text-slate-500 border-slate-200'
                      }`}
                      title={site.full}
                    >
                      {site.label}
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-3 space-y-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-600">Placa bacteriana</span>
              <div className="flex items-center justify-center gap-2">
                {POCKET_SITES.map(site => {
                  const active = activeTooth.plaque?.[site.id];
                  return (
                    <button
                      key={site.id}
                      type="button"
                      onClick={() => toggleSite(selectedTooth, 'plaque', site.id)}
                      className={`w-8 h-8 rounded-md text-[10px] font-black border transition-colors ${
                        active ? 'bg-amber-500 text-white border-amber-600' : 'bg-white text-slate-500 border-slate-200'
                      }`}
                      title={site.full}
                    >
                      {site.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Recession */}
          <div className="bg-white rounded-xl border border-slate-200 p-3 space-y-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Recesión gingival (mm)</span>
            <div className="grid grid-cols-6 gap-2">
              {POCKET_SITES.map(site => (
                <div key={site.id} className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-500 text-center" title={site.full}>{site.label}</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="-"
                    value={activeTooth.recession?.[site.id] ?? ''}
                    onChange={(e) => setSite(selectedTooth, 'recession', site.id, e.target.value)}
                    className="w-full px-1 py-1 text-xs text-center bg-white border border-slate-200 rounded-md font-semibold outline-none focus:ring-2 focus:ring-slate-900/10"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Furcation & mobility */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Compromiso de furca</label>
              <select
                value={activeTooth.furcation || 0}
                onChange={(e) => setTooth(selectedTooth, { furcation: Number(e.target.value) })}
                className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg font-semibold outline-none"
              >
                {FURCATION_GRADES.map(g => <option key={g.value} value={g.value}>{g.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Movilidad (Miller)</label>
              <select
                value={activeTooth.mobility || 0}
                onChange={(e) => setTooth(selectedTooth, { mobility: Number(e.target.value) })}
                className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg font-semibold outline-none"
              >
                {MOBILITY_GRADES.map(g => <option key={g.value} value={g.value}>{g.label}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">Observaciones periodontales</label>
            <input
              type="text"
              placeholder="Ej. Bolsa periodontal de 6mm en MV, supuración, cálculo subgingival..."
              value={activeTooth.notes || ''}
              onChange={(e) => setTooth(selectedTooth, { notes: e.target.value })}
              className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg outline-none"
            />
          </div>
        </div>
      ) : (
        <p className="flex items-center gap-1.5 text-[11px] text-slate-400">
          <Info className="w-3.5 h-3.5" />
          Seleccione una pieza para registrar el sondaje periodontal.
        </p>
      )}

      {filledCount > 0 && (
        <p className="text-[11px] text-slate-400">
          {filledCount} pieza(s) con registro periodontal en este estudio.
        </p>
      )}
    </div>
  );
}
