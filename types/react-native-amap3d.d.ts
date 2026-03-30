declare module "react-native-amap3d" {
  import * as React from "react";
  import type { ViewProps } from "react-native";

  export type LatLng = { latitude: number; longitude: number };

  export interface MapViewProps extends ViewProps {
    initialCameraPosition?: {
      target: LatLng;
      zoom?: number;
      tilt?: number;
      bearing?: number;
    };
    onPress?: (event: { nativeEvent: LatLng }) => void;
    children?: React.ReactNode;
  }

  export class MapView extends React.Component<MapViewProps> {}

  export interface MarkerProps {
    position: LatLng;
    draggable?: boolean;
    onDragEnd?: (event: { nativeEvent: LatLng }) => void;
    icon?: any;
  }

  export class Marker extends React.Component<MarkerProps> {}

  export const AMapSdk: {
    init: (key: string) => void;
  };
}

