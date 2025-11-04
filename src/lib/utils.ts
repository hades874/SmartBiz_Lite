import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const bnNumbers = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
const enNumbers = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

export const toBengaliNumber = (num: number | string) => {
    const numStr = String(num);
    let bengaliStr = '';
    for (let i = 0; i < numStr.length; i++) {
        const char = numStr[i];
        if (char === '.' || char === ',') {
            bengaliStr += char;
        } else {
            const digit = parseInt(char);
            bengaliStr += isNaN(digit) ? char : bnNumbers[digit];
        }
    }
    return bengaliStr;
};


export const formatCurrency = (value: number, locale: string = 'en') => {
  const formatted = value.toLocaleString('en-US');
  if (locale === 'bn') {
    return `৳${toBengaliNumber(formatted)}`;
  }
  return `৳${formatted}`;
};

export const formatNumber = (value: number, locale: 'en' | 'bn' = 'en') => {
  const formatted = value.toLocaleString('en-US');
  if (locale === 'bn') {
      return toBengaliNumber(formatted);
  }
  return formatted;
};