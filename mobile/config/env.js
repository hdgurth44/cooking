/**
 * Environment Configuration
 *
 * This file provides a reliable way to access environment variables for both
 * development and production builds. Uses process.env with fallbacks to ensure
 * consistency with EAS build environment variable system.
 */

// Get environment variables with fallback values for safety
const getEnvVar = (key, fallback = null) => {
  // ESLint safe way to access process.env dynamically
  const env = process.env;
  const value = env[key];
  if (!value && fallback === null) {
    console.warn(`Environment variable ${key} is not set`);
  }
  return value || fallback;
};

const ENV = {
  CLERK_PUBLISHABLE_KEY: getEnvVar('EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY', 'pk_test_Y3Jpc3Atc2F0eXItNTAuY2xlcmsuYWNjb3VudHMuZGV2JA'),
  SUPABASE_URL: getEnvVar('EXPO_PUBLIC_SUPABASE_URL', 'https://ivvmxqqgumpczlegkaxo.supabase.co'),
  SUPABASE_KEY: getEnvVar('EXPO_PUBLIC_SUPABASE_KEY', 'sb_publishable_vHQgaPnFH1x5PY4kDNf7Sw_V53KZeP1')
};

export default ENV;

// Helper function to get all environment info for debugging
export const getEnvironmentInfo = () => ({
  environment: __DEV__ ? 'development' : 'production',
  isDevelopment: __DEV__,
  config: ENV,
  hasClerkKey: !!ENV.CLERK_PUBLISHABLE_KEY,
  clerkKeyPrefix: ENV.CLERK_PUBLISHABLE_KEY?.substring(0, 8)
});
