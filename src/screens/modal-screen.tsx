import { useNavigation } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { APP_VERSION, BUILD_ID, RUNTIME } from '@/constants/build';
import i18n from '@/constants/i18n';
import { Colors, Spacing } from '@/constants/theme';
import { useThemePreference } from '@/hooks/theme-preference';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { fetchEdgeHealth, type EdgeHealth } from '@/lib/edge';

export default function ModalScreen() {
  const { preference } = useThemePreference();
  const colorScheme = useColorScheme(preference);
  const colors = Colors[colorScheme];
  const navigation = useNavigation();
  const [edge, setEdge] = useState<EdgeHealth | null>(null);
  const [edgeChecked, setEdgeChecked] = useState(false);

  useEffect(() => {
    let alive = true;
    fetchEdgeHealth().then((result) => {
      if (!alive) return;
      setEdge(result);
      setEdgeChecked(true);
    });
    return () => {
      alive = false;
    };
  }, []);

  const rows = [
    { label: i18n.t('modal.labelPlatform'), value: Platform.OS },
    {
      label: i18n.t('modal.labelOsVersion'),
      value: Platform.Version?.toString() ?? 'unknown',
    },
    { label: i18n.t('modal.labelRuntime'), value: RUNTIME },
    {
      label: i18n.t('modal.labelEdge'),
      value: !edgeChecked
        ? '…'
        : edge?.ok
          ? `${edge.runtime ?? 'worker'} (≤${edge.cpuBudgetMs ?? 10}ms)`
          : i18n.t('modal.edgeOffline'),
    },
  ];

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <ThemedText type="title" style={styles.title}>
          v{APP_VERSION}
        </ThemedText>
        <ThemedText style={[styles.buildId, { color: colors.textSecondary }]}>{BUILD_ID}</ThemedText>

        {rows.map((row) => (
          <View key={row.label} style={styles.row}>
            <ThemedText style={[styles.label, { color: colors.textSecondary }]}>
              {row.label}
            </ThemedText>
            <ThemedText style={styles.value}>{row.value}</ThemedText>
          </View>
        ))}

        <Pressable onPress={() => navigation.goBack()} style={styles.dismiss}>
          <ThemedText style={{ color: colors.tint, fontSize: 16 }}>
            {i18n.t('modal.dismiss')}
          </ThemedText>
        </Pressable>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    padding: Spacing.xl,
    paddingTop: Spacing.xxl,
  },
  title: {
    marginBottom: Spacing.xs,
  },
  buildId: {
    fontSize: 16,
    marginBottom: Spacing.xl,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    paddingVertical: Spacing.md,
    gap: Spacing.xs,
  },
  label: {
    fontSize: 16,
  },
  value: {
    fontSize: 16,
    flexShrink: 1,
  },
  dismiss: {
    alignSelf: 'center',
    marginTop: Spacing.xl,
    paddingVertical: Spacing.md,
  },
});
