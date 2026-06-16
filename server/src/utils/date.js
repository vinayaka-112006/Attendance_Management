import { endOfDay, parseISO, startOfDay } from "date-fns";

export const dayRange = (value = new Date()) => {
  const date = typeof value === "string" ? parseISO(value) : value;
  return { gte: startOfDay(date), lte: endOfDay(date) };
};

export const normalizeDate = (value) => startOfDay(typeof value === "string" ? parseISO(value) : value);

export const isSameCalendarDay = (a, b = new Date()) => {
  const left = normalizeDate(a).getTime();
  const right = normalizeDate(b).getTime();
  return left === right;
};
