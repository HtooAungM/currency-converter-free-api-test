export function formatMoney(value: number): string {
  const abs = Math.abs(value);
  const maximumFractionDigits = abs > 0 && abs < 0.01 ? 6 : 2;
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits,
  }).format(value);
}

export function formatRate(value: number): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: value >= 1 ? 4 : 6,
  }).format(value);
}

export function formatRateDate(isoDate: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(isoDate);
  if (!match) {
    return isoDate;
  }
  const date = new Date(Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3])));
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date);
}

export function parseAmount(input: string): number | null {
  if (input.trim() === '' || input === '.') {
    return null;
  }
  const value = Number(input);
  if (!Number.isFinite(value)) {
    return null;
  }
  return value;
}

export function sanitizeAmount(input: string): string {
  const cleaned = input.replace(/,/g, '').replace(/[^\d.]/g, '');
  const [whole, ...fraction] = cleaned.split('.');
  if (fraction.length === 0) {
    return whole;
  }
  return `${whole}.${fraction.join('').slice(0, 2)}`;
}
