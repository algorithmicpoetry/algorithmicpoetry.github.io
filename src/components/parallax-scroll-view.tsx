import type { PropsWithChildren, ReactElement } from 'react';
import { useRef, useState } from 'react';
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  PixelRatio,
  ScrollView,
  StyleSheet,
  View,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useThemePreference } from '@/hooks/theme-preference';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useThemeColor } from '@/hooks/use-theme-color';

const BASE_HEADER_HEIGHT = 125;

type Props = PropsWithChildren<{
  headerImage: ReactElement;
  headerBackgroundColor: { dark: string; light: string };
}>;

export default function ParallaxScrollView({
  children,
  headerImage,
  headerBackgroundColor,
}: Props) {
  const insets = useSafeAreaInsets();
  const backgroundColor = useThemeColor({}, 'background');
  const { preference } = useThemePreference();
  const colorScheme = useColorScheme(preference);
  const scrollRef = useRef<ScrollView>(null);
  const [offsetY, setOffsetY] = useState(0);
  useWindowDimensions();

  const fontScale = PixelRatio.getFontScale();
  const headerHeight = BASE_HEADER_HEIGHT * Math.min(fontScale, 2);
  const totalHeaderHeight = headerHeight + insets.top;

  const clamped = Math.max(-totalHeaderHeight, Math.min(totalHeaderHeight, offsetY));
  const progress = clamped / totalHeaderHeight;
  const translateY = progress < 0 ? clamped / 2 : clamped * 0.75;
  const scale = progress < 0 ? 1 + Math.abs(progress) : 1;

  const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    setOffsetY(event.nativeEvent.contentOffset.y);
  };

  return (
    <ScrollView
      ref={scrollRef}
      style={{ backgroundColor, flex: 1 }}
      scrollEventThrottle={16}
      onScroll={onScroll}>
      <View
        style={[
          styles.header,
          {
            backgroundColor: headerBackgroundColor[colorScheme],
            height: totalHeaderHeight,
            paddingTop: insets.top,
            transform: [{ translateY }, { scale }],
          },
        ]}>
        {headerImage}
      </View>
      <ThemedView style={styles.content}>{children}</ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  header: {
    overflow: 'hidden',
  },
  content: {
    flex: 1,
    padding: Spacing.xl,
    gap: Spacing.md,
    overflow: 'hidden',
  },
});
