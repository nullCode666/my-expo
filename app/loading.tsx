import ParallaxScrollView from "@/src/components/parallax-scroll-view";
import { ThemedText } from "@/src/components/themed-text";
import { ThemedView } from "@/src/components/themed-view";
import { prepareModuleBundle } from "@/src/services/moduleBundle";
import { resolveModuleRoute } from "@/src/services/moduleResolver";
import { useUserStore } from "@/src/store/userStore";
import * as Updates from "expo-updates";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

const FALLBACK_UPDATES_URL =
  process.env.EXPO_PUBLIC_UPDATES_FALLBACK_URL?.trim() ||
  "https://example.com/api/updates";

export default function LoadingScreen() {
  const router = useRouter();
  const {
    secretKey,
    isValidKey,
    release,
    setDownloadState,
    userType,
  } = useUserStore();

  useEffect(() => {
    let cancelled = false;

    async function run() {
      if (!isValidKey || !release || !userType) {
        router.replace("/login");
        return;
      }

      const route = resolveModuleRoute(userType);
      if (!route) {
        setDownloadState({
          downloadStatus: "error",
          error: "模块尚未在当前 App 中注册",
        });
        router.replace("/login");
        return;
      }

      try {
        setDownloadState({
          downloadStatus: "downloading",
          downloadedBundleUri: null,
          error: null,
        });

        if (Updates.isEnabled) {
          try {
            Updates.setUpdateURLAndRequestHeadersOverride({
              updateUrl: release.packageUrl || FALLBACK_UPDATES_URL,
              requestHeaders: {
                "x-api-key": secretKey,
                "x-module-name": release.moduleName || userType,
              },
            });
            const checkResult = await Updates.checkForUpdateAsync();

            if ("isAvailable" in checkResult && checkResult.isAvailable) {
              await Updates.fetchUpdateAsync();
              await Updates.reloadAsync();
              return;
            }
          } catch {
            // Fall through to local file cache while the update server is not ready.
          }
        }

        const result = await prepareModuleBundle(release);
        if (cancelled) return;

        setDownloadState({
          downloadedBundleUri: result.bundleUri,
          downloadStatus: "ready",
          error: null,
        });
        router.replace(route as any);
      } catch (error) {
        if (cancelled) return;

        const message =
          error instanceof Error ? error.message : "模块包下载失败";
        setDownloadState({
          downloadStatus: "error",
          error: message,
        });
        router.replace("/login");
      }
    }

    run();

    return () => {
      cancelled = true;
    };
  }, [isValidKey, release, router, secretKey, setDownloadState, userType]);

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#667eea", dark: "#3f3d99" }}
      headerImage={
        <View style={styles.headerContent}>
          <ThemedText type="title" style={styles.headerTitle}>
            模块加载中
          </ThemedText>
        </View>
      }
    >
      <ThemedView style={styles.container}>
        <ActivityIndicator size="large" color="#667eea" />
        <ThemedText type="subtitle">正在下载模块包</ThemedText>
        <ThemedText style={styles.description}>
          验证通过后会先将目标模块下载到本地缓存，再进入模块页面。
        </ThemedText>
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
    textAlign: "center",
  },
  container: {
    padding: 24,
    alignItems: "center",
    gap: 16,
  },
  description: {
    textAlign: "center",
    opacity: 0.72,
    lineHeight: 20,
  },
});
