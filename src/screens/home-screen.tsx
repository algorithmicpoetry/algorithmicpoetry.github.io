import { StyleSheet, View, useWindowDimensions } from 'react-native';

import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import i18n from '@/constants/i18n';
import { Colors, Radii, Spacing } from '@/constants/theme';
import { useThemePreference } from '@/hooks/theme-preference';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function HomeScreen() {
  const { preference } = useThemePreference();
  const colorScheme = useColorScheme(preference);
  const colors = Colors[colorScheme];
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: Colors.light.hero, dark: Colors.dark.hero }}
      headerImage={
        <View style={styles.heroContent}>
          <ThemedText
            style={[styles.heroTitle, { color: Colors[colorScheme].heroText }]}
            numberOfLines={1}>
            {i18n.t('home.heroTitle')}
          </ThemedText>
          <ThemedText
            style={[styles.heroSubtitle, { color: Colors[colorScheme].heroText }]}
            numberOfLines={1}>
            {i18n.t('home.heroSubtitle')}
          </ThemedText>
        </View>
      }>
      <ThemedView style={styles.section}>
        <ThemedText type="title">{i18n.t('home.welcomeTitle')}</ThemedText>
        <ThemedText style={{ color: colors.textSecondary }}>
          {i18n.t('home.welcomeDescription')}
        </ThemedText>
      </ThemedView>

      <View style={isLandscape ? styles.cardRow : undefined}>
        <View
          style={[
            styles.card,
            isLandscape && styles.cardHalf,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}>
          <ThemedText type="subtitle">{i18n.t('home.getStartedTitle')}</ThemedText>
          <ThemedText style={{ color: colors.textSecondary }}>
            {i18n.t('home.getStartedDescription')}
          </ThemedText>
        </View>

        <View
          style={[
            styles.card,
            isLandscape && styles.cardHalf,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}>
          <ThemedText type="subtitle">{i18n.t('home.builtForChangeTitle')}</ThemedText>
          <ThemedText style={{ color: colors.textSecondary }}>
            {i18n.t('home.builtForChangeDescription')}
          </ThemedText>
        </View>
      </View>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  heroContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
  },
  heroTitle: {
    fontSize: 36,
    lineHeight: 48,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  heroSubtitle: {
    fontSize: 16,
    opacity: 0.8,
    marginTop: Spacing.xs,
    textAlign: 'center',
  },
  section: {
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  card: {
    padding: Spacing.lg,
    borderRadius: Radii.md,
    borderWidth: 1,
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  cardRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  cardHalf: {
    flex: 1,
  },
});
