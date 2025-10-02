import "react-native-url-polyfill/auto";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient, processLock } from "@supabase/supabase-js";
import ENV from "../config/env";

const supabaseUrl = ENV.SUPABASE_URL;
const supabaseKey = ENV.SUPABASE_KEY;

// Create a safe stub that surfaces clear errors when misconfigured
const createSupabaseStub = (reason: string) => {
  const handler: ProxyHandler<any> = {
    get(_target, prop) {
      if (prop === '__isStub') return true;
      return () => {
        const message = `Supabase client is not configured: ${reason}. Check app configuration and EAS environment variables.`;
        console.error(message);
        return Promise.reject(new Error(message));
      };
    },
  };
  return new Proxy({}, handler) as any;
};

export const supabase = (supabaseUrl && supabaseKey)
  ? createClient(
      supabaseUrl,
      supabaseKey,
      {
        auth: {
          storage: AsyncStorage,
          autoRefreshToken: true,
          persistSession: true,
          detectSessionInUrl: false,
          lock: processLock,
        },
      }
    )
  : createSupabaseStub(
      !supabaseUrl && !supabaseKey
        ? 'missing SUPABASE_URL and SUPABASE_KEY'
        : !supabaseUrl
          ? 'missing SUPABASE_URL'
          : 'missing SUPABASE_KEY'
    );
