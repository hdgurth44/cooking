import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Constants from 'expo-constants';
import ENV, { getEnvironmentInfo } from '../config/env';

/**
 * Debug component to help identify configuration issues in TestFlight builds
 * This component should be removed in production builds
 */
const DebugInfo = ({ visible = false }) => {
  if (!visible && !__DEV__) {
    return null;
  }

  const envInfo = getEnvironmentInfo();
  const publishableKey = ENV.CLERK_PUBLISHABLE_KEY;
  const supabaseUrl = ENV.SUPABASE_URL;
  const supabaseKey = ENV.SUPABASE_KEY;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Debug Info</Text>
      <Text style={styles.item}>
        Environment: {envInfo.environment} ({envInfo.isDevelopment ? 'DEV' : 'PROD'})
      </Text>
      <Text style={styles.item}>
        App Version: {Constants.expoConfig?.version || 'Unknown'}
      </Text>
      <Text style={styles.item}>
        Clerk Key: {publishableKey ? 'Present' : 'Missing'}
      </Text>
      <Text style={styles.item}>
        Supabase URL: {supabaseUrl ? 'Present' : 'Missing'}
      </Text>
      <Text style={styles.item}>
        Supabase Key: {supabaseKey ? 'Present' : 'Missing'}
      </Text>
      {publishableKey && (
        <Text style={styles.item}>
          Clerk Key Preview: {publishableKey.substring(0, 20)}...
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 50,
    right: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    padding: 10,
    borderRadius: 5,
    zIndex: 1000,
  },
  title: {
    color: 'white',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  item: {
    color: 'white',
    fontSize: 12,
    marginBottom: 2,
  },
});

export default DebugInfo;
