export interface Timezone {
  value: string;
  label: string;
}

// List of common timezones with their UTC offsets
const TIMEZONE_LIST: Timezone[] = [
  { value: 'UTC', label: 'UTC' },
  { value: 'America/New_York', label: 'New York' },
  { value: 'America/Los_Angeles', label: 'Los Angeles' },
  { value: 'America/Chicago', label: 'Chicago' },
  { value: 'America/Toronto', label: 'Toronto' },
  { value: 'Europe/London', label: 'London' },
  { value: 'Europe/Paris', label: 'Paris' },
  { value: 'Europe/Berlin', label: 'Berlin' },
  { value: 'Europe/Moscow', label: 'Moscow' },
  { value: 'Asia/Dubai', label: 'Dubai' },
  { value: 'Asia/Singapore', label: 'Singapore' },
  { value: 'Asia/Tokyo', label: 'Tokyo' },
  { value: 'Asia/Shanghai', label: 'Shanghai' },
  { value: 'Australia/Sydney', label: 'Sydney' },
  { value: 'Pacific/Auckland', label: 'Auckland' }
];

export function getTimezones(): Timezone[] {
  const now = new Date();
  
  return TIMEZONE_LIST.map((tz: Timezone) => {
    try {
      // Get the timezone offset
      const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: tz.value,
        timeZoneName: 'longOffset',
        hour12: false,
        hour: 'numeric'
      });
      const timeStr = formatter.format(now);
      const offset = timeStr.split(' ').pop() || '';
      
      return {
        value: tz.value,
        label: `${tz.label} (${offset})`
      };
    } catch (error) {
      // Fallback if timezone is not supported
      return tz;
    }
  });
}

export function formatInTimeZone(date: Date, timeZone: string): number {
  const targetDate = new Date(date.toLocaleString('en-US', { timeZone }));
  const targetOffset = targetDate.getTimezoneOffset();
  const utcDate = new Date(targetDate.getTime() - targetOffset * 60000);
  return utcDate.getTime();
}
