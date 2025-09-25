import {
  View,
  Text,
  Alert,
  ScrollView,
  TextInput,
  Platform,
  TouchableOpacity,
  KeyboardAvoidingView,
} from "react-native";
import React, { useState } from "react";
import { useRouter } from "expo-router";
import { useSignUp } from "@clerk/clerk-expo";
import { authStyles } from "../../assets/styles/auth.styles";
import { Image } from "expo-image";
import { COLORS } from "../../constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { getSignUpErrorMessage, getVerificationErrorMessage } from "../../utils/authErrors";

const SignUpScreen = () => {
  const router = useRouter();
  const { signUp, isLoaded, setActive } = useSignUp();
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState("");

  const handleSignUp = async () => {
    if (!emailAddress || !password) {
      Alert.alert("Missing Information", "Please fill in all fields to continue.");
      return;
    }
    if (password.length < 8) {
      Alert.alert("Invalid Password", "Password must be at least 8 characters long.");
      return;
    }
    if (!isLoaded) return;

    setLoading(true);

    try {
      // Start sign-up process using email and password provided
      await signUp.create({
        emailAddress,
        password,
      });

      // Send user an email with verification code
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

      // Set 'pendingVerification' to true to display verification form
      setPendingVerification(true);
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling for more info on error handling
      const userFriendlyMessage = getSignUpErrorMessage(err);
      Alert.alert("Sign Up Failed", userFriendlyMessage);
      console.error(JSON.stringify(err, null, 2));
    } finally {
      setLoading(false);
    }
  };

  // Handle submission of verification form
  const handleVerification = async () => {
    if (!isLoaded) return;

    setLoading(true);

    try {
      // Use the code the user provided to attempt verification
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code,
      });

      // If verification was completed, set the session to active and redirect the user
      if (signUpAttempt.status === "complete") {
        await setActive({ session: signUpAttempt.createdSessionId });
        router.replace("/(tabs)");
      } else {
        // If the status is not complete, check why. User may need to complete further steps.
        Alert.alert("Verification Failed", "Unable to verify your email. Please try again.");
        console.error(JSON.stringify(signUpAttempt, null, 2));
      }
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling for more info on error handling
      const userFriendlyMessage = getVerificationErrorMessage(err);
      Alert.alert("Verification Failed", userFriendlyMessage);
      console.error(JSON.stringify(err, null, 2));
    } finally {
      setLoading(false);
    }
  };
  // If verification is pending, show verification form
  if (pendingVerification) {
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
            <Text style={authStyles.title}>Verify Your Email</Text>
            <Text style={authStyles.subtitle}>
              We&apos;ve sent a verification code to {emailAddress}.
            </Text>
            <View style={authStyles.formContainer}>
              <View style={authStyles.inputContainer}>
                <TextInput
                  style={authStyles.textInput}
                  placeholder="Enter your verification code"
                  placeholderTextColor={COLORS.textLight}
                  keyboardType="number-pad"
                  autoCapitalize="none"
                  value={code}
                  onChangeText={setCode}
                />
              </View>
            </View>
            <TouchableOpacity
              style={authStyles.authButton}
              onPress={handleVerification}
              activeOpacity={0.8}
              disabled={loading}
            >
              <Text style={authStyles.buttonText}>
                {loading ? "Verifying..." : "Verify Email"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={authStyles.linkContainer}
              onPress={() => setPendingVerification(false)}
              activeOpacity={0.8}
            >
              <Text style={authStyles.linkText}>Back to Sign Up</Text>
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    );
  }

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
              source={require("../../assets/images/i2.png")}
              style={authStyles.image}
              contentFit="contain"
            />
          </View>
          <Text style={authStyles.title}>Create an Account</Text>
          <View style={authStyles.formContainer}>
            <View style={authStyles.inputContainer}>
              <TextInput
                style={authStyles.textInput}
                placeholder="Your e-mail"
                placeholderTextColor={COLORS.textLight}
                value={emailAddress}
                onChangeText={setEmailAddress}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
            <View style={authStyles.inputContainer}>
              <TextInput
                style={authStyles.textInput}
                placeholder="Your new password"
                placeholderTextColor={COLORS.textLight}
                value={password}
                onChangeText={setPassword}
                keyboardType="default"
                autoCapitalize="none"
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity
                style={authStyles.eyeButton}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Ionicons
                  name={showPassword ? "eye-outline" : "eye-off-outline"}
                  size={20}
                  color={COLORS.textLight}
                />
              </TouchableOpacity>
            </View>
          </View>
          <TouchableOpacity
            style={authStyles.authButton}
            onPress={handleSignUp}
            activeOpacity={0.8}
            disabled={loading}
          >
            <Text style={authStyles.buttonText}>
              {loading ? "Creating Account..." : "Sign Up"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={authStyles.linkContainer}
            onPress={() => router.back()}
          >
            <Text style={authStyles.linkText}>
              Already have an account?{" "}
              <Text style={authStyles.link}>Sign In</Text>
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default SignUpScreen;
