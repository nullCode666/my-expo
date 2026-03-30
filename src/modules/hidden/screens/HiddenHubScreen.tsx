import ParallaxScrollView from "@/components/parallax-scroll-view";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { getAccessibleHiddenModules, hasAppAccess } from "@/src/modules/access";
import { getModulesByVisibility } from "@/src/modules/registry";
import { useUserStore } from "@/src/store/userStore";
import { useRouter } from "expo-router";
import { StyleSheet, TouchableOpacity, View } from "react-native";

export default function HiddenHubScreen() {
  const router = useRouter();
  const { isValidKey } = useUserStore();
  const isDev = __DEV__;

  const allowHidden = hasAppAccess(isDev, isValidKey);
  const hiddenModules = getAccessibleHiddenModules(
    getModulesByVisibility("hidden"),
    isDev,
    isValidKey,
  ).filter((m) => m.route !== "/hidden");

  if (!allowHidden) {
    return (
      <ThemedView style={styles.center}>
        <ThemedText type="title">不可访问</ThemedText>
        <ThemedText style={styles.desc}>
          隐藏模块仅在开发环境或密钥验证后可访问。
        </ThemedText>
        <TouchableOpacity style={styles.button} onPress={() => router.replace("/login")}>
          <ThemedText style={styles.buttonText}>去验证密钥</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    );
  }

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#111827", dark: "#000000" }}
      headerImage={
        <View style={styles.headerContent}>
          <ThemedText type="title" style={styles.headerTitle}>
            隐藏模块
          </ThemedText>
        </View>
      }
    >
      <ThemedView style={styles.container}>
        {hiddenModules.length === 0 ? (
          <ThemedView style={styles.emptyState}>
            <ThemedText type="subtitle">当前没有可用隐藏模块</ThemedText>
            <ThemedText style={styles.desc}>
              仅开发环境展示 `devOnly` 模块。
            </ThemedText>
          </ThemedView>
        ) : (
          hiddenModules.map((m) => (
            <TouchableOpacity
              key={m.id}
              style={styles.card}
              onPress={() => router.push(m.route as any)}
            >
              <ThemedText type="subtitle">{m.title}</ThemedText>
              <ThemedText style={styles.desc}>{m.subtitle ?? ""}</ThemedText>
            </TouchableOpacity>
          ))
        )}
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerContent: {
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
    gap: 12,
  },
  card: {
    padding: 16,
    borderRadius: 10,
    backgroundColor: "rgba(17, 24, 39, 0.06)",
    gap: 6,
  },
  emptyState: {
    padding: 16,
    borderRadius: 10,
    backgroundColor: "rgba(17, 24, 39, 0.04)",
    gap: 6,
  },
  desc: {
    opacity: 0.7,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    gap: 12,
  },
  button: {
    backgroundColor: "#667eea",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },
});
