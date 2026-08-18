import { PrismaClient } from '../src/generated/prisma/index.js';
import { PrismaPg } from '@prisma/adapter-pg';
import crypto from 'crypto';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

// --- CLINIC INFO & REGISTRATION (ONBOARDING) ---
export async function getClinic() {
  const clinic = await prisma.clinic.findFirst();
  if (!clinic) return null;
  const { passwordHash, ...safe } = clinic;
  return safe;
}

export async function validateLogin(email, password) {
  const clinic = await prisma.clinic.findFirst();
  if (!clinic || !clinic.email || !clinic.passwordHash) {
    return { success: false, error: 'No hay cuenta registrada. Creá una cuenta primero.' };
  }
  if (clinic.email.toLowerCase() !== email.toLowerCase()) {
    return { success: false, error: 'Email incorrecto.' };
  }
  if (clinic.passwordHash !== hashPassword(password)) {
    return { success: false, error: 'Contraseña incorrecta.' };
  }
  return {
    success: true,
    data: { name: clinic.name, adminName: clinic.adminName, email: clinic.email }
  };
}

export async function updateClinic(clinicData) {
  let clinic = await prisma.clinic.findFirst();
  if (!clinic) {
    clinic = await prisma.clinic.create({ data: { ...clinicData } });
  } else {
    clinic = await prisma.clinic.update({ where: { id: clinic.id }, data: clinicData });
  }
  const { passwordHash, ...safe } = clinic;
  return safe;
}

export async function registerClinicAccount({ adminName, email, password, clinicName, phone, specialty, planId, initialDoctors = [] }) {
  const today = new Date().toISOString().split('T')[0];
  const nextMonth = new Date();
  nextMonth.setMonth(nextMonth.getMonth() + 1);
  const nextBillingDate = nextMonth.toISOString().split('T')[0];

  // Upsert clinic (replace if exists)
  let clinic = await prisma.clinic.findFirst();
  if (clinic) {
    clinic = await prisma.clinic.update({
      where: { id: clinic.id },
      data: {
        name: clinicName || 'Nueva Clínica',
        adminName: adminName || 'Administrador',
        email: email || '',
        passwordHash: password ? hashPassword(password) : '',
        phone: phone || '',
        specialty: specialty || 'Policonsultorio'
      }
    });
  } else {
    clinic = await prisma.clinic.create({
      data: {
        name: clinicName || 'Nueva Clínica',
        adminName: adminName || 'Administrador',
        email: email || '',
        passwordHash: password ? hashPassword(password) : '',
        phone: phone || '',
        specialty: specialty || 'Policonsultorio'
      }
    });
  }

  // Replace doctors
  await prisma.doctor.deleteMany({ where: { clinicId: clinic.id } });
  if (initialDoctors.length > 0) {
    await prisma.doctor.createMany({
      data: initialDoctors.map((doc, idx) => ({
        name: doc.name || `Dr. Profesional ${idx + 1}`,
        specialty: doc.specialty || 'Medicina General',
        specialtySlug: doc.specialtySlug || 'medicina_general',
        license: doc.license || '',
        phone: doc.phone || phone || '',
        email: doc.email || '',
        color: doc.color || '#0d9488',
        room: doc.room || `Consultorio ${idx + 1}`,
        intervalMinutes: Number(doc.defaultSlotMinutes) || 15,
        clinicId: clinic.id
      }))
    });
  }

  // Set subscription
  const planConfigs = {
    basic: { planName: 'Plan Básico (Consultorio Individual)', price: 15000, maxDoctors: 1 },
    professional: { planName: 'Plan Profesional (Hasta 5 Médicos)', price: 29000, maxDoctors: 5 },
    enterprise: { planName: 'Plan Corporativo (Centro Médico Ilimitado)', price: 55000, maxDoctors: 999 }
  };
  const target = planConfigs[planId] || planConfigs.professional;

  const existingSub = await prisma.subscription.findUnique({ where: { clinicId: clinic.id } });
  const subData = {
    planId: planId || 'professional',
    planName: target.planName,
    price: target.price,
    status: 'active',
    startDate: today,
    nextBillingDate,
    autoRenew: true,
    limits: { maxDoctors: target.maxDoctors, maxAppointmentsPerMonth: 99999, whatsappBotIncluded: true, ficheroIncluded: true, ehrSpecialties: true },
    paymentMethod: {},
    invoices: [{ id: `INV-${Date.now().toString().slice(-6)}`, date: today, amount: target.price, currency: 'ARS', status: 'paid', description: `Suscripción Mensual - ${target.planName}` }]
  };

  if (existingSub) {
    await prisma.subscription.update({ where: { clinicId: clinic.id }, data: subData });
  } else {
    await prisma.subscription.create({ data: { ...subData, clinicId: clinic.id } });
  }

  const doctors = await prisma.doctor.findMany({ where: { clinicId: clinic.id } });
  const subscription = await prisma.subscription.findUnique({ where: { clinicId: clinic.id } });

  return { clinic, doctors, subscription };
}

// --- DOCTORS ---
export async function getDoctors() {
  const clinic = await prisma.clinic.findFirst();
  if (!clinic) return [];
  return prisma.doctor.findMany({ where: { clinicId: clinic.id }, orderBy: { createdAt: 'asc' } });
}

export async function getDoctorById(id) {
  return prisma.doctor.findUnique({ where: { id } });
}

export async function createDoctor(doctorData) {
  const clinic = await prisma.clinic.findFirst();
  if (!clinic) throw new Error('No hay clínica registrada');
  const doctorCount = await prisma.doctor.count({ where: { clinicId: clinic.id } });
  return prisma.doctor.create({
    data: {
      name: doctorData.name || 'Nuevo Profesional',
      specialty: doctorData.specialty || 'Medicina General',
      specialtySlug: doctorData.specialtySlug || 'medicina_general',
      license: doctorData.license || '',
      phone: doctorData.phone || '',
      email: doctorData.email || '',
      color: doctorData.color || '#0d9488',
      room: doctorData.room || `Consultorio ${doctorCount + 1}`,
      intervalMinutes: Number(doctorData.intervalMinutes || doctorData.defaultSlotMinutes) || 15,
      clinicId: clinic.id
    }
  });
}

export async function updateDoctor(id, doctorData) {
  try {
    return await prisma.doctor.update({ where: { id }, data: doctorData });
  } catch {
    return null;
  }
}

export async function deleteDoctor(id) {
  try {
    await prisma.doctor.delete({ where: { id } });
    return true;
  } catch {
    return false;
  }
}

// --- PATIENTS & FICHERO ---
export async function getPatients(searchQuery = '') {
  const clinic = await prisma.clinic.findFirst();
  if (!clinic) return [];

  if (!searchQuery || !searchQuery.trim()) {
    return prisma.patient.findMany({ where: { clinicId: clinic.id }, orderBy: { createdAt: 'desc' } });
  }

  const q = searchQuery.trim();
  const dniClean = q.replace(/\./g, '');

  return prisma.patient.findMany({
    where: {
      clinicId: clinic.id,
      OR: [
        { ficheroNumber: { contains: q, mode: 'insensitive' } },
        { firstName: { contains: q, mode: 'insensitive' } },
        { lastName: { contains: q, mode: 'insensitive' } },
        { dni: { contains: dniClean } },
        { phone: { contains: q } },
        { insurance: { contains: q, mode: 'insensitive' } }
      ]
    },
    orderBy: { createdAt: 'desc' }
  });
}

export async function getPatientById(id) {
  return prisma.patient.findUnique({ where: { id } });
}

export async function createPatient(patientData) {
  const clinic = await prisma.clinic.findFirst();
  if (!clinic) throw new Error('No hay clínica registrada');

  let ficheroNumber = patientData.ficheroNumber;
  if (!ficheroNumber) {
    const lastPatient = await prisma.patient.findFirst({
      where: { clinicId: clinic.id },
      orderBy: { ficheroNumber: 'desc' }
    });
    const lastNum = lastPatient ? parseInt(lastPatient.ficheroNumber.replace('F-', ''), 10) : 10239;
    ficheroNumber = `F-${lastNum + 1}`;
  }

  return prisma.patient.create({
    data: {
      ficheroNumber,
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
      clinicId: clinic.id
    }
  });
}

export async function bulkCreatePatients(patientsArray) {
  const clinic = await prisma.clinic.findFirst();
  if (!clinic) throw new Error('No hay clínica registrada');

  const existingPatients = await prisma.patient.findMany({
    where: { clinicId: clinic.id },
    select: { dni: true, ficheroNumber: true }
  });

  const existingDnis = new Set(existingPatients.map(p => p.dni).filter(Boolean));
  const existingFicheros = new Set(existingPatients.map(p => p.ficheroNumber).filter(Boolean));

  // Find current max fichero number
  const lastPatient = await prisma.patient.findFirst({
    where: { clinicId: clinic.id },
    orderBy: { ficheroNumber: 'desc' }
  });
  let ficheroSeq = lastPatient ? parseInt(lastPatient.ficheroNumber.replace('F-', ''), 10) : 10239;

  let created = 0;
  let skipped = 0;
  const errors = [];
  const toCreate = [];

  for (const patientData of patientsArray) {
    const dni = (patientData.dni || '').replace(/\./g, '').trim();
    const fichero = (patientData.ficheroNumber || '').trim();

    if (!patientData.firstName || !patientData.lastName) {
      errors.push({ row: patientData._row, error: 'Faltan nombre o apellido' });
      skipped++;
      continue;
    }
    if (dni && existingDnis.has(dni)) {
      errors.push({ row: patientData._row, error: `DNI ${dni} ya existe` });
      skipped++;
      continue;
    }

    let ficheroNumber = fichero;
    if (!ficheroNumber) {
      ficheroNumber = `F-${++ficheroSeq}`;
    } else if (existingFicheros.has(ficheroNumber)) {
      errors.push({ row: patientData._row, error: `Fichero ${ficheroNumber} ya existe` });
      skipped++;
      continue;
    }

    toCreate.push({
      ficheroNumber,
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
      clinicId: clinic.id
    });

    if (dni) existingDnis.add(dni);
    existingFicheros.add(ficheroNumber);
    created++;
  }

  if (toCreate.length > 0) {
    await prisma.patient.createMany({ data: toCreate });
  }

  return { created, skipped, errors };
}

export async function updatePatient(id, patientData) {
  try {
    return await prisma.patient.update({ where: { id }, data: patientData });
  } catch {
    return null;
  }
}

export async function deletePatient(id) {
  try {
    await prisma.patient.delete({ where: { id } });
    return true;
  } catch {
    return false;
  }
}

// --- APPOINTMENTS & AGENDA ---
export async function getAppointments({ date, startDate, endDate, doctorId, status } = {}) {
  const clinic = await prisma.clinic.findFirst();
  if (!clinic) return [];

  const where = { clinicId: clinic.id };

  if (date) {
    where.date = date;
  } else if (startDate && endDate) {
    where.date = { gte: startDate, lte: endDate };
  }

  if (doctorId && doctorId !== 'all') {
    where.doctorId = doctorId;
  }

  if (status && status !== 'all') {
    where.status = status;
  }

  return prisma.appointment.findMany({
    where,
    orderBy: [{ date: 'asc' }, { time: 'asc' }]
  });
}

export async function getAppointmentById(id) {
  return prisma.appointment.findUnique({ where: { id } });
}

export async function getAppointmentByToken(token) {
  return prisma.appointment.findUnique({ where: { confirmationToken: token } });
}

export async function createAppointment(appointmentData) {
  const clinic = await prisma.clinic.findFirst();
  if (!clinic) throw new Error('No hay clínica registrada');

  const token = `tok_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

  let patient = null;
  if (appointmentData.patientId) {
    patient = await prisma.patient.findUnique({ where: { id: appointmentData.patientId } });
  }

  return prisma.appointment.create({
    data: {
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
      confirmationToken: token,
      notes: appointmentData.notes || '',
      clinicId: clinic.id
    }
  });
}

export async function updateAppointment(id, updateData) {
  try {
    if (updateData.patientId) {
      const patient = await prisma.patient.findUnique({ where: { id: updateData.patientId } });
      if (patient) {
        updateData.patientName = `${patient.firstName} ${patient.lastName}`;
        updateData.patientPhone = patient.phone;
        updateData.ficheroNumber = patient.ficheroNumber;
      }
    }
    return await prisma.appointment.update({ where: { id }, data: updateData });
  } catch {
    return null;
  }
}

export async function deleteAppointment(id) {
  try {
    await prisma.appointment.delete({ where: { id } });
    return true;
  } catch {
    return false;
  }
}

// --- DAY SUMMARY / TOTALIZER ---
export async function getDaySummary(date) {
  const clinic = await prisma.clinic.findFirst();
  if (!clinic) return { date, total: 0, confirmed: 0, pending: 0, waiting: 0, attended: 0, cancelled: 0, absent: 0, overturns: 0, totalMinutesScheduled: 0 };

  const dayAppointments = await prisma.appointment.findMany({
    where: { clinicId: clinic.id, date }
  });

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

export async function getDaysSummaries(startDate, endDate) {
  const clinic = await prisma.clinic.findFirst();
  if (!clinic) return {};

  const appointments = await prisma.appointment.findMany({
    where: { clinicId: clinic.id, date: { gte: startDate, lte: endDate } }
  });

  const summaries = {};
  appointments.forEach(a => {
    if (!summaries[a.date]) {
      summaries[a.date] = {
        date: a.date, total: 0, confirmed: 0, pending: 0, waiting: 0,
        attended: 0, cancelled: 0, absent: 0, overturns: 0, totalMinutesScheduled: 0
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
    if (a.status !== 'cancelled') summaries[a.date].totalMinutesScheduled += (a.durationMinutes || 15);
  });

  return summaries;
}

// --- MEDICAL RECORDS ---
export async function getMedicalRecords({ patientId, specialtySlug } = {}) {
  const clinic = await prisma.clinic.findFirst();
  if (!clinic) return [];

  const where = { clinicId: clinic.id };
  if (patientId) where.patientId = patientId;
  if (specialtySlug) where.specialtySlug = specialtySlug;

  return prisma.medicalRecord.findMany({ where, orderBy: { date: 'desc' } });
}

export async function getMedicalRecordById(id) {
  return prisma.medicalRecord.findUnique({ where: { id } });
}

export async function createMedicalRecord(recordData) {
  const clinic = await prisma.clinic.findFirst();
  if (!clinic) throw new Error('No hay clínica registrada');

  return prisma.medicalRecord.create({
    data: {
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
      clinicId: clinic.id
    }
  });
}

export async function updateMedicalRecord(id, recordData) {
  try {
    return await prisma.medicalRecord.update({ where: { id }, data: recordData });
  } catch {
    return null;
  }
}

// --- WHATSAPP LOGS ---
export async function addWhatsappLog(log) {
  const clinic = await prisma.clinic.findFirst();
  if (!clinic) throw new Error('No hay clínica registrada');

  return prisma.whatsAppLog.create({
    data: {
      type: log.type || 'UNKNOWN',
      appointmentId: log.appointmentId || '',
      patientName: log.patientName || '',
      phone: log.phone || '',
      message: log.messagePreview || log.message || '',
      status: log.status || 'sent',
      clinicId: clinic.id
    }
  });
}

export async function getWhatsappLogs() {
  const clinic = await prisma.clinic.findFirst();
  if (!clinic) return [];
  return prisma.whatsAppLog.findMany({
    where: { clinicId: clinic.id },
    orderBy: { timestamp: 'desc' },
    take: 100
  });
}

// --- SUBSCRIPTION & SAAS BILLING ---
export async function getSubscription() {
  const clinic = await prisma.clinic.findFirst();
  if (!clinic) return null;
  return prisma.subscription.findUnique({ where: { clinicId: clinic.id } });
}

export async function changePlan(planId, paymentMethod = null) {
  const clinic = await prisma.clinic.findFirst();
  if (!clinic) throw new Error('No hay clínica registrada');

  const planConfigs = {
    basic: { planName: 'Plan Básico (Consultorio Individual)', price: 15000, maxDoctors: 1 },
    professional: { planName: 'Plan Profesional (Hasta 5 Médicos)', price: 29000, maxDoctors: 5 },
    enterprise: { planName: 'Plan Corporativo (Centro Médico Ilimitado)', price: 55000, maxDoctors: 999 }
  };

  const target = planConfigs[planId] || planConfigs.professional;
  const today = new Date().toISOString().split('T')[0];
  const nextMonth = new Date();
  nextMonth.setMonth(nextMonth.getMonth() + 1);
  const nextBillingDate = nextMonth.toISOString().split('T')[0];

  const existingSub = await prisma.subscription.findUnique({ where: { clinicId: clinic.id } });
  const currentInvoices = existingSub?.invoices || [];

  const newInvoice = {
    id: `INV-${Date.now().toString().slice(-6)}`,
    date: today,
    amount: target.price,
    currency: 'ARS',
    status: 'paid',
    description: `Suscripción Mensual - ${target.planName}`
  };

  const subData = {
    planId,
    planName: target.planName,
    price: target.price,
    status: 'active',
    startDate: today,
    nextBillingDate,
    autoRenew: true,
    limits: { maxDoctors: target.maxDoctors, maxAppointmentsPerMonth: 99999, whatsappBotIncluded: true, ficheroIncluded: true, ehrSpecialties: true },
    paymentMethod: paymentMethod || existingSub?.paymentMethod || {},
    invoices: [newInvoice, ...currentInvoices]
  };

  if (existingSub) {
    return prisma.subscription.update({ where: { clinicId: clinic.id }, data: subData });
  }
  return prisma.subscription.create({ data: { ...subData, clinicId: clinic.id } });
}

export async function cancelSubscription() {
  const clinic = await prisma.clinic.findFirst();
  if (!clinic) throw new Error('No hay clínica registrada');

  return prisma.subscription.update({
    where: { clinicId: clinic.id },
    data: { status: 'cancelled', autoRenew: false }
  });
}
