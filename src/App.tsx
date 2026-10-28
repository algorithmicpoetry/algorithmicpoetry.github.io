import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { enableScreens } from 'react-native-screens';

import i18n, { loadLanguagePreference } from '@/constants/i18n';
import { Colors } from '@/constants/theme';
import { ThemePreferenceProvider, useThemePreference } from '@/hooks/theme-preference';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { RootNavigator } from '@/navigation/root-navigator';

enableScreens();

function Bootstrap() {
  const { ready, preference } = useThemePreference();
  const colorScheme = useColorScheme(preference);
  const [i18nReady, setI18nReady] = useState(false);

  useEffect(() => {
    loadLanguagePreference().then(() => setI18nReady(true));
  }, []);

  // Touch i18n so locale changes can be observed later.
  void i18n.locale;

  if (!ready || !i18nReady) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: Colors[colorScheme].background,
        }}>
        <ActivityIndicator color={Colors[colorScheme].tint} />
      </View>
    );
  }

  return <RootNavigator />;
}

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemePreferenceProvider>
        <Bootstrap />
      </ThemePreferenceProvider>
    </SafeAreaProvider>
  );
}
