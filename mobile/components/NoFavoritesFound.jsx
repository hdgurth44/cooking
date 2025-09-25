import { useRouter } from "expo-router";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../constants/colors";
import { favoritesStyles } from "../assets/styles/favorites.styles";
import { sharedStyles } from "../assets/styles/shared.styles";

function NoFavoritesFound() {
  const router = useRouter();

  return (
    <View style={sharedStyles.emptyState}>
      <View style={favoritesStyles.emptyIconContainer}>
        <Ionicons name="heart-outline" size={80} color={COLORS.textLight} />
      </View>
      <Text style={sharedStyles.emptyTitle}>No favorites yet</Text>
      <Text style={sharedStyles.emptyDescription}>
        Start exploring recipes and save your favorites here
      </Text>
      <TouchableOpacity style={favoritesStyles.exploreButton} onPress={() => router.push("/")}>
        <Ionicons name="search" size={18} color={COLORS.white} />
        <Text style={favoritesStyles.exploreButtonText}>Explore Recipes</Text>
      </TouchableOpacity>
    </View>
  );
}

export default NoFavoritesFound;