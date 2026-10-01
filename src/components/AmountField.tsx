import { StyleSheet, TextInput } from 'react-native';

import { theme } from '@/constants/theme';

type Props = {
  value: string;
  onChangeText: (value: string) => void;
};

export function AmountField({ value, onChangeText }: Props) {
  return (
    <TextInput
      testID="amount-input"
      value={value}
      onChangeText={onChangeText}
      keyboardType="decimal-pad"
      inputMode="decimal"
      placeholder="0"
      placeholderTextColor={theme.faint}
      selectionColor={theme.muted}
      cursorColor={theme.text}
      style={styles.input}
      accessibilityLabel="Amount to send"
    />
  );
}

const styles = StyleSheet.create({
  input: {
    flex: 1,
    minWidth: 0,
    height: 48,
    color: theme.text,
    fontSize: 36,
    fontWeight: '600',
    letterSpacing: -1,
    fontVariant: ['tabular-nums'],
    padding: 0,
    margin: 0,
    borderWidth: 0,
    outlineWidth: 0,
  },
});
