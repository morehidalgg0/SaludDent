import { PrismaClient } from '../src/generated/prisma/index.js';
import { PrismaPg } from '@prisma/adapter-pg';
import 'dotenv/config';
import crypto from 'crypto';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

function getDateOffset(daysOffset = 0) {
  const base = new Date('2026-08-16T12:00:00');
  base.setDate(base.getDate() + daysOffset);
  return base.toISOString().split('T')[0];
}

async function main() {
  console.log('Seeding database...');

  // Clean existing data
  await prisma.whatsAppLog.deleteMany();
  await prisma.medicalRecord.deleteMany();
  await prisma.appointment.deleteMany();
  await prisma.patient.deleteMany();
  await prisma.doctor.deleteMany();
  await prisma.subscription.deleteMany();
  await prisma.clinic.deleteMany();

  // Create clinic
  const clinic = await prisma.clinic.create({
    data: {
      name: 'Clínica SaludConnect',
      adminName: 'Administración Central',
      email: 'admin@saludconnect.com',
      passwordHash: hashPassword('admin123'),
      phone: '+54 9 11 4455-8899',
      address: 'Av. Santa Fe 2450, Piso 3',
      specialty: 'Centro Médico Multidisciplinario'
    }
  });

  console.log(`Clinic created: ${clinic.name} (id: ${clinic.id})`);

  // Create doctors
  const doctorsData = [
    { name: 'Dra. Florencia Rossi', specialty: 'Odontología', specialtySlug: 'odontologia', license: 'MN 48.912', phone: '+54 9 11 4455-8899', color: '#0d9488', room: 'Consultorio 1 (Odonto)', intervalMinutes: 15 },
    { name: 'Lic. Martín Benítez', specialty: 'Kinesiología y Fisioterapia', specialtySlug: 'kinesiologia', license: 'MN 31.420', phone: '+54 9 11 5566-7788', color: '#0284c7', room: 'Gimnasio Terapéutico / Box 2', intervalMinutes: 30 },
    { name: 'Lic. Luciana Gómez', specialty: 'Nutrición y Dietética', specialtySlug: 'nutricion', license: 'MN 55.103', phone: '+54 9 11 6677-8899', color: '#16a34a', room: 'Consultorio 3', intervalMinutes: 30 },
    { name: 'Dr. Alejandro Morales', specialty: 'Medicina General / Clínica Médica', specialtySlug: 'medicina_general', license: 'MN 72.844', phone: '+54 9 11 3322-1144', color: '#6366f1', room: 'Consultorio 4', intervalMinutes: 15 },
    { name: 'Lic. Camila Valenzuela', specialty: 'Psicología y Salud Mental', specialtySlug: 'psicologia', license: 'MN 49.330', phone: '+54 9 11 7788-9900', color: '#8b5cf6', room: 'Consultorio 5', intervalMinutes: 45 },
    { name: 'Dra. Sofía Navarro', specialty: 'Pediatría', specialtySlug: 'pediatria', license: 'MN 60.119', phone: '+54 9 11 9988-7766', color: '#ea580c', room: 'Consultorio 6 (Pediatría)', intervalMinutes: 20 },
    { name: 'Dr. Esteban Roldán', specialty: 'Oftalmología', specialtySlug: 'oftalmologia', license: 'MN 51.490', phone: '+54 9 11 2233-4455', color: '#0891b2', room: 'Consultorio 7 (Oftalmo)', intervalMinutes: 15 }
  ];

  const createdDoctors = [];
  for (const doc of doctorsData) {
    const d = await prisma.doctor.create({ data: { ...doc, clinicId: clinic.id } });
    createdDoctors.push(d);
  }
  console.log(`${createdDoctors.length} doctors created`);

  // Create patients
  const patientsData = [
    { ficheroNumber: 'F-10240', firstName: 'Valentina', lastName: 'Herrera', dni: '38.942.105', phone: '+54 9 11 5821-9944', email: 'v.herrera@gmail.com', birthDate: '1994-06-14', insurance: 'OSDE 310', insuranceNumber: '310-84729104-01', allergies: 'Penicilina, Sulfas', bloodType: 'A+', emergencyContact: 'Carlos Herrera (Padre) - +54 9 11 4400-1122', notes: 'Paciente con tratamiento de ortodoncia y bruxismo nocturno.' },
    { ficheroNumber: 'F-10241', firstName: 'Matías', lastName: 'Sánchez', dni: '34.512.809', phone: '+54 9 11 6390-1284', email: 'matias.sanchez@outlook.com', birthDate: '1989-11-23', insurance: 'Swiss Medical', insuranceNumber: 'SM-902341-2', allergies: 'Ninguna conocida', bloodType: '0+', emergencyContact: 'Marina Díaz (Esposa) - +54 9 11 3211-9988', notes: 'Rehabilitación por esguince de tobillo grado II en fútbol.' },
    { ficheroNumber: 'F-10242', firstName: 'Joaquín', lastName: 'Pérez Molina', dni: '42.115.930', phone: '+54 9 11 4055-7711', email: 'joaco.perez@yahoo.com.ar', birthDate: '1999-03-08', insurance: 'Galeno Oro', insuranceNumber: 'GAL-550921-A', allergies: 'AINEs (Ibuprofeno)', bloodType: 'B+', emergencyContact: 'Laura Molina (Madre) - +54 9 11 5544-3322', notes: 'Plan de descenso de grasa corporal y ganancia de masa muscular.' },
    { ficheroNumber: 'F-10243', firstName: 'Mariana', lastName: 'Alonso', dni: '29.740.332', phone: '+54 9 11 7120-4499', email: 'mariana.alonso@gmail.com', birthDate: '1982-08-19', insurance: 'Medifé Plata', insuranceNumber: 'MED-889123-0', allergies: 'Latex', bloodType: '0-', emergencyContact: 'Esteban Alonso (Hermano) - +54 9 11 8877-6655', notes: 'Seguimiento por hipertensión arterial leve y control oftalmológico anual.' },
    { ficheroNumber: 'F-10244', firstName: 'Lucas', lastName: 'Ramírez', dni: '54.120.984', phone: '+54 9 11 3901-4477', email: 'padres.lucasramirez@gmail.com', birthDate: '2021-09-05', insurance: 'IOMA', insuranceNumber: 'IOM-441290-99', allergies: 'Huevo (alergia alimentaria en remisión)', bloodType: 'A-', emergencyContact: 'Romina Castro (Madre) - +54 9 11 3901-4477', notes: 'Control de niño sano 5 años y vacunación de ingreso escolar.' },
    { ficheroNumber: 'F-10245', firstName: 'Beatriz', lastName: 'Castillo', dni: '18.392.110', phone: '+54 9 11 6001-3322', email: 'beatriz.castillo@fibertel.com.ar', birthDate: '1965-04-12', insurance: 'PAMI', insuranceNumber: 'PAM-199402102-00', allergies: 'Yodo / Contrastes', bloodType: '0+', emergencyContact: 'Paula Castillo (Hija) - +54 9 11 6001-3325', notes: 'Control oftalmológico por cataratas y chequeo clínico general.' }
  ];

  const createdPatients = [];
  for (const pat of patientsData) {
    const p = await prisma.patient.create({ data: { ...pat, clinicId: clinic.id } });
    createdPatients.push(p);
  }
  console.log(`${createdPatients.length} patients created`);

  // Create appointments
  const appointmentsData = [
    { patientIdx: 0, doctorIdx: 0, date: getDateOffset(0), time: '08:30', durationMinutes: 30, status: 'confirmed', whatsappStatus: 'confirmed_by_patient', notes: 'Limpieza y revisión de composite en pieza 2.4', confirmationToken: 'token_vh_0830' },
    { patientIdx: 1, doctorIdx: 1, date: getDateOffset(0), time: '09:00', durationMinutes: 45, status: 'waiting', whatsappStatus: 'confirmed_by_patient', notes: 'Sesión 4: Ejercicios propioceptivos y ultrasonido en tobillo derecho', confirmationToken: 'token_ms_0900' },
    { patientIdx: 2, doctorIdx: 2, date: getDateOffset(0), time: '09:30', durationMinutes: 30, status: 'pending', whatsappStatus: 'sent', notes: 'Medición antropométrica mensual y ajuste calórico', confirmationToken: 'token_jp_0930' },
    { patientIdx: 3, doctorIdx: 3, date: getDateOffset(0), time: '10:00', durationMinutes: 15, status: 'confirmed', whatsappStatus: 'confirmed_by_patient', notes: 'Control de laboratorio y ajuste de medicación Enalapril', confirmationToken: 'token_ma_1000' },
    { patientIdx: 5, doctorIdx: 3, date: getDateOffset(0), time: '10:00', durationMinutes: 15, status: 'pending', whatsappStatus: 'sent', notes: 'SOBRETURNO: Cuadro gripal febril de 48hs de evolución', confirmationToken: 'token_bc_1000', isOverturn: true },
    { patientIdx: 4, doctorIdx: 5, date: getDateOffset(0), time: '11:15', durationMinutes: 30, status: 'pending', whatsappStatus: 'sent', notes: 'Control pediátrico y certificado escolar', confirmationToken: 'token_lr_1115' },
    { patientIdx: 0, doctorIdx: 6, date: getDateOffset(0), time: '14:00', durationMinutes: 15, status: 'pending', whatsappStatus: 'not_sent', notes: 'Refracción y fondo de ojo', confirmationToken: 'token_vh_1400' },
    { patientIdx: 1, doctorIdx: 1, date: getDateOffset(1), time: '10:30', durationMinutes: 45, status: 'pending', whatsappStatus: 'not_sent', notes: 'Sesión 5 de kinesiología', confirmationToken: 'token_ms_tomorrow' },
    { patientIdx: 2, doctorIdx: 4, date: getDateOffset(1), time: '16:00', durationMinutes: 45, status: 'confirmed', whatsappStatus: 'confirmed_by_patient', notes: 'Sesión semanal de psicoterapia', confirmationToken: 'token_jp_psy' },
    { patientIdx: 3, doctorIdx: 0, date: getDateOffset(2), time: '11:00', durationMinutes: 30, status: 'pending', whatsappStatus: 'not_sent', notes: 'Revisión general y profilaxis', confirmationToken: 'token_ma_d2' },
    { patientIdx: 5, doctorIdx: 6, date: getDateOffset(3), time: '09:15', durationMinutes: 30, status: 'pending', whatsappStatus: 'not_sent', notes: 'Estudio de fondo de ojo y tonometría', confirmationToken: 'token_bc_d3' },
    { patientIdx: 0, doctorIdx: 2, date: getDateOffset(5), time: '15:00', durationMinutes: 30, status: 'pending', whatsappStatus: 'not_sent', notes: 'Control nutricional deportológico', confirmationToken: 'token_vh_d5' }
  ];

  for (const apt of appointmentsData) {
    const patient = createdPatients[apt.patientIdx];
    const doctor = createdDoctors[apt.doctorIdx];
    await prisma.appointment.create({
      data: {
        patientId: patient.id,
        patientName: `${patient.firstName} ${patient.lastName}`,
        patientPhone: patient.phone,
        ficheroNumber: patient.ficheroNumber,
        doctorId: doctor.id,
        doctorName: doctor.name,
        specialty: doctor.specialty,
        date: apt.date,
        time: apt.time,
        durationMinutes: apt.durationMinutes,
        isOverturn: apt.isOverturn || false,
        status: apt.status,
        whatsappStatus: apt.whatsappStatus,
        confirmationToken: apt.confirmationToken,
        notes: apt.notes,
        clinicId: clinic.id
      }
    });
  }
  console.log(`${appointmentsData.length} appointments created`);

  // Create medical records
  const medicalRecordsData = [
    {
      patientIdx: 0, doctorIdx: 0, date: '2026-07-20', reason: 'Sensibilidad dental en cuadrante superior izquierdo',
      specialty: 'Odontología', specialtySlug: 'odontologia',
      vitalSigns: { bloodPressure: '115/75', heartRate: '72', temperature: '36.5', oxygenSat: '99' },
      anamnesis: 'Paciente refiere molestia al frío y dulce en sector molar superior desde hace 2 semanas.',
      diagnosis: 'K02.1 - Caries de la dentina en pieza 2.4',
      treatmentPlan: 'Apertura cavitaria, remoción de tejido cariado y obturación con resina fotopolimerizable en pieza 2.4.',
      specialtyData: { type: 'odontologia', odontogram: { '24': { status: 'caries', faces: { oclusal: 'caries' } } }, periodontalHealth: 'Gingivitis marginal leve', oralHygieneScore: 'Buena (18%)' },
      prescriptions: [{ medication: 'Ibuprofeno 400mg', dosage: '1 comprimido cada 8hs por 48hs', duration: '2 días' }]
    },
    {
      patientIdx: 1, doctorIdx: 1, date: '2026-08-05', reason: 'Dolor e inestabilidad en tobillo derecho post-traumatismo deportivo',
      specialty: 'Kinesiología y Fisioterapia', specialtySlug: 'kinesiologia',
      vitalSigns: { bloodPressure: '120/80', heartRate: '68', temperature: '36.4' },
      anamnesis: 'Paciente sufrió inversión forzada de tobillo derecho jugando al fútbol hace 10 días.',
      diagnosis: 'S93.4 - Esguince y torcedura del tobillo (LPAA)',
      treatmentPlan: 'Protocolo RICE + Magnetoterapia 20 min, Ultrasonido pulsátil 1MHz, ejercicios propioceptivos.',
      specialtyData: { type: 'kinesiologia', painLevelEva: 6, affectedZones: [{ id: 'ankle-right', label: 'Tobillo Derecho', severity: 'Moderada', painScore: 6 }] },
      prescriptions: [{ medication: 'Tobillera elástica', dosage: 'Uso durante la deambulación', duration: '3 semanas' }]
    },
    {
      patientIdx: 2, doctorIdx: 2, date: '2026-07-15', reason: 'Optimización de composición corporal y rendimiento deportivo',
      specialty: 'Nutrición y Dietética', specialtySlug: 'nutricion',
      vitalSigns: { bloodPressure: '118/74', heartRate: '60' },
      anamnesis: 'Paciente masculino de 27 años, entrena crossfit 4 veces por semana.',
      diagnosis: 'E66.3 - Sobrepeso grado I según IMC',
      treatmentPlan: 'Pauta nutricional hiperproteica (2.0g/kg) con déficit calórico moderado.',
      specialtyData: { type: 'nutricion', anthropometry: { weightKg: 84.5, heightCm: 178, bmi: 26.7, bodyFatPercentage: 21.4 }, nutritionalGoals: { dailyCaloriesKcal: 2350, proteinsGrams: 170, carbohydratesGrams: 245, fatsGrams: 65 } },
      prescriptions: [{ medication: 'Creatina Monohidrato', dosage: '5g diarios post-entrenamiento', duration: 'Continuo' }]
    },
    {
      patientIdx: 3, doctorIdx: 3, date: '2026-06-10', reason: 'Control anual de salud y chequeo de presión arterial',
      specialty: 'Medicina General / Clínica Médica', specialtySlug: 'medicina_general',
      vitalSigns: { bloodPressure: '135/88', heartRate: '76', temperature: '36.6', oxygenSat: '98', bloodGlucose: '94 mg/dL' },
      anamnesis: 'Paciente femenina asintomática. Refiere buen descanso.',
      diagnosis: 'I10 - Hipertensión Esencial (Primaria) Grado 1',
      treatmentPlan: 'Continuar con Enalapril 10mg diario. Pautas higiénico-dietéticas.',
      specialtyData: { type: 'medicina_general', cardiovascularRisk: 'Bajo-Moderado', physicalExam: 'Normoconfigurada, ruidos cardíacos normofonéticos.' },
      prescriptions: [{ medication: 'Enalapril 10 mg', dosage: '1 comprimido por la mañana en ayunas', duration: 'Tratamiento crónico' }]
    }
  ];

  for (const rec of medicalRecordsData) {
    const patient = createdPatients[rec.patientIdx];
    const doctor = createdDoctors[rec.doctorIdx];
    await prisma.medicalRecord.create({
      data: {
        patientId: patient.id,
        doctorId: doctor.id,
        doctorName: doctor.name,
        specialty: rec.specialty,
        specialtySlug: rec.specialtySlug,
        date: rec.date,
        reason: rec.reason,
        vitalSigns: rec.vitalSigns,
        anamnesis: rec.anamnesis,
        diagnosis: rec.diagnosis,
        treatmentPlan: rec.treatmentPlan,
        specialtyData: rec.specialtyData,
        prescriptions: rec.prescriptions,
        attachments: [],
        clinicId: clinic.id
      }
    });
  }
  console.log(`${medicalRecordsData.length} medical records created`);

  // Create subscription
  const today = new Date().toISOString().split('T')[0];
  const nextMonth = new Date();
  nextMonth.setMonth(nextMonth.getMonth() + 1);

  await prisma.subscription.create({
    data: {
      clinicId: clinic.id,
      planId: 'professional',
      planName: 'Plan Profesional (Hasta 5 Médicos)',
      price: 29000,
      status: 'active',
      billingCycle: 'monthly',
      startDate: '2026-08-01',
      nextBillingDate: nextMonth.toISOString().split('T')[0],
      autoRenew: true,
      paymentMethod: { brand: 'Visa', last4: '4291', holder: 'Clínica SaludConnect' },
      limits: { maxDoctors: 5, maxAppointmentsPerMonth: 99999, whatsappBotIncluded: true, ficheroIncluded: true, ehrSpecialties: true },
      invoices: [
        { id: 'INV-2026-08', date: '2026-08-01', amount: 29000, currency: 'ARS', status: 'paid', description: 'Abono Mensual Plan Profesional (Agosto 2026)' },
        { id: 'INV-2026-07', date: '2026-07-01', amount: 29000, currency: 'ARS', status: 'paid', description: 'Abono Mensual Plan Profesional (Julio 2026)' }
      ]
    }
  });
  console.log('Subscription created');

  console.log('Seed completed!');
  console.log(`Login: admin@saludconnect.com / admin123`);
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
