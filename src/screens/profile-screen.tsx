import { useState } from 'react';
import { ScrollView, StyleSheet, TextInput, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import i18n from '@/constants/i18n';
import { Colors, Radii, Spacing } from '@/constants/theme';
import { useThemePreference } from '@/hooks/theme-preference';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function ProfileScreen() {
  const { preference } = useThemePreference();
  const colorScheme = useColorScheme(preference);
  const colors = Colors[colorScheme];

  const [name, setName] = useState(i18n.t('profile.placeholderName'));
  const [email, setEmail] = useState(i18n.t('profile.placeholderEmail'));
  const [phone, setPhone] = useState(i18n.t('profile.placeholderPhone'));

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.avatarSection}>
          <View style={[styles.avatar, { backgroundColor: colors.surface }]}>
            <IconSymbol name="person.circle.fill" size={64} color={colors.textSecondary} />
          </View>
          <ThemedText style={[styles.sectionLabel, { color: colors.textSecondary }]}>
            {i18n.t('profile.memberId')}
          </ThemedText>
          <ThemedText style={styles.memberId}>{i18n.t('profile.placeholderMemberId')}</ThemedText>
        </View>

        <ThemedText style={[styles.sectionLabel, { color: colors.textSecondary }]}>
          {i18n.t('profile.sectionPersonalInfo')}
        </ThemedText>

        <View style={styles.fieldGroup}>
          <View style={styles.field}>
            <ThemedText style={[styles.fieldLabel, { color: colors.textSecondary }]}>
              {i18n.t('profile.displayName')}
            </ThemedText>
            <TextInput
              style={[styles.input, { color: colors.text, borderColor: colors.border }]}
              value={name}
              onChangeText={setName}
              placeholderTextColor={colors.textSecondary}
            />
          </View>
          <View style={styles.field}>
            <ThemedText style={[styles.fieldLabel, { color: colors.textSecondary }]}>
              {i18n.t('profile.email')}
            </ThemedText>
            <TextInput
              style={[styles.input, { color: colors.text, borderColor: colors.border }]}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              placeholderTextColor={colors.textSecondary}
            />
          </View>
          <View style={styles.field}>
            <ThemedText style={[styles.fieldLabel, { color: colors.textSecondary }]}>
              {i18n.t('profile.phone')}
            </ThemedText>
            <TextInput
              style={[styles.input, { color: colors.text, borderColor: colors.border }]}
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              placeholderTextColor={colors.textSecondary}
            />
          </View>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { padding: Spacing.xl },
  avatarSection: { alignItems: 'center', marginBottom: Spacing.xl },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: Radii.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  memberId: { fontFamily: 'monospace', fontSize: 14 },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: Spacing.md,
    marginTop: Spacing.sm,
  },
  fieldGroup: { gap: Spacing.md },
  field: { gap: Spacing.xs },
  fieldLabel: { fontSize: 12 },
  input: {
    padding: Spacing.sm,
    borderWidth: 1,
    borderRadius: Radii.sm,
    fontSize: 16,
  },
});
