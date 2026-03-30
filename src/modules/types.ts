export type ModuleId =
  | "mockLocation"
  | "video"
  | "moduleC"
  | "custom"
  | "hiddenHub";

export type ModuleVisibility = "menu" | "hidden";

export interface AppModule {
  id: ModuleId;
  title: string;
  subtitle?: string;
  route: string;
  visibility: ModuleVisibility;
  color?: string;
  icon?: string;
  /**
   * If true, module is only accessible in dev builds unless a valid key is present.
   */
  devOnly?: boolean;
}

