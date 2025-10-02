/**
 * Centralized Environment Configuration (Expo best practices)
 * - Reads from app.config.js extra via expo-constants
 * - Provides safe fallbacks in development
 * - Avoids importing expo-updates (which can break eager production bundling)
 */
import Constants from 'expo-constants';

const readExtra = () => {
  // Prefer expoConfig.extra; fall back to classic manifest extra if present
  const fromExpoConfig = Constants?.expoConfig?.extra || null;
  const fromManifest = Constants?.manifest?.extra || null;
  return fromExpoConfig || fromManifest || {};
};

const extra = readExtra();

const isDev = __DEV__;
const appEnv = extra.appEnv || (isDev ? 'development' : 'production');

// Safe getters with optional development defaults
const get = (value, devFallback = undefined) => {
  if (value && String(value).trim() !== '') return value;
  return isDev ? devFallback : undefined;
};

const ENV = {
  APP_ENV: appEnv,
  CLERK_PUBLISHABLE_KEY: get(
    extra.clerkPublishableKey,
    // Dev fallback (only used in dev)
    'pk_test_Y3Jpc3Atc2F0eXItNTAuY2xlcmsuYWNjb3VudHMuZGV2JA'
  ),
  SUPABASE_URL: get(
    extra.supabaseUrl,
    'https://ivvmxqqgumpczlegkaxo.supabase.co'
  ),
  SUPABASE_KEY: get(
    extra.supabaseKey,
    'sb_publishable_vHQgaPnFH1x5PY4kDNf7Sw_V53KZeP1'
  ),
};

export default ENV;

export const getEnvironmentInfo = () => ({
  environment: ENV.APP_ENV,
  isDevelopment: isDev,
  config: {
    hasClerkKey: !!ENV.CLERK_PUBLISHABLE_KEY,
    hasSupabaseUrl: !!ENV.SUPABASE_URL,
    hasSupabaseKey: !!ENV.SUPABASE_KEY,
  },
  preview: {
    clerkKeyPrefix: ENV.CLERK_PUBLISHABLE_KEY?.substring(0, 8),
    supabaseUrl: ENV.SUPABASE_URL?.substring(0, 32),
  },
});
