import React, { useState, useEffect } from 'react';
import { useClinic, ClinicProvider } from './context/ClinicContext.jsx';
import { Navbar } from './components/common/Navbar.jsx';
import { ToastContainer } from './components/common/ToastContainer.jsx';

// Home Landing
import { HomeView } from './components/home/HomeView.jsx';
import { RegisterClinicModal } from './components/home/RegisterClinicModal.jsx';

// Agenda components
import { AgendaViewHeader } from './components/agenda/AgendaViewHeader.jsx';
import { DailySummaryBar } from './components/agenda/DailySummaryBar.jsx';
import { DailyView } from './components/agenda/DailyView.jsx';
import { WeeklyView } from './components/agenda/WeeklyView.jsx';
import { BiweeklyView } from './components/agenda/BiweeklyView.jsx';
import { MonthlyView } from './components/agenda/MonthlyView.jsx';
import { NewAppointmentModal } from './components/agenda/NewAppointmentModal.jsx';
import { AppointmentDetailModal } from './components/agenda/AppointmentDetailModal.jsx';

// Fichero components
import { FicheroView } from './components/fichero/FicheroView.jsx';
import { NewPatientModal } from './components/fichero/NewPatientModal.jsx';
import { PatientDetailModal } from './components/fichero/PatientDetailModal.jsx';

// Doctors management
import { NewDoctorModal } from './components/doctors/NewDoctorModal.jsx';

// WhatsApp components
import { WhatsAppHubView } from './components/whatsapp/WhatsAppHubView.jsx';
import { WhatsAppSimulatorModal } from './components/whatsapp/WhatsAppSimulatorModal.jsx';

// Patient Portal for WhatsApp confirmation link
import { PatientPortalView } from './components/portal/PatientPortalView.jsx';

// EHR / Medical Records components
import { MedicalRecordsView } from './components/medical_records/MedicalRecordsView.jsx';
import { MedicalRecordEditorModal } from './components/medical_records/MedicalRecordEditorModal.jsx';
import { PrescriptionPrintModal } from './components/medical_records/PrescriptionPrintModal.jsx';

// Waiting Room
import { WaitingRoomView } from './components/waiting_room/WaitingRoomView.jsx';

// SaaS Subscription & Billing
import { SubscriptionView } from './components/subscription/SubscriptionView.jsx';
import { PlanCheckoutModal } from './components/subscription/PlanCheckoutModal.jsx';

function MainAppContent() {
  const { currentSection, setCurrentSection, isRegistered, agendaView, isLoading } = useClinic();

  // Check if current URL is patient portal link (/portal/turno/:token)
  const pathname = window.location.pathname;
  if (pathname.startsWith('/portal/turno/')) {
    const token = pathname.replace('/portal/turno/', '');
    return <PatientPortalView token={token} />;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
        <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white font-bold text-sm animate-pulse">
          SC
        </div>
        <p className="mt-3 text-xs font-semibold text-slate-500">
          Iniciando sistema de turnos...
        </p>
      </div>
    );
  }

  // Guard: if not registered, force home section
  const activeSection = isRegistered ? currentSection : 'home';

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      
      {/* Top Header with Horizontal Menu Bar */}
      <Navbar />

      {/* Main Workspace (Full Width Container) */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-4 sm:py-6">
        
        {/* SECTION: HOME / LANDING PAGE */}
        {activeSection === 'home' && (
          <div className="animate-in fade-in duration-150">
            <HomeView />
          </div>
        )}

        {/* SECTION: AGENDA MULTIVISTA */}
        {activeSection === 'agenda' && (
          <div className="space-y-3.5 animate-in fade-in duration-150">
            {/* Header: Solapa de Vista, Fecha y Filtro de Profesional */}
            <AgendaViewHeader />

            {/* Totalizador Diario Unificado */}
            <DailySummaryBar />

            {/* Vista Seleccionada (Diaria 15m, Semanal, Quincenal, Mensual) */}
            {agendaView === 'diaria' && <DailyView />}
            {agendaView === 'semanal' && <WeeklyView />}
            {agendaView === 'quincenal' && <BiweeklyView />}
            {agendaView === 'mensual' && <MonthlyView />}
          </div>
        )}

        {/* SECTION: FICHERO DE PACIENTES */}
        {activeSection === 'fichero' && (
          <div className="animate-in fade-in duration-150">
            <FicheroView />
          </div>
        )}

        {/* SECTION: HISTORIAS CLÍNICAS (EHR) */}
        {activeSection === 'historias' && (
          <div className="animate-in fade-in duration-150">
            <MedicalRecordsView />
          </div>
        )}

        {/* SECTION: NOTIFICACIONES WHATSAPP */}
        {activeSection === 'whatsapp' && (
          <div className="animate-in fade-in duration-150">
            <WhatsAppHubView />
          </div>
        )}

        {/* SECTION: SALA DE ESPERA */}
        {activeSection === 'espera' && (
          <div className="animate-in fade-in duration-150">
            <WaitingRoomView />
          </div>
        )}

        {/* SECTION: PLANES & SUSCRIPCIÓN SAAS */}
        {activeSection === 'suscripcion' && (
          <div className="animate-in fade-in duration-150">
            <SubscriptionView />
          </div>
        )}

      </main>

      {/* All Application Modals */}
      <NewAppointmentModal />
      <AppointmentDetailModal />
      <NewPatientModal />
      <PatientDetailModal />
      <NewDoctorModal />
      <RegisterClinicModal />
      <WhatsAppSimulatorModal />
      <MedicalRecordEditorModal />
      <PrescriptionPrintModal />
      <PlanCheckoutModal />

      {/* Live Toast Container */}
      <ToastContainer />
    </div>
  );
}

export default function App() {
  return (
    <ClinicProvider>
      <MainAppContent />
    </ClinicProvider>
  );
}
