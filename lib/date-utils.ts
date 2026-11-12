import {
  startOfWeek,
  endOfWeek,
  format,
  parseISO,
  isValid,
  getISOWeek,
  getYear,
  addDays,
} from 'date-fns';

const STATIC_FALLBACK_DATE = new Date('2026-01-14T10:00:00Z');

/**
 * Returns the Monday and Sunday for the week containing the specified date.
 * Weeks start on Monday and end on Sunday.
 */
export function getWeekBounds(date?: Date | string): {
  weekStart: string;
  weekEnd: string;
  weekNumber: number;
  year: number;
  weekKey: string;
} {
  const d = date ? (typeof date === 'string' ? parseISO(date) : date) : STATIC_FALLBACK_DATE;
  const safeDate = isValid(d) ? d : STATIC_FALLBACK_DATE;

  const start = startOfWeek(safeDate, { weekStartsOn: 1 });
  const end = endOfWeek(safeDate, { weekStartsOn: 1 });

  const weekNumber = getISOWeek(start);
  const year = getYear(start);
  const weekKey = `${year}-W${String(weekNumber).padStart(2, '0')}`;

  return {
    weekStart: format(start, 'yyyy-MM-dd'),
    weekEnd: format(end, 'yyyy-MM-dd'),
    weekNumber,
    year,
    weekKey,
  };
}

/**
 * Formats a date string (YYYY-MM-DD) into readable display format: "Friday 14, January"
 */
export function formatDisplayDate(dateStr?: string): string {
  if (!dateStr) return '';
  try {
    const d = parseISO(dateStr);
    if (!isValid(d)) return dateStr;
    return format(d, 'EEEE d, MMMM');
  } catch {
    return dateStr;
  }
}

/**
 * Formats a time string (HH:mm) into 12-hour AM/PM format (e.g. "09:00 AM")
 */
export function formatTime12h(timeStr?: string): string {
  if (!timeStr) return '';
  const [h, m] = timeStr.split(':');
  const hour = parseInt(h, 10);
  if (isNaN(hour)) return timeStr;
  const period = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 === 0 ? 12 : hour % 12;
  return `${String(displayHour).padStart(2, '0')}:${m || '00'} ${period}`;
}

/**
 * Generates an array of 7 days for a given week starting Monday.
 */
export function getDaysForWeek(referenceDate?: Date | string): Array<{
  dateStr: string;
  dayShort: string;
  dayNumber: string;
  date: Date;
}> {
  const d = referenceDate
    ? typeof referenceDate === 'string'
      ? parseISO(referenceDate)
      : referenceDate
    : STATIC_FALLBACK_DATE;
  const safeDate = isValid(d) ? d : STATIC_FALLBACK_DATE;
  const start = startOfWeek(safeDate, { weekStartsOn: 1 });

  const days = [];
  for (let i = 0; i < 7; i++) {
    const dayDate = addDays(start, i);
    days.push({
      dateStr: format(dayDate, 'yyyy-MM-dd'),
      dayShort: format(dayDate, 'EEE'),
      dayNumber: format(dayDate, 'dd'),
      date: dayDate,
    });
  }
  return days;
}

/**
 * Generates an 8-day calendar strip starting from Sunday prior to Monday.
 */
export function getCalendarStripDays(centerDate?: Date | string): Array<{
  dateStr: string;
  dayShort: string;
  dayNumber: string;
  date: Date;
}> {
  const d = centerDate
    ? typeof centerDate === 'string'
      ? parseISO(centerDate)
      : centerDate
    : STATIC_FALLBACK_DATE;
  const safeDate = isValid(d) ? d : STATIC_FALLBACK_DATE;

  const mondayStart = startOfWeek(safeDate, { weekStartsOn: 1 });
  const start = addDays(mondayStart, -1);

  const days = [];
  for (let i = 0; i < 8; i++) {
    const dayDate = addDays(start, i);
    days.push({
      dateStr: format(dayDate, 'yyyy-MM-dd'),
      dayShort: format(dayDate, 'EEE'),
      dayNumber: format(dayDate, 'dd'),
      date: dayDate,
    });
  }
  return days;
}
