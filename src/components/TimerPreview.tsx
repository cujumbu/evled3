import React from 'react';
import { Clock } from 'lucide-react';
import { translations, type Language } from '../lib/translations';
import { formatInTimeZone } from '../lib/timezones';

interface TimerPreviewProps {
  endDate: Date;
  style: 'modern' | 'minimal' | 'classic' | 'neon' | 'gradient' | 'elegant';
  color: string;
  language: Language;
  timezone?: string;
}

export function TimerPreview({ endDate, style, color, language, timezone = 'UTC' }: TimerPreviewProps) {
  const [timeLeft, setTimeLeft] = React.useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  React.useEffect(() => {
    const timer = setInterval(() => {
      const now = formatInTimeZone(new Date(), timezone);
      const distance = endDate.getTime() - now;
      
      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
      });
    }, 1000);

    return () => clearInterval(timer);

  const renderTimeUnit = (value: number, key: keyof typeof translations[Language]) => (
    <div className={`flex flex-col items-center ${getTimeUnitStyle()}`}>
      <span className={`${getNumberStyle()}`} style={getNumberStyleProps()}>
        {value.toString().padStart(2, '0')}
      </span>
      <span className={`text-xs ${getLabelStyle()}`}>{translations[language][key]}</span>
    </div>
  );

  const getTimeUnitStyle = () => {
    switch (style) {
      case 'modern':
        return 'bg-opacity-10 bg-black p-3 rounded-lg';
      case 'minimal':
        return 'px-2';
      case 'neon':
        return 'px-4 py-3';
      case 'elegant':
        return 'bg-white/10 backdrop-blur-sm p-4 rounded-xl';
      case 'gradient':
        return 'bg-white/50 shadow-lg p-3 rounded-lg backdrop-blur-sm';
      default:
        return 'border border-opacity-20 p-2';
    }
  };

  const getNumberStyle = () => {
    switch (style) {
      case 'elegant':
        return 'text-3xl font-semibold';
      case 'neon':
        return 'text-3xl font-bold';
      case 'gradient':
        return 'text-2xl font-bold bg-clip-text text-transparent';
      default:
        return 'text-2xl font-bold';
    }
  };

  const getLabelStyle = () => {
    switch (style) {
      case 'elegant':
        return 'text-white/80 mt-1';
      case 'neon':
        return 'mt-2';
      default:
        return 'opacity-75';
    }
  };

  const getNumberStyleProps = () => {
    const styles: React.CSSProperties = { color };
    
    if (style === 'neon') {
      styles.textShadow = `0 0 10px ${color}, 0 0 20px ${color}, 0 0 30px ${color}`;
    } else if (style === 'gradient') {
      styles.backgroundImage = `linear-gradient(135deg, ${color}, ${adjustColor(color, 40)})`;
    }
    
    return styles;
  };

  const adjustColor = (hex: string, percent: number) => {
    const num = parseInt(hex.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = (num >> 8 & 0x00FF) + amt;
    const B = (num & 0x0000FF) + amt;
    return '#' + (0x1000000 +
      (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
      (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
      (B < 255 ? B < 1 ? 0 : B : 255)
    ).toString(16).slice(1);
  };

  return (
    <div className={`flex gap-4 p-6 ${
      style === 'modern' ? 'bg-gray-100 rounded-xl shadow-lg' :
      style === 'neon' ? 'bg-black rounded-xl' :
      style === 'elegant' ? 'bg-gray-900 rounded-xl' :
      style === 'gradient' ? 'bg-gradient-to-br from-gray-50 to-white rounded-xl shadow-lg' :
      style === 'minimal' ? 'bg-transparent' : 'bg-white border rounded-md'
    }`}>
      {renderTimeUnit(timeLeft.days, 'days')}
      {renderTimeUnit(timeLeft.hours, 'hours')}
      {renderTimeUnit(timeLeft.minutes, 'minutes')}
      {renderTimeUnit(timeLeft.seconds, 'seconds')}
    </div>
  );
}
