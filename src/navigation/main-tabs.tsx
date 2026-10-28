import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { IconSymbol } from '@/components/ui/icon-symbol';
import i18n from '@/constants/i18n';
import { Colors } from '@/constants/theme';
import { useThemePreference } from '@/hooks/theme-preference';
import { useColorScheme } from '@/hooks/use-color-scheme';
import type { MainTabParamList } from '@/navigation/types';
import AboutScreen from '@/screens/about-screen';
import HomeScreen from '@/screens/home-screen';

const Tab = createBottomTabNavigator<MainTabParamList>();
const TAB_ICON_SIZE = 28;

export function MainTabs() {
  const { preference } = useThemePreference();
  const colorScheme = useColorScheme(preference);

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors[colorScheme].tint,
        tabBarInactiveTintColor: Colors[colorScheme].tabIconDefault,
        tabBarStyle: {
          backgroundColor: Colors[colorScheme].background,
          borderTopColor: Colors[colorScheme].border,
        },
      }}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: i18n.t('tabs.home'),
          tabBarIcon: ({ color }) => (
            <IconSymbol size={TAB_ICON_SIZE} name="house.fill" color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="About"
        component={AboutScreen}
        options={{
          title: i18n.t('tabs.about'),
          tabBarIcon: ({ color }) => (
            <IconSymbol size={TAB_ICON_SIZE} name="info.circle.fill" color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
