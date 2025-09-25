import React from "react";
import { Redirect, Tabs } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { COLORS } from "../../constants/colors";

const TabsLayout = () => {
  const { isSignedIn } = useAuth();

  if (!isSignedIn) {
    return <Redirect href={"/(auth)/auth"} />;
  }

  // Custom gradient background component for tab bar
  const TabBarBackground = () => {
    // Convert hex background color to RGB for gradient
    const hexToRgb = (hex) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      } : null;
    };

    const bgColor = hexToRgb(COLORS.background);
    const baseColor = bgColor ? `${bgColor.r}, ${bgColor.g}, ${bgColor.b}` : '255, 255, 255';

    return (
      <LinearGradient
        colors={[
          `rgba(${baseColor}, 0)`,
          `rgba(${baseColor}, 0.7)`,
          `rgba(${baseColor}, 0.95)`
        ]}
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 0,
          height: '100%',
        }}
      />
    );
  };

  return (
    <Tabs 
    screenOptions={{
      headerShown: false,
      tabBarActiveTintColor: COLORS.primary,
      tabBarInactiveTintColor: COLORS.textLight,
      tabBarBackground: TabBarBackground,
      tabBarShowLabel: false,
      tabBarStyle: {
        backgroundColor: 'transparent',
        borderTopWidth: 0,
        paddingTop: 35,
        paddingBottom: 0,
        height: 90,
        position: 'absolute',
        elevation: 0,
        shadowOpacity: 0,
      },
    }}>
      {/* Home */}
      <Tabs.Screen
        name="index"
        options={{
          title: "",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="restaurant" color={color} size={size + 4} />
          ),
        }}
      />
      {/* Search */}
      <Tabs.Screen
        name="search"
        options={{
          title: "",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="search" color={color} size={size + 4} />
          ),
        }}
      />
      {/* Create recipe */}
      <Tabs.Screen
        name="create-recipe"
        options={{
          title: "",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="add-circle" color={color} size={size + 4} />
          ),
        }}
      />
      {/* Shopping List */}
      <Tabs.Screen
        name="cart"
        options={{
          title: "",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="cart" color={color} size={size + 4} />
          ),
        }}
      />
      {/* Favorites */}
      <Tabs.Screen
        name="favorites"
        options={{
          title: "",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="heart" color={color} size={size + 4} />
          ),
        }}
      />
    </Tabs>
  );
};

export default TabsLayout;
