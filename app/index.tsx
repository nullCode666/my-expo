import React from 'react';
import { StyleSheet, View, TextInput, Text, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useUserStore } from '@/src/store/userStore';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import {Button} from "tamagui"

export default function SecretKeyScreen() {
  const router = useRouter();
  const { secretKey, error, isValidKey, setSecretKey, validateKey } = useUserStore();

  const handleSubmit = () => {
    if (validateKey()) {
      const { userType } = useUserStore.getState();
      if (userType) {
        router.replace(`/${userType}/index`);
      }
    }
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'height' : 'height'} 
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
        style={styles.keyboardAvoidingView}
      >
      <ThemedView style={styles.content}>
        <ThemedText type="title" style={styles.title}>
          请输入密钥
        </ThemedText>
        
        <ThemedText style={styles.description}>
          输入您的专属密钥以访问相应模块
        </ThemedText>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="请输入密钥"
            placeholderTextColor="#999"
            value={secretKey}
            onChangeText={setSecretKey}
            autoCapitalize="none"
            autoCorrect={false}
          />
          
          {error && (
            <ThemedText type="defaultSemiBold" style={styles.errorText}>
              {error}
            </ThemedText>
          )}
        </View>

        <View style={styles.buttonContainer}>
          <Button
            onPress={handleSubmit}
            disabled={!secretKey.trim()}
          >
            验证并进入
            </Button>
        </View>

        <View style={styles.exampleKeysContainer}>
          <ThemedText style={styles.exampleTitle}>示例密钥：</ThemedText>
          <ThemedText style={styles.exampleKey}>keyA123 - 模块A</ThemedText>
          <ThemedText style={styles.exampleKey}>keyB456 - 模块B</ThemedText>
          <ThemedText style={styles.exampleKey}>keyC789 - 模块C</ThemedText>
        </View>
      </ThemedView>
    </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    marginBottom: 16,
  },
  description: {
    marginBottom: 32,
    textAlign: 'center',
    opacity: 0.7,
  },
  inputContainer: {
    width: '100%',
    maxWidth: 400,
    marginBottom: 16,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  errorText: {
    color: '#ff3b30',
    marginTop: 8,
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 400,
    marginTop: 16,
  },
  exampleKeysContainer: {
    marginTop: 40,
    alignItems: 'center',
  },
  exampleTitle: {
    marginBottom: 12,
    fontWeight: '600',
  },
  exampleKey: {
    marginBottom: 8,
    opacity: 0.7,
  },
});
