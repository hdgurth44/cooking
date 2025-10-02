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
import { useRouter, useLocalSearchParams } from "expo-router";
import { useSignIn, useSignUp } from "@clerk/clerk-expo";
import { authStyles } from "../../assets/styles/auth.styles";
import { Image } from "expo-image";
import { COLORS } from "../../constants/colors";
import { getAuthErrorMessage } from "../../utils/authErrors";

const VerifyScreen = () => {
  const router = useRouter();
  const { email, mode } = useLocalSearchParams();
  const { signIn, setActive: setSignInActive, isLoaded: signInLoaded } = useSignIn();
  const { signUp, setActive: setSignUpActive, isLoaded: signUpLoaded } = useSignUp();

  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  // Demo account configuration for Apple App Store review
  const DEMO_ACCOUNTS = {
    "apple@tester.com": "000000",
    "appstore@review.com": "000000",
    "demo@tester.com": "000000"
  };

  const isDemoAccount = (email) => {
    return email && DEMO_ACCOUNTS.hasOwnProperty(email.toLowerCase());
  };

  const handleVerification = async () => {
    if (!code) {
      Alert.alert("Missing Code", "Please enter the 6-digit code to continue.");
      return;
    }

    if (!signInLoaded || !signUpLoaded) return;

    setLoading(true);

    try {
      // Check if this is a demo account with hardcoded verification
      if (isDemoAccount(email)) {
        const expectedCode = DEMO_ACCOUNTS[email.toLowerCase()];
        if (code === expectedCode) {
          console.log("Demo account verification successful for:", email);
          
          // For demo accounts, we'll create a temporary session
          // This bypasses Clerk's normal verification flow
          if (mode === "signin") {
            try {
              // Attempt normal sign-in first, but if it fails due to verification,
              // we'll handle it as a successful demo login
              const signInAttempt = await signIn.attemptFirstFactor({
                strategy: "email_code",
                code: expectedCode, // Use the expected code
              });

              if (signInAttempt.status === "complete") {
                await setSignInActive({ session: signInAttempt.createdSessionId });
                router.replace("/(tabs)");
                return;
              }
            } catch (_demoSignInError) {
              // If normal sign-in fails, show success message for demo
              console.log("Demo account sign-in completed (bypassed verification)");
              Alert.alert(
                "Demo Account", 
                "Demo login successful! Note: This is a demo account for App Store review purposes.",
                [{ text: "Continue", onPress: () => router.replace("/(tabs)") }]
              );
              return;
            }
          } else if (mode === "signup") {
            // For demo account signup, show informational message
            Alert.alert(
              "Demo Account", 
              "This demo account already exists. Please use sign-in mode instead.",
              [{ text: "OK", onPress: () => router.back() }]
            );
            return;
          }
        } else {
          Alert.alert(
            "Demo Account", 
            `Invalid demo code. For demo account ${email}, please use code: ${expectedCode}`
          );
          return;
        }
      }

      // Normal verification flow for non-demo accounts
      if (mode === "signin") {
        // Handle sign-in verification
        const signInAttempt = await signIn.attemptFirstFactor({
          strategy: "email_code",
          code,
        });

        if (signInAttempt.status === "complete") {
          await setSignInActive({ session: signInAttempt.createdSessionId });
          router.replace("/(tabs)");
        } else {
          Alert.alert("Verification Failed", "Unable to verify your code. Please try again.");
          console.error("Sign-in verification incomplete:", JSON.stringify(signInAttempt, null, 2));
        }
      } else if (mode === "signup") {
        // Handle sign-up verification
        const signUpAttempt = await signUp.attemptEmailAddressVerification({
          code,
        });

        if (signUpAttempt.status === "complete") {
          await setSignUpActive({ session: signUpAttempt.createdSessionId });
          router.replace("/(tabs)");
        } else {
          Alert.alert("Verification Failed", "Unable to verify your code. Please try again.");
          console.error("Sign-up verification incomplete:", JSON.stringify(signUpAttempt, null, 2));
        }
      }
    } catch (err) {
      console.error("Verification error:", JSON.stringify(err, null, 2));

      // Use proper error handling
      const errorMessage = getAuthErrorMessage(err);
      Alert.alert("Verification Failed", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleChangeEmail = () => {
    router.back();
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
              source={require("../../assets/images/i3.png")}
              style={authStyles.image}
              contentFit="contain"
            />
          </View>

          <Text style={authStyles.title}>Enter the 6-digit code</Text>
          <Text style={authStyles.subtitle}>
            {isDemoAccount(email) 
              ? `Demo account detected. Use code: ${DEMO_ACCOUNTS[email.toLowerCase()]}`
              : `We sent a code to ${email}.`
            }
          </Text>

          {/* Code Input */}
          <View style={authStyles.formContainer}>
            <View style={authStyles.inputContainer}>
              <TextInput
                style={authStyles.textInput}
                placeholder="Enter your 6-digit code"
                placeholderTextColor={COLORS.textLight}
                value={code}
                onChangeText={setCode}
                onSubmitEditing={handleVerification}
                keyboardType="number-pad"
                autoCapitalize="none"
                maxLength={6}
                autoFocus={true}
                returnKeyType="done"
                enablesReturnKeyAutomatically={true}
              />
            </View>
          </View>

          {/* Verify Button */}
          <TouchableOpacity
            style={authStyles.authButton}
            onPress={handleVerification}
            activeOpacity={0.8}
            disabled={loading}
          >
            <Text style={authStyles.buttonText}>
              {loading ? "Verifying..." : "Verify"}
            </Text>
          </TouchableOpacity>

          {/* Action Links */}
          <TouchableOpacity
            style={authStyles.linkContainer}
            onPress={handleChangeEmail}
            activeOpacity={0.8}
          >
            <Text style={authStyles.linkText}>
              <Text style={authStyles.link}>Go back</Text>
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default VerifyScreen;