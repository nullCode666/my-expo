import AnalysisButton from "@/components/analysis-button";
import { Header } from "@/components/header";
import { canAccessModuleRoute, hasAppAccess } from "@/src/modules/access";
import { useUserStore } from "@/src/store/userStore";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { WebView, WebViewNavigation } from "react-native-webview";

export default function WebViewScreen() {
  const router = useRouter();
  const { isValidKey, userType } = useUserStore();
  const { url, name, injectedJavaScript } = useLocalSearchParams<{
    url: string;
    name?: string;
    injectedJavaScript?: string;
  }>();
  const [loading, setLoading] = useState(true);
  const [currentUrl, setCurrentUrl] = useState("");
  const webViewRef = useRef<WebView>(null);
  const decodedUrl = url ? decodeURIComponent(url) : "";
  const initialUrl = currentUrl || decodedUrl;
  const isDev = __DEV__;
  const canAccessCurrentModule = canAccessModuleRoute("/lookTV", {
    isDev,
    isValidKey,
    userType,
  });

  useEffect(() => {
    if (canAccessCurrentModule) return;

    router.replace(hasAppAccess(isDev, isValidKey) ? "/" : "/login");
  }, [canAccessCurrentModule, isDev, isValidKey, router]);

  if (!url) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>缺少 URL 参数</Text>
      </View>
    );
  }

  if (!canAccessCurrentModule) {
    return null;
  }

  // 处理导航状态变化，获取当前 URL
  const handleNavigationStateChange = (navState: WebViewNavigation) => {
    setCurrentUrl(navState.url);
  };

  // 右侧解析按钮
  const RightComponent = () => (
    <AnalysisButton
      currentUrl={initialUrl}
      currentTitle={name}
      webViewRef={webViewRef}
    />
  );

  return (
    <View style={styles.container}>
      <Header title={name} rightComponent={<RightComponent />} />
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF6B6B" />
          <Text style={styles.loadingText}>正在加载...</Text>
        </View>
      )}
      <WebView
        ref={webViewRef}
        source={{ uri: decodedUrl }}
        style={styles.webview}
        onLoadStart={() => setLoading(true)}
        onLoadEnd={() => setLoading(false)}
        onNavigationStateChange={handleNavigationStateChange}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        allowsInlineMediaPlayback={true}
        mediaPlaybackRequiresUserAction={false}
        startInLoadingState={true}
        scalesPageToFit={true}
        injectedJavaScript={injectedJavaScript}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  webview: {
    flex: 1,
  },
  loadingContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    zIndex: 1,
  },
  loadingText: {
    marginTop: 10,
    color: "#666",
    fontSize: 14,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  errorText: {
    color: "#ff4444",
    fontSize: 16,
  },
});
