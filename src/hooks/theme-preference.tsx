import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

type ThemePreference = 'light' | 'dark' | null;

type ThemePreferenceContextValue = {
  preference: ThemePreference;
  setPreference: (value: ThemePreference) => Promise<void>;
  ready: boolean;
};

const STORAGE_KEY = '@app_theme_preference';

const ThemePreferenceContext = createContext<ThemePreferenceContextValue | null>(null);

export function ThemePreferenceProvider({ children }: { children: ReactNode }) {
  const [preference, setPreferenceState] = useState<ThemePreference>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((stored) => {
        if (stored === 'light' || stored === 'dark') {
          setPreferenceState(stored);
        }
      })
      .finally(() => setReady(true));
  }, []);

  const setPreference = useCallback(async (value: ThemePreference) => {
    setPreferenceState(value);
    if (value) {
      await AsyncStorage.setItem(STORAGE_KEY, value);
    } else {
      await AsyncStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const value = useMemo(
    () => ({ preference, setPreference, ready }),
    [preference, setPreference, ready],
  );

  return <ThemePreferenceContext.Provider value={value}>{children}</ThemePreferenceContext.Provider>;
}

export function useThemePreference() {
  const ctx = useContext(ThemePreferenceContext);
  if (!ctx) {
    throw new Error('useThemePreference must be used within ThemePreferenceProvider');
  }
  return ctx;
}
