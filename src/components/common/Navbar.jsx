import React, { useState, useRef, useEffect } from 'react';
import { useClinic } from '../../context/ClinicContext.jsx';
import { 
  Search, 
  UserPlus, 
  CalendarPlus, 
  Activity, 
  Home,
  Calendar,
  Folder,
  FileText,
  MessageSquare,
  Building2,
  CreditCard,
  LogIn,
  LogOut
} from 'lucide-react';

export function Navbar() {
  const { 
    currentSection, 
    setCurrentSection, 
    isLoggedIn,
    logout,
    isConnected, 
    patients, 
    openModal, 
    selectedDate,
    subscription,
    clinic,
    daySummary
  } = useClinic();

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setIsSearchOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredPatients = searchQuery.trim() === '' ? [] : patients.filter(p => {
    const q = searchQuery.toLowerCase().trim();
    return (
      (p.ficheroNumber && p.ficheroNumber.toLowerCase().includes(q)) ||
      (p.firstName && p.firstName.toLowerCase().includes(q)) ||
      (p.lastName && p.lastName.toLowerCase().includes(q)) ||
      (p.dni && p.dni.replace(/\./g, '').includes(q.replace(/\./g, ''))) ||
      (p.phone && p.phone.includes(q)) ||
      (p.insurance && p.insurance.toLowerCase().includes(q))
    );
  }).slice(0, 6);

  const allNavTabs = [
    { id: 'home', label: 'Inicio', icon: Home, count: null },
    { id: 'agenda', label: 'Agenda de Turnos', icon: Calendar, count: daySummary?.total || null },
    { id: 'fichero', label: 'Fichero de Pacientes', icon: Folder, count: null },
    { id: 'historias', label: 'Historias Clínicas', icon: FileText, count: null },
    { id: 'whatsapp', label: 'Notificaciones WhatsApp', icon: MessageSquare, count: null },
    { id: 'espera', label: 'Sala de Espera', icon: Building2, count: null },
    { id: 'suscripcion', label: 'Planes & Suscripción', icon: CreditCard, badge: 'SaaS' }
  ];

  const navTabs = isLoggedIn ? allNavTabs : allNavTabs.filter(t => t.id === 'home');

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-2xs">
      
      {/* Top Bar: Brand, Search and Quick Actions */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14 gap-3">
          
          {/* Logo & Clinical Brand */}
          <div 
            className="flex items-center gap-2.5 shrink-0 cursor-pointer" 
            onClick={() => setCurrentSection('home')}
            title="Ir a la página de Inicio"
          >
            <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-white font-bold text-sm">
              <Activity className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-base text-slate-900 tracking-tight">
                  {clinic?.name || 'SaludConnect'}
                </span>
                <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 hidden sm:inline">
                  {subscription?.planId === 'enterprise' ? 'Corporativo' : subscription?.planId === 'basic' ? 'Básico' : 'Profesional'}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Global Patient Search - Only when logged in */}
          {isLoggedIn && (
          <div className="flex-1 max-w-sm relative" ref={searchRef}>
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar por N° Fichero, DNI o Paciente..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsSearchOpen(true);
                }}
                onFocus={() => setIsSearchOpen(true)}
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 focus:border-slate-400 rounded-lg outline-hidden text-slate-800 placeholder-slate-400 transition-all"
              />
            </div>

            {/* Results Dropdown */}
            {isSearchOpen && filteredPatients.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border border-slate-200 overflow-hidden z-50">
                <div className="px-3 py-1.5 bg-slate-50 border-b border-slate-100 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Resultados en Fichero ({filteredPatients.length})
                </div>
                <div className="divide-y divide-slate-100 max-h-60 overflow-y-auto">
                  {filteredPatients.map(p => (
                    <div
                      key={p.id}
                      onClick={() => {
                        openModal('patientDetail', { patient: p });
                        setIsSearchOpen(false);
                        setSearchQuery('');
                      }}
                      className="p-2.5 hover:bg-slate-50 cursor-pointer flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-slate-900 truncate">
                            {p.lastName}, {p.firstName}
                          </span>
                          <span className="px-1.5 py-0.2 rounded text-[10px] font-mono font-bold bg-slate-100 text-slate-700 border border-slate-200">
                            {p.ficheroNumber}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          DNI {p.dni || 'S/D'} • Tel: {p.phone || 'S/N'}
                        </div>
                      </div>
                      <span className="text-[11px] text-slate-600 font-medium hover:underline shrink-0">
                        Ficha →
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          )}

          {/* Right Controls */}
          <div className="flex items-center gap-2">
            
            {/* Create Clinic Account Button - Only when NOT logged in */}
            {!isLoggedIn && (
            <button
              onClick={() => openModal('registerClinicModal')}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 transition-colors"
              title="Registrar una nueva clínica o consultorio"
            >
              <Building2 className="w-3.5 h-3.5 text-emerald-700" />
              <span className="hidden md:inline">Registrar Clínica</span>
            </button>
            )}

            {/* Login Button - Only when NOT logged in */}
            {!isLoggedIn && (
            <button
              onClick={() => openModal('loginModal')}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-700 transition-colors"
            >
              <LogIn className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden md:inline">Iniciar Sesión</span>
            </button>
            )}

            {/* New Patient Button - Only when logged in */}
            {isLoggedIn && (
            <button
              onClick={() => openModal('newPatient', { patient: null })}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-700 transition-colors"
            >
              <UserPlus className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden sm:inline">Nuevo Paciente</span>
            </button>
            )}

            {/* Schedule Turn Button - Only when logged in */}
            {isLoggedIn && (
            <button
              onClick={() => openModal('newAppointment', { prefill: { date: selectedDate } })}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg bg-slate-900 hover:bg-slate-800 text-white transition-colors"
            >
              <CalendarPlus className="w-3.5 h-3.5 text-emerald-400" />
              <span>Agendar Turno</span>
            </button>
            )}

            {/* Logout Button - Only when logged in */}
            {isLoggedIn && (
            <button
              onClick={logout}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors"
              title="Cerrar Sesión"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden lg:inline">Salir</span>
            </button>
            )}

          </div>

        </div>
      </div>

      {/* BOTTOM ROW: HORIZONTAL TABS MENU */}
      <div className="border-t border-slate-100 bg-slate-50/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 overflow-x-auto">
          <nav className="flex items-center gap-1 py-1 min-w-max">
            {navTabs.map(tab => {
              const Icon = tab.icon;
              const isActive = currentSection === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setCurrentSection(tab.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-semibold transition-all shrink-0 ${
                    isActive
                      ? 'bg-white text-slate-950 border border-slate-200/90 shadow-2xs font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-slate-900' : 'text-slate-400'}`} />
                  <span>{tab.label}</span>
                  
                  {tab.count !== null && (
                    <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                      isActive ? 'bg-slate-900 text-white' : 'bg-slate-200 text-slate-700'
                    }`}>
                      {tab.count}
                    </span>
                  )}

                  {tab.badge && (
                    <span className="px-1.5 py-0.2 rounded text-[9px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-900 border border-emerald-300">
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

    </header>
  );
}
