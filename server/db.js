import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { seedDoctors, seedPatients, seedAppointments, seedMedicalRecords } from './seedData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'clinic_database.json');

// Ensure data folder exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

class Database {
  constructor() {
    this.data = {
      clinic: {
        name: 'Clínica SaludConnect',
        adminName: 'Administración Central',
        email: 'contacto@saludconnect.com',
        phone: '+54 9 11 4455-8899',
        address: 'Av. Santa Fe 2450, Piso 3',
        specialty: 'Centro Médico Multidisciplinario',
        createdAt: '2026-08-01T08:00:00.000Z'
      },
      doctors: [],
      patients: [],
      appointments: [],
      medicalRecords: [],
      whatsappLogs: [],
      ficheroSequence: 10246,
      subscription: {
        planId: 'professional',
        planName: 'Plan Profesional (Hasta 5 Médicos)',
        price: 29000,
        currency: 'ARS',
        status: 'active',
        billingCycle: 'monthly',
        startDate: '2026-08-01',
        nextBillingDate: '2026-09-01',
        autoRenew: true,
        paymentMethod: {
          brand: 'Visa',
          last4: '4291',
          holder: 'Clínica SaludConnect'
        },
        limits: {
          maxDoctors: 5,
          maxAppointmentsPerMonth: 99999,
          whatsappBotIncluded: true,
          ficheroIncluded: true,
          ehrSpecialties: true
        },
        invoices: [
          { 
            id: 'INV-2026-08', 
            date: '2026-08-01', 
            amount: 29000, 
            currency: 'ARS', 
            status: 'paid', 
            description: 'Abono Mensual Plan Profesional (Agosto 2026)' 
          },
          { 
            id: 'INV-2026-07', 
            date: '2026-07-01', 
            amount: 29000, 
            currency: 'ARS', 
            status: 'paid', 
            description: 'Abono Mensual Plan Profesional (Julio 2026)' 
          }
        ]
      }
    };
    this.init();
  }

  init() {
    try {
      if (fs.existsSync(DB_FILE)) {
        const fileContent = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(fileContent);
        this.data = { 
          ...this.data, 
          ...parsed,
          clinic: parsed.clinic || this.data.clinic,
          subscription: parsed.subscription || this.data.subscription
        };
        console.log(`[DB] Base de datos cargada: ${this.data.patients.length} pacientes, ${this.data.doctors.length} médicos, ${this.data.appointments.length} turnos.`);
      } else {
        console.log('[DB] Inicializando base de datos con datos semilla...');
        this.data.doctors = seedDoctors;
        this.data.patients = seedPatients;
        this.data.appointments = seedAppointments;
        this.data.medicalRecords = seedMedicalRecords;
        this.data.ficheroSequence = 10246;
        this.persist();
      }
    } catch (err) {
      console.error('[DB] Error cargando base de datos, usando datos semilla:', err);
      this.data.doctors = seedDoctors;
      this.data.patients = seedPatients;
      this.data.appointments = seedAppointments;
      this.data.medicalRecords = seedMedicalRecords;
      this.data.ficheroSequence = 10246;
      this.persist();
    }
  }

  persist() {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (err) {
      console.error('[DB] Error persistiendo base de datos:', err);
    }
  }

  // --- CLINIC INFO & REGISTRATION (ONBOARDING) ---
  getClinic() {
    return this.data.clinic;
  }

  updateClinic(clinicData) {
    this.data.clinic = { ...this.data.clinic, ...clinicData, updatedAt: new Date().toISOString() };
    this.persist();
    return this.data.clinic;
  }

  registerClinicAccount({ adminName, email, password, clinicName, phone, specialty, planId, initialDoctors = [] }) {
    const today = new Date().toISOString().split('T')[0];
    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);

    this.data.clinic = {
      name: clinicName || 'Nueva Clínica',
      adminName: adminName || 'Administrador',
      email: email || '',
      phone: phone || '',
      address: 'Sede Principal',
      specialty: specialty || 'Policonsultorio',
      createdAt: new Date().toISOString()
    };

    // Replace or add doctors
    if (initialDoctors.length > 0) {
      this.data.doctors = initialDoctors.map((doc, idx) => ({
        id: `doc-${Date.now()}-${idx}`,
        name: doc.name || `Dr. Profesional ${idx + 1}`,
        specialty: doc.specialty || 'Medicina General',
        room: doc.room || `Consultorio ${idx + 1}`,
        phone: doc.phone || phone || '',
        email: doc.email || '',
        color: doc.color || '#0d9488',
        defaultSlotMinutes: Number(doc.defaultSlotMinutes) || 15
      }));
    }

    // Set initial plan
    this.changePlan(planId || 'professional');
    this.persist();

    return {
      clinic: this.data.clinic,
      doctors: this.data.doctors,
      subscription: this.data.subscription
    };
  }

  // --- DOCTORS ---
  getDoctors() {
    return this.data.doctors;
  }

  getDoctorById(id) {
    return this.data.doctors.find(d => d.id === id);
  }

  createDoctor(doctorData) {
    const newDoc = {
      id: `doc-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      name: doctorData.name || 'Nuevo Profesional',
      specialty: doctorData.specialty || 'Medicina General',
      room: doctorData.room || `Consultorio ${this.data.doctors.length + 1}`,
      phone: doctorData.phone || '',
      email: doctorData.email || '',
      license: doctorData.license || '',
      color: doctorData.color || '#0d9488',
      defaultSlotMinutes: Number(doctorData.defaultSlotMinutes) || 15,
      createdAt: new Date().toISOString()
    };

    this.data.doctors.push(newDoc);
    this.persist();
    return newDoc;
  }

  updateDoctor(id, doctorData) {
    const idx = this.data.doctors.findIndex(d => d.id === id);
    if (idx === -1) return null;
    this.data.doctors[idx] = { ...this.data.doctors[idx], ...doctorData, updatedAt: new Date().toISOString() };
    this.persist();
    return this.data.doctors[idx];
  }

  deleteDoctor(id) {
    const initialLen = this.data.doctors.length;
    this.data.doctors = this.data.doctors.filter(d => d.id !== id);
    if (this.data.doctors.length !== initialLen) {
      this.persist();
      return true;
    }
    return false;
  }

  // --- PATIENTS & FICHERO ---
  getPatients(searchQuery = '') {
    if (!searchQuery || !searchQuery.trim()) {
      return this.data.patients.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    }
    const q = searchQuery.toLowerCase().trim();
    return this.data.patients.filter(p => 
      (p.ficheroNumber && p.ficheroNumber.toLowerCase().includes(q)) ||
      (p.firstName && p.firstName.toLowerCase().includes(q)) ||
      (p.lastName && p.lastName.toLowerCase().includes(q)) ||
      (p.dni && p.dni.replace(/\./g, '').includes(q.replace(/\./g, ''))) ||
      (p.phone && p.phone.includes(q)) ||
      (p.insurance && p.insurance.toLowerCase().includes(q))
    );
  }

  getPatientById(id) {
    return this.data.patients.find(p => p.id === id);
  }

  createPatient(patientData) {
    const nextFicheroNum = `F-${this.data.ficheroSequence++}`;
    const newPatient = {
      id: `pat-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      ficheroNumber: patientData.ficheroNumber || nextFicheroNum,
      firstName: patientData.firstName || '',
      lastName: patientData.lastName || '',
      dni: patientData.dni || '',
      phone: patientData.phone || '',
      email: patientData.email || '',
      birthDate: patientData.birthDate || '',
      insurance: patientData.insurance || 'Particular',
      insuranceNumber: patientData.insuranceNumber || '',
      allergies: patientData.allergies || 'Ninguna referida',
      bloodType: patientData.bloodType || 'Sin especificar',
      emergencyContact: patientData.emergencyContact || '',
      notes: patientData.notes || '',
      createdAt: new Date().toISOString()
    };

    this.data.patients.unshift(newPatient);
    this.persist();
    return newPatient;
  }

  updatePatient(id, patientData) {
    const idx = this.data.patients.findIndex(p => p.id === id);
    if (idx === -1) return null;
    this.data.patients[idx] = { ...this.data.patients[idx], ...patientData, updatedAt: new Date().toISOString() };
    this.persist();
    return this.data.patients[idx];
  }

  deletePatient(id) {
    const initialLen = this.data.patients.length;
    this.data.patients = this.data.patients.filter(p => p.id !== id);
    if (this.data.patients.length !== initialLen) {
      this.persist();
      return true;
    }
    return false;
  }

  // --- APPOINTMENTS & AGENDA ---
  getAppointments({ date, startDate, endDate, doctorId, status } = {}) {
    let result = [...this.data.appointments];

    if (date) {
      result = result.filter(a => a.date === date);
    } else if (startDate && endDate) {
      result = result.filter(a => a.date >= startDate && a.date <= endDate);
    }

    if (doctorId && doctorId !== 'all') {
      result = result.filter(a => a.doctorId === doctorId);
    }

    if (status && status !== 'all') {
      result = result.filter(a => a.status === status);
    }

    return result.sort((a, b) => {
      const dateCompare = a.date.localeCompare(b.date);
      if (dateCompare !== 0) return dateCompare;
      return a.time.localeCompare(b.time);
    });
  }

  getAppointmentById(id) {
    return this.data.appointments.find(a => a.id === id);
  }

  getAppointmentByToken(token) {
    return this.data.appointments.find(a => a.token === token);
  }

  createAppointment(appointmentData) {
    const id = `apt-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const token = `tok_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    
    let patient = null;
    if (appointmentData.patientId) {
      patient = this.getPatientById(appointmentData.patientId);
    }

    const newAppointment = {
      id,
      patientId: appointmentData.patientId || null,
      patientName: patient ? `${patient.firstName} ${patient.lastName}` : (appointmentData.patientName || 'Paciente sin registrar'),
      patientPhone: patient ? patient.phone : (appointmentData.patientPhone || ''),
      ficheroNumber: patient ? patient.ficheroNumber : (appointmentData.ficheroNumber || 'S/F'),
      doctorId: appointmentData.doctorId || 'doc-1',
      doctorName: appointmentData.doctorName || 'Profesional Asignado',
      specialty: appointmentData.specialty || 'Consulta General',
      date: appointmentData.date || new Date().toISOString().split('T')[0],
      time: appointmentData.time || '09:00',
      durationMinutes: Number(appointmentData.durationMinutes) || 15,
      isOverturn: Boolean(appointmentData.isOverturn),
      status: appointmentData.status || 'pending',
      whatsappStatus: appointmentData.whatsappStatus || 'not_sent',
      token,
      notes: appointmentData.notes || '',
      createdAt: new Date().toISOString()
    };

    this.data.appointments.push(newAppointment);
    this.persist();
    return newAppointment;
  }

  updateAppointment(id, updateData) {
    const idx = this.data.appointments.findIndex(a => a.id === id);
    if (idx === -1) return null;
    
    if (updateData.patientId && updateData.patientId !== this.data.appointments[idx].patientId) {
      const patient = this.getPatientById(updateData.patientId);
      if (patient) {
        updateData.patientName = `${patient.firstName} ${patient.lastName}`;
        updateData.patientPhone = patient.phone;
        updateData.ficheroNumber = patient.ficheroNumber;
      }
    }

    this.data.appointments[idx] = {
      ...this.data.appointments[idx],
      ...updateData,
      updatedAt: new Date().toISOString()
    };
    this.persist();
    return this.data.appointments[idx];
  }

  deleteAppointment(id) {
    const initialLen = this.data.appointments.length;
    this.data.appointments = this.data.appointments.filter(a => a.id !== id);
    if (this.data.appointments.length !== initialLen) {
      this.persist();
      return true;
    }
    return false;
  }

  // --- DAY SUMMARY / TOTALIZER ---
  getDaySummary(date) {
    const dayAppointments = this.data.appointments.filter(a => a.date === date);
    
    return {
      date,
      total: dayAppointments.length,
      confirmed: dayAppointments.filter(a => a.status === 'confirmed').length,
      pending: dayAppointments.filter(a => a.status === 'pending').length,
      waiting: dayAppointments.filter(a => a.status === 'waiting').length,
      attended: dayAppointments.filter(a => a.status === 'attended').length,
      cancelled: dayAppointments.filter(a => a.status === 'cancelled').length,
      absent: dayAppointments.filter(a => a.status === 'absent').length,
      overturns: dayAppointments.filter(a => a.isOverturn).length,
      totalMinutesScheduled: dayAppointments
        .filter(a => a.status !== 'cancelled')
        .reduce((sum, a) => sum + (a.durationMinutes || 15), 0)
    };
  }

  getDaysSummaries(startDate, endDate) {
    const summaries = {};
    const appointments = this.data.appointments.filter(a => a.date >= startDate && a.date <= endDate);
    
    appointments.forEach(a => {
      if (!summaries[a.date]) {
        summaries[a.date] = {
          date: a.date,
          total: 0,
          confirmed: 0,
          pending: 0,
          waiting: 0,
          attended: 0,
          cancelled: 0,
          absent: 0,
          overturns: 0,
          totalMinutesScheduled: 0
        };
      }
      summaries[a.date].total++;
      if (a.isOverturn) summaries[a.date].overturns++;
      if (a.status === 'confirmed') summaries[a.date].confirmed++;
      else if (a.status === 'pending') summaries[a.date].pending++;
      else if (a.status === 'waiting') summaries[a.date].waiting++;
      else if (a.status === 'attended') summaries[a.date].attended++;
      else if (a.status === 'cancelled') summaries[a.date].cancelled++;
      else if (a.status === 'absent') summaries[a.date].absent++;

      if (a.status !== 'cancelled') {
        summaries[a.date].totalMinutesScheduled += (a.durationMinutes || 15);
      }
    });

    return summaries;
  }

  // --- MEDICAL RECORDS ---
  getMedicalRecords({ patientId, specialtySlug } = {}) {
    let result = [...this.data.medicalRecords];
    if (patientId) {
      result = result.filter(r => r.patientId === patientId);
    }
    if (specialtySlug) {
      result = result.filter(r => r.specialtySlug === specialtySlug);
    }
    return result.sort((a, b) => b.date.localeCompare(a.date));
  }

  getMedicalRecordById(id) {
    return this.data.medicalRecords.find(r => r.id === id);
  }

  createMedicalRecord(recordData) {
    const newRecord = {
      id: `rec-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      patientId: recordData.patientId,
      doctorId: recordData.doctorId || 'doc-1',
      doctorName: recordData.doctorName || 'Profesional Médico',
      specialty: recordData.specialty || 'Clínica Médica',
      specialtySlug: recordData.specialtySlug || 'medicina_general',
      date: recordData.date || new Date().toISOString().split('T')[0],
      reason: recordData.reason || 'Consulta médica',
      vitalSigns: recordData.vitalSigns || {},
      anamnesis: recordData.anamnesis || '',
      diagnosis: recordData.diagnosis || '',
      treatmentPlan: recordData.treatmentPlan || '',
      specialtyData: recordData.specialtyData || {},
      prescriptions: recordData.prescriptions || [],
      attachments: recordData.attachments || [],
      createdAt: new Date().toISOString()
    };

    this.data.medicalRecords.unshift(newRecord);
    this.persist();
    return newRecord;
  }

  updateMedicalRecord(id, recordData) {
    const idx = this.data.medicalRecords.findIndex(r => r.id === id);
    if (idx === -1) return null;
    this.data.medicalRecords[idx] = {
      ...this.data.medicalRecords[idx],
      ...recordData,
      updatedAt: new Date().toISOString()
    };
    this.persist();
    return this.data.medicalRecords[idx];
  }

  // --- WHATSAPP LOGS ---
  addWhatsappLog(log) {
    const newLog = {
      id: `wlog-${Date.now()}`,
      timestamp: new Date().toISOString(),
      ...log
    };
    this.data.whatsappLogs.unshift(newLog);
    this.persist();
    return newLog;
  }

  getWhatsappLogs() {
    return this.data.whatsappLogs.slice(0, 100);
  }

  // --- SUBSCRIPTION & SAAS BILLING ---
  getSubscription() {
    return this.data.subscription;
  }

  changePlan(planId, paymentMethod = null) {
    const planConfigs = {
      basic: {
        planName: 'Plan Básico (Consultorio Individual)',
        price: 15000,
        maxDoctors: 1
      },
      professional: {
        planName: 'Plan Profesional (Hasta 5 Médicos)',
        price: 29000,
        maxDoctors: 5
      },
      enterprise: {
        planName: 'Plan Corporativo (Centro Médico Ilimitado)',
        price: 55000,
        maxDoctors: 999
      }
    };

    const target = planConfigs[planId] || planConfigs.professional;
    const today = new Date().toISOString().split('T')[0];
    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    const nextBillingDate = nextMonth.toISOString().split('T')[0];

    const newInvoice = {
      id: `INV-${Date.now().toString().slice(-6)}`,
      date: today,
      amount: target.price,
      currency: 'ARS',
      status: 'paid',
      description: `Suscripción Mensual - ${target.planName}`
    };

    this.data.subscription = {
      ...this.data.subscription,
      planId,
      planName: target.planName,
      price: target.price,
      status: 'active',
      startDate: today,
      nextBillingDate,
      limits: {
        ...this.data.subscription.limits,
        maxDoctors: target.maxDoctors
      },
      paymentMethod: paymentMethod || this.data.subscription.paymentMethod,
      invoices: [newInvoice, ...(this.data.subscription.invoices || [])]
    };

    this.persist();
    return this.data.subscription;
  }

  cancelSubscription() {
    this.data.subscription.status = 'cancelled';
    this.data.subscription.autoRenew = false;
    this.persist();
    return this.data.subscription;
  }
}

export const db = new Database();
