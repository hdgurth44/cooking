# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Core Development
```bash
# Start development server
npx expo start

# Platform-specific development
npx expo start --ios
npx expo start --android
npx expo start --web

# Lint code
expo lint

# Reset project to blank state
npm run reset-project
```

### Testing Supabase Connection
```javascript
// Test in JavaScript console or create a test file
import { SupabaseAPI } from './services/supabaseAPI';
SupabaseAPI.getAllRecipes(5).then(console.log);
```

## Architecture Overview

### Tech Stack
- **Framework:** React Native with Expo SDK 54
- **Routing:** Expo Router with file-based routing
- **Authentication:** Clerk with token caching
- **Database:** Supabase with custom API layer
- **State Management:** React hooks (no external state management)
- **UI:** Custom components with theme system

### Project Structure
```
app/
├── (auth)/           # Authentication screens (sign-in, sign-up)
├── (tabs)/           # Main tab navigation
│   ├── index.jsx     # Home screen
│   ├── search.jsx    # Search screen
│   ├── favorites.jsx # Favorites screen
│   └── _layout.jsx   # Tab navigation layout
├── recipe/[id].jsx   # Recipe detail screen
└── _layout.jsx       # Root layout with Clerk provider

services/
├── supabaseAPI.js    # Custom Supabase API layer

components/           # Reusable UI components
constants/           # Theme colors and constants
utils/              # Utilities (Supabase config, auth errors)
```

### Authentication Flow
1. Root layout wraps app in ClerkProvider with token cache
2. Tab layout redirects unauthenticated users to `/(auth)/sign-in`
3. Authentication uses Clerk with email/password
4. Token persistence via AsyncStorage

### Data Architecture
The app uses a **custom Supabase API layer** (`services/supabaseAPI.js`) that abstracts all database operations:

#### Key API Methods
- `getAllRecipes(limit)` - Fetch recipes with optional limit
- `getRandomRecipes(count)` - Get random recipes for homepage
- `searchRecipes(query)` - Combined title/ingredient search
- `getRecipesByCategory(category)` - Filter by tags array
- `getFavoriteRecipes()` - Get user favorites via `h_pin` field
- `toggleFavorite(recipeId, userId, isFavorite)` - Toggle recipe favorite status
- `transformRecipeData(recipe)` - Convert Supabase format to app format

#### Database Schema (Supabase recipes table)
- `id` - UUID primary key
- `title` - Recipe name
- `summary` - Recipe description
- `image_url` - Recipe photo URL
- `prep_time` - Preparation time in minutes
- `servings` - Number of servings
- `ingredients` - JSON array of ingredients
- `instructions` - JSON array of cooking steps
- `tags` - JSON array for categories/filtering
- `link` - External/YouTube video links
- `h_pin` - Boolean for Harry's favorites

### Theme System
The app uses a comprehensive theme system in `constants/colors.js`:
- 9 predefined themes (coffee, forest, purple, ocean, sunset, mint, midnight, roseGold, catppuccin)
- Currently using `catppuccin` theme
- To change theme: modify `export const COLORS = THEMES.newTheme`
- All components reference `COLORS` for consistent styling

### Key Patterns

#### Search Implementation
- Primary search by recipe title using `ilike` operator
- Fallback to ingredient search if no title matches
- Empty queries return random recipes for discovery

#### Favorites System
- Uses `h_pin` boolean field in recipes table (not separate favorites table)
- Real-time toggle functionality with optimistic updates
- Dedicated favorites screen for saved recipes

#### Loading States
- All screens implement proper loading spinners
- Error handling with user-friendly messages
- Empty states for no results/favorites

#### Navigation
- File-based routing with Expo Router
- Tab navigation for main screens
- Stack navigation for recipe details
- Authentication-protected routes

## Environment Setup

### Required Environment Variables (.env)
```bash
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
EXPO_PUBLIC_SUPABASE_URL=https://ivvmxqqgumpczlegkaxo.supabase.co
EXPO_PUBLIC_SUPABASE_KEY=your_supabase_anon_key
```

### Key Dependencies
- `@clerk/clerk-expo` - Authentication with token caching
- `@supabase/supabase-js` - Database client with AsyncStorage
- `expo-router` - File-based navigation
- `@react-native-async-storage/async-storage` - Persistent storage
- `expo-image` - Optimized image loading
- `expo-web-browser` - In-app browser functionality

## Development Guidelines

### Code Style
- Use `.jsx` extension for React components
- Functional components with hooks
- Consistent import organization (React first, then libraries, then local)
- Color constants via `COLORS` theme system

### Data Fetching
- Always use `SupabaseAPI` methods, never direct Supabase queries
- Handle loading and error states in all API calls
- Use `transformRecipeData()` to ensure consistent data format
- Implement proper empty states

### Authentication
- Check authentication status with `useAuth()` from Clerk
- Use `getSignInErrorMessage()` for user-friendly auth error messages
- Handle loading states during authentication operations

### Navigation
- Use `useRouter()` for programmatic navigation
- File-based routing follows Expo Router conventions
- Protected routes handled in layout components