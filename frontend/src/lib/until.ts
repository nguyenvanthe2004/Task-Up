import dayjs, { Dayjs } from "dayjs";
import { CLOUDINARY_URL } from "../constants";

export function buildCells(d: Dayjs) {
  const firstDay = d.date(1).day();
  const daysInMonth = d.daysInMonth();
  const prevDays = d.subtract(1, "month").daysInMonth();
  const cells: { day: number; cur: boolean }[] = [
    ...Array.from({ length: firstDay }, (_, i) => ({
      day: prevDays - firstDay + i + 1,
      cur: false,
    })),
    ...Array.from({ length: daysInMonth }, (_, i) => ({
      day: i + 1,
      cur: true,
    })),
  ];
  const tail = (7 - (cells.length % 7)) % 7;
  for (let i = 1; i <= tail; i++) cells.push({ day: i, cur: false });
  return cells;
}

export function normalizeImg(url?: string) {
  return url
    ? url.startsWith("https")
      ? url
      : `${CLOUDINARY_URL}${url}`
    : "/images/avatar.png";
}

export const fmtDate = (iso?: string) => {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export const toISO = (val?: string) => {
  if (!val) return undefined;

  const d = dayjs(val);

  if (!d.isValid()) return undefined;

  return d.toISOString();
};
