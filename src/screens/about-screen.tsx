import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Pressable, StyleSheet, View } from 'react-native';

import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { APP_VERSION } from '@/constants/build';
import i18n from '@/constants/i18n';
import { Colors, Radii, Spacing } from '@/constants/theme';
import { useThemePreference } from '@/hooks/theme-preference';
import { useColorScheme } from '@/hooks/use-color-scheme';
import type { RootStackParamList } from '@/navigation/types';

export default function AboutScreen() {
  const { preference } = useThemePreference();
  const colorScheme = useColorScheme(preference);
  const colors = Colors[colorScheme];
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: Colors.light.surface, dark: Colors.dark.surface }}
      headerImage={
        <IconSymbol
          size={200}
          color={colors.tint}
          name="info.circle.fill"
          style={styles.headerIcon}
        />
      }>
      <ThemedView style={styles.section}>
        <ThemedText type="title">{i18n.t('about.title')}</ThemedText>
        <ThemedText style={{ color: colors.textSecondary }}>
          {i18n.t('about.description')}
        </ThemedText>
      </ThemedView>

      <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <ThemedText type="subtitle">{i18n.t('about.hoursTitle')}</ThemedText>
        <ThemedText style={{ color: colors.textSecondary }}>{i18n.t('about.hoursBody')}</ThemedText>
      </View>

      <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <ThemedText type="subtitle">{i18n.t('about.contactTitle')}</ThemedText>
        <ThemedText style={{ color: colors.textSecondary }}>
          {i18n.t('about.contactEmail')}
          {'\n'}
          {i18n.t('about.contactPhone')}
        </ThemedText>
      </View>

      <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <ThemedText type="subtitle">{i18n.t('about.locationTitle')}</ThemedText>
        <ThemedText style={{ color: colors.textSecondary }}>
          {i18n.t('about.locationBody')}
        </ThemedText>
      </View>

      <Pressable onPress={() => navigation.navigate('Modal')} style={styles.versionLink}>
        <ThemedText style={[styles.versionText, { color: colors.textSecondary }]}>
          v{APP_VERSION}
        </ThemedText>
      </Pressable>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerIcon: {
    position: 'absolute',
    bottom: -20,
    alignSelf: 'center',
    opacity: 0.3,
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
  versionLink: {
    alignSelf: 'center',
    marginTop: Spacing.lg,
    paddingVertical: Spacing.sm,
  },
  versionText: {
    fontSize: 12,
    lineHeight: 18,
    opacity: 0.5,
  },
});
