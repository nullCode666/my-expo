import ParallaxScrollView from "@/components/parallax-scroll-view";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useRouter } from "expo-router";
import { Button, StyleSheet, View } from "react-native";

export default function CustomModuleScreen() {
  const router = useRouter();
  const isDev = __DEV__;

  if (!isDev) {
    return (
      <ThemedView style={styles.center}>
        <ThemedText type="title">不可访问</ThemedText>
        <ThemedText style={styles.desc}>该模块仅用于定制开发。</ThemedText>
        <Button title="返回首页" onPress={() => router.replace("/")} />
      </ThemedView>
    );
  }

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#667eea", dark: "#764ba2" }}
      headerImage={
        <View style={styles.header}>
          <ThemedText type="title" style={styles.headerTitle}>
            定制化模块
          </ThemedText>
        </View>
      }
    >
      <ThemedView style={styles.container}>
        <ThemedText type="subtitle">这里用于放“客户定制/特定功能”</ThemedText>
        <ThemedText style={styles.desc}>
          建议按功能拆到 `src/modules/custom/*`，并通过模块注册表控制启用/隐藏。
        </ThemedText>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  header: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  headerTitle: {
    color: "#fff",
  },
  container: {
    padding: 20,
    gap: 10,
  },
  desc: {
    opacity: 0.75,
    lineHeight: 18,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    gap: 12,
  },
});

