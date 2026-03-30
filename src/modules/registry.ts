import type { AppModule, ModuleId } from "./types";

export const MODULES: readonly AppModule[] = [
  {
    id: "mockLocation",
    title: "虚拟定位",
    subtitle: "Android 位置模拟",
    route: "/mockLocation",
    visibility: "menu",
    icon: "location.fill",
    color: "#FF6B6B",
  },
  {
    id: "video",
    title: "视频模块",
    subtitle: "WebView 视频站点",
    route: "/lookTV",
    visibility: "menu",
    icon: "play.rectangle.fill",
    color: "#4ECDC4",
  },
  {
    id: "moduleC",
    title: "定制模块C",
    subtitle: "目标功能",
    route: "/moduleC",
    visibility: "menu",
    icon: "target",
    color: "#95E1D3",
  },
  {
    id: "custom",
    title: "定制化模块",
    subtitle: "按需扩展",
    route: "/custom",
    visibility: "hidden",
    icon: "wand.and.stars",
    color: "#667eea",
    devOnly: true,
  },
  {
    id: "hiddenHub",
    title: "隐藏模块入口",
    subtitle: "内部/特定模块集合",
    route: "/hidden",
    visibility: "hidden",
    icon: "lock.fill",
    color: "#111827",
    devOnly: true,
  },
] as const;

export function getModulesByVisibility(visibility: "menu" | "hidden") {
  return MODULES.filter((m) => m.visibility === visibility);
}

export function getModuleById(id: ModuleId) {
  return MODULES.find((m) => m.id === id);
}

