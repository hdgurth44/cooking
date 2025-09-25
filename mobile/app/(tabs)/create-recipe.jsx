import { View, Text, ScrollView, TouchableOpacity, Linking } from 'react-native';
import React from 'react';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { sharedStyles } from '../../assets/styles/shared.styles';

const createRecipe = () => {
  const handleMessageHarry = () => {
    Linking.openURL('mailto:hdgurth@gmail.com');
  };

  return (
    <View style={sharedStyles.container}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={sharedStyles.scrollContent}
      >
        {/* Header - same style as cart.jsx */}
        <View style={sharedStyles.welcomeSection}>
          <Image
            source={require("../../assets/images/pork.png")}
            style={{ width: 100, height: 100 }}
            contentFit="contain"
          />
          <Text style={sharedStyles.welcomeText}>Add recipe</Text>
        </View>

        {/* WIP Message */}
        <View style={sharedStyles.centerContent}>
          <Text style={sharedStyles.messageTitle}>Work in progress!</Text>
          <Text style={sharedStyles.messageDescription}>
            Write Harry directly, if you want to add a recipe in the meantime.
          </Text>
          
          {/* Message Harry Button */}
          <TouchableOpacity 
            style={sharedStyles.primaryButton}
            onPress={handleMessageHarry}
            activeOpacity={0.7}
          >
            <Ionicons name="mail-outline" size={20} color={COLORS.white} />
            <Text style={sharedStyles.primaryButtonText}>Message Harry</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};


export default createRecipe;