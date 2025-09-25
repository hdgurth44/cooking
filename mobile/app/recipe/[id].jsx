import {
  View,
  Text,
  Alert,
  ScrollView,
  TouchableOpacity,
  Modal,
} from "react-native";
import * as Clipboard from "expo-clipboard";
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
import { ClipboardIcon } from "../../components/icons";
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
  const [checkedIngredients, setCheckedIngredients] = useState(new Set());
  const [showCompletedIngredients, setShowCompletedIngredients] = useState(false);
  const [isClipboardActive, setIsClipboardActive] = useState(false);

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
            const favoriteStatus = await SupabaseAPI.isFavorite(
              recipeId,
              userId
            );
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

  const toggleIngredient = (index) => {
    setCheckedIngredients(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  const handleCopyIngredients = async () => {
    try {
      const uncheckedIngredients = recipe.ingredients
        .map((ingredient, index) => ({ ingredient, index }))
        .filter(({ index }) => !checkedIngredients.has(index))
        .map(({ ingredient }, displayIndex) => `${displayIndex + 1}. ${ingredient}`);
      
      if (uncheckedIngredients.length === 0) {
        Alert.alert("Info", "All ingredients are checked off! Nothing to copy.");
        return;
      }
      
      const ingredientsList = uncheckedIngredients.join("\n");
      await Clipboard.setStringAsync(ingredientsList);
      
      // Activate clipboard icon for 1 second
      setIsClipboardActive(true);
      setTimeout(() => {
        setIsClipboardActive(false);
      }, 1000);
      
      Alert.alert("Success", `${uncheckedIngredients.length} remaining ingredients copied to clipboard!`);
    } catch (error) {
      console.error("Error copying ingredients:", error);
      Alert.alert("Error", "Failed to copy ingredients. Please try again.");
    }
  };

  const handleToggleSave = async () => {
    if (!userId) {
      Alert.alert("Error", "Please log in to save favorites");
      return;
    }

    setIsSaving(true);

    try {
      const newFavoriteStatus = !isSaved;
      const result = await SupabaseAPI.toggleFavorite(
        recipeId,
        userId,
        newFavoriteStatus
      );

      if (result) {
        setIsSaved(newFavoriteStatus);
        Alert.alert(
          "Success",
          newFavoriteStatus
            ? "Recipe added to favorites!"
            : "Recipe removed from favorites!"
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
                name={
                  isSaving
                    ? "hourglass"
                    : isSaved
                    ? "bookmark"
                    : "bookmark-outline"
                }
                size={24}
                color={COLORS.white}
              />
            </TouchableOpacity>
          </View>

          {/* Title Section */}
          <View style={recipeDetailStyles.titleSection}>
            <View style={recipeDetailStyles.categoryBadge}>
              <Text style={recipeDetailStyles.categoryText}>
                {recipe.category}
              </Text>
            </View>
            <Text style={recipeDetailStyles.recipeTitle}>{recipe.title}</Text>
            {recipe.cookTime && (
              <View style={recipeDetailStyles.locationRow}>
                <Ionicons name="time" size={16} color={COLORS.white} />
                <Text style={recipeDetailStyles.locationText}>
                  {recipe.cookTime}
                </Text>
              </View>
            )}
          </View>
        </View>

        <View style={recipeDetailStyles.contentSection}>
          {/* OVERVIEW SECTION */}
          <View style={recipeDetailStyles.sectionContainer}>
            <View style={recipeDetailStyles.sectionTitleRow}>
              <Text style={recipeDetailStyles.sectionTitle}>👀 Overview</Text>
            </View>

            {/* Summary/Description with inline link */}
            {(recipe.description || recipe.youtubeUrl) && (
              <View style={recipeDetailStyles.overviewCard}>
                {recipe.description && (
                  <Text style={recipeDetailStyles.descriptionText}>
                    {recipe.description}
                  </Text>
                )}
                {recipe.youtubeUrl && (
                  <TouchableOpacity
                    style={recipeDetailStyles.inlineLinkContainer}
                    onPress={() => handleOpenOriginalRecipe(recipe.youtubeUrl)}
                  >
                    <Text style={recipeDetailStyles.inlineLinkText}>
                      See original recipe
                    </Text>
                    <Ionicons
                      name="arrow-forward"
                      size={14}
                      color={COLORS.primary}
                    />
                  </TouchableOpacity>
                )}
              </View>
            )}
          </View>

          {/* INGREDIENTS SECTION */}
          <View style={recipeDetailStyles.sectionContainer}>
            <View style={recipeDetailStyles.sectionTitleRow}>
              <Text style={recipeDetailStyles.sectionTitle}>
                🛒 Ingredients
              </Text>
              <TouchableOpacity
                // style={recipeDetailStyles.countBadge}
                onPress={handleCopyIngredients}
                activeOpacity={0.7}
              >
                <View flexDirection="row" alignItems="center" gap={4}>
                  <Text style={recipeDetailStyles.countText}>Copy</Text>
                  <ClipboardIcon
                    focused={isClipboardActive}
                    size={20}
                    color={COLORS.primary}
                  />
                </View>
              </TouchableOpacity>
            </View>

            {/* Unchecked Ingredients */}
            <View style={recipeDetailStyles.ingredientsGrid}>
              {recipe.ingredients.map((ingredient, index) => {
                const isChecked = checkedIngredients.has(index);
                if (isChecked) return null; // Skip checked ingredients
                return (
                  <TouchableOpacity 
                    key={index} 
                    style={recipeDetailStyles.ingredientCard}
                    onPress={() => toggleIngredient(index)}
                    activeOpacity={0.7}
                  >
                    <Text style={recipeDetailStyles.ingredientText}>
                      {ingredient}
                    </Text>
                    <View style={recipeDetailStyles.ingredientCheck}>
                      <Ionicons
                        name="checkmark-circle-outline"
                        size={20}
                        color={COLORS.textLight}
                      />
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Marked as Done Section */}
            {checkedIngredients.size > 0 && (
              <View style={recipeDetailStyles.completedIngredientsSection}>
                <TouchableOpacity
                  style={recipeDetailStyles.completedIngredientsHeader}
                  onPress={() => setShowCompletedIngredients(!showCompletedIngredients)}
                  activeOpacity={0.7}
                >
                  <Text style={recipeDetailStyles.completedIngredientsTitle}>
                    Marked as done ({checkedIngredients.size})
                  </Text>
                  <Ionicons
                    name={showCompletedIngredients ? "chevron-up" : "chevron-down"}
                    size={20}
                    color={COLORS.textLight}
                  />
                </TouchableOpacity>

                {showCompletedIngredients && (
                  <View style={recipeDetailStyles.completedIngredientsGrid}>
                    {recipe.ingredients.map((ingredient, index) => {
                      const isChecked = checkedIngredients.has(index);
                      if (!isChecked) return null; // Skip unchecked ingredients
                      return (
                        <TouchableOpacity 
                          key={index} 
                          style={[recipeDetailStyles.ingredientCard, recipeDetailStyles.completedIngredientCard]}
                          onPress={() => toggleIngredient(index)}
                          activeOpacity={0.7}
                        >
                          <Text 
                            style={[
                              recipeDetailStyles.ingredientText,
                              recipeDetailStyles.completedIngredientText
                            ]}
                          >
                            {ingredient}
                          </Text>
                          <View style={recipeDetailStyles.ingredientCheck}>
                            <Ionicons
                              name="checkmark-circle"
                              size={20}
                              color={COLORS.primary}
                            />
                          </View>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                )}
              </View>
            )}
          </View>

          {/* INSTRUCTIONS SECTION */}
          <View style={recipeDetailStyles.sectionContainer}>
            <View style={recipeDetailStyles.sectionTitleRow}>
              <Text style={recipeDetailStyles.sectionTitle}>
                🧐 Instructions
              </Text>
              <View style={recipeDetailStyles.countBadge}>
                <Text style={recipeDetailStyles.countText}>
                  {recipe.instructions.length}
                </Text>
              </View>
            </View>

            <View style={recipeDetailStyles.instructionsContainer}>
              {recipe.instructions.map((instruction, index) => (
                <View key={index} style={recipeDetailStyles.instructionCard}>
                  <LinearGradient
                    colors={[COLORS.primary, COLORS.primary + "CC"]}
                    style={recipeDetailStyles.stepIndicator}
                  >
                    <Text style={recipeDetailStyles.stepNumber}>
                      {index + 1}
                    </Text>
                  </LinearGradient>
                  <View style={recipeDetailStyles.instructionContent}>
                    <Text style={recipeDetailStyles.instructionText}>
                      {instruction}
                    </Text>
                    <View style={recipeDetailStyles.instructionFooter}>
                      <Text style={recipeDetailStyles.stepLabel}>
                        Step {index + 1}
                      </Text>
                      <TouchableOpacity
                        style={recipeDetailStyles.completeButton}
                      >
                        <Ionicons
                          name="checkmark"
                          size={16}
                          color={COLORS.primary}
                        />
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
