import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useThemePreference } from '@/hooks/theme-preference';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';

type Props = {
  message: string;
};

export default function EmptyActivityScreen({ message }: Props) {
  const { preference } = useThemePreference();
  const colorScheme = useColorScheme(preference);
  const colors = Colors[colorScheme];

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={[styles.empty, { color: colors.textSecondary }]}>{message}</ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: Spacing.xl },
  empty: { fontSize: 16 },
});
