import { View } from "react-native";
import { shadows } from "../../styles/shadows";
import { styles } from "../../styles/screens/inspirationStyles";

export default function ShimmerPlaceholder({ theme }) {
  return (
    <View style={[styles.shimmerCard, { backgroundColor: theme.card, shadowColor: theme.shadow }, shadows.cardCompact]}>
      <View style={[styles.shimmerCircle, { backgroundColor: theme.accentLight }]} />

      <View style={styles.shimmerContent}>
        <View style={[styles.shimmerLine, { width: "80%", backgroundColor: theme.accentLight }]} />
        <View style={[styles.shimmerLine, { width: "60%", backgroundColor: theme.accentLight }]} />
        <View style={[styles.shimmerLine, { width: "90%", backgroundColor: theme.accentLight }]} />
      </View>
    </View>
  );
}
