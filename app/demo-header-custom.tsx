import { Header } from '@/components/header';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Alert, View, StyleSheet, TouchableOpacity } from 'react-native';
import { IconSymbol } from '@/components/ui/icon-symbol';

export default function DemoHeaderCustomPage() {
  // 自定义右侧按钮组
  const RightButtons = () => (
    <View style={styles.rightButtons}>
      <TouchableOpacity
        style={styles.iconButton}
        onPress={() => Alert.alert('分享')}>
        <IconSymbol name="square.and.arrow.up" size={22} color="#007AFF" />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.iconButton}
        onPress={() => Alert.alert('更多')}>
        <IconSymbol name="ellipsis" size={22} color="#007AFF" />
      </TouchableOpacity>
    </View>
  );

  // 自定义右侧文字按钮
  const RightTextButton = () => (
    <TouchableOpacity onPress={() => Alert.alert('保存')}>
      <ThemedText style={styles.saveButton}>保存</ThemedText>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* 自定义右侧图标按钮 */}
      <Header
        title="自定义按钮"
        rightComponent={<RightButtons />}
        showBorder={true}
      />

      <ThemedView style={styles.content}>
        <ThemedText type="title" style={styles.sectionTitle}>
          自定义右侧内容
        </ThemedText>

        <ThemedText style={styles.description}>
          可以通过 rightComponent 属性传入任何自定义内容。
        </ThemedText>
      </ThemedView>

      {/* 另一个示例：右侧文字按钮 */}
      <View style={styles.spacer} />

      <Header
        title="编辑资料"
        rightComponent={<RightTextButton />}
        showBorder={true}
      />

      <ThemedView style={styles.content}>
        <ThemedText type="title" style={styles.sectionTitle}>
          文字按钮示例
        </ThemedText>

        <ThemedText style={styles.description}>
          右侧也可以放置简单的文字按钮。
        </ThemedText>
      </ThemedView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  spacer: {
    height: 20,
    backgroundColor: '#f2f2f7',
  },
  sectionTitle: {
    marginBottom: 16,
  },
  description: {
    opacity: 0.7,
  },
  rightButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    padding: 4,
    marginLeft: 8,
  },
  saveButton: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '500',
  },
});
