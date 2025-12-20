import React from 'react';
import { StyleSheet, View, Button } from 'react-native';
import { useRouter } from 'expo-router';
import { useUserStore } from '@/src/store/userStore';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function ModuleBHome() {
  const router = useRouter();
  const { reset } = useUserStore();

  const handleLogout = () => {
    reset();
    router.replace('/');
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#4ECDC4', dark: '#26A69A' }}
      headerImage={
        <View style={styles.headerContent}>
          <ThemedText type="title" style={styles.headerTitle}>
            💼 模块B
          </ThemedText>
        </View>
      }>
      <ThemedView style={styles.container}>
        <ThemedText type="title" style={styles.title}>
          欢迎使用模块B
        </ThemedText>
        
        <ThemedText style={styles.description}>
          这是模块B的首页，专为类型B用户设计。
        </ThemedText>

        <View style={styles.featureContainer}>
          <ThemedView style={styles.featureCard}>
            <ThemedText type="subtitle">功能1</ThemedText>
            <ThemedText>模块B专属功能1</ThemedText>
          </ThemedView>

          <ThemedView style={styles.featureCard}>
            <ThemedText type="subtitle">功能2</ThemedText>
            <ThemedText>模块B专属功能2</ThemedText>
          </ThemedView>

          <ThemedView style={styles.featureCard}>
            <ThemedText type="subtitle">功能3</ThemedText>
            <ThemedText>模块B专属功能3</ThemedText>
          </ThemedView>
        </View>

        <View style={styles.logoutContainer}>
          <Button title="退出登录" onPress={handleLogout} color="#4ECDC4" />
        </View>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  headerTitle: {
    color: '#fff',
    textAlign: 'center',
  },
  container: {
    padding: 20,
  },
  title: {
    marginBottom: 16,
  },
  description: {
    marginBottom: 32,
    opacity: 0.7,
  },
  featureContainer: {
    gap: 16,
    marginBottom: 32,
  },
  featureCard: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: 'rgba(78, 205, 196, 0.1)',
    gap: 8,
  },
  logoutContainer: {
    marginTop: 20,
  },
});
