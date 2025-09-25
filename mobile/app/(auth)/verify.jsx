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

const VerifyScreen = () => {
  const router = useRouter();
  const { email, mode } = useLocalSearchParams();
  const { signIn, setActive: setSignInActive, isLoaded: signInLoaded } = useSignIn();
  const { signUp, setActive: setSignUpActive, isLoaded: signUpLoaded } = useSignUp();

  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerification = async () => {
    if (!code) {
      Alert.alert("Missing Code", "Please enter the 6-digit code to continue.");
      return;
    }

    if (!signInLoaded || !signUpLoaded) return;

    setLoading(true);

    try {
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

      // Generic error message for security (don't reveal specific issues)
      Alert.alert(
        "Verification Failed",
        "That code didn't work. Please check your email and try again, or change your email address."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChangeEmail = () => {
    router.back();
  };

  const handleResendCode = async () => {
    if (!signInLoaded || !signUpLoaded) return;

    setLoading(true);

    try {
      if (mode === "signin") {
        // Resend sign-in code
        const firstFactor = signIn.supportedFirstFactors?.find(
          (factor) => factor.strategy === "email_code"
        );

        if (firstFactor) {
          await signIn.prepareFirstFactor({
            strategy: "email_code",
            emailAddressId: firstFactor.emailAddressId,
          });
          Alert.alert("Code Sent", "A new verification code has been sent to your email.");
        }
      } else if (mode === "signup") {
        // Resend sign-up code
        await signUp.prepareEmailAddressVerification({
          strategy: "email_code"
        });
        Alert.alert("Code Sent", "A new verification code has been sent to your email.");
      }
    } catch (err) {
      console.error("Resend code error:", JSON.stringify(err, null, 2));
      Alert.alert("Error", "Unable to resend code. Please try again.");
    } finally {
      setLoading(false);
    }
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
            We sent a code to {email}.
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
                keyboardType="number-pad"
                autoCapitalize="none"
                maxLength={6}
                autoFocus={true}
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
            onPress={handleResendCode}
            activeOpacity={0.8}
            disabled={loading}
          >
            <Text style={authStyles.linkText}>
              Didn&apos;t receive a code?{" "}
              <Text style={authStyles.link}>Resend</Text>
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={authStyles.linkContainer}
            onPress={handleChangeEmail}
            activeOpacity={0.8}
          >
            <Text style={authStyles.linkText}>
              <Text style={authStyles.link}>Change email</Text>
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default VerifyScreen;