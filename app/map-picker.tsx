import { Header } from "@/components/header";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { LatLng, MapView, Marker } from "react-native-amap3d";

export default function MapPickerPage() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const initialLatitude: any = params.initialLatitude || 39.91095;
  const initialLongitude: any = params.initialLongitude || 116.37296;
  const title = (params.title as string) || "选择位置";

  const [selectedLocation, setSelectedLocation] = useState<LatLng>({
    latitude: parseFloat(initialLatitude),
    longitude: parseFloat(initialLongitude),
  });

  // 处理地图点击
  const handleMapPress = useCallback((event: { nativeEvent: LatLng }) => {
    console.log(event.nativeEvent);

    const { latitude, longitude } = event.nativeEvent;
    setSelectedLocation({ latitude, longitude });
  }, []);

  // 确认选择
  const handleConfirm = useCallback(() => {
    router.navigate({
      pathname: "/moduleA",
      params: {
        selectedLatitude: selectedLocation.latitude.toString(),
        selectedLongitude: selectedLocation.longitude.toString(),
      },
    });
  }, [selectedLocation, router]);

  // 右侧确认按钮
  const RightButton = () => (
    <TouchableOpacity onPress={handleConfirm}>
      <View style={styles.confirmButton}>
        <Text style={styles.confirmText}>确定</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Header
        title={title}
        showBorder={true}
        rightComponent={<RightButton />}
        onBackPress={() => router.back()}
      />

      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          initialCameraPosition={{
            target: selectedLocation,
            zoom: 15,
          }}
          onPress={handleMapPress}
        >
          <Marker
            position={selectedLocation}
            draggable
            onDragEnd={handleMapPress}
            icon={require("@/assets/images/location_location.png")}
          />
        </MapView>
      </View>

      {/* 底部坐标显示 */}
      <View style={styles.bottomBar}>
        <View>
          <Text style={styles.coordText}>
            纬度: {selectedLocation.latitude.toFixed(6)}
          </Text>
          <Text style={styles.coordText}>
            经度: {selectedLocation.longitude.toFixed(6)}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mapContainer: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  confirmButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  confirmText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  bottomBar: {
    backgroundColor: "#fff",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#e5e5e5",
  },
  coordText: {
    fontSize: 14,
    color: "#333",
    marginBottom: 4,
  },
});
