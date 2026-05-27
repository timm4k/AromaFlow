import { Component } from "react";
import { ScrollView, StyleSheet, Text } from "react-native";

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
    console.error("ErrorBoundary caught:", error, info);
  }

  render() {
    if (this.state.error) {
      return (
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.title}>Error</Text>

          <Text style={styles.message}>
            {this.state.error.message || String(this.state.error)}
          </Text>

          {!!this.state.error.stack && (
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

    padding: 24,

    backgroundColor: "#F3ECFF",
  },

  title: {
    fontSize: 24,
    fontWeight: "700",

    color: "#7B5EA7",

    marginBottom: 14,
  },

  message: {
    fontSize: 15,
    lineHeight: 22,

    color: "#2D1B4E",

    textAlign: "center",

    marginBottom: 18,
  },

  stack: {
    width: "100%",

    fontSize: 11,
    lineHeight: 16,

    color: "#6B5B8A",

    fontFamily: "monospace",
  },
});
