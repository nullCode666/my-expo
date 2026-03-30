import ParallaxScrollView from "@/src/components/parallax-scroll-view";
import { ThemedText } from "@/src/components/themed-text";
import { ThemedView } from "@/src/components/themed-view";
import {
  getUpgradeUrl,
  resolveModuleByKey,
} from "@/src/services/moduleResolver";
import { useUserStore } from "@/src/store/userStore";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Linking,
  Platform,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function LoginScreen() {
  const [secretKey, setSecretKey] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();
  const { setSecretKey: setStoreKey, applyResolvedModule, setError, reset } =
    useUserStore();

  const openUpgrade = async () => {
    const upgradeUrl = getUpgradeUrl();
    if (!upgradeUrl) {
      Alert.alert("需要升级 App", "请联系管理员获取最新安装包。");
      return;
    }

    try {
      await Linking.openURL(upgradeUrl);
    } catch {
      Alert.alert("打开升级地址失败", upgradeUrl);
    }
  };

  const handleSubmit = async () => {
    if (!secretKey.trim()) {
      Alert.alert("错误", "请输入密钥");
      return;
    }

    setSubmitting(true);
    setStoreKey(secretKey);

    try {
      const result = await resolveModuleByKey(secretKey);

      if (!result.valid) {
        setError(result.message ?? "无效的密钥");
        Alert.alert("错误", result.message ?? "无效的密钥，请重试");
        return;
      }

      if (result.deliveryType !== "module" || !result.moduleName || !result.route) {
        reset();
        Alert.alert(
          "暂不支持",
          "当前卡密不是模块卡密，或模块尚未在 App 中注册。",
        );
        return;
      }

      if (result.compatibility?.upgradeRequired) {
        applyResolvedModule({
          secretKey: secretKey.trim(),
          moduleName: result.moduleName,
          deliveryType: result.deliveryType,
          release: result.release ?? null,
          compatibility: result.compatibility,
        });

        Alert.alert(
          "需要升级 App",
          result.message ??
            `当前模块至少需要 App ${result.compatibility.minAppVersion} 才能使用。`,
          [
            {
              text: "取消",
              style: "cancel",
              onPress: () => reset(),
            },
            {
              text: "立即升级",
              onPress: openUpgrade,
            },
          ],
        );
        return;
      }

      applyResolvedModule({
        secretKey: secretKey.trim(),
        moduleName: result.moduleName,
        deliveryType: result.deliveryType,
        release: result.release ?? null,
        compatibility: result.compatibility ?? null,
      });
      router.replace("/loading");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "卡密解析失败，请稍后重试";
      setError(message);
      Alert.alert("错误", message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.keyboardAvoidingView}
    >
      <ParallaxScrollView
        headerBackgroundColor={{ light: "#667eea", dark: "#764ba2" }}
        headerImage={
          <View style={styles.headerContent}>
            <ThemedText type="title" style={styles.headerTitle}>
              密钥验证
            </ThemedText>
          </View>
        }
      >
        <ThemedView style={styles.content}>
          <ThemedText type="title" style={styles.title}>
            请输入模块卡密
          </ThemedText>

          <ThemedText style={styles.description}>
            系统会根据卡密和当前平台自动解析可访问模块，并检查是否需要升级 App。
          </ThemedText>

          <View style={styles.inputContainer}>
            <ThemedText style={styles.label}>卡密：</ThemedText>
            <TextInput
              style={styles.input}
              value={secretKey}
              onChangeText={setSecretKey}
              placeholder="请输入卡密"
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              editable={!submitting}
            />
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, submitting && styles.buttonDisabled]}
              onPress={handleSubmit}
              disabled={submitting}
            >
              <ThemedText style={styles.buttonText}>
                {submitting ? "验证中..." : "验证密钥"}
              </ThemedText>
            </TouchableOpacity>
          </View>

          <View style={styles.tipContainer}>
            <ThemedText style={styles.tipTitle}>环境要求</ThemedText>
            <ThemedText style={styles.tipText}>
              需要在 `.env` 中配置 `EXPO_PUBLIC_API_BASE_URL`，指向你刚才改好的全栈服务。
            </ThemedText>
          </View>
        </ThemedView>
      </ParallaxScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardAvoidingView: {
    flex: 1,
  },
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
  content: {
    padding: 20,
    gap: 20,
  },
  title: {
    textAlign: "center",
    marginBottom: 8,
  },
  description: {
    textAlign: "center",
    opacity: 0.7,
    marginBottom: 24,
  },
  inputContainer: {
    gap: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  buttonContainer: {
    marginTop: 16,
  },
  button: {
    backgroundColor: "#667eea",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
  tipContainer: {
    marginTop: 32,
    padding: 16,
    backgroundColor: "rgba(102, 126, 234, 0.08)",
    borderRadius: 8,
    gap: 8,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: "500",
  },
  tipText: {
    opacity: 0.75,
    lineHeight: 20,
  },
});
