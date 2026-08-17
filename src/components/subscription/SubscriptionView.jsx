import React, { useState } from 'react';
import { useClinic } from '../../context/ClinicContext.jsx';
import { 
  Check, 
  CreditCard, 
  ShieldCheck, 
  Zap, 
  Download, 
  Calendar, 
  Users, 
  MessageSquare, 
  FileText, 
  Clock, 
  Building2,
  AlertCircle,
  HelpCircle,
  Sparkles,
  UserPlus,
  Edit,
  Trash2
} from 'lucide-react';
import { formatHumanDate } from '../../utils/dateUtils.js';

export function SubscriptionView() {
  const { 
    subscription, 
    openModal, 
    cancelSubscription, 
    doctors, 
    deleteDoctor,
    clinic,
    appointments 
  } = useClinic();

  const [billingCycle, setBillingCycle] = useState('monthly'); // 'monthly' | 'annual' (with 20% discount)

  const currentPlanId = subscription?.planId || 'professional';
  const maxDoctorsAllowed = subscription?.limits?.maxDoctors || 5;

  const plans = [
    {
      id: 'basic',
      name: 'Plan Consultorio Individual',
      target: 'Profesionales independientes y consultorios particulares',
      priceMonthly: 15000,
      priceAnnual: 12000,
      maxDoctors: '1 Profesional',
      features: [
        'Agenda multivista (Diaria 15m, Semanal, Quincenal, Mensual)',
        'Hasta 300 turnos por mes',
        'Fichero central correlativo ilimitado',
        'Recordatorios de WhatsApp estándar',
        'Historias clínicas y evoluciones básicas',
        'Exportación de datos en PDF / Excel',
        'Soporte por email'
      ],
      popular: false
    },
    {
      id: 'professional',
      name: 'Plan Profesional (Clínica)',
      target: 'Clínicas medianas, centros de especialidades y policonsultorios',
      priceMonthly: 29000,
      priceAnnual: 23200,
      maxDoctors: 'Hasta 5 Profesionales',
      features: [
        'Todo lo del Plan Individual',
        'Hasta 5 Médicos en simultáneo',
        'Turnos y Sobreturns ilimitados (sin tope)',
        'Confirmación interactiva en vivo por WhatsApp [Aceptar / Cancelar]',
        'Sincronización instantánea con la agenda médica',
        'Módulos multidisciplinarios: Odontograma 2D, Mapa Corporal Kinesiológico, Nutrición (IMC/Antropometría), Oftalmología, Pediatría',
        'Generador oficial de recetas médicas y certificados membretados',
        'Sala de espera y control de recepción en tiempo real',
        'Soporte prioritario por WhatsApp'
      ],
      popular: true
    },
    {
      id: 'enterprise',
      name: 'Plan Corporativo (Centro Médico)',
      target: 'Centros médicos de gran escala, hospitales de día y redes de consultorios',
      priceMonthly: 55000,
      priceAnnual: 44000,
      maxDoctors: 'Profesionales Ilimitados',
      features: [
        'Todo lo del Plan Profesional',
        'Profesionales y consultorios ilimitados',
        'Múltiples sedes o sucursales centralizadas',
        'API de WhatsApp Cloud oficial multi-agente dedicada',
        'Módulo de liquidaciones y facturación por profesional',
        'Migración asistida de base de datos de pacientes',
        'Servidor dedicado con SLA 99.9% de disponibilidad',
        'Soporte técnico y ejecutivo de cuenta 24/7'
      ],
      popular: false
    }
  ];

  return (
    <div className="space-y-4">
      
      {/* Top Header */}
      <div className="bg-white rounded-lg p-4 border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900">Gestión de Suscripción & Planes Mensuales</h2>
            <span className="px-2 py-0.2 rounded text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
              SaaS Activo
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Plataforma escalable de turnos médicos con cobro recurrente mensual por consultorio o clínica.
          </p>
        </div>

        {/* Billing Cycle Toggle */}
        <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs">
          <button
            onClick={() => setBillingCycle('monthly')}
            className={`px-3 py-1 font-semibold rounded-md transition-all ${
              billingCycle === 'monthly' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'
            }`}
          >
            Mensual
          </button>
          <button
            onClick={() => setBillingCycle('annual')}
            className={`px-3 py-1 font-semibold rounded-md transition-all flex items-center gap-1 ${
              billingCycle === 'annual' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'
            }`}
          >
            <span>Anual</span>
            <span className="px-1 py-0.2 rounded text-[9px] font-black bg-emerald-100 text-emerald-800">
              -20%
            </span>
          </button>
        </div>
      </div>

      {/* Current Active Plan Status Bar */}
      {subscription && (
        <div className="bg-slate-900 text-white rounded-lg p-4 shadow-2xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-mono tracking-widest text-emerald-400 font-bold">
                  Estado de tu cuenta
                </span>
                <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-700">
                  {subscription.status === 'active' ? 'ACTIVA' : 'PRUEBA'}
                </span>
              </div>
              <h3 className="text-lg font-black tracking-tight">{subscription.planName}</h3>
              <p className="text-xs text-slate-400">
                Próxima facturación: <strong className="text-slate-200">{formatHumanDate(subscription.nextBillingDate)}</strong> por <strong className="text-emerald-400">${subscription.price?.toLocaleString('es-AR')} ARS</strong>
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <div className="bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700 text-xs">
                <span className="text-slate-400 text-[10px] block">Método de Cobro:</span>
                <span className="font-semibold text-slate-200">
                  {subscription.paymentMethod?.brand} •••• {subscription.paymentMethod?.last4}
                </span>
              </div>

              {subscription.status === 'active' && (
                <button
                  onClick={() => cancelSubscription()}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors border border-slate-700"
                >
                  Cancelar Renovación
                </button>
              )}
            </div>

          </div>
        </div>
      )}

      {/* Included Doctors & Staff Capacity Section */}
      <div className="bg-white rounded-lg p-4 border border-slate-200 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
              Profesionales Habilitados en tu Plan ({doctors.length} / {maxDoctorsAllowed === 999 ? 'Ilimitados' : maxDoctorsAllowed})
            </h3>
            <p className="text-[11px] text-slate-500">
              Médicos registrados que disponen de consultorio y grilla en el turnero.
            </p>
          </div>

          <button
            onClick={() => openModal('newDoctor', { doctor: null })}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-md transition-colors shadow-2xs self-start sm:self-auto"
          >
            <UserPlus className="w-3.5 h-3.5 text-emerald-400" />
            <span>+ Añadir Médico</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {doctors.map(doc => (
            <div key={doc.id} className="p-3 rounded-lg border border-slate-200 bg-slate-50/50 flex items-center justify-between gap-2">
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: doc.color || '#0d9488' }}></span>
                  <span className="font-bold text-xs text-slate-900 truncate">{doc.name}</span>
                </div>
                <span className="text-[11px] text-slate-500 block truncate">{doc.specialty} • {doc.room}</span>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => openModal('newDoctor', { doctor: doc })}
                  className="p-1 text-slate-400 hover:text-slate-900 rounded"
                  title="Editar"
                >
                  <Edit className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => {
                    if (confirm(`¿Desea dar de baja al profesional ${doc.name}?`)) {
                      deleteDoctor(doc.id);
                    }
                  }}
                  className="p-1 text-slate-400 hover:text-rose-600 rounded"
                  title="Eliminar"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3-Tier Pricing Table */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3.5">
        {plans.map(plan => {
          const isCurrent = currentPlanId === plan.id;
          const displayPrice = billingCycle === 'annual' ? plan.priceAnnual : plan.priceMonthly;

          return (
            <div
              key={plan.id}
              className={`bg-white rounded-lg border flex flex-col justify-between p-4 transition-all shadow-2xs ${
                plan.popular 
                  ? 'border-slate-900 ring-1 ring-slate-900' 
                  : isCurrent
                  ? 'border-emerald-500 bg-emerald-50/10'
                  : 'border-slate-200'
              }`}
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <h3 className="font-bold text-sm text-slate-900">{plan.name}</h3>
                    <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">{plan.target}</p>
                  </div>
                  {plan.popular && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-slate-900 text-white shrink-0">
                      Recomendado
                    </span>
                  )}
                  {isCurrent && !plan.popular && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-300 shrink-0">
                      Plan Actual
                    </span>
                  )}
                </div>

                {/* Price */}
                <div className="my-3 py-2.5 border-y border-slate-100">
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-black text-slate-900">
                      ${displayPrice.toLocaleString('es-AR')}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">/ mes</span>
                  </div>
                  <span className="text-[10px] text-slate-400 block mt-0.5">
                    {billingCycle === 'annual' ? 'Facturado anualmente (ahorras 20%)' : 'Facturación mensual sin compromiso'}
                  </span>
                </div>

                {/* Capacity badge */}
                <div className="mb-3 text-xs font-semibold text-slate-700 bg-slate-50 p-2 rounded border border-slate-100 flex items-center justify-between">
                  <span>Capacidad:</span>
                  <span className="text-slate-900 font-bold">{plan.maxDoctors}</span>
                </div>

                {/* Features list */}
                <ul className="space-y-1.5 text-xs text-slate-600 mb-4">
                  {plan.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="text-[11px] leading-tight">{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Button */}
              <div className="pt-3 border-t border-slate-100">
                {isCurrent ? (
                  <button
                    disabled
                    className="w-full py-2 text-xs font-bold text-emerald-900 bg-emerald-50 border border-emerald-200 rounded-md cursor-default text-center"
                  >
                    ✓ Plan Activo en tu Clínica
                  </button>
                ) : (
                  <button
                    onClick={() => openModal('planCheckout', {
                      plan: {
                        id: plan.id,
                        name: plan.name,
                        price: displayPrice
                      }
                    })}
                    className={`w-full py-2 text-xs font-bold rounded-md transition-colors text-center shadow-2xs ${
                      plan.popular
                        ? 'bg-slate-900 hover:bg-slate-800 text-white'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200'
                    }`}
                  >
                    Contratar {plan.name}
                  </button>
                )}
              </div>

            </div>
          );
        })}
      </div>

      {/* Invoices History Table */}
      <div className="bg-white rounded-lg p-4 border border-slate-200 shadow-2xs space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
              Historial de Facturación & Comprobantes
            </h3>
            <p className="text-[11px] text-slate-500">
              Comprobantes de pago descargables para deducción impositiva
            </p>
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          {(subscription?.invoices || []).map(inv => (
            <div key={inv.id} className="py-2.5 flex items-center justify-between gap-3 text-xs">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-slate-900">{inv.id}</span>
                  <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                    Pagado
                  </span>
                </div>
                <span className="text-[11px] text-slate-500 mt-0.5 block">{inv.description} • {inv.date}</span>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <span className="font-bold text-slate-900">${inv.amount?.toLocaleString('es-AR')} {inv.currency}</span>
                <button
                  onClick={() => alert(`Descargando comprobante oficial ${inv.id}.pdf...`)}
                  className="p-1 text-slate-500 hover:text-slate-900 rounded hover:bg-slate-100 transition-colors"
                  title="Descargar Comprobante PDF"
                >
                  <Download className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
