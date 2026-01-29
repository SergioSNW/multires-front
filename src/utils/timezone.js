import { zonedTimeToUtc, utcToZonedTime, format } from "date-fns-tz";
import { es } from "date-fns/locale";

export const formatLocal = (utcDate, tz, fmt = "HH:mm") =>
  format(utcToZonedTime(utcDate, tz), fmt, { timeZone: tz, locale: es });

export const localToUtc = (localDateStr, tz) => {
  const localDate = new Date(localDateStr);
  return zonedTimeToUtc(localDate, tz);
};

export const getTzDisplay = (tz) => {
  const nowUtc = new Date();
  return format(utcToZonedTime(nowUtc, tz), "HH:mm zzz", { timeZone: tz });
};
