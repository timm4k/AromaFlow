import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  content: {
    padding: 20,
    paddingBottom: 120,
  },

  section: {
    marginBottom: 18,
  },

  sectionLabel: {
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 0.5,
    textTransform: "uppercase",
    marginBottom: 10,
  },

  pillsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },

  pill: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1.5,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2,
  },

  pillText: {
    fontSize: 13,
    letterSpacing: 0.2,
  },

  moodGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },

  moodPill: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1.5,
    gap: 6,
  },

  moodIcon: {
    fontSize: 16,
  },

  moodText: {
    fontSize: 13,
    letterSpacing: 0.2,
  },

  hint: {
    fontSize: 12,
    fontWeight: "500",
    marginTop: 6,
    marginLeft: 4,
    opacity: 0.6,
  },

  visibilityRow: {
    flexDirection: "row",
    gap: 10,
  },

  visibilityPill: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 1.5,
    gap: 8,
  },

  visibilityIcon: {
    fontSize: 18,
  },

  visibilityText: {
    fontSize: 15,
    letterSpacing: 0.2,
  },

  visibilityHint: {
    fontSize: 12,
    fontWeight: "500",
    marginTop: 8,
    textAlign: "center",
    opacity: 0.6,
  },

  buttonContainer: {
    marginTop: 10,
    alignItems: "center",
  },
});
