import { Text, View } from "react-native";
import { styles } from "../../styles/screens/loginStyles";

export default function AuthCard({ theme, children }) {
  return (
    <View
      style={[
        styles.card,
        { backgroundColor: theme.card, shadowColor: theme.shadow },
      ]}
    >
      {children}
    </View>
  );
}
