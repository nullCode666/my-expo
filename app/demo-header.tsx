import { Header } from '@/components/header';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useRouter } from 'expo-router';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { IconSymbol } from '@/components/ui/icon-symbol';

export default function DemoHeaderPage() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* 基础用法 */}
      <Header
        title="基础标题"
        showBorder={true}
      />

      <ThemedView style={styles.content}>
        <ThemedText type="title" style={styles.sectionTitle}>
          Header 组件使用示例
        </ThemedText>

        <ThemedText style={styles.description}>
          这个页面展示了 Header 组件的各种用法。
        </ThemedText>

        {/* 跳转到其他示例 */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push('/demo-header-custom')}>
          <ThemedText style={styles.buttonText}>
            查看自定义右侧按钮示例 →
          </ThemedText>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push('/demo-header-transparent')}>
          <ThemedText style={styles.buttonText}>
            查看透明背景示例 →
          </ThemedText>
        </TouchableOpacity>
      </ThemedView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  description: {
    marginBottom: 24,
    opacity: 0.7,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 12,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
});
