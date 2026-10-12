import { Component } from "react";
import { ScrollView, StyleSheet, Text } from "react-native";
import { palette } from "../styles/colors";
import { spacing } from "../styles/spacing";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);

    this.state = {
      error: null,
    };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    if (__DEV__) console.error("ErrorBoundary caught:", error, info);
  }

  render() {
    if (this.state.error) {
      return (
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.title}>Error</Text>

          <Text style={styles.message}>
            {this.state.error.message || String(this.state.error)}
          </Text>

          {__DEV__ && !!this.state.error.stack && (
            <Text style={styles.stack}>{this.state.error.stack}</Text>
          )}
        </ScrollView>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,

    justifyContent: "center",
    alignItems: "center",

    padding: spacing.lg,

    backgroundColor: palette.bg,
  },

  title: {
    fontSize: 24,
    fontWeight: "700",

    color: palette.primary,

    marginBottom: 14,
  },

  message: {
    fontSize: 15,
    lineHeight: 22,

    color: palette.text,

    textAlign: "center",

    marginBottom: 18,
  },

  stack: {
    width: "100%",

    fontSize: 11,
    lineHeight: 16,

    color: palette.textSecondary,

    fontFamily: "monospace",
  },
});
