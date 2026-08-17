import React from 'react';
import { useClinic } from '../../context/ClinicContext.jsx';
import { 
  Calendar, 
  MessageSquare, 
  FolderArchive, 
  FileText, 
  CreditCard, 
  Users, 
  CheckCircle2, 
  Activity,
  Stethoscope,
  UserPlus,
  CalendarPlus
} from 'lucide-react';

export function HomeView() {
  const { isRegistered, setCurrentSection, openModal, doctors, patients, appointments, subscription, daySummary } = useClinic();

  // --- DASHBOARD VIEW (when registered) ---
  if (isRegistered) {
    return (
      <div className="space-y-6 py-2">
        
        {/* Welcome Header */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center">
              <Activity className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h1 className="text-lg font-extrabold text-slate-900">Panel de Control</h1>
              <p className="text-xs text-slate-500">Resumen de tu clínica hoy</p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-1">
            <div className="flex items-center gap-2 text-slate-500">
              <Calendar className="w-4 h-4" />
              <span className="text-xs font-semibold">Turnos Hoy</span>
            </div>
            <p className="text-2xl font-extrabold text-slate-900">{daySummary?.total || 0}</p>
            <p className="text-[11px] text-slate-400">{daySummary?.confirmed || 0} confirmados</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-1">
            <div className="flex items-center gap-2 text-slate-500">
              <Users className="w-4 h-4" />
              <span className="text-xs font-semibold">Pacientes</span>
            </div>
            <p className="text-2xl font-extrabold text-slate-900">{patients?.length || 0}</p>
            <p className="text-[11px] text-slate-400">en el fichero</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-1">
            <div className="flex items-center gap-2 text-slate-500">
              <Stethoscope className="w-4 h-4" />
              <span className="text-xs font-semibold">Profesionales</span>
            </div>
            <p className="text-2xl font-extrabold text-slate-900">{doctors?.length || 0}</p>
            <p className="text-[11px] text-slate-400">activos</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-1">
            <div className="flex items-center gap-2 text-slate-500">
              <CreditCard className="w-4 h-4" />
              <span className="text-xs font-semibold">Suscripción</span>
            </div>
            <p className="text-sm font-extrabold text-slate-900 truncate">{subscription?.planName || 'Sin plan'}</p>
            <p className="text-[11px] text-slate-400">{subscription?.status === 'active' ? 'Activa' : 'Inactiva'}</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <button
            onClick={() => setCurrentSection('agenda')}
            className="bg-white p-5 rounded-xl border border-slate-200 hover:border-slate-400 transition-all cursor-pointer shadow-2xs group text-left space-y-2"
          >
            <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700 group-hover:bg-slate-900 group-hover:text-white transition-colors">
              <Calendar className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm text-slate-900">Ir a la Agenda</h4>
            <p className="text-xs text-slate-500">Ver y agendar turnos del día</p>
          </button>
          <button
            onClick={() => setCurrentSection('fichero')}
            className="bg-white p-5 rounded-xl border border-slate-200 hover:border-slate-400 transition-all cursor-pointer shadow-2xs group text-left space-y-2"
          >
            <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700 group-hover:bg-slate-900 group-hover:text-white transition-colors">
              <FolderArchive className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm text-slate-900">Fichero de Pacientes</h4>
            <p className="text-xs text-slate-500">Buscar y gestionar fichas</p>
          </button>
          <button
            onClick={() => openModal('newAppointment', { prefill: { date: new Date().toISOString().split('T')[0] } })}
            className="bg-slate-900 p-5 rounded-xl hover:bg-slate-800 transition-all cursor-pointer shadow-2xs group text-left space-y-2"
          >
            <div className="w-9 h-9 rounded-lg bg-emerald-500/20 flex items-center justify-center">
              <CalendarPlus className="w-5 h-5 text-emerald-400" />
            </div>
            <h4 className="font-bold text-sm text-white">Agendar Nuevo Turno</h4>
            <p className="text-xs text-slate-400">Crear un turno rápido</p>
          </button>
        </div>
      </div>
    );
  }

  // --- LANDING PAGE VIEW (when NOT registered) ---
  return (
    <div className="space-y-8 py-2">
      
      {/* 1. HERO SECTION */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-10 shadow-2xs text-center max-w-4xl mx-auto space-y-5">
        
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200">
          <Activity className="w-3.5 h-3.5 text-emerald-600" />
          <span>Plataforma SaaS de Gestión Médica & Turnos Online</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
          El Sistema de Turnos y Gestión Clínica <br className="hidden sm:inline" />
          <span className="text-slate-700">con Confirmación Automática por WhatsApp</span>
        </h1>

        {/* Subtitle */}
        <p className="text-sm sm:text-base text-slate-500 max-w-2xl mx-auto leading-relaxed">
          Diseñado para profesionales independientes, consultorios y clínicas. Agenda inteligente cada 15 minutos, sobreturnos urgentes, fichero unificado con N° correlativo, historias clínicas multidisciplinarias y suscripciones mensuales escalables.
        </p>

        {/* Hero CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={() => openModal('registerClinicModal')}
            className="px-5 py-3 text-xs sm:text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-md transition-all flex items-center gap-2"
          >
            <UserPlus className="w-4 h-4 text-emerald-400" />
            <span>Crear Cuenta / Registrar mi Clínica (14 días gratis)</span>
          </button>
        </div>

        {/* Trust metrics */}
        <div className="pt-6 border-t border-slate-100 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500">
          <div className="flex items-center gap-1.5 font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Base de datos en servidor</span>
          </div>
          <div className="flex items-center gap-1.5 font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Sincronización en vivo SSE</span>
          </div>
          <div className="flex items-center gap-1.5 font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Sin contratos ni ataduras</span>
          </div>
        </div>

      </div>

      {/* 2. CÓMO FUNCIONA EL SISTEMA (PASO A PASO) */}
      <div className="space-y-4">
        <div className="text-center space-y-1">
          <h2 className="text-lg font-bold text-slate-900 uppercase tracking-wider text-xs text-slate-500">
            Flujo de Implementación Rápida
          </h2>
          <h3 className="text-xl font-extrabold text-slate-900">¿Cómo funciona SaludConnect en tu clínica?</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Step 1 */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-2.5">
            <div className="w-9 h-9 rounded-lg bg-slate-900 text-white font-bold flex items-center justify-center text-sm">
              1
            </div>
            <h4 className="font-bold text-sm text-slate-900">1. Registra tu Clínica</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Crea tu cuenta de administración en 1 minuto y selecciona tu plan mensual con 14 días de prueba sin cargo.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-2.5">
            <div className="w-9 h-9 rounded-lg bg-slate-900 text-white font-bold flex items-center justify-center text-sm">
              2
            </div>
            <h4 className="font-bold text-sm text-slate-900">2. Añade tus Profesionales</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Carga a los médicos de tu equipo con sus especialidades (Odontología, Kinesiología, Pediatría...) y consultorios asignados.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-2.5">
            <div className="w-9 h-9 rounded-lg bg-slate-900 text-white font-bold flex items-center justify-center text-sm">
              3
            </div>
            <h4 className="font-bold text-sm text-slate-900">3. Agenda y Sincroniza</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Agenda turnos cada 15m. El paciente recibe el WhatsApp con botones [Aceptar / Cancelar] que actualizan la agenda en vivo.
            </p>
          </div>

        </div>
      </div>

      {/* 3. MÓDULOS PRINCIPALES DE LA PLATAFORMA */}
      <div className="space-y-4">
        <div className="text-center space-y-1">
          <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Características Principales
          </h2>
          <h3 className="text-xl font-extrabold text-slate-900">Todo lo que tu centro médico necesita</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          
          {/* Card 1: Agenda */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-2.5">
            <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700">
              <Calendar className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm text-slate-900">Agenda Multivista 15m & Sobreturnos</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Alterna entre vista Diaria (cada 15 min), Semanal, Quincenal y Mensual con totalizadores de ocupación y sobreturnos de urgencia.
            </p>
          </div>

          {/* Card 2: WhatsApp */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-2.5">
            <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700">
              <MessageSquare className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm text-slate-900">WhatsApp con Confirmación en Vivo</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Envío automático con botones interactivos [Aceptar Turno] y [Cancelar Turno] que impactan de inmediato en la agenda del profesional.
            </p>
          </div>

          {/* Card 3: Fichero */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-2.5">
            <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700">
              <FolderArchive className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm text-slate-900">Fichero Digital con N° Correlativo</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Identificación unívoca de pacientes (ej: F-10240) para búsqueda ágil física y digital por DNI, Nombre o Cobertura Médica.
            </p>
          </div>

          {/* Card 4: Historias Clínicas */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-2.5">
            <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700">
              <FileText className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm text-slate-900">Historias Clínicas Multidisciplinarias</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Odontograma 2D interactivo, mapa de dolor para Kinesiología, curvas antropométricas e IMC en Nutrición y recetario imprimible.
            </p>
          </div>

          {/* Card 5: Profesionales */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-2.5">
            <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700">
              <Users className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm text-slate-900">Gestión de Profesionales & Consultorios</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Alta y configuración de médicos, especialidades, consultorios asignados, intervalos base y matrículas profesionales.
            </p>
          </div>

          {/* Card 6: Suscripciones SaaS */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-2.5">
            <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700">
              <CreditCard className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm text-slate-900">Suscripción Mensual Escalable</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Planes por consultorio o clínica desde $15.000 ARS/mes con facturación recurrente por Mercado Pago, Tarjeta o Transferencia.
            </p>
          </div>

        </div>
      </div>

      {/* 4. BOTTOM ACTION BANNER */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xs">
        <div className="space-y-1 text-center sm:text-left">
          <h3 className="font-bold text-lg">¿Listo para empezar a usar SaludConnect?</h3>
          <p className="text-xs text-slate-400">
            Registra tu clínica y comienza a agendar turnos con confirmaciones en vivo de inmediato.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => openModal('registerClinicModal')}
            className="px-4 py-2.5 text-xs font-bold text-slate-900 bg-white hover:bg-slate-100 rounded-xl transition-colors shrink-0 shadow-2xs"
          >
            + Crear Cuenta de Clínica
          </button>
        </div>
      </div>

    </div>
  );
}
