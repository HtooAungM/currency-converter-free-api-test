import type { Currency, ExchangeRate } from '@/types/currency';

const API = 'https://api.frankfurter.dev';
const MAX_ATTEMPTS = 3;

export async function fetchCurrencies(signal?: AbortSignal): Promise<Currency[]> {
  const data = await requestJson(`${API}/v2/currencies`, signal);
  if (!Array.isArray(data)) {
    throw new Error('Could not load currencies.');
  }
  return data.filter(isCurrency).map((item) => ({
    iso_code: item.iso_code,
    name: item.name,
    symbol: typeof item.symbol === 'string' ? item.symbol : null,
  }));
}

export async function fetchRate(
  base: string,
  quote: string,
  signal?: AbortSignal,
): Promise<ExchangeRate> {
  const data = await requestJson(
    `${API}/v2/rate/${base.toLowerCase()}/${quote.toLowerCase()}`,
    signal,
  );
  if (!isRate(data)) {
    throw new Error('Could not load this rate.');
  }
  return data;
}

async function requestJson(url: string, signal?: AbortSignal): Promise<unknown> {
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
    if (signal?.aborted) {
      throw abortError();
    }

    try {
      const response = await fetch(url, {
        signal,
        headers: { Accept: 'application/json' },
      });

      if (response.status === 404) {
        throw new Error('This pair is not available.');
      }
      if (!response.ok) {
        throw new Error('Could not load exchange data.');
      }

      return await response.json();
    } catch (error: unknown) {
      if (isAbort(error)) {
        throw error;
      }
      lastError = error instanceof Error ? error : new Error('Could not load exchange data.');
      if (attempt < MAX_ATTEMPTS) {
        await wait(250 * attempt, signal);
      }
    }
  }

  throw lastError ?? new Error('Could not load exchange data.');
}

function wait(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(abortError());
      return;
    }
    const timer = setTimeout(resolve, ms);
    const onAbort = () => {
      clearTimeout(timer);
      reject(abortError());
    };
    signal?.addEventListener('abort', onAbort, { once: true });
  });
}

function abortError(): Error {
  const error = new Error('Aborted');
  error.name = 'AbortError';
  return error;
}

function isAbort(error: unknown): boolean {
  return error instanceof Error && error.name === 'AbortError';
}

function isCurrency(value: unknown): value is { iso_code: string; name: string; symbol?: unknown } {
  if (!value || typeof value !== 'object') {
    return false;
  }
  const item = value as Record<string, unknown>;
  return typeof item.iso_code === 'string' && typeof item.name === 'string';
}

function isRate(value: unknown): value is ExchangeRate {
  if (!value || typeof value !== 'object') {
    return false;
  }
  const item = value as Record<string, unknown>;
  return (
    typeof item.date === 'string' &&
    typeof item.base === 'string' &&
    typeof item.quote === 'string' &&
    typeof item.rate === 'number'
  );
}
