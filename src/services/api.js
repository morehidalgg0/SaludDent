const API_BASE = '/api';

export const api = {
  // --- CLINIC & ONBOARDING ---
  async getClinic() {
    const res = await fetch(`${API_BASE}/clinic`);
    const json = await res.json();
    return json.data;
  },

  async updateClinic(clinicData) {
    const res = await fetch(`${API_BASE}/clinic`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(clinicData)
    });
    const json = await res.json();
    return json.data;
  },

  async registerClinic(accountData) {
    const res = await fetch(`${API_BASE}/auth/register-clinic`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(accountData)
    });
    const json = await res.json();
    return json.data;
  },

  // --- DOCTORS ---
  async getDoctors() {
    const res = await fetch(`${API_BASE}/doctors`);
    const json = await res.json();
    return json.data || [];
  },

  async createDoctor(doctorData) {
    const res = await fetch(`${API_BASE}/doctors`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(doctorData)
    });
    const json = await res.json();
    return json.data;
  },

  async updateDoctor(id, doctorData) {
    const res = await fetch(`${API_BASE}/doctors/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(doctorData)
    });
    const json = await res.json();
    return json.data;
  },

  async deleteDoctor(id) {
    const res = await fetch(`${API_BASE}/doctors/${id}`, {
      method: 'DELETE'
    });
    return res.json();
  },

  // --- PATIENTS ---
  async getPatients(search = '') {
    const res = await fetch(`${API_BASE}/patients?search=${encodeURIComponent(search)}`);
    const json = await res.json();
    return json.data || [];
  },

  async getPatientById(id) {
    const res = await fetch(`${API_BASE}/patients/${id}`);
    const json = await res.json();
    return json.data;
  },

  async createPatient(patientData) {
    const res = await fetch(`${API_BASE}/patients`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patientData)
    });
    const json = await res.json();
    return json.data;
  },

  async updatePatient(id, patientData) {
    const res = await fetch(`${API_BASE}/patients/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patientData)
    });
    const json = await res.json();
    return json.data;
  },

  async deletePatient(id) {
    const res = await fetch(`${API_BASE}/patients/${id}`, {
      method: 'DELETE'
    });
    return res.json();
  },

  // --- APPOINTMENTS ---
  async getAppointments({ date, startDate, endDate, doctorId, status } = {}) {
    const params = new URLSearchParams();
    if (date) params.append('date', date);
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    if (doctorId && doctorId !== 'all') params.append('doctorId', doctorId);
    if (status && status !== 'all') params.append('status', status);

    const res = await fetch(`${API_BASE}/appointments?${params.toString()}`);
    const json = await res.json();
    return json.data || [];
  },

  async getDaySummary(date) {
    const res = await fetch(`${API_BASE}/appointments/summary?date=${date}`);
    const json = await res.json();
    return json.data;
  },

  async getDaysSummaries(startDate, endDate) {
    const res = await fetch(`${API_BASE}/appointments/summary?startDate=${startDate}&endDate=${endDate}`);
    const json = await res.json();
    return json.data || {};
  },

  async createAppointment(appointmentData) {
    const res = await fetch(`${API_BASE}/appointments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(appointmentData)
    });
    const json = await res.json();
    return json.data;
  },

  async updateAppointment(id, updateData) {
    const res = await fetch(`${API_BASE}/appointments/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updateData)
    });
    const json = await res.json();
    return json.data;
  },

  async deleteAppointment(id) {
    const res = await fetch(`${API_BASE}/appointments/${id}`, {
      method: 'DELETE'
    });
    return res.json();
  },

  // --- WHATSAPP & REALTIME ACTIONS ---
  async sendWhatsappReminderSingle(appointmentId) {
    const res = await fetch(`${API_BASE}/whatsapp/reminders/send-single`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ appointmentId })
    });
    const json = await res.json();
    return json.data;
  },

  async sendWhatsappReminderBatch(date) {
    const res = await fetch(`${API_BASE}/whatsapp/reminders/send-batch`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ date })
    });
    const json = await res.json();
    return json.data;
  },

  async getPortalAppointment(token) {
    const res = await fetch(`${API_BASE}/whatsapp/portal/${token}`);
    const json = await res.json();
    return json.data;
  },

  async respondWhatsapp({ token, appointmentId, action }) {
    const res = await fetch(`${API_BASE}/whatsapp/respond`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, appointmentId, action })
    });
    const json = await res.json();
    return json;
  },

  // --- MEDICAL RECORDS ---
  async getMedicalRecords({ patientId, specialtySlug } = {}) {
    const params = new URLSearchParams();
    if (patientId) params.append('patientId', patientId);
    if (specialtySlug) params.append('specialtySlug', specialtySlug);

    const res = await fetch(`${API_BASE}/medical-records?${params.toString()}`);
    const json = await res.json();
    return json.data || [];
  },

  async getMedicalRecordById(id) {
    const res = await fetch(`${API_BASE}/medical-records/${id}`);
    const json = await res.json();
    return json.data;
  },

  async createMedicalRecord(recordData) {
    const res = await fetch(`${API_BASE}/medical-records`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(recordData)
    });
    const json = await res.json();
    return json.data;
  },

  async updateMedicalRecord(id, recordData) {
    const res = await fetch(`${API_BASE}/medical-records/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(recordData)
    });
    const json = await res.json();
    return json.data;
  },

  // --- SAAS SUBSCRIPTION & BILLING ---
  async getSubscription() {
    const res = await fetch(`${API_BASE}/subscription`);
    const json = await res.json();
    return json.data;
  },

  async changeSubscriptionPlan(planId, paymentMethod) {
    const res = await fetch(`${API_BASE}/subscription/change-plan`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ planId, paymentMethod })
    });
    const json = await res.json();
    return json.data;
  },

  async cancelSubscription() {
    const res = await fetch(`${API_BASE}/subscription/cancel`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    const json = await res.json();
    return json.data;
  },

  // --- REAL-TIME SSE LISTENER ---
  connectEvents(onMessageCallback) {
    const eventSource = new EventSource(`${API_BASE}/events`);

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (onMessageCallback) {
          onMessageCallback(data);
        }
      } catch (err) {
        console.error('[SSE] Error procesando evento:', err);
      }
    };

    eventSource.onerror = (err) => {
      console.warn('[SSE] EventSource reconectando...', err);
    };

    return () => {
      eventSource.close();
    };
  }
};
