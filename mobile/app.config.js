import 'dotenv/config'; // Load .env file before accessing process.env

// Centralized Expo config with environment-aware extras
// Uses EAS Build profile (development/preview/production) or APP_ENV to determine environment
export default ({ config }) => {
  const buildProfile = process.env.EAS_BUILD_PROFILE;
  const appEnv = process.env.APP_ENV ||
    (buildProfile === 'production' ? 'production' : buildProfile === 'preview' ? 'staging' : 'development');

  // Read public env at build time (EXPO_PUBLIC_*) and pass through extra for runtime access
  const clerkPublishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY || '';
  const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
  const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_KEY || '';

  return {
    expo: {
      name: "mobile",
      slug: "mobile",
      version: "1.0.0",
      orientation: "portrait",
      icon: "./assets/images/icon.png",
      scheme: "mobile",
      userInterfaceStyle: "automatic",
      newArchEnabled: true,
      ios: {
        supportsTablet: true,
        bundleIdentifier: "com.hdgurth.yummay",
        infoPlist: {
          ITSAppUsesNonExemptEncryption: false,
        },
      },
      android: {
        adaptiveIcon: {
          backgroundColor: "#E6F4FE",
          foregroundImage: "./assets/images/android-icon-foreground.png",
          backgroundImage: "./assets/images/android-icon-background.png",
          monochromeImage: "./assets/images/android-icon-monochrome.png",
        },
        edgeToEdgeEnabled: true,
        predictiveBackGestureEnabled: false,
        package: "com.yummay",
      },
      web: {
        output: "static",
        favicon: "./assets/images/favicon.ico",
      },
      plugins: [
        "expo-router",
        [
          "expo-splash-screen",
          {
            image: "./assets/images/android-icon-foreground.png",
            imageWidth: 200,
            resizeMode: "contain",
            backgroundColor: "#0F0E10", // Using creme theme background color
            dark: {
              backgroundColor: "#0F0E10", // Same color for dark mode consistency
            },
          },
        ],
      ],
      experiments: {
        typedRoutes: true,
      },
      extra: {
        router: {},
        appEnv,
        clerkPublishableKey,
        supabaseUrl,
        supabaseKey,
        eas: {
          projectId: "b4067ce8-8122-49f9-8a4b-7c19ef6cf8e7",
        },
      },
    },
  };
};
