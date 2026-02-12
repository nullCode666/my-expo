import ParallaxScrollView from "@/components/parallax-scroll-view";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useUserStore } from "@/src/store/userStore";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Button,
  Linking,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { AMapSdk, MapView, Marker } from "react-native-amap3d";
import {
  getError,
  setMockLocation,
  stopMockLocation,
} from "react-native-android-mock-location";


AMapSdk.init(
  Platform.select({
    android: "c52c7169e6df23490e3114330098aaac",
    ios: "186d3464209b74effa4d8391f441f14d",
  })
);

export default function ModuleAHome() {
  const router = useRouter();
  const { reset } = useUserStore();
  const [latitude, setLatitude] = useState("39.96");
  const [longitude, setLongitude] = useState("116.30");
  const [altitude, setAltitude] = useState("3");
  const [speed, setSpeed] = useState("0.01");
  const [bearing, setBearing] = useState("");
  const [accuracy, setAccuracy] = useState("1");
  const [isMocking, setIsMocking] = useState(false);
  const [hasLocationPermission, setHasLocationPermission] = useState(false);

  // 检查并请求位置权限
  const requestLocationPermissions = async () => {
    if (Platform.OS !== "android") {
      Alert.alert("提示", "模拟位置功能仅支持Android设备");
      return false;
    }

    try {
      // 对于Android 10及以上版本，需要后台位置权限
      // const permissionsToRequest = [
      //   'android.permission.ACCESS_FINE_LOCATION',
      //   'android.permission.ACCESS_COARSE_LOCATION',
      //   'android.permission.ACCESS_MOCK_LOCATION'
      // ];

      // 注意：MOCK_LOCATION权限通常需要在开发者选项中手动启用
      // 这里我们主要是检查基本的定位权限

      // 在实际应用中，您可能需要使用react-native-permissions库
      // 或者引导用户到开发者设置中手动启用模拟位置

      Alert.alert(
        "权限说明",
        "模拟位置功能需要以下权限：\n\n" +
        "• 精确位置权限 (ACCESS_FINE_LOCATION)\n" +
        "• 粗略位置权限 (ACCESS_COARSE_LOCATION)\n" +
        "• 模拟位置权限 (ACCESS_MOCK_LOCATION)\n\n" +
        "请注意：模拟位置权限需要在开发者选项中手动启用。",
        [
          { text: "取消", style: "cancel" },
          {
            text: "前往设置",
            onPress: openDeveloperSettings,
          },
        ],
      );

      return true;
    } catch (error) {
      console.error("权限请求错误:", error);
      Alert.alert("错误", "权限请求失败，请手动检查权限设置");
      return false;
    }
  };

  const handleLogout = () => {
    reset();
    router.replace("/");
  };

  const handleSetMockLocation = async () => {
    try {
      // 首先检查权限
      const hasPermission = await requestLocationPermissions();
      if (!hasPermission) {
        return;
      }

      const lat = parseFloat(latitude);
      const lng = parseFloat(longitude);

      // 验证经纬度输入
      if (isNaN(lat) || lat < -90 || lat > 90) {
        Alert.alert("错误", "纬度范围应为 -90 到 90");
        return;
      }

      if (isNaN(lng) || lng < -180 || lng > 180) {
        Alert.alert("错误", "经度范围应为 -180 到 180");
        return;
      }

      const location = {
        latitude: lat,
        longitude: lng,
      };

      // 收集可选参数
      const options: any = {};
      if (altitude) options.altitude = parseFloat(altitude);
      if (speed) options.speed = parseFloat(speed);
      if (bearing) options.bearing = parseFloat(bearing);
      if (accuracy) options.accuracy = parseFloat(accuracy);
      options.delay = 0;
      setMockLocation({
        location,
        options,
      });
      setIsMocking(true);
      setHasLocationPermission(true);
      Alert.alert("成功", "模拟位置已设置", [
        {
          text: "确定",
          onPress: () => { },
        },
      ]);
    } catch (error) {
      console.log(error);
      const errorMessage = getError();

      // 检查是否是MOCK_LOCATION权限错误
      const isMockLocationError =
        errorMessage &&
        (errorMessage.includes("MOCK_LOCATION") ||
          errorMessage.includes("not allowed to perform") ||
          error.toString().includes("SecurityException"));

      if (isMockLocationError) {
        Alert.alert(
          "模拟位置权限未启用",
          "请在开发者选项中启用模拟位置权限：\n\n" +
          "1. 设置 → 关于手机 → 版本号(点击7次)\n" +
          "2. 返回 → 开发者选项\n" +
          "3. 选择模拟位置应用 → 选择本应用\n\n" +
          "完成后重新尝试。",
          [
            { text: "取消", style: "cancel" },
            {
              text: "打开设置",
              style: "default",
              onPress: openDeveloperSettings,
            },
          ],
        );
      } else {
        Alert.alert(
          "设置失败",
          (errorMessage || "设置模拟位置失败") + "\n\n请检查权限或重试。",
          [
            { text: "取消", style: "cancel" },
            {
              text: "打开设置",
              style: "default",
              onPress: openDeveloperSettings,
            },
            { text: "重试", onPress: handleSetMockLocation },
          ],
        );
      }
    }
  };

  const handleStopMockLocation = () => {
    try {
      stopMockLocation();
      setIsMocking(false);
      Alert.alert("成功", "模拟位置已停止");
    } catch (_error) {
      const errorMessage = getError();
      Alert.alert(
        "停止失败",
        (errorMessage || "停止模拟位置失败") + "\n\n请重试或重启应用。",
      );
    }
  };

  const openDeveloperSettings = async () => {
    if (Platform.OS === "android") {
      try {
        // 尝试打开开发者选项
        await Linking.sendIntent(
          "android.settings.APPLICATION_DEVELOPMENT_SETTINGS",
        );
      } catch (_error) {
        try {
          // 如果开发者选项打不开，尝试打开应用详情设置
          await Linking.sendIntent(
            "android.settings.APPLICATION_DETAILS_SETTINGS",
            [{ key: "package", value: "com.startwinter.myexpo" }],
          );
        } catch (_fallbackError) {
          // 最后尝试通用设置
          await Linking.openSettings();
        }
      }
    }
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#FF6B6B", dark: "#C0392B" }}
      headerImage={
        <View style={styles.headerContent}>
          <ThemedText type="title" style={styles.headerTitle}>
            📱 模块A
          </ThemedText>
        </View>
      }
    >
      <ThemedView style={styles.container}>
        <ThemedText type="title" style={styles.title}>
          欢迎使用模块A
        </ThemedText>

        <ThemedText style={styles.description}>
          这是模块A的首页，专为类型A用户设计。
        </ThemedText>

        <View style={styles.featureContainer}>
          <ThemedView style={styles.featureCard}>
            <ThemedText type="subtitle">功能1</ThemedText>
            <ThemedText>模块A专属功能1</ThemedText>
          </ThemedView>

          <ThemedView style={styles.featureCard}>
            <ThemedText type="subtitle">功能2</ThemedText>
            <ThemedText>模块A专属功能2</ThemedText>
          </ThemedView>

          <ThemedView style={styles.featureCard}>
            <ThemedText type="subtitle">功能3</ThemedText>
            <ThemedText>模块A专属功能3</ThemedText>
          </ThemedView>
        </View>

        <ThemedView style={styles.mockLocationContainer}>
          <ThemedText type="subtitle" style={styles.mockLocationTitle}>
            📍 Android模拟位置设置
          </ThemedText>

          <View style={styles.permissionStatus}>
            <ThemedText
              style={[
                styles.permissionText,
                { color: hasLocationPermission ? "#4CAF50" : "#FF6B6B" },
              ]}
            >
              {hasLocationPermission ? "✅ 权限已配置" : "⚠️ 需要配置权限"}
            </ThemedText>
          </View>

          <View style={styles.helpContainer}>
            <TouchableOpacity
              style={styles.helpButton}
              onPress={() =>
                Alert.alert(
                  "如何启用模拟位置权限？",
                  "需要配置Android模拟位置权限。您可以：\n\n" +
                  "📍 快速跳转：直接打开开发者设置\n" +
                  "❓ 手动操作：按步骤手动配置\n\n" +
                  "选择适合您的方式：",
                  [
                    { text: "取消", style: "cancel" },
                    {
                      text: "📍 快速跳转",
                      style: "default",
                      onPress: openDeveloperSettings,
                    },
                    {
                      text: "❓ 手动指导",
                      style: "default",
                      onPress: () =>
                        Alert.alert(
                          "手动配置步骤：",
                          "1. 打开手机设置\n" +
                          "2. 找到'开发者选项'（如未显示，请在'关于手机'中点击7次'版本号'）\n" +
                          "3. 找到'选择模拟位置应用'或'允许模拟位置'\n" +
                          "4. 选择本应用\n\n" +
                          "设置完成后，返回应用即可开始使用位置模拟功能。",
                        ),
                    },
                  ],
                )
              }
            >
              <ThemedText style={styles.helpButtonText}>
                📍 启用模拟位置权限
              </ThemedText>
            </TouchableOpacity>
          </View>

          <View style={styles.inputContainer}>
            <ThemedText style={styles.inputLabel}>纬度 (Latitude):</ThemedText>
            <TextInput
              style={styles.input}
              value={latitude}
              onChangeText={setLatitude}
              placeholder="输入纬度"
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputContainer}>
            <ThemedText style={styles.inputLabel}>经度 (Longitude):</ThemedText>
            <TextInput
              style={styles.input}
              value={longitude}
              onChangeText={setLongitude}
              placeholder="输入经度"
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputContainer}>
            <ThemedText style={styles.inputLabel}>
              海拔 (Altitude) - 可选:
            </ThemedText>
            <TextInput
              style={styles.input}
              value={altitude}
              onChangeText={setAltitude}
              placeholder="输入海拔"
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputContainer}>
            <ThemedText style={styles.inputLabel}>
              速度 (Speed) - 可选:
            </ThemedText>
            <TextInput
              style={styles.input}
              value={speed}
              onChangeText={setSpeed}
              placeholder="输入速度"
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputContainer}>
            <ThemedText style={styles.inputLabel}>
              方向 (Bearing) - 可选:
            </ThemedText>
            <TextInput
              style={styles.input}
              value={bearing}
              onChangeText={setBearing}
              placeholder="输入方向"
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputContainer}>
            <ThemedText style={styles.inputLabel}>
              精度 (Accuracy) - 可选:
            </ThemedText>
            <TextInput
              style={styles.input}
              value={accuracy}
              onChangeText={setAccuracy}
              placeholder="输入精度"
              keyboardType="numeric"
            />
          </View>

          <View style={styles.buttonContainer}>
            <Button
              title={isMocking ? "停止模拟位置" : "设置模拟位置"}
              onPress={
                isMocking ? handleStopMockLocation : handleSetMockLocation
              }
              color={isMocking ? "#FF6B6B" : "#4CAF50"}
            />
          </View>

          <MapView>
            <Marker
              position={{ latitude: 39.806901, longitude: 116.397972 }}
              icon={require("../images/flag.png")}
              onPress={() => alert("onPress")}
            />
            <Marker
              position={{ latitude: 39.806901, longitude: 116.297972 }}
              icon={{
                uri: "https://reactnative.dev/img/pwa/manifest-icon-512.png",
                width: 64,
                height: 64,
              }}
            />
            <Marker position={{ latitude: 39.906901, longitude: 116.397972 }}>
              <Text
                style={{
                  color: "#fff",
                  backgroundColor: "#009688",
                  alignItems: "center",
                  borderRadius: 5,
                  padding: 5,
                }}
              >
                {new Date().toLocaleString()}
              </Text>
            </Marker>
          </MapView>;

          {isMocking && (
            <ThemedText style={styles.statusText}>✅ 模拟位置已激活</ThemedText>
          )}
        </ThemedView>

        <View style={styles.logoutContainer}>
          <Button title="退出登录" onPress={handleLogout} color="#FF6B6B" />
        </View>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
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
    backgroundColor: "rgba(255, 107, 107, 0.1)",
    gap: 8,
  },
  mockLocationContainer: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: "rgba(76, 175, 80, 0.1)",
    gap: 12,
    marginBottom: 32,
  },
  mockLocationTitle: {
    textAlign: "center",
    marginBottom: 8,
  },
  inputContainer: {
    gap: 4,
  },
  helpContainer: {
    marginBottom: 16,
  },
  helpButton: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: "center",
  },
  helpButtonText: {
    color: "#4CAF50",
    fontSize: 14,
    fontWeight: "500",
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "500",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 6,
    padding: 10,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  buttonContainer: {
    marginTop: 16,
  },
  statusText: {
    textAlign: "center",
    marginTop: 8,
    fontWeight: "bold",
    color: "#4CAF50",
  },
  permissionStatus: {
    alignItems: "center",
    marginBottom: 12,
  },
  permissionText: {
    fontSize: 14,
    fontWeight: "500",
  },
  logoutContainer: {
    marginTop: 20,
  },
});
