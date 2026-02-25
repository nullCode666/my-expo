import { Stack } from "expo-router";

export default function ModuleALayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* 模块A首页 */}
      <Stack.Screen name="index" />
      
      {/* 模块A的其他子页面 */}
      {/* 例如:
      <Stack.Screen name="settings" />
      <Stack.Screen name="history" />
      */}
    </Stack>
  );
}
