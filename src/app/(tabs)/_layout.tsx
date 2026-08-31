import React from 'react';
import { Tabs } from 'expo-router';
import { Platform, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '@/features/theme/useThemeSettings';
import { BorderRadius } from '@/constants/theme';

export default function TabLayout() {
  const { theme } = useAppTheme();
  const insets = useSafeAreaInsets();

  // Responsive bottom lift to clear software navigation buttons and home indicators
  const bottomLift = Math.max(insets.bottom, 10) + 6;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarActiveTintColor: theme.tabBarActive,
        tabBarInactiveTintColor: theme.tabBarInactive,
        tabBarStyle: {
          position: 'absolute',
          bottom: bottomLift,
          left: 16,
          right: 16,
          height: 64,
          backgroundColor: theme.tabBarBg,
          borderRadius: 24,
          borderWidth: 1,
          borderColor: theme.tabBarBorder,
          paddingTop: 8,
          paddingBottom: 8,
          elevation: 12,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: 0.35,
          shadowRadius: 12,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '700',
          marginTop: 2,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Clock',
          tabBarIcon: ({ color, focused }) => (
            <View style={focused ? [styles.activePill, { backgroundColor: theme.primaryGlow }] : null}>
              <Ionicons name={focused ? 'globe' : 'globe-outline'} size={21} color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="alarm"
        options={{
          title: 'Alarms',
          tabBarIcon: ({ color, focused }) => (
            <View style={focused ? [styles.activePill, { backgroundColor: theme.primaryGlow }] : null}>
              <Ionicons name={focused ? 'alarm' : 'alarm-outline'} size={21} color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="stopwatch"
        options={{
          title: 'Stopwatch',
          tabBarIcon: ({ color, focused }) => (
            <View style={focused ? [styles.activePill, { backgroundColor: theme.primaryGlow }] : null}>
              <Ionicons name={focused ? 'timer' : 'timer-outline'} size={21} color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="timer"
        options={{
          title: 'Timer',
          tabBarIcon: ({ color, focused }) => (
            <View style={focused ? [styles.activePill, { backgroundColor: theme.primaryGlow }] : null}>
              <Ionicons name={focused ? 'hourglass' : 'hourglass-outline'} size={21} color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, focused }) => (
            <View style={focused ? [styles.activePill, { backgroundColor: theme.primaryGlow }] : null}>
              <Ionicons name={focused ? 'settings' : 'settings-outline'} size={21} color={color} />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  activePill: {
    paddingHorizontal: 12,
    paddingVertical: 3,
    borderRadius: BorderRadius.full,
  },
});
