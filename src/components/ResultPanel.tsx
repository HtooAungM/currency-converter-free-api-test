import { Pressable, StyleSheet, Text, View } from 'react-native';

import { theme } from '@/constants/theme';
import { formatMoney, formatRate, formatRateDate } from '@/utils/formatMoney';

type AmountProps = {
  converted: number | null;
  quote: string;
  loading: boolean;
  error: string | null;
  onRetry: () => void;
};

type NoteProps = {
  base: string;
  quote: string;
  rate: number | null;
  rateDate: string | null;
  loading: boolean;
  error: string | null;
};

export function ResultPanel({ converted, quote, loading, error, onRetry }: AmountProps) {
  if (loading) {
    return <View testID="result-loading" style={styles.skeleton} accessibilityLabel="Loading result" />;
  }

  if (error) {
    return (
      <View style={styles.errorWrap}>
        <Text testID="rate-error" style={styles.error}>
          {error}
        </Text>
        <Pressable testID="retry-rate" accessibilityRole="button" onPress={onRetry}>
          <Text style={styles.retry}>Try again</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.result}>
      <Text
        testID="result-amount"
        style={styles.amount}
        numberOfLines={1}
        adjustsFontSizeToFit
        minimumFontScale={0.45}
        accessibilityLabel={`You receive ${converted == null ? 'no amount' : formatMoney(converted)} ${quote}`}>
        {converted == null ? '—' : formatMoney(converted)}
      </Text>
    </View>
  );
}

export function RateNote({ base, quote, rate, rateDate, loading, error }: NoteProps) {
  if (error) {
    return null;
  }

  return (
    <View style={styles.note} testID="rate-note">
      {loading || rate == null ? (
        <Text testID="rate-pending" style={styles.pending}>
          Fetching the latest rate
        </Text>
      ) : (
        <Text testID="rate-line" style={styles.rate}>
          1 {base} = {formatRate(rate)} {quote}
        </Text>
      )}
      <Text testID="rate-date" style={styles.date}>
        {rateDate ? `Updated ${formatRateDate(rateDate)}` : loading ? ' ' : 'Same currency'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  result: {
    flex: 1,
    minWidth: 0,
  },
  amount: {
    color: theme.text,
    fontSize: 36,
    lineHeight: 44,
    fontWeight: '600',
    letterSpacing: -1,
    fontVariant: ['tabular-nums'],
  },
  skeleton: {
    flex: 1,
    height: 28,
    maxWidth: 180,
    borderRadius: 8,
    backgroundColor: theme.chip,
  },
  errorWrap: {
    flex: 1,
    gap: 4,
    justifyContent: 'center',
  },
  error: {
    color: theme.danger,
    fontSize: 14,
  },
  retry: {
    color: theme.text,
    fontSize: 14,
    fontWeight: '600',
  },
  note: {
    alignItems: 'center',
    gap: 4,
    paddingTop: 18,
  },
  rate: {
    color: theme.text,
    fontSize: 15,
    fontWeight: '500',
    fontVariant: ['tabular-nums'],
  },
  pending: {
    color: theme.muted,
    fontSize: 15,
  },
  date: {
    color: theme.muted,
    fontSize: 13,
  },
});
