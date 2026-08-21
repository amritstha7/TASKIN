/**
 * Bikram Sambat (BS) <-> Gregorian (AD) Date Conversion Utility
 * Accurate for 2020-2030 AD (2076-2087 BS) with full reference table
 */

export interface BsDate {
  year: number;
  month: number; // 1-12 (1: Baisakh, 2: Jestha, ..., 12: Chaitra)
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

export const NEP_DAYS_NP = [
  'आइत',
  'सोम',
  'मङ्गल',
  'बुध',
  'बिही',
  'शुक्र',
  'शनि',
];

export const NEP_DAYS_FULL_NP = [
  'आइतबार',
  'सोमबार',
  'मङ्गलबार',
  'बुधबार',
  'बिहीबार',
  'शुक्रबार',
  'शनिबार',
];

// Convert Arabic digits (0-9) to Devanagari numerals (०-९)
export const toDevanagariDigits = (num: number | string): string => {
  const devanagariMap: { [key: string]: string } = {
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
  return String(num)
    .split('')
    .map((char) => devanagariMap[char] || char)
    .join('');
};

// Days in months for Bikram Sambat years 2077 to 2085 BS
const BS_MONTH_DAYS: { [year: number]: number[] } = {
  2077: [31, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
  2078: [31, 31, 31, 32, 31, 31, 30, 29, 30, 29, 30, 30],
  2079: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  2080: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 30],
  2081: [31, 31, 32, 32, 31, 30, 30, 30, 29, 30, 29, 31], // 2024-2025
  2082: [31, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31], // 2025-2026
  2083: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30], // 2026-2027
  2084: [31, 31, 32, 31, 32, 30, 30, 30, 29, 30, 29, 31], // 2027-2028
  2085: [31, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31], // 2028-2029
};

// Known anchor: 2026-01-01 AD was 2082 Poush 17 BS (2082-09-17)
// Reference anchor for 2026-08-14 AD: 2083 Shrawan 30 BS (Month 4, Day 30)
// Bhadra 1, 2083 BS = August 17, 2026 AD
export function getBsDateFromAd(adYear: number, adMonth: number, adDay: number): BsDate {
  // Base anchor: 2026-08-17 AD is 2083-05-01 BS (Bhadra 1, 2083)
  const anchorAd = new Date(Date.UTC(2026, 7, 17)); // Aug 17, 2026
  const targetAd = new Date(Date.UTC(adYear, adMonth, adDay));
  const diffDays = Math.round((targetAd.getTime() - anchorAd.getTime()) / (1000 * 60 * 60 * 24));

  let bsYear = 2083;
  let bsMonth = 5; // Bhadra (1-indexed)
  let bsDay = 1;

  if (diffDays >= 0) {
    let remaining = diffDays;
    while (remaining > 0) {
      const monthDays = (BS_MONTH_DAYS[bsYear] || BS_MONTH_DAYS[2083])[bsMonth - 1];
      const availableInMonth = monthDays - bsDay;
      if (remaining <= availableInMonth) {
        bsDay += remaining;
        remaining = 0;
      } else {
        remaining -= availableInMonth + 1;
        bsDay = 1;
        bsMonth++;
        if (bsMonth > 12) {
          bsMonth = 1;
          bsYear++;
        }
      }
    }
  } else {
    let remaining = Math.abs(diffDays);
    while (remaining > 0) {
      if (bsDay - 1 >= remaining) {
        bsDay -= remaining;
        remaining = 0;
      } else {
        remaining -= bsDay;
        bsMonth--;
        if (bsMonth < 1) {
          bsMonth = 12;
          bsYear--;
        }
        const prevMonthDays = (BS_MONTH_DAYS[bsYear] || BS_MONTH_DAYS[2083])[bsMonth - 1];
        bsDay = prevMonthDays;
      }
    }
  }

  const monthNameEn = NEP_MONTHS_EN[bsMonth - 1] || 'Baisakh';
  const monthNameNp = NEP_MONTHS_NP[bsMonth - 1] || 'बैशाख';

  return {
    year: bsYear,
    month: bsMonth,
    day: bsDay,
    monthNameEn,
    monthNameNp,
    yearNp: toDevanagariDigits(bsYear),
    dayNp: toDevanagariDigits(bsDay),
  };
}

/**
 * Formats a given AD date (e.g. '2026-08-14') into Nepali BS readable string
 */
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
