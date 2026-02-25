import { useRouter, useLocalSearchParams } from 'expo-router';
import { useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Alert,
} from 'react-native';
import { AMapSdk, MapView, Marker, LatLng } from 'react-native-amap3d';
import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';
import { IconSymbol } from './ui/icon-symbol';
import { useColorScheme } from '@/hooks/use-color-scheme';

const { width, height } = Dimensions.get('window');

export type MapPickerParams = {
  // 初始坐标
  initialLatitude?: string;
  initialLongitude?: string;
  // 页面标题
  title?: string;
  // 回调函数名（用于返回结果）
  callbackUrl?: string;
};

export type MapPickerResult = {
  latitude: number;
  longitude: number;
  address?: string;
};

export default function MapPicker() {
  const router = useRouter();
  const params = useLocalSearchParams<MapPickerParams>();
  const colorScheme = useColorScheme();

  const {
    initialLatitude = '39.9042',
    initialLongitude = '116.4074',
    title = '选择位置',
    callbackUrl,
  } = params;

  const [selectedLocation, setSelectedLocation] = useState<LatLng>({
    latitude: parseFloat(initialLatitude),
    longitude: parseFloat(initialLongitude),
  });

  const [isConfirmed, setIsConfirmed] = useState(false);

  // 处理地图点击
  const handleMapPress = useCallback((event: { nativeEvent: LatLng }) => {
    const { latitude, longitude } = event.nativeEvent;
    setSelectedLocation({ latitude, longitude });
    setIsConfirmed(false);
  }, []);

  // 确认选择
  const handleConfirm = useCallback(() => {
    const result: MapPickerResult = {
      latitude: selectedLocation.latitude,
      longitude: selectedLocation.longitude,
    };

    if (callbackUrl) {
      // 如果有回调 URL，返回结果
      router.navigate({
        pathname: callbackUrl as any,
        params: {
          selectedLatitude: result.latitude.toString(),
          selectedLongitude: result.longitude.toString(),
        },
      });
    } else {
      // 否则直接返回上一页，通过 params 传递
      router.back();
      // 使用全局事件或状态管理来传递结果
      // 这里简化处理，实际项目中可以使用 EventEmitter 或全局状态
    }
  }, [selectedLocation, callbackUrl, router]);

  // 取消选择
  const handleCancel = useCallback(() => {
    router.back();
  }, [router]);

  return (
    <ThemedView style={styles.container}>
      {/* 顶部导航栏 */}
      <View
        style={[
          styles.header,
          { backgroundColor: colorScheme === 'dark' ? '#1c1c1e' : '#fff' },
        ]}>
        <TouchableOpacity onPress={handleCancel} style={styles.headerButton}>
          <IconSymbol
            name="xmark"
            size={24}
            color={colorScheme === 'dark' ? '#fff' : '#000'}
          />
        </TouchableOpacity>

        <ThemedText type="subtitle" style={styles.headerTitle}>
          {title}
        </ThemedText>

        <TouchableOpacity
          onPress={handleConfirm}
          style={[styles.headerButton, styles.confirmButton]}>
          <ThemedText style={styles.confirmText}>确定</ThemedText>
        </TouchableOpacity>
      </View>

      {/* 地图区域 */}
      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          initialCameraPosition={{
            target: selectedLocation,
            zoom: 15,
          }}
          onPress={handleMapPress}>
          <Marker
            position={selectedLocation}
            draggable
            onDragEnd={handleMapPress}
            icon={require('@/assets/images/icon.png')}
          />
        </MapView>

        {/* 中心点标记（可选，用于更精确的选择） */}
        <View style={styles.centerMarker} pointerEvents="none">
          <IconSymbol name="mappin" size={40} color="#FF6B6B" />
        </View>
      </View>

      {/* 底部信息栏 */}
      <View
        style={[
          styles.bottomBar,
          { backgroundColor: colorScheme === 'dark' ? '#1c1c1e' : '#fff' },
        ]}>
        <View style={styles.locationInfo}>
          <IconSymbol
            name="location.fill"
            size={20}
            color="#FF6B6B"
          />
          <View style={styles.coordinates}>
            <ThemedText style={styles.coordText}>
              纬度: {selectedLocation.latitude.toFixed(6)}
            </ThemedText>
            <ThemedText style={styles.coordText}>
              经度: {selectedLocation.longitude.toFixed(6)}
            </ThemedText>
          </View>
        </View>

        <TouchableOpacity
          style={styles.currentLocationButton}
          onPress={() => {
            // 获取当前位置（需要添加权限检查）
            Alert.alert('提示', '获取当前位置功能需要添加 Geolocation 权限');
          }}>
          <IconSymbol name="location.circle.fill" size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  headerButton: {
    padding: 8,
    minWidth: 60,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
  },
  confirmButton: {
    alignItems: 'flex-end',
  },
  confirmText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
  },
  mapContainer: {
    flex: 1,
    position: 'relative',
  },
  map: {
    width: width,
    height: height - 200,
  },
  centerMarker: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -20,
    marginTop: -40,
    zIndex: 10,
  },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    paddingBottom: 34,
    borderTopWidth: 1,
    borderTopColor: '#e5e5e5',
  },
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  coordinates: {
    gap: 4,
  },
  coordText: {
    fontSize: 14,
    opacity: 0.8,
  },
  currentLocationButton: {
    padding: 8,
  },
});
