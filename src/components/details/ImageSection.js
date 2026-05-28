import { Image, Text, TouchableOpacity, View } from "react-native";
import { styles } from "../../styles/screens/aromaDetailsStyles";

export default function ImageSection({ aroma, isOwner, previewUri, pickImage, removeImage, theme }) {
  const displayUri = previewUri || aroma.imageUri;

  if (displayUri) {
    return (
      <View style={styles.imageSection}>
        <Image source={{ uri: displayUri }} style={styles.aromaImage} resizeMode="cover" />
        {isOwner && !previewUri && (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={removeImage}
            style={[styles.imageActionBtn, { backgroundColor: theme.error }]}
          >
            <Text style={styles.imageActionText}>Remove Image</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }

  if (isOwner) {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={pickImage}
        style={[styles.attachButton, { backgroundColor: theme.accentLight, borderColor: theme.accent }]}
      >
        <Text style={[styles.attachText, { color: theme.accent }]}>+ Attach Image</Text>
      </TouchableOpacity>
    );
  }

  return null;
}
