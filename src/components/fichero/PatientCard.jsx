import React from 'react';
import { useClinic } from '../../context/ClinicContext.jsx';
import { 
  Phone, 
  CreditCard, 
  AlertCircle, 
  CalendarPlus, 
  FileText, 
  MessageSquare
} from 'lucide-react';

export function PatientCard({ patient }) {
  const { openModal, setCurrentSection } = useClinic();

  const cleanPhone = (patient.phone || '').replace(/\D/g, '');
  const waLink = `https://wa.me/${cleanPhone}`;

  return (
    <div 
      onClick={() => openModal('patientDetail', { patient })}
      className="bg-white rounded-lg border border-slate-200 p-3.5 hover:border-slate-400 transition-all cursor-pointer flex flex-col justify-between shadow-2xs group"
    >
      <div>
        {/* Top Header: Name and Fichero Tag */}
        <div className="flex items-start justify-between gap-2 mb-1.5">
          <div className="min-w-0">
            <h3 className="font-bold text-sm text-slate-900 group-hover:text-slate-950 truncate">
              {patient.lastName}, {patient.firstName}
            </h3>
            <div className="text-[11px] text-slate-500 mt-0.5">
              DNI: {patient.dni || 'Sin registrar'} • {patient.insurance || 'Particular'}
            </div>
          </div>

          <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-slate-100 text-slate-800 border border-slate-200 shrink-0">
            {patient.ficheroNumber}
          </span>
        </div>

        {/* Contact Info & Alerts */}
        <div className="space-y-1 py-1.5 border-t border-slate-100 text-xs">
          <div className="flex items-center justify-between text-slate-600">
            <span className="flex items-center gap-1.5 text-[11px]">
              <Phone className="w-3 h-3 text-slate-400" />
              {patient.phone || 'Sin teléfono'}
            </span>
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="text-emerald-700 hover:text-emerald-800 p-0.5 rounded hover:bg-emerald-50"
              title="Abrir WhatsApp"
            >
              <MessageSquare className="w-3.5 h-3.5" />
            </a>
          </div>

          {patient.allergies && patient.allergies !== 'Ninguna referida' && (
            <div className="flex items-center gap-1 text-rose-800 bg-rose-50/80 px-1.5 py-0.5 rounded text-[10px] font-medium border border-rose-200">
              <AlertCircle className="w-3 h-3 text-rose-600 shrink-0" />
              <span className="truncate">Alergias: {patient.allergies}</span>
            </div>
          )}
        </div>
      </div>

      {/* Action Footer */}
      <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2 mt-1">
        <button
          onClick={(e) => {
            e.stopPropagation();
            openModal('newAppointment', { prefill: { patientId: patient.id } });
          }}
          className="flex-1 py-1 px-2 rounded-md text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 flex items-center justify-center gap-1 transition-colors"
        >
          <CalendarPlus className="w-3 h-3 text-slate-500" />
          <span>Agendar</span>
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            setCurrentSection('historias');
            openModal('medicalRecordEditor', { patient });
          }}
          className="py-1 px-2.5 rounded-md text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 flex items-center justify-center gap-1 transition-colors"
          title="Abrir Historia Clínica"
        >
          <FileText className="w-3 h-3 text-slate-500" />
          <span>H. Clínica</span>
        </button>
      </div>

    </div>
  );
}
