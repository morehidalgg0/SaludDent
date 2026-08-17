import React from 'react';
import { OdontologyModule } from './OdontologyModule.jsx';
import { KinesiologyModule } from './KinesiologyModule.jsx';
import { NutritionModule } from './NutritionModule.jsx';
import { Eye, Brain, Baby, HeartPulse, CheckSquare } from 'lucide-react';

export function SpecialtyDynamicModule({ specialtySlug, data = {}, onChange }) {
  // Normalize slug
  const slug = (specialtySlug || '').toLowerCase();

  if (slug.includes('odonto')) {
    return <OdontologyModule data={data} onChange={onChange} />;
  }

  if (slug.includes('kinesio') || slug.includes('fisio')) {
    return <KinesiologyModule data={data} onChange={onChange} />;
  }

  if (slug.includes('nutri')) {
    return <NutritionModule data={data} onChange={onChange} />;
  }

  if (slug.includes('oftalmo')) {
    return <OphthalmologyModule data={data} onChange={onChange} />;
  }

  if (slug.includes('psico')) {
    return <PsychologyModule data={data} onChange={onChange} />;
  }

  if (slug.includes('pedia')) {
    return <PediatricsModule data={data} onChange={onChange} />;
  }

  // Default: General Medicine & Clinical Specialties
  return <GeneralMedicineSpecialtyModule data={data} onChange={onChange} />;
}

// 1. Ophthalmology Module
function OphthalmologyModule({ data = {}, onChange }) {
  const refraction = data.refraction || {
    odSphere: '', odCylinder: '', odAxis: '', odAdd: '', odAcuity: '20/20',
    oiSphere: '', oiCylinder: '', oiAxis: '', oiAdd: '', oiAcuity: '20/20'
  };
  const tonometry = data.tonometry || { odPressure: '14', oiPressure: '15' };

  const updateRefraction = (field, val) => {
    onChange({
      ...data,
      refraction: { ...refraction, [field]: val }
    });
  };

  return (
    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-4">
      <div>
        <h4 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
          <span>👁️ Examen Oftalmológico & Refracción Óptica</span>
        </h4>
        <p className="text-xs text-slate-500">
          Agudeza visual Snellen, prescripción óptica (Esfera, Cilindro, Eje, Adición) y tonometría ocular.
        </p>
      </div>

      {/* Optical Refraction Table */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-3 overflow-x-auto">
        <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
          Prescripción de Lentes / Refracción
        </span>

        <table className="w-full text-xs text-left">
          <thead>
            <tr className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold">
              <th className="p-2">Ojo</th>
              <th className="p-2">Esfera (D)</th>
              <th className="p-2">Cilindro (D)</th>
              <th className="p-2">Eje (°)</th>
              <th className="p-2">Adición (D)</th>
              <th className="p-2">Agudeza (Snellen)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            <tr>
              <td className="p-2 font-extrabold text-brand-700">OD (Ojo Derecho)</td>
              <td className="p-1"><input type="text" placeholder="-1.50" value={refraction.odSphere} onChange={(e) => updateRefraction('odSphere', e.target.value)} className="w-full p-1 bg-slate-50 border rounded text-xs" /></td>
              <td className="p-1"><input type="text" placeholder="-0.75" value={refraction.odCylinder} onChange={(e) => updateRefraction('odCylinder', e.target.value)} className="w-full p-1 bg-slate-50 border rounded text-xs" /></td>
              <td className="p-1"><input type="text" placeholder="90°" value={refraction.odAxis} onChange={(e) => updateRefraction('odAxis', e.target.value)} className="w-full p-1 bg-slate-50 border rounded text-xs" /></td>
              <td className="p-1"><input type="text" placeholder="+1.50" value={refraction.odAdd} onChange={(e) => updateRefraction('odAdd', e.target.value)} className="w-full p-1 bg-slate-50 border rounded text-xs" /></td>
              <td className="p-1"><input type="text" placeholder="20/20" value={refraction.odAcuity} onChange={(e) => updateRefraction('odAcuity', e.target.value)} className="w-full p-1 bg-slate-50 border rounded text-xs font-bold" /></td>
            </tr>
            <tr>
              <td className="p-2 font-extrabold text-cyan-700">OI (Ojo Izquierdo)</td>
              <td className="p-1"><input type="text" placeholder="-1.25" value={refraction.oiSphere} onChange={(e) => updateRefraction('oiSphere', e.target.value)} className="w-full p-1 bg-slate-50 border rounded text-xs" /></td>
              <td className="p-1"><input type="text" placeholder="-0.50" value={refraction.oiCylinder} onChange={(e) => updateRefraction('oiCylinder', e.target.value)} className="w-full p-1 bg-slate-50 border rounded text-xs" /></td>
              <td className="p-1"><input type="text" placeholder="85°" value={refraction.oiAxis} onChange={(e) => updateRefraction('oiAxis', e.target.value)} className="w-full p-1 bg-slate-50 border rounded text-xs" /></td>
              <td className="p-1"><input type="text" placeholder="+1.50" value={refraction.oiAdd} onChange={(e) => updateRefraction('oiAdd', e.target.value)} className="w-full p-1 bg-slate-50 border rounded text-xs" /></td>
              <td className="p-1"><input type="text" placeholder="20/20" value={refraction.oiAcuity} onChange={(e) => updateRefraction('oiAcuity', e.target.value)} className="w-full p-1 bg-slate-50 border rounded text-xs font-bold" /></td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="bg-white p-3 rounded-xl border border-slate-200">
          <label className="block text-xs font-bold text-slate-700 mb-1">Presión Intraocular (Tonometría mmHg)</label>
          <div className="flex gap-2">
            <input type="text" placeholder="OD: 14 mmHg" value={tonometry.odPressure || ''} onChange={(e) => onChange({ ...data, tonometry: { ...tonometry, odPressure: e.target.value } })} className="w-1/2 p-1.5 bg-slate-50 border rounded-lg text-xs" />
            <input type="text" placeholder="OI: 15 mmHg" value={tonometry.oiPressure || ''} onChange={(e) => onChange({ ...data, tonometry: { ...tonometry, oiPressure: e.target.value } })} className="w-1/2 p-1.5 bg-slate-50 border rounded-lg text-xs" />
          </div>
        </div>
        <div className="bg-white p-3 rounded-xl border border-slate-200">
          <label className="block text-xs font-bold text-slate-700 mb-1">Fondo de Ojo / Biomicroscopía</label>
          <input type="text" placeholder="Papila de bordes netos, retina aplicada..." value={data.fundusNotes || ''} onChange={(e) => onChange({ ...data, fundusNotes: e.target.value })} className="w-full p-1.5 bg-slate-50 border rounded-lg text-xs" />
        </div>
      </div>
    </div>
  );
}

// 2. Psychology & Mental Health Module
function PsychologyModule({ data = {}, onChange }) {
  const mentalState = data.mentalState || {
    mood: 'Eutímico', anxietyLevel: 'Leve (GAD-7: 4)', orientation: 'Orientado en tiempo y espacio', sleepQuality: 'Normal'
  };

  return (
    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-4">
      <div>
        <h4 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
          <span>🧠 Registro de Sesión Psicoterapéutica & Examen Mental</span>
        </h4>
        <p className="text-xs text-slate-500">
          Evolución psicológica confidencial, estado afectivo, escalas psicométricas y objetivos terapéuticos.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-white p-4 rounded-xl border border-slate-200">
        <div>
          <label className="block text-[11px] font-bold text-slate-700 mb-1">Estado de Ánimo / Afecto</label>
          <select value={mentalState.mood} onChange={(e) => onChange({ ...data, mentalState: { ...mentalState, mood: e.target.value } })} className="w-full p-1.5 bg-slate-50 border rounded-lg text-xs">
            <option value="Eutímico">Eutímico (Normal)</option>
            <option value="Depresivo">Hipotímico / Depresivo</option>
            <option value="Ansioso / Angustiado">Ansioso / Angustiado</option>
            <option value="Expansivo">Expansivo / Hipertímico</option>
            <option value="Lábil">Lábil / Fluctuante</option>
          </select>
        </div>
        <div>
          <label className="block text-[11px] font-bold text-slate-700 mb-1">Nivel de Ansiedad (GAD-7)</label>
          <select value={mentalState.anxietyLevel} onChange={(e) => onChange({ ...data, mentalState: { ...mentalState, anxietyLevel: e.target.value } })} className="w-full p-1.5 bg-slate-50 border rounded-lg text-xs">
            <option value="Mínimo (0-4)">Mínimo (0-4 pts)</option>
            <option value="Leve (5-9)">Leve (5-9 pts)</option>
            <option value="Moderado (10-14)">Moderado (10-14 pts)</option>
            <option value="Severo (15-21)">Severo (15-21 pts)</option>
          </select>
        </div>
        <div>
          <label className="block text-[11px] font-bold text-slate-700 mb-1">Patrón de Sueño / Descanso</label>
          <input type="text" placeholder="Ej. Insomnio de conciliación leve" value={mentalState.sleepQuality} onChange={(e) => onChange({ ...data, mentalState: { ...mentalState, sleepQuality: e.target.value } })} className="w-full p-1.5 bg-slate-50 border rounded-lg text-xs" />
        </div>
      </div>

      <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-2">
        <label className="block text-xs font-bold text-slate-700">Notas de Evolución Psicológica (Confidencial)</label>
        <textarea rows={3} placeholder="Aspectos trabajados en la sesión, intervenciones cognitivo-conductuales, tareas asignadas para el próximo encuentro..." value={data.confidentialNotes || ''} onChange={(e) => onChange({ ...data, confidentialNotes: e.target.value })} className="w-full p-2 bg-slate-50 border rounded-lg text-xs"></textarea>
      </div>
    </div>
  );
}

// 3. Pediatrics Module
function PediatricsModule({ data = {}, onChange }) {
  const percentiles = data.percentiles || { weightPercentile: 'P50', heightPercentile: 'P60', headCircumferenceCm: '48' };

  return (
    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-4">
      <div>
        <h4 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
          <span>👶 Control Pediátrico & Percentiles OMS</span>
        </h4>
        <p className="text-xs text-slate-500">
          Curvas de crecimiento, percentiles y control del Calendario Nacional de Vacunación.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-white p-4 rounded-xl border border-slate-200">
        <div>
          <label className="block text-[11px] font-bold text-slate-700 mb-1">Percentil Peso/Edad</label>
          <select value={percentiles.weightPercentile} onChange={(e) => onChange({ ...data, percentiles: { ...percentiles, weightPercentile: e.target.value } })} className="w-full p-1.5 bg-slate-50 border rounded-lg text-xs font-bold">
            <option value="< P3">&lt; P3 (Alerta Bajo Peso)</option>
            <option value="P10">P10 - P25</option>
            <option value="P50">P50 (Promedio)</option>
            <option value="P75">P75 - P90</option>
            <option value="> P97">&gt; P97 (Alerta Sobrepeso)</option>
          </select>
        </div>
        <div>
          <label className="block text-[11px] font-bold text-slate-700 mb-1">Percentil Talla/Edad</label>
          <select value={percentiles.heightPercentile} onChange={(e) => onChange({ ...data, percentiles: { ...percentiles, heightPercentile: e.target.value } })} className="w-full p-1.5 bg-slate-50 border rounded-lg text-xs font-bold">
            <option value="< P3">&lt; P3 (Talla Baja)</option>
            <option value="P25">P25</option>
            <option value="P50">P50 (Promedio)</option>
            <option value="P75">P75</option>
            <option value="> P97">&gt; P97 (Talla Alta)</option>
          </select>
        </div>
        <div>
          <label className="block text-[11px] font-bold text-slate-700 mb-1">Perímetro Cefálico (cm)</label>
          <input type="number" step="0.5" placeholder="48" value={percentiles.headCircumferenceCm} onChange={(e) => onChange({ ...data, percentiles: { ...percentiles, headCircumferenceCm: e.target.value } })} className="w-full p-1.5 bg-slate-50 border rounded-lg text-xs font-bold" />
        </div>
      </div>

      <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-1.5">
        <span className="text-xs font-bold text-slate-700 block">Esquema de Vacunación al Día</span>
        <div className="flex items-center gap-4 text-xs text-slate-600">
          <label className="flex items-center gap-1.5 cursor-pointer">
            <input type="checkbox" defaultChecked className="rounded text-brand-600" />
            <span>Vacunas completas para la edad</span>
          </label>
          <label className="flex items-center gap-1.5 cursor-pointer">
            <input type="checkbox" className="rounded text-amber-600" />
            <span>Pendiente refuerzo escolar</span>
          </label>
        </div>
      </div>
    </div>
  );
}

// 4. General Medicine
function GeneralMedicineSpecialtyModule({ data = {}, onChange }) {
  return (
    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
      <h4 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
        <span>🩺 Exploración Clínica General & Riego Cardiovascular</span>
      </h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-white p-3.5 rounded-xl border border-slate-200">
        <div>
          <label className="block text-[11px] font-bold text-slate-700 mb-1">Riesgo Cardiovascular (SCORE / Framingham)</label>
          <input type="text" placeholder="Ej. Bajo (< 3% a 10 años)" value={data.cardiovascularRisk || ''} onChange={(e) => onChange({ ...data, cardiovascularRisk: e.target.value })} className="w-full p-1.5 bg-slate-50 border rounded-lg text-xs" />
        </div>
        <div>
          <label className="block text-[11px] font-bold text-slate-700 mb-1">Examen Físico Segmentario</label>
          <input type="text" placeholder="Ej. Cardiovascular sin soplos, respiratorio límpido..." value={data.physicalExam || ''} onChange={(e) => onChange({ ...data, physicalExam: e.target.value })} className="w-full p-1.5 bg-slate-50 border rounded-lg text-xs" />
        </div>
      </div>
    </div>
  );
}
