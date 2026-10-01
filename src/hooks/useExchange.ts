import { useEffect, useState } from 'react';

import { POPULAR_CURRENCIES } from '@/constants/currencies';
import { fetchCurrencies, fetchRate } from '@/services/frankfurter';
import type { Currency } from '@/types/currency';
import { parseAmount, sanitizeAmount } from '@/utils/formatMoney';

type LoadedRate = {
  base: string;
  quote: string;
  rate: number;
  date: string | null;
};

export function useExchange() {
  const [currencies, setCurrencies] = useState<Currency[]>(POPULAR_CURRENCIES);
  const [listLoading, setListLoading] = useState(true);
  const [listError, setListError] = useState<string | null>(null);
  const [listAttempt, setListAttempt] = useState(0);

  const [base, setBaseCode] = useState('USD');
  const [quote, setQuoteCode] = useState('MMK');
  const [amount, setAmountInput] = useState('10');

  const [loadedRate, setLoadedRate] = useState<LoadedRate | null>(null);
  const [rateLoading, setRateLoading] = useState(true);
  const [rateError, setRateError] = useState<string | null>(null);
  const [rateAttempt, setRateAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setListLoading(true);
    setListError(null);

    fetchCurrencies(controller.signal)
      .then((list) => {
        setCurrencies([...list].sort((a, b) => a.iso_code.localeCompare(b.iso_code)));
        setListLoading(false);
      })
      .catch((error: unknown) => {
        if (isAbort(error)) {
          return;
        }
        setListError(error instanceof Error ? error.message : 'Could not load currencies.');
        setListLoading(false);
      });

    return () => controller.abort();
  }, [listAttempt]);

  useEffect(() => {
    if (base === quote) {
      setLoadedRate({ base, quote, rate: 1, date: null });
      setRateLoading(false);
      setRateError(null);
      return;
    }

    const controller = new AbortController();
    setRateLoading(true);
    setRateError(null);

    fetchRate(base, quote, controller.signal)
      .then((data) => {
        setLoadedRate({
          base: data.base.toUpperCase(),
          quote: data.quote.toUpperCase(),
          rate: data.rate,
          date: data.date,
        });
        setRateLoading(false);
      })
      .catch((error: unknown) => {
        if (isAbort(error)) {
          return;
        }
        setLoadedRate(null);
        setRateError(error instanceof Error ? error.message : 'Could not load this rate.');
        setRateLoading(false);
      });

    return () => controller.abort();
  }, [base, quote, rateAttempt]);

  const rateMatches =
    loadedRate != null && loadedRate.base === base && loadedRate.quote === quote;
  const rate = rateMatches ? loadedRate.rate : null;
  const rateDate = rateMatches ? loadedRate.date : null;
  const numericAmount = parseAmount(amount);
  const converted = rate != null && numericAmount != null ? numericAmount * rate : null;

  function setBase(code: string) {
    const next = code.toUpperCase();
    if (next === quote) {
      setQuoteCode(base);
    }
    setBaseCode(next);
  }

  function setQuote(code: string) {
    const next = code.toUpperCase();
    if (next === base) {
      setBaseCode(quote);
    }
    setQuoteCode(next);
  }

  return {
    currencies,
    listLoading,
    listError,
    reloadCurrencies: () => setListAttempt((value) => value + 1),
    base,
    quote,
    setBase,
    setQuote,
    amount,
    setAmount: (value: string) => setAmountInput(sanitizeAmount(value)),
    swap: () => {
      setBaseCode(quote);
      setQuoteCode(base);
    },
    rate,
    rateDate,
    rateLoading,
    rateError,
    reloadRate: () => setRateAttempt((value) => value + 1),
    converted,
    baseCurrency: findCurrency(currencies, base),
    quoteCurrency: findCurrency(currencies, quote),
  };
}

function findCurrency(currencies: Currency[], code: string): Currency {
  return (
    currencies.find((currency) => currency.iso_code === code) ?? {
      iso_code: code,
      name: code,
      symbol: null,
    }
  );
}

function isAbort(error: unknown): boolean {
  return error instanceof Error && error.name === 'AbortError';
}
