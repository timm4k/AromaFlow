import { Text, TouchableOpacity, View } from "react-native";
import { moods, moodIcons } from "../../utils/constants";
import { styles } from "../../styles/screens/addAromaStyles";

export default function MoodSelector({ selectedMood, onSelect, theme }) {
  return (
    <View style={styles.section}>
      <Text style={[styles.sectionLabel, { color: theme.text }]}>
        Mood
      </Text>

      <View style={styles.moodGrid}>
        {moods.map((mood) => {
          const active = selectedMood === mood;

          return (
            <TouchableOpacity
              key={mood}
              activeOpacity={0.75}
              onPress={() => onSelect(mood)}
              style={[
                styles.moodPill,
                {
                  backgroundColor: active
                    ? theme.accent
                    : theme.accentLight,
                  borderColor: active ? theme.accent : "transparent",
                },
              ]}
            >
              <Text style={styles.moodIcon}>{moodIcons[mood]}</Text>

              <Text
                style={[
                  styles.moodText,
                  {
                    color: active ? theme.white : theme.accent,
                    fontWeight: active ? "700" : "600",
                    fontSize: 13 * theme.fontScale,
                  },
                ]}
              >
                {mood}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {!selectedMood && (
        <Text style={[styles.hint, { color: theme.textSecondary }]}>
          Please select a mood
        </Text>
      )}
    </View>
  );
}
