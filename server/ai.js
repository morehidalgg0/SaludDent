import Anthropic from '@anthropic-ai/sdk';

const MODEL = 'claude-opus-5';
const MAX_INPUT_CHARS = 4000;

let client = null;
function getClient() {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error('La IA no está configurada: falta la variable de entorno ANTHROPIC_API_KEY.');
  }
  client ||= new Anthropic();
  return client;
}

async function complete({ system, prompt, maxTokens = 2000 }) {
  const res = await getClient().messages.create({
    model: MODEL,
    max_tokens: maxTokens,
    output_config: { effort: 'low' },
    system,
    messages: [{ role: 'user', content: prompt }]
  });
  if (res.stop_reason === 'refusal') throw new Error('La IA no pudo procesar esta solicitud.');
  return res.content.filter(b => b.type === 'text').map(b => b.text).join('\n').trim();
}

const CLINICAL_SYSTEM = `Sos un asistente de redacción para profesionales de la salud en Argentina (historias clínicas electrónicas).
Reglas:
- Escribí en español rioplatense profesional, claro y conciso, con terminología clínica correcta.
- NUNCA inventes datos, síntomas, dosis, diagnósticos ni antecedentes que no estén en el texto o el contexto dado.
- Si falta información importante, no la completes: señalala al final en una línea que empiece con "Falta:".
- Devolvé únicamente el texto pedido, sin introducciones ni explicaciones. El profesional revisa y decide todo.`;

const MODE_INSTRUCTIONS = {
  improve: 'Reescribí el siguiente texto con redacción clínica profesional, ordenada y sin perder ningún dato:',
  summarize: 'Resumí el siguiente texto en 2-4 líneas clínicas, conservando lo relevante:',
  suggest_plan: 'Con la información del caso, proponé un borrador de plan de tratamiento / conducta en viñetas cortas, marcado como sugerencia a validar por el profesional:'
};

export async function clinicalAssist({ mode, text, context = {} }) {
  const instruction = MODE_INSTRUCTIONS[mode];
  if (!instruction) throw new Error('Modo de asistencia inválido.');
  const trimmed = (text || '').trim();
  if (!trimmed) throw new Error('Escribí algo de texto primero para que la IA pueda ayudarte.');
  if (trimmed.length > MAX_INPUT_CHARS) throw new Error(`El texto es demasiado largo (máximo ${MAX_INPUT_CHARS} caracteres).`);

  const ctxLines = [
    context.specialty && `Especialidad: ${context.specialty}`,
    context.reason && `Motivo de consulta: ${context.reason}`,
    context.diagnosis && `Diagnóstico: ${context.diagnosis}`,
    context.anamnesis && mode === 'suggest_plan' && `Anamnesis: ${String(context.anamnesis).slice(0, MAX_INPUT_CHARS)}`
  ].filter(Boolean).join('\n');

  const prompt = `${instruction}\n\n${ctxLines ? `Contexto:\n${ctxLines}\n\n` : ''}Texto:\n${trimmed}`;
  return complete({ system: CLINICAL_SYSTEM, prompt });
}

const INSIGHTS_SYSTEM = `Sos un analista de gestión para un consultorio/clínica en Argentina.
Recibís métricas agregadas (sin datos personales de pacientes) y devolvés entre 3 y 5 observaciones accionables en viñetas, en español rioplatense.
Cada viñeta: qué pasa (con el número) y qué acción concreta tomar. Basate solo en los datos dados; no inventes cifras. Sin introducción ni cierre.`;

export async function clinicInsights(snapshot) {
  return complete({
    system: INSIGHTS_SYSTEM,
    prompt: `Métricas de la clínica:\n${JSON.stringify(snapshot, null, 2)}`,
    maxTokens: 1500
  });
}
