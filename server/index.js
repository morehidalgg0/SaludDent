import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  getClinic, validateLogin, updateClinic, registerClinicAccount,
  getDoctors, getDoctorById, createDoctor, updateDoctor, deleteDoctor,
  getPatients, getPatientById, createPatient, bulkCreatePatients, updatePatient, deletePatient,
  getAppointments, getAppointmentById, getAppointmentByToken, createAppointment, updateAppointment, deleteAppointment,
  getDaySummary, getDaysSummaries,
  getMedicalRecords, getMedicalRecordById, createMedicalRecord, updateMedicalRecord,
  addWhatsappLog, getWhatsappLogs,
  getSubscription, changePlan, cancelSubscription
} from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// --- REAL-TIME SSE ---
const sseClients = new Set();

function broadcastEvent(type, payload, notification = null) {
  const data = JSON.stringify({ type, payload, notification, timestamp: new Date().toISOString() });
  sseClients.forEach(client => {
    try { client.res.write(`data: ${data}\n\n`); }
    catch (err) { sseClients.delete(client); }
  });
}

app.get('/api/events', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders?.();
  const client = { id: Date.now(), res };
  sseClients.add(client);
  res.write(`data: ${JSON.stringify({ type: 'CONNECTED', message: 'Conexión en tiempo real activa' })}\n\n`);
  const keepAliveInterval = setInterval(() => { res.write(`: keep-alive\n\n`); }, 25000);
  req.on('close', () => { clearInterval(keepAliveInterval); sseClients.delete(client); });
});

// --- CLINIC & AUTH ---
app.get('/api/clinic', async (req, res) => {
  try { res.json({ success: true, data: await getClinic() }); }
  catch (err) { res.status(500).json({ success: false, error: err.message }); }
});

app.put('/api/clinic', async (req, res) => {
  try {
    const updated = await updateClinic(req.body);
    broadcastEvent('CLINIC_UPDATED', updated, { title: 'Datos de la Clínica Actualizados', message: updated.name });
    res.json({ success: true, data: updated });
  } catch (err) { res.status(500).json({ success: false, error: err.message }); }
});

app.post('/api/auth/register-clinic', async (req, res) => {
  try {
    const result = await registerClinicAccount(req.body);
    broadcastEvent('CLINIC_REGISTERED', result, {
      title: '¡Clínica Registrada Exitosamente!',
      message: `${result.clinic.name} ha sido configurada con ${result.doctors.length} profesionales.`
    });
    res.status(201).json({ success: true, data: result });
  } catch (err) { res.status(500).json({ success: false, error: err.message }); }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ success: false, error: 'Email y contraseña son obligatorios.' });
    const result = await validateLogin(email, password);
    if (!result.success) return res.status(401).json({ success: false, error: result.error });
    res.json({ success: true, data: result.data });
  } catch (err) { res.status(500).json({ success: false, error: err.message }); }
});

// --- DOCTORS ---
app.get('/api/doctors', async (req, res) => {
  try { res.json({ success: true, data: await getDoctors() }); }
  catch (err) { res.status(500).json({ success: false, error: err.message }); }
});

app.post('/api/doctors', async (req, res) => {
  try {
    const d = await createDoctor(req.body);
    broadcastEvent('DOCTOR_CREATED', d, { title: 'Nuevo Profesional Añadido', message: `${d.name} (${d.specialty})` });
    res.status(201).json({ success: true, data: d });
  } catch (err) { res.status(500).json({ success: false, error: err.message }); }
});

app.put('/api/doctors/:id', async (req, res) => {
  try {
    const updated = await updateDoctor(req.params.id, req.body);
    if (!updated) return res.status(404).json({ success: false, error: 'Profesional no encontrado' });
    broadcastEvent('DOCTOR_UPDATED', updated, { title: 'Profesional Actualizado', message: updated.name });
    res.json({ success: true, data: updated });
  } catch (err) { res.status(500).json({ success: false, error: err.message }); }
});

app.delete('/api/doctors/:id', async (req, res) => {
  try {
    if (!(await deleteDoctor(req.params.id))) return res.status(404).json({ success: false, error: 'Profesional no encontrado' });
    broadcastEvent('DOCTOR_DELETED', { id: req.params.id }, { title: 'Profesional Eliminado', message: 'Se dio de baja al profesional.' });
    res.json({ success: true, message: 'Profesional eliminado correctamente' });
  } catch (err) { res.status(500).json({ success: false, error: err.message }); }
});

// --- PATIENTS ---
app.get('/api/patients', async (req, res) => {
  try { res.json({ success: true, data: await getPatients(req.query.search || '') }); }
  catch (err) { res.status(500).json({ success: false, error: err.message }); }
});

app.get('/api/patients/:id', async (req, res) => {
  try {
    const patient = await getPatientById(req.params.id);
    if (!patient) return res.status(404).json({ success: false, error: 'Paciente no encontrado' });
    const allAppts = await getAppointments();
    const records = await getMedicalRecords({ patientId: patient.id });
    res.json({ success: true, data: { ...patient, appointments: allAppts.filter(a => a.patientId === patient.id), medicalRecords: records } });
  } catch (err) { res.status(500).json({ success: false, error: err.message }); }
});

app.post('/api/patients', async (req, res) => {
  try {
    const p = await createPatient(req.body);
    broadcastEvent('PATIENT_CREATED', p, { title: 'Nuevo Paciente Registrado', message: `${p.firstName} ${p.lastName} (${p.ficheroNumber})` });
    res.status(201).json({ success: true, data: p });
  } catch (err) { res.status(500).json({ success: false, error: err.message }); }
});

app.put('/api/patients/:id', async (req, res) => {
  try {
    const updated = await updatePatient(req.params.id, req.body);
    if (!updated) return res.status(404).json({ success: false, error: 'Paciente no encontrado' });
    res.json({ success: true, data: updated });
  } catch (err) { res.status(500).json({ success: false, error: err.message }); }
});

app.delete('/api/patients/:id', async (req, res) => {
  try {
    if (!(await deletePatient(req.params.id))) return res.status(404).json({ success: false, error: 'Paciente no encontrado' });
    res.json({ success: true, message: 'Paciente eliminado del fichero' });
  } catch (err) { res.status(500).json({ success: false, error: err.message }); }
});

app.post('/api/patients/import', async (req, res) => {
  try {
    const { patients } = req.body;
    if (!Array.isArray(patients) || patients.length === 0) return res.status(400).json({ success: false, error: 'No se enviaron pacientes para importar.' });
    if (patients.length > 1000) return res.status(400).json({ success: false, error: 'Máximo 1000 pacientes por importación.' });
    const result = await bulkCreatePatients(patients);
    broadcastEvent('PATIENT_CREATED', { count: result.created }, { title: 'Importación de Pacientes', message: `Se importaron ${result.created} pacientes. ${result.skipped} saltados.` });
    res.json({ success: true, data: result });
  } catch (err) { res.status(500).json({ success: false, error: err.message }); }
});

// --- APPOINTMENTS ---
app.get('/api/appointments', async (req, res) => {
  try {
    const { date, startDate, endDate, doctorId, status } = req.query;
    res.json({ success: true, data: await getAppointments({ date, startDate, endDate, doctorId, status }) });
  } catch (err) { res.status(500).json({ success: false, error: err.message }); }
});

app.get('/api/appointments/summary', async (req, res) => {
  try {
    const { date, startDate, endDate } = req.query;
    if (date) return res.json({ success: true, data: await getDaySummary(date) });
    if (startDate && endDate) return res.json({ success: true, data: await getDaysSummaries(startDate, endDate) });
    res.json({ success: true, data: await getDaySummary(new Date().toISOString().split('T')[0]) });
  } catch (err) { res.status(500).json({ success: false, error: err.message }); }
});

app.post('/api/appointments', async (req, res) => {
  try {
    const a = await createAppointment(req.body);
    broadcastEvent('APPOINTMENT_CREATED', a, {
      title: a.isOverturn ? 'Nuevo Sobreturno Agendado' : 'Nuevo Turno Agendado',
      message: `${a.patientName} con ${a.doctorName} el ${a.date} a las ${a.time} hs.`
    });
    res.status(201).json({ success: true, data: a });
  } catch (err) { res.status(500).json({ success: false, error: err.message }); }
});

app.put('/api/appointments/:id', async (req, res) => {
  try {
    const updated = await updateAppointment(req.params.id, req.body);
    if (!updated) return res.status(404).json({ success: false, error: 'Turno no encontrado' });
    broadcastEvent('APPOINTMENT_UPDATED', updated, { title: 'Turno Actualizado', message: `Turno de ${updated.patientName} (${updated.date} ${updated.time} hs) modificado.` });
    res.json({ success: true, data: updated });
  } catch (err) { res.status(500).json({ success: false, error: err.message }); }
});

app.delete('/api/appointments/:id', async (req, res) => {
  try {
    const apt = await getAppointmentById(req.params.id);
    if (!(await deleteAppointment(req.params.id))) return res.status(404).json({ success: false, error: 'Turno no encontrado' });
    broadcastEvent('APPOINTMENT_DELETED', { id: req.params.id }, { title: 'Turno Cancelado/Eliminado', message: apt ? `Turno de ${apt.patientName} eliminado.` : 'Turno eliminado.' });
    res.json({ success: true, message: 'Turno eliminado correctamente' });
  } catch (err) { res.status(500).json({ success: false, error: err.message }); }
});

// --- WHATSAPP ---
app.post('/api/whatsapp/reminders/send-single', async (req, res) => {
  try {
    const { appointmentId } = req.body;
    const appointment = await getAppointmentById(appointmentId);
    if (!appointment) return res.status(404).json({ success: false, error: 'Turno no encontrado' });

    const host = req.get('host');
    const protocol = req.protocol;
    const confirmationUrl = `${protocol}://${host}/portal/turno/${appointment.confirmationToken}`;

    const messageTemplate =
`RECORDATORIO DE TURNO - CLINICA SALUDCONNECT

Hola ${appointment.patientName}, le recordamos su turno medico:
Fecha: ${appointment.date}
Hora: ${appointment.time} hs
Profesional: ${appointment.doctorName}
Especialidad: ${appointment.specialty}
N Fichero: ${appointment.ficheroNumber}

Confirme su asistencia en: ${confirmationUrl}

O responda:
1 para Confirmar Turno
2 para Cancelar Turno`;

    const cleanPhone = (appointment.patientPhone || '').replace(/\D/g, '');
    const waLink = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(messageTemplate)}`;

    const updated = await updateAppointment(appointment.id, { whatsappStatus: 'sent' });
    await addWhatsappLog({ type: 'REMINDER_SENT', appointmentId: appointment.id, patientName: appointment.patientName, phone: appointment.patientPhone, messagePreview: messageTemplate.substring(0, 100) + '...' });
    broadcastEvent('WHATSAPP_SENT', updated, { title: 'WhatsApp Enviado', message: `Recordatorio enviado a ${appointment.patientName}` });

    res.json({ success: true, data: { appointment: updated, confirmationUrl, waLink, messageText: messageTemplate } });
  } catch (err) { res.status(500).json({ success: false, error: err.message }); }
});

app.post('/api/whatsapp/reminders/send-batch', async (req, res) => {
  try {
    const targetDate = req.body.date || new Date().toISOString().split('T')[0];
    const appointments = (await getAppointments({ date: targetDate })).filter(a => a.status !== 'cancelled');
    for (const apt of appointments) await updateAppointment(apt.id, { whatsappStatus: 'sent' });
    await addWhatsappLog({ type: 'BATCH_REMINDER_SENT', date: targetDate, count: appointments.length });
    broadcastEvent('WHATSAPP_BATCH_SENT', { date: targetDate, count: appointments.length }, { title: 'Recordatorios Masivos Enviados', message: `Se enviaron recordatorios a ${appointments.length} pacientes del día ${targetDate}.` });
    res.json({ success: true, data: { sentCount: appointments.length, date: targetDate } });
  } catch (err) { res.status(500).json({ success: false, error: err.message }); }
});

app.get('/api/whatsapp/portal/:token', async (req, res) => {
  try {
    const appointment = await getAppointmentByToken(req.params.token);
    if (!appointment) return res.status(404).json({ success: false, error: 'Turno no encontrado o enlace expirado' });
    res.json({ success: true, data: appointment });
  } catch (err) { res.status(500).json({ success: false, error: err.message }); }
});

app.post('/api/whatsapp/respond', async (req, res) => {
  try {
    const { token, appointmentId, action } = req.body;
    let appointment = token ? await getAppointmentByToken(token) : appointmentId ? await getAppointmentById(appointmentId) : null;
    if (!appointment) return res.status(404).json({ success: false, error: 'Turno no encontrado' });

    const isAccept = action === 'accept' || action === 'confirm';
    const updated = await updateAppointment(appointment.id, { status: isAccept ? 'confirmed' : 'cancelled', whatsappStatus: isAccept ? 'confirmed_by_patient' : 'cancelled_by_patient' });
    await addWhatsappLog({ type: isAccept ? 'PATIENT_CONFIRMED' : 'PATIENT_CANCELLED', appointmentId: appointment.id, patientName: appointment.patientName, action: updated.status });
    broadcastEvent('PATIENT_RESPONSE_RECEIVED', updated, { title: isAccept ? 'Turno Confirmado por Paciente' : 'Turno Cancelado por Paciente', message: `${updated.patientName} ha ${isAccept ? 'CONFIRMADO' : 'CANCELADO'} su turno.` });
    res.json({ success: true, message: isAccept ? 'Turno confirmado con éxito!' : 'Turno cancelado correctamente.', data: updated });
  } catch (err) { res.status(500).json({ success: false, error: err.message }); }
});

// --- MEDICAL RECORDS ---
app.get('/api/medical-records', async (req, res) => {
  try { res.json({ success: true, data: await getMedicalRecords({ patientId: req.query.patientId, specialtySlug: req.query.specialtySlug }) }); }
  catch (err) { res.status(500).json({ success: false, error: err.message }); }
});

app.get('/api/medical-records/:id', async (req, res) => {
  try {
    const record = await getMedicalRecordById(req.params.id);
    if (!record) return res.status(404).json({ success: false, error: 'Historia clínica no encontrada' });
    res.json({ success: true, data: record });
  } catch (err) { res.status(500).json({ success: false, error: err.message }); }
});

app.post('/api/medical-records', async (req, res) => {
  try {
    const r = await createMedicalRecord(req.body);
    broadcastEvent('MEDICAL_RECORD_CREATED', r, { title: 'Nueva Evolución en Historia Clínica', message: `Consulta de ${r.specialty} cargada para paciente.` });
    res.status(201).json({ success: true, data: r });
  } catch (err) { res.status(500).json({ success: false, error: err.message }); }
});

app.put('/api/medical-records/:id', async (req, res) => {
  try {
    const updated = await updateMedicalRecord(req.params.id, req.body);
    if (!updated) return res.status(404).json({ success: false, error: 'Historia clínica no encontrada' });
    res.json({ success: true, data: updated });
  } catch (err) { res.status(500).json({ success: false, error: err.message }); }
});

// --- SUBSCRIPTION ---
app.get('/api/subscription', async (req, res) => {
  try { res.json({ success: true, data: await getSubscription() }); }
  catch (err) { res.status(500).json({ success: false, error: err.message }); }
});

app.post('/api/subscription/change-plan', async (req, res) => {
  try {
    const updated = await changePlan(req.body.planId, req.body.paymentMethod);
    broadcastEvent('SUBSCRIPTION_UPDATED', updated, { title: 'Suscripción Actualizada', message: `El plan ha cambiado a ${updated.planName}.` });
    res.json({ success: true, data: updated });
  } catch (err) { res.status(500).json({ success: false, error: err.message }); }
});

app.post('/api/subscription/cancel', async (req, res) => {
  try {
    const updated = await cancelSubscription();
    broadcastEvent('SUBSCRIPTION_UPDATED', updated, { title: 'Suscripción Cancelada', message: 'La renovación automática ha sido desactivada.' });
    res.json({ success: true, data: updated });
  } catch (err) { res.status(500).json({ success: false, error: err.message }); }
});

// Serve frontend in production
const distPath = path.join(__dirname, '..', 'dist');
app.use(express.static(distPath));
app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'), err => {
    if (err) res.json({ status: 'API SaludConnect Operativa', timestamp: new Date().toISOString() });
  });
});

// Start Server (only for local dev, Vercel uses api/index.js)
const PORT = process.env.PORT || 3001;
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Servidor SaludConnect API corriendo en: http://localhost:${PORT}`);
  });
}

export default app;
