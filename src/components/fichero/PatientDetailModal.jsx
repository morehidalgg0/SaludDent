import React, { useState, useEffect } from 'react';
import { useClinic } from '../../context/ClinicContext.jsx';
import { api } from '../../services/api.js';
import { AppointmentStatusBadge } from '../common/Badge.jsx';
import { 
  X, 
  FolderArchive, 
  Phone, 
  CreditCard, 
  Mail, 
  Calendar, 
  AlertTriangle, 
  CalendarPlus, 
  FileText, 
  Edit, 
  Trash2, 
  ExternalLink,
  MessageSquare,
  Clock,
  HeartPulse,
  Activity
} from 'lucide-react';
import { formatHumanDate } from '../../utils/dateUtils.js';

export function PatientDetailModal() {
  const { 
    modals, 
    closeModal, 
    openModal, 
    deletePatient, 
    setCurrentSection 
  } = useClinic();

  const isOpen = modals.patientDetail.isOpen;
  const patient = modals.patientDetail.patient;

  const [activeTab, setActiveTab] = useState('turnos'); // 'turnos' | 'historias'
  const [patientData, setPatientData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (patient?.id && isOpen) {
      setIsLoading(true);
      api.getPatientById(patient.id)
        .then(data => {
          setPatientData(data);
        })
        .catch(err => console.error(err))
        .finally(() => setIsLoading(false));
    }
  }, [patient, isOpen]);

  if (!isOpen || !patient) return null;

  const data = patientData || patient;
  const appointments = data.appointments || [];
  const medicalRecords = data.medicalRecords || [];

  const cleanPhone = (data.phone || '').replace(/\D/g, '');
  const waLink = `https://wa.me/${cleanPhone}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-floating border border-slate-200 w-full max-w-3xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Top Header */}
        <div className="bg-slate-900 text-white p-6 flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-brand-500/20 text-brand-400 border border-brand-500/30 flex items-center justify-center text-2xl font-black shrink-0">
              {data.firstName?.[0]}{data.lastName?.[0]}
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h3 className="font-extrabold text-xl">{data.firstName} {data.lastName}</h3>
                <span className="px-2.5 py-0.5 rounded-lg text-xs font-black bg-brand-500 text-slate-950">
                  {data.ficheroNumber}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300 mt-1">
                <span>DNI: {data.dni || 'Sin especificar'}</span>
                <span>•</span>
                <span>Cobertura: {data.insurance || 'Particular'} {data.insuranceNumber ? `(${data.insuranceNumber})` : ''}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                closeModal('patientDetail');
                openModal('newPatient', { patient: data });
              }}
              className="p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
              title="Editar Datos"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={() => closeModal('patientDetail')}
              className="p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Patient Key Metrics Bar */}
        <div className="bg-slate-800 text-slate-200 px-6 py-3 border-t border-slate-700/60 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Teléfono / WhatsApp</span>
            <div className="flex items-center gap-1.5 font-bold text-white mt-0.5">
              <span>{data.phone || 'S/N'}</span>
              <a href={waLink} target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:text-emerald-300">
                <MessageSquare className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          <div>
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Alergias</span>
            <span className={`font-bold mt-0.5 block ${
              data.allergies && data.allergies !== 'Ninguna referida' ? 'text-rose-400' : 'text-slate-300'
            }`}>
              {data.allergies || 'Ninguna referida'}
            </span>
          </div>

          <div>
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Grupo Sanguíneo</span>
            <span className="font-bold text-white mt-0.5 block">{data.bloodType || '0+'}</span>
          </div>

          <div>
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Emergencia</span>
            <span className="text-slate-300 truncate mt-0.5 block">{data.emergencyContact || 'No especificado'}</span>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="border-b border-slate-200 px-6 pt-4 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('turnos')}
              className={`pb-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
                activeTab === 'turnos'
                  ? 'border-brand-600 text-brand-700'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Historial de Turnos ({appointments.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('historias')}
              className={`pb-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
                activeTab === 'historias'
                  ? 'border-brand-600 text-brand-700'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Historias Clínicas & Evoluciones ({medicalRecords.length})</span>
            </button>
          </div>

          <div className="pb-2">
            {activeTab === 'turnos' ? (
              <button
                onClick={() => {
                  closeModal('patientDetail');
                  openModal('newAppointment', { prefill: { patientId: data.id } });
                }}
                className="px-3 py-1.5 text-xs font-bold bg-brand-600 text-white hover:bg-brand-700 rounded-xl flex items-center gap-1 transition-colors"
              >
                <CalendarPlus className="w-3.5 h-3.5" />
                <span>+ Agendar Turno</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  closeModal('patientDetail');
                  setCurrentSection('historias');
                  openModal('medicalRecordEditor', { patient: data });
                }}
                className="px-3 py-1.5 text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-700 rounded-xl flex items-center gap-1 transition-colors"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>+ Nueva Consulta</span>
              </button>
            )}
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-6 max-h-[50vh] overflow-y-auto space-y-3">
          
          {activeTab === 'turnos' && (
            <div className="space-y-2">
              {appointments.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-xs">
                  Este paciente no posee turnos registrados en el sistema.
                </div>
              ) : (
                appointments.map(apt => (
                  <div
                    key={apt.id}
                    onClick={() => {
                      closeModal('patientDetail');
                      openModal('appointmentDetail', { appointment: apt });
                    }}
                    className="p-3.5 rounded-xl border border-slate-200 hover:border-brand-400 hover:bg-slate-50 transition-all cursor-pointer flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 font-extrabold text-xs text-slate-800 flex items-center justify-center shrink-0 border border-slate-200">
                        {apt.time}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-slate-900">{formatHumanDate(apt.date)}</span>
                          {apt.isOverturn && (
                            <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-amber-500 text-white">
                              SOBRETURNO
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">{apt.doctorName} • {apt.specialty}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <AppointmentStatusBadge status={apt.status} size="xs" />
                      <span className="text-xs font-bold text-brand-600">Ver →</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'historias' && (
            <div className="space-y-3">
              {medicalRecords.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-xs">
                  No hay registros clínicos previos para este paciente.
                </div>
              ) : (
                medicalRecords.map(rec => (
                  <div
                    key={rec.id}
                    onClick={() => {
                      closeModal('patientDetail');
                      setCurrentSection('historias');
                      openModal('medicalRecordEditor', { patient: data, record: rec });
                    }}
                    className="p-4 rounded-xl border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/20 transition-all cursor-pointer space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-xs text-indigo-900 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                          {rec.specialty}
                        </span>
                        <span className="text-xs text-slate-500 font-semibold">{rec.date}</span>
                      </div>
                      <span className="text-xs text-slate-600 font-bold">{rec.doctorName}</span>
                    </div>

                    <div>
                      <p className="text-xs font-bold text-slate-800">Diagnóstico / Motivo:</p>
                      <p className="text-xs text-slate-600 line-clamp-2">{rec.diagnosis || rec.reason}</p>
                    </div>

                    {rec.treatmentPlan && (
                      <div className="text-[11px] text-slate-500 bg-slate-50 p-2 rounded-lg">
                        <strong>Tratamiento:</strong> {rec.treatmentPlan}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={async () => {
              if (confirm(`¿Está seguro de eliminar definitivamente a ${data.firstName} ${data.lastName} del fichero?`)) {
                await deletePatient(data.id);
                closeModal('patientDetail');
              }
            }}
            className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Eliminar del Fichero</span>
          </button>

          <button
            onClick={() => closeModal('patientDetail')}
            className="px-4 py-2 text-xs font-bold text-slate-700 bg-slate-200 hover:bg-slate-300 rounded-xl transition-colors"
          >
            Cerrar
          </button>
        </div>

      </div>
    </div>
  );
}
