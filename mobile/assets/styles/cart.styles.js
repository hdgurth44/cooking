import { StyleSheet } from "react-native";
import { COLORS, TYPOGRAPHY } from "../../constants/colors";
import { sharedStyles } from "./shared.styles";

export const cartStyles = StyleSheet.create({
  // Use shared styles for common patterns
  ...sharedStyles,
  
  // Cart-specific styles only
  recipesSection: {
    marginTop: 20,
    paddingHorizontal: 20,
    marginBottom: 16, // Match ingredientsHeader margin
  },
  
  recipesScrollView: {
    paddingLeft: 0,
    paddingTop: 10 // Removed since parent has horizontal padding
  },
  
  recipesContainer: {
    paddingRight: 0, // Removed since parent has horizontal padding
    gap: 12,
  },
  
  // Small recipe cards for cart (different from main recipe cards)
  cartRecipeCard: {
    width: 160,
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 12,
    marginRight: 12,
    ...sharedStyles.smallCard,
  },
  
  cartRecipeCardDeselected: {
    opacity: 0.6,
  },
  
  recipeImageContainer: {
    position: "relative",
    marginBottom: 8,
  },
  
  cartRecipeImage: {
    width: "100%",
    height: 120,
    borderRadius: 8,
    backgroundColor: COLORS.border,
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
  
  cartRecipeTitle: {
    ...TYPOGRAPHY.body2,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 4,
  },
  
  cartRecipeTitleDeselected: {
    color: COLORS.textLight,
  },
  
  cartRecipeServings: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textLight,
  },
  
  // Ingredients section
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
  
  // Override shared sectionTitle to remove padding for cart
  sectionTitle: {
    ...TYPOGRAPHY.h4,
    color: COLORS.text,
    marginBottom: 0, // No bottom margin since we're in a header
    paddingHorizontal: 0, // No padding - container handles it
  },
  
  ingredientsCount: {
    ...TYPOGRAPHY.body2,
    color: COLORS.textLight,
  },
  
  ingredientsList: {
    paddingHorizontal: 20,
  },
  
  ingredientItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: COLORS.card,
    marginBottom: 8,
    borderRadius: 12,
    ...sharedStyles.smallCard,
  },
  
  ingredientItemCompleted: {
    opacity: 0.6,
    backgroundColor: COLORS.border,
  },
  
  ingredientCheckbox: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: COLORS.primary,
    backgroundColor: "transparent",
    marginRight: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  
  ingredientCheckboxChecked: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  
  ingredientText: {
    flex: 1,
    ...TYPOGRAPHY.body1,
    color: COLORS.text,
  },
  
  ingredientTextCompleted: {
    textDecorationLine: "line-through",
    color: COLORS.textLight,
  },
  
  // These styles now come from shared styles
  // completedSection, completedHeader, completedTitle, actionButtonsContainer, ingredientItem, etc.
});