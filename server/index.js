import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { db } from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// --- REAL-TIME SSE (Server-Sent Events) CONNECTION POOL ---
const sseClients = new Set();

function broadcastEvent(type, payload, notification = null) {
  const data = JSON.stringify({
    type,
    payload,
    notification,
    timestamp: new Date().toISOString()
  });

  sseClients.forEach(client => {
    try {
      client.res.write(`data: ${data}\n\n`);
    } catch (err) {
      console.error('[SSE] Error enviando a cliente:', err);
      sseClients.delete(client);
    }
  });
}

// SSE Endpoint
app.get('/api/events', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders?.();

  const client = { id: Date.now(), res };
  sseClients.add(client);
  console.log(`[SSE] Cliente conectado (Total: ${sseClients.size})`);

  // Initial heartbeat
  res.write(`data: ${JSON.stringify({ type: 'CONNECTED', message: 'Conexión en tiempo real activa' })}\n\n`);

  const keepAliveInterval = setInterval(() => {
    res.write(`: keep-alive\n\n`);
  }, 25000);

  req.on('close', () => {
    clearInterval(keepAliveInterval);
    sseClients.delete(client);
    console.log(`[SSE] Cliente desconectado (Total: ${sseClients.size})`);
  });
});

// --- CLINIC & ONBOARDING / ACCOUNT REGISTRATION ---
app.get('/api/clinic', (req, res) => {
  try {
    const clinic = db.getClinic();
    res.json({ success: true, data: clinic });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.put('/api/clinic', (req, res) => {
  try {
    const updated = db.updateClinic(req.body);
    broadcastEvent('CLINIC_UPDATED', updated, {
      title: 'Datos de la Clínica Actualizados',
      message: `${updated.name}`
    });
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/auth/register-clinic', (req, res) => {
  try {
    const result = db.registerClinicAccount(req.body);
    broadcastEvent('CLINIC_REGISTERED', result, {
      title: '¡Clínica Registrada Exitosamente!',
      message: `${result.clinic.name} ha sido configurada con ${result.doctors.length} profesionales.`
    });
    res.status(201).json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// --- DOCTORS / PROFESIONALES ---
app.get('/api/doctors', (req, res) => {
  try {
    const doctors = db.getDoctors();
    res.json({ success: true, data: doctors });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/doctors', (req, res) => {
  try {
    const newDoctor = db.createDoctor(req.body);
    broadcastEvent('DOCTOR_CREATED', newDoctor, {
      title: 'Nuevo Profesional Añadido',
      message: `${newDoctor.name} (${newDoctor.specialty})`
    });
    res.status(201).json({ success: true, data: newDoctor });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.put('/api/doctors/:id', (req, res) => {
  try {
    const updated = db.updateDoctor(req.params.id, req.body);
    if (!updated) return res.status(404).json({ success: false, error: 'Profesional no encontrado' });
    broadcastEvent('DOCTOR_UPDATED', updated, {
      title: 'Profesional Actualizado',
      message: `${updated.name}`
    });
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.delete('/api/doctors/:id', (req, res) => {
  try {
    const deleted = db.deleteDoctor(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, error: 'Profesional no encontrado' });
    broadcastEvent('DOCTOR_DELETED', { id: req.params.id }, {
      title: 'Profesional Eliminado',
      message: 'Se dio de baja al profesional.'
    });
    res.json({ success: true, message: 'Profesional eliminado correctamente' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// --- PATIENTS / FICHERO ---
app.get('/api/patients', (req, res) => {
  try {
    const search = req.query.search || '';
    const patients = db.getPatients(search);
    res.json({ success: true, data: patients });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/patients/:id', (req, res) => {
  try {
    const patient = db.getPatientById(req.params.id);
    if (!patient) return res.status(404).json({ success: false, error: 'Paciente no encontrado' });
    
    const appointments = db.getAppointments().filter(a => a.patientId === patient.id);
    const records = db.getMedicalRecords({ patientId: patient.id });

    res.json({
      success: true,
      data: {
        ...patient,
        appointments,
        medicalRecords: records
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/patients', (req, res) => {
  try {
    const newPatient = db.createPatient(req.body);
    broadcastEvent('PATIENT_CREATED', newPatient, {
      title: 'Nuevo Paciente Registrado',
      message: `${newPatient.firstName} ${newPatient.lastName} (${newPatient.ficheroNumber})`
    });
    res.status(201).json({ success: true, data: newPatient });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.put('/api/patients/:id', (req, res) => {
  try {
    const updated = db.updatePatient(req.params.id, req.body);
    if (!updated) return res.status(404).json({ success: false, error: 'Paciente no encontrado' });
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.delete('/api/patients/:id', (req, res) => {
  try {
    const deleted = db.deletePatient(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, error: 'Paciente no encontrado' });
    res.json({ success: true, message: 'Paciente eliminado del fichero' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// --- APPOINTMENTS / AGENDA ---
app.get('/api/appointments', (req, res) => {
  try {
    const { date, startDate, endDate, doctorId, status } = req.query;
    const appointments = db.getAppointments({ date, startDate, endDate, doctorId, status });
    res.json({ success: true, data: appointments });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/appointments/summary', (req, res) => {
  try {
    const { date, startDate, endDate } = req.query;
    if (date) {
      const summary = db.getDaySummary(date);
      return res.json({ success: true, data: summary });
    }
    if (startDate && endDate) {
      const summaries = db.getDaysSummaries(startDate, endDate);
      return res.json({ success: true, data: summaries });
    }
    const today = new Date().toISOString().split('T')[0];
    res.json({ success: true, data: db.getDaySummary(today) });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/appointments', (req, res) => {
  try {
    const newAppointment = db.createAppointment(req.body);
    broadcastEvent('APPOINTMENT_CREATED', newAppointment, {
      title: newAppointment.isOverturn ? '⚠️ Nuevo Sobreturno Agendado' : '📅 Nuevo Turno Agendado',
      message: `${newAppointment.patientName} con ${newAppointment.doctorName} el ${newAppointment.date} a las ${newAppointment.time} hs.`
    });
    res.status(201).json({ success: true, data: newAppointment });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.put('/api/appointments/:id', (req, res) => {
  try {
    const updated = db.updateAppointment(req.params.id, req.body);
    if (!updated) return res.status(404).json({ success: false, error: 'Turno no encontrado' });
    
    broadcastEvent('APPOINTMENT_UPDATED', updated, {
      title: 'Turno Actualizado',
      message: `Turno de ${updated.patientName} (${updated.date} ${updated.time} hs) modificado.`
    });
    
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.delete('/api/appointments/:id', (req, res) => {
  try {
    const appointment = db.getAppointmentById(req.params.id);
    const deleted = db.deleteAppointment(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, error: 'Turno no encontrado' });
    
    broadcastEvent('APPOINTMENT_DELETED', { id: req.params.id }, {
      title: 'Turno Cancelado/Eliminado',
      message: appointment ? `Turno de ${appointment.patientName} eliminado.` : 'Turno eliminado.'
    });

    res.json({ success: true, message: 'Turno eliminado correctamente' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// --- WHATSAPP NOTIFICATIONS & LIVE PATIENT INTERACTION ---
app.post('/api/whatsapp/reminders/send-single', (req, res) => {
  try {
    const { appointmentId } = req.body;
    const appointment = db.getAppointmentById(appointmentId);
    if (!appointment) return res.status(404).json({ success: false, error: 'Turno no encontrado' });

    const host = req.get('host');
    const protocol = req.protocol;
    const confirmationUrl = `${protocol}://${host}/portal/turno/${appointment.token}`;

    const messageTemplate = 
`🏥 *RECORDATORIO DE TURNO - CLÍNICA SALUDCONNECT* 🏥

Hola *${appointment.patientName}*, le recordamos su turno médico:
📅 *Fecha:* ${appointment.date}
⏰ *Hora:* ${appointment.time} hs
🩺 *Profesional:* ${appointment.doctorName}
🏢 *Especialidad:* ${appointment.specialty}
📋 *N° Fichero:* ${appointment.ficheroNumber}

Por favor, confirme su asistencia seleccionando una opción en el siguiente enlace interactivo:
👉 ${confirmationUrl}

O responda a este mensaje:
✅ *1* para Confirmar Turno
❌ *2* para Cancelar Turno`;

    const cleanPhone = (appointment.patientPhone || '').replace(/\D/g, '');
    const waLink = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(messageTemplate)}`;

    const updated = db.updateAppointment(appointment.id, {
      whatsappStatus: 'sent'
    });

    db.addWhatsappLog({
      type: 'REMINDER_SENT',
      appointmentId: appointment.id,
      patientName: appointment.patientName,
      phone: appointment.patientPhone,
      messagePreview: messageTemplate.substring(0, 100) + '...'
    });

    broadcastEvent('WHATSAPP_SENT', updated, {
      title: 'WhatsApp Enviado',
      message: `Recordatorio enviado a ${appointment.patientName}`
    });

    res.json({
      success: true,
      data: {
        appointment: updated,
        confirmationUrl,
        waLink,
        messageText: messageTemplate
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/whatsapp/reminders/send-batch', (req, res) => {
  try {
    const { date } = req.body;
    const targetDate = date || new Date().toISOString().split('T')[0];
    const appointments = db.getAppointments({ date: targetDate }).filter(a => a.status !== 'cancelled');

    const updatedList = appointments.map(apt => {
      return db.updateAppointment(apt.id, { whatsappStatus: 'sent' });
    });

    db.addWhatsappLog({
      type: 'BATCH_REMINDER_SENT',
      date: targetDate,
      count: updatedList.length
    });

    broadcastEvent('WHATSAPP_BATCH_SENT', { date: targetDate, count: updatedList.length }, {
      title: 'Recordatorios Masivos Enviados',
      message: `Se enviaron recordatorios por WhatsApp a ${updatedList.length} pacientes del día ${targetDate}.`
    });

    res.json({
      success: true,
      data: {
        sentCount: updatedList.length,
        date: targetDate
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/whatsapp/portal/:token', (req, res) => {
  try {
    const appointment = db.getAppointmentByToken(req.params.token);
    if (!appointment) return res.status(404).json({ success: false, error: 'Turno no encontrado o enlace expirado' });
    
    res.json({ success: true, data: appointment });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/whatsapp/respond', (req, res) => {
  try {
    const { token, appointmentId, action } = req.body;
    
    let appointment = null;
    if (token) {
      appointment = db.getAppointmentByToken(token);
    } else if (appointmentId) {
      appointment = db.getAppointmentById(appointmentId);
    }

    if (!appointment) {
      return res.status(404).json({ success: false, error: 'Turno no encontrado' });
    }

    const isAccept = action === 'accept' || action === 'confirm';
    const newStatus = isAccept ? 'confirmed' : 'cancelled';
    const newWaStatus = isAccept ? 'confirmed_by_patient' : 'cancelled_by_patient';

    const updated = db.updateAppointment(appointment.id, {
      status: newStatus,
      whatsappStatus: newWaStatus
    });

    db.addWhatsappLog({
      type: isAccept ? 'PATIENT_CONFIRMED' : 'PATIENT_CANCELLED',
      appointmentId: appointment.id,
      patientName: appointment.patientName,
      action: newStatus,
      timestamp: new Date().toISOString()
    });

    broadcastEvent('PATIENT_RESPONSE_RECEIVED', updated, {
      title: isAccept ? '✅ Turno Confirmado por Paciente' : '❌ Turno Cancelado por Paciente',
      message: `${updated.patientName} ha ${isAccept ? 'CONFIRMADO' : 'CANCELADO'} su turno de las ${updated.time} hs (${updated.specialty}) vía WhatsApp.`
    });

    console.log(`[WhatsApp Live Sync] ${updated.patientName} -> ${newStatus.toUpperCase()}`);

    res.json({
      success: true,
      message: isAccept ? '¡Turno confirmado con éxito!' : 'Turno cancelado correctamente.',
      data: updated
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// --- MEDICAL RECORDS ---
app.get('/api/medical-records', (req, res) => {
  try {
    const { patientId, specialtySlug } = req.query;
    const records = db.getMedicalRecords({ patientId, specialtySlug });
    res.json({ success: true, data: records });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/medical-records/:id', (req, res) => {
  try {
    const record = db.getMedicalRecordById(req.params.id);
    if (!record) return res.status(404).json({ success: false, error: 'Historia clínica no encontrada' });
    res.json({ success: true, data: record });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/medical-records', (req, res) => {
  try {
    const newRecord = db.createMedicalRecord(req.body);
    broadcastEvent('MEDICAL_RECORD_CREATED', newRecord, {
      title: 'Nueva Evolución en Historia Clínica',
      message: `Consulta de ${newRecord.specialty} cargada para paciente.`
    });
    res.status(201).json({ success: true, data: newRecord });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.put('/api/medical-records/:id', (req, res) => {
  try {
    const updated = db.updateMedicalRecord(req.params.id, req.body);
    if (!updated) return res.status(404).json({ success: false, error: 'Historia clínica no encontrada' });
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// --- SAAS SUBSCRIPTION & MONTHLY BILLING ---
app.get('/api/subscription', (req, res) => {
  try {
    const subscription = db.getSubscription();
    res.json({ success: true, data: subscription });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/subscription/change-plan', (req, res) => {
  try {
    const { planId, paymentMethod } = req.body;
    const updated = db.changePlan(planId, paymentMethod);
    broadcastEvent('SUBSCRIPTION_UPDATED', updated, {
      title: 'Suscripción Actualizada',
      message: `El plan ha cambiado a ${updated.planName}.`
    });
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/subscription/cancel', (req, res) => {
  try {
    const updated = db.cancelSubscription();
    broadcastEvent('SUBSCRIPTION_UPDATED', updated, {
      title: 'Suscripción Cancelada',
      message: 'La renovación automática ha sido desactivada.'
    });
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Serve frontend in production
const distPath = path.join(__dirname, '..', 'dist');
app.use(express.static(distPath));

// Fallback for SPA routing
app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'), err => {
    if (err) {
      res.json({ status: 'API SaludConnect Operativa', timestamp: new Date().toISOString() });
    }
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`🚀 Servidor SaludConnect API corriendo en: http://localhost:${PORT}`);
  console.log(`📡 Sincronización en tiempo real activa en: /api/events`);
  console.log(`🏥 Onboarding de clínicas y gestión de profesionales activa`);
  console.log(`======================================================\n`);
});
