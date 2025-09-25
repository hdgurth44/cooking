import React from "react";
import { Redirect, Tabs } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { View } from "react-native";
import Svg, { Path } from "react-native-svg";
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

  // Custom SVG Tab Background Component
  const TabSvgBackground = ({ color, size = 60 }) => (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 6 6"
      style={{
        alignSelf: 'center',
      }}
    >
      <Path
        d="M2.58806 1.29556C2.70193 0.38457 3.94664 0.208822 4.30829 1.05267L4.32881 1.10055C4.43713 1.35329 4.65347 1.54385 4.91787 1.61939L5.01058 1.64588C6.01768 1.93362 6.11044 3.32458 5.15047 3.7435L4.90131 3.85223C4.64194 3.96541 4.43023 4.16561 4.30275 4.41826L4.2566 4.5097C3.71836 5.57638 2.20942 5.61519 1.61706 4.57758L1.45061 4.286C1.35456 4.11776 1.20845 3.98365 1.03261 3.90234C0.176592 3.5065 0.383372 2.23518 1.32072 2.13103L1.79442 2.0784C2.20819 2.03242 2.53642 1.70866 2.58806 1.29556Z"
        fill={color}
      />
    </Svg>
  );

  // Prominent center tab button
  const ProminentTabButton = ({ focused, color }) => (
    <View
      style={{
        width: 70,
        height: 70,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: COLORS.shadow,
        shadowOffset: {
          width: 0,
          height: 6,
        },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 10,
        marginBottom: 20,
      }}
    >
      {/* Two layered SVG backgrounds for clean depth */}
      <View style={{ 
        position: 'absolute',
        width: 70,
        height: 70,
        justifyContent: 'center',
        alignItems: 'center',
        transform: [{ scale: 1.1 }] 
      }}>
        <TabSvgBackground 
          color={focused ? COLORS.primary : COLORS.border} 
          size={60} 
        />
      </View>
      <View style={{ 
        position: 'absolute',
        width: 70,
        height: 70,
        justifyContent: 'center',
        alignItems: 'center',
        transform: [{ scale: 0.9 }] 
      }}>
        <TabSvgBackground 
          color={COLORS.white} 
          size={60} 
        />
      </View>
      
      {/* Icon - Centered */}
      <View style={{
        position: 'absolute',
        width: 70,
        height: 70,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
      }}>
        <Ionicons
          name="sparkles"
          color={focused ? COLORS.primary : COLORS.textLight}
          size={28}
        />
      </View>
    </View>
  );

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
          tabBarIcon: ({ color, size, focused }) => (
            <ProminentTabButton focused={focused} color={color} />
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
