import { Pressable, StyleSheet, View, useWindowDimensions } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { IconSymbol, type IconSymbolName } from '@/components/ui/icon-symbol';
import i18n from '@/constants/i18n';
import { Colors, Spacing } from '@/constants/theme';
import { useThemePreference } from '@/hooks/theme-preference';
import { useColorScheme } from '@/hooks/use-color-scheme';

export type DrawerRoute = 'Home' | 'Profile' | 'Activity' | 'Settings';

type DrawerItem = {
  key: DrawerRoute;
  label: string;
  icon: IconSymbolName;
  hidden?: boolean;
};

type Props = {
  open: boolean;
  active: DrawerRoute;
  onClose: () => void;
  onNavigate: (route: DrawerRoute) => void;
};

const ITEMS: DrawerItem[] = [
  { key: 'Home', label: i18n.t('tabs.home'), icon: 'house.fill', hidden: true },
  { key: 'Profile', label: i18n.t('drawer.profile'), icon: 'person.circle.fill' },
  { key: 'Activity', label: i18n.t('drawer.activity'), icon: 'clock.arrow.circlepath' },
  { key: 'Settings', label: i18n.t('drawer.settings'), icon: 'gearshape.fill' },
];

export function AppDrawer({ open, active, onClose, onNavigate }: Props) {
  const { width } = useWindowDimensions();
  const { preference } = useThemePreference();
  const colorScheme = useColorScheme(preference);
  const colors = Colors[colorScheme];
  const drawerWidth = Math.min(320, width * 0.82);

  if (!open) {
    return null;
  }

  return (
    <View style={styles.overlay} pointerEvents="box-none">
      <Pressable style={styles.backdrop} onPress={onClose} accessibilityLabel="Close menu" />
      <View
        style={[
          styles.drawer,
          {
            width: drawerWidth,
            backgroundColor: colors.background,
            borderRightColor: colors.border,
          },
        ]}>
        <View style={[styles.drawerHeader, { borderBottomColor: colors.border }]}>
          <ThemedText style={styles.drawerTitle}>{i18n.t('common.appName')}</ThemedText>
        </View>

        {ITEMS.filter((item) => !item.hidden).map((item) => {
          const selected = active === item.key;
          return (
            <Pressable
              key={item.key}
              style={[
                styles.item,
                selected && { backgroundColor: colors.surface },
              ]}
              onPress={() => {
                onNavigate(item.key);
                onClose();
              }}>
              <IconSymbol
                name={item.icon}
                size={22}
                color={selected ? colors.tint : colors.textSecondary}
              />
              <ThemedText
                style={[
                  styles.itemLabel,
                  { color: selected ? colors.tint : colors.text },
                ]}>
                {item.label}
              </ThemedText>
            </Pressable>
          );
        })}

        <View style={[styles.separator, { borderBottomColor: colors.border }]} />

        <Pressable style={[styles.item, { opacity: 0.6 }]} onPress={() => {}}>
          <IconSymbol
            name="rectangle.portrait.and.arrow.right"
            size={22}
            color={colors.textSecondary}
          />
          <ThemedText style={[styles.itemLabel, { color: colors.textSecondary }]}>
            {i18n.t('drawer.logout')}
          </ThemedText>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 40,
    flexDirection: 'row',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  drawer: {
    height: '100%',
    borderRightWidth: 1,
    paddingTop: Spacing.md,
    zIndex: 41,
  },
  drawerHeader: {
    padding: Spacing.lg,
    borderBottomWidth: 1,
    marginBottom: Spacing.sm,
  },
  drawerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
  },
  itemLabel: {
    fontSize: 16,
  },
  separator: {
    borderBottomWidth: 1,
    marginHorizontal: Spacing.md,
    marginVertical: Spacing.sm,
  },
});
