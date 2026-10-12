import { useTheme } from "../../hooks/useTheme";
import ConfirmationModal from "../ConfirmationModal";

export default function ConfirmModal(props) {
  const { theme, enableAnimations } = useTheme();

  return (
    <ConfirmationModal
      {...props}
      confirmText={props.confirmText || "Confirm"}
      theme={theme}
      enableAnimations={enableAnimations}
      destructive={false}
    />
  );
}
