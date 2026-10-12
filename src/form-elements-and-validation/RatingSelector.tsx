import { Pressable, StyleSheet, Text, View } from "react-native";
import { feedbackLimits } from "./feedbackSchema";
import { fieldColors } from "./formColors";

const ratings = Array.from(
  { length: feedbackLimits.ratingMax },
  (_, index) => index + 1,
);

interface RatingSelectorProps {
  value: number;
  onChange: (rating: number) => void;
  onBlur: () => void;
  error?: string;
  mutedColor: string;
}

export function RatingSelector({
  value,
  onChange,
  onBlur,
  error,
  mutedColor,
}: RatingSelectorProps) {
  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: mutedColor }]}>
        Your AromaFlow experience
      </Text>
      <View
        style={styles.row}
        accessibilityRole="radiogroup"
        accessibilityLabel="Rating"
      >
        {ratings.map((rating) => (
          <Pressable
            key={rating}
            accessibilityRole="radio"
            accessibilityLabel={`${rating} ${rating === 1 ? "star" : "stars"}`}
            accessibilityState={{ checked: rating === value }}
            aria-checked={rating === value}
            onPress={() => {
              onChange(rating);
              onBlur();
            }}
            style={({ pressed }) => [styles.star, pressed && styles.pressed]}
          >
            <Text
              style={[
                styles.symbol,
                { color: rating <= value ? fieldColors.rating : mutedColor },
              ]}
            >
              ★
            </Text>
          </Pressable>
        ))}
      </View>
      <Text style={{ color: mutedColor }}>
        {value} of {feedbackLimits.ratingMax} stars
      </Text>
      {!!error && (
        <Text accessibilityRole="alert" style={styles.error}>
          {error}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 20 },
  label: { fontSize: 13, fontWeight: "700", marginBottom: 8 },
  row: { flexDirection: "row", gap: 4 },
  star: { padding: 6, minWidth: 44, minHeight: 44 },
  symbol: { fontSize: 32 },
  pressed: { opacity: 0.5, transform: [{ scale: 0.9 }] },
  error: { color: fieldColors.error, marginTop: 6 },
});
