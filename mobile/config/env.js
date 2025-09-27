/**
 * Environment Configuration
 * 
 * This file provides a reliable way to access environment variables for both 
 * development and production builds using hardcoded values to avoid any 
 * environment variable resolution issues with EAS builds.
 */

const ENV = {
  development: {
    // Your actual environment values for development
    CLERK_PUBLISHABLE_KEY: 'pk_test_Y3Jpc3Atc2F0eXItNTAuY2xlcmsuYWNjb3VudHMuZGV2JA',
    SUPABASE_URL: 'https://ivvmxqqgumpczlegkaxo.supabase.co',
    SUPABASE_KEY: 'sb_publishable_vHQgaPnFH1x5PY4kDNf7Sw_V53KZeP1'
  },
  production: {
    // Use the same hardcoded values for production to avoid environment variable issues
    CLERK_PUBLISHABLE_KEY: 'pk_test_Y3Jpc3Atc2F0eXItNTAuY2xlcmsuYWNjb3VudHMuZGV2JA',
    SUPABASE_URL: 'https://ivvmxqqgumpczlegkaxo.supabase.co',
    SUPABASE_KEY: 'sb_publishable_vHQgaPnFH1x5PY4kDNf7Sw_V53KZeP1'
  }
};

// Export the appropriate environment configuration
const currentEnv = __DEV__ ? 'development' : 'production';
export default ENV[currentEnv];

// Helper function to get all environment info for debugging
export const getEnvironmentInfo = () => ({
  environment: currentEnv,
  isDevelopment: __DEV__,
  config: ENV[currentEnv],
  hasClerkKey: !!ENV[currentEnv].CLERK_PUBLISHABLE_KEY,
  clerkKeyPrefix: ENV[currentEnv].CLERK_PUBLISHABLE_KEY?.substring(0, 8)
});
