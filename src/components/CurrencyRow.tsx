import { Pressable, StyleSheet, Text } from 'react-native';

import { theme } from '@/constants/theme';
import type { Currency } from '@/types/currency';

import { CurrencyFlag } from './CurrencyFlag';

type Props = {
  currency: Currency;
  onPress: () => void;
  testID: string;
  codeTestID: string;
};

export function CurrencyRow({ currency, onPress, testID, codeTestID }: Props) {
  return (
    <Pressable
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={`Select ${currency.iso_code}, ${currency.name}`}
      onPress={onPress}
      style={({ pressed }) => [styles.chip, pressed && styles.pressed]}>
      <CurrencyFlag code={currency.iso_code} width={26} />
      <Text testID={codeTestID} style={styles.code}>
        {currency.iso_code}
      </Text>
      <Text style={styles.caret}>▾</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: theme.chip,
    borderRadius: 999,
    paddingLeft: 8,
    paddingRight: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: theme.border,
  },
  pressed: {
    opacity: 0.72,
  },
  code: {
    color: theme.text,
    fontSize: 15,
    fontWeight: '600',
    fontVariant: ['tabular-nums'],
  },
  caret: {
    color: theme.muted,
    fontSize: 10,
    marginTop: 1,
  },
});
