import { supabase } from "../utils/supabase";

// Admin user ID for shared recipes
const ADMIN_USER_ID = 'user_33A5bJH53B8avmfLhp5tCMEHweN';

// Helper function to add user-specific filtering
const addUserFilter = (query, userId) => {
  if (!userId) {
    // If no user ID provided, only show admin/shared recipes
    return query.eq('user_id', ADMIN_USER_ID);
  }

  // Show user's own recipes AND admin/shared recipes
  return query.or(`user_id.eq.${userId},user_id.eq.${ADMIN_USER_ID}`);
};

export const SupabaseAPI = {
  // Get all recipes with optional limit
  getAllRecipes: async (limit = 50, userId = null) => {
    try {
      let query = supabase
        .from('recipes')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

      query = addUserFilter(query, userId);
      const { data: recipes, error } = await query;

      if (error) {
        console.error('Error fetching recipes:', error);
        return [];
      }

      return recipes || [];
    } catch (error) {
      console.error('Error fetching recipes:', error);
      return [];
    }
  },

  // Get a single recipe by ID
  getRecipeById: async (id, userId = null) => {
    try {
      let query = supabase
        .from('recipes')
        .select('*')
        .eq('id', id);

      query = addUserFilter(query, userId);
      const { data: recipe, error } = await query.single();

      if (error) {
        console.error('Error fetching recipe by ID:', error);
        return null;
      }

      return recipe;
    } catch (error) {
      console.error('Error fetching recipe by ID:', error);
      return null;
    }
  },

  // Get random recipes
  getRandomRecipes: async (count = 6, userId = null) => {
    try {
      // First get the total count of recipes for this user
      let countQuery = supabase
        .from('recipes')
        .select('*', { count: 'exact', head: true });

      countQuery = addUserFilter(countQuery, userId);
      const { count: totalCount, error: countError } = await countQuery;

      if (countError || !totalCount) {
        console.error('Error getting recipe count:', countError);
        return [];
      }

      // Generate random offset based on total count
      const maxOffset = Math.max(0, totalCount - count);
      const randomOffset = Math.floor(Math.random() * (maxOffset + 1));

      let query = supabase
        .from('recipes')
        .select('*')
        .range(randomOffset, randomOffset + count - 1);

      query = addUserFilter(query, userId);
      const { data: recipes, error } = await query;

      if (error) {
        console.error('Error fetching random recipes:', error);
        return [];
      }

      return recipes || [];
    } catch (error) {
      console.error('Error fetching random recipes:', error);
      return [];
    }
  },

  // Get a single random recipe for featured section
  getRandomRecipe: async (userId = null) => {
    try {
      const recipes = await SupabaseAPI.getRandomRecipes(1, userId);
      return recipes.length > 0 ? recipes[0] : null;
    } catch (error) {
      console.error('Error fetching random recipe:', error);
      return null;
    }
  },

  // Search recipes by title
  searchRecipesByTitle: async (query, userId = null) => {
    try {
      if (!query || query.trim() === '') {
        return await SupabaseAPI.getRandomRecipes(12, userId);
      }

      let searchQuery = supabase
        .from('recipes')
        .select('*')
        .ilike('title', `%${query}%`)
        .order('created_at', { ascending: false })
        .limit(20);

      searchQuery = addUserFilter(searchQuery, userId);
      const { data: recipes, error } = await searchQuery;

      if (error) {
        console.error('Error searching recipes by title:', error);
        return [];
      }

      return recipes || [];
    } catch (error) {
      console.error('Error searching recipes by title:', error);
      return [];
    }
  },

  // Search recipes by ingredients
  searchRecipesByIngredient: async (ingredient, userId = null) => {
    try {
      let searchQuery = supabase
        .from('recipes')
        .select('*')
        .contains('ingredients', [ingredient])
        .order('created_at', { ascending: false })
        .limit(20);

      searchQuery = addUserFilter(searchQuery, userId);
      const { data: recipes, error } = await searchQuery;

      if (error) {
        console.error('Error searching recipes by ingredient:', error);
        return [];
      }

      return recipes || [];
    } catch (error) {
      console.error('Error searching recipes by ingredient:', error);
      return [];
    }
  },

  // Get recipes by category (using tags array)
  getRecipesByCategory: async (category, userId = null) => {
    try {
      let categoryQuery = supabase
        .from('recipes')
        .select('*')
        .contains('tags', [category])
        .order('created_at', { ascending: false })
        .limit(20);

      categoryQuery = addUserFilter(categoryQuery, userId);
      const { data: recipes, error } = await categoryQuery;

      if (error) {
        console.error('Error fetching recipes by category:', error);
        return [];
      }

      return recipes || [];
    } catch (error) {
      console.error('Error fetching recipes by category:', error);
      return [];
    }
  },

  // Get unique categories from tags
  getCategories: async (userId = null) => {
    try {
      let categoriesQuery = supabase
        .from('recipes')
        .select('tags')
        .not('tags', 'is', null);

      categoriesQuery = addUserFilter(categoriesQuery, userId);
      const { data: recipes, error } = await categoriesQuery;

      if (error) {
        console.error('Error fetching categories:', error);
        return [];
      }

      // Extract unique tags/categories
      const allTags = recipes.flatMap(recipe => recipe.tags || []);
      const uniqueTags = [...new Set(allTags)];
      
      // Transform to match expected category format
      return uniqueTags.map((tag, index) => ({
        id: index + 1,
        name: tag,
        strCategory: tag,
        // You can add placeholder images or fetch from your assets
        image: "../../assets/images/i1.png", // Default category image
        description: `Delicious ${tag} recipes`,
      }));
    } catch (error) {
      console.error('Error fetching categories:', error);
      return [];
    }
  },

  // Advanced search combining title and ingredients
  searchRecipes: async (query, userId = null) => {
    try {
      if (!query || query.trim() === '') {
        return await SupabaseAPI.getRandomRecipes(12, userId);
      }

      // Search by title first
      let results = await SupabaseAPI.searchRecipesByTitle(query, userId);

      // If no results from title search, try ingredient search
      if (results.length === 0) {
        results = await SupabaseAPI.searchRecipesByIngredient(query, userId);
      }

      return results.slice(0, 12); // Limit to 12 results
    } catch (error) {
      console.error('Error searching recipes:', error);
      return [];
    }
  },

  // Get favorite recipes for a user
  getFavoriteRecipes: async (userId) => {
    try {
      if (!userId) {
        return [];
      }

      const { data: favorites, error } = await supabase
        .from('user_favorites')
        .select(`
          recipe_id,
          created_at,
          recipes (
            id,
            title,
            summary,
            image_url,
            prep_time,
            servings,
            ingredients,
            instructions,
            tags,
            link,
            user_id,
            created_at,
            updated_at
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching favorite recipes:', error);
        return [];
      }

      // Extract the recipe data from the joined result
      return favorites?.map(fav => fav.recipes).filter(recipe => recipe) || [];
    } catch (error) {
      console.error('Error fetching favorite recipes:', error);
      return [];
    }
  },

  // Toggle favorite status for a recipe
  toggleFavorite: async (recipeId, userId, isFavorite) => {
    try {
      if (!userId) {
        console.error('User ID required for favorites');
        return null;
      }

      if (isFavorite) {
        // Add to favorites
        const { data, error } = await supabase
          .from('user_favorites')
          .insert({
            user_id: userId,
            recipe_id: recipeId
          })
          .select()
          .single();

        if (error) {
          console.error('Error adding favorite:', error);
          return null;
        }

        return data;
      } else {
        // Remove from favorites
        const { data, error } = await supabase
          .from('user_favorites')
          .delete()
          .eq('user_id', userId)
          .eq('recipe_id', recipeId)
          .select()
          .single();

        if (error) {
          console.error('Error removing favorite:', error);
          return null;
        }

        return data;
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      return null;
    }
  },

  // Check if recipe is favorited by user
  isFavorite: async (recipeId, userId) => {
    try {
      if (!userId) {
        return false;
      }

      const { data: favorite, error } = await supabase
        .from('user_favorites')
        .select('id')
        .eq('user_id', userId)
        .eq('recipe_id', recipeId)
        .single();

      if (error && error.code !== 'PGRST116') {
        // PGRST116 is "not found" error, which is expected when not favorited
        console.error('Error checking favorite status:', error);
        return false;
      }

      return !!favorite;
    } catch (error) {
      console.error('Error checking favorite status:', error);
      return false;
    }
  },

  // Get meal prep recipes for a user
  getMealPrepRecipes: async (userId) => {
    try {
      if (!userId) {
        return [];
      }

      const { data: mealprep, error } = await supabase
        .from('user_mealprep')
        .select(`
          recipe_id,
          created_at,
          recipes (
            id,
            title,
            summary,
            image_url,
            prep_time,
            servings,
            ingredients,
            instructions,
            tags,
            link,
            user_id,
            created_at,
            updated_at
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching meal prep recipes:', error);
        return [];
      }

      // Extract the recipe data from the joined result
      return mealprep?.map(prep => prep.recipes).filter(recipe => recipe) || [];
    } catch (error) {
      console.error('Error fetching meal prep recipes:', error);
      return [];
    }
  },

  // Toggle meal prep status for a recipe
  toggleMealPrep: async (recipeId, userId, isInMealPrep) => {
    try {
      if (!userId) {
        console.error('User ID required for meal prep');
        return null;
      }

      if (isInMealPrep) {
        // Add to meal prep
        const { data, error } = await supabase
          .from('user_mealprep')
          .insert({
            user_id: userId,
            recipe_id: recipeId
          })
          .select()
          .single();

        if (error) {
          console.error('Error adding to meal prep:', error);
          return null;
        }

        return data;
      } else {
        // Remove from meal prep
        const { data, error } = await supabase
          .from('user_mealprep')
          .delete()
          .eq('user_id', userId)
          .eq('recipe_id', recipeId)
          .select()
          .single();

        if (error) {
          console.error('Error removing from meal prep:', error);
          return null;
        }

        return data;
      }
    } catch (error) {
      console.error('Error toggling meal prep:', error);
      return null;
    }
  },

  // Check if recipe is in meal prep for user
  isInMealPrep: async (recipeId, userId) => {
    try {
      if (!userId) {
        return false;
      }

      const { data: mealprep, error } = await supabase
        .from('user_mealprep')
        .select('id')
        .eq('user_id', userId)
        .eq('recipe_id', recipeId)
        .single();

      if (error && error.code !== 'PGRST116') {
        // PGRST116 is "not found" error, which is expected when not in meal prep
        console.error('Error checking meal prep status:', error);
        return false;
      }

      return !!mealprep;
    } catch (error) {
      console.error('Error checking meal prep status:', error);
      return false;
    }
  },

  // Transform Supabase recipe data to match app format (similar to MealAPI.transformMealData)
  transformRecipeData: (recipe) => {
    if (!recipe) return null;

    // Transform ingredients from objects to strings
    const transformedIngredients = (recipe.ingredients || []).map(ingredient => {
      // Handle different ingredient formats
      if (typeof ingredient === 'string') {
        return ingredient;
      } else if (typeof ingredient === 'object' && ingredient !== null) {
        // Handle object format: {item, unit, amount, ingredient}
        const { item, unit, amount, ingredient: ingredientName } = ingredient;
        const name = ingredientName || item || '';
        const measureText = amount && unit ? `${amount} ${unit} ` : 
                           amount ? `${amount} ` : 
                           unit ? `${unit} ` : '';
        return `${measureText}${name}`.trim();
      }
      return '';
    }).filter(ingredient => ingredient.trim() !== '');

    // Transform instructions to ensure they're strings
    const transformedInstructions = (recipe.instructions || []).map(instruction => {
      if (typeof instruction === 'string') {
        return instruction;
      } else if (typeof instruction === 'object' && instruction !== null) {
        // Handle object format with step, instruction, etc.
        return instruction.instruction || instruction.step || JSON.stringify(instruction);
      }
      return '';
    }).filter(instruction => instruction.trim() !== '');

    return {
      id: recipe.id,
      title: recipe.title,
      description: recipe.summary || 'Delicious recipe from our collection',
      image: recipe.image_url,
      cookTime: `${recipe.prep_time || 30} minutes`,
      servings: recipe.servings || 4,
      category: recipe.tags && recipe.tags.length > 0 ? recipe.tags[0] : 'Main Course',
      area: 'Local Cuisine', // You can add this field to your DB if needed
      ingredients: transformedIngredients,
      instructions: transformedInstructions,
      originalData: recipe,
      youtubeUrl: recipe.link, // If you want to use the link field for videos
    };
  },
};
