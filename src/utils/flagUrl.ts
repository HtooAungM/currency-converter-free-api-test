import { CURRENCY_COUNTRIES } from '@/constants/currencyCountries';

export function flagUrl(currencyCode: string): string | null {
  const country = CURRENCY_COUNTRIES[currencyCode];
  if (!country) {
    return null;
  }
  return `https://flagcdn.com/w80/${country}.png`;
}
