import React, { useEffect, useRef, useState } from 'react';
import { useClinic } from '../../context/ClinicContext.jsx';
import { api } from '../../services/api.js';
import { MessageCircle, X, Send, Sparkles, Loader2 } from 'lucide-react';

const SUGGESTIONS = [
  '¿Cómo agendo un turno?',
  '¿Cómo envío el recordatorio de WhatsApp?',
  '¿Cómo importo mis pacientes?',
  '¿Cómo creo una historia clínica?'
];

function renderInline(text) {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
      return <strong key={i} className="font-bold text-slate-900">{part.slice(2, -2)}</strong>;
    }
    return <React.Fragment key={i}>{part}</React.Fragment>;
  });
}

export function AssistantChat() {
  const { currentSection } = useClinic();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading, isOpen]);

  const send = async (question) => {
    const q = (question ?? input).trim();
    if (!q || loading) return;

    const history = messages.map(m => ({ role: m.role, text: m.text }));
    setMessages(prev => [...prev, { role: 'user', text: q }]);
    setInput('');
    setError('');
    setLoading(true);

    try {
      const answer = await api.aiAssistant({ question: q, history, context: { section: currentSection } });
      setMessages(prev => [...prev, { role: 'assistant', text: answer }]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating toggle button */}
      <button
        onClick={() => setIsOpen(o => !o)}
        title="Asistente IA"
        className="fixed bottom-5 right-5 z-50 inline-flex items-center gap-2 pl-3.5 pr-4 py-3 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-lg transition-colors"
      >
        {isOpen ? <X className="w-4 h-4 text-emerald-400" /> : <MessageCircle className="w-4 h-4 text-emerald-400" />}
        <span className="hidden sm:inline">{isOpen ? 'Cerrar' : 'Asistente IA'}</span>
      </button>

      {/* Chat panel */}
      {isOpen && (
        <div className="fixed bottom-20 right-5 z-50 w-[min(92vw,380px)] h-[min(72vh,560px)] bg-white rounded-2xl border border-slate-200 shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-150">
          {/* Header */}
          <div className="flex items-center gap-2.5 px-4 py-3 border-b border-slate-100 bg-slate-50/70 shrink-0">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-indigo-600" />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-extrabold text-slate-900 leading-tight">Asistente SaludConnect</h3>
              <p className="text-[11px] text-slate-500 leading-tight">Preguntame cómo usar el sistema</p>
            </div>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
            {messages.length === 0 && !loading && (
              <div className="space-y-3">
                <div className="text-xs text-slate-600 bg-slate-50 border border-slate-100 rounded-xl px-3 py-2.5 leading-relaxed">
                  ¡Hola! Soy el asistente del sistema. Preguntame cómo agendar turnos, importar pacientes, enviar recordatorios de WhatsApp o usar las historias clínicas.
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {SUGGESTIONS.map(s => (
                    <button
                      key={s}
                      onClick={() => send(s)}
                      className="text-[11px] font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-full px-2.5 py-1 transition-colors"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[85%] rounded-2xl px-3 py-2 text-xs leading-relaxed whitespace-pre-wrap ${
                    m.role === 'user'
                      ? 'bg-slate-900 text-white rounded-br-sm'
                      : 'bg-slate-100 text-slate-700 rounded-bl-sm'
                  }`}
                >
                  {renderInline(m.text)}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="bg-slate-100 text-slate-500 rounded-2xl rounded-bl-sm px-3 py-2 inline-flex items-center gap-2 text-xs">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Pensando...</span>
                </div>
              </div>
            )}

            {error && (
              <p className="text-[11px] text-rose-700 bg-rose-50 border border-rose-200 rounded-lg px-3 py-2">{error}</p>
            )}
          </div>

          {/* Input */}
          <div className="border-t border-slate-100 p-2.5 flex items-end gap-2 shrink-0">
            <textarea
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  send();
                }
              }}
              placeholder="Escribí tu pregunta..."
              className="flex-1 resize-none max-h-24 px-3 py-2 text-xs bg-slate-50 focus:bg-white border border-slate-200 focus:border-slate-400 rounded-lg outline-hidden text-slate-800 placeholder-slate-400 transition-all"
            />
            <button
              onClick={() => send()}
              disabled={loading || !input.trim()}
              className="shrink-0 inline-flex items-center justify-center w-9 h-9 rounded-lg bg-slate-900 hover:bg-slate-800 text-white disabled:opacity-40 transition-colors"
              title="Enviar"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4 text-emerald-400" />}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
