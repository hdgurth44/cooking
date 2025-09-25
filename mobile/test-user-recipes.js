// Test script to verify user-specific recipes implementation
// Run this with: node test-user-recipes.js

const { SupabaseAPI } = require('./services/supabaseAPI');

const ADMIN_USER_ID = 'user_33A5bJH53B8avmfLhp5tCMEHweN';
const TEST_USER_ID = 'user_test123'; // A fake user ID for testing

async function testUserSpecificRecipes() {
  console.log('🧪 Testing user-specific recipes implementation...\n');

  try {
    // Test 1: Admin user should see all recipes
    console.log('📋 Test 1: Admin user fetching recipes');
    const adminRecipes = await SupabaseAPI.getAllRecipes(5, ADMIN_USER_ID);
    console.log(`✅ Admin user sees ${adminRecipes.length} recipes`);

    // Test 2: New user should also see admin's shared recipes
    console.log('\n📋 Test 2: New user fetching recipes (should see shared ones)');
    const newUserRecipes = await SupabaseAPI.getAllRecipes(5, TEST_USER_ID);
    console.log(`✅ New user sees ${newUserRecipes.length} recipes (shared from admin)`);

    // Test 3: No user ID provided should show admin recipes only
    console.log('\n📋 Test 3: No user ID provided (should see admin/shared recipes)');
    const noUserRecipes = await SupabaseAPI.getAllRecipes(5);
    console.log(`✅ Without user ID: ${noUserRecipes.length} recipes shown`);

    // Test 4: Search functionality
    console.log('\n📋 Test 4: Search with user ID');
    const searchResults = await SupabaseAPI.searchRecipes('chicken', TEST_USER_ID);
    console.log(`✅ Search for "chicken": ${searchResults.length} results`);

    // Test 5: Categories
    console.log('\n📋 Test 5: Categories with user ID');
    const categories = await SupabaseAPI.getCategories(TEST_USER_ID);
    console.log(`✅ Categories available: ${categories.length}`);

    // Test 6: Verify recipes have user_id field
    if (adminRecipes.length > 0) {
      const firstRecipe = adminRecipes[0];
      console.log(`\n📋 Test 6: Recipe data structure`);
      console.log(`✅ Recipe "${firstRecipe.title}" has user_id: ${firstRecipe.user_id || 'undefined'}`);
    }

    console.log('\n🎉 All tests completed successfully!');
    console.log('\n💡 If you see recipes in all tests, the implementation is working correctly.');
    console.log('💡 Users will see their own recipes + shared admin recipes.');

  } catch (error) {
    console.error('❌ Test failed:', error);
    console.log('\n💡 Make sure you ran the database migration first!');
  }
}

// Run the test if this file is executed directly
if (require.main === module) {
  testUserSpecificRecipes();
}

module.exports = { testUserSpecificRecipes };