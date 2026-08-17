import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../services/api.js';
import { formatDateISO, getWeekDays, getBiweeklyDays, getMonthDays } from '../utils/dateUtils.js';

const ClinicContext = createContext();

export function ClinicProvider({ children }) {
  // Navigation & View States
  // 'home' | 'agenda' | 'fichero' | 'historias' | 'profesionales' | 'whatsapp' | 'espera' | 'suscripcion'
  const [currentSection, setCurrentSection] = useState('home'); 
  const [selectedDate, setSelectedDate] = useState('2026-08-16'); // Anchor date matching seed data
  const [agendaView, setAgendaView] = useState('diaria'); // 'diaria' | 'semanal' | 'quincenal' | 'mensual'
  
  // Filters
  const [selectedDoctorId, setSelectedDoctorId] = useState('all');
  const [selectedSpecialty, setSelectedSpecialty] = useState('all');
  const [patientSearchQuery, setPatientSearchQuery] = useState('');

  // Data Store
  const [clinic, setClinic] = useState({ name: 'Clínica SaludConnect', adminName: 'Administración' });
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [daySummary, setDaySummary] = useState(null);
  const [daysSummaries, setDaysSummaries] = useState({});
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [subscription, setSubscription] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);

  // Toasts
  const [toasts, setToasts] = useState([]);

  // Modals
  const [modals, setModals] = useState({
    newAppointment: { isOpen: false, prefill: {} },
    appointmentDetail: { isOpen: false, appointment: null },
    newPatient: { isOpen: false, patient: null },
    patientDetail: { isOpen: false, patient: null },
    newDoctor: { isOpen: false, doctor: null },
    whatsappSimulator: { isOpen: false, appointment: null },
    medicalRecordEditor: { isOpen: false, patient: null, doctor: null, record: null },
    prescriptionPrint: { isOpen: false, record: null, type: 'receta' },
    planCheckout: { isOpen: false, plan: null },
    registerClinicModal: { isOpen: false }
  });

  // Sound effect
  const playAlertSound = useCallback((isSuccess = true) => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      
      if (isSuccess) {
        osc.frequency.setValueAtTime(587.33, audioCtx.currentTime);
        osc.frequency.setValueAtTime(880, audioCtx.currentTime + 0.1);
      } else {
        osc.frequency.setValueAtTime(440, audioCtx.currentTime);
        osc.frequency.setValueAtTime(330, audioCtx.currentTime + 0.1);
      }
      
      gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
      
      osc.start(audioCtx.currentTime);
      osc.stop(audioCtx.currentTime + 0.3);
    } catch (e) {
      // Audio context may be restricted before interaction
    }
  }, []);

  const addToast = useCallback((toast) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    const newToast = { id, type: 'info', duration: 6000, ...toast };
    setToasts(prev => [newToast, ...prev]);

    if (newToast.type === 'success' || newToast.type === 'whatsapp') {
      playAlertSound(true);
    } else if (newToast.type === 'error' || newToast.type === 'cancel') {
      playAlertSound(false);
    }

    if (newToast.duration) {
      setTimeout(() => {
        removeToast(id);
      }, newToast.duration);
    }
  }, [playAlertSound]);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // Fetch Core Data
  const loadClinic = useCallback(async () => {
    try {
      const data = await api.getClinic();
      if (data) setClinic(data);
    } catch (err) {
      console.error('Error loading clinic:', err);
    }
  }, []);

  const loadDoctors = useCallback(async () => {
    try {
      const data = await api.getDoctors();
      setDoctors(data);
    } catch (err) {
      console.error('Error loading doctors:', err);
    }
  }, []);

  const loadPatients = useCallback(async (search = '') => {
    try {
      const data = await api.getPatients(search);
      setPatients(data);
    } catch (err) {
      console.error('Error loading patients:', err);
    }
  }, []);

  const loadSubscription = useCallback(async () => {
    try {
      const data = await api.getSubscription();
      setSubscription(data);
    } catch (err) {
      console.error('Error loading subscription:', err);
    }
  }, []);

  const loadAppointments = useCallback(async () => {
    try {
      let startDate, endDate;

      if (agendaView === 'diaria') {
        startDate = selectedDate;
        endDate = selectedDate;
      } else if (agendaView === 'semanal') {
        const week = getWeekDays(selectedDate);
        startDate = week[0];
        endDate = week[6];
      } else if (agendaView === 'quincenal') {
        const biweek = getBiweeklyDays(selectedDate);
        startDate = biweek[0];
        endDate = biweek[14];
      } else if (agendaView === 'mensual') {
        const monthInfo = getMonthDays(selectedDate);
        startDate = monthInfo.startDate;
        endDate = monthInfo.endDate;
      }

      const [apts, daySum, rangeSums] = await Promise.all([
        api.getAppointments({
          startDate,
          endDate,
          doctorId: selectedDoctorId,
          status: 'all'
        }),
        api.getDaySummary(selectedDate),
        api.getDaysSummaries(startDate, endDate)
      ]);

      setAppointments(apts);
      setDaySummary(daySum);
      setDaysSummaries(rangeSums);
    } catch (err) {
      console.error('Error loading appointments:', err);
    }
  }, [agendaView, selectedDate, selectedDoctorId]);

  // Initial Load
  useEffect(() => {
    const init = async () => {
      setIsLoading(true);
      await Promise.all([loadClinic(), loadDoctors(), loadPatients(), loadAppointments(), loadSubscription()]);
      setIsLoading(false);
    };
    init();
  }, [loadClinic, loadDoctors, loadPatients, loadAppointments, loadSubscription]);

  // Refresh appointments whenever date or view changes
  useEffect(() => {
    loadAppointments();
  }, [selectedDate, agendaView, selectedDoctorId, loadAppointments]);

  // Real-Time SSE Listener
  useEffect(() => {
    const disconnect = api.connectEvents((event) => {
      if (event.type === 'CONNECTED') {
        setIsConnected(true);
        return;
      }

      console.log('[SSE Recibido]:', event);

      if (event.type === 'PATIENT_RESPONSE_RECEIVED' || event.type === 'APPOINTMENT_UPDATED' || event.type === 'APPOINTMENT_CREATED' || event.type === 'APPOINTMENT_DELETED') {
        loadAppointments();
        if (event.notification) {
          addToast({
            type: event.type === 'PATIENT_RESPONSE_RECEIVED' 
              ? (event.payload.status === 'confirmed' ? 'success' : 'cancel') 
              : 'info',
            title: event.notification.title,
            message: event.notification.message,
            appointment: event.payload
          });
        }
      } else if (event.type === 'PATIENT_CREATED' || event.type === 'PATIENT_UPDATED' || event.type === 'PATIENT_DELETED') {
        loadPatients();
        if (event.notification) {
          addToast({
            type: 'info',
            title: event.notification.title,
            message: event.notification.message
          });
        }
      } else if (event.type === 'DOCTOR_CREATED' || event.type === 'DOCTOR_UPDATED' || event.type === 'DOCTOR_DELETED') {
        loadDoctors();
        if (event.notification) {
          addToast({
            type: 'info',
            title: event.notification.title,
            message: event.notification.message
          });
        }
      } else if (event.type === 'CLINIC_REGISTERED' || event.type === 'CLINIC_UPDATED') {
        loadClinic();
        loadDoctors();
        loadSubscription();
        if (event.notification) {
          addToast({
            type: 'success',
            title: event.notification.title,
            message: event.notification.message
          });
        }
      } else if (event.type === 'WHATSAPP_SENT' || event.type === 'WHATSAPP_BATCH_SENT') {
        loadAppointments();
        if (event.notification) {
          addToast({
            type: 'whatsapp',
            title: event.notification.title,
            message: event.notification.message
          });
        }
      } else if (event.type === 'SUBSCRIPTION_UPDATED') {
        loadSubscription();
        if (event.notification) {
          addToast({
            type: 'success',
            title: event.notification.title,
            message: event.notification.message
          });
        }
      }
    });

    return () => {
      disconnect();
    };
  }, [loadAppointments, loadPatients, loadDoctors, loadClinic, loadSubscription, addToast]);

  // Modal Control Helpers
  const openModal = (modalName, data = {}) => {
    setModals(prev => ({
      ...prev,
      [modalName]: { isOpen: true, ...data }
    }));
  };

  const closeModal = (modalName) => {
    setModals(prev => ({
      ...prev,
      [modalName]: { isOpen: false }
    }));
  };

  // Actions
  const registerClinicAccount = async (accountData) => {
    const res = await api.registerClinic(accountData);
    await Promise.all([loadClinic(), loadDoctors(), loadSubscription()]);
    setCurrentSection('agenda');
    addToast({
      type: 'success',
      title: '¡Cuenta Creada Exitosamente!',
      message: `Bienvenido a ${accountData.clinicName}. Tu agenda está lista.`
    });
    return res;
  };

  const createDoctor = async (doctorData) => {
    const newDoc = await api.createDoctor(doctorData);
    await loadDoctors();
    addToast({
      type: 'success',
      title: 'Profesional Añadido',
      message: `${newDoc.name} (${newDoc.specialty}) ahora tiene consultorio y grilla activa.`
    });
    return newDoc;
  };

  const updateDoctor = async (id, doctorData) => {
    const updated = await api.updateDoctor(id, doctorData);
    await loadDoctors();
    addToast({
      type: 'info',
      title: 'Profesional Actualizado',
      message: `${updated.name}`
    });
    return updated;
  };

  const deleteDoctor = async (id) => {
    await api.deleteDoctor(id);
    await loadDoctors();
    addToast({
      type: 'info',
      title: 'Profesional Eliminado',
      message: 'Se dio de baja al profesional.'
    });
  };

  const createPatient = async (patientData) => {
    const newPat = await api.createPatient(patientData);
    await loadPatients();
    return newPat;
  };

  const updatePatient = async (id, patientData) => {
    const updated = await api.updatePatient(id, patientData);
    await loadPatients();
    return updated;
  };

  const deletePatient = async (id) => {
    await api.deletePatient(id);
    await loadPatients();
    addToast({ type: 'info', title: 'Paciente Eliminado', message: 'Se eliminó la ficha del fichero.' });
  };

  const createAppointment = async (appointmentData) => {
    const created = await api.createAppointment(appointmentData);
    await loadAppointments();
    return created;
  };

  const updateAppointment = async (id, updateData) => {
    const updated = await api.updateAppointment(id, updateData);
    await loadAppointments();
    return updated;
  };

  const deleteAppointment = async (id) => {
    await api.deleteAppointment(id);
    await loadAppointments();
  };

  const quickChangeStatus = async (appointmentId, newStatus) => {
    await api.updateAppointment(appointmentId, { status: newStatus });
    await loadAppointments();
    addToast({
      type: newStatus === 'cancelled' ? 'cancel' : 'info',
      title: newStatus === 'cancelled' ? 'Turno Anulado' : 'Estado de Turno Actualizado',
      message: `El estado cambió a ${newStatus.toUpperCase()}`
    });
  };

  const sendWhatsappReminder = async (appointmentId) => {
    const result = await api.sendWhatsappReminderSingle(appointmentId);
    await loadAppointments();
    return result;
  };

  const sendWhatsappBatch = async (date) => {
    const result = await api.sendWhatsappReminderBatch(date || selectedDate);
    await loadAppointments();
    return result;
  };

  const simulatePatientAction = async (tokenOrId, action) => {
    const result = await api.respondWhatsapp({
      token: tokenOrId.startsWith('token_') || tokenOrId.startsWith('tok_') ? tokenOrId : undefined,
      appointmentId: !tokenOrId.startsWith('token_') && !tokenOrId.startsWith('tok_') ? tokenOrId : undefined,
      action
    });
    await loadAppointments();
    return result;
  };

  const changeSubscriptionPlan = async (planId, paymentMethod) => {
    const updated = await api.changeSubscriptionPlan(planId, paymentMethod);
    setSubscription(updated);
    addToast({
      type: 'success',
      title: '¡Suscripción Actualizada con Éxito!',
      message: `Tu clínica ahora está suscrita al ${updated.planName}.`
    });
    return updated;
  };

  const cancelSubscription = async () => {
    const updated = await api.cancelSubscription();
    setSubscription(updated);
    addToast({
      type: 'info',
      title: 'Renovación Desactivada',
      message: 'Tu suscripción no se renovará automáticamente al finalizar el período.'
    });
    return updated;
  };

  return (
    <ClinicContext.Provider value={{
      currentSection,
      setCurrentSection,
      selectedDate,
      setSelectedDate,
      agendaView,
      setAgendaView,
      selectedDoctorId,
      setSelectedDoctorId,
      selectedSpecialty,
      setSelectedSpecialty,
      patientSearchQuery,
      setPatientSearchQuery,
      clinic,
      doctors,
      patients,
      appointments,
      daySummary,
      daysSummaries,
      medicalRecords,
      subscription,
      isLoading,
      isConnected,
      toasts,
      addToast,
      removeToast,
      modals,
      openModal,
      closeModal,
      loadClinic,
      loadDoctors,
      loadPatients,
      loadAppointments,
      loadSubscription,
      registerClinicAccount,
      createDoctor,
      updateDoctor,
      deleteDoctor,
      createPatient,
      updatePatient,
      deletePatient,
      createAppointment,
      updateAppointment,
      deleteAppointment,
      quickChangeStatus,
      sendWhatsappReminder,
      sendWhatsappBatch,
      simulatePatientAction,
      changeSubscriptionPlan,
      cancelSubscription
    }}>
      {children}
    </ClinicContext.Provider>
  );
}

export function useClinic() {
  const context = useContext(ClinicContext);
  if (!context) {
    throw new Error('useClinic debe ser utilizado dentro de un ClinicProvider');
  }
  return context;
}
