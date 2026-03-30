import { ModuleReleaseCard } from "@/src/components/module-release-card";
import ParallaxScrollView from "@/src/components/parallax-scroll-view";
import { ThemedText } from "@/src/components/themed-text";
import { ThemedView } from "@/src/components/themed-view";
import { IconSymbol } from "@/src/components/ui/icon-symbol";
import { getAccessibleMenuModules, hasAppAccess } from "@/src/modules/access";
import { getModulesByVisibility } from "@/src/modules/registry";
import { useUserStore } from "@/src/store/userStore";
import { useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  Animated,
  Dimensions,
  Modal,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

export default function HomeScreen() {
  const router = useRouter();
  const { downloadedBundleUri, isValidKey, release, userType } = useUserStore();

  const [menuVisible, setMenuVisible] = useState(false);
  const [slideAnim] = useState(new Animated.Value(-width * 0.8));

  const isDev = __DEV__;
  const allowAppAccess = hasAppAccess(isDev, isValidKey);

  useEffect(() => {
    if (!allowAppAccess) {
      router.replace("/login");
    }
  }, [allowAppAccess, router]);

  const menuModules = useMemo(
    () =>
      getAccessibleMenuModules(getModulesByVisibility("menu"), {
        isDev,
        isValidKey,
        userType,
      }),
    [isDev, isValidKey, userType],
  );

  const toggleMenu = () => {
    const toValue = menuVisible ? -width * 0.8 : 0;
    Animated.timing(slideAnim, {
      toValue,
      duration: 300,
      useNativeDriver: true,
    }).start();
    setMenuVisible(!menuVisible);
  };

  const handleMenuNavigation = (route: string) => {
    toggleMenu();
    setTimeout(() => {
      router.push(route as any);
    }, 300);
  };

  const allowHidden = allowAppAccess;

  if (!allowAppAccess) {
    return null;
  }

  return (
    <View style={styles.container}>
      <ParallaxScrollView
        headerBackgroundColor={{ light: "#FF6B6B", dark: "#C0392B" }}
        headerImage={
          <View style={styles.headerContent}>
            <TouchableOpacity style={styles.menuButton} onPress={toggleMenu}>
              <IconSymbol name="line.3.horizontal" size={24} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity
              onLongPress={() => {
                if (allowHidden) router.push("/hidden" as any);
              }}
              delayLongPress={600}
              activeOpacity={0.9}
            >
              <ThemedText type="title" style={styles.headerTitle}>
                模块中心
              </ThemedText>
            </TouchableOpacity>
          </View>
        }
      >
        <ThemedView style={styles.content}>
          <ThemedText type="title" style={styles.welcomeTitle}>
            欢迎
          </ThemedText>

          <ThemedText style={styles.description}>
            通过左侧菜单进入不同模块。长按标题可进入隐藏模块（开发环境或已验证密钥）。
          </ThemedText>

          <ModuleReleaseCard
            title="当前命中发布"
            release={release}
            downloadedBundleUri={downloadedBundleUri}
          />

          <View style={styles.featureContainer}>
            {menuModules.slice(0, 3).map((m) => (
              <ThemedView
                key={m.id}
                style={[
                  styles.featureCard,
                  { backgroundColor: `${m.color ?? "#111827"}15` },
                ]}
              >
                <ThemedText type="subtitle">{m.title}</ThemedText>
                <ThemedText>{m.subtitle ?? ""}</ThemedText>
              </ThemedView>
            ))}
          </View>

          <TouchableOpacity
            style={styles.enterButton}
            onPress={() => router.push((menuModules[0]?.route ?? "/login") as any)}
          >
            <ThemedText style={styles.enterButtonText}>进入第一个模块</ThemedText>
          </TouchableOpacity>
        </ThemedView>
      </ParallaxScrollView>

      <Modal
        visible={menuVisible}
        transparent
        animationType="fade"
        onRequestClose={toggleMenu}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity
            style={styles.overlayTouch}
            activeOpacity={1}
            onPress={toggleMenu}
          />
          <Animated.View
            style={[styles.sideMenu, { transform: [{ translateX: slideAnim }] }]}
          >
            <ThemedView style={styles.menuHeader}>
              <ThemedText type="title" style={styles.menuTitle}>
                选择模块
              </ThemedText>
              <TouchableOpacity onPress={toggleMenu}>
                <IconSymbol name="xmark" size={24} color="#666" />
              </TouchableOpacity>
            </ThemedView>

            <View style={styles.menuItems}>
              {menuModules.map((m) => (
                <TouchableOpacity
                  key={m.id}
                  style={[styles.menuItem, { borderLeftColor: m.color ?? "#ddd" }]}
                  onPress={() => handleMenuNavigation(m.route)}
                >
                  <View style={styles.menuItemContent}>
                    <IconSymbol
                      name={(m.icon ?? "square.fill") as any}
                      size={24}
                      color={m.color ?? "#666"}
                    />
                    <View style={styles.menuItemText}>
                      <ThemedText style={styles.menuItemTitle}>
                        {m.title}
                      </ThemedText>
                      <ThemedText style={styles.menuItemSubtitle}>
                        {m.subtitle ?? ""}
                      </ThemedText>
                    </View>
                  </View>
                  <IconSymbol name="chevron.right" size={16} color="#ccc" />
                </TouchableOpacity>
              ))}

              <TouchableOpacity
                style={[styles.menuItem, { borderLeftColor: "#667eea" }]}
                onPress={() => handleMenuNavigation("/login")}
              >
                <View style={styles.menuItemContent}>
                  <IconSymbol name="key.fill" size={24} color="#667eea" />
                  <View style={styles.menuItemText}>
                    <ThemedText style={styles.menuItemTitle}>密钥验证</ThemedText>
                    <ThemedText style={styles.menuItemSubtitle}>
                      切换模块访问
                    </ThemedText>
                  </View>
                </View>
                <IconSymbol name="chevron.right" size={16} color="#ccc" />
              </TouchableOpacity>
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
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    position: "relative",
  },
  menuButton: {
    position: "absolute",
    top: 50,
    left: 20,
    padding: 10,
    borderRadius: 8,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  headerTitle: {
    color: "#fff",
    textAlign: "center",
  },
  content: {
    padding: 20,
    gap: 24,
  },
  welcomeTitle: {
    textAlign: "center",
    marginBottom: 8,
  },
  description: {
    textAlign: "center",
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
    gap: 8,
  },
  enterButton: {
    backgroundColor: "#FF6B6B",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 16,
  },
  enterButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  overlayTouch: {
    flex: 1,
  },
  sideMenu: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: width * 0.8,
    backgroundColor: "#fff",
    paddingTop: 50,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  menuHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  menuTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  menuItems: {
    paddingTop: 20,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderLeftWidth: 4,
    borderLeftColor: "transparent",
  },
  menuItemContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    flex: 1,
  },
  menuItemText: {
    flex: 1,
  },
  menuItemTitle: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 2,
  },
  menuItemSubtitle: {
    fontSize: 14,
    color: "#666",
  },
});
