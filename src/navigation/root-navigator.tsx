import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
  createNavigationContainerRef,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useMemo, useState } from 'react';
import { Pressable, View } from 'react-native';

import { IconSymbol } from '@/components/ui/icon-symbol';
import i18n from '@/constants/i18n';
import { Colors, Spacing } from '@/constants/theme';
import { useThemePreference } from '@/hooks/theme-preference';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { AppDrawer, type DrawerRoute } from '@/navigation/app-drawer';
import { MainTabs } from '@/navigation/main-tabs';
import type { RootStackParamList } from '@/navigation/types';
import ActivityScreen from '@/screens/activity-screen';
import EmptyActivityScreen from '@/screens/activity/empty-activity-screen';
import ModalScreen from '@/screens/modal-screen';
import ProfileScreen from '@/screens/profile-screen';
import SettingsScreen from '@/screens/settings-screen';

const Stack = createNativeStackNavigator<RootStackParamList>();
export const navigationRef = createNavigationContainerRef<RootStackParamList>();

function HeaderIconButton({
  name,
  color,
  onPress,
  side,
}: {
  name: 'line.3.horizontal' | 'person.circle.fill' | 'chevron.left';
  color: string;
  onPress: () => void;
  side: 'left' | 'right';
}) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        marginLeft: side === 'left' ? Spacing.md : 0,
        marginRight: side === 'right' ? Spacing.md : 0,
        padding: 4,
      }}
      accessibilityRole="button">
      <IconSymbol name={name} size={name === 'person.circle.fill' ? 28 : 22} color={color} />
    </Pressable>
  );
}

function navigateFromDrawer(route: DrawerRoute) {
  if (!navigationRef.isReady()) {
    return;
  }
  if (route === 'Home') {
    navigationRef.navigate('Main');
    return;
  }
  navigationRef.navigate(route);
}

export function RootNavigator() {
  const { preference } = useThemePreference();
  const colorScheme = useColorScheme(preference);
  const colors = Colors[colorScheme];
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeDrawer, setActiveDrawer] = useState<DrawerRoute>('Home');

  const navTheme = useMemo(() => {
    const base = colorScheme === 'dark' ? DarkTheme : DefaultTheme;
    return {
      ...base,
      colors: {
        ...base.colors,
        background: colors.background,
        card: colors.background,
        text: colors.text,
        border: colors.border,
        primary: colors.tint,
      },
    };
  }, [colorScheme, colors]);

  return (
    <View style={{ flex: 1 }}>
      <NavigationContainer
        ref={navigationRef}
        theme={navTheme}
        onStateChange={() => {
          const route = navigationRef.getCurrentRoute()?.name;
          if (route === 'Main') setActiveDrawer('Home');
          if (route === 'Profile' || route === 'Activity' || route === 'Settings') {
            setActiveDrawer(route);
          }
        }}>
        <Stack.Navigator
          screenOptions={{
            headerTintColor: colors.text,
            headerStyle: { backgroundColor: colors.background },
            contentStyle: { backgroundColor: colors.background },
          }}>
          <Stack.Screen
            name="Main"
            component={MainTabs}
            options={{
              title: i18n.t('common.appName'),
              headerLeft: () => (
                <HeaderIconButton
                  name="line.3.horizontal"
                  color={colors.text}
                  side="left"
                  onPress={() => setDrawerOpen(true)}
                />
              ),
              headerRight: () => (
                <HeaderIconButton
                  name="person.circle.fill"
                  color={colors.tint}
                  side="right"
                  onPress={() => {
                    setActiveDrawer('Profile');
                    navigationRef.navigate('Profile');
                  }}
                />
              ),
            }}
          />
          <Stack.Screen
            name="Profile"
            component={ProfileScreen}
            options={{
              title: i18n.t('profile.title'),
              headerLeft: () => (
                <HeaderIconButton
                  name="chevron.left"
                  color={colors.tint}
                  side="left"
                  onPress={() => navigationRef.goBack()}
                />
              ),
            }}
          />
          <Stack.Screen
            name="Activity"
            component={ActivityScreen}
            options={{
              title: i18n.t('activity.title'),
              headerLeft: () => (
                <HeaderIconButton
                  name="chevron.left"
                  color={colors.tint}
                  side="left"
                  onPress={() => navigationRef.goBack()}
                />
              ),
            }}
          />
          <Stack.Screen
            name="Settings"
            component={SettingsScreen}
            options={{
              title: i18n.t('settings.title'),
              headerLeft: () => (
                <HeaderIconButton
                  name="chevron.left"
                  color={colors.tint}
                  side="left"
                  onPress={() => navigationRef.goBack()}
                />
              ),
            }}
          />
          <Stack.Screen name="Messages" options={{ title: i18n.t('activity.messagesTitle') }}>
            {() => <EmptyActivityScreen message={i18n.t('activity.emptyMessages')} />}
          </Stack.Screen>
          <Stack.Screen
            name="Transactions"
            options={{ title: i18n.t('activity.transactionsTitle') }}>
            {() => <EmptyActivityScreen message={i18n.t('activity.emptyTransactions')} />}
          </Stack.Screen>
          <Stack.Screen
            name="SecurityHistory"
            options={{ title: i18n.t('activity.securityTitle') }}>
            {() => <EmptyActivityScreen message={i18n.t('activity.emptySecurity')} />}
          </Stack.Screen>
          <Stack.Screen
            name="Modal"
            component={ModalScreen}
            options={{
              presentation: 'modal',
              title: i18n.t('modal.title'),
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>

      <AppDrawer
        open={drawerOpen}
        active={activeDrawer}
        onClose={() => setDrawerOpen(false)}
        onNavigate={(route) => {
          setActiveDrawer(route);
          navigateFromDrawer(route);
        }}
      />
    </View>
  );
}
