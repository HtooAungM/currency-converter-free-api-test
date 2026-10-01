import { Stack } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { AmountField } from '@/components/AmountField';
import { CurrencyRow } from '@/components/CurrencyRow';
import { CurrencySheet } from '@/components/CurrencySheet';
import { RateNote, ResultPanel } from '@/components/ResultPanel';
import { SwapButton } from '@/components/SwapButton';
import { theme } from '@/constants/theme';
import { useExchange } from '@/hooks/useExchange';

type Picker = 'base' | 'quote' | null;

export default function ExchangeScreen() {
  const exchange = useExchange();
  const insets = useSafeAreaInsets();
  const [picking, setPicking] = useState<Picker>(null);

  const selectedCode = picking === 'quote' ? exchange.quote : exchange.base;

  function selectCurrency(code: string) {
    if (picking === 'quote') {
      exchange.setQuote(code);
    } else {
      exchange.setBase(code);
    }
    setPicking(null);
  }

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'left', 'right']} testID="exchange-screen">
      <Stack.Screen options={{ title: 'Exchange' }} />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 32 }]}>
          <View style={styles.header}>
            <Text style={styles.title}>Exchange</Text>
            <Text style={styles.subtitle}>Mid-market rate</Text>
          </View>

          <View style={styles.card} testID="exchange-card">
            <View style={styles.send}>
              <Text style={styles.label}>You send</Text>
              <View style={styles.line}>
                <AmountField value={exchange.amount} onChangeText={exchange.setAmount} />
                <CurrencyRow
                  testID="from-currency"
                  codeTestID="from-currency-code"
                  currency={exchange.baseCurrency}
                  onPress={() => setPicking('base')}
                />
              </View>
              <Text testID="from-currency-name" style={styles.currencyName} numberOfLines={1}>
                {exchange.baseCurrency.name}
              </Text>
            </View>

            <View style={styles.swapWrap}>
              <SwapButton onPress={exchange.swap} />
            </View>

            <View style={styles.receive}>
              <Text style={styles.label}>You receive</Text>
              <View style={styles.line}>
                <ResultPanel
                  converted={exchange.converted}
                  quote={exchange.quote}
                  loading={exchange.rateLoading}
                  error={exchange.rateError}
                  onRetry={exchange.reloadRate}
                />
                <CurrencyRow
                  testID="to-currency"
                  codeTestID="to-currency-code"
                  currency={exchange.quoteCurrency}
                  onPress={() => setPicking('quote')}
                />
              </View>
              <Text testID="to-currency-name" style={styles.currencyName} numberOfLines={1}>
                {exchange.quoteCurrency.name}
              </Text>
            </View>
          </View>

          <RateNote
            base={exchange.base}
            quote={exchange.quote}
            rate={exchange.rate}
            rateDate={exchange.rateDate}
            loading={exchange.rateLoading}
            error={exchange.rateError}
          />
        </ScrollView>
      </KeyboardAvoidingView>

      <CurrencySheet
        visible={picking != null}
        title={picking === 'quote' ? 'You receive' : 'You send'}
        currencies={exchange.currencies}
        selectedCode={selectedCode}
        loading={exchange.listLoading}
        error={exchange.listError}
        onRetry={exchange.reloadCurrencies}
        onSelect={selectCurrency}
        onClose={() => setPicking(null)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: theme.background,
  },
  flex: {
    flex: 1,
  },
  content: {
    width: '100%',
    maxWidth: 440,
    alignSelf: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  header: {
    marginBottom: 28,
    gap: 4,
  },
  title: {
    color: theme.text,
    fontSize: 22,
    fontWeight: '600',
    letterSpacing: -0.4,
  },
  subtitle: {
    color: theme.muted,
    fontSize: 14,
  },
  card: {
    borderRadius: 28,
    backgroundColor: theme.card,
    borderWidth: 1,
    borderColor: theme.border,
    boxShadow: '0 16px 32px rgba(0, 0, 0, 0.35)',
  },
  send: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 22,
    gap: 6,
  },
  receive: {
    paddingHorizontal: 20,
    paddingTop: 22,
    paddingBottom: 20,
    gap: 6,
    backgroundColor: theme.cardReceive,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  label: {
    color: theme.muted,
    fontSize: 13,
    fontWeight: '500',
  },
  line: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  currencyName: {
    color: theme.faint,
    fontSize: 13,
  },
  swapWrap: {
    alignItems: 'center',
    marginTop: -22,
    marginBottom: -22,
    zIndex: 2,
  },
});
