import { StyleSheet } from "react-native";
import { COLORS, TYPOGRAPHY } from "../../constants/colors";
import { sharedStyles } from "./shared.styles";

export const favoritesStyles = StyleSheet.create({
  // Use shared styles for common patterns
  ...sharedStyles,
  
  // Favorites-specific styles only
  screenTitle: {
    ...TYPOGRAPHY.h2,
    paddingHorizontal: 20,
  },
  profileSection: {
    alignItems: "center",
    paddingVertical: 32,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.card,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    shadowColor: COLORS.shadow,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  avatar: {
    fontSize: 40,
  },
  nameContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  userName: {
    ...TYPOGRAPHY.h3,
    color: COLORS.text,
    letterSpacing: -0.3,
  },
  editIcon: {
    opacity: 0.6,
  },
  nameEditContainer: {
    alignItems: "center",
    gap: 12,
  },
  nameInput: {
    ...TYPOGRAPHY.h3,
    color: COLORS.text,
    letterSpacing: -0.3,
    textAlign: "center",
    borderBottomWidth: 2,
    borderBottomColor: COLORS.primary,
    paddingVertical: 4,
    paddingHorizontal: 16,
    minWidth: 200,
  },
  nameEditButtons: {
    flexDirection: "row",
    gap: 16,
  },
  nameEditButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.card,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: COLORS.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  settingsSection: {
    marginHorizontal: 20,
    marginBottom: 32,
    backgroundColor: COLORS.card,
    borderRadius: 16,
    shadowColor: COLORS.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  settingButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  settingButtonWithBorder: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  settingText: {
    flex: 1,
    ...TYPOGRAPHY.body1,
    fontWeight: "500",
    color: COLORS.text,
    marginLeft: 12,
  },
  // Removed favoritesHeader and favoritesTitle - now using shared sectionTitle
  statsContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    marginTop: 24,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    shadowColor: COLORS.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  statValue: {
    ...TYPOGRAPHY.h5,
    color: COLORS.text,
  },
  // Match home screen recipe section layout
  recipesSection: {
    paddingHorizontal: 20,
    marginTop: 8,
  },
  
  // Override shared sectionTitle to match local padding
  sectionTitle: {
    ...TYPOGRAPHY.h4,
    color: COLORS.text,
    marginBottom: 16,
    paddingHorizontal: 0, // No additional padding since recipesSection already has padding
  },
  
  // Keep favorites-specific grid layout only  
  recipesGrid: {
    gap: 4,
  },
  row: {
    justifyContent: "space-between",
    gap: 4,
  },
  
  // Unique empty state icon for favorites
  emptyIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLORS.card,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
    borderWidth: 2,
    borderColor: COLORS.border,
    borderStyle: "dashed",
  },
  
  // Empty state styles for NoFavoritesFound component
  exploreButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    gap: 8,
  },
  
  exploreButtonText: {
    ...TYPOGRAPHY.button,
    color: COLORS.white,
  },
});