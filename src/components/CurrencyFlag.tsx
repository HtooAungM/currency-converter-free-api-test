import { StyleSheet, Text, View } from 'react-native';
import { SvgXml } from 'react-native-svg';

import { CURRENCY_COUNTRIES } from '@/constants/currencyCountries';
import { FLAG_SVGS } from '@/constants/flagSvgs';
import { theme } from '@/constants/theme';

type Props = {
  code: string;
  width?: number;
};

export function CurrencyFlag({ code, width = 28 }: Props) {
  const country = CURRENCY_COUNTRIES[code];
  const xml = country ? FLAG_SVGS[country] : undefined;
  const height = Math.round(width * (2 / 3));
  const radius = Math.max(3, Math.round(width * 0.16));

  if (!xml) {
    return (
      <View style={[styles.fallback, { width, height, borderRadius: radius, backgroundColor: tint(code) }]}>
        <Text style={[styles.letters, { fontSize: Math.max(8, Math.round(width * 0.32)) }]}>
          {code.slice(0, 2)}
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.frame, { width, height, borderRadius: radius }]}>
      <SvgXml xml={xml} width={width} height={height} />
    </View>
  );
}

function tint(code: string): string {
  const palette = ['#3C4E6E', '#4A4060', '#3E5349', '#5A4636', '#4A3C4C', '#3A4C58'];
  let hash = 0;
  for (let index = 0; index < code.length; index += 1) {
    hash = (hash + code.charCodeAt(index) * (index + 1)) % palette.length;
  }
  return palette[hash] ?? palette[0];
}

const styles = StyleSheet.create({
  frame: {
    overflow: 'hidden',
    backgroundColor: theme.chip,
  },
  fallback: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  letters: {
    color: theme.text,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});
