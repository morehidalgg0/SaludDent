import React from 'react';
import { useClinic } from '../../context/ClinicContext.jsx';
import { 
  Users, 
  UserPlus, 
  Stethoscope, 
  Phone, 
  Mail, 
  Calendar, 
  Clock, 
  Edit, 
  Trash2, 
  ShieldCheck, 
  Building2 
} from 'lucide-react';

export function DoctorsManagementView() {
  const { doctors, openModal, deleteDoctor, appointments, setCurrentSection, setSelectedDoctorId } = useClinic();

  const handleDeleteDoctor = (doc) => {
    if (confirm(`¿Desea dar de baja al profesional ${doc.name}? Sus turnos históricos se preservarán.`)) {
      deleteDoctor(doc.id);
    }
  };

  return (
    <div className="space-y-4">
      
      {/* Header */}
      <div className="bg-white rounded-lg p-4 border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900">Equipo Médico & Profesionales</h2>
            <span className="px-2 py-0.2 rounded text-xs font-semibold bg-slate-100 text-slate-700">
              {doctors.length} profesionales activos
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Configura las especialidades, consultorios, matrículas e intervalos de cada médico del centro.
          </p>
        </div>

        <button
          onClick={() => openModal('newDoctor', { doctor: null })}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-lg transition-colors shadow-2xs"
        >
          <UserPlus className="w-3.5 h-3.5 text-emerald-400" />
          <span>+ Añadir Profesional</span>
        </button>
      </div>

      {/* Doctors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {doctors.map(doc => {
          const docAppointments = appointments.filter(a => a.doctorId === doc.id);

          return (
            <div
              key={doc.id}
              className="bg-white rounded-lg border border-slate-200 p-4 shadow-2xs hover:border-slate-300 transition-all flex flex-col justify-between"
            >
              <div>
                {/* Top Row: Name and Color dot */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span 
                      className="w-3 h-3 rounded-full shrink-0" 
                      style={{ backgroundColor: doc.color || '#0d9488' }}
                    ></span>
                    <div>
                      <h3 className="font-bold text-sm text-slate-900">{doc.name}</h3>
                      <p className="text-xs font-medium text-slate-500">{doc.specialty}</p>
                    </div>
                  </div>

                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                    {doc.room || 'Consultorio'}
                  </span>
                </div>

                {/* Details */}
                <div className="space-y-1.5 py-2.5 border-y border-slate-100 text-xs text-slate-600">
                  {doc.license && (
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Matrícula:</span>
                      <span className="font-mono font-semibold text-slate-800">{doc.license}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Intervalo base:</span>
                    <span className="font-semibold text-slate-800">{doc.defaultSlotMinutes || 15} minutos</span>
                  </div>

                  {doc.phone && (
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Contacto:</span>
                      <span className="text-slate-700">{doc.phone}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Turnos agendados:</span>
                    <span className="font-bold text-slate-900 bg-slate-100 px-1.5 py-0.2 rounded">
                      {docAppointments.length} turnos
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="pt-3 flex items-center justify-between gap-2 mt-2">
                <button
                  onClick={() => {
                    setSelectedDoctorId(doc.id);
                    setCurrentSection('agenda');
                  }}
                  className="flex-1 py-1.5 px-2 rounded text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 flex items-center justify-center gap-1 transition-colors"
                >
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>Ver Agenda</span>
                </button>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openModal('newDoctor', { doctor: doc })}
                    className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded transition-colors"
                    title="Editar profesional"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => handleDeleteDoctor(doc)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                    title="Dar de baja profesional"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
