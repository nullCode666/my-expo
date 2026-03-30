import type { UserType } from "@/src/store/userStore";

type ConcreteUserType = Exclude<UserType, null>;

const DEFAULT_ACCESS_KEYS: Record<ConcreteUserType, string> = {
  mockLocation: "keyA123",
  lookTV: "keyB456",
  moduleC: "keyC789",
};

export const MODULE_ACCESS_KEYS: Record<ConcreteUserType, string> = {
  mockLocation:
    process.env.EXPO_PUBLIC_KEY_MOCK_LOCATION ?? DEFAULT_ACCESS_KEYS.mockLocation,
  lookTV: process.env.EXPO_PUBLIC_KEY_LOOK_TV ?? DEFAULT_ACCESS_KEYS.lookTV,
  moduleC: process.env.EXPO_PUBLIC_KEY_MODULE_C ?? DEFAULT_ACCESS_KEYS.moduleC,
};

export const MODULE_ACCESS_ITEMS = [
  {
    userType: "mockLocation" as const,
    label: "模块A",
    moduleName: "虚拟定位",
    key: MODULE_ACCESS_KEYS.mockLocation,
  },
  {
    userType: "lookTV" as const,
    label: "模块B",
    moduleName: "视频模块",
    key: MODULE_ACCESS_KEYS.lookTV,
  },
  {
    userType: "moduleC" as const,
    label: "模块C",
    moduleName: "定制模块C",
    key: MODULE_ACCESS_KEYS.moduleC,
  },
];

export function getUserTypeByKey(key: string): UserType {
  const trimmedKey = key.trim();

  const matchedItem = MODULE_ACCESS_ITEMS.find((item) => item.key === trimmedKey);
  return matchedItem?.userType ?? null;
}
