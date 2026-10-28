import { Text, type StyleProp, type TextStyle } from 'react-native';

/**
 * Lightweight icon map — SF Symbol names mapped to Material Symbols ligatures.
 * No Expo / vector-icons dependency. Swap for react-native-vector-icons on native later.
 */
const MAPPING = {
  'house.fill': 'home',
  'chevron.left': 'chevron_left',
  'chevron.right': 'chevron_right',
  'info.circle.fill': 'info',
  'person.circle.fill': 'account_circle',
  'clock.arrow.circlepath': 'history',
  'gearshape.fill': 'settings',
  'rectangle.portrait.and.arrow.right': 'logout',
  'bubble.left.fill': 'chat',
  'creditcard.fill': 'credit_card',
  'lock.shield.fill': 'security',
  'line.3.horizontal': 'menu',
} as const;

export type IconSymbolName = keyof typeof MAPPING;

type Props = {
  name: IconSymbolName;
  size?: number;
  color: string;
  style?: StyleProp<TextStyle>;
};

export function IconSymbol({ name, size = 24, color, style }: Props) {
  return (
    <Text
      accessibilityElementsHidden
      importantForAccessibility="no"
      style={[
        {
          fontFamily: 'Material Symbols Outlined',
          fontSize: size,
          lineHeight: size,
          color,
          fontWeight: 'normal',
          includeFontPadding: false,
          textAlignVertical: 'center',
        },
        style,
      ]}>
      {MAPPING[name]}
    </Text>
  );
}
