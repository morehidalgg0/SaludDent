import React from 'react';
import { Apple, Scale, Activity, PieChart, Droplet } from 'lucide-react';

export function NutritionModule({ data = {}, onChange }) {
  const anthropometry = data.anthropometry || {
    weightKg: '',
    heightCm: '',
    bmi: 0,
    bodyFatPercentage: '',
    muscleMassKg: '',
    waistCircumferenceCm: '',
    hipCircumferenceCm: ''
  };

  const nutritionalGoals = data.nutritionalGoals || {
    dailyCaloriesKcal: 2000,
    proteinsGrams: 140,
    carbohydratesGrams: 220,
    fatsGrams: 60,
    waterLiters: 2.5
  };

  // Helper to calculate BMI and WHR
  const updateAnthropometry = (field, value) => {
    const updated = { ...anthropometry, [field]: value };
    const w = parseFloat(updated.weightKg);
    const h = parseFloat(updated.heightCm) / 100;

    if (w > 0 && h > 0) {
      updated.bmi = parseFloat((w / (h * h)).toFixed(1));
    }

    const waist = parseFloat(updated.waistCircumferenceCm);
    const hip = parseFloat(updated.hipCircumferenceCm);
    if (waist > 0 && hip > 0) {
      updated.waistToHipRatio = parseFloat((waist / hip).toFixed(2));
    }

    onChange({
      ...data,
      anthropometry: updated
    });
  };

  const updateGoals = (field, value) => {
    onChange({
      ...data,
      nutritionalGoals: {
        ...nutritionalGoals,
        [field]: Number(value) || value
      }
    });
  };

  const getBmiCategory = (bmi) => {
    if (!bmi || bmi === 0) return { label: 'Pendiente', color: 'bg-slate-100 text-slate-700' };
    if (bmi < 18.5) return { label: 'Bajo Peso (< 18.5)', color: 'bg-blue-100 text-blue-800' };
    if (bmi < 25) return { label: 'Normopeso (18.5 - 24.9)', color: 'bg-emerald-100 text-emerald-800' };
    if (bmi < 30) return { label: 'Sobrepeso (25.0 - 29.9)', color: 'bg-amber-100 text-amber-800' };
    if (bmi < 35) return { label: 'Obesidad Grado I (30 - 34.9)', color: 'bg-orange-100 text-orange-800' };
    return { label: 'Obesidad Grado II/III (≥ 35)', color: 'bg-rose-100 text-rose-800' };
  };

  const bmiCat = getBmiCategory(anthropometry.bmi);

  return (
    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-4">
      
      <div>
        <h4 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
          <span>🥗 Evaluación Nutricional & Calculadora Antropométrica</span>
        </h4>
        <p className="text-xs text-slate-500">
          Cálculo automático de IMC (OMS), composición corporal, distribución de macronutrientes y metas calóricas.
        </p>
      </div>

      {/* Anthropometry Inputs & Live BMI card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        
        {/* Metric Inputs */}
        <div className="md:col-span-2 bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-3">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
            Mediciones Antropométricas
          </span>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Peso (kg) *</label>
              <input
                type="number"
                step="0.1"
                placeholder="75.5"
                value={anthropometry.weightKg}
                onChange={(e) => updateAnthropometry('weightKg', e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg outline-hidden focus:ring-2 focus:ring-emerald-500/20 font-bold"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Altura (cm) *</label>
              <input
                type="number"
                placeholder="175"
                value={anthropometry.heightCm}
                onChange={(e) => updateAnthropometry('heightCm', e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg outline-hidden focus:ring-2 focus:ring-emerald-500/20 font-bold"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">% Grasa Corporal</label>
              <input
                type="number"
                step="0.1"
                placeholder="18.5"
                value={anthropometry.bodyFatPercentage}
                onChange={(e) => updateAnthropometry('bodyFatPercentage', e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg outline-hidden focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Masa Muscular (kg)</label>
              <input
                type="number"
                step="0.1"
                placeholder="35.0"
                value={anthropometry.muscleMassKg}
                onChange={(e) => updateAnthropometry('muscleMassKg', e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg outline-hidden focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5 pt-2 border-t border-slate-100">
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 mb-1">Circunferencia Cintura (cm)</label>
              <input
                type="number"
                step="0.5"
                placeholder="82"
                value={anthropometry.waistCircumferenceCm}
                onChange={(e) => updateAnthropometry('waistCircumferenceCm', e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg outline-hidden"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-500 mb-1">Circunferencia Cadera (cm)</label>
              <input
                type="number"
                step="0.5"
                placeholder="98"
                value={anthropometry.hipCircumferenceCm}
                onChange={(e) => updateAnthropometry('hipCircumferenceCm', e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg outline-hidden"
              />
            </div>
          </div>
        </div>

        {/* Live Calculated BMI & WHR Card */}
        <div className="bg-gradient-to-br from-emerald-900 to-teal-950 rounded-xl p-4 text-white flex flex-col justify-between shadow-2xs">
          <div>
            <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">
              Índice de Masa Corporal (IMC)
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-black">{anthropometry.bmi || '—'}</span>
              <span className="text-xs text-emerald-200">kg/m²</span>
            </div>
            <div className="mt-2">
              <span className={`inline-block px-2 py-0.5 rounded-md text-[11px] font-bold ${bmiCat.color}`}>
                {bmiCat.label}
              </span>
            </div>
          </div>

          {anthropometry.waistToHipRatio && (
            <div className="pt-3 border-t border-emerald-800/80 mt-2 text-xs">
              <span className="text-emerald-300 font-medium">Razón Cintura/Cadera:</span>
              <span className="font-extrabold ml-1.5">{anthropometry.waistToHipRatio}</span>
            </div>
          )}
        </div>

      </div>

      {/* Macronutrient Goals Planner */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-3">
        <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
          Metas Nutricionales Diarias Prescriptas
        </span>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
          <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200">
            <span className="text-[10px] font-bold uppercase text-emerald-700 block">Calorías Totales</span>
            <input
              type="number"
              value={nutritionalGoals.dailyCaloriesKcal}
              onChange={(e) => updateGoals('dailyCaloriesKcal', e.target.value)}
              className="w-full bg-transparent font-extrabold text-sm text-emerald-950 outline-hidden"
            />
            <span className="text-[9px] text-emerald-600">kcal/día</span>
          </div>

          <div className="p-2.5 rounded-lg bg-blue-50 border border-blue-200">
            <span className="text-[10px] font-bold uppercase text-blue-700 block">Proteínas</span>
            <input
              type="number"
              value={nutritionalGoals.proteinsGrams}
              onChange={(e) => updateGoals('proteinsGrams', e.target.value)}
              className="w-full bg-transparent font-extrabold text-sm text-blue-950 outline-hidden"
            />
            <span className="text-[9px] text-blue-600">gramos</span>
          </div>

          <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200">
            <span className="text-[10px] font-bold uppercase text-amber-700 block">Carbohidratos</span>
            <input
              type="number"
              value={nutritionalGoals.carbohydratesGrams}
              onChange={(e) => updateGoals('carbohydratesGrams', e.target.value)}
              className="w-full bg-transparent font-extrabold text-sm text-amber-950 outline-hidden"
            />
            <span className="text-[9px] text-amber-600">gramos</span>
          </div>

          <div className="p-2.5 rounded-lg bg-purple-50 border border-purple-200">
            <span className="text-[10px] font-bold uppercase text-purple-700 block">Grasas Saludables</span>
            <input
              type="number"
              value={nutritionalGoals.fatsGrams}
              onChange={(e) => updateGoals('fatsGrams', e.target.value)}
              className="w-full bg-transparent font-extrabold text-sm text-purple-950 outline-hidden"
            />
            <span className="text-[9px] text-purple-600">gramos</span>
          </div>

          <div className="p-2.5 rounded-lg bg-cyan-50 border border-cyan-200">
            <span className="text-[10px] font-bold uppercase text-cyan-700 block">Agua / Hidratación</span>
            <input
              type="number"
              step="0.1"
              value={nutritionalGoals.waterLiters}
              onChange={(e) => updateGoals('waterLiters', e.target.value)}
              className="w-full bg-transparent font-extrabold text-sm text-cyan-950 outline-hidden"
            />
            <span className="text-[9px] text-cyan-600">litros/día</span>
          </div>
        </div>
      </div>

    </div>
  );
}
