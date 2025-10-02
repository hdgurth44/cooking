/**
 * Environment Variable Validation Utilities (Centralized)
 * Validates values coming from config/env (Expo extras), not process.env
 */
import ENV from '../config/env';

export const validateClerkEnvironment = () => {
  const value = ENV.CLERK_PUBLISHABLE_KEY;
  const missing = !value || value.trim() === '';
  return {
    isValid: !missing,
    missing: missing ? ['CLERK_PUBLISHABLE_KEY'] : [],
    present: missing ? {} : { CLERK_PUBLISHABLE_KEY: value },
    details: {
      clerkKey: value ? `${value.substring(0, 20)}...` : 'Missing',
    },
  };
};

export const validateSupabaseEnvironment = () => {
  const url = ENV.SUPABASE_URL;
  const key = ENV.SUPABASE_KEY;
  const missing = [];
  const present = {};
  if (!url || url.trim() === '') missing.push('SUPABASE_URL'); else present.SUPABASE_URL = url;
  if (!key || key.trim() === '') missing.push('SUPABASE_KEY'); else present.SUPABASE_KEY = key;

  return {
    isValid: missing.length === 0,
    missing,
    present,
    details: {
      supabaseUrl: present.SUPABASE_URL || 'Missing',
      supabaseKey: present.SUPABASE_KEY ? `${present.SUPABASE_KEY.substring(0, 20)}...` : 'Missing',
    },
  };
};

export const validateAllEnvironment = () => {
  const clerk = validateClerkEnvironment();
  const supabase = validateSupabaseEnvironment();
  return {
    isValid: clerk.isValid && supabase.isValid,
    clerk,
    supabase,
    allMissing: [...clerk.missing, ...supabase.missing],
  };
};

export const logEnvironmentStatus = () => {
  const validation = validateAllEnvironment();
  console.log('=== Environment Validation ===');
  console.log('Environment:', ENV.APP_ENV);
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
