// Condiciones del odontograma con colores y metadatos
export const CONDITIONS = [
  { id: 'sano', label: 'Sano / Normal', color: '#ffffff', textColor: '#0f172a', border: '#cbd5e1' },
  { id: 'caries', label: 'Caries Activa', color: '#ef4444', textColor: '#ffffff', border: '#b91c1c' },
  { id: 'restoration', label: 'Resina / Obturación', color: '#0284c7', textColor: '#ffffff', border: '#0369a1' },
  { id: 'crown', label: 'Corona / Prótesis', color: '#f59e0b', textColor: '#ffffff', border: '#d97706' },
  { id: 'endodontics', label: 'Endodoncia (Conducto)', color: '#10b981', textColor: '#ffffff', border: '#047857' },
  { id: 'extraction', label: 'Indicación Extracción', color: '#dc2626', textColor: '#ffffff', border: '#991b1b', isCross: true },
  { id: 'missing', label: 'Pieza Ausente', color: '#64748b', textColor: '#ffffff', border: '#475569', isMissing: true },
  { id: 'implant', label: 'Implante', color: '#8b5cf6', textColor: '#ffffff', border: '#6d28d9' }
];

// Sistema FDI - Piezas permanentes
export const UPPER_TEETH = [18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28];
export const LOWER_TEETH = [48, 47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37, 38];

// Sistema FDI - Dentición temporal (decidua)
export const UPPER_TEETH_PRIMARY = [55, 54, 53, 52, 51, 61, 62, 63, 64, 65];
export const LOWER_TEETH_PRIMARY = [85, 84, 83, 82, 81, 71, 72, 73, 74, 75];

export const DENTITIONS = [
  { id: 'permanent', label: 'Permanente (32 piezas)' },
  { id: 'primary', label: 'Temporal / Decidua (20 piezas)' },
  { id: 'mixed', label: 'Mixta' }
];

// Nombres de las caras dentales
export const TOOTH_FACES = [
  { id: 'vestibular', label: 'Vestibular' },
  { id: 'lingual', label: 'Lingual / Palatino' },
  { id: 'mesial', label: 'Mesial' },
  { id: 'distal', label: 'Distal' },
  { id: 'oclusal', label: 'Oclusal / Incisal' }
];

export const MOBILITY_GRADES = [
  { value: 0, label: '0 - Sin movilidad' },
  { value: 1, label: '1 - Leve' },
  { value: 2, label: '2 - Moderada' },
  { value: 3, label: '3 - Severa' }
];

export const FURCATION_GRADES = [
  { value: 0, label: '0 - No detectable' },
  { value: 1, label: '1 - Grado I' },
  { value: 2, label: '2 - Grado II' },
  { value: 3, label: '3 - Grado III (perforante)' }
];

// Sitios de sondaje periodontal (6 por pieza)
export const POCKET_SITES = [
  { id: 'mv', label: 'MV', full: 'Mesio-Vestibular' },
  { id: 'v', label: 'V', full: 'Vestibular' },
  { id: 'dv', label: 'DV', full: 'Disto-Vestibular' },
  { id: 'ml', label: 'ML', full: 'Mesio-Lingual' },
  { id: 'l', label: 'L', full: 'Lingual' },
  { id: 'dl', label: 'DL', full: 'Disto-Lingual' }
];

// Catálogo de tratamientos odontológicos con precios de referencia (ARS)
export const DENTAL_PROCEDURES = [
  { id: 'consulta', label: 'Consulta / Diagnóstico', category: 'Diagnóstico', price: 8000 },
  { id: 'rx', label: 'Radiografía periapical', category: 'Diagnóstico', price: 6000 },
  { id: 'rx_panoramica', label: 'Radiografía panorámica', category: 'Diagnóstico', price: 15000 },
  { id: 'profilaxis', label: 'Profilaxis (limpieza)', category: 'Prevención', price: 18000 },
  { id: 'selladores', label: 'Selladores', category: 'Prevención', price: 9000 },
  { id: 'fluor', label: 'Aplicación de flúor', category: 'Prevención', price: 7000 },
  { id: 'resina_1', label: 'Restauración resina 1 cara', category: 'Operatoria', price: 22000 },
  { id: 'resina_2', label: 'Restauración resina 2 caras', category: 'Operatoria', price: 28000 },
  { id: 'resina_3', label: 'Restauración resina 3 caras', category: 'Operatoria', price: 34000 },
  { id: 'amalgama', label: 'Obturación amalgama', category: 'Operatoria', price: 20000 },
  { id: 'endodoncia_uni', label: 'Endodoncia unirradicular', category: 'Endodoncia', price: 65000 },
  { id: 'endodoncia_bi', label: 'Endodoncia birradicular', category: 'Endodoncia', price: 80000 },
  { id: 'endodoncia_multi', label: 'Endodoncia multirradicular', category: 'Endodoncia', price: 95000 },
  { id: 'extraccion_simple', label: 'Extracción simple', category: 'Cirugía', price: 30000 },
  { id: 'extraccion_quirurgica', label: 'Extracción quirúrgica', category: 'Cirugía', price: 55000 },
  { id: 'extraccion_tercer_molar', label: 'Extracción 3er molar', category: 'Cirugía', price: 70000 },
  { id: 'implante', label: 'Implante oseointegrado', category: 'Implantología', price: 320000 },
  { id: 'corona_metal', label: 'Corona metal-porcelana', category: 'Prótesis', price: 140000 },
  { id: 'corona_zirconio', label: 'Corona de zirconio', category: 'Prótesis', price: 190000 },
  { id: 'corona_temporal', label: 'Corona provisional', category: 'Prótesis', price: 35000 },
  { id: 'protesis_removible', label: 'Prótesis removible', category: 'Prótesis', price: 210000 },
  { id: 'protesis_total', label: 'Prótesis completa', category: 'Prótesis', price: 280000 },
  { id: 'blanqueamiento', label: 'Blanqueamiento dental', category: 'Estética', price: 85000 },
  { id: 'carillas', label: 'Carilla estética', category: 'Estética', price: 160000 },
  { id: 'periodontal_raspaje', label: 'Raspaje y alisado radicular', category: 'Periodoncia', price: 45000 },
  { id: 'ferulizacion', label: 'Ferulización', category: 'Periodoncia', price: 30000 },
  { id: 'ortodoncia_control', label: 'Control de ortodoncia', category: 'Ortodoncia', price: 25000 },
  { id: 'ortodoncia_inicio', label: 'Instalación de ortodoncia', category: 'Ortodoncia', price: 250000 },
  { id: 'otro', label: 'Otro procedimiento', category: 'Otro', price: 0 }
];

export const TREATMENT_STATUS = [
  { id: 'planned', label: 'Planificado', color: '#f59e0b', bg: '#fffbeb', border: '#fde68a' },
  { id: 'in_progress', label: 'En proceso', color: '#0284c7', bg: '#eff6ff', border: '#bfdbfe' },
  { id: 'done', label: 'Realizado', color: '#059669', bg: '#ecfdf5', border: '#a7f3d0' }
];

// Plantillas de consentimiento informado
export const CONSENT_TEMPLATES = [
  {
    id: 'general',
    label: 'Tratamiento Odontológico General',
    title: 'CONSENTIMIENTO INFORMADO PARA TRATAMIENTO ODONTOLÓGICO',
    intro:
      'El/la paciente (o su representante legal) declara haber sido informado/a de manera clara y suficiente sobre el diagnóstico, el tratamiento propuesto, sus alternativas, sus beneficios y los riesgos que implica.',
    items: [
      'He recibido explicación sobre mi diagnóstico y las opciones de tratamiento disponibles.',
      'Se me informó sobre los posibles riesgos y complicaciones (dolor, inflamación, infección, sensibilidad, fracaso del tratamiento).',
      'Comprendo que los resultados pueden variar y no se garantiza un resultado estético o funcional específico.',
      'Autorizo la toma de radiografías y fotografías clínicas con fines diagnósticos y de seguimiento.',
      'Autorizo la administración de anestesia local, informando alergias o medicación actual.',
      'Me comprometo a seguir las indicaciones post-tratamiento y concurrir a los controles indicados.'
    ]
  },
  {
    id: 'cirugia',
    label: 'Cirugía / Extracción',
    title: 'CONSENTIMIENTO INFORMADO PARA CIRUGÍA BUCAL',
    intro:
      'Autorizo la realización del procedimiento quirúrgico odontológico indicado por el profesional, habiendo comprendido su naturaleza, alcance y riesgos.',
    items: [
      'Se me explicó el motivo de la extracción o cirugía y las alternativas existentes.',
      'Comprendo los riesgos: hemorragia, dolor, inflamación, infección, lesión de estructuras vecinas, alteración de la sensibilidad.',
      'Fui informado/a de las indicaciones post-quirúrgicas, cuidados y signos de alarma.',
      'Declaro no encontrarme en ayunas prolongado no autorizado ni consumir anticoagulantes sin informar.',
      'Comprendo que pueden requerirse procedimientos adicionales según los hallazgos intraoperatorios.'
    ]
  },
  {
    id: 'endodoncia',
    label: 'Endodoncia (Tratamiento de Conducto)',
    title: 'CONSENTIMIENTO INFORMADO PARA TRATAMIENTO DE ENDODONCIA',
    intro:
      'Autorizo la realización del tratamiento endodóntico (tratamiento de conducto) indicado, habiendo comprendido su finalidad de conservar la pieza dental.',
    items: [
      'Comprendo que la endodoncia busca conservar la pieza y eliminar la infección del conducto.',
      'Se me informó que el diente tratado puede requerir una restauración o corona definitiva posterior.',
      'Comprendo los riesgos: sensibilidad post-operatoria, fractura, instrumentación, necesidad de retratamiento o eventual extracción.',
      'Entiendo que pueden realizarse sesiones múltiples y que el pronóstico depende de la respuesta biológica.',
      'Autorizo el uso de radiografías para verificar la evolución.'
    ]
  },
  {
    id: 'ortodoncia',
    label: 'Ortodoncia',
    title: 'CONSENTIMIENTO INFORMADO PARA TRATAMIENTO DE ORTODONCIA',
    intro:
      'Autorizo la instalación y el tratamiento ortodóncico propuesto, comprendiendo su duración, requerimientos y limitaciones.',
    items: [
      'Se me informó la duración estimada del tratamiento y la necesidad de controles periódicos.',
      'Comprendo que el éxito depende de mi colaboración, higiene y asistencia a los controles.',
      'Se me advirtió sobre molestias iniciales, posibles reabsorciones radiculares y cambios de coloración.',
      'Comprendo la importancia del uso de aparatos y elíxires de retención al finalizar.',
      'Acepto las variaciones individuales de respuesta al tratamiento.'
    ]
  },
  {
    id: 'protesis',
    label: 'Prótesis / Implante',
    title: 'CONSENTIMIENTO INFORMADO PARA TRATAMIENTO PROTÉSICO E IMPLANTOLÓGICO',
    intro:
      'Autorizo la colocación de prótesis o implantes indicados, habiendo recibido información sobre el procedimiento, materiales y cuidados.',
    items: [
      'Se me explicó el tipo de prótesis o implante y las etapas del tratamiento.',
      'Comprendo los riesgos: infección, inflamación, falla de integración ósea, necesidad de recambio o ajustes.',
      'Me comprometo a mantener controles periódicos y cuidados de higiene específicos.',
      'Entiendo que el tiempo de vida útil depende del cuidado y de factores individuales.',
      'Autorizo la toma de radiografías y modelos para la confección del trabajo.'
    ]
  }
];
