import "@/global.css";
import { defaultConfig } from "@tamagui/config/v4";
import { createTamagui, TamaguiProvider } from "@tamagui/core";
import { Stack } from "expo-router";

import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

// you usually export this from a tamagui.config.ts file
const config = createTamagui(defaultConfig);

type Conf = typeof config;

// make imports typed
declare module "@tamagui/core" {
  interface TamaguiCustomConfig extends Conf {}
}
export default function RootLayout() {
  return (
    <TamaguiProvider config={config}>
      <Stack>
        {/* 首页 - 模块A预览 */}
        <Stack.Screen name="index" options={{ headerShown: false }} />

        {/* 登录页 */}
        <Stack.Screen name="login" options={{ headerShown: false }} />

        {/* 三个主要模块 */}
        <Stack.Screen name="moduleA/index" options={{ headerShown: false }} />
        <Stack.Screen name="moduleB/index" options={{ headerShown: false }} />
        <Stack.Screen name="moduleC/index" options={{ headerShown: false }} />

        {/* 地图选择器 */}
        <Stack.Screen name="map-picker" options={{ headerShown: false }} />

        {/* 模态框 */}
        <Stack.Screen
          name="modal"
          options={{ presentation: "modal", title: "Modal" }}
        />
      </Stack>
      <StatusBar style="auto" />
    </TamaguiProvider>
  );
}
