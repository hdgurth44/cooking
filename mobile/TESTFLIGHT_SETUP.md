# TestFlight & App Store Review Setup

## The Challenge

TestFlight requires **production builds** which typically use production Clerk instances (`pk_live_`). Clerk's test mode (`+clerk_test` emails) is usually only available in development instances (`pk_test_`).

## Solution Options

### Option 1: Pre-create Demo Accounts in Clerk (Recommended)

**For Production Clerk Instance:**

1. **Go to your Clerk Dashboard** (production instance)
2. **Navigate to Users section**
3. **Create the demo accounts manually:**
   - Email: `apple@tester.com`
   - Email: `appstore@review.com` 
   - Email: `demo@tester.com`
4. **Set passwords** or **enable email verification** for these accounts
5. **Test the flow** to ensure they work with normal verification codes

**Benefits:**
- Works with normal Clerk authentication flow
- `isSignedIn` will be `true` properly
- No special code needed
- Reliable for TestFlight and App Store review

### Option 2: Enable Test Mode in Production Clerk

**If you have a paid Clerk plan:**

1. **Go to Clerk Dashboard** → **Settings**
2. **Enable "Test Mode"** toggle
3. **Use test emails:** `apple+clerk_test@tester.com` with code `424242`

**Benefits:**
- Uses Clerk's official test mode
- No need to create actual accounts
- Works exactly like development

### Option 3: Hybrid Approach (Current Implementation)

The app now supports **both** approaches:

**Demo Accounts (Production):**
- `apple@tester.com` → code `000000`
- `appstore@review.com` → code `000000`
- `demo@tester.com` → code `000000`

**Test Emails (Development):**
- `apple+clerk_test@tester.com` → code `424242`
- Any email with `+clerk_test` → code `424242`

## Current App Behavior

1. **Detects demo accounts** and shows expected code in UI
2. **Tries normal Clerk verification first** (if account exists in Clerk)
3. **Falls back to helpful error message** if account doesn't exist
4. **Also supports Clerk test emails** for development

## Recommended Setup for TestFlight

1. **Create demo accounts in your production Clerk instance**
2. **Test the complete flow** before submitting to TestFlight
3. **Provide Apple reviewers** with the credentials from `APPLE_REVIEW_DEMO.md`

## Testing Checklist

- [ ] Demo accounts work in development build
- [ ] Demo accounts work in production build  
- [ ] Demo accounts work in TestFlight build
- [ ] `isSignedIn` becomes `true` after demo login
- [ ] All app features accessible after demo login
- [ ] Documentation is clear for Apple reviewers

## Troubleshooting

**If demo accounts don't work in TestFlight:**
1. Check if you're using production Clerk instance (`pk_live_`)
2. Verify demo accounts exist in Clerk Dashboard
3. Test with Clerk test emails if test mode is enabled
4. Check console logs for specific error messages

**If `isSignedIn` stays `false`:**
- This means Clerk session wasn't created properly
- Demo accounts must exist in Clerk for proper authentication
- Consider using Option 1 (pre-create accounts)
