// Bikram Sambat (BS) <-> Gregorian (AD) conversion, backed by `nepali-date-converter`
// (zero-dep, actively maintained) instead of a hand-rolled lookup table limited to a
// fixed ~9-year window. Function names/shapes match the original web app's
// src/utils/nepaliCalendar.ts so callers port over unchanged.
import NepaliDate from 'nepali-date-converter';

export interface BsDate {
  year: number;
  month: number; // 1-12 (1: Baisakh, ..., 12: Chaitra)
  day: number;
  monthNameEn: string;
  monthNameNp: string;
  yearNp: string;
  dayNp: string;
}

export const NEP_MONTHS_EN = [
  'Baisakh',
  'Jestha',
  'Ashadh',
  'Shrawan',
  'Bhadra',
  'Ashwin',
  'Kartik',
  'Mangsir',
  'Poush',
  'Magh',
  'Falgun',
  'Chaitra',
];

export const NEP_MONTHS_NP = [
  'बैशाख',
  'जेठ',
  'असार',
  'साउन',
  'भदौ',
  'असोज',
  'कात्तिक',
  'मंसिर',
  'पुष',
  'माघ',
  'फागुन',
  'चैत',
];

export const NEP_DAYS_NP = ['आइत', 'सोम', 'मङ्गल', 'बुध', 'बिही', 'शुक्र', 'शनि'];

export const NEP_DAYS_FULL_NP = ['आइतबार', 'सोमबार', 'मङ्गलबार', 'बुधबार', 'बिहीबार', 'शुक्रबार', 'शनिबार'];

const DEVANAGARI_DIGITS: Record<string, string> = {
  '0': '०',
  '1': '१',
  '2': '२',
  '3': '३',
  '4': '४',
  '5': '५',
  '6': '६',
  '7': '७',
  '8': '८',
  '9': '९',
};

export const toDevanagariDigits = (num: number | string): string =>
  String(num)
    .split('')
    .map((char) => DEVANAGARI_DIGITS[char] ?? char)
    .join('');

/** adMonth is 0-indexed (Jan = 0), matching JS Date convention. */
export function getBsDateFromAd(adYear: number, adMonth: number, adDay: number): BsDate {
  const bs = new NepaliDate(new Date(adYear, adMonth, adDay)).getBS();
  const month = bs.month + 1; // package uses 0-indexed months (Baisakh = 0)

  return {
    year: bs.year,
    month,
    day: bs.date,
    monthNameEn: NEP_MONTHS_EN[month - 1] ?? 'Baisakh',
    monthNameNp: NEP_MONTHS_NP[month - 1] ?? 'बैशाख',
    yearNp: toDevanagariDigits(bs.year),
    dayNp: toDevanagariDigits(bs.date),
  };
}

/** Formats an AD date string ('YYYY-MM-DD') into a readable BS string. */
export function formatAdToBsString(dateStr: string, format: 'full' | 'short' | 'dual' = 'full'): string {
  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;
  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1;
  const day = parseInt(parts[2], 10);

  const bs = getBsDateFromAd(year, month, day);

  if (format === 'short') {
    return `${bs.dayNp} ${bs.monthNameNp}`;
  }
  if (format === 'dual') {
    return `${day} (${bs.dayNp} ${bs.monthNameNp})`;
  }
  return `${bs.dayNp} ${bs.monthNameNp} ${bs.yearNp} (${bs.monthNameEn} ${bs.day}, ${bs.year} BS)`;
}
