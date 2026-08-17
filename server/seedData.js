// Datos Semilla Iniciales con información médica realista para Clínicas Multidisciplinarias

export const seedDoctors = [
  {
    id: "doc-1",
    name: "Dra. Florencia Rossi",
    specialty: "Odontología",
    specialtySlug: "odontologia",
    license: "MN 48.912",
    phone: "+54 9 11 4455-8899",
    color: "#0d9488", // Teal
    room: "Consultorio 1 (Odonto)",
    intervalMinutes: 15
  },
  {
    id: "doc-2",
    name: "Lic. Martín Benítez",
    specialty: "Kinesiología y Fisioterapia",
    specialtySlug: "kinesiologia",
    license: "MN 31.420",
    phone: "+54 9 11 5566-7788",
    color: "#0284c7", // Sky blue
    room: "Gimnasio Terapéutico / Box 2",
    intervalMinutes: 30
  },
  {
    id: "doc-3",
    name: "Lic. Luciana Gómez",
    specialty: "Nutrición y Dietética",
    specialtySlug: "nutricion",
    license: "MN 55.103",
    phone: "+54 9 11 6677-8899",
    color: "#16a34a", // Green
    room: "Consultorio 3",
    intervalMinutes: 30
  },
  {
    id: "doc-4",
    name: "Dr. Alejandro Morales",
    specialty: "Medicina General / Clínica Médica",
    specialtySlug: "medicina_general",
    license: "MN 72.844",
    phone: "+54 9 11 3322-1144",
    color: "#6366f1", // Indigo
    room: "Consultorio 4",
    intervalMinutes: 15
  },
  {
    id: "doc-5",
    name: "Lic. Camila Valenzuela",
    specialty: "Psicología y Salud Mental",
    specialtySlug: "psicologia",
    license: "MN 49.330",
    phone: "+54 9 11 7788-9900",
    color: "#8b5cf6", // Purple
    room: "Consultorio 5",
    intervalMinutes: 45
  },
  {
    id: "doc-6",
    name: "Dra. Sofía Navarro",
    specialty: "Pediatría",
    specialtySlug: "pediatria",
    license: "MN 60.119",
    phone: "+54 9 11 9988-7766",
    color: "#ea580c", // Orange
    room: "Consultorio 6 (Pediatría)",
    intervalMinutes: 20
  },
  {
    id: "doc-7",
    name: "Dr. Esteban Roldán",
    specialty: "Oftalmología",
    specialtySlug: "oftalmologia",
    license: "MN 51.490",
    phone: "+54 9 11 2233-4455",
    color: "#0891b2", // Cyan
    room: "Consultorio 7 (Oftalmo)",
    intervalMinutes: 15
  }
];

export const seedPatients = [
  {
    id: "pat-1001",
    ficheroNumber: "F-10240",
    firstName: "Valentina",
    lastName: "Herrera",
    dni: "38.942.105",
    phone: "+54 9 11 5821-9944",
    email: "v.herrera@gmail.com",
    birthDate: "1994-06-14",
    insurance: "OSDE 310",
    insuranceNumber: "310-84729104-01",
    allergies: "Penicilina, Sulfas",
    bloodType: "A+",
    emergencyContact: "Carlos Herrera (Padre) - +54 9 11 4400-1122",
    notes: "Paciente con tratamiento de ortodoncia y bruxismo nocturno.",
    createdAt: "2024-01-15T10:00:00.000Z"
  },
  {
    id: "pat-1002",
    ficheroNumber: "F-10241",
    firstName: "Matías",
    lastName: "Sánchez",
    dni: "34.512.809",
    phone: "+54 9 11 6390-1284",
    email: "matias.sanchez@outlook.com",
    birthDate: "1989-11-23",
    insurance: "Swiss Medical",
    insuranceNumber: "SM-902341-2",
    allergies: "Ninguna conocida",
    bloodType: "0+",
    emergencyContact: "Marina Díaz (Esposa) - +54 9 11 3211-9988",
    notes: "Rehabilitación por esguince de tobillo grado II en fútbol.",
    createdAt: "2024-02-10T14:30:00.000Z"
  },
  {
    id: "pat-1003",
    ficheroNumber: "F-10242",
    firstName: "Joaquín",
    lastName: "Pérez Molina",
    dni: "42.115.930",
    phone: "+54 9 11 4055-7711",
    email: "joaco.perez@yahoo.com.ar",
    birthDate: "1999-03-08",
    insurance: "Galeno Oro",
    insuranceNumber: "GAL-550921-A",
    allergies: "AINEs (Ibuprofeno)",
    bloodType: "B+",
    emergencyContact: "Laura Molina (Madre) - +54 9 11 5544-3322",
    notes: "Plan de descenso de grasa corporal y ganancia de masa muscular.",
    createdAt: "2024-03-01T09:15:00.000Z"
  },
  {
    id: "pat-1004",
    ficheroNumber: "F-10243",
    firstName: "Mariana",
    lastName: "Alonso",
    dni: "29.740.332",
    phone: "+54 9 11 7120-4499",
    email: "mariana.alonso@gmail.com",
    birthDate: "1982-08-19",
    insurance: "Medifé Plata",
    insuranceNumber: "MED-889123-0",
    allergies: "Latex",
    bloodType: "0-",
    emergencyContact: "Esteban Alonso (Hermano) - +54 9 11 8877-6655",
    notes: "Seguimiento por hipertensión arterial leve y control oftalmológico anual.",
    createdAt: "2024-03-12T16:00:00.000Z"
  },
  {
    id: "pat-1005",
    ficheroNumber: "F-10244",
    firstName: "Lucas",
    lastName: "Ramírez",
    dni: "54.120.984",
    phone: "+54 9 11 3901-4477",
    email: "padres.lucasramirez@gmail.com",
    birthDate: "2021-09-05",
    insurance: "IOMA",
    insuranceNumber: "IOM-441290-99",
    allergies: "Huevo (alergia alimentaria en remisión)",
    bloodType: "A-",
    emergencyContact: "Romina Castro (Madre) - +54 9 11 3901-4477",
    notes: "Control de niño sano 5 años y vacunación de ingreso escolar.",
    createdAt: "2024-04-05T11:20:00.000Z"
  },
  {
    id: "pat-1006",
    ficheroNumber: "F-10245",
    firstName: "Beatriz",
    lastName: "Castillo",
    dni: "18.392.110",
    phone: "+54 9 11 6001-3322",
    email: "beatriz.castillo@fibertel.com.ar",
    birthDate: "1965-04-12",
    insurance: "PAMI",
    insuranceNumber: "PAM-199402102-00",
    allergies: "Yodo / Contrastes",
    bloodType: "0+",
    emergencyContact: "Paula Castillo (Hija) - +54 9 11 6001-3325",
    notes: "Control oftalmológico por cataratas y chequeo clínico general.",
    createdAt: "2024-05-02T10:10:00.000Z"
  }
];

// Helper to get dynamic dates relative to today (2026-08-16)
function getDateOffset(daysOffset = 0) {
  const base = new Date('2026-08-16T12:00:00');
  base.setDate(base.getDate() + daysOffset);
  return base.toISOString().split('T')[0];
}

export const seedAppointments = [
  // Today's appointments (2026-08-16)
  {
    id: "apt-201",
    patientId: "pat-1001",
    patientName: "Valentina Herrera",
    patientPhone: "+54 9 11 5821-9944",
    ficheroNumber: "F-10240",
    doctorId: "doc-1",
    doctorName: "Dra. Florencia Rossi",
    specialty: "Odontología",
    date: getDateOffset(0),
    time: "08:30",
    durationMinutes: 30,
    isOverturn: false,
    status: "confirmed", // Confirmed via WhatsApp
    whatsappStatus: "confirmed_by_patient",
    token: "token_vh_0830",
    notes: "Limpieza y revisión de composite en pieza 2.4",
    createdAt: "2026-08-10T09:00:00.000Z"
  },
  {
    id: "apt-202",
    patientId: "pat-1002",
    patientName: "Matías Sánchez",
    patientPhone: "+54 9 11 6390-1284",
    ficheroNumber: "F-10241",
    doctorId: "doc-2",
    doctorName: "Lic. Martín Benítez",
    specialty: "Kinesiología y Fisioterapia",
    date: getDateOffset(0),
    time: "09:00",
    durationMinutes: 45,
    isOverturn: false,
    status: "waiting", // Patient arrived in waiting room
    whatsappStatus: "confirmed_by_patient",
    token: "token_ms_0900",
    notes: "Sesión 4: Ejercicios propioceptivos y ultrasonido en tobillo derecho",
    createdAt: "2026-08-11T11:00:00.000Z"
  },
  {
    id: "apt-203",
    patientId: "pat-1003",
    patientName: "Joaquín Pérez Molina",
    patientPhone: "+54 9 11 4055-7711",
    ficheroNumber: "F-10242",
    doctorId: "doc-3",
    doctorName: "Lic. Luciana Gómez",
    specialty: "Nutrición y Dietética",
    date: getDateOffset(0),
    time: "09:30",
    durationMinutes: 30,
    isOverturn: false,
    status: "pending", // Waiting for WhatsApp reminder confirmation
    whatsappStatus: "sent",
    token: "token_jp_0930",
    notes: "Medición antropométrica mensual y ajuste calórico",
    createdAt: "2026-08-12T15:30:00.000Z"
  },
  {
    id: "apt-204",
    patientId: "pat-1004",
    patientName: "Mariana Alonso",
    patientPhone: "+54 9 11 7120-4499",
    ficheroNumber: "F-10243",
    doctorId: "doc-4",
    doctorName: "Dr. Alejandro Morales",
    specialty: "Medicina General / Clínica Médica",
    date: getDateOffset(0),
    time: "10:00",
    durationMinutes: 15,
    isOverturn: false,
    status: "confirmed",
    whatsappStatus: "confirmed_by_patient",
    token: "token_ma_1000",
    notes: "Control de laboratorio y ajuste de medicación Enalapril",
    createdAt: "2026-08-13T08:20:00.000Z"
  },
  {
    // SOBRETURNADO de urgencia en el mismo horario
    id: "apt-205",
    patientId: "pat-1006",
    patientName: "Beatriz Castillo",
    patientPhone: "+54 9 11 6001-3322",
    ficheroNumber: "F-10245",
    doctorId: "doc-4",
    doctorName: "Dr. Alejandro Morales",
    specialty: "Medicina General / Clínica Médica",
    date: getDateOffset(0),
    time: "10:00",
    durationMinutes: 15,
    isOverturn: true, // SOBRETURNO
    status: "pending",
    whatsappStatus: "sent",
    token: "token_bc_1000",
    notes: "SOBRETURNO: Cuadro gripal febril de 48hs de evolución",
    createdAt: "2026-08-16T08:00:00.000Z"
  },
  {
    id: "apt-206",
    patientId: "pat-1005",
    patientName: "Lucas Ramírez",
    patientPhone: "+54 9 11 3901-4477",
    ficheroNumber: "F-10244",
    doctorId: "doc-6",
    doctorName: "Dra. Sofía Navarro",
    specialty: "Pediatría",
    date: getDateOffset(0),
    time: "11:15",
    durationMinutes: 30,
    isOverturn: false,
    status: "pending",
    whatsappStatus: "sent",
    token: "token_lr_1115",
    notes: "Control pediátrico y certificado escolar",
    createdAt: "2026-08-14T10:00:00.000Z"
  },
  {
    id: "apt-207",
    patientId: "pat-1001",
    patientName: "Valentina Herrera",
    patientPhone: "+54 9 11 5821-9944",
    ficheroNumber: "F-10240",
    doctorId: "doc-7",
    doctorName: "Dr. Esteban Roldán",
    specialty: "Oftalmología",
    date: getDateOffset(0),
    time: "14:00",
    durationMinutes: 15,
    isOverturn: false,
    status: "pending",
    whatsappStatus: "not_sent",
    token: "token_vh_1400",
    notes: "Refracción y fondo de ojo",
    createdAt: "2026-08-15T09:30:00.000Z"
  },
  // Upcoming days appointments (tomorrow and future)
  {
    id: "apt-208",
    patientId: "pat-1002",
    patientName: "Matías Sánchez",
    patientPhone: "+54 9 11 6390-1284",
    ficheroNumber: "F-10241",
    doctorId: "doc-2",
    doctorName: "Lic. Martín Benítez",
    specialty: "Kinesiología y Fisioterapia",
    date: getDateOffset(1),
    time: "10:30",
    durationMinutes: 45,
    isOverturn: false,
    status: "pending",
    whatsappStatus: "not_sent",
    token: "token_ms_tomorrow",
    notes: "Sesión 5 de kinesiología",
    createdAt: "2026-08-15T12:00:00.000Z"
  },
  {
    id: "apt-209",
    patientId: "pat-1003",
    patientName: "Joaquín Pérez Molina",
    patientPhone: "+54 9 11 4055-7711",
    ficheroNumber: "F-10242",
    doctorId: "doc-5",
    doctorName: "Lic. Camila Valenzuela",
    specialty: "Psicología y Salud Mental",
    date: getDateOffset(1),
    time: "16:00",
    durationMinutes: 45,
    isOverturn: false,
    status: "confirmed",
    whatsappStatus: "confirmed_by_patient",
    token: "token_jp_psy",
    notes: "Sesión semanal de psicoterapia",
    createdAt: "2026-08-14T17:00:00.000Z"
  },
  {
    id: "apt-210",
    patientId: "pat-1004",
    patientName: "Mariana Alonso",
    patientPhone: "+54 9 11 7120-4499",
    ficheroNumber: "F-10243",
    doctorId: "doc-1",
    doctorName: "Dra. Florencia Rossi",
    specialty: "Odontología",
    date: getDateOffset(2),
    time: "11:00",
    durationMinutes: 30,
    isOverturn: false,
    status: "pending",
    whatsappStatus: "not_sent",
    token: "token_ma_d2",
    notes: "Revisión general y profilaxis",
    createdAt: "2026-08-15T16:00:00.000Z"
  },
  {
    id: "apt-211",
    patientId: "pat-1006",
    patientName: "Beatriz Castillo",
    patientPhone: "+54 9 11 6001-3322",
    ficheroNumber: "F-10245",
    doctorId: "doc-7",
    doctorName: "Dr. Esteban Roldán",
    specialty: "Oftalmología",
    date: getDateOffset(3),
    time: "09:15",
    durationMinutes: 30,
    isOverturn: false,
    status: "pending",
    whatsappStatus: "not_sent",
    token: "token_bc_d3",
    notes: "Estudio de fondo de ojo y tonometría",
    createdAt: "2026-08-14T11:00:00.000Z"
  },
  {
    id: "apt-212",
    patientId: "pat-1001",
    patientName: "Valentina Herrera",
    patientPhone: "+54 9 11 5821-9944",
    ficheroNumber: "F-10240",
    doctorId: "doc-3",
    doctorName: "Lic. Luciana Gómez",
    specialty: "Nutrición y Dietética",
    date: getDateOffset(5),
    time: "15:00",
    durationMinutes: 30,
    isOverturn: false,
    status: "pending",
    whatsappStatus: "not_sent",
    token: "token_vh_d5",
    notes: "Control nutricional deportológico",
    createdAt: "2026-08-15T18:00:00.000Z"
  }
];

export const seedMedicalRecords = [
  {
    id: "rec-301",
    patientId: "pat-1001",
    doctorId: "doc-1",
    doctorName: "Dra. Florencia Rossi",
    specialty: "Odontología",
    specialtySlug: "odontologia",
    date: "2026-07-20",
    reason: "Sensibilidad dental en cuadrante superior izquierdo",
    vitalSigns: {
      bloodPressure: "115/75",
      heartRate: "72",
      temperature: "36.5",
      oxygenSat: "99"
    },
    anamnesis: "Paciente refiere molestia al frío y dulce en sector molar superior desde hace 2 semanas.",
    diagnosis: "K02.1 - Caries de la dentina en pieza 2.4",
    treatmentPlan: "Apertura cavitaria, remoción de tejido cariado y obturación con resina fotopolimerizable en pieza 2.4. Pulido en próxima sesión.",
    specialtyData: {
      type: "odontologia",
      odontogram: {
        "24": {
          status: "caries",
          faces: { oclusal: "caries", mesial: "sano", distal: "sano", vestibular: "sano", lingual: "sano" },
          notes: "Caries oclusal profunda sin compromiso pulpar"
        },
        "16": {
          status: "restoration",
          faces: { oclusal: "restoration", mesial: "restoration", distal: "sano", vestibular: "sano", lingual: "sano" },
          notes: "Resina compuesta en buen estado (2023)"
        },
        "36": {
          status: "healthy",
          faces: { oclusal: "sano", mesial: "sano", distal: "sano", vestibular: "sano", lingual: "sano" }
        },
        "46": {
          status: "sealant",
          faces: { oclusal: "sealant", mesial: "sano", distal: "sano", vestibular: "sano", lingual: "sano" }
        }
      },
      periodontalHealth: "Gingivitis marginal leve localizada en sector anterior inferior",
      oralHygieneScore: "Buena (Índice de O'Leary 18%)"
    },
    prescriptions: [
      { medication: "Ibuprofeno 400mg", dosage: "1 comprimido cada 8hs por 48hs en caso de molestia", duration: "2 días" },
      { medication: "Enjuague bucal con Clorhexidina 0.12%", dosage: "15ml cada 12hs post-cepillado", duration: "7 días" }
    ],
    createdAt: "2026-07-20T10:30:00.000Z"
  },
  {
    id: "rec-302",
    patientId: "pat-1002",
    doctorId: "doc-2",
    doctorName: "Lic. Martín Benítez",
    specialty: "Kinesiología y Fisioterapia",
    specialtySlug: "kinesiologia",
    date: "2026-08-05",
    reason: "Dolor e inestabilidad en tobillo derecho post-traumatismo deportivo",
    vitalSigns: {
      bloodPressure: "120/80",
      heartRate: "68",
      temperature: "36.4"
    },
    anamnesis: "Paciente sufrió inversión forzada de tobillo derecho jugando al fútbol hace 10 días. RMN constata esguince ligamento peroneo astragalino anterior grado II.",
    diagnosis: "S93.4 - Esguince y torcedura del tobillo (LPAA)",
    treatmentPlan: "Protocolo RICE inicial + Magnetoterapia 20 min, Ultrasonido pulsátil 1MHz, ejercicios de reeducación propioceptiva en plato de Freeman y fortalecimiento de peroneos.",
    specialtyData: {
      type: "kinesiologia",
      painLevelEva: 6, // EVA 1-10
      affectedZones: [
        { id: "ankle-right-lateral", label: "Tobillo Derecho (Cara Externa)", severity: "Moderada", painScore: 6 },
        { id: "calf-right", label: "Gemelo / Tendón de Aquiles Derecho", severity: "Leve", painScore: 3 }
      ],
      rangeOfMotion: {
        dorsiflexion: "10° (limitado por dolor, normal 20°)",
        plantarflexion: "35° (conservado)",
        eversion: "Limitada 5°",
        inversion: "Dolorosa al final de rango"
      },
      rehabGoals: "1. Disminución del edema perimaleolar. 2. Restaurar rango completo de dorsiflexión. 3. Retorno al trote en semana 4."
    },
    prescriptions: [
      { medication: "Tobillera elástica con refuerzos laterales", dosage: "Uso durante la deambulación", duration: "3 semanas" }
    ],
    createdAt: "2026-08-05T14:45:00.000Z"
  },
  {
    id: "rec-303",
    patientId: "pat-1003",
    doctorId: "doc-3",
    doctorName: "Lic. Luciana Gómez",
    specialty: "Nutrición y Dietética",
    specialtySlug: "nutricion",
    date: "2026-07-15",
    reason: "Optimización de composición corporal y rendimiento deportivo",
    vitalSigns: {
      bloodPressure: "118/74",
      heartRate: "60"
    },
    anamnesis: "Paciente masculino de 27 años, entrena crossfit 4 veces por semana. Busca reducir porcentaje graso manteniendo masa muscular.",
    diagnosis: "E66.3 - Sobrepeso grado I según IMC / Composición corporal evaluada",
    treatmentPlan: "Pauta nutricional hiperproteica (2.0g/kg) con déficit calórico moderado de 350 kcal. Distribución equilibrada de carbohidratos en torno al entrenamiento.",
    specialtyData: {
      type: "nutricion",
      anthropometry: {
        weightKg: 84.5,
        heightCm: 178,
        bmi: 26.7,
        bodyFatPercentage: 21.4,
        muscleMassKg: 38.2,
        waistCircumferenceCm: 88,
        hipCircumferenceCm: 101,
        waistToHipRatio: 0.87
      },
      nutritionalGoals: {
        dailyCaloriesKcal: 2350,
        proteinsGrams: 170,
        carbohydratesGrams: 245,
        fatsGrams: 65,
        waterLiters: 3.2
      },
      dietaryGuidelines: "Priorizar proteínas de alto valor biológico (huevos, pollo, pescado, tofu). Ingesta de hidratos complejos antes de entrenar (avena, arroz integral, papa)."
    },
    prescriptions: [
      { medication: "Creatina Monohidrato", dosage: "5g diarios disueltos en agua post-entrenamiento", duration: "Continuo" }
    ],
    createdAt: "2026-07-15T16:00:00.000Z"
  },
  {
    id: "rec-304",
    patientId: "pat-1004",
    doctorId: "doc-4",
    doctorName: "Dr. Alejandro Morales",
    specialty: "Medicina General / Clínica Médica",
    specialtySlug: "medicina_general",
    date: "2026-06-10",
    reason: "Control anual de salud y chequeo de presión arterial",
    vitalSigns: {
      bloodPressure: "135/88",
      heartRate: "76",
      temperature: "36.6",
      oxygenSat: "98",
      bloodGlucose: "94 mg/dL"
    },
    anamnesis: "Paciente femenina asintomática. Refiere buen descanso, sin disnea ni palpitaciones. Dieta con sal moderada.",
    diagnosis: "I10 - Hipertensión Esencial (Primaria) Grado 1",
    treatmentPlan: "Continuar con Enalapril 10mg diario. Pautas higiénico-dietéticas (reducción de sodio, 150 min semanales de actividad aeróbica moderada). Solicitud de laboratorio completo con perfil lipídico y función renal.",
    specialtyData: {
      type: "medicina_general",
      cardiovascularRisk: "Bajo-Moderado (SCORE < 3%)",
      physicalExam: "Normoconfigurada, ruidos cardíacos normofonéticos en 4 focos sin soplos. Murmullo vesicular conservado bilateral sin ruidos agregados. Abdomen blando, indoloro.",
      labResultsSummary: "Colesterol Total: 210 mg/dL, HDL: 52 mg/dL, LDL: 130 mg/dL, Triglicéridos: 140 mg/dL, Creatinina: 0.8 mg/dL."
    },
    prescriptions: [
      { medication: "Enalapril 10 mg", dosage: "1 comprimido por la mañana en ayunas", duration: "Tratamiento crónico" }
    ],
    createdAt: "2026-06-10T11:00:00.000Z"
  }
];
