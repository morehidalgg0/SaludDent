import React, { useState, useEffect } from 'react';
import { useClinic } from '../../context/ClinicContext.jsx';
import { api } from '../../services/api.js';
import { 
  FileText, 
  Search, 
  Plus, 
  Filter, 
  User, 
  Printer, 
  Edit
} from 'lucide-react';
import { formatHumanDate } from '../../utils/dateUtils.js';

export function MedicalRecordsView() {
  const { patients, doctors, openModal } = useClinic();

  const [selectedPatientId, setSelectedPatientId] = useState('all');
  const [selectedSpecialty, setSelectedSpecialty] = useState('all');
  const [records, setRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadRecords = async () => {
    setIsLoading(true);
    try {
      const data = await api.getMedicalRecords({
        patientId: selectedPatientId !== 'all' ? selectedPatientId : undefined,
        specialtySlug: selectedSpecialty !== 'all' ? selectedSpecialty : undefined
      });
      setRecords(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadRecords();
  }, [selectedPatientId, selectedSpecialty]);

  return (
    <div className="space-y-3">
      
      {/* Top Header */}
      <div className="bg-white rounded-lg p-3.5 border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900">Historias Clínicas & Evoluciones</h2>
            <span className="px-2 py-0.2 rounded text-xs font-semibold bg-slate-100 text-slate-700">
              {records.length} registros
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Módulos de Odontología, Kinesiología, Nutrición, Psicología, Pediatría, Oftalmología y Clínica Médica.
          </p>
        </div>

        <button
          onClick={() => openModal('medicalRecordEditor', { patient: null, doctor: null })}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-lg transition-colors"
        >
          <Plus className="w-3.5 h-3.5 text-emerald-400" />
          <span>+ Nueva Consulta Médica</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-lg p-3 border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
        
        {/* Patient Selector */}
        <div className="flex items-center gap-2 flex-1">
          <User className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={selectedPatientId}
            onChange={(e) => setSelectedPatientId(e.target.value)}
            className="w-full px-2.5 py-1.5 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-md outline-hidden"
          >
            <option value="all">Todos los pacientes ({patients.length})</option>
            {patients.map(p => (
              <option key={p.id} value={p.id}>
                {p.lastName}, {p.firstName} — {p.ficheroNumber}
              </option>
            ))}
          </select>
        </div>

        {/* Specialty Selector */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={selectedSpecialty}
            onChange={(e) => setSelectedSpecialty(e.target.value)}
            className="px-2.5 py-1.5 text-xs font-medium bg-slate-50 border border-slate-200 rounded-md outline-hidden"
          >
            <option value="all">Todas las especialidades</option>
            <option value="odontologia">Odontología (Odontograma)</option>
            <option value="kinesiologia">Kinesiología (Mapa Corporal)</option>
            <option value="nutricion">Nutrición (Antropometría & IMC)</option>
            <option value="psicologia">Psicología (Salud Mental)</option>
            <option value="pediatria">Pediatría (Percentiles & Vacunas)</option>
            <option value="oftalmologia">Oftalmología (Refracción)</option>
            <option value="medicina_general">Medicina General</option>
          </select>
        </div>

      </div>

      {/* Records Timeline */}
      <div className="space-y-2.5">
        {records.length === 0 ? (
          <div className="bg-white rounded-lg border border-slate-200 p-8 text-center text-slate-400 text-xs">
            No se encontraron evoluciones clínicas registradas con los filtros seleccionados.
          </div>
        ) : (
          records.map(record => {
            const patient = patients.find(p => p.id === record.patientId);

            return (
              <div
                key={record.id}
                className="bg-white rounded-lg border border-slate-200 p-4 hover:border-slate-300 transition-all space-y-2.5 shadow-2xs"
              >
                {/* Header Line */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-slate-900">
                        {patient ? `${patient.lastName}, ${patient.firstName}` : 'Paciente'}
                      </span>
                      <span className="px-1.5 py-0.2 rounded text-[10px] font-mono font-bold bg-slate-100 text-slate-700 border border-slate-200">
                        {patient?.ficheroNumber || 'S/F'}
                      </span>
                      <span className="text-xs text-slate-400">•</span>
                      <span className="text-xs font-semibold text-slate-600">
                        {record.specialty}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-500 font-medium">
                      Atendido por {record.doctorName} el {formatHumanDate(record.date)}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => openModal('prescriptionPrint', {
                        record: {
                          patientName: `${patient?.firstName} ${patient?.lastName}`,
                          ficheroNumber: patient?.ficheroNumber,
                          dni: patient?.dni,
                          doctorName: record.doctorName,
                          specialty: record.specialty,
                          date: record.date,
                          diagnosis: record.diagnosis,
                          treatmentPlan: record.treatmentPlan,
                          prescriptions: record.prescriptions
                        },
                        type: 'receta'
                      })}
                      className="px-2 py-1 text-xs font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded flex items-center gap-1 transition-colors"
                      title="Imprimir Receta Médica"
                    >
                      <Printer className="w-3.5 h-3.5 text-slate-500" />
                      <span>Receta / Certificado</span>
                    </button>

                    <button
                      onClick={() => openModal('medicalRecordEditor', { patient, record })}
                      className="p-1 text-slate-400 hover:text-slate-700 rounded transition-colors"
                      title="Editar Evolución"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Motivo & Diagnóstico */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="font-semibold text-slate-600 block mb-0.5">Motivo de Consulta:</span>
                    <p className="text-slate-800">{record.reason || 'Sin especificar'}</p>
                  </div>
                  <div>
                    <span className="font-semibold text-slate-600 block mb-0.5">Diagnóstico:</span>
                    <p className="text-slate-900 font-medium">
                      {record.diagnosis || 'Pendiente de diagnóstico'}
                    </p>
                  </div>
                </div>

                {/* Treatment & Prescriptions summary */}
                {record.treatmentPlan && (
                  <div className="text-xs bg-slate-50 p-2.5 rounded border border-slate-100">
                    <span className="font-semibold text-slate-700">Indicaciones / Tratamiento:</span>
                    <p className="text-slate-600 mt-0.5">{record.treatmentPlan}</p>
                  </div>
                )}

                {record.prescriptions?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {record.prescriptions.map((rx, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-800 border border-slate-200">
                        {rx.medication} ({rx.dosage})
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

    </div>
  );
}
