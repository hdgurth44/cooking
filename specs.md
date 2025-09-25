# User-Specific Recipes Implementation Spec

## Problem Statement
Currently, all recipes in the app are shared globally. Users cannot have their own private recipes or see only recipes they've created/imported. The app needs to associate recipes with specific users based on their Clerk authentication.

## Current State
- ✅ Clerk authentication working (email verification flow)
- ✅ Supabase database with recipes table
- ✅ Recipe CRUD operations via `services/supabaseAPI.js`
- ❌ No user association with recipes
- ❌ All recipes are shared globally
- ❌ `userId` parameter exists in some API methods but not used for filtering

## Requirements

### Core Functionality
1. **User Association**: Each recipe should belong to a specific user. Existing recipes in the recipes table should be assigned to user_33A5bJH53B8avmfLhp5tCMEHweN (Clerk User ID - admin).
2. **Data Isolation**: Users should only see their own recipes, as well as the ones from user_33A5bJH53B8avmfLhp5tCMEHweN (Clerk User ID - admin)
3. **User ID Source**: Use Clerk's `userId` (from `useAuth()` hook)

### Database Changes Needed
1. Add `user_id` column to `recipes` table
2. Create database index on `user_id` for performance
3. Decide what to do with existing recipes: Existing recipes in the recipes table should be assigned to user_33A5bJH53B8avmfLhp5tCMEHweN (Clerk User ID - admin) & marked as shared. They should be editable/deletable only for user_33A5bJH53B8avmfLhp5tCMEHweN.

### Application Changes Needed
1. Update all Supabase API methods to filter by `user_id`
2. Pass `userId` from components to API methods
3. Handle loading states while user authentication loads

## Technical Approach

### Simple User ID Column
- Add `user_id TEXT` column to recipes table
- Filter all queries by current user's Clerk ID
- Minimal code changes required

## Scope Decisions Needed

### Database Schema
- [ ] Which approach: Simple User ID Column
- [ ] What to do with existing recipes?
  - [ ] Assign all to your user ID: user_33A5bJH53B8avmfLhp5tCMEHweN
  - [ ] Mark as "shared/public" recipes

### User Experience
- [ ] Should users be able to import/create new recipes? Yes, but we will implement the add/edit functionalities in a separate ticket.

### Migration Strategy
- [ ] Migrate existing data automatically or manually? Auto.
- [ ] Need downtime or can be done live? Live.

## Files That Need Changes

### Database
- `recipes` table schema (add user_id column)
- Out of scope: create `users` table
- Out of scope: add RLS policies

### Application Code
- `services/supabaseAPI.js` - Update all methods to filter by user_id
- `app/(tabs)/index.jsx` - Pass userId to API calls
- `app/(tabs)/search.jsx` - Pass userId to search methods
- `app/(tabs)/favorites.jsx` - Already uses userId, verify filtering
- `app/recipe/[id].jsx` - Already uses userId, verify filtering
- Any other components that call SupabaseAPI methods

## Success Criteria
1. ✅ Users only see their own recipes & the shared ones.
2. ✅ Favorites work per-user (already partially implemented)
3. ✅ Search only returns user's recipes & shared ones.
4. ✅ No breaking changes to existing UI/UX
5. ✅ Performance remains good (proper indexing)

## Questions to Resolve
1. Do you want recipe import/creation functionality? In another ticket.
2. Should some recipes remain shared/public? Yes, all existing ones.
3. How complex do you want the user management to be? As simple as possible.