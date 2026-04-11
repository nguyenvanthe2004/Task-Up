import { Dayjs } from "dayjs";

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
