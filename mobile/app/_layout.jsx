import { ClerkProvider } from "@clerk/clerk-expo";
import { tokenCache } from "@clerk/clerk-expo/token-cache";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { Alert } from "react-native";
import { useEffect } from "react";
import SafeScreen from "../components/SafeScreen";
import StableErrorBoundary from "../components/StableErrorBoundary";
import { FONT_ASSETS } from "../constants/fonts";
import { logEnvironmentStatus } from "../utils/envValidation";
import ENV, { getEnvironmentInfo } from "../config/env";

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts(FONT_ASSETS);

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  // Log environment status on app startup for debugging
  useEffect(() => {
    logEnvironmentStatus();

    // Add global error handler for production
    if (!__DEV__) {
      const originalHandler = global.ErrorUtils.getGlobalHandler();
      global.ErrorUtils.setGlobalHandler((error, isFatal) => {
        console.error('=== GLOBAL ERROR HANDLER ===');
        console.error('Error:', error);
        console.error('Is Fatal:', isFatal);
        console.error('Timestamp:', new Date().toISOString());
        console.error('============================');

        // Call the original handler
        originalHandler(error, isFatal);
      });
    }
  }, []);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  // Get the publishable key from our environment config
  const publishableKey = ENV.CLERK_PUBLISHABLE_KEY;

  // Enhanced debugging for environment configuration
  console.log('=== ENVIRONMENT DEBUG START ===');
  console.log('Environment Info:', getEnvironmentInfo());
  console.log('Raw publishableKey:', publishableKey);
  console.log('=== ENVIRONMENT DEBUG END ===');

  if (!publishableKey) {
    console.error('CRITICAL: Missing Clerk publishable key');
    // Don't throw immediately in debug, just log and continue with a fallback
    Alert.alert('Configuration Error', 'Missing Clerk publishable key. Check console logs.');
    return null;
  }

  // Validate key format and catch common configuration errors
  const isValidKeyFormat = publishableKey.startsWith('pk_test_') || publishableKey.startsWith('pk_live_');
  const isEnvVarReference = publishableKey.includes('@env:') || publishableKey.includes('process.env') ||
                           publishableKey.includes('EXPO_PUBLIC_');

  if (!isValidKeyFormat || isEnvVarReference) {
    console.error('CRITICAL: Invalid Clerk key format or unresolved environment variable');
    console.error('Received key:', publishableKey.substring(0, 20) + '...');

    let errorMessage = 'Invalid Clerk key format.';
    if (isEnvVarReference) {
      errorMessage = 'Environment variable not resolved. The app.config.js may not be loading .env properly.';
    } else {
      errorMessage = `Expected pk_test_ or pk_live_, got: ${publishableKey.substring(0, 15)}...`;
    }

    Alert.alert('Configuration Error', errorMessage);
    return null;
  }

  return (
    <StableErrorBoundary>
      <ClerkProvider 
        publishableKey={publishableKey}
        tokenCache={tokenCache}
      >
        <SafeScreen>
          <StatusBar style="dark" />
          <Stack
            screenOptions={{
              headerShown: false,
              gestureEnabled: true,
              gestureDirection: "horizontal",
            }}
          />
        </SafeScreen>
      </ClerkProvider>
    </StableErrorBoundary>
  );
}
