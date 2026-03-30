import type { UserType } from "@/src/store/userStore";
import type { AppModule } from "./types";

type AccessContext = {
  isDev: boolean;
  isValidKey: boolean;
  userType: UserType;
};

const ROUTE_BY_MODULE_NAME: Record<Exclude<UserType, null>, string> = {
  mockLocation: "/mockLocation",
  lookTV: "/lookTV",
  moduleC: "/moduleC",
};

export function hasAppAccess(isDev: boolean, isValidKey: boolean) {
  return isDev || isValidKey;
}

export function canAccessModuleRoute(
  route: string,
  { isDev, isValidKey, userType }: AccessContext,
) {
  if (isDev) return true;
  if (!isValidKey || !userType) return false;

  return ROUTE_BY_MODULE_NAME[userType] === route;
}

export function getAccessibleMenuModules(
  modules: readonly AppModule[],
  access: AccessContext,
) {
  return modules.filter((module) => canAccessModuleRoute(module.route, access));
}

export function getAccessibleHiddenModules(
  modules: readonly AppModule[],
  isDev: boolean,
  isValidKey: boolean,
) {
  if (!hasAppAccess(isDev, isValidKey)) return [];

  return modules.filter((module) => !module.devOnly || isDev);
}
