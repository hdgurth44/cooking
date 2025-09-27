import React from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import * as Clipboard from "expo-clipboard";
import { COLORS } from "../constants/colors";
import { TYPOGRAPHY } from "../constants/fonts";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to console in development
    console.error("ErrorBoundary caught an error:", error, errorInfo);

    this.setState({
      error: error,
      errorInfo: errorInfo,
    });

    // In production, you could send this to a crash reporting service
    // Example: Sentry.captureException(error, { extra: errorInfo });
  }

  handleRestart = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  handleCopyError = async () => {
    try {
      const errorDetails = {
        error: this.state.error?.toString() || "Unknown error",
        stack: this.state.error?.stack || "No stack trace available",
        componentStack:
          this.state.errorInfo?.componentStack ||
          "No component stack available",
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent || "Unknown device",
      };

      const errorText = `Error Report - ${errorDetails.timestamp}
      
Error: ${errorDetails.error}

Stack Trace:
${errorDetails.stack}

Component Stack:
${errorDetails.componentStack}

Device: ${errorDetails.userAgent}`;

      await Clipboard.setStringAsync(errorText);
      Alert.alert(
        "Error Copied",
        "Error details have been copied to your clipboard. You can now paste them when reporting this issue.",
        [{ text: "OK" }]
      );
    } catch (_clipboardError) {
      Alert.alert("Copy Failed", "Unable to copy error details to clipboard.", [
        { text: "OK" },
      ]);
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <View style={styles.content}>
            <Text style={styles.title}>Something went wrong</Text>
            <Text style={styles.message}>
              We&apos;re sorry, but something unexpected happened. Please try
              restarting the app.
            </Text>

            {__DEV__ && this.state.error && (
              <View style={styles.errorDetails}>
                <Text style={styles.errorTitle}>
                  Error Details (Development Only):
                </Text>
                <Text style={styles.errorText}>
                  {this.state.error.toString()}
                </Text>
                {this.state.errorInfo && (
                  <Text style={styles.errorText}>
                    {this.state.errorInfo.componentStack}
                  </Text>
                )}
              </View>
            )}

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.button}
                onPress={this.handleRestart}
              >
                <Text style={styles.buttonText}>Try Again</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.copyButton}
                onPress={this.handleCopyError}
              >
                <Text style={styles.copyButtonText}>Copy Error Details</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  content: {
    alignItems: "center",
    maxWidth: 300,
  },
  title: {
    ...TYPOGRAPHY.h3,
    color: COLORS.white, // Changed to white for visibility on dark background
    marginBottom: 16,
    textAlign: "center",
  },
  message: {
    ...TYPOGRAPHY.body1,
    color: COLORS.white, // Changed to white for visibility on dark background
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 24,
  },
  errorDetails: {
    backgroundColor: COLORS.error + "10",
    padding: 12,
    borderRadius: 8,
    marginBottom: 24,
    maxHeight: 200,
  },
  errorTitle: {
    ...TYPOGRAPHY.body2,
    color: COLORS.error,
    fontWeight: "600",
    marginBottom: 8,
  },
  errorText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.error,
    fontFamily: "monospace",
    lineHeight: 16,
  },
  buttonContainer: {
    width: "100%",
    gap: 12,
  },
  button: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    ...TYPOGRAPHY.button,
    color: COLORS.white,
  },
  copyButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: COLORS.white,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  copyButtonText: {
    ...TYPOGRAPHY.button,
    color: COLORS.white,
  },
};

export default ErrorBoundary;
