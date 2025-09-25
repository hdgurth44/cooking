import {
  View,
  Text,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import { useRouter } from "expo-router";
import { useSignIn, useSignUp } from "@clerk/clerk-expo";
import { authStyles } from "../../assets/styles/auth.styles";
import { Image } from "expo-image";
import { COLORS } from "../../constants/colors";
import { Ionicons } from "@expo/vector-icons";

const AuthScreen = () => {
  const router = useRouter();
  const { signIn, isLoaded: signInLoaded } = useSignIn();
  const { signUp, isLoaded: signUpLoaded } = useSignUp();

  const [emailAddress, setEmailAddress] = useState("");
  const [loading, setLoading] = useState(false);

  const handleContinue = async () => {
    if (!emailAddress) {
      Alert.alert("Missing Information", "Please enter your email address to continue.");
      return;
    }

    if (!signInLoaded || !signUpLoaded) return;

    setLoading(true);

    try {
      // First try to sign in (existing user)
      try {
        const signInAttempt = await signIn.create({
          identifier: emailAddress,
        });

        // If we need email verification for sign-in, prepare it
        if (signInAttempt.status === "needs_first_factor") {
          const firstFactor = signInAttempt.supportedFirstFactors?.find(
            (factor) => factor.strategy === "email_code"
          );

          if (firstFactor) {
            await signIn.prepareFirstFactor({
              strategy: "email_code",
              emailAddressId: firstFactor.emailAddressId,
            });

            // Navigate to verification with sign-in context
            router.push({
              pathname: "/(auth)/verify",
              params: {
                email: emailAddress,
                mode: "signin"
              }
            });
            return;
          }
        }
      } catch (signInError) {
        // If sign-in fails (user doesn't exist), try sign-up
        console.log("Sign-in failed, trying sign-up:", signInError.errors?.[0]?.code);

        if (signInError.errors?.[0]?.code === "form_identifier_not_found") {
          // User doesn't exist, create new account
          await signUp.create({
            emailAddress,
          });

          // Prepare email verification for sign-up
          await signUp.prepareEmailAddressVerification({
            strategy: "email_code"
          });

          // Navigate to verification with sign-up context
          router.push({
            pathname: "/(auth)/verify",
            params: {
              email: emailAddress,
              mode: "signup"
            }
          });
          return;
        }

        // Some other error occurred
        throw signInError;
      }

      // If we get here without redirecting, show generic error
      Alert.alert("Error", "Something went wrong. Please try again.");

    } catch (err) {
      console.error("Auth error:", JSON.stringify(err, null, 2));
      Alert.alert("Error", "Unable to continue. Please check your email address and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    console.log("TODO: Implement Google sign-in");
    Alert.alert("Coming Soon", "Google sign-in will be available in a future update.");
  };

  const handleAppleSignIn = () => {
    console.log("TODO: Implement Apple sign-in");
    Alert.alert("Coming Soon", "Apple sign-in will be available in a future update.");
  };

  return (
    <View style={authStyles.container}>
      <KeyboardAvoidingView
        style={authStyles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
      >
        <ScrollView
          style={authStyles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={authStyles.imageContainer}>
            <Image
              source={require("../../assets/images/i1.png")}
              style={authStyles.image}
              contentFit="contain"
            />
          </View>

          <Text style={authStyles.title}>Log in or Sign up</Text>
          <Text style={authStyles.subtitle}>Get cooking in seconds.</Text>

          {/* Email Form */}
          <View style={authStyles.formContainer}>
            <View style={authStyles.inputContainer}>
              <TextInput
                style={authStyles.textInput}
                placeholder="Email address"
                placeholderTextColor={COLORS.textLight}
                value={emailAddress}
                onChangeText={setEmailAddress}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
              />
            </View>
          </View>

          {/* Continue Button */}
          <TouchableOpacity
            style={authStyles.authButton}
            onPress={handleContinue}
            activeOpacity={0.8}
            disabled={loading}
          >
            <Text style={authStyles.buttonText}>
              {loading ? "Sending code..." : "Continue"}
            </Text>
          </TouchableOpacity>

          {/* Divider */}
          <View style={authStyles.dividerContainer}>
            <View style={authStyles.dividerLine} />
            <Text style={authStyles.dividerText}>or</Text>
            <View style={authStyles.dividerLine} />
          </View>

          {/* Social Sign-In Buttons */}
          <TouchableOpacity
            style={[authStyles.socialButton, authStyles.googleButton]}
            onPress={handleGoogleSignIn}
            activeOpacity={0.8}
          >
            <Ionicons name="logo-google" size={20} color="#4285F4" style={authStyles.socialIcon} />
            <Text style={[authStyles.socialButtonText, { color: "#333" }]}>
              Continue with Google
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[authStyles.socialButton, authStyles.appleButton]}
            onPress={handleAppleSignIn}
            activeOpacity={0.8}
          >
            <Ionicons name="logo-apple" size={20} color="#ffffff" style={authStyles.socialIcon} />
            <Text style={[authStyles.socialButtonText, { color: "#ffffff" }]}>
              Continue with Apple
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default AuthScreen;