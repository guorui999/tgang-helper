# 构建 APK / IPA

## 自动构建（推荐）

推送到 GitHub 后，Actions 自动构建 APK：

1. 推送到 GitHub
2. 打开 https://github.com/guorui999/tgang-helper/actions
3. 点最新 workflow → artifacts 下载 `tgang-helper-apk.zip`

## 本地构建 Android

### 前置条件

- Node.js 20+
- Android Studio（含 Android SDK）
- JDK 17+

### 步骤

```bash
# 1. 安装依赖
npm install

# 2. 构建 Web 静态文件
npm run build:web

# 3. 同步到 Capacitor
npx cap sync android

# 4. 用 Android Studio 打开并构建
npx cap open android
# → Android Studio 中点击 Build → Build Bundle(s) / APK → Build APK
```

### 一条命令构建

```bash
npm run build:android
```

APK 输出位置: `android/app/build/outputs/apk/debug/app-debug.apk`

## 构建 iOS（需要 macOS + Xcode）

```bash
# 安装依赖
npm install

# 构建并同步到 iOS
npm run build:ios
# → Xcode 自动打开 → 选择设备 → Build
```

## 发布到应用商店

### Google Play

```bash
# 生成签名 AAB
cd android && ./gradlew bundleRelease
```

然后在 `android/app/build/outputs/bundle/release/app-release.aab` 获取 AAB 文件。

### App Store

在 Xcode 中: Product → Archive → Distribute App
