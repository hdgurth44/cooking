import { ClerkProvider } from "@clerk/clerk-expo";
import { tokenCache } from "@clerk/clerk-expo/token-cache";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { Alert } from "react-native";
import { useEffect } from "react";
import Constants from "expo-constants";
import SafeScreen from "../components/SafeScreen";
import ErrorBoundary from "../components/ErrorBoundary";
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

  // Validate key format but don't crash immediately
  if (!publishableKey.startsWith('pk_test_') && !publishableKey.startsWith('pk_live_')) {
    console.error('CRITICAL: Invalid Clerk key format:', publishableKey.substring(0, 10) + '...');
    Alert.alert('Configuration Error', `Invalid Clerk key format. Expected pk_test_ or pk_live_, got: ${publishableKey.substring(0, 8)}...`);
    return null;
  }

  return (
    <ErrorBoundary>
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
    </ErrorBoundary>
  );
}
