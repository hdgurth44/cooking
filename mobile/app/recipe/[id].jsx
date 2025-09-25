import {
  View,
  Text,
  Alert,
  TouchableOpacity,
  Modal,
  Animated,
} from "react-native";
import * as Clipboard from "expo-clipboard";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-expo";
import { SupabaseAPI } from "../../services/supabaseAPI";
import LoadingSpinner from "../../components/LoadingSpinner";
import { Image } from "expo-image";

import { recipeDetailStyles } from "../../assets/styles/recipe-detail.styles";
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
  const [isInMealPrep, setIsInMealPrep] = useState(false);
  const [isMealPrepSaving, setIsMealPrepSaving] = useState(false);
  const [showWebView, setShowWebView] = useState(false);
  const [webViewUrl, setWebViewUrl] = useState("");
  const [checkedIngredients, setCheckedIngredients] = useState(new Set());
  const [showCompletedIngredients, setShowCompletedIngredients] =
    useState(false);
  const [scrollY] = useState(new Animated.Value(0));
  const [activeTab, setActiveTab] = useState("ingredients");
  const [servings, setServings] = useState(2); // Default servings
  const [checkedSteps, setCheckedSteps] = useState(new Set());

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

          // Set initial servings from recipe data
          setServings(transformedRecipe.servings || 2);

          // Check if recipe is favorited and in meal prep
          if (userId) {
            const favoriteStatus = await SupabaseAPI.isFavorite(
              recipeId,
              userId
            );
            setIsSaved(favoriteStatus);
            
            const mealPrepStatus = await SupabaseAPI.isInMealPrep(
              recipeId,
              userId
            );
            setIsInMealPrep(mealPrepStatus);
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
    setCheckedIngredients((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  const toggleStep = (index) => {
    setCheckedSteps((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  const adjustServings = (newServings) => {
    if (newServings >= 1 && newServings <= 20) {
      setServings(newServings);
    }
  };

  const getScaledIngredient = (ingredient) => {
    if (!recipe?.servings || servings === recipe.servings) {
      return ingredient;
    }

    const scaleFactor = servings / recipe.servings;

    // Try to extract and scale numbers in the ingredient
    return ingredient.replace(/(\d+(?:\.\d+)?)/g, (match) => {
      const number = parseFloat(match);
      const scaled = number * scaleFactor;
      // Round to 2 decimal places and remove unnecessary trailing zeros
      return (Math.round(scaled * 100) / 100).toString().replace(/\.?0+$/, "");
    });
  };

  const handleCopyIngredients = async () => {
    try {
      const uncheckedIngredients = recipe.ingredients
        .map((ingredient, index) => ({ ingredient, index }))
        .filter(({ index }) => !checkedIngredients.has(index))
        .map(
          ({ ingredient }, displayIndex) =>
            `${displayIndex + 1}. ${getScaledIngredient(ingredient)}`
        );

      if (uncheckedIngredients.length === 0) {
        Alert.alert(
          "Info",
          "All ingredients are checked off! Nothing to copy."
        );
        return;
      }

      const ingredientsList = uncheckedIngredients.join("\n");
      await Clipboard.setStringAsync(ingredientsList);

      Alert.alert(
        "Success",
        `${uncheckedIngredients.length} remaining ingredients copied to clipboard (scaled for ${servings} servings)!`
      );
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

  const handleToggleMealPrep = async () => {
    if (!userId) {
      Alert.alert("Error", "Please log in to add to meal prep");
      return;
    }

    setIsMealPrepSaving(true);

    try {
      const newMealPrepStatus = !isInMealPrep;
      const result = await SupabaseAPI.toggleMealPrep(
        recipeId,
        userId,
        newMealPrepStatus
      );

      if (result) {
        setIsInMealPrep(newMealPrepStatus);
        Alert.alert(
          "Success",
          newMealPrepStatus
            ? "Recipe added to meal prep!"
            : "Recipe removed from meal prep!"
        );
      } else {
        Alert.alert("Error", "Failed to update meal prep. Please try again.");
      }
    } catch (error) {
      console.error("Error toggling meal prep:", error);
      Alert.alert("Error", "Failed to update meal prep. Please try again.");
    } finally {
      setIsMealPrepSaving(false);
    }
  };

  if (loading) return <LoadingSpinner message="Loading recipe details..." />;

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });

  return (
    <View style={recipeDetailStyles.container}>
      {/* Fixed Header */}
      <Animated.View
        style={[recipeDetailStyles.fixedHeader, { opacity: headerOpacity }]}
      >
        <TouchableOpacity
          style={recipeDetailStyles.headerBackButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>

        <Text style={recipeDetailStyles.fixedHeaderTitle} numberOfLines={1}>
          {recipe?.title}
        </Text>

        <TouchableOpacity
          style={[
            recipeDetailStyles.headerSaveButton,
            { backgroundColor: isSaving ? COLORS.gray : COLORS.primary },
          ]}
          onPress={handleToggleSave}
          disabled={isSaving}
        >
          <Ionicons
            name={
              isSaving ? "hourglass" : isSaved ? "bookmark" : "bookmark-outline"
            }
            size={20}
            color={COLORS.white}
          />
        </TouchableOpacity>
      </Animated.View>

      <Animated.ScrollView
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        {/* HEADER */}
        <View style={recipeDetailStyles.headerContainer}>
          <View style={recipeDetailStyles.imageContainer}>
            <Image
              source={{ uri: recipe.image }}
              style={recipeDetailStyles.headerImage}
              contentFit="cover"
            />
          </View>

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
        </View>

        <View style={recipeDetailStyles.contentSection}>
          {/* Recipe Title and Metadata Section */}
          <View style={recipeDetailStyles.recipeMetaSection}>
            <Text style={recipeDetailStyles.recipeMainTitle}>
              {recipe.title}
            </Text>

            {/* Tags and Time */}
            <View style={recipeDetailStyles.categoriesContainer}>
              {/* Display all tags from Supabase */}
              {recipe.originalData?.tags?.map((tag, index) => (
                <View key={index} style={recipeDetailStyles.categoryBadgeLight}>
                  <Text style={recipeDetailStyles.categoryTextLight}>
                    {tag}
                  </Text>
                </View>
              ))}

              {/* Prep time as last, less prominent badge */}
              {recipe.cookTime && (
                <View style={recipeDetailStyles.timeBadge}>
                  <Text style={recipeDetailStyles.timeBadgeText}>
                    {recipe.cookTime}
                  </Text>
                </View>
              )}
            </View>

            {/* Summary/Description */}
            {recipe.description && (
              <Text style={recipeDetailStyles.summaryText}>
                {recipe.description}
              </Text>
            )}

            {/* Original Recipe Link */}
            {recipe.youtubeUrl && (
              <TouchableOpacity
                style={recipeDetailStyles.originalLinkButton}
                onPress={() => handleOpenOriginalRecipe(recipe.youtubeUrl)}
              >
                <Text style={recipeDetailStyles.originalLinkText}>
                  See original recipe
                </Text>
                <Ionicons
                  name="arrow-forward"
                  size={16}
                  color={COLORS.primary}
                />
              </TouchableOpacity>
            )}
          </View>
          {/* Tab Navigation */}
          <View style={recipeDetailStyles.tabContainer}>
            <TouchableOpacity
              style={[
                recipeDetailStyles.tab,
                activeTab === "ingredients" && recipeDetailStyles.activeTab,
              ]}
              onPress={() => setActiveTab("ingredients")}
            >
              <Text
                style={[
                  recipeDetailStyles.tabText,
                  activeTab === "ingredients" &&
                    recipeDetailStyles.activeTabText,
                ]}
              >
                Ingredients
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                recipeDetailStyles.tab,
                activeTab === "steps" && recipeDetailStyles.activeTab,
              ]}
              onPress={() => setActiveTab("steps")}
            >
              <Text
                style={[
                  recipeDetailStyles.tabText,
                  activeTab === "steps" && recipeDetailStyles.activeTabText,
                ]}
              >
                Steps
              </Text>
            </TouchableOpacity>
          </View>

          {/* Tab Content */}
          {activeTab === "ingredients" && (
            <View style={recipeDetailStyles.tabContent}>
              {/* Servings Adjustment */}
              <View style={recipeDetailStyles.servingsContainer}>
                <TouchableOpacity
                  style={recipeDetailStyles.servingButton}
                  onPress={() => adjustServings(servings - 1)}
                  disabled={servings <= 1}
                >
                  <Ionicons
                    name="remove"
                    size={20}
                    color={servings <= 1 ? COLORS.textLight : COLORS.text}
                  />
                </TouchableOpacity>

                <View style={recipeDetailStyles.servingsDisplay}>
                  <Text style={recipeDetailStyles.servingsNumber}>
                    {servings}
                  </Text>
                  <Text style={recipeDetailStyles.servingsLabel}>Servings</Text>
                </View>

                <TouchableOpacity
                  style={recipeDetailStyles.servingButton}
                  onPress={() => adjustServings(servings + 1)}
                  disabled={servings >= 20}
                >
                  <Ionicons
                    name="add"
                    size={20}
                    color={servings >= 20 ? COLORS.textLight : COLORS.text}
                  />
                </TouchableOpacity>
              </View>
              {/* Subtitle */}
              <Text style={recipeDetailStyles.ingredientsSubtitle}>
                Check off items you have at home.
              </Text>

              {/* Unchecked Ingredients */}
              <View style={recipeDetailStyles.ingredientsList}>
                {recipe.ingredients.map((ingredient, index) => {
                  const isChecked = checkedIngredients.has(index);
                  if (isChecked) return null; // Skip checked ingredients
                  return (
                    <TouchableOpacity
                      key={index}
                      style={recipeDetailStyles.ingredientItem}
                      onPress={() => toggleIngredient(index)}
                      activeOpacity={0.7}
                    >
                      <View style={recipeDetailStyles.ingredientCheckbox}>
                      </View>
                      <Text style={recipeDetailStyles.ingredientText}>
                        {getScaledIngredient(ingredient)}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Marked as Done Section */}
              {checkedIngredients.size > 0 && (
                <View style={recipeDetailStyles.completedSection}>
                  <TouchableOpacity
                    style={recipeDetailStyles.completedHeader}
                    onPress={() =>
                      setShowCompletedIngredients(!showCompletedIngredients)
                    }
                    activeOpacity={0.7}
                  >
                    <Text style={recipeDetailStyles.completedTitle}>
                      Marked as done ({checkedIngredients.size})
                    </Text>
                    <Ionicons
                      name={
                        showCompletedIngredients ? "chevron-up" : "chevron-down"
                      }
                      size={20}
                      color={COLORS.textLight}
                    />
                  </TouchableOpacity>

                  {showCompletedIngredients && (
                    <View style={recipeDetailStyles.completedList}>
                      {recipe.ingredients.map((ingredient, index) => {
                        const isChecked = checkedIngredients.has(index);
                        if (!isChecked) return null; // Skip unchecked ingredients
                        return (
                          <TouchableOpacity
                            key={index}
                            style={[
                              recipeDetailStyles.ingredientItem,
                              recipeDetailStyles.completedIngredientItem,
                            ]}
                            onPress={() => toggleIngredient(index)}
                            activeOpacity={0.7}
                          >
                            <View style={[
                              recipeDetailStyles.ingredientCheckbox,
                              recipeDetailStyles.ingredientCheckboxChecked,
                            ]}>
                            </View>
                            <Text
                              style={[
                                recipeDetailStyles.ingredientText,
                                recipeDetailStyles.completedIngredientText,
                              ]}
                            >
                              {getScaledIngredient(ingredient)}
                            </Text>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  )}
                </View>
              )}
              
            </View>
          )}

          {activeTab === "steps" && (
            <View style={recipeDetailStyles.tabContent}>
              <View style={recipeDetailStyles.stepsList}>
                {recipe.instructions.map((instruction, index) => {
                  const isChecked = checkedSteps.has(index);
                  return (
                    <View key={index} style={recipeDetailStyles.stepCard}>
                      <View style={recipeDetailStyles.stepHeader}>
                        <Text style={recipeDetailStyles.stepTitle}>
                          Step {index + 1}
                        </Text>
                        <TouchableOpacity
                          style={[
                            recipeDetailStyles.stepCheckbox,
                            isChecked && recipeDetailStyles.stepCheckboxChecked,
                          ]}
                          onPress={() => toggleStep(index)}
                        >
                          {isChecked && (
                            <Ionicons
                              name="checkmark"
                              size={16}
                              color={COLORS.white}
                            />
                          )}
                        </TouchableOpacity>
                      </View>
                      <Text
                        style={[
                          recipeDetailStyles.stepText,
                          isChecked && recipeDetailStyles.stepTextCompleted,
                        ]}
                      >
                        {instruction}
                      </Text>
                    </View>
                  );
                })}
              </View>
            </View>
          )}
          {/* Action Buttons */}
          <View style={recipeDetailStyles.actionButtonsContainer}>
            <TouchableOpacity
              style={recipeDetailStyles.secondaryActionButton}
              onPress={handleCopyIngredients}
              activeOpacity={0.7}
            >
              <Ionicons
                name="copy-outline"
                size={20}
                color={COLORS.textLight}
              />
              <Text style={recipeDetailStyles.secondaryActionButtonText}>
                Copy
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                recipeDetailStyles.primaryActionButton,
                isInMealPrep && recipeDetailStyles.primaryActionButtonActive
              ]}
              onPress={handleToggleMealPrep}
              activeOpacity={0.7}
              disabled={isMealPrepSaving}
            >
              <Ionicons 
                name={isInMealPrep ? "bag" : "bag-outline"} 
                size={20} 
                color={COLORS.white} 
              />
              <Text style={recipeDetailStyles.primaryActionButtonText}>
                {isMealPrepSaving 
                  ? "Updating..." 
                  : isInMealPrep 
                    ? "Remove meal"
                    : "Add meal prep"
                }
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Animated.ScrollView>

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
