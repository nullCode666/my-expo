import { useRouter, useNavigation } from 'expo-router';
import { ReactNode, useCallback, useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Platform, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ThemedText } from './themed-text';
import { IconSymbol } from './ui/icon-symbol';
import { useColorScheme } from '@/hooks/use-color-scheme';

export type HeaderProps = {
  /** 中间标题 */
  title?: string;
  /** 标题组件（优先级高于 title） */
  titleComponent?: ReactNode;
  /** 右侧自定义内容 */
  rightComponent?: ReactNode;
  /** 是否显示返回按钮（默认自动检测） */
  showBackButton?: boolean;
  /** 返回按钮点击回调 */
  onBackPress?: () => void;
  /** 自定义返回按钮图标 */
  backIcon?: string;
  /** 自定义背景色 */
  backgroundColor?: string;
  /** 是否透明背景 */
  transparent?: boolean;
  /** 标题颜色 */
  titleColor?: string;
  /** 是否显示底部边框 */
  showBorder?: boolean;
  /** 自定义高度（不包含状态栏） */
  height?: number;
  /** 自定义样式 */
  style?: any;
};

export function Header({
  title,
  titleComponent,
  rightComponent,
  showBackButton: forceShowBack,
  onBackPress,
  backIcon = 'chevron.left',
  backgroundColor,
  transparent = false,
  titleColor,
  showBorder = true,
  height = 44,
  style,
}: HeaderProps) {
  const router = useRouter();
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();
  const [canGoBack, setCanGoBack] = useState(false);

  // 检测是否可以返回
  useEffect(() => {
    const checkCanGoBack = () => {
      // @ts-ignore
      const state = navigation.getState();
      // 检查导航堆栈，如果有多于一个路由则可以返回
      const routes = state?.routes || [];
      setCanGoBack(routes.length > 1);
    };

    checkCanGoBack();

    // 监听导航状态变化
    const unsubscribe = navigation.addListener('state', checkCanGoBack);
    return unsubscribe;
  }, [navigation]);

  // 是否显示返回按钮
  const showBack = forceShowBack !== undefined ? forceShowBack : canGoBack;

  // 处理返回
  const handleBack = useCallback(() => {
    if (onBackPress) {
      onBackPress();
    } else if (canGoBack) {
      router.back();
    }
  }, [canGoBack, onBackPress, router]);

  // 背景色
  const bgColor = transparent
    ? 'transparent'
    : backgroundColor || (colorScheme === 'dark' ? '#1c1c1e' : '#fff');

  // 文字颜色
  const textColor = titleColor || (colorScheme === 'dark' ? '#fff' : '#000');

  // 边框颜色
  const borderColor = colorScheme === 'dark' ? '#333' : '#e5e5e5';

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: bgColor,
          paddingTop: insets.top,
          borderBottomWidth: showBorder && !transparent ? 1 : 0,
          borderBottomColor: borderColor,
        },
        style,
      ]}>
      <StatusBar
        barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={bgColor}
        translucent={transparent}
      />

      <View style={[styles.content, { height }]}>
        {/* 左侧区域 */}
        <View style={styles.leftContainer}>
          {showBack && (
            <TouchableOpacity
              style={styles.backButton}
              onPress={handleBack}
              activeOpacity={0.7}>
              <IconSymbol
                name={backIcon}
                size={24}
                color={textColor}
              />
            </TouchableOpacity>
          )}
        </View>

        {/* 中间标题区域 */}
        <View style={styles.centerContainer}>
          {titleComponent ? (
            titleComponent
          ) : title ? (
            <ThemedText
              type="subtitle"
              style={[styles.title, { color: textColor }]}>
              {title}
            </ThemedText>
          ) : null}
        </View>

        {/* 右侧区域 */}
        <View style={styles.rightContainer}>
          {rightComponent}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  leftContainer: {
    width: 60,
    alignItems: 'flex-start',
  },
  backButton: {
    padding: 8,
    marginLeft: -4,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 17,
    fontWeight: '600',
  },
  rightContainer: {
    width: 60,
    alignItems: 'flex-end',
  },
});

export default Header;
