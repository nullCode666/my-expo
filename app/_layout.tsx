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
    <TamaguiProvider config={config} defaultTheme="light">
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        {/* ==================== 公共模块 ==================== */}
        {/* 首页 */}
        <Stack.Screen name="index" />

        {/* 登录 */}
        <Stack.Screen name="login" />

        {/* ==================== 业务模块 ==================== */}
        {/* 模块A - 位置模拟功能 */}
        <Stack.Screen name="mockLocation" />

        {/* 模块B - 商务功能 */}
        <Stack.Screen name="lookTV" />

        {/* 模块C - 目标功能 */}
        <Stack.Screen name="moduleC" />

        {/* ==================== 工具组件 ==================== */}
        {/* 地图选择器 */}
        <Stack.Screen name="map-picker" />

        {/* 模态框 */}
        <Stack.Screen name="modal" />

        {/* WebView */}
        <Stack.Screen name="webview" />
      </Stack>
      <StatusBar style="auto" />
    </TamaguiProvider>
  );
}
