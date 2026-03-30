import ParallaxScrollView from "@/components/parallax-scroll-view";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { MODULE_ACCESS_ITEMS } from "@/src/config/moduleAccess";
import { useUserStore } from "@/src/store/userStore";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function LoginScreen() {
  const [secretKey, setSecretKey] = useState("");
  const router = useRouter();
  const { setSecretKey: setStoreKey, validateKey } = useUserStore();

  const handleSubmit = () => {
    if (!secretKey.trim()) {
      Alert.alert("错误", "请输入密钥");
      return;
    }

    setStoreKey(secretKey);
    const userType = validateKey(secretKey);

    if (userType) {
      switch (userType) {
        case "mockLocation":
          router.replace("/mockLocation");
          break;
        case "lookTV":
          router.replace("/lookTV");
          break;
        case "moduleC":
          router.replace("/moduleC");
          break;
        default:
          Alert.alert("错误", "未知的用户类型");
      }
    } else {
      Alert.alert("错误", "无效的密钥，请重试");
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
              🔑 密钥验证
            </ThemedText>
          </View>
        }
      >
        <ThemedView style={styles.content}>
          <ThemedText type="title" style={styles.title}>
            请输入您的访问密钥
          </ThemedText>

          <ThemedText style={styles.description}>
            输入正确的密钥以进入对应的模块
          </ThemedText>

          <View style={styles.inputContainer}>
            <ThemedText style={styles.label}>密钥：</ThemedText>
            <TextInput
              style={styles.input}
              value={secretKey}
              onChangeText={setSecretKey}
              placeholder="请输入密钥"
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
              <ThemedText style={styles.buttonText}>验证密钥</ThemedText>
            </TouchableOpacity>
          </View>

          <View style={styles.demoKeysContainer}>
            <ThemedText style={styles.demoKeysTitle}>演示密钥：</ThemedText>
            {MODULE_ACCESS_ITEMS.map((item) => (
              <View key={item.userType} style={styles.demoKeyItem}>
                <ThemedText style={styles.demoKeyLabel}>{item.label}:</ThemedText>
                <ThemedText style={styles.demoKeyValue}>{item.key}</ThemedText>
              </View>
            ))}
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
  container: {
    flex: 1,
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
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
  demoKeysContainer: {
    marginTop: 32,
    padding: 16,
    backgroundColor: "rgba(102, 126, 234, 0.1)",
    borderRadius: 8,
    gap: 8,
  },
  demoKeysTitle: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 8,
  },
  demoKeyItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 4,
  },
  demoKeyLabel: {
    fontSize: 14,
  },
  demoKeyValue: {
    fontSize: 14,
    fontFamily: Platform.OS === "ios" ? "Courier" : "monospace",
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
});
