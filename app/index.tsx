import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Animated,
  Dimensions,
  Modal,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const router = useRouter();
  const [menuVisible, setMenuVisible] = useState(false);
  const [slideAnim] = useState(new Animated.Value(-width * 0.8));

  const menuItems = [
    {
      title: '模块A',
      subtitle: '位置模拟功能',
      icon: 'location.fill',
      color: '#FF6B6B',
    },
    {
      title: '模块B',
      subtitle: '商务功能',
      icon: 'briefcase.fill',
      color: '#4ECDC4',
    },
    {
      title: '模块C',
      subtitle: '目标功能',
      icon: 'target',
      color: '#95E1D3',
    },
    {
      title: '密钥验证',
      subtitle: '切换模块访问',
      icon: 'key.fill',
      color: '#667eea',
    },
  ];

  const toggleMenu = () => {
    const toValue = menuVisible ? -width * 0.8 : 0;
    Animated.timing(slideAnim, {
      toValue,
      duration: 300,
      useNativeDriver: true,
    }).start();
    setMenuVisible(!menuVisible);
  };

   const handleMenuNavigation = (index: number) => {
     toggleMenu();
     setTimeout(() => {
       switch (index) {
         case 0:
           router.push('/moduleA');
           break;
         case 1:
           router.push('/moduleB');
           break;
         case 2:
           router.push('/moduleC');
           break;
         case 3:
           router.push('/login');
           break;
       }
     }, 300);
   };

  return (
    <View style={styles.container}>
      <ParallaxScrollView
        headerBackgroundColor={{ light: '#FF6B6B', dark: '#C0392B' }}
        headerImage={
          <View style={styles.headerContent}>
            <TouchableOpacity style={styles.menuButton} onPress={toggleMenu}>
              <IconSymbol name="line.3.horizontal" size={24} color="#fff" />
            </TouchableOpacity>
            <ThemedText type="title" style={styles.headerTitle}>
              📱 模块A - 欢迎
            </ThemedText>
          </View>
        }>
        <ThemedView style={styles.content}>
          <ThemedText type="title" style={styles.welcomeTitle}>
            欢迎使用模块A
          </ThemedText>

          <ThemedText style={styles.description}>
            这是默认的模块A界面，专为类型A用户设计。您可以通过左侧滑菜单切换到其他模块。
          </ThemedText>

          <View style={styles.featureContainer}>
            <ThemedView style={styles.featureCard}>
              <ThemedText type="subtitle">📍 位置模拟</ThemedText>
              <ThemedText>Android GPS位置模拟功能</ThemedText>
            </ThemedView>

            <ThemedView style={styles.featureCard}>
              <ThemedText type="subtitle">🎯 精准控制</ThemedText>
              <ThemedText>支持纬度、经度、海拔等参数设置</ThemedText>
            </ThemedView>

            <ThemedView style={styles.featureCard}>
              <ThemedText type="subtitle">⚡ 实时切换</ThemedText>
              <ThemedText>快速启停位置模拟</ThemedText>
            </ThemedView>
          </View>

          <TouchableOpacity
            style={styles.enterButton}
            onPress={() => router.push('/moduleA')}>
            <ThemedText style={styles.enterButtonText}>
              进入完整功能页面
            </ThemedText>
          </TouchableOpacity>
        </ThemedView>
      </ParallaxScrollView>

      <Modal
        visible={menuVisible}
        transparent
        animationType="fade"
        onRequestClose={toggleMenu}>
        <View style={styles.modalOverlay}>
          <TouchableOpacity
            style={styles.overlayTouch}
            activeOpacity={1}
            onPress={toggleMenu}
          />
          <Animated.View
            style={[
              styles.sideMenu,
              { transform: [{ translateX: slideAnim }] },
            ]}>
            <ThemedView style={styles.menuHeader}>
              <ThemedText type="title" style={styles.menuTitle}>
                选择模块
              </ThemedText>
              <TouchableOpacity onPress={toggleMenu}>
                <IconSymbol name="xmark" size={24} color="#666" />
              </TouchableOpacity>
            </ThemedView>

             <View style={styles.menuItems}>
               {menuItems.map((item, index) => (
                 <TouchableOpacity
                   key={index}
                   style={[styles.menuItem, { borderLeftColor: item.color }]}
                   onPress={() => handleMenuNavigation(index)}>
                   <View style={styles.menuItemContent}>
                     <IconSymbol
                       name={item.icon as any}
                       size={24}
                       color={item.color}
                     />
                     <View style={styles.menuItemText}>
                       <ThemedText style={styles.menuItemTitle}>
                         {item.title}
                       </ThemedText>
                       <ThemedText style={styles.menuItemSubtitle}>
                         {item.subtitle}
                       </ThemedText>
                     </View>
                   </View>
                   <IconSymbol
                     name="chevron.right"
                     size={16}
                     color="#ccc"
                   />
                 </TouchableOpacity>
               ))}
             </View>
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    position: 'relative',
  },
  menuButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    padding: 10,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  headerTitle: {
    color: '#fff',
    textAlign: 'center',
  },
  content: {
    padding: 20,
    gap: 24,
  },
  welcomeTitle: {
    textAlign: 'center',
    marginBottom: 8,
  },
  description: {
    textAlign: 'center',
    opacity: 0.7,
    marginBottom: 24,
    lineHeight: 20,
  },
  featureContainer: {
    gap: 16,
    marginBottom: 32,
  },
  featureCard: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
    gap: 8,
  },
  enterButton: {
    backgroundColor: '#FF6B6B',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  enterButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  overlayTouch: {
    flex: 1,
  },
  sideMenu: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: width * 0.8,
    backgroundColor: '#fff',
    paddingTop: 50,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  menuHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  menuTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  menuItems: {
    paddingTop: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderLeftWidth: 4,
    borderLeftColor: 'transparent',
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    flex: 1,
  },
  menuItemText: {
    flex: 1,
  },
  menuItemTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  menuItemSubtitle: {
    fontSize: 14,
    color: '#666',
  },
});
