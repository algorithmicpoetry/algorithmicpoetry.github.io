import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Switch, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import i18n, { getAvailableLanguages, setLanguagePreference } from '@/constants/i18n';
import { Colors, Radii, Spacing } from '@/constants/theme';
import { useThemePreference } from '@/hooks/theme-preference';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function SettingsScreen() {
  const { preference, setPreference } = useThemePreference();
  const colorScheme = useColorScheme(preference);
  const colors = Colors[colorScheme];

  const [pushEnabled, setPushEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
  const [showLanguagePicker, setShowLanguagePicker] = useState(false);

  const languages = getAvailableLanguages();
  const currentLanguageLabel =
    languages.find((l) => l.code === selectedLanguage)?.label ?? i18n.t('settings.deviceDefault');

  const handleLanguageSelect = async (code: string | null) => {
    setSelectedLanguage(code);
    await setLanguagePreference(code);
    setShowLanguagePicker(false);
  };

  const darkMode = colorScheme === 'dark';

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <ThemedText style={[styles.sectionLabel, { color: colors.textSecondary }]}>
          {i18n.t('settings.sectionAppearance')}
        </ThemedText>
        <View style={[styles.row, { borderBottomColor: colors.border }]}>
          <ThemedText>{i18n.t('settings.darkMode')}</ThemedText>
          <Switch
            value={darkMode}
            onValueChange={(value) => setPreference(value ? 'dark' : 'light')}
            trackColor={{ true: colors.tint }}
          />
        </View>

        <ThemedText
          style={[styles.sectionLabel, { color: colors.textSecondary, marginTop: Spacing.xl }]}>
          {i18n.t('settings.sectionNotifications')}
        </ThemedText>
        <View style={[styles.row, { borderBottomColor: colors.border }]}>
          <ThemedText>{i18n.t('settings.pushNotifications')}</ThemedText>
          <Switch
            value={pushEnabled}
            onValueChange={setPushEnabled}
            trackColor={{ true: colors.tint }}
          />
        </View>
        <View style={[styles.row, { borderBottomColor: colors.border }]}>
          <ThemedText>{i18n.t('settings.emailNotifications')}</ThemedText>
          <Switch
            value={emailEnabled}
            onValueChange={setEmailEnabled}
            trackColor={{ true: colors.tint }}
          />
        </View>

        <ThemedText
          style={[styles.sectionLabel, { color: colors.textSecondary, marginTop: Spacing.xl }]}>
          {i18n.t('settings.sectionLanguage')}
        </ThemedText>
        <Pressable
          style={[styles.row, { borderBottomColor: colors.border }]}
          onPress={() => setShowLanguagePicker(!showLanguagePicker)}>
          <ThemedText>{i18n.t('settings.language')}</ThemedText>
          <ThemedText style={{ color: colors.textSecondary }}>{currentLanguageLabel}</ThemedText>
        </Pressable>

        {showLanguagePicker && (
          <View
            style={[
              styles.pickerList,
              { backgroundColor: colors.surface, borderColor: colors.border },
            ]}>
            {languages.map((lang) => (
              <Pressable
                key={lang.code ?? 'default'}
                style={[styles.pickerItem, { borderBottomColor: colors.border }]}
                onPress={() => handleLanguageSelect(lang.code)}>
                <ThemedText
                  style={[
                    styles.pickerText,
                    selectedLanguage === lang.code && { color: colors.tint, fontWeight: '600' },
                  ]}>
                  {lang.label}
                </ThemedText>
              </Pressable>
            ))}
          </View>
        )}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { padding: Spacing.xl },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: Spacing.md,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
  },
  pickerList: {
    borderWidth: 1,
    borderRadius: Radii.sm,
    marginTop: Spacing.sm,
  },
  pickerItem: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    borderBottomWidth: 1,
  },
  pickerText: {
    fontSize: 16,
  },
});
