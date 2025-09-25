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
import { cartStyles } from "../../assets/styles/cart.styles";
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
      <View style={cartStyles.container}>
        <ScrollView 
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={COLORS.primary}
            />
          }
          contentContainerStyle={cartStyles.scrollContent}
        >
          {/* Header - exact same style as populated state */}
          <View style={cartStyles.welcomeSection}>
            <Image
              source={require("../../assets/images/lamb.png")}
              style={{ width: 100, height: 100 }}
              contentFit="contain"
            />
            <Text style={cartStyles.welcomeText}>Meal Prep</Text>
          </View>

          {/* Empty state component */}
          <NoMealPrepFound />
        </ScrollView>
      </View>
    );
  }


  return (
    <View style={cartStyles.container}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.primary}
          />
        }
        contentContainerStyle={cartStyles.scrollContent}
      >
        {/* Header - consistent with other screens */}
        <View style={cartStyles.welcomeSection}>
          <Image
            source={require("../../assets/images/lamb.png")}
            style={{ width: 100, height: 100 }}
            contentFit="contain"
          />
          <Text style={cartStyles.welcomeText}>Meal Prep</Text>
        </View>

        {/* Selected Recipes Section */}
        <View style={cartStyles.recipesSection}>
          <Text style={cartStyles.sectionTitle}>On the menu this week</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={cartStyles.recipesScrollView}
            contentContainerStyle={cartStyles.recipesContainer}
          >
            {mealPrepRecipes.map((recipe) => {
              const isSelected = selectedRecipes.has(recipe.id);
              return (
                <TouchableOpacity
                  key={recipe.id}
                  style={[
                    cartStyles.cartRecipeCard,
                    !isSelected && cartStyles.cartRecipeCardDeselected,
                  ]}
                  onPress={() => toggleRecipe(recipe.id)}
                  onLongPress={() => handleRemoveFromMealPrep(recipe)}
                  activeOpacity={0.7}
                >
                  <View style={cartStyles.recipeImageContainer}>
                    <Image
                      source={{ uri: recipe.image }}
                      style={cartStyles.cartRecipeImage}
                      contentFit="cover"
                    />
                    {!isSelected && <View style={cartStyles.recipeOverlay} />}
                    <View style={[
                      cartStyles.recipeCheckbox,
                      isSelected && cartStyles.recipeCheckboxSelected
                    ]}>
                      {isSelected && (
                        <Ionicons name="checkmark" size={16} color={COLORS.white} />
                      )}
                    </View>
                  </View>
                  <Text
                    style={[
                      cartStyles.cartRecipeTitle,
                      !isSelected && cartStyles.cartRecipeTitleDeselected,
                    ]}
                    numberOfLines={2}
                  >
                    {recipe.title}
                  </Text>
                  <Text style={cartStyles.cartRecipeServings}>
                    Serves {recipe.servings}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Ingredients Section - Only show if recipes are selected */}
        {selectedRecipes.size > 0 && (
        <View style={cartStyles.ingredientsSection}>
          <View style={cartStyles.ingredientsHeader}>
            <Text style={cartStyles.sectionTitle}>Shopping List</Text>
            <Text style={cartStyles.ingredientsCount}>
              {combinedIngredients.length} items
            </Text>
          </View>

          {/* Unchecked Ingredients */}
          <View style={cartStyles.ingredientsList}>
            {combinedIngredients.map((ingredient, index) => {
              const isChecked = checkedIngredients.has(index);
              if (isChecked) return null;
              
              return (
                <TouchableOpacity
                  key={index}
                  style={cartStyles.ingredientItem}
                  onPress={() => toggleIngredient(index)}
                  activeOpacity={0.7}
                >
                  <View style={cartStyles.ingredientCheckbox}>
                  </View>
                  <Text style={cartStyles.ingredientText}>
                    {ingredient.text}
                  </Text>
                </TouchableOpacity>
              );
            })}
    </View>

          {/* Checked Ingredients Section - Collapsible */}
          {checkedIngredients.size > 0 && (
            <View style={cartStyles.completedSection}>
              <TouchableOpacity
                style={cartStyles.completedHeader}
                onPress={() =>
                  setShowCompletedIngredients(!showCompletedIngredients)
                }
                activeOpacity={0.7}
              >
                <Text style={cartStyles.completedTitle}>
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
                <View style={cartStyles.ingredientsList}>
                  {combinedIngredients.map((ingredient, index) => {
                    const isChecked = checkedIngredients.has(index);
                    if (!isChecked) return null;
                    
                    return (
                      <TouchableOpacity
                        key={index}
                        style={[
                          cartStyles.ingredientItem,
                          cartStyles.ingredientItemCompleted,
                        ]}
                        onPress={() => toggleIngredient(index)}
                        activeOpacity={0.7}
                      >
                        <View style={[
                          cartStyles.ingredientCheckbox,
                          cartStyles.ingredientCheckboxChecked,
                        ]}>
                        </View>
                        <Text
                          style={[
                            cartStyles.ingredientText,
                            cartStyles.ingredientTextCompleted,
                          ]}
                        >
                          {ingredient.text}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              )}
            </View>
          )}

          {/* Action Buttons */}
          <View style={cartStyles.actionButtonsContainer}>
            <TouchableOpacity
              style={cartStyles.secondaryButton}
              onPress={handleCopyIngredients}
              activeOpacity={0.7}
            >
              <Ionicons name="copy-outline" size={20} color={COLORS.text} />
              <Text style={cartStyles.secondaryButtonText}>
                Copy List
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={cartStyles.primaryButton}
              onPress={() => {
                Alert.alert("Share", "Share functionality coming soon!");
              }}
              activeOpacity={0.7}
            >
              <Ionicons name="share-outline" size={20} color={COLORS.white} />
              <Text style={cartStyles.primaryButtonText}>
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


export default MealPrepScreen;