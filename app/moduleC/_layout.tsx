import { Stack } from "expo-router";

export default function ModuleCLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* 模块C首页 */}
      <Stack.Screen name="index" />
      
      {/* 模块C的其他子页面 */}
    </Stack>
  );
}
