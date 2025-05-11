import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import TodayScreen from './screens/TodayScreen';
import EntriesScreen from './screens/EntriesScreen';
import SettingsScreen from './screens/SettingsScreen';
import { RootTabParamList } from './navigation/types';

const Tab = createBottomTabNavigator<RootTabParamList>();

export default function App() {
  return (
    <NavigationContainer>
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
          tabBarActiveTintColor: '#4A90E2',
          tabBarInactiveTintColor: 'gray',
          tabBarStyle: { backgroundColor: '#ffffff' },
          headerStyle: { backgroundColor: '#4A90E2' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
        })}
      >
        <Tab.Screen
          name="Today"
          component={TodayScreen}
          options={{
            title: "Today's Moment",
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