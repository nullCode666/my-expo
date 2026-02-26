import AnalysisButton from "@/components/analysis-button";
import Header from "@/components/header";
import { useLocalSearchParams } from "expo-router";
import { useRef, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { WebView, WebViewNavigation } from "react-native-webview";

export default function WebViewScreen() {
  const { url, name, injectedJavaScript } = useLocalSearchParams<{
    url: string;
    name?: string;
    injectedJavaScript?: string;
  }>();
  const [loading, setLoading] = useState(true);
  const [currentUrl, setCurrentUrl] = useState("");
  const webViewRef = useRef<WebView>(null);

  if (!url) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>缺少 URL 参数</Text>
      </View>
    );
  }

  const decodedUrl = decodeURIComponent(url);
  const initialUrl = currentUrl || decodedUrl;

  console.log(initialUrl);

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
        onLoadStart={() => setLoading(false)}
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
