import { GoogleGenAI } from '@google/genai';

const MODELS = ['gemini-3.8-flash', 'gemini-flash-latest'];
const MAX_QUESTION_CHARS = 1500;
const MAX_HISTORY_TURNS = 10;

let client = null;
function getClient() {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('La IA no está configurada: falta la variable de entorno GEMINI_API_KEY.');
  }
  client ||= new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  return client;
}

// Classifies a Gemini API error so the caller can decide whether to retry,
// try the next model, or give up. `@google/genai` surfaces the raw API body in
// `err.message` (a JSON string), so we match on the text.
function classifyError(err) {
  const s = String(err?.message || err || '');
  if (/503|UNAVAILABLE|high demand|overload/i.test(s)) return 'retry';
  if (/429|RESOURCE_EXHAUSTED|rate limit|quota/i.test(s)) return 'retry';
  if (/404|NOT_FOUND|no longer available|not found/i.test(s)) return 'next';
  return 'fatal';
}

async function generate(contents) {
  const ai = getClient();
  const config = { systemInstruction: SYSTEM, temperature: 0.4, maxOutputTokens: 1200 };

  for (const model of MODELS) {
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const res = await ai.models.generateContent({ model, contents, config });
        return (res.text || '').trim();
      } catch (err) {
        const kind = classifyError(err);
        if (kind === 'fatal') throw err;
        if (kind === 'next') break;
        if (attempt === 0) await new Promise(r => setTimeout(r, 500));
      }
    }
  }

  throw new Error('El asistente está con mucha demanda en este momento. Esperá unos segundos y volvé a intentar.');
}

const SYSTEM = `Sos el asistente de ayuda de "SaludConnect", un sistema de gestión clínica y turnos para consultorios y clínicas de Argentina.

Tu única función es explicarle al usuario CÓMO USAR el sistema y sus funcionalidades, y ayudarlo a resolver dudas operativas del día a día.
Reglas:
- Respondé siempre en español rioplatense, claro, cordial y conciso.
- Explicá en pasos concretos indicando el nombre exacto de botones, pestañas y secciones.
- NO inventes funciones, pantallas ni botones que no existan. Si algo no existe o no estás seguro, decilo y sugerí contactar al soporte.
- No des consejos médicos ni clínicos: eso es responsabilidad del profesional. Si te preguntan algo clínico, aclaralo brevemente.
- No pidas ni repitas datos personales de pacientes (nombres, DNI, teléfonos).
- Usá viñetas y negritas con moderación para que sea fácil de leer.

Módulos del sistema y cómo usarlos:

**Inicio / Panel de Control**: muestra turnos de hoy, cantidad de pacientes, profesionales y plan. Incluye el "Resumen inteligente" (IA que analiza próximos 14 días y últimos 30 con cifras agregadas) y accesos rápidos a Agenda, Fichero y Agendar Turno.

**Agenda de Turnos**: barra superior con vistas Diaria, Semanal, Quincenal y Mensual. Grilla de 15 minutos (08:00 a 20:00) con duraciones de 15, 30, 45, 60, 90 y 120 min.
- Para agendar: botón "Agendar Turno" arriba a la derecha, o clic en un horario libre de la grilla.
- Sobreturnos: al agendar sobre un horario ocupado se ofrece como sobreturno (turno urgente en paralelo), resaltado en la grilla.
- Totalizador diario: total, confirmados, cancelados, pendientes, ocupación y sobreturnos.
- Filtro por profesional en la cabecera de la agenda.
- Se puede anular/reagendar y editar el detalle de cada turno.

**Fichero de Pacientes**: cada paciente recibe un N° de Fichero correlativo automático (ej. F-10240).
- Alta: botón "Nuevo Paciente".
- Búsqueda: buscador global de la barra superior (por N° Fichero, DNI, nombre, teléfono u obra social) o el buscador del fichero.
- Importación masiva: botón de importar en el fichero, acepta planillas (Excel/CSV) y admite pacientes sin DNI con ID propio.
- La ficha incluye contacto, alergias/riesgos, historial de turnos y acceso a la Historia Clínica.

**Historias Clínicas (EHR)**: por paciente y especialidad. Módulos: Odontología (odontograma 2D de 32 piezas), Kinesiología (mapa de dolor y escala EVA), Nutrición (IMC, antropometría, macros), Psicología (GAD-7), Pediatría (percentiles y vacunación), Oftalmología (Snellen, refracción) y Medicina General (signos vitales, diagnóstico, recetas/certificados imprimibles). El editor incluye asistencia de IA para mejorar la redacción, resumir o sugerir un plan.

**Notificaciones WhatsApp**: envío de recordatorios con enlaces wa.me. El paciente recibe botones "Aceptar Turno" / "Cancelar Turno" y su respuesta impacta en la agenda en tiempo real. Hay Simulador de interacción y Envío masivo por fecha. El Portal del Paciente permite confirmar/cancelar desde el link.

**Sala de Espera**: monitor de flujo en vivo (Por Llegar, En Sala, En Consulta, Atendidos) con contador de tiempo.

**Profesionales**: alta y edición de médicos con especialidad, consultorio, matrícula, color e intervalo base.

**Planes & Suscripción**: planes Básico, Profesional y Corporativo, con cambio de plan, datos de pago y facturación.

**Importar Citas**: desde export de Dentalink (Agenda de Citas) mediante el botón de importar en la agenda.

Si el usuario pregunta por la ubicación de algo, guialo por la barra de pestañas superior (Inicio, Agenda de Turnos, Fichero de Pacientes, Historias Clínicas, Notificaciones WhatsApp, Sala de Espera, Planes & Suscripción).`;

// Offline fallback: canned answers for the most common questions, used when Gemini
// is unavailable (saturated, missing API key, network error) so the assistant always
// answers something useful.
const LOCAL_FAQ = [
  {
    keywords: ['agendar turno', 'agendar', 'agenda', 'nuevo turno', 'sacar turno', 'reservar turno', 'turno', 'cita', 'programar'],
    answer: 'Para agendar un turno: entrá a **Agenda de Turnos** y usá el botón **"Agendar Turno"** (arriba a la derecha), o hacé clic en un horario libre de la grilla.\n\nElegí paciente, profesional, fecha, hora y duración (15, 30, 45, 60, 90 o 120 min). Si el horario ya está ocupado, el sistema te ofrece cargarlo como **sobreturno**.'
  },
  {
    keywords: ['importar paciente', 'import', 'excel', 'csv', 'xlsx', 'planilla', 'cargar paciente'],
    answer: 'Para importar pacientes: entrá a **Fichero de Pacientes**, tocá el botón **"Importar"** y subí un archivo **CSV o Excel (.xlsx / .xls)**.\n\nMapeá las columnas, revisá la vista previa y confirmá. No hay límite de pacientes (se cargan por lotes) y se evitan duplicados por DNI o N° de Fichero. Admite fichas sin DNI.'
  },
  {
    keywords: ['whatsapp', 'recordatorio', 'mensaje', 'confirmar turno', 'cancelar turno', 'notificacion', 'aviso', 'enviar whatsapp'],
    answer: 'Para enviar recordatorios por WhatsApp: entrá a **Notificaciones WhatsApp** y usá **"Enviar recordatorio"** en un turno, o el **Envío masivo** por fecha.\n\nEl paciente recibe botones **[Aceptar Turno]** y **[Cancelar Turno]**; su respuesta impacta en la agenda en tiempo real. Si querés probarlo, usá el **Simulador de interacción**.'
  },
  {
    keywords: ['historia clinica', 'odontograma', 'evolucion', 'ficha clinica', 'receta', 'certificado', 'ehr', 'historia'],
    answer: 'Para crear una historia clínica: entrá a **Historias Clínicas**, buscá al paciente y creá un registro nuevo eligiendo la especialidad.\n\nCada especialidad tiene su módulo (odontograma, mapa de dolor, IMC, Snellen, etc.). Desde ahí podés **imprimir recetas y certificados**, y usar la IA para mejorar la redacción, resumir o sugerir un plan.'
  },
  {
    keywords: ['nuevo paciente', 'crear paciente', 'alta paciente', 'agregar paciente', 'registrar paciente'],
    answer: 'Para dar de alta un paciente: usá el botón **"Nuevo Paciente"** en la barra superior (o desde el Fichero de Pacientes).\n\nCompletá los datos y guardá: el sistema le asigna automáticamente un **N° de Fichero correlativo** (ej. F-10240).'
  },
  {
    keywords: ['buscar paciente', 'numero de fichero', 'encontrar paciente', 'buscar fichero', 'fichero'],
    answer: 'Para buscar un paciente: usá el **buscador global** de la barra superior. Podés buscar por **N° de Fichero, DNI, nombre, teléfono u obra social**.\n\nAl hacer clic en un resultado se abre su ficha completa.'
  },
  {
    keywords: ['sobreturno', 'sobreturnos', 'turno urgente'],
    answer: 'Los **sobreturnos** son turnos urgentes que se agendan sobre un horario ya ocupado, en paralelo, sin romper la grilla.\n\nAl agendar sobre un horario ocupado el sistema te ofrece cargarlo como sobreturno y queda resaltado en la agenda.'
  },
  {
    keywords: ['sala de espera', 'recepcion', 'llego el paciente', 'monitor de flujo'],
    answer: 'La **Sala de Espera** muestra el flujo en vivo: Por Llegar, En Sala de Espera (con contador de tiempo), En Consulta y Atendidos.\n\nSirve para recepción y para saber cuánto espera cada paciente.'
  },
  {
    keywords: ['profesional', 'medico', 'doctor', 'agregar medico', 'odontologo', 'especialidad', 'consultorio'],
    answer: 'Para agregar un profesional: entrá a la gestión de **Profesionales** y creá uno nuevo con su **especialidad, consultorio, matrícula, color e intervalo base**.\n\nLos profesionales aparecen en la agenda y en los filtros de la cabecera.'
  },
  {
    keywords: ['suscripcion', 'plan', 'planes', 'facturacion', 'cambiar plan', 'pago', 'precio', 'costo'],
    answer: 'En **Planes & Suscripción** podés ver tu plan actual (Básico, Profesional o Corporativo), **cambiar de plan**, administrar el método de pago y ver la facturación.'
  },
  {
    keywords: ['resumen inteligente', 'insight', 'asistente', 'redactar', 'resumir texto', 'ia'],
    answer: 'La IA está integrada en dos lugares:\n- **Resumen inteligente** (en Inicio): analiza tus próximos 14 días y los últimos 30 con cifras agregadas.\n- **Asistencia clínica** (en el editor de historia clínica): mejora la redacción, resume o sugiere un plan.\n\nY este mismo **Asistente IA** te responde dudas sobre cómo usar el sistema.'
  },
  {
    keywords: ['importar citas', 'dentalink', 'importar turnos', 'importar agenda'],
    answer: 'Para importar citas: entrá a **Agenda de Turnos** y usá el botón de importar. Acepta el export de **Dentalink (Agenda de Citas)**.\n\nEl sistema vincula las citas con los pacientes y profesionales existentes.'
  },
  {
    keywords: ['contrasena', 'iniciar sesion', 'registrar clinica', 'cuenta', 'usuario', 'clave', 'login'],
    answer: 'Para acceder: usá **"Iniciar Sesión"** con el email y la contraseña de la clínica. Si todavía no tenés cuenta, tocá **"Registrar Clínica"** para crear una (incluye 14 días de prueba).'
  }
];

const norm = (s) => (s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

function kwRegex(keyword) {
  const esc = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  // Prefix match anchored at a word start, so "import" matches "importo"/"importar"
  // but "turno" does NOT match inside "sobreturno".
  return new RegExp(`(?:^|[^a-z0-9])${esc}`, 'i');
}

function localAnswer(question) {
  const q = norm(question);
  let best = null;
  let bestScore = 0;

  for (const item of LOCAL_FAQ) {
    let score = 0;
    for (const kw of item.keywords) {
      if (kwRegex(norm(kw)).test(q)) score += kw.includes(' ') ? 3 : 1;
    }
    if (score > bestScore) {
      bestScore = score;
      best = item;
    }
  }

  if (best) return best.answer;

  return 'Puedo ayudarte con el uso del sistema. Probá preguntarme, por ejemplo:\n- ¿Cómo agendo un turno?\n- ¿Cómo importo mis pacientes?\n- ¿Cómo envío recordatorios de WhatsApp?\n- ¿Cómo creo una historia clínica?\n- ¿Cómo cambio de plan?\n\n(El asistente con IA está con mucha demanda ahora; probá de nuevo en unos segundos para respuestas más detalladas.)';
}

export async function helpAssistant({ question, history = [], context = {} } = {}) {
  const q = (question || '').trim();
  if (!q) throw new Error('Escribí tu consulta para que el asistente pueda ayudarte.');
  if (q.length > MAX_QUESTION_CHARS) throw new Error(`Tu consulta es demasiado larga (máximo ${MAX_QUESTION_CHARS} caracteres).`);

  const contents = history
    .slice(-MAX_HISTORY_TURNS * 2)
    .filter(m => m && m.text)
    .map(m => ({ role: m.role === 'assistant' ? 'model' : 'user', parts: [{ text: String(m.text).slice(0, MAX_QUESTION_CHARS) }] }));

  const where = context.section ? `\n\n(Contexto: el usuario está en la sección "${context.section}" del sistema.)` : '';
  contents.push({ role: 'user', parts: [{ text: q + where }] });

  try {
    const text = await generate(contents);
    if (text) return text;
  } catch {
    // Gemini unavailable (saturated / no key / network): answer from the local FAQ.
  }
  return localAnswer(q);
}
