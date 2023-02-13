import { TihuEventKind } from "./types";

export function toTihuDateTimeString(d: Date): string {
  const year = d.getFullYear();
  const month = d.getMonth() + 1;
  const day = d.getDate();
  const hour = d.getHours();
  const minute = d.getMinutes();
  const seconds = d.getSeconds();
  return `${year}/${month}/${day} ${hour.toString().padStart(2, "0")}:${minute
    .toString()
    .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}

export function parseTihuDateTimeString(s: string): null | Date {
  const match = s.match(
    /^(\d+)\s*\/\s*(\d+)\s*\/\s*(\d+)\s+(\d+)\s*:\s*(\d+)\s*(?::(\d+))?\s*$/
  );
  if (match === null) {
    return null;
  }
  const year = parseInt(match[1], 10);
  const month = parseInt(match[2], 10) - 1;
  const day = parseInt(match[3], 10);
  const hours = parseInt(match[4], 10);
  const minutes = parseInt(match[5], 10);
  const seconds = match[6] === undefined ? 0 : parseInt(match[6], 10);
  if ([year, month, day, hours, minutes, seconds].some(Number.isNaN)) {
    return null;
  }
  return new Date(year, month, day, hours, minutes, seconds);
}

export function argMax<T>(array: readonly T[], f: (t: T) => number): T {
  let maxIndex = -1;
  let maxValue = -Infinity;
  for (let i = 0; i < array.length; i++) {
    const value = f(array[i]);
    if (value > maxValue) {
      maxIndex = i;
      maxValue = value;
    }
  }
  return array[maxIndex];
}

export function toTihuHourMinuteString(durationMillis: number): string {
  const durationSeconds = Math.floor(durationMillis / 1000);
  const hours = Math.floor(durationSeconds / 3600);
  const minutes = Math.floor((durationSeconds % 3600) / 60);
  return `${hours}:${minutes.toString().padStart(2, "0")}`;
}

export function toTihuHourMinuteSecondString(durationMillis: number): string {
  const durationSeconds = Math.floor(durationMillis / 1000);
  const hours = Math.floor(durationSeconds / 3600);
  const minutes = Math.floor((durationSeconds % 3600) / 60);
  const seconds = durationSeconds % 60;
  return `${hours}:${minutes.toString().padStart(2, "0")}+${seconds
    .toString()
    .padStart(2, "0")}`;
}

export function getEventKindString(kind: TihuEventKind): string {
  switch (kind) {
    case TihuEventKind.Start:
      return "▶️";
    case TihuEventKind.End:
      return "⏹️";
  }
}
