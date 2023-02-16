import { TihuEventKind } from "./types";

export const MILLIS_IN_DAY = 1000 * 60 * 60 * 24;

export const UNKNOWN_STAMP = "❓";

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

  const [, yearStr, monthStr, dayStr, hoursStr, minutesStr] = match;
  const secondsStr: undefined | string = match[6];

  const year = parseInt(yearStr, 10);
  const month = parseInt(monthStr, 10) - 1;
  const day = parseInt(dayStr, 10);
  const hours = parseInt(hoursStr, 10);
  const minutes = minutesStr.length === 2 ? parseInt(minutesStr, 10) : NaN;
  const seconds =
    secondsStr === undefined
      ? 0
      : secondsStr.length === 2
      ? parseInt(secondsStr, 10)
      : NaN;

  if ([year, month, day, hours, minutes, seconds].some(Number.isNaN)) {
    return null;
  }

  if (
    !(
      1970 <= year &&
      0 <= month &&
      month <= 11 &&
      1 <= day &&
      day <= 31 &&
      0 <= hours &&
      hours <= 23 &&
      0 <= minutes &&
      minutes <= 59 &&
      0 <= seconds &&
      seconds <= 59
    )
  ) {
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

export function dayFloor(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

export function intoPairs<T>(
  arr: readonly T[]
): null | readonly (readonly [T, T])[] {
  if (arr.length % 2 !== 0) {
    return null;
  }

  const result: (readonly [T, T])[] = [];
  for (let i = 0; i < arr.length; i += 2) {
    result.push([arr[i], arr[i + 1]]);
  }
  return result;
}

export function getOrCreate<K, V>(
  map: Map<K, V>,
  key: K,
  getNewVal: () => V
): V {
  if (map.has(key)) {
    return map.get(key)!;
  }

  const val = getNewVal();
  map.set(key, val);
  return val;
}
