import { create } from "zustand";

export type UserType = "mockLocation" | "lookTV" | "moduleC" | null;
export type DeliveryType = "normal" | "module" | null;

export interface ResolvedModuleRelease {
  id: number;
  moduleName?: string | null;
  platform: "android" | "ios" | "desktop";
  version: string;
  buildNumber: number;
  packageUrl: string;
  packageName?: string | null;
  minAppVersion?: string | null;
}

export interface ModuleCompatibility {
  supported: boolean;
  upgradeRequired: boolean;
  minAppVersion: string | null;
}

interface UserStore {
  userType: UserType;
  secretKey: string;
  isValidKey: boolean;
  error: string | null;
  deliveryType: DeliveryType;
  release: ResolvedModuleRelease | null;
  compatibility: ModuleCompatibility | null;
  downloadedBundleUri: string | null;
  downloadStatus: "idle" | "downloading" | "ready" | "error";
  setSecretKey: (key: string) => void;
  applyResolvedModule: (payload: {
    secretKey: string;
    moduleName: UserType;
    deliveryType: DeliveryType;
    release: ResolvedModuleRelease | null;
    compatibility: ModuleCompatibility | null;
  }) => void;
  setError: (error: string | null) => void;
  setDownloadState: (payload: {
    downloadedBundleUri?: string | null;
    downloadStatus: "idle" | "downloading" | "ready" | "error";
    error?: string | null;
  }) => void;
  reset: () => void;
}

export const useUserStore = create<UserStore>((set) => ({
  userType: null,
  secretKey: "",
  isValidKey: false,
  error: null,
  deliveryType: null,
  release: null,
  compatibility: null,
  downloadedBundleUri: null,
  downloadStatus: "idle",

  setSecretKey: (key) => {
    set({ secretKey: key, error: null });
  },

  applyResolvedModule: ({
    secretKey,
    moduleName,
    deliveryType,
    release,
    compatibility,
  }) => {
    set({
      secretKey,
      userType: moduleName,
      deliveryType,
      release,
      compatibility,
      downloadedBundleUri: null,
      downloadStatus: "idle",
      isValidKey: true,
      error: null,
    });
  },

  setError: (error) => {
    set({
      error,
      isValidKey: false,
    });
  },

  setDownloadState: ({ downloadedBundleUri, downloadStatus, error }) => {
    set((state) => ({
      downloadedBundleUri:
        downloadedBundleUri === undefined
          ? state.downloadedBundleUri
          : downloadedBundleUri,
      downloadStatus,
      error: error === undefined ? state.error : error,
    }));
  },

  reset: () => {
    set({
      userType: null,
      secretKey: "",
      isValidKey: false,
      error: null,
      deliveryType: null,
      release: null,
      compatibility: null,
      downloadedBundleUri: null,
      downloadStatus: "idle",
    });
  },
}));
