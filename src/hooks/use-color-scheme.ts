import { useEffect, useState } from 'react';
import { useColorScheme as useRNColorScheme } from 'react-native';

/**
 * Prefer an explicit preference when set; otherwise follow the system scheme.
 * Hydrate on the client so static web renders do not flash the wrong theme.
 */
export function useColorScheme(override?: 'light' | 'dark' | null) {
  const [hasHydrated, setHasHydrated] = useState(false);
  const systemScheme = useRNColorScheme();

  useEffect(() => {
    setHasHydrated(true);
  }, []);

  if (override === 'light' || override === 'dark') {
    return override;
  }

  if (!hasHydrated) {
    return 'light';
  }

  return systemScheme ?? 'light';
}
