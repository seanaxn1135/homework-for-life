export const colors = {
  // Core Palette for Homework For Life
  primary: "#7CB9E8", // Soft Cerulean Blue
  background: "#FAF7F0", // Warm Off-White / Soft Cream
  text: "#4A4A4A", // Dark Warm Gray (main body text)
  textSubtle: "#8A8A8A", // Medium Warm Gray (sub-text, placeholders)

  accent: "#FFAB91", // Muted Coral/Peach (primary CTAs, highlights)

  // UI Element Colors
  border: "#E0E0E0", // Light Gray (subtle borders, dividers)

  // Semantic UI Colors
  success: "#34C759", // Standard success green
  error: "#FF3B30", // Standard error red
  warning: "#FF9500", // Standard warning orange

  // Additional Neutrals (Optional)
  neutralLight: "#F5F5F5",
  neutralDark: "#333333",

  // Specific UI Component Text Colors (if different from default contrast)
  buttonPrimaryText: "#FFFFFF", // For text on 'primary' colored buttons
  buttonAccentText: "#FFFFFF", // For text on 'accent' colored buttons (if needed, often same as buttonPrimaryText)
} as const

export type ColorTheme = typeof colors
