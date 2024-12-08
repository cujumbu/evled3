export type Language = 'en' | 'es' | 'fr' | 'de' | 'it' | 'pt' | 'ru' | 'zh' | 'ja' | 'ko' | 
  'nl' | 'pl' | 'cs' | 'sv' | 'da' | 'fi' | 'no' | 'hu' | 'el' | 'ro' | 'bg' | 'hr' | 'sk' | 'sl';

interface TimeUnits {
  days: string;
  hours: string;
  minutes: string;
  seconds: string;
}

type Translations = Record<Language, TimeUnits>;

export const translations = {
  en: {
    days: 'Days',
    hours: 'Hours',
    minutes: 'Minutes',
    seconds: 'Seconds'
  },
  es: {
    days: 'Días',
    hours: 'Horas',
    minutes: 'Minutos',
    seconds: 'Segundos'
  },
  fr: {
    days: 'Jours',
    hours: 'Heures',
    minutes: 'Minutes',
    seconds: 'Secondes'
  },
  de: {
    days: 'Tage',
    hours: 'Stunden',
    minutes: 'Minuten',
    seconds: 'Sekunden'
  },
  it: {
    days: 'Giorni',
    hours: 'Ore',
    minutes: 'Minuti',
    seconds: 'Secondi'
  },
  pt: {
    days: 'Dias',
    hours: 'Horas',
    minutes: 'Minutos',
    seconds: 'Segundos'
  },
  ru: {
    days: 'Дней',
    hours: 'Часов',
    minutes: 'Минут',
    seconds: 'Секунд'
  },
  zh: {
    days: '天',
    hours: '小时',
    minutes: '分钟',
    seconds: '秒'
  },
  ja: {
    days: '日',
    hours: '時間',
    minutes: '分',
    seconds: '秒'
  },
  ko: {
    days: '일',
    hours: '시간',
    minutes: '분',
    seconds: '초'
  },
  nl: {
    days: 'Dagen',
    hours: 'Uren',
    minutes: 'Minuten',
    seconds: 'Seconden'
  },
  pl: {
    days: 'Dni',
    hours: 'Godzin',
    minutes: 'Minut',
    seconds: 'Sekund'
  },
  cs: {
    days: 'Dní',
    hours: 'Hodin',
    minutes: 'Minut',
    seconds: 'Sekund'
  },
  sv: {
    days: 'Dagar',
    hours: 'Timmar',
    minutes: 'Minuter',
    seconds: 'Sekunder'
  },
  da: {
    days: 'Dage',
    hours: 'Timer',
    minutes: 'Minutter',
    seconds: 'Sekunder'
  },
  fi: {
    days: 'Päivää',
    hours: 'Tuntia',
    minutes: 'Minuuttia',
    seconds: 'Sekuntia'
  },
  no: {
    days: 'Dager',
    hours: 'Timer',
    minutes: 'Minutter',
    seconds: 'Sekunder'
  },
  hu: {
    days: 'Nap',
    hours: 'Óra',
    minutes: 'Perc',
    seconds: 'Másodperc'
  },
  el: {
    days: 'Ημέρες',
    hours: 'Ώρες',
    minutes: 'Λεπτά',
    seconds: 'Δευτερόλεπτα'
  },
  ro: {
    days: 'Zile',
    hours: 'Ore',
    minutes: 'Minute',
    seconds: 'Secunde'
  },
  bg: {
    days: 'Дни',
    hours: 'Часа',
    minutes: 'Минути',
    seconds: 'Секунди'
  },
  hr: {
    days: 'Dana',
    hours: 'Sati',
    minutes: 'Minuta',
    seconds: 'Sekundi'
  },
  sk: {
    days: 'Dní',
    hours: 'Hodín',
    minutes: 'Minút',
    seconds: 'Sekúnd'
  },
  sl: {
    days: 'Dni',
    hours: 'Ur',
    minutes: 'Minut',
    seconds: 'Sekund'
  }
} as const;