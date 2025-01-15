import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        // headerTitleAlign: "center",
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            elevation: 5,
          },
          default: {backgroundColor: 'white',},
        }),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="groceries"
        options={{
          title: 'Fridge',
          tabBarIcon: ({ color }) => <MaterialCommunityIcons name="food-apple-outline" size={28} color={color}/>,
        }}
      />

        <Tabs.Screen
        name="calendar"
        options={{
          title: 'Calendar',
          tabBarIcon: ({ color }) => <AntDesign name="calendar" size={24} color={color} />,
        }}
      />

      <Tabs.Screen
        name="meals"
        options={{
          title: 'menu',
          tabBarIcon: ({ color }) => <MaterialIcons name="restaurant-menu" size={24} color={color} />
            // <AntDesign name="calendar" size={24} color={color} />,
          
        }}
      />
    </Tabs>
  );
}
