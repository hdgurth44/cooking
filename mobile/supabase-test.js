// Simple test file to verify Supabase connection
// Run this with: node supabase-test.js

import { supabase } from './utils/supabase.ts';

async function testSupabaseConnection() {
  try {
    console.log('Testing Supabase connection...');
    
    // Test basic connection
    const { data, error } = await supabase
      .from('recipes')
      .select('count')
      .limit(1);
    
    if (error) {
      console.error('Supabase connection error:', error);
      return false;
    }
    
    console.log('✅ Supabase connection successful!');
    console.log('Database response:', data);
    return true;
    
  } catch (err) {
    console.error('❌ Connection test failed:', err);
    return false;
  }
}

// Run the test
testSupabaseConnection().then(success => {
  if (success) {
    console.log('🎉 Ready to use Supabase in your app!');
  } else {
    console.log('🔧 Please check your Supabase configuration.');
  }
});
