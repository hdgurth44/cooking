import { View, Text, Alert, ScrollView, TouchableOpacity, FlatList, TextInput, Linking, RefreshControl } from "react-native";
import { useClerk, useUser } from "@clerk/clerk-expo";
import { useEffect, useState, useCallback } from "react";
import { favoritesStyles } from "../../assets/styles/favorites.styles";
import { COLORS } from "../../constants/colors";
import { Ionicons } from "@expo/vector-icons";
import RecipeCard from "../../components/RecipeCard";
import NoFavoritesFound from "../../components/NoFavoritesFound";
import LoadingSpinner from "../../components/LoadingSpinner";
import { SupabaseAPI } from "../../services/supabaseAPI";

const FavoritesScreen = () => {
  const { signOut } = useClerk();
  const { user } = useUser();
  const [favoriteRecipes, setFavoriteRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [userEmoji, setUserEmoji] = useState("🍳");
  const [userName, setUserName] = useState("");
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempUserName, setTempUserName] = useState("");
  const emojis = ["🍳", "👨‍🍳", "👩‍🍳", "🧑‍🍳", "🍴", "🥘", "🍽️", "🔥", "⭐"];

  useEffect(() => {
    if (user?.emailAddresses?.[0]?.emailAddress) {
      setUserName(user.emailAddresses[0].emailAddress.split('@')[0]);
    } else {
      setUserName("Username");
    }
  }, [user]);

  useEffect(() => {
    const initializeData = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      try {
        await loadFavorites();
      } finally {
        setLoading(false);
      }
    };

    initializeData();
  }, [user?.id, loadFavorites]);

  const handleSignOut = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      { text: "Logout", style: "destructive", onPress: signOut },
    ]);
  };

  const handleShare = () => {
    // Placeholder for future share functionality
    Alert.alert("Share", "Share functionality coming soon!");
  };

  const handleWriteFeedback = () => {
    const email = "hdgurth@gmail.com";
    const subject = "App Feedback";
    const body = "Hi there,\n\nI'd like to share some feedback about the cooking app:\n\n";
    const mailtoUrl = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    Linking.openURL(mailtoUrl).catch((err) => {
      Alert.alert("Error", "Unable to open email client. Please send feedback to hdgurth@gmail.com");
    });
  };

  const handleNameEdit = () => {
    setTempUserName(userName);
    setIsEditingName(true);
  };

  const handleNameSave = () => {
    if (tempUserName.trim()) {
      setUserName(tempUserName.trim());
    }
    setIsEditingName(false);
  };

  const handleNameCancel = () => {
    setTempUserName("");
    setIsEditingName(false);
  };

  const handleEmojiChange = () => {
    const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
    setUserEmoji(randomEmoji);
  };

  const loadFavorites = useCallback(async () => {
    if (!user?.id) {
      return;
    }

    try {
      const favorites = await SupabaseAPI.getFavoriteRecipes(user.id);
      const transformedFavorites = favorites
        .map((recipe) => SupabaseAPI.transformRecipeData(recipe))
        .filter((recipe) => recipe !== null);
      setFavoriteRecipes(transformedFavorites);
    } catch (error) {
      console.error("Error loading favorites:", error);
      setFavoriteRecipes([]);
    }
  }, [user?.id]);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await loadFavorites();
    } finally {
      setRefreshing(false);
    }
  };

  if (loading) return <LoadingSpinner message="Loading your favorites..." />;

  return (
    <View style={favoritesStyles.container}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.primary}
            colors={[COLORS.primary]}
          />
        }
      >

        {/* Profile Section */}
        <View style={favoritesStyles.profileSection}>
          <TouchableOpacity onPress={handleEmojiChange} style={favoritesStyles.avatarContainer}>
            <Text style={favoritesStyles.avatar}>{userEmoji}</Text>
          </TouchableOpacity>
          {isEditingName ? (
            <View style={favoritesStyles.nameEditContainer}>
              <TextInput
                style={favoritesStyles.nameInput}
                value={tempUserName}
                onChangeText={setTempUserName}
                placeholder="Enter your name"
                placeholderTextColor={COLORS.textLight}
                autoFocus
                onSubmitEditing={handleNameSave}
                returnKeyType="done"
              />
              <View style={favoritesStyles.nameEditButtons}>
                <TouchableOpacity onPress={handleNameCancel} style={favoritesStyles.nameEditButton}>
                  <Ionicons name="close" size={16} color={COLORS.textLight} />
                </TouchableOpacity>
                <TouchableOpacity onPress={handleNameSave} style={favoritesStyles.nameEditButton}>
                  <Ionicons name="checkmark" size={16} color={COLORS.primary} />
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <TouchableOpacity onPress={handleNameEdit} style={favoritesStyles.nameContainer}>
              <Text style={favoritesStyles.userName}>{userName}</Text>
              <Ionicons name="pencil" size={16} color={COLORS.textLight} style={favoritesStyles.editIcon} />
            </TouchableOpacity>
          )}
        </View>

        {/* Settings Section */}
        <View style={favoritesStyles.settingsSection}>
          <TouchableOpacity style={favoritesStyles.settingButtonWithBorder} onPress={handleShare}>
            <Ionicons name="share-outline" size={20} color={COLORS.text} />
            <Text style={favoritesStyles.settingText}>Share</Text>
            <Ionicons name="chevron-forward" size={16} color={COLORS.textLight} />
          </TouchableOpacity>
          <TouchableOpacity style={favoritesStyles.settingButtonWithBorder} onPress={handleWriteFeedback}>
            <Ionicons name="mail-outline" size={20} color={COLORS.text} />
            <Text style={favoritesStyles.settingText}>Write Feedback</Text>
            <Ionicons name="chevron-forward" size={16} color={COLORS.textLight} />
          </TouchableOpacity>
          <TouchableOpacity style={favoritesStyles.settingButton} onPress={handleSignOut}>
            <Ionicons name="log-out-outline" size={20} color={COLORS.text} />
            <Text style={favoritesStyles.settingText}>Sign Out</Text>
            <Ionicons name="chevron-forward" size={16} color={COLORS.textLight} />
          </TouchableOpacity>
        </View>

        {/* Favorites Section - Same layout as home screen */}
        <View style={favoritesStyles.recipesSection}>
          <Text style={favoritesStyles.sectionTitle}>My Favorites</Text>
          {favoriteRecipes.length > 0 ? (
            <FlatList
              data={favoriteRecipes}
              renderItem={({ item }) => <RecipeCard recipe={item} />}
              keyExtractor={(item) => item.id.toString()}
              numColumns={2}
              columnWrapperStyle={favoritesStyles.row}
              contentContainerStyle={favoritesStyles.recipesGrid}
              scrollEnabled={false}
              marginTop={16}
            />
          ) : (
            <NoFavoritesFound />
          )}
        </View>
      </ScrollView>

    </View>
  );
};
export default FavoritesScreen;