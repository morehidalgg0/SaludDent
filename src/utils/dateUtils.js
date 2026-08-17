// Utilidades para manejo de fechas, intervalos de 15 min y vistas de agenda

export const DAYS_SPANISH = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
export const MONTHS_SPANISH = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

export function formatDateISO(dateObj) {
  const d = new Date(dateObj);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function parseDateISO(isoString) {
  if (!isoString) return new Date();
  const [year, month, day] = isoString.split('-').map(Number);
  return new Date(year, month - 1, day, 12, 0, 0);
}

export function formatHumanDate(isoString, includeYear = true) {
  if (!isoString) return '';
  const d = parseDateISO(isoString);
  const dayName = DAYS_SPANISH[d.getDay()];
  const dayNum = d.getDate();
  const monthName = MONTHS_SPANISH[d.getMonth()];
  return `${dayName} ${dayNum} de ${monthName}${includeYear ? ` de ${d.getFullYear()}` : ''}`;
}

export function formatShortDate(isoString) {
  if (!isoString) return '';
  const d = parseDateISO(isoString);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  return `${day}/${month}`;
}

export function getDayOfWeekName(isoString) {
  const d = parseDateISO(isoString);
  return DAYS_SPANISH[d.getDay()];
}

// Generate 15-minute time intervals from startHour to endHour
export function generateTimeSlots(startHour = 8, endHour = 20) {
  const slots = [];
  for (let hour = startHour; hour <= endHour; hour++) {
    for (let minute = 0; minute < 60; minute += 15) {
      if (hour === endHour && minute > 0) break;
      const hStr = String(hour).padStart(2, '0');
      const mStr = String(minute).padStart(2, '0');
      slots.push(`${hStr}:${mStr}`);
    }
  }
  return slots;
}

// Get Week days array (7 days starting Monday)
export function getWeekDays(targetDateISO) {
  const current = parseDateISO(targetDateISO);
  const dayOfWeek = current.getDay(); // 0 is Sunday, 1 is Monday...
  const distanceToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  
  const monday = new Date(current);
  monday.setDate(current.getDate() + distanceToMonday);

  const days = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    days.push(formatDateISO(d));
  }
  return days;
}

// Get 15-day bi-weekly array
export function getBiweeklyDays(targetDateISO) {
  const current = parseDateISO(targetDateISO);
  const days = [];
  for (let i = 0; i < 15; i++) {
    const d = new Date(current);
    d.setDate(current.getDate() + i);
    days.push(formatDateISO(d));
  }
  return days;
}

// Get Full Month grid days including trailing padding
export function getMonthDays(targetDateISO) {
  const current = parseDateISO(targetDateISO);
  const year = current.getFullYear();
  const month = current.getMonth();

  const firstDay = new Date(year, month, 1, 12, 0, 0);
  const lastDay = new Date(year, month + 1, 0, 12, 0, 0);

  // Monday = 0, Sunday = 6
  let firstDayIndex = firstDay.getDay() - 1;
  if (firstDayIndex === -1) firstDayIndex = 6;

  const days = [];

  // Previous month padding
  for (let i = firstDayIndex; i > 0; i--) {
    const prevDate = new Date(year, month, 1 - i, 12, 0, 0);
    days.push({
      date: formatDateISO(prevDate),
      isCurrentMonth: false,
      dayNumber: prevDate.getDate()
    });
  }

  // Current month days
  for (let i = 1; i <= lastDay.getDate(); i++) {
    const curDate = new Date(year, month, i, 12, 0, 0);
    days.push({
      date: formatDateISO(curDate),
      isCurrentMonth: true,
      dayNumber: i
    });
  }

  // Next month padding to fill complete weeks (multiple of 7)
  const remaining = 7 - (days.length % 7);
  if (remaining < 7) {
    for (let i = 1; i <= remaining; i++) {
      const nextDate = new Date(year, month + 1, i, 12, 0, 0);
      days.push({
        date: formatDateISO(nextDate),
        isCurrentMonth: false,
        dayNumber: nextDate.getDate()
      });
    }
  }

  return {
    year,
    month,
    monthName: MONTHS_SPANISH[month],
    days,
    startDate: days[0].date,
    endDate: days[days.length - 1].date
  };
}

// Calculate end time given a start time "HH:mm" and duration in minutes
export function calculateEndTime(startTime, durationMinutes) {
  if (!startTime) return '';
  const [hours, minutes] = startTime.split(':').map(Number);
  const totalMinutes = hours * 60 + minutes + Number(durationMinutes || 15);
  const endHours = Math.floor(totalMinutes / 60);
  const endMins = totalMinutes % 60;
  return `${String(endHours).padStart(2, '0')}:${String(endMins).padStart(2, '0')}`;
}
