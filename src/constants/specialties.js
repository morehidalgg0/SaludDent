export const SPECIALTY_SLUGS = {
  'Medicina General': 'medicina_general',
  'Odontología': 'odontologia',
  'Kinesiología': 'kinesiologia',
  'Kinesiología & Fisiatría': 'kinesiologia',
  'Nutrición': 'nutricion',
  'Pediatría': 'pediatria',
  'Oftalmología': 'oftalmologia',
  'Psicología': 'psicologia',
  'Traumatología': 'traumatologia',
  'Cardiología': 'cardiologia',
  'Dermatología': 'dermatologia'
};

export function specialtyToSlug(specialty) {
  if (!specialty) return 'medicina_general';
  if (SPECIALTY_SLUGS[specialty]) return SPECIALTY_SLUGS[specialty];
  const s = String(specialty).toLowerCase();
  if (s.includes('odonto')) return 'odontologia';
  if (s.includes('kinesio') || s.includes('fisio')) return 'kinesiologia';
  if (s.includes('nutri')) return 'nutricion';
  if (s.includes('pedia')) return 'pediatria';
  if (s.includes('oftalmo')) return 'oftalmologia';
  if (s.includes('psico')) return 'psicologia';
  return 'medicina_general';
}
