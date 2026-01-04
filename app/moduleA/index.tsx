import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useUserStore } from '@/src/store/userStore';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Button, StyleSheet, TextInput, View } from 'react-native';
import { getError, setMockLocation, stopMockLocation } from 'react-native-android-mock-location';

export default function ModuleAHome() {
  const router = useRouter();
  const { reset } = useUserStore();
  const [latitude, setLatitude] = useState('37.7749');
  const [longitude, setLongitude] = useState('-122.4194');
  const [altitude, setAltitude] = useState('');
  const [speed, setSpeed] = useState('');
  const [bearing, setBearing] = useState('');
  const [accuracy, setAccuracy] = useState('');
  const [isMocking, setIsMocking] = useState(false);

  const handleLogout = () => {
    reset();
    router.replace('/');
  };

  const handleSetMockLocation = () => {
    try {
      const location = {
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude)
      };

      const options = {
        altitude: altitude ? parseFloat(altitude) : undefined,
        speed: speed ? parseFloat(speed) : undefined,
        bearing: bearing ? parseFloat(bearing) : undefined,
        accuracy: accuracy ? parseFloat(accuracy) : undefined,
        delay: 100
      };

      setMockLocation({ location, options });
      setIsMocking(true);
      Alert.alert('成功', '模拟位置已设置');
    } catch (error) {
      const errorMessage = getError();
      Alert.alert('错误', errorMessage || '设置模拟位置失败');
    }
  };

  const handleStopMockLocation = () => {
    try {
      stopMockLocation();
      setIsMocking(false);
      Alert.alert('成功', '模拟位置已停止');
    } catch (error) {
      const errorMessage = getError();
      Alert.alert('错误', errorMessage || '停止模拟位置失败');
    }
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#FF6B6B', dark: '#C0392B' }}
      headerImage={
        <View style={styles.headerContent}>
          <ThemedText type="title" style={styles.headerTitle}>
            📱 模块A
          </ThemedText>
        </View>
      }>
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
            <ThemedText style={styles.inputLabel}>海拔 (Altitude) - 可选:</ThemedText>
            <TextInput
              style={styles.input}
              value={altitude}
              onChangeText={setAltitude}
              placeholder="输入海拔"
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputContainer}>
            <ThemedText style={styles.inputLabel}>速度 (Speed) - 可选:</ThemedText>
            <TextInput
              style={styles.input}
              value={speed}
              onChangeText={setSpeed}
              placeholder="输入速度"
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputContainer}>
            <ThemedText style={styles.inputLabel}>方向 (Bearing) - 可选:</ThemedText>
            <TextInput
              style={styles.input}
              value={bearing}
              onChangeText={setBearing}
              placeholder="输入方向"
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputContainer}>
            <ThemedText style={styles.inputLabel}>精度 (Accuracy) - 可选:</ThemedText>
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
              onPress={isMocking ? handleStopMockLocation : handleSetMockLocation}
              color={isMocking ? "#FF6B6B" : "#4CAF50"}
            />
          </View>

          {isMocking && (
            <ThemedText style={styles.statusText}>
              ✅ 模拟位置已激活
            </ThemedText>
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
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
    gap: 8,
  },
  mockLocationContainer: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    gap: 12,
    marginBottom: 32,
  },
  mockLocationTitle: {
    textAlign: 'center',
    marginBottom: 8,
  },
  inputContainer: {
    gap: 4,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    padding: 10,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  buttonContainer: {
    marginTop: 16,
  },
  statusText: {
    textAlign: 'center',
    marginTop: 8,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  logoutContainer: {
    marginTop: 20,
  },
});