import "@/global.css";
import { defaultConfig } from "@tamagui/config/v4";
import { createTamagui, TamaguiProvider } from "@tamagui/core";
import { Stack } from "expo-router";

import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

const config = createTamagui(defaultConfig);

type Conf = typeof config;

declare module "@tamagui/core" {
  interface TamaguiCustomConfig extends Conf {}
}

export default function RootLayout() {
  return (
    <TamaguiProvider config={config}>
      <Stack>
        {/* ==================== 公共模块 ==================== */}
        {/* 首页 */}
        <Stack.Screen name="index" options={{ headerShown: false }} />

        {/* 登录 */}
        <Stack.Screen name="login" options={{ headerShown: false }} />

        {/* ==================== 业务模块 ==================== */}
        {/* 模块A - 位置模拟功能 */}
        <Stack.Screen name="moduleA" options={{ headerShown: false }} />

        {/* 模块B - 商务功能 */}
        <Stack.Screen name="moduleB" options={{ headerShown: false }} />

        {/* 模块C - 目标功能 */}
        <Stack.Screen name="moduleC" options={{ headerShown: false }} />

        {/* ==================== 工具组件 ==================== */}
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
