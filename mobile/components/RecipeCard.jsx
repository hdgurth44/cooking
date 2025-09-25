import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { COLORS } from "../constants/colors";
import { sharedStyles } from "../assets/styles/shared.styles";

export default function RecipeCard({ recipe }) {
  const router = useRouter();

  return (
    <TouchableOpacity
      style={sharedStyles.recipeCard}
      onPress={() => router.push(`/recipe/${recipe.id}`)}
      activeOpacity={0.8}
    >
      <View style={{ position: "relative", height: 140 }}>
        <Image
          source={{ uri: recipe.image }}
          style={sharedStyles.recipeCardImage}
          contentFit="cover"
          transition={300}
        />
      </View>

      <View style={sharedStyles.recipeCardContent}>
        <View>
          <Text style={sharedStyles.recipeCardTitle} numberOfLines={2}>
            {recipe.title}
          </Text>
          {recipe.description && (
            <Text style={sharedStyles.recipeCardDescription} numberOfLines={2}>
              {recipe.description}
            </Text>
          )}
        </View>

        <View style={sharedStyles.recipeCardFooter}>
          {recipe.cookTime && (
            <View style={sharedStyles.recipeCardMeta}>
              <Ionicons
                name="time-outline"
                size={14}
                color={COLORS.textLight}
              />
              <Text style={sharedStyles.recipeCardMetaText}>{recipe.cookTime}</Text>
            </View>
          )}
          {recipe.servings && (
            <View style={sharedStyles.recipeCardMeta}>
              <Ionicons
                name="people-outline"
                size={14}
                color={COLORS.textLight}
              />
              <Text style={sharedStyles.recipeCardMetaText}>
                {recipe.servings}
              </Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}
