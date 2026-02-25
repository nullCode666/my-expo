import { Header } from '@/components/header';
import { ThemedText } from '@/components/themed-text';
import { View, StyleSheet, Image } from 'react-native';

export default function DemoHeaderTransparentPage() {
  return (
    <View style={styles.container}>
      {/* 背景图片 */}
      <Image
        source={{ uri: 'https://picsum.photos/400/800' }}
        style={styles.backgroundImage}
      />

      {/* 透明 Header */}
      <Header
        title="透明导航栏"
        transparent={true}
        titleColor="#fff"
        showBorder={false}
        rightComponent={
          <View style={styles.rightButton}>
            <ThemedText style={styles.rightButtonText}>•••</ThemedText>
          </View>
        }
      />

      {/* 内容 */}
      <View style={styles.overlay}>
        <ThemedText type="title" style={styles.title}>
          透明背景效果
        </ThemedText>
        <ThemedText style={styles.description}>
          设置 transparent=true 可以实现透明导航栏，内容会在导航栏下方显示。
        </ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    resizeMode: 'cover',
  },
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 20,
    paddingBottom: 100,
  },
  title: {
    color: '#fff',
    marginBottom: 12,
  },
  description: {
    color: '#fff',
    opacity: 0.9,
  },
  rightButton: {
    padding: 4,
  },
  rightButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
