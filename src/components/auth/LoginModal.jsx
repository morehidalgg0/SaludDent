import React, { useState } from 'react';
import { useClinic } from '../../context/ClinicContext.jsx';
import { X, Mail, Lock, LogIn, Activity, Eye, EyeOff, ShieldCheck } from 'lucide-react';

const LAST_EMAIL_KEY = 'saludconnect_last_email';

export function LoginModal() {
  const { modals, closeModal, login, openModal, clinic } = useClinic();
  const isOpen = modals.loginModal?.isOpen;

  const [email, setEmail] = useState(() => {
    try { return localStorage.getItem(LAST_EMAIL_KEY) || ''; } catch { return ''; }
  });
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Completá email y contraseña.');
      return;
    }

    setIsSubmitting(true);
    try {
      await login(email.trim(), password);
      try {
        if (remember) localStorage.setItem(LAST_EMAIL_KEY, email.trim());
        else localStorage.removeItem(LAST_EMAIL_KEY);
      } catch { /* ignore */ }
      setEmail('');
      setPassword('');
      closeModal('loginModal');
    } catch (err) {
      setError(err.message || 'Error al iniciar sesión.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSwitchToRegister = () => {
    setPassword('');
    setError('');
    closeModal('loginModal');
    openModal('registerClinicModal');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs" onClick={() => closeModal('loginModal')}>
      <div className="bg-white rounded-2xl shadow-floating border border-slate-200 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150" onClick={(e) => e.stopPropagation()}>

        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500 text-slate-950 font-bold flex items-center justify-center text-sm">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base">Iniciar Sesión</h3>
              <p className="text-xs text-slate-400">
                {clinic?.name ? `Ingresá a ${clinic.name}` : 'Accedé a tu panel de SaludConnect'}
              </p>
            </div>
          </div>
          <button
            onClick={() => closeModal('loginModal')}
            className="text-slate-400 hover:text-white p-1 rounded transition-colors"
            aria-label="Cerrar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">

          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700 font-medium">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="login-email" className="block text-xs font-semibold text-slate-700 mb-1">
              Email
            </label>
            <div className="relative">
              <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                id="login-email"
                type="email"
                required
                autoComplete="email"
                placeholder="admin@tuclinica.com"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(''); }}
                className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg outline-hidden focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                autoFocus
              />
            </div>
          </div>

          <div>
            <label htmlFor="login-password" className="block text-xs font-semibold text-slate-700 mb-1">
              Contraseña
            </label>
            <div className="relative">
              <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                required
                autoComplete="current-password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(''); }}
                className="w-full pl-9 pr-10 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg outline-hidden focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(v => !v)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-700 rounded"
                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="w-3.5 h-3.5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
            />
            <span className="text-xs text-slate-600">Recordar mi email en este equipo</span>
          </label>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full px-5 py-2.5 text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-2xs transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {isSubmitting ? (
              <span>Ingresando...</span>
            ) : (
              <>
                <LogIn className="w-4 h-4 text-emerald-400" />
                <span>Iniciar Sesión</span>
              </>
            )}
          </button>

          <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Conexión segura. Usá el email con el que registraste tu clínica.</span>
          </div>

          <div className="text-center pt-2 border-t border-slate-100">
            <p className="text-xs text-slate-500">
              ¿No tenés cuenta?{' '}
              <button
                type="button"
                onClick={handleSwitchToRegister}
                className="text-slate-900 font-bold hover:underline"
              >
                Crear cuenta gratis
              </button>
            </p>
          </div>

        </form>
      </div>
    </div>
  );
}
