export interface Timezone {
  value: string;
  label: string;
}

// List of common timezones with their UTC offsets
const TIMEZONE_LIST: Timezone[] = [
  { value: 'UTC', label: 'UTC (GMT+0)' },
  { value: 'America/New_York', label: 'New York (GMT-4)' },
  { value: 'America/Los_Angeles', label: 'Los Angeles (GMT-7)' },
  { value: 'America/Chicago', label: 'Chicago (GMT-5)' },
  { value: 'America/Toronto', label: 'Toronto (GMT-4)' },
  { value: 'Europe/London', label: 'London (GMT+1)' },
  { value: 'Europe/Paris', label: 'Paris (GMT+2)' },
  { value: 'Europe/Berlin', label: 'Berlin (GMT+2)' },
  { value: 'Europe/Moscow', label: 'Moscow (GMT+3)' },
  { value: 'Asia/Dubai', label: 'Dubai (GMT+4)' },
  { value: 'Asia/Singapore', label: 'Singapore (GMT+8)' },
  { value: 'Asia/Tokyo', label: 'Tokyo (GMT+9)' },
  { value: 'Asia/Shanghai', label: 'Shanghai (GMT+8)' },
  { value: 'Australia/Sydney', label: 'Sydney (GMT+10)' },
  { value: 'Pacific/Auckland', label: 'Auckland (GMT+12)' }
];

export function getTimezones(): Timezone[] {
  const now = new Date();
  
  return TIMEZONE_LIST.map((tz: Timezone) => {
    try {
      // Add current time to the label
      const timeStr = now.toLocaleTimeString('en-US', { 
        timeZone: tz.value,
        hour: '2-digit',
        minute: '2-digit'
      });
      
      return {
        value: tz.value,
        label: `${tz.label} (${timeStr})`
      };
    } catch (error) {
      // Fallback if timezone is not supported
      return tz;
    }
  });
}

export function formatInTimeZone(date: Date, timeZone: string): number {
  return new Date(date.toLocaleString('en-US', { timeZone })).getTime();
}
