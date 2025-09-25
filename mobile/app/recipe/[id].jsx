import { View, Text, Alert, ScrollView, TouchableOpacity, Modal } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-expo";
import { SupabaseAPI } from "../../services/supabaseAPI";
import LoadingSpinner from "../../components/LoadingSpinner";
import { Image } from "expo-image";

import { recipeDetailStyles } from "../../assets/styles/recipe-detail.styles";
import { LinearGradient } from "expo-linear-gradient";
import { COLORS } from "../../constants/colors";

import { Ionicons } from "@expo/vector-icons";
import { WebView } from "react-native-webview";

const RecipeDetailScreen = () => {
  const { id: recipeId } = useLocalSearchParams();
  const router = useRouter();

  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showWebView, setShowWebView] = useState(false);
  const [webViewUrl, setWebViewUrl] = useState("");

  const { user } = useUser();
  const userId = user?.id;

  useEffect(() => {
    const loadRecipeDetail = async () => {
      setLoading(true);
      try {
        const recipeData = await SupabaseAPI.getRecipeById(recipeId, userId);
        if (recipeData) {
          const transformedRecipe = SupabaseAPI.transformRecipeData(recipeData);
          setRecipe(transformedRecipe);

          // Check if recipe is favorited
          if (userId) {
            const favoriteStatus = await SupabaseAPI.isFavorite(recipeId, userId);
            setIsSaved(favoriteStatus);
          }
        }
      } catch (error) {
        console.error("Error loading recipe detail:", error);
      } finally {
        setLoading(false);
      }
    };

    loadRecipeDetail();
  }, [recipeId, userId]);

  const handleOpenOriginalRecipe = (url) => {
    if (!url) return;
    setWebViewUrl(url);
    setShowWebView(true);
  };

  const handleToggleSave = async () => {
    if (!userId) {
      Alert.alert("Error", "Please log in to save favorites");
      return;
    }

    setIsSaving(true);

    try {
      const newFavoriteStatus = !isSaved;
      const result = await SupabaseAPI.toggleFavorite(recipeId, userId, newFavoriteStatus);
      
      if (result) {
        setIsSaved(newFavoriteStatus);
        Alert.alert(
          "Success", 
          newFavoriteStatus ? "Recipe added to favorites!" : "Recipe removed from favorites!"
        );
      } else {
        Alert.alert("Error", "Failed to update favorites. Please try again.");
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
      Alert.alert("Error", "Failed to update favorites. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) return <LoadingSpinner message="Loading recipe details..." />;

  return (
    <View style={recipeDetailStyles.container}>
      <ScrollView>
        {/* HEADER */}
        <View style={recipeDetailStyles.headerContainer}>
          <View style={recipeDetailStyles.imageContainer}>
            <Image
              source={{ uri: recipe.image }}
              style={recipeDetailStyles.headerImage}
              contentFit="cover"
            />
          </View>

          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.5)", "rgba(0,0,0,0.9)"]}
            style={recipeDetailStyles.gradientOverlay}
          />

          <View style={recipeDetailStyles.floatingButtons}>
            <TouchableOpacity
              style={recipeDetailStyles.floatingButton}
              onPress={() => router.back()}
            >
              <Ionicons name="arrow-back" size={24} color={COLORS.white} />
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                recipeDetailStyles.floatingButton,
                { backgroundColor: isSaving ? COLORS.gray : COLORS.primary },
              ]}
              onPress={handleToggleSave}
              disabled={isSaving}
            >
              <Ionicons
                name={isSaving ? "hourglass" : isSaved ? "bookmark" : "bookmark-outline"}
                size={24}
                color={COLORS.white}
              />
            </TouchableOpacity>
          </View>

          {/* Title Section */}
          <View style={recipeDetailStyles.titleSection}>
            <View style={recipeDetailStyles.categoryBadge}>
              <Text style={recipeDetailStyles.categoryText}>{recipe.category}</Text>
            </View>
            <Text style={recipeDetailStyles.recipeTitle}>{recipe.title}</Text>
            {recipe.area && (
              <View style={recipeDetailStyles.locationRow}>
                <Ionicons name="location" size={16} color={COLORS.white} />
                <Text style={recipeDetailStyles.locationText}>{recipe.area} Cuisine</Text>
              </View>
            )}
          </View>
        </View>

        <View style={recipeDetailStyles.contentSection}>
          {/* QUICK STATS */}
          <View style={recipeDetailStyles.statsContainer}>
            <View style={recipeDetailStyles.statCard}>
              <LinearGradient
                colors={["#FF6B6B", "#FF8E53"]}
                style={recipeDetailStyles.statIconContainer}
              >
                <Ionicons name="time" size={20} color={COLORS.white} />
              </LinearGradient>
              <Text style={recipeDetailStyles.statValue}>{recipe.cookTime}</Text>
              <Text style={recipeDetailStyles.statLabel}>Prep Time</Text>
            </View>

            <View style={recipeDetailStyles.statCard}>
              <LinearGradient
                colors={["#4ECDC4", "#44A08D"]}
                style={recipeDetailStyles.statIconContainer}
              >
                <Ionicons name="people" size={20} color={COLORS.white} />
              </LinearGradient>
              <Text style={recipeDetailStyles.statValue}>{recipe.servings}</Text>
              <Text style={recipeDetailStyles.statLabel}>Servings</Text>
            </View>
          </View>

          {/* OVERVIEW SECTION */}
          <View style={recipeDetailStyles.sectionContainer}>
            <View style={recipeDetailStyles.sectionTitleRow}>
              <LinearGradient
                colors={["#4ECDC4", "#44A08D"]}
                style={recipeDetailStyles.sectionIcon}
              >
                <Ionicons name="information-circle" size={16} color={COLORS.white} />
              </LinearGradient>

              <Text style={recipeDetailStyles.sectionTitle}>Overview</Text>
            </View>

            {/* Summary/Description with inline link */}
            {(recipe.description || recipe.youtubeUrl) && (
              <View style={recipeDetailStyles.overviewCard}>
                {recipe.description && (
                  <Text style={recipeDetailStyles.descriptionText}>{recipe.description}</Text>
                )}
                {recipe.youtubeUrl && (
                  <TouchableOpacity
                    style={recipeDetailStyles.inlineLinkContainer}
                    onPress={() => handleOpenOriginalRecipe(recipe.youtubeUrl)}
                  >
                    <Text style={recipeDetailStyles.inlineLinkText}>See original recipe</Text>
                    <Ionicons name="arrow-forward" size={14} color={COLORS.primary} />
                  </TouchableOpacity>
                )}
              </View>
            )}
          </View>

          {/* INGREDIENTS SECTION */}
          <View style={recipeDetailStyles.sectionContainer}>
            <View style={recipeDetailStyles.sectionTitleRow}>
              <LinearGradient
                colors={[COLORS.primary, COLORS.primary + "80"]}
                style={recipeDetailStyles.sectionIcon}
              >
                <Ionicons name="list" size={16} color={COLORS.white} />
              </LinearGradient>
              <Text style={recipeDetailStyles.sectionTitle}>Ingredients</Text>
              <View style={recipeDetailStyles.countBadge}>
                <Text style={recipeDetailStyles.countText}>{recipe.ingredients.length}</Text>
              </View>
            </View>

            <View style={recipeDetailStyles.ingredientsGrid}>
              {recipe.ingredients.map((ingredient, index) => (
                <View key={index} style={recipeDetailStyles.ingredientCard}>
                  <View style={recipeDetailStyles.ingredientNumber}>
                    <Text style={recipeDetailStyles.ingredientNumberText}>{index + 1}</Text>
                  </View>
                  <Text style={recipeDetailStyles.ingredientText}>{ingredient}</Text>
                  <View style={recipeDetailStyles.ingredientCheck}>
                    <Ionicons name="checkmark-circle-outline" size={20} color={COLORS.textLight} />
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* INSTRUCTIONS SECTION */}
          <View style={recipeDetailStyles.sectionContainer}>
            <View style={recipeDetailStyles.sectionTitleRow}>
              <LinearGradient
                colors={["#9C27B0", "#673AB7"]}
                style={recipeDetailStyles.sectionIcon}
              >
                <Ionicons name="book" size={16} color={COLORS.white} />
              </LinearGradient>
              <Text style={recipeDetailStyles.sectionTitle}>Instructions</Text>
              <View style={recipeDetailStyles.countBadge}>
                <Text style={recipeDetailStyles.countText}>{recipe.instructions.length}</Text>
              </View>
            </View>

            <View style={recipeDetailStyles.instructionsContainer}>
              {recipe.instructions.map((instruction, index) => (
                <View key={index} style={recipeDetailStyles.instructionCard}>
                  <LinearGradient
                    colors={[COLORS.primary, COLORS.primary + "CC"]}
                    style={recipeDetailStyles.stepIndicator}
                  >
                    <Text style={recipeDetailStyles.stepNumber}>{index + 1}</Text>
                  </LinearGradient>
                  <View style={recipeDetailStyles.instructionContent}>
                    <Text style={recipeDetailStyles.instructionText}>{instruction}</Text>
                    <View style={recipeDetailStyles.instructionFooter}>
                      <Text style={recipeDetailStyles.stepLabel}>Step {index + 1}</Text>
                      <TouchableOpacity style={recipeDetailStyles.completeButton}>
                        <Ionicons name="checkmark" size={16} color={COLORS.primary} />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </View>

          <TouchableOpacity
            style={recipeDetailStyles.primaryButton}
            onPress={handleToggleSave}
            disabled={isSaving}
          >
            <LinearGradient
              colors={[COLORS.primary, COLORS.primary + "CC"]}
              style={recipeDetailStyles.buttonGradient}
            >
              <Ionicons name="heart" size={20} color={COLORS.white} />
              <Text style={recipeDetailStyles.buttonText}>
                {isSaved ? "Remove from Favorites" : "Add to Favorites"}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* In-App Browser Modal */}
      <Modal
        visible={showWebView}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={recipeDetailStyles.webViewModal}>
          <View style={recipeDetailStyles.webViewHeader}>
            <TouchableOpacity
              style={recipeDetailStyles.webViewCloseButton}
              onPress={() => setShowWebView(false)}
            >
              <Ionicons name="close" size={24} color={COLORS.text} />
            </TouchableOpacity>
            <Text style={recipeDetailStyles.webViewTitle}>Original Recipe</Text>
            <View style={{ width: 24 }} />
          </View>
          <WebView
            source={{ uri: webViewUrl }}
            style={recipeDetailStyles.webView}
            startInLoadingState={true}
            renderLoading={() => (
              <View style={recipeDetailStyles.webViewLoading}>
                <LoadingSpinner message="Loading original recipe..." />
              </View>
            )}
          />
        </View>
      </Modal>
    </View>
  );
};

export default RecipeDetailScreen;