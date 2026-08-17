import React, { useState } from 'react';
import { useClinic } from '../../context/ClinicContext.jsx';
import { X, Mail, Lock, LogIn, Activity } from 'lucide-react';

export function LoginModal() {
  const { modals, closeModal, login, openModal } = useClinic();
  const isOpen = modals.loginModal?.isOpen;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
    setEmail('');
    setPassword('');
    setError('');
    closeModal('loginModal');
    openModal('registerClinicModal');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-floating border border-slate-200 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500 text-slate-950 font-bold flex items-center justify-center text-sm">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base">Iniciar Sesión</h3>
              <p className="text-xs text-slate-400">Accedé a tu panel de SaludConnect</p>
            </div>
          </div>
          <button
            onClick={() => closeModal('loginModal')}
            className="text-slate-400 hover:text-white p-1 rounded transition-colors"
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
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Email
            </label>
            <div className="relative">
              <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                placeholder="admin@tuclinica.com"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(''); }}
                className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg outline-hidden focus:bg-white focus:border-slate-400"
                autoFocus
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Contraseña
            </label>
            <div className="relative">
              <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(''); }}
                className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg outline-hidden focus:bg-white focus:border-slate-400 font-mono"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full px-5 py-2.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-2xs transition-colors flex items-center justify-center gap-2"
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
