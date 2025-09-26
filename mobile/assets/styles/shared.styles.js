import { StyleSheet, Dimensions } from "react-native";
import { COLORS, TYPOGRAPHY } from "../../constants/colors";

const { width } = Dimensions.get("window");
const cardWidth = (width - 48) / 2;

// Shared styles used across multiple screens
export const sharedStyles = StyleSheet.create({
  // Container styles
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  
  // Common scroll content
  scrollContent: {
    paddingBottom: 120, // Space for tab bar and buttons
  },
  
  // Welcome header section (used in home, cart, create-recipe)
  welcomeSection: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: 20,
  },
  
  welcomeText: {
    ...TYPOGRAPHY.h1,
    fontSize: 36,
    fontWeight: "800",
    color: COLORS.text,
    letterSpacing: -0.5,
    flex: 1,
  },
  
  // Section headers
  sectionTitle: {
    ...TYPOGRAPHY.h4,
    color: COLORS.text,
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  
  sectionTitleLeft: {
    ...TYPOGRAPHY.h4,
    color: COLORS.text,
    marginBottom: 16,
    paddingHorizontal: 0,
  },
  
  // Common card styles
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    shadowColor: COLORS.shadow,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  
  smallCard: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    shadowColor: COLORS.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  
  // Button styles
  primaryButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },

  primaryButtonPressed: {
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
    opacity: 0.8,
  },

  primaryButtonText: {
    ...TYPOGRAPHY.button,
    color: COLORS.white,
  },

  // Accent button for secondary CTAs
  accentButton: {
    backgroundColor: COLORS.accent || COLORS.primary,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },

  accentButtonPressed: {
    backgroundColor: COLORS.accent || COLORS.primary,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
    opacity: 0.8,
  },

  accentButtonText: {
    ...TYPOGRAPHY.button,
    color: COLORS.onAccent || COLORS.white,
  },
  
  secondaryButton: {
    backgroundColor: COLORS.card,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  secondaryButtonPressed: {
    backgroundColor: COLORS.pressed || COLORS.border,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  secondaryButtonText: {
    ...TYPOGRAPHY.button,
    color: COLORS.text,
  },

  // Disabled button states
  disabledButton: {
    backgroundColor: COLORS.disabled || COLORS.border,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },

  disabledButtonText: {
    ...TYPOGRAPHY.button,
    color: COLORS.disabled || COLORS.textLight,
  },
  
  // Common empty states
  emptyState: {
    alignItems: "center",
    paddingVertical: 64,
    paddingHorizontal: 32,
  },
  
  emptyTitle: {
    ...TYPOGRAPHY.h3,
    color: COLORS.text,
    marginTop: 16,
    marginBottom: 8,
    textAlign: "center",
  },
  
  emptyDescription: {
    ...TYPOGRAPHY.body1,
    color: COLORS.textMuted || COLORS.textLight,
    textAlign: "center",
    marginBottom: 24,
  },
  
  // Recipe card styles (shared between home and other screens)
  recipeCard: {
    width: cardWidth,
    backgroundColor: COLORS.card,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: COLORS.shadow,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    overflow: "hidden",
  },
  
  recipeCardImage: {
    width: "100%",
    height: 140,
    backgroundColor: COLORS.border,
  },
  
  recipeCardContent: {
    padding: 12,
    flex: 1,
    justifyContent: "space-between",
  },
  
  recipeCardTitle: {
    ...TYPOGRAPHY.h6,
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 4,
  },
  
  recipeCardDescription: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textMuted || COLORS.textLight,
    marginBottom: 8,
  },
  
  recipeCardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  
  recipeCardMeta: {
    flexDirection: "row",
    alignItems: "center",
  },
  
  recipeCardMetaText: {
    ...TYPOGRAPHY.caption,
    fontSize: 11,
    color: COLORS.textMuted || COLORS.textLight,
    marginLeft: 4,
    fontWeight: "500",
  },
  
  // Input styles
  input: {
    ...TYPOGRAPHY.body1,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 16,
    color: COLORS.text,
  },
  
  inputFocused: {
    borderColor: COLORS.primary,
  },
  
  // Loading and message styles
  centerContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 80,
    paddingHorizontal: 32,
  },
  
  messageTitle: {
    ...TYPOGRAPHY.h3,
    color: COLORS.text,
    marginBottom: 12,
    textAlign: "center",
  },
  
  messageDescription: {
    ...TYPOGRAPHY.body1,
    color: COLORS.textMuted || COLORS.textLight,
    textAlign: "center",
    marginBottom: 32,
  },
  
  // Collapsible completed section (used in cart and recipe detail)
  completedSection: {
    marginTop: 16,
    paddingHorizontal: 20,
  },
  
  completedHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: COLORS.card,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: COLORS.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  
  completedTitle: {
    ...TYPOGRAPHY.h6,
    color: COLORS.textMuted || COLORS.textLight,
  },
  
  completedList: {
    paddingHorizontal: 20,
  },
  
  // Action buttons container (used in cart and recipe detail)
  actionButtonsContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
  },
  
  // Ingredient item styles (used in both cart and recipe detail)
  ingredientItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: COLORS.card,
    marginBottom: 8,
    borderRadius: 12,
    shadowColor: COLORS.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
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
    color: COLORS.textMuted || COLORS.textLight,
  },

  // Link styles
  linkText: {
    ...TYPOGRAPHY.body1,
    color: COLORS.link || COLORS.primary,
    fontWeight: "600",
  },

  // Status indicators
  successText: {
    ...TYPOGRAPHY.body2,
    color: COLORS.success || "#22C55E",
    fontWeight: "600",
  },

  warningText: {
    ...TYPOGRAPHY.body2,
    color: COLORS.warning || "#F59E0B",
    fontWeight: "600",
  },

  dangerText: {
    ...TYPOGRAPHY.body2,
    color: COLORS.danger || "#EF4444",
    fontWeight: "600",
  },

  // Overlay for modals/bottom sheets
  overlay: {
    flex: 1,
    backgroundColor: COLORS.overlay || "rgba(0,0,0,0.5)",
  },

  // Interactive element with pressed state
  touchableItem: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 16,
  },

  touchableItemPressed: {
    backgroundColor: COLORS.pressed || COLORS.border,
    borderRadius: 12,
    padding: 16,
  },

  // Muted text variations
  mutedText: {
    ...TYPOGRAPHY.body2,
    color: COLORS.textMuted || COLORS.textLight,
  },

  mutedCaption: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textMuted || COLORS.textLight,
  },
});
