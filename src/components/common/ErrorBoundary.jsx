import React from 'react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null, info: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    this.setState({ info });
    console.error('[ErrorBoundary]', error, info);
  }

  render() {
    if (this.state.error) {
      const { error, info } = this.state;
      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
          <div className="w-full max-w-2xl bg-white border border-rose-200 rounded-2xl shadow-floating overflow-hidden">
            <div className="bg-rose-600 text-white px-5 py-3.5">
              <h1 className="font-bold text-sm">Se produjo un error en la aplicación</h1>
              <p className="text-rose-100 text-xs mt-0.5">Copiá este detalle para diagnosticar el problema.</p>
            </div>
            <div className="p-5 space-y-3">
              <div>
                <p className="text-xs font-bold text-slate-700 mb-1">Mensaje</p>
                <pre className="text-[11px] leading-relaxed text-rose-700 bg-rose-50 border border-rose-100 rounded-lg p-3 overflow-auto whitespace-pre-wrap">{String(error?.message || error)}</pre>
              </div>
              {error?.stack && (
                <div>
                  <p className="text-xs font-bold text-slate-700 mb-1">Stack</p>
                  <pre className="text-[10px] leading-relaxed text-slate-600 bg-slate-50 border border-slate-200 rounded-lg p-3 overflow-auto max-h-64 whitespace-pre-wrap">{error.stack}</pre>
                </div>
              )}
              {info?.componentStack && (
                <div>
                  <p className="text-xs font-bold text-slate-700 mb-1">Componente</p>
                  <pre className="text-[10px] leading-relaxed text-slate-600 bg-slate-50 border border-slate-200 rounded-lg p-3 overflow-auto max-h-64 whitespace-pre-wrap">{info.componentStack}</pre>
                </div>
              )}
              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg"
                >
                  Recargar la página
                </button>
                <button
                  onClick={() => this.setState({ error: null, info: null })}
                  className="px-4 py-2 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg"
                >
                  Reintentar
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
