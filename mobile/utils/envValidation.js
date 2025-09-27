/**
 * Environment Variable Validation Utilities
 * 
 * This module provides utilities to validate that required environment variables
 * are properly configured, especially important for TestFlight and production builds.
 */

/**
 * Validates that all required Clerk environment variables are present
 * @returns {Object} Validation result with isValid boolean and missing array
 */
export const validateClerkEnvironment = () => {
  const required = {
    'EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY': process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY,
  };

  const missing = [];
  const present = {};

  Object.entries(required).forEach(([key, value]) => {
    if (!value || value.trim() === '') {
      missing.push(key);
    } else {
      present[key] = value;
    }
  });

  return {
    isValid: missing.length === 0,
    missing,
    present,
    details: {
      clerkKey: present.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY ? 
        `${present.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY.substring(0, 20)}...` : 
        'Missing'
    }
  };
};

/**
 * Validates that all required Supabase environment variables are present
 * @returns {Object} Validation result with isValid boolean and missing array
 */
export const validateSupabaseEnvironment = () => {
  const required = {
    'EXPO_PUBLIC_SUPABASE_URL': process.env.EXPO_PUBLIC_SUPABASE_URL,
    'EXPO_PUBLIC_SUPABASE_KEY': process.env.EXPO_PUBLIC_SUPABASE_KEY,
  };

  const missing = [];
  const present = {};

  Object.entries(required).forEach(([key, value]) => {
    if (!value || value.trim() === '') {
      missing.push(key);
    } else {
      present[key] = value;
    }
  });

  return {
    isValid: missing.length === 0,
    missing,
    present,
    details: {
      supabaseUrl: present.EXPO_PUBLIC_SUPABASE_URL || 'Missing',
      supabaseKey: present.EXPO_PUBLIC_SUPABASE_KEY ? 
        `${present.EXPO_PUBLIC_SUPABASE_KEY.substring(0, 20)}...` : 
        'Missing'
    }
  };
};

/**
 * Validates all required environment variables for the app
 * @returns {Object} Complete validation result
 */
export const validateAllEnvironment = () => {
  const clerk = validateClerkEnvironment();
  const supabase = validateSupabaseEnvironment();

  return {
    isValid: clerk.isValid && supabase.isValid,
    clerk,
    supabase,
    allMissing: [...clerk.missing, ...supabase.missing]
  };
};

/**
 * Logs environment validation results to console
 * Useful for debugging TestFlight and production issues
 */
export const logEnvironmentStatus = () => {
  const validation = validateAllEnvironment();
  
  console.log('=== Environment Validation ===');
  console.log('Overall Status:', validation.isValid ? '✅ Valid' : '❌ Invalid');
  
  if (!validation.isValid) {
    console.log('Missing Variables:', validation.allMissing);
  }
  
  console.log('Clerk Status:', validation.clerk.isValid ? '✅ Valid' : '❌ Invalid');
  if (!validation.clerk.isValid) {
    console.log('Missing Clerk Variables:', validation.clerk.missing);
  } else {
    console.log('Clerk Key Preview:', validation.clerk.details.clerkKey);
  }
  
  console.log('Supabase Status:', validation.supabase.isValid ? '✅ Valid' : '❌ Invalid');
  if (!validation.supabase.isValid) {
    console.log('Missing Supabase Variables:', validation.supabase.missing);
  } else {
    console.log('Supabase URL:', validation.supabase.details.supabaseUrl);
    console.log('Supabase Key Preview:', validation.supabase.details.supabaseKey);
  }
  
  console.log('==============================');
  
  return validation;
};
