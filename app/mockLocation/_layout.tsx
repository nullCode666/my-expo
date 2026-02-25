import Header from "@/components/header";
import { Stack } from "expo-router";

export default function ModuleALayout() {
  return (
    <Stack screenOptions={{ headerShown: true }}>
      {/* 模块A首页 */}
      <Stack.Screen
        name="index"
        options={{
          header: () => <Header title="mockLocation" />,
        }}
      />

      {/* 模块A的其他子页面 */}
      {/* 例如:
      <Stack.Screen name="settings" />
      <Stack.Screen name="history" />
      */}
    </Stack>
  );
}
