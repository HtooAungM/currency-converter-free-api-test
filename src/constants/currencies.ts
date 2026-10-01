import type { Currency } from '@/types/currency';

export const POPULAR_CURRENCIES: Currency[] = [
  { iso_code: 'USD', name: 'United States Dollar', symbol: '$' },
  { iso_code: 'EUR', name: 'Euro', symbol: '€' },
  { iso_code: 'GBP', name: 'British Pound', symbol: '£' },
  { iso_code: 'MMK', name: 'Myanmar Kyat', symbol: 'K' },
  { iso_code: 'SGD', name: 'Singapore Dollar', symbol: '$' },
  { iso_code: 'THB', name: 'Thai Baht', symbol: '฿' },
  { iso_code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
  { iso_code: 'CNY', name: 'Chinese Renminbi Yuan', symbol: '¥' },
  { iso_code: 'INR', name: 'Indian Rupee', symbol: '₹' },
  { iso_code: 'AUD', name: 'Australian Dollar', symbol: '$' },
];

export const POPULAR_CODES = POPULAR_CURRENCIES.map((currency) => currency.iso_code);
