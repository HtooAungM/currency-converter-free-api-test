import { useEffect, useMemo, useState } from 'react';
import {
  Modal,
  Pressable,
  SectionList,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { POPULAR_CODES } from '@/constants/currencies';
import { theme } from '@/constants/theme';
import type { Currency } from '@/types/currency';

import { CurrencyFlag } from './CurrencyFlag';

type Props = {
  visible: boolean;
  title: string;
  currencies: Currency[];
  selectedCode: string;
  loading: boolean;
  error: string | null;
  onRetry: () => void;
  onSelect: (code: string) => void;
  onClose: () => void;
};

export function CurrencySheet({
  visible,
  title,
  currencies,
  selectedCode,
  loading,
  error,
  onRetry,
  onSelect,
  onClose,
}: Props) {
  const { height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (visible) {
      setQuery('');
    }
  }, [visible]);

  const sections = useMemo(() => buildSections(currencies, query), [currencies, query]);
  const searching = query.trim().length > 0;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      statusBarTranslucent
      onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} accessibilityLabel="Close currency list" onPress={onClose} />
        <View style={[styles.sheet, { height: Math.min(height * 0.88, 720) }]} testID="currency-sheet">
          <View style={styles.handle} />
          <View style={styles.header}>
            <View>
              <Text style={styles.kicker}>Currency</Text>
              <Text style={styles.title}>{title}</Text>
            </View>
            <Pressable
              testID="currency-sheet-close"
              accessibilityRole="button"
              accessibilityLabel="Close currency list"
              onPress={onClose}
              style={styles.close}>
              <Text style={styles.closeText}>Close</Text>
            </Pressable>
          </View>
          <TextInput
            testID="currency-search"
            value={query}
            onChangeText={setQuery}
            placeholder="Search by name or code"
            placeholderTextColor={theme.faint}
            selectionColor={theme.accent}
            cursorColor={theme.accent}
            autoCorrect={false}
            autoCapitalize="none"
            style={styles.search}
            accessibilityLabel="Search currency"
          />
          {error ? (
            <View style={styles.message}>
              <Text style={styles.error}>{error}</Text>
              <Pressable accessibilityRole="button" onPress={onRetry}>
                <Text style={styles.retry}>Try again</Text>
              </Pressable>
            </View>
          ) : null}
          <SectionList
            style={styles.list}
            sections={sections}
            keyExtractor={(item) => item.iso_code}
            keyboardShouldPersistTaps="handled"
            stickySectionHeadersEnabled
            contentContainerStyle={{ paddingBottom: insets.bottom + 16 }}
            renderSectionHeader={({ section }) =>
              searching ? null : (
                <Text style={styles.section}>{section.title}</Text>
              )
            }
            renderItem={({ item }) => {
              const selected = item.iso_code === selectedCode;
              return (
                <Pressable
                  testID={`currency-${item.iso_code}`}
                  accessibilityRole="button"
                  accessibilityState={{ selected }}
                  onPress={() => onSelect(item.iso_code)}
                  style={({ pressed }) => [
                    styles.item,
                    selected && styles.itemSelected,
                    pressed && styles.itemPressed,
                  ]}>
                  <CurrencyFlag code={item.iso_code} width={32} />
                  <View style={styles.copy}>
                    <Text style={styles.code}>{item.iso_code}</Text>
                    <Text style={styles.name} numberOfLines={1}>
                      {item.name}
                    </Text>
                  </View>
                  {selected ? (
                    <View style={styles.mark}>
                      <Text style={styles.markText}>✓</Text>
                    </View>
                  ) : null}
                </Pressable>
              );
            }}
            ListEmptyComponent={
              loading ? (
                <Text style={styles.empty}>Loading currencies</Text>
              ) : (
                <Text style={styles.empty}>No currencies match that search.</Text>
              )
            }
          />
        </View>
      </View>
    </Modal>
  );
}

function buildSections(currencies: Currency[], query: string) {
  const needle = query.trim().toLowerCase();
  const matches = (currency: Currency) =>
    currency.iso_code.toLowerCase().includes(needle) || currency.name.toLowerCase().includes(needle);

  if (needle) {
    return [{ title: 'Results', data: currencies.filter(matches) }];
  }

  const popular = POPULAR_CODES.flatMap((code) => {
    const currency = currencies.find((item) => item.iso_code === code);
    return currency ? [currency] : [];
  });
  const popularSet = new Set(popular.map((currency) => currency.iso_code));
  const rest = currencies.filter((currency) => !popularSet.has(currency.iso_code));

  return [
    { title: 'Popular', data: popular },
    { title: 'All currencies', data: rest },
  ].filter((section) => section.data.length > 0);
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0,0,0,0.55)',
  },
  sheet: {
    width: '100%',
    maxWidth: 480,
    backgroundColor: theme.card,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderWidth: 1,
    borderColor: theme.border,
    overflow: 'hidden',
  },
  handle: {
    alignSelf: 'center',
    width: 36,
    height: 4,
    borderRadius: 2,
    marginTop: 10,
    backgroundColor: 'rgba(255,255,255,0.18)',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 8,
  },
  kicker: {
    color: theme.muted,
    fontSize: 12,
    fontWeight: '500',
  },
  title: {
    color: theme.text,
    fontSize: 20,
    fontWeight: '600',
    letterSpacing: -0.3,
  },
  close: {
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  closeText: {
    color: theme.accent,
    fontSize: 15,
    fontWeight: '600',
  },
  list: {
    flex: 1,
  },
  search: {
    marginHorizontal: 20,
    marginTop: 8,
    marginBottom: 8,
    backgroundColor: theme.background,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: theme.border,
    color: theme.text,
    fontSize: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    outlineWidth: 0,
  },
  section: {
    backgroundColor: theme.card,
    color: theme.muted,
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginHorizontal: 12,
    marginVertical: 2,
    paddingHorizontal: 10,
    paddingVertical: 12,
    borderRadius: 14,
  },
  itemSelected: {
    backgroundColor: theme.chip,
  },
  itemPressed: {
    opacity: 0.72,
  },
  copy: {
    flex: 1,
    gap: 2,
  },
  code: {
    color: theme.text,
    fontSize: 15,
    fontWeight: '600',
    fontVariant: ['tabular-nums'],
  },
  name: {
    color: theme.muted,
    fontSize: 13,
  },
  mark: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.accent,
  },
  markText: {
    color: theme.accentInk,
    fontSize: 12,
    fontWeight: '700',
  },
  message: {
    paddingHorizontal: 16,
    paddingBottom: 8,
    gap: 6,
  },
  error: {
    color: theme.danger,
    fontSize: 14,
  },
  retry: {
    color: theme.accent,
    fontSize: 14,
    fontWeight: '600',
  },
  empty: {
    color: theme.muted,
    fontSize: 14,
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
});
