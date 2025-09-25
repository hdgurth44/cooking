import { View, Text, ScrollView, TouchableOpacity, Linking } from 'react-native';
import React from 'react';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { homeStyles } from '../../assets/styles/home.styles';

const createRecipe = () => {
  const handleMessageHarry = () => {
    Linking.openURL('mailto:hdgurth@gmail.com');
  };

  return (
    <View style={homeStyles.container}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header - same style as cart.jsx */}
        <View style={homeStyles.welcomeSection}>
          <Image
            source={require("../../assets/images/pork.png")}
            style={{ width: 100, height: 100 }}
            contentFit="contain"
          />
          <Text style={homeStyles.welcomeText}>Add recipe</Text>
        </View>

        {/* WIP Message */}
        <View style={styles.wipContainer}>
          <Text style={styles.wipTitle}>Work in progress!</Text>
          <Text style={styles.wipDescription}>
            Write Harry direclty, if you want to add a recipe in the meantime.
          </Text>
          
          {/* Message Harry Button */}
          <TouchableOpacity 
            style={styles.messageButton}
            onPress={handleMessageHarry}
            activeOpacity={0.7}
          >
            <Ionicons name="mail-outline" size={20} color={COLORS.white} />
            <Text style={styles.messageButtonText}>Message Harry</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = {
  scrollContent: {
    paddingBottom: 120,
  },
  wipContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    paddingHorizontal: 32,
  },
  wipTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 12,
    textAlign: 'center',
  },
  wipDescription: {
    fontSize: 16,
    color: COLORS.textLight,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  messageButton: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    gap: 8,
  },
  messageButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.white,
  },
};

export default createRecipe;