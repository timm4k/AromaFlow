export const palette = {
  primary: "#7B5EA7",
  secondary: "#B8A2E3",
  light: "#CDB4FF",
  lightBg: "#E9D8FD",
  bg: "#F3ECFF",
  white: "#FFFFFF",

  text: "#2D1B4E",
  textSecondary: "#6B5B8A",
  border: "#D8C8F0",

  darkBg: "#1A1128",
  darkCard: "#2A1D44",
  darkText: "#F3ECFF",
  darkTextSecondary: "#CDB4FF",

  neutralBg: "#F5F5F7",
  neutralCard: "#FFFFFF",
  neutralText: "#1C1C1E",
  neutralTextSecondary: "#8E8E93",
};

export function getTheme(darkMode, pastelMode, accentIntensity) {
  const intensityMap = {
    low: {
      accent: "#B8A2E3",
      accentLight: "#E9D8FD",
      accentDim: "#D8C8F0",
    },

    medium: {
      accent: "#7B5EA7",
      accentLight: "#CDB4FF",
      accentDim: "#B8A2E3",
    },

    high: {
      accent: "#5B3E87",
      accentLight: "#A98BE0",
      accentDim: "#8A6CC2",
    },
  };

  const intensity = intensityMap[accentIntensity] || intensityMap.medium;

  if (darkMode) {
    return {
      bg: palette.darkBg,
      card: palette.darkCard,

      text: palette.darkText,
      textSecondary: palette.darkTextSecondary,

      border: "#3B2B5A",

      navBg: palette.darkCard,

      overlay: "rgba(15,10,25,0.78)",

      shadow: "#000000",

      ...intensity,
    };
  }

  if (!pastelMode) {
    return {
      bg: palette.neutralBg,
      card: palette.neutralCard,

      text: palette.neutralText,
      textSecondary: palette.neutralTextSecondary,

      border: "#E5E5EA",

      navBg: palette.neutralCard,

      overlay: "rgba(0,0,0,0.4)",

      shadow: "#000000",

      ...intensity,
    };
  }

  return {
    bg: palette.bg,
    card: palette.white,

    text: palette.text,
    textSecondary: palette.textSecondary,

    border: palette.border,

    navBg: palette.white,

    overlay: "rgba(43,25,82,0.55)",

    shadow: "#7B5EA7",

    ...intensity,
  };
}
