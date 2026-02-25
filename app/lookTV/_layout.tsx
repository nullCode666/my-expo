import Header from "@/components/header";
import { Stack } from "expo-router";

export default function ModuleBLayout() {
  return (
    <Stack screenOptions={{ headerShown: true }}>
      <Stack.Screen
        name="index"
        options={{
          header: () => <Header title="请选择看电视的平台" />,
        }}
      />

      {/* 模块B的其他子页面 */}
    </Stack>
  );
}
