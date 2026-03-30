import Constants from "expo-constants";
import { Platform } from "react-native";

import type {
  DeliveryType,
  ModuleCompatibility,
  ResolvedModuleRelease,
  UserType,
} from "@/src/store/userStore";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL?.trim();

type ResolveModuleResponse = {
  valid: boolean;
  message?: string;
  deliveryType?: DeliveryType;
  moduleName?: string | null;
  release?: ResolvedModuleRelease | null;
  compatibility?: ModuleCompatibility | null;
};

export function getCurrentAppVersion() {
  return Constants.expoConfig?.version ?? "0.0.0";
}

export function getUpgradeUrl() {
  return process.env.EXPO_PUBLIC_APP_UPGRADE_URL?.trim() || null;
}

export function resolveModuleRoute(moduleName: UserType) {
  switch (moduleName) {
    case "mockLocation":
      return "/mockLocation";
    case "lookTV":
      return "/lookTV";
    case "moduleC":
      return "/moduleC";
    default:
      return null;
  }
}

export function normalizeModuleName(moduleName?: string | null): UserType {
  switch (moduleName?.trim()) {
    case "mockLocation":
      return "mockLocation";
    case "lookTV":
      return "lookTV";
    case "moduleC":
      return "moduleC";
    default:
      return null;
  }
}

export async function resolveModuleByKey(secretKey: string) {
  if (!API_BASE_URL) {
    throw new Error("未配置 EXPO_PUBLIC_API_BASE_URL");
  }

  const platform = Platform.OS === "ios" ? "ios" : "android";

  const response = await fetch(`${API_BASE_URL}/api/apikey/resolve-module`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      key: secretKey.trim(),
      platform,
      currentAppVersion: getCurrentAppVersion(),
    }),
  });

  if (!response.ok) {
    throw new Error(`请求失败: ${response.status}`);
  }

  const payload = (await response.json()) as ResolveModuleResponse;
  const moduleName = normalizeModuleName(payload.moduleName);

  return {
    ...payload,
    moduleName,
    route: resolveModuleRoute(moduleName),
  };
}
