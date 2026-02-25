import { Stack } from "expo-router";

export default function ModuleBLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* 模块B首页 */}
      <Stack.Screen name="index" />
      
      {/* 模块B的其他子页面 */}
    </Stack>
  );
}
