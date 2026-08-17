import React, { useState } from 'react';
import { useClinic } from '../../context/ClinicContext.jsx';
import { PatientCard } from './PatientCard.jsx';
import { 
  Search, 
  UserPlus, 
  Filter, 
  Folder,
  FileSpreadsheet
} from 'lucide-react';

export function FicheroView() {
  const { patients, openModal } = useClinic();

  const [search, setSearch] = useState('');
  const [insuranceFilter, setInsuranceFilter] = useState('all');

  const insurances = Array.from(new Set(patients.map(p => p.insurance).filter(Boolean)));

  const filteredPatients = patients.filter(p => {
    const matchesSearch = search.trim() === '' || (
      (p.ficheroNumber && p.ficheroNumber.toLowerCase().includes(search.toLowerCase())) ||
      (p.firstName && p.firstName.toLowerCase().includes(search.toLowerCase())) ||
      (p.lastName && p.lastName.toLowerCase().includes(search.toLowerCase())) ||
      (p.dni && p.dni.includes(search)) ||
      (p.phone && p.phone.includes(search)) ||
      (p.insurance && p.insurance.toLowerCase().includes(search.toLowerCase()))
    );

    const matchesInsurance = insuranceFilter === 'all' || p.insurance === insuranceFilter;

    return matchesSearch && matchesInsurance;
  });

  return (
    <div className="space-y-3">
      
      {/* Header Bar */}
      <div className="bg-white rounded-lg p-3.5 border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900">Fichero Central de Pacientes</h2>
            <span className="px-2 py-0.2 rounded text-xs font-semibold bg-slate-100 text-slate-700">
              {patients.length} pacientes
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Registro unificado por Número de Fichero correlativo (ej: F-10240)
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => openModal('importPatients')}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded-lg border border-slate-300 transition-colors"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-slate-500" />
            <span>Importar</span>
          </button>
          <button
            onClick={() => openModal('newPatient', { patient: null })}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-lg transition-colors"
          >
            <UserPlus className="w-3.5 h-3.5 text-emerald-400" />
            <span>+ Nuevo Paciente</span>
          </button>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white rounded-lg p-3 border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
        
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por N° de Fichero (ej: F-10240), DNI, Apellido, Nombre o Teléfono..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-md focus:bg-white focus:border-slate-400 outline-hidden"
          />
        </div>

        {/* Insurance Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={insuranceFilter}
            onChange={(e) => setInsuranceFilter(e.target.value)}
            className="px-2.5 py-1.5 text-xs font-medium bg-slate-50 border border-slate-200 rounded-md outline-hidden"
          >
            <option value="all">Todas las coberturas</option>
            {insurances.map(ins => (
              <option key={ins} value={ins}>{ins}</option>
            ))}
          </select>
        </div>

      </div>

      {/* Patients Grid */}
      {filteredPatients.length === 0 ? (
        <div className="bg-white rounded-lg border border-slate-200 p-8 text-center">
          <Folder className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <p className="font-semibold text-slate-700 text-xs">No se encontraron pacientes con ese criterio.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredPatients.map(patient => (
            <PatientCard key={patient.id} patient={patient} />
          ))}
        </div>
      )}

    </div>
  );
}
