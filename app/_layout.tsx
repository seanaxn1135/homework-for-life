import React, { useEffect } from 'react';
import { Stack } from 'expo-router/stack';
import '../global.css';
import { useFonts } from 'expo-font';
import {
  LexendDeca_400Regular,
  LexendDeca_500Medium,
} from '@expo-google-fonts/lexend-deca';
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();

export default function Layout() {
  const [fontsLoaded] = useFonts({
    'LexendDeca-Regular': LexendDeca_400Regular,
    'LexendDeca-Medium': LexendDeca_500Medium,
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }}/>
    </Stack>
  );
}
