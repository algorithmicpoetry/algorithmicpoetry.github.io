import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol, type IconSymbolName } from '@/components/ui/icon-symbol';
import i18n from '@/constants/i18n';
import { Colors, Radii, Spacing } from '@/constants/theme';
import { useThemePreference } from '@/hooks/theme-preference';
import { useColorScheme } from '@/hooks/use-color-scheme';
import type { RootStackParamList } from '@/navigation/types';

const ACTIVITY_ITEMS: {
  titleKey: string;
  subtitleKey: string;
  icon: IconSymbolName;
  route: keyof RootStackParamList;
}[] = [
  {
    titleKey: 'activity.messagesTitle',
    subtitleKey: 'activity.messagesSubtitle',
    icon: 'bubble.left.fill',
    route: 'Messages',
  },
  {
    titleKey: 'activity.transactionsTitle',
    subtitleKey: 'activity.transactionsSubtitle',
    icon: 'creditcard.fill',
    route: 'Transactions',
  },
  {
    titleKey: 'activity.securityTitle',
    subtitleKey: 'activity.securitySubtitle',
    icon: 'lock.shield.fill',
    route: 'SecurityHistory',
  },
];

export default function ActivityScreen() {
  const { preference } = useThemePreference();
  const colorScheme = useColorScheme(preference);
  const colors = Colors[colorScheme];
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {ACTIVITY_ITEMS.map((item) => (
          <Pressable
            key={item.route}
            style={[styles.card, { borderColor: colors.border }]}
            onPress={() => navigation.navigate(item.route)}>
            <IconSymbol name={item.icon} size={28} color={colors.tint} />
            <View style={styles.cardText}>
              <ThemedText style={styles.cardTitle}>{i18n.t(item.titleKey)}</ThemedText>
              <ThemedText style={[styles.cardSubtitle, { color: colors.textSecondary }]}>
                {i18n.t(item.subtitleKey)}
              </ThemedText>
            </View>
            <IconSymbol name="chevron.right" size={16} color={colors.textSecondary} />
          </Pressable>
        ))}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { padding: Spacing.xl },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.lg,
    borderWidth: 1,
    borderRadius: Radii.md,
    marginBottom: Spacing.sm,
    gap: Spacing.md,
  },
  cardText: { flex: 1 },
  cardTitle: { fontSize: 16, fontWeight: '600' },
  cardSubtitle: { fontSize: 13, marginTop: 2 },
});
