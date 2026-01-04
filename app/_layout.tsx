import { defaultConfig } from '@tamagui/config/v4';
import { createTamagui, TamaguiProvider } from '@tamagui/core';
import { Stack } from 'expo-router';

import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

// you usually export this from a tamagui.config.ts file
const config = createTamagui(defaultConfig)

type Conf = typeof config

// make imports typed
declare module '@tamagui/core' {
  interface TamaguiCustomConfig extends Conf { }
}
export default function RootLayout() {

  return (
    <TamaguiProvider config={config}>
      <Stack>
                <Stack.Screen name="moduleA/index" options={{ headerShown: false }} />

        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
        <Stack.Screen name="moduleB/index" options={{ headerShown: false }} />
        <Stack.Screen name="moduleC/index" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="auto" />
    </TamaguiProvider>
  );
}
