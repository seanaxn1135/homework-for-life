import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { Platform, StatusBar } from 'react-native';
import TodayScreen from './src/screens/TodayScreen';
import EntriesScreen from './src/screens/EntriesScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import { RootTabParamList } from './src/navigation/types';
import { colors } from './src/theme/colors';
import { useFonts } from "expo-font";
import { Inter_400Regular, Inter_500Medium } from "@expo-google-fonts/inter";
import { Palanquin_300Light } from "@expo-google-fonts/palanquin";

const Tab = createBottomTabNavigator<RootTabParamList>();

export default function App() {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Palanquin_300Light,
    Inter_500Medium
  });
  if (!fontsLoaded) {
    return null;
  }

  return (
    <NavigationContainer>
      <StatusBar
        backgroundColor={colors.background}
        barStyle="dark-content"
      />
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName: React.ComponentProps<typeof Ionicons>['name'] = 'alert-circle-outline';
            if (route.name === 'Today') {
              iconName = focused ? 'create' : 'create-outline';
            } else if (route.name === 'Entries') {
              iconName = focused ? 'list' : 'list-outline';
            } else if (route.name === 'Settings') {
              iconName = focused ? 'settings' : 'settings-outline';
            }
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.textSubtle,
          tabBarStyle: { 
            backgroundColor: colors.background,
            borderTopColor: colors.border,
            borderTopWidth: 1,
            elevation: 0,
          },
          tabBarPressColor: 'transparent',
          tabBarPressOpacity: 1,
          headerStyle: { 
            backgroundColor: colors.primary,
          },
          headerTintColor: colors.buttonPrimaryText,
          headerTitleStyle: { 
            fontWeight: 'bold',
            color: colors.buttonPrimaryText,
          },
        })}
      >
        <Tab.Screen
          name="Today"
          component={TodayScreen}
          options={{
            headerShown: false,
            tabBarAccessibilityLabel: "Today Tab",
          }}
        />
        <Tab.Screen
          name="Entries"
          component={EntriesScreen}
          options={{
            title: 'My Moments',
            tabBarAccessibilityLabel: "Entries Tab",
          }}
        />
        <Tab.Screen
          name="Settings"
          component={SettingsScreen}
          options={{
            title: 'Settings',
            tabBarAccessibilityLabel: "Settings Tab",
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}