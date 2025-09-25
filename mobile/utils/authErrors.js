/**
 * Authentication Error Handling Utilities
 * 
 * This module provides user-friendly error message translations for Clerk authentication errors.
 * Instead of showing technical error codes to users, this utility converts them into clear,
 * actionable messages that help users understand and resolve authentication issues.
 */

/**
 * Converts Clerk authentication errors into user-friendly messages
 * @param {Object} error - The error object from Clerk
 * @returns {string} A user-friendly error message
 */
export const getAuthErrorMessage = (error) => {
  if (!error?.errors?.[0]) {
    return "Something went wrong. Please try again.";
  }

  const errorCode = error.errors[0].code;
  const errorMessage = error.errors[0].message;

  // Common Clerk error codes and user-friendly messages
  switch (errorCode) {
    // Sign-in specific errors
    case "form_identifier_not_found":
      return "No account found with this email address.";
    case "form_password_incorrect":
      return "Incorrect password. Please try again.";
    case "authentication_invalid":
      return "Invalid email or password. Please check your credentials and try again.";
    case "session_exists":
      return "You're already signed in.";

    // Sign-up specific errors
    case "form_identifier_exists":
      return "An account with this email already exists. Please sign in instead.";

    // Password validation errors
    case "form_password_pwned":
      return "This password has been found in a data breach. Please choose a different password.";
    case "form_password_length_too_short":
    case "form_password_validation_failed":
      return "Password must be at least 8 characters long.";

    // Email validation errors
    case "form_param_format_invalid":
      return "Please enter a valid email address.";

    // Verification errors
    case "verification_expired":
      return "Verification code has expired. Please request a new one.";
    case "verification_failed":
      return "Invalid verification code. Please try again.";

    // Rate limiting
    case "too_many_requests":
      return "Too many attempts. Please wait a moment before trying again.";

    default:
      // For unknown errors, check if the message is user-friendly
      if (errorMessage && errorMessage.length < 100 && !errorMessage.toLowerCase().includes("clerk")) {
        return errorMessage;
      }
      return "Unable to complete this action. Please try again.";
  }
};

/**
 * Gets a context-specific error message for sign-in operations
 * @param {Object} error - The error object from Clerk
 * @returns {string} A user-friendly error message tailored for sign-in
 */
export const getSignInErrorMessage = (error) => {
  const baseMessage = getAuthErrorMessage(error);
  
  // If it's a generic message, make it more specific for sign-in
  if (baseMessage === "Unable to complete this action. Please try again.") {
    return "Unable to sign in. Please check your credentials and try again.";
  }
  
  return baseMessage;
};

/**
 * Gets a context-specific error message for sign-up operations
 * @param {Object} error - The error object from Clerk
 * @returns {string} A user-friendly error message tailored for sign-up
 */
export const getSignUpErrorMessage = (error) => {
  const baseMessage = getAuthErrorMessage(error);
  
  // If it's a generic message, make it more specific for sign-up
  if (baseMessage === "Unable to complete this action. Please try again.") {
    return "Unable to create account. Please try again.";
  }
  
  return baseMessage;
};

/**
 * Gets a context-specific error message for verification operations
 * @param {Object} error - The error object from Clerk
 * @returns {string} A user-friendly error message tailored for verification
 */
export const getVerificationErrorMessage = (error) => {
  const baseMessage = getAuthErrorMessage(error);
  
  // If it's a generic message, make it more specific for verification
  if (baseMessage === "Unable to complete this action. Please try again.") {
    return "Unable to verify your email. Please try again.";
  }
  
  return baseMessage;
};
