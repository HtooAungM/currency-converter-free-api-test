import { Pressable, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { theme } from '@/constants/theme';

type Props = {
  onPress: () => void;
};

export function SwapButton({ onPress }: Props) {
  return (
    <Pressable
      testID="swap-button"
      accessibilityRole="button"
      accessibilityLabel="Swap currencies"
      onPress={onPress}
      style={({ pressed }) => [styles.button, pressed && styles.pressed]}>
      <Svg width={18} height={18} viewBox="0 0 18 18">
        <Path
          d="M5.2 3.2v8.2M5.2 3.2 2.8 5.6M5.2 3.2l2.4 2.4M12.8 14.8V6.6M12.8 14.8l2.4-2.4M12.8 14.8l-2.4-2.4"
          stroke={theme.accentInk}
          strokeWidth={1.7}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </Svg>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.accent,
    borderWidth: 4,
    borderColor: theme.background,
  },
  pressed: {
    opacity: 0.82,
  },
});
