export const colors = {
  // Core Palette for Homework For Life - Balanced Green Theme v2
  primary: "#5DB3AD",
  background: "#FAF7F0",
  text: "#3E5250",
  textSubtle: "#79918E",

  accent: "#FFA781",

  // UI Element Colors
  border: "#DCE2E1",

  // Semantic UI Colors
  success: "#4CAF50",
  error: "#F44336",
  warning: "#FF9800",

  // Additional Neutrals
  neutralLight: "#F7F9F9",
  neutralMedium: "#E2E8E7",
  neutralDark: "#3E5250",

  // Specific UI Component Text Colors
  buttonPrimaryText: "#FFFFFF",
  buttonAccentText: "#FFFFFF",
} as const

export type ColorTheme = typeof colors
