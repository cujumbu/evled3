interface Timezone {
  value: string;
  label: string;
}

export function getTimezones(): Timezone[] {
  // Get all timezone names
  const timeZones = Intl.supportedValuesOf('timeZone');
  
  // Current date for formatting examples
  const now = new Date();

  return timeZones.map(tz => {
    // Format the current time in this timezone
    const timeStr = now.toLocaleTimeString('en-US', { 
      timeZone: tz,
      hour: '2-digit',
      minute: '2-digit'
    });

    // Calculate offset
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: tz,
      timeZoneName: 'shortOffset'
    });
    const offset = formatter.format(now).split(' ').pop();

    // Create readable label
    const label = `${tz.replace('_', ' ')} (${offset}, ${timeStr})`;

    return {
      value: tz,
      label
    };
  });
}
