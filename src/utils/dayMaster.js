// utils/dayMaster.js
// utils/dayMaster.js
const local_default = 'en';
export const dayMaster = [
  { 
    code: 'MO',
    short: { es: 'LUN', en: 'MON', fr: 'LUN' },
    long:  { es: 'Lunes', en: 'Monday', fr: 'Lundi' },
    iso:   'Monday',     // RRULE estándar
    num: 1
  },
  { 
    code: 'TU',
    short: { es: 'MAR', en: 'TUE', fr: 'MAR' },
    long:  { es: 'Martes', en: 'Tuesday', fr: 'Mardi' },
    iso:   'Tuesday',
    num: 2
  },
  { 
    code: 'WE',
    short: { es: 'MIE', en: 'WED', fr: 'MER' },
    long:  { es: 'Miercoles', en: 'Wednesday', fr: 'Mercredi' },
    iso:   'Wednesday',
    num: 3
  },
  { 
    code: 'TH',
    short: { es: 'JUE', en: 'THU', fr: 'JEU' },
    long:  { es: 'Jueves', en: 'Thursday', fr: 'Jeudi' },
    iso:   'Thursday',
    num: 4
  },
  { 
    code: 'FR',
    short: { es: 'VIE', en: 'FRI', fr: 'VEN' },
    long:  { es: 'Viernes', en: 'Friday', fr: 'Vendredi' },
    iso:   'Friday',
    num: 5
  },
  { 
    code: 'SA',
    short: { es: 'SAB', en: 'SAT', fr: 'SAM' },
    long:  { es: 'Sabado', en: 'Saturday', fr: 'Samedi' },
    iso:   'Saturday',
    num: 6
  },
  { 
    code: 'SU',
    short: { es: 'DOM', en: 'SUN', fr: 'DIM' },
    long:  { es: 'Domingo', en: 'Sunday', fr: 'Dimanche' },
    iso:   'Sunday',
    num: 7
  },
];

// Por tipo + locale
export const useDayShort = (locale = 'en') => 
  dayMaster.map(day => ({ code: day.code, label: day.short[locale] || day.short.en }));

export const useDayLong = (locale = 'en') => 
  dayMaster.map(day => ({ code: day.code, label: day.long[locale] || day.long.en }));

// Todos los formatos
export const useAllDays = (locale = 'en') => 
  dayMaster.map(day => ({
    code: day.code,
    short: day.short[locale] || day.short.es,
    long: day.long[locale] || day.long.es,
    iso: day.iso
  }));




export const zzdayMaster = {
  es: {
    MO: "Lunes",
    TU: "Martes",
    WE: "Miercoles",
    TH: "Jueves",
    FR: "Viernes",
    SA: "Sábado",
    SU: "Domingo",
  },
  en: {
    MO: "Monday",
    TU: "Tuesday",
    WE: "Wednesday",
    TH: "Thursday",
    FR: "Friday",
    SA: "Saturday",
    SU: "Sunday",
  },
  fr: {
    MO: "Lundi",
    TU: "Mardi",
    WE: "Mercredi",
    TH: "Jeudi",
    FR: "Vendredi",
    SA: "Samedi",
    SU: "Dimanche",
  },
};

// 🔥 BLINDAJE TOTAL
// export const useDayLabels = (tenantLocale) => {
//   // 1. Prioridad 1: tenant.locale válido
//   if (tenantLocale && dayMaster[tenantLocale]) {
//     return dayMaster[tenantLocale];
//   }

//   // 2. Prioridad 2: navigator.language (browser)
//   const browserLang = navigator.language.split("-")[0]; // es-ES → es
//   if (dayMaster[browserLang]) {
//     return dayMaster[browserLang];
//   }

//   // 3. Fallback: ingles
//   return dayMaster.en;
// };
