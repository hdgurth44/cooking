// Test script to verify user-specific favorites implementation
// Run this with: node test-user-favorites.js

const { SupabaseAPI } = require('./services/supabaseAPI');

const TEST_USER_1 = 'user_test_alice';
const TEST_USER_2 = 'user_test_bob';
const ADMIN_USER_ID = 'user_33A5bJH53B8avmfLhp5tCMEHweN';

async function testUserSpecificFavorites() {
  console.log('🧪 Testing user-specific favorites implementation...\n');

  try {
    // First, get some recipes to work with
    console.log('📋 Getting available recipes...');
    const availableRecipes = await SupabaseAPI.getAllRecipes(5, ADMIN_USER_ID);

    if (availableRecipes.length === 0) {
      console.log('❌ No recipes found. Make sure you have recipes in your database.');
      return;
    }

    const testRecipeId = availableRecipes[0].id;
    console.log(`✅ Using test recipe: "${availableRecipes[0].title}" (ID: ${testRecipeId})\n`);

    // Test 1: Check initial favorite status
    console.log('📋 Test 1: Check initial favorite status');
    const user1InitialStatus = await SupabaseAPI.isFavorite(testRecipeId, TEST_USER_1);
    const user2InitialStatus = await SupabaseAPI.isFavorite(testRecipeId, TEST_USER_2);
    console.log(`✅ User 1 initial favorite status: ${user1InitialStatus}`);
    console.log(`✅ User 2 initial favorite status: ${user2InitialStatus}`);

    // Test 2: User 1 favorites the recipe
    console.log('\\n📋 Test 2: User 1 favorites the recipe');
    const favoriteResult1 = await SupabaseAPI.toggleFavorite(testRecipeId, TEST_USER_1, true);
    console.log(`✅ User 1 favorite toggle result: ${favoriteResult1 ? 'Success' : 'Failed'}`);

    // Test 3: Check favorite status after User 1 favorites
    console.log('\\n📋 Test 3: Check favorite status after User 1 favorites');
    const user1StatusAfter = await SupabaseAPI.isFavorite(testRecipeId, TEST_USER_1);
    const user2StatusAfter = await SupabaseAPI.isFavorite(testRecipeId, TEST_USER_2);
    console.log(`✅ User 1 favorite status: ${user1StatusAfter} (should be true)`);
    console.log(`✅ User 2 favorite status: ${user2StatusAfter} (should still be false)`);

    // Test 4: User 2 also favorites the same recipe
    console.log('\\n📋 Test 4: User 2 also favorites the same recipe');
    const favoriteResult2 = await SupabaseAPI.toggleFavorite(testRecipeId, TEST_USER_2, true);
    console.log(`✅ User 2 favorite toggle result: ${favoriteResult2 ? 'Success' : 'Failed'}`);

    // Test 5: Check both users now have it favorited
    console.log('\\n📋 Test 5: Check both users now have it favorited');
    const user1FinalStatus = await SupabaseAPI.isFavorite(testRecipeId, TEST_USER_1);
    const user2FinalStatus = await SupabaseAPI.isFavorite(testRecipeId, TEST_USER_2);
    console.log(`✅ User 1 favorite status: ${user1FinalStatus} (should be true)`);
    console.log(`✅ User 2 favorite status: ${user2FinalStatus} (should be true)`);

    // Test 6: Get User 1's favorite recipes
    console.log('\\n📋 Test 6: Get User 1\\'s favorite recipes');
    const user1Favorites = await SupabaseAPI.getFavoriteRecipes(TEST_USER_1);
    console.log(`✅ User 1 has ${user1Favorites.length} favorite recipes`);

    // Test 7: Get User 2's favorite recipes
    console.log('\\n📋 Test 7: Get User 2\\'s favorite recipes');
    const user2Favorites = await SupabaseAPI.getFavoriteRecipes(TEST_USER_2);
    console.log(`✅ User 2 has ${user2Favorites.length} favorite recipes`);

    // Test 8: User 1 removes the favorite
    console.log('\\n📋 Test 8: User 1 removes the favorite');
    const unfavoriteResult = await SupabaseAPI.toggleFavorite(testRecipeId, TEST_USER_1, false);
    console.log(`✅ User 1 unfavorite result: ${unfavoriteResult ? 'Success' : 'Failed'}`);

    // Test 9: Check final status
    console.log('\\n📋 Test 9: Check final status');
    const user1FinalAfterRemove = await SupabaseAPI.isFavorite(testRecipeId, TEST_USER_1);
    const user2StillFavorited = await SupabaseAPI.isFavorite(testRecipeId, TEST_USER_2);
    console.log(`✅ User 1 favorite status: ${user1FinalAfterRemove} (should be false)`);
    console.log(`✅ User 2 favorite status: ${user2StillFavorited} (should still be true)`);

    console.log('\\n🎉 All tests completed!');

    if (user1FinalAfterRemove === false && user2StillFavorited === true) {
      console.log('\\n✅ SUCCESS: User-specific favorites are working correctly!');
      console.log('💡 Each user now has their own independent favorites list.');
    } else {
      console.log('\\n❌ ISSUE: User-specific favorites may not be working as expected.');
    }

    // Cleanup: Remove User 2's favorite for clean test runs
    console.log('\\n🧹 Cleaning up test data...');
    await SupabaseAPI.toggleFavorite(testRecipeId, TEST_USER_2, false);
    console.log('✅ Cleanup completed');

  } catch (error) {
    console.error('❌ Test failed:', error);
    console.log('\\n💡 Make sure you ran the user-favorites-migration.sql in your Supabase dashboard!');
  }
}

// Run the test if this file is executed directly
if (require.main === module) {
  testUserSpecificFavorites();
}

module.exports = { testUserSpecificFavorites };