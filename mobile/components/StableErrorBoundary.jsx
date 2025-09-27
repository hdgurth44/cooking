import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

// Simplified, stable ErrorBoundary component to avoid import resolution issues
class StableErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('=== STABLE ERROR BOUNDARY CAUGHT AN ERROR ===');
    console.error('Error:', error);
    console.error('Error Message:', error?.message);
    console.error('Error Stack:', error?.stack);
    console.error('Component Stack:', errorInfo?.componentStack);
    console.error('Timestamp:', new Date().toISOString());
    console.error('====================================================');

    this.setState({ hasError: true, error });

    if (!__DEV__) {
      try {
        const errorReport = {
          message: error?.message || 'Unknown error',
          stack: error?.stack || 'No stack trace',
          componentStack: errorInfo?.componentStack || 'No component stack',
          timestamp: new Date().toISOString(),
          environment: 'production'
        };
        console.warn('STABLE ERROR BOUNDARY REPORT:', JSON.stringify(errorReport, null, 2));
      } catch (reportError) {
        console.error('Failed to create error report:', reportError);
      }
    }
  }

  handleRestart = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <View style={styles.content}>
            <Text style={styles.title}>App Error</Text>
            <Text style={styles.message}>
              Something went wrong. Please try restarting the app.
            </Text>
            <TouchableOpacity
              style={styles.button}
              onPress={this.handleRestart}
            >
              <Text style={styles.buttonText}>Restart</Text>
            </TouchableOpacity>
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
    backgroundColor: '#1a1a2e',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  content: {
    alignItems: 'center',
    maxWidth: 300,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 16,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  button: {
    backgroundColor: '#6c5ce7',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
};

export default StableErrorBoundary;