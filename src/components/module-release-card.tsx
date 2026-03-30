import { ThemedText } from "@/src/components/themed-text";
import { ThemedView } from "@/src/components/themed-view";
import type { ResolvedModuleRelease } from "@/src/store/userStore";
import { StyleSheet } from "react-native";

type ModuleReleaseCardProps = {
  title?: string;
  release: ResolvedModuleRelease | null;
  downloadedBundleUri?: string | null;
};

export function ModuleReleaseCard({
  title = "当前模块版本",
  release,
  downloadedBundleUri,
}: ModuleReleaseCardProps) {
  if (!release) return null;

  return (
    <ThemedView style={styles.card}>
      <ThemedText type="subtitle">{title}</ThemedText>
      <ThemedText style={styles.row}>
        模块名：{release.moduleName || "-"}
      </ThemedText>
      <ThemedText style={styles.row}>平台：{release.platform}</ThemedText>
      <ThemedText style={styles.row}>
        版本：{release.version} ({release.buildNumber})
      </ThemedText>
      <ThemedText style={styles.row}>
        最低 App 版本：{release.minAppVersion || "-"}
      </ThemedText>
      <ThemedText style={styles.row}>
        本地缓存：{downloadedBundleUri ? "已下载" : "未下载"}
      </ThemedText>
      <ThemedText style={styles.url} numberOfLines={2}>
        包地址：{release.packageUrl}
      </ThemedText>
      {downloadedBundleUri ? (
        <ThemedText style={styles.url} numberOfLines={2}>
          本地路径：{downloadedBundleUri}
        </ThemedText>
      ) : null}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: 10,
    backgroundColor: "rgba(17, 24, 39, 0.04)",
    gap: 6,
  },
  row: {
    opacity: 0.85,
  },
  url: {
    opacity: 0.65,
    fontSize: 12,
    lineHeight: 18,
  },
});
