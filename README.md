# my-expo

基于 Expo Router 的多模块 React Native 工具应用，当前包含：

- `mockLocation`：Android 虚拟定位
- `lookTV`：视频站点 WebView 入口
- `moduleC`：定制模块占位

## 技术栈

- Expo 54
- React 19
- React Native 0.81
- expo-router
- Tamagui
- Zustand

## 环境准备

1. 安装依赖：`yarn install`
2. 复制环境变量模板：`cp .env.example .env`
3. 按需填写 `.env` 中的高德 Key 和模块密钥

关键环境变量：

- `EXPO_PUBLIC_AMAP_ANDROID_KEY`
- `EXPO_PUBLIC_AMAP_IOS_KEY`
- `EXPO_PUBLIC_KEY_MOCK_LOCATION`
- `EXPO_PUBLIC_KEY_LOOK_TV`
- `EXPO_PUBLIC_KEY_MODULE_C`

说明：

- Expo 只会自动暴露 `EXPO_PUBLIC_` 前缀的变量到客户端。
- 如果不改密钥配置，会使用 `.env.example` 里的演示值。
- 虚拟定位功能仅 Android 可用，并依赖开发者选项中的模拟位置权限。

## 启动方式

- 开发：`yarn start`
- Android：`yarn android`
- iOS：`yarn ios`
- Web：`yarn web`

## 构建

- Android 本地构建：`yarn build:android`
- 预览包：`yarn build:preview`
- 生产构建：`yarn build:production`

## 项目结构

```text
app/                  Expo Router 路由入口
src/modules/          业务模块页面
src/config/           项目配置
src/store/            Zustand 状态
components/           通用组件
android/ ios/         Expo prebuild 后的原生工程
```

## 访问控制

- 开发环境默认可进入所有模块。
- 生产环境需要通过密钥验证。
- 非开发环境下，验证后的用户只能进入自己对应的模块。

## 常用命令

- 重新生成原生工程：`npx expo prebuild --clean`
- 类型检查：`npx tsc --noEmit`
- 代码检查：`yarn lint`
