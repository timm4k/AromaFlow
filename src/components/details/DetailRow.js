import { Text, View } from "react-native";
import { styles } from "../../styles/screens/aromaDetailsStyles";

export default function DetailRow({ label, value, valueColor, theme }) {
  return (
    <View style={styles.detailRow}>
      <Text style={[styles.detailLabel, { color: theme.text, fontSize: 13 * theme.fontScale }]}>{label}</Text>
      <Text style={[styles.detailValue, { color: valueColor || theme.textSecondary }]}>{value}</Text>
    </View>
  );
}
