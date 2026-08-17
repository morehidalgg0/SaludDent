import React from 'react';
import { useClinic } from '../../context/ClinicContext.jsx';
import { 
  Calendar, 
  Folder, 
  FileText, 
  MessageSquare, 
  Users
} from 'lucide-react';

export function Sidebar() {
  const { currentSection, setCurrentSection, appointments, selectedDate, daySummary } = useClinic();

  const navItems = [
    {
      id: 'agenda',
      label: 'Agenda de Turnos',
      icon: Calendar,
      count: daySummary?.total || null
    },
    {
      id: 'fichero',
      label: 'Fichero de Pacientes',
      icon: Folder,
      count: null
    },
    {
      id: 'historias',
      label: 'Historias Clínicas',
      icon: FileText,
      count: null
    },
    {
      id: 'whatsapp',
      label: 'Notificaciones WhatsApp',
      icon: MessageSquare,
      count: null
    },
    {
      id: 'espera',
      label: 'Sala de Espera',
      icon: Users,
      count: null
    }
  ];

  return (
    <aside className="w-56 shrink-0 bg-white border-r border-slate-200 hidden md:flex flex-col justify-between p-3 min-h-[calc(100vh-3.5rem)]">
      <div className="space-y-4">
        <nav className="space-y-0.5">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = currentSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentSection(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                  isActive
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.count !== null && (
                  <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                    isActive ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* System specs */}
      <div className="pt-3 border-t border-slate-200 text-[11px] text-slate-400 space-y-0.5">
        <div className="flex justify-between">
          <span>Intervalo base:</span>
          <span className="font-medium text-slate-600">15 minutos</span>
        </div>
        <div className="flex justify-between">
          <span>Base de datos:</span>
          <span className="font-medium text-slate-600">En servidor</span>
        </div>
      </div>
    </aside>
  );
}
