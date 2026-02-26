import { useRouter } from "expo-router";
import { useState } from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { WebView } from "react-native-webview";

interface AnalysisButtonProps {
  currentUrl: string;
  currentTitle?: string;
  webViewRef?: React.RefObject<WebView<{}> | null>;
}

// 解析源列表
const analysisSources = [
  {
    name: "解析源 A",
    url: "https://jx.xmflv.com/?url=",
    injectedJavaScript: "",
  },
  {
    name: "解析源 B",
    url: "https://jx.bozrc.com:4433/player/?url=",
    injectedJavaScript: "",
  },
  {
    name: "解析源 C",
    url: "https://www.yemu.xyz/?url=",
    injectedJavaScript: "",
  },
  {
    name: "解析源 D",
    url: "https://jx.xmflv.com/?url=",
    injectedJavaScript: "",
  },
];

export default function AnalysisButton({
  currentUrl,
  currentTitle,
  webViewRef,
}: AnalysisButtonProps) {
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);

  const handleSelectAnalysis = (analysis: { name: string; url: string }) => {
    setModalVisible(false);

    // 拼接解析 URL
    const parsedUrl = analysis.url + encodeURIComponent(currentUrl);

    // 如果有 webViewRef，直接在 WebView 中加载新 URL
    if (webViewRef?.current) {
      webViewRef.current.injectJavaScript(`
        window.location.href = "${parsedUrl}";
        true;
      `);
    } else {
      // 否则使用路由跳转
      const newTitle = currentTitle
        ? `${currentTitle} - ${analysis.name}`
        : analysis.name;
      router.replace({
        pathname: "/webview",
        params: {
          url: parsedUrl,
          name: newTitle,
        },
      });
    }
  };

  return (
    <>
      <TouchableOpacity
        style={styles.button}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.buttonText}>解析</Text>
      </TouchableOpacity>

      {/* 解析源选择 Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
        >
          <TouchableOpacity activeOpacity={1} style={styles.modalContent}>
            <View style={styles.modalCard}>
              <Text style={styles.modalTitle}>选择解析源</Text>
              <Text style={styles.modalSubtitle}>
                {currentTitle || currentUrl}
              </Text>

              {analysisSources.map((analysis, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.analysisItem}
                  onPress={() => handleSelectAnalysis(analysis)}
                >
                  <Text style={styles.analysisText}>{analysis.name}</Text>
                </TouchableOpacity>
              ))}

              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelText}>取消</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#FF6B6B",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  buttonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "80%",
    maxWidth: 300,
  },
  modalCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 16,
  },
  analysisItem: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 8,
  },
  analysisText: {
    fontSize: 16,
    color: "#333",
  },
  cancelButton: {
    padding: 12,
    alignItems: "center",
    marginTop: 8,
  },
  cancelText: {
    color: "#999",
    fontSize: 16,
  },
});
