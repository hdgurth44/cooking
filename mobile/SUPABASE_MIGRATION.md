# Supabase Migration Guide

## Overview
Successfully migrated from TheMealDB API to Supabase database for the cooking app. All recipe data now comes from your custom Supabase recipes table.

## Changes Made

### 1. Created New Supabase Service (`services/supabaseAPI.js`)
- **getAllRecipes()** - Fetch all recipes with optional limit
- **getRecipeById()** - Get single recipe by ID  
- **getRandomRecipes()** - Get random recipes for homepage
- **searchRecipes()** - Combined search by title and ingredients
- **getRecipesByCategory()** - Filter recipes by tags/categories
- **getFavoriteRecipes()** - Get user's favorite recipes (using h_pin field)
- **toggleFavorite()** - Add/remove recipes from favorites
- **transformRecipeData()** - Convert Supabase data to app format

### 2. Updated Components

#### Home Screen (`app/(tabs)/index.jsx`)
- ✅ Fetches random recipes from Supabase
- ✅ Gets categories from recipe tags
- ✅ Filters by category using tags
- ✅ Added loading states

#### Search Screen (`app/(tabs)/search.jsx`)  
- ✅ Searches recipes by title and ingredients
- ✅ Fallback to random recipes when no query
- ✅ Combined search functionality

#### Recipe Detail Screen (`app/recipe/[id].jsx`)
- ✅ Fetches full recipe details from Supabase
- ✅ Real favorite toggle functionality
- ✅ Checks favorite status on load
- ✅ Handles video/link URLs properly

#### Favorites Screen (`app/(tabs)/favorites.jsx`)
- ✅ Loads user's favorite recipes
- ✅ Uses h_pin field for Harry's favorites
- ✅ Proper loading and error states

## Database Schema Mapping

| Supabase Field | App Usage | Description |
|----------------|-----------|-------------|
| `id` | Recipe ID | UUID primary key |
| `title` | Recipe title | Main recipe name |
| `summary` | Description | Recipe summary/description |
| `image_url` | Recipe image | Main recipe photo |
| `prep_time` | Cook time | Preparation time in minutes |
| `servings` | Servings | Number of servings |
| `ingredients` | Ingredients list | JSON array of ingredients |
| `instructions` | Instructions | JSON array of cooking steps |
| `tags` | Categories | JSON array for filtering |
| `link` | Video URL | YouTube or external links |
| `h_pin` | Harry's favorites | Boolean for favorited recipes |

## Setup Instructions

### 1. Environment Variables
Ensure your `.env` file contains:
```bash
EXPO_PUBLIC_SUPABASE_URL=https://ivvmxqqgumpczlegkaxo.supabase.co
EXPO_PUBLIC_SUPABASE_KEY=your_anon_key_here
```

### 2. Supabase Configuration
The app uses the existing `utils/supabase.ts` configuration with AsyncStorage for session persistence.

### 3. Test the Connection
You can test if Supabase is working by running this in your app:

```javascript
import { SupabaseAPI } from './services/supabaseAPI';

// Test fetching recipes
SupabaseAPI.getAllRecipes(5).then(recipes => {
  console.log('Fetched recipes:', recipes);
});
```

## Key Features

### 🔍 Smart Search
- Searches by recipe title first
- Falls back to ingredient search if no title matches
- Returns random recipes for empty queries

### ⭐ Favorites System  
- Uses `h_pin` boolean field for favorites
- Real-time toggle functionality
- Separate favorites screen showing saved recipes

### 🏷️ Dynamic Categories
- Extracts unique tags from recipes
- Filters recipes by selected category
- Shows category counts

### 📱 Optimized Performance
- Efficient random recipe fetching
- Proper loading states throughout
- Error handling for all API calls

## Migration Benefits

1. **Data Control** - Full control over recipe data and structure
2. **Performance** - Faster queries with proper indexing
3. **Favorites** - Real persistent favorites functionality  
4. **Search** - Better search capabilities across title and ingredients
5. **Extensibility** - Easy to add new fields and features
6. **Offline Support** - Can add offline caching with Supabase

## Future Enhancements

- [ ] Add recipe ratings using `h_rating` and `t_rating` fields
- [ ] Implement comments using `h_comment` and `t_comment` fields  
- [ ] Add user-specific favorites table for multiple users
- [ ] Implement recipe creation/editing functionality
- [ ] Add image upload to Supabase Storage
- [ ] Cache recipes locally for offline access

## Troubleshooting

### Common Issues:
1. **Empty recipes** - Check if your Supabase table has data
2. **Network errors** - Verify environment variables are set
3. **Categories not showing** - Ensure recipes have tags array populated
4. **Favorites not working** - Check RLS policies on recipes table

### Debug Commands:
```javascript
// Test Supabase connection
import { supabase } from './utils/supabase';
supabase.from('recipes').select('count').then(console.log);

// Check specific recipe
SupabaseAPI.getRecipeById('some-uuid').then(console.log);
```
