import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from "react-native";
import { useState, useMemo, useEffect, useCallback } from "react";
import * as Clipboard from "expo-clipboard";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useUser } from "@clerk/clerk-expo";
import { SupabaseAPI } from "../../services/supabaseAPI";
import { COLORS } from "../../constants/colors";
import { homeStyles } from "../../assets/styles/home.styles";
import { recipeDetailStyles } from "../../assets/styles/recipe-detail.styles";
import NoMealPrepFound from "../../components/NoMealPrepFound";
import LoadingSpinner from "../../components/LoadingSpinner";


const MealPrepScreen = () => {
  const [mealPrepRecipes, setMealPrepRecipes] = useState([]);
  const [selectedRecipes, setSelectedRecipes] = useState(new Set());
  const [checkedIngredients, setCheckedIngredients] = useState(new Set());
  const [showCompletedIngredients, setShowCompletedIngredients] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const { user } = useUser();
  const userId = user?.id;

  // Load meal prep recipes
  const loadMealPrepRecipes = useCallback(async () => {
    try {
      if (userId) {
        const recipes = await SupabaseAPI.getMealPrepRecipes(userId);
        const transformedRecipes = recipes.map(recipe => 
          SupabaseAPI.transformRecipeData(recipe)
        );
        setMealPrepRecipes(transformedRecipes);
        
        // Select all recipes by default
        const allRecipeIds = new Set(transformedRecipes.map(recipe => recipe.id));
        setSelectedRecipes(allRecipeIds);
      }
    } catch (error) {
      console.error("Error loading meal prep recipes:", error);
    }
  }, [userId]);

  // Refresh function for pull-to-refresh
  const onRefresh = async () => {
    setRefreshing(true);
    await loadMealPrepRecipes();
    setRefreshing(false);
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await loadMealPrepRecipes();
      setLoading(false);
    };

    loadData();
  }, [loadMealPrepRecipes]);

  // Get combined ingredients from selected recipes, sorted alphabetically
  const combinedIngredients = useMemo(() => {
    const ingredients = [];
    
    mealPrepRecipes.forEach((recipe) => {
      if (selectedRecipes.has(recipe.id)) {
        recipe.ingredients.forEach((ingredient) => {
          ingredients.push({
            text: ingredient,
            recipeId: recipe.id,
            recipeTitle: recipe.title,
          });
        });
      }
    });

    // Sort alphabetically
    return ingredients.sort((a, b) => a.text.localeCompare(b.text));
  }, [selectedRecipes, mealPrepRecipes]);

  const toggleRecipe = (recipeId) => {
    setSelectedRecipes((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(recipeId)) {
        newSet.delete(recipeId);
      } else {
        newSet.add(recipeId);
      }
      return newSet;
    });
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

  const handleRemoveFromMealPrep = async (recipe) => {
    Alert.alert(
      "Remove?",
      `Do you want to remove "${recipe.title}" from your meal prep?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Remove",
          style: "destructive",
          onPress: async () => {
            try {
              const result = await SupabaseAPI.toggleMealPrep(
                recipe.id,
                userId,
                false // Remove from meal prep
              );

              if (result !== null) {
                // Remove from local state
                setMealPrepRecipes(prev => prev.filter(r => r.id !== recipe.id));
                setSelectedRecipes(prev => {
                  const newSet = new Set(prev);
                  newSet.delete(recipe.id);
                  return newSet;
                });
                Alert.alert("Success", "Recipe removed from meal prep!");
              } else {
                Alert.alert("Error", "Failed to remove recipe. Please try again.");
              }
            } catch (error) {
              console.error("Error removing recipe from meal prep:", error);
              Alert.alert("Error", "Failed to remove recipe. Please try again.");
            }
          },
        },
      ]
    );
  };

  const handleCopyIngredients = async () => {
    try {
      const uncheckedIngredients = combinedIngredients
        .map((ingredient, index) => ({ ingredient, index }))
        .filter(({ index }) => !checkedIngredients.has(index))
        .map(({ ingredient }, displayIndex) => `${displayIndex + 1}. ${ingredient.text}`);

      if (uncheckedIngredients.length === 0) {
        Alert.alert("Info", "All ingredients are checked off! Nothing to copy.");
        return;
      }

      const ingredientsList = uncheckedIngredients.join("\n");
      await Clipboard.setStringAsync(ingredientsList);

      Alert.alert(
        "Success",
        `${uncheckedIngredients.length} ingredients copied to clipboard!`
      );
    } catch (error) {
      console.error("Error copying ingredients:", error);
      Alert.alert("Error", "Failed to copy ingredients. Please try again.");
    }
  };

  // Show loading state
  if (loading) {
    return <LoadingSpinner message="Loading your meal prep recipes..." />;
  }

  // If no recipes in meal prep, show empty state with header
  if (mealPrepRecipes.length === 0) {
    return (
      <View style={homeStyles.container}>
        <ScrollView 
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={COLORS.primary}
            />
          }
          contentContainerStyle={styles.scrollContent}
        >
          {/* Header - exact same style as populated state */}
          <View style={homeStyles.welcomeSection}>
            <Image
              source={require("../../assets/images/lamb.png")}
              style={{ width: 100, height: 100 }}
              contentFit="contain"
            />
            <Text style={homeStyles.welcomeText}>Meal Prep</Text>
          </View>

          {/* Empty state component */}
          <NoMealPrepFound />
        </ScrollView>
      </View>
    );
  }


  return (
    <View style={homeStyles.container}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.primary}
          />
        }
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header - exact same style as home */}
        <View style={homeStyles.welcomeSection}>
          <Image
            source={require("../../assets/images/lamb.png")}
            style={{ width: 100, height: 100 }}
            contentFit="contain"
          />
          <Text style={homeStyles.welcomeText}>Meal Prep</Text>
        </View>

        {/* Selected Recipes Section */}
        <View style={styles.recipesSection}>
          <Text style={styles.sectionTitle2}>On the menu this week</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.recipesScrollView}
            contentContainerStyle={styles.recipesContainer}
          >
            {mealPrepRecipes.map((recipe) => {
              const isSelected = selectedRecipes.has(recipe.id);
              return (
                <TouchableOpacity
                  key={recipe.id}
                  style={[
                    styles.recipeCard,
                    !isSelected && styles.recipeCardDeselected,
                  ]}
                  onPress={() => toggleRecipe(recipe.id)}
                  onLongPress={() => handleRemoveFromMealPrep(recipe)}
                  activeOpacity={0.7}
                >
                  <View style={styles.recipeImageContainer}>
                    <Image
                      source={{ uri: recipe.image }}
                      style={styles.recipeImage}
                      contentFit="cover"
                    />
                    {!isSelected && <View style={styles.recipeOverlay} />}
                    <View style={[
                      styles.recipeCheckbox,
                      isSelected && styles.recipeCheckboxSelected
                    ]}>
                      {isSelected && (
                        <Ionicons name="checkmark" size={16} color={COLORS.white} />
                      )}
                    </View>
                  </View>
                  <Text
                    style={[
                      styles.recipeTitle,
                      !isSelected && styles.recipeTitleDeselected,
                    ]}
                    numberOfLines={2}
                  >
                    {recipe.title}
                  </Text>
                  <Text style={styles.recipeServings}>
                    Serves {recipe.servings}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Ingredients Section - Only show if recipes are selected */}
        {selectedRecipes.size > 0 && (
        <View style={styles.ingredientsSection}>
          <View style={styles.ingredientsHeader}>
            <Text style={styles.sectionTitle}>Shopping List</Text>
            <Text style={styles.ingredientsCount}>
              {combinedIngredients.length} items
            </Text>
          </View>

          {/* Unchecked Ingredients */}
          <View style={[recipeDetailStyles.ingredientsList, styles.ingredientsList]}>
            {combinedIngredients.map((ingredient, index) => {
              const isChecked = checkedIngredients.has(index);
              if (isChecked) return null;
              
              return (
                <TouchableOpacity
                  key={index}
                  style={recipeDetailStyles.ingredientItem}
                  onPress={() => toggleIngredient(index)}
                  activeOpacity={0.7}
                >
                  <Text style={recipeDetailStyles.ingredientText}>
                    {ingredient.text}
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

          {/* Checked Ingredients Section - Collapsible */}
          {checkedIngredients.size > 0 && (
            <View style={recipeDetailStyles.completedIngredientsSection}>
              <TouchableOpacity
                style={recipeDetailStyles.completedIngredientsHeader}
                onPress={() =>
                  setShowCompletedIngredients(!showCompletedIngredients)
                }
                activeOpacity={0.7}
              >
                <Text style={recipeDetailStyles.completedIngredientsTitle}>
                  Purchased ({checkedIngredients.size})
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
                <View style={[recipeDetailStyles.completedIngredientsList, styles.ingredientsList]}>
                  {combinedIngredients.map((ingredient, index) => {
                    const isChecked = checkedIngredients.has(index);
                    if (!isChecked) return null;
                    
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
                        <Text
                          style={[
                            recipeDetailStyles.ingredientText,
                            recipeDetailStyles.completedIngredientText,
                          ]}
                        >
                          {ingredient.text}
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

          {/* Action Buttons */}
          <View style={[recipeDetailStyles.actionButtonsContainer, styles.ingredientsList]}>
            <TouchableOpacity
              style={recipeDetailStyles.secondaryActionButton}
              onPress={handleCopyIngredients}
              activeOpacity={0.7}
            >
              <Ionicons name="copy-outline" size={20} color={COLORS.textLight} />
              <Text style={recipeDetailStyles.secondaryActionButtonText}>
                Copy List
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={recipeDetailStyles.primaryActionButton}
              onPress={() => {
                Alert.alert("Share", "Share functionality coming soon!");
              }}
              activeOpacity={0.7}
            >
              <Ionicons name="share-outline" size={20} color={COLORS.white} />
              <Text style={recipeDetailStyles.primaryActionButtonText}>
                Share List
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = {
  scrollContent: {
    paddingBottom: 120, // Extra padding to ensure bottom buttons are accessible above tab bar
  },
  recipesSection: {
    marginTop: 20,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 16,
    paddingHorizontal: 0,
    textAlign: "left",
  },
  sectionTitle2: {
    fontSize: 20,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 16,
    paddingHorizontal: 20,
    textAlign: "left",
  },
  recipesScrollView: {
    paddingLeft: 20,
  },
  recipesContainer: {
    paddingRight: 20,
    gap: 12,
  },
  recipeCard: {
    width: 160,
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 12,
    marginRight: 12,
  },
  recipeCardDeselected: {
    opacity: 0.6,
  },
  recipeImageContainer: {
    position: "relative",
    marginBottom: 8,
  },
  recipeImage: {
    width: "100%",
    height: 120,
    borderRadius: 8,
  },
  recipeOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.3)",
    borderRadius: 8,
  },
  recipeCheckbox: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.3)",
    borderWidth: 2,
    borderColor: COLORS.white,
    alignItems: "center",
    justifyContent: "center",
  },
  recipeCheckboxSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  recipeTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 4,
  },
  recipeTitleDeselected: {
    color: COLORS.textLight,
  },
  recipeServings: {
    fontSize: 12,
    color: COLORS.textLight,
  },
  ingredientsSection: {
    paddingBottom: 20,
  },
  ingredientsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  ingredientsCount: {
    fontSize: 14,
    color: COLORS.textLight,
  },
  ingredientsList: {
    paddingHorizontal: 20,
  },
};

export default MealPrepScreen;