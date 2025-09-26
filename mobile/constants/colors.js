// Note that we create a folder in the root of the mobile application called constants and in there we store the colors which we then use in the different style sheets. Quite neat.
import { TYPOGRAPHY } from './fonts';

// OCEAN — light, blue/teal
const oceanTheme = {
  primary: "#0E7490",          // teal 700
  background: "#F4F8FB",       // very light blue
  text: "#0F1B2A",             // ink
  border: "#D6E1EA",
  white: "#FFFFFF",
  textLight: "#6B7A89",
  card: "#FFFFFF",
  shadow: "#000000",

  accent: "#14B8A6",           // teal 500
  onAccent: "#FFFFFF",
  textMuted: "#7E8B99",
  link: "#0EA5E9",
  success: "#22C55E", onSuccess: "#0A0F14",
  warning: "#F59E0B", onWarning: "#0A0F14",
  danger:  "#EF4444", onDanger: "#FFFFFF",
  overlay: "rgba(0,16,32,0.45)",
  pressed: "rgba(2,132,199,0.12)", // blue-600 tint
  disabled:"rgba(15,27,42,0.38)",
};

// MIDNIGHT — dark, cool neutrals with steel blue
const midnightTheme = {
  primary: "#2C3E50",          // your steel blue
  background: "#0B121A",       // near-black blue
  text: "#E6EDF3",
  border: "#1F2A36",
  white: "#FFFFFF",
  textLight: "#A6B3C2",
  card: "#111A23",
  shadow: "#000000",

  accent: "#5F89B6",
  onAccent: "#0A0F14",
  textMuted: "#90A0AE",
  link: "#7DA0C6",
  success: "#4ADE80", onSuccess: "#0A0F14",
  warning: "#F2C94C", onWarning: "#0A0F14",
  danger:  "#E74C3C", onDanger: "#FFFFFF",
  overlay: "rgba(0,0,0,0.60)",
  pressed: "rgba(255,255,255,0.08)",
  disabled:"rgba(230,237,243,0.35)",
};

// PURPLE — light, violet accent
const purpleTheme = {
  primary: "#6D28D9",          // violet 700
  background: "#F7F6FB",
  text: "#17151F",
  border: "#E3DDF3",
  white: "#FFFFFF",
  textLight: "#7A718E",
  card: "#FFFFFF",
  shadow: "#000000",

  accent: "#8B5CF6",           // violet 500
  onAccent: "#FFFFFF",
  textMuted: "#8B84A1",
  link: "#7C3AED",
  success: "#22C55E", onSuccess: "#0A0F14",
  warning: "#F59E0B", onWarning: "#0A0F14",
  danger:  "#EF4444", onDanger: "#FFFFFF",
  overlay: "rgba(10,6,20,0.45)",
  pressed: "rgba(124,58,237,0.12)",
  disabled:"rgba(23,21,31,0.38)",
};

// CREME — dark UI with warm "peach" CTA (inspired by screenshots)
const cremeTheme = {
  primary: "#F6B17A",          // warm peach for prominent CTAs
  background: "#0F0E10",       // deep neutral
  text: "#F5F4F5",
  border: "#2B282C",
  white: "#FFFFFF",
  textLight: "#A8A6AB",
  card: "#151416",
  shadow: "#000000",

  accent: "#F6B17A",           // same as primary (pills/buttons)
  onAccent: "#1A1410",
  textMuted: "#9C989F",
  link: "#FFD6A8",             // subtle warm link
  success: "#5DD39E", onSuccess: "#0E1411",
  warning: "#F2C94C", onWarning: "#0F0E10",
  danger:  "#FF6B6B", onDanger: "#0F0E10",
  overlay: "rgba(0,0,0,0.55)",
  pressed: "rgba(246,177,122,0.16)", // warm glow
  disabled:"rgba(245,244,245,0.32)",
};

const headspaceTheme = {
  // original keys
  primary: "#FF9800",          // warm brand orange
  background: "#FFFFFF",
  text: "#1C1C1E",
  border: "#E6E2DA",
  white: "#FFFFFF",
  textLight: "#6E6E73",
  card: "#F7F5F2",             // soft cream card bg
  shadow: "#000000",

  // semantic additions
  accent: "#2E6CF6",           // CTA blue used in buttons
  onAccent: "#FFFFFF",
  textMuted: "#8C8C91",
  link: "#2E6CF6",

  success: "#22C55E", onSuccess: "#0B121A",
  warning: "#F59E0B", onWarning: "#0B121A",
  danger:  "#EF4444", onDanger: "#FFFFFF",

  overlay: "rgba(0,0,0,0.45)",
  pressed: "rgba(46,108,246,0.12)",   // blue press tint
  disabled:"rgba(28,28,30,0.38)",
};

const cherryTheme = {
  // original keys
  primary: "#B51267",          // brand magenta
  background: "#FFFFFF",
  text: "#0F4736",             // deep forest green for headings
  border: "#E7E3EA",
  white: "#FFFFFF",
  textLight: "#6E6F78",
  card: "#F4EEF9",             // soft lavender card surface
  shadow: "#000000",

  // semantic additions
  accent: "#C41773",           // main CTA (buttons)
  onAccent: "#FFFFFF",
  textMuted: "#8A8C93",
  link: "#C41773",

  success: "#0B6B45",          // selected pill / positive
  onSuccess: "#FFFFFF",
  warning: "#E9FF5A",          // neon sticker yellow-green
  onWarning: "#0B0F07",
  danger:  "#E74C3C",
  onDanger: "#FFFFFF",

  overlay: "rgba(0,0,0,0.45)",
  pressed: "rgba(196,23,115,0.14)",  // magenta press tint
  disabled:"rgba(15,23,36,0.35)",
};

const duoTheme = {
  // original keys
  primary: "#58CC02",          // Duo green
  background: "#FFFFFF",
  text: "#1C1C1E",
  border: "#E6E6E6",
  white: "#FFFFFF",
  textLight: "#6E6E73",
  card: "#F9F9F9",             // soft neutral gray
  shadow: "#000000",

  // semantic additions
  accent: "#58CC02",           // main CTA / “Continue” button
  onAccent: "#FFFFFF",
  textMuted: "#8C8C91",
  link: "#2E6CF6",             // secondary links sometimes in blue

  success: "#58CC02", onSuccess: "#FFFFFF", // Duo green doubles as success
  warning: "#FFD600", onWarning: "#1C1C1E", // bright yellow (streak flame)
  danger:  "#FF4B4B", onDanger: "#FFFFFF",  // hearts/lives in red

  overlay: "rgba(0,0,0,0.45)",
  pressed: "rgba(88,204,2,0.16)", // green press tint
  disabled:"rgba(28,28,30,0.35)",
};

const impossibleColorfulTheme = {
  // original keys
  primary: "#FF6133",          // punchy orange
  background: "#FFF9F7",       // very light cream backdrop
  text: "#1A1A1A",             // deep neutral for contrast
  border: "#E5D8CF",
  white: "#FFFFFF",
  textLight: "#7A6F6A",
  card: "#FFF2EB",             // light orange/pink card
  shadow: "#000000",

  // semantic additions
  accent: "#FF6133",           // main CTA (learn more, find it)
  onAccent: "#FFFFFF",
  textMuted: "#8E827C",
  link: "#C92A2A",             // red link text

  success: "#FFB703", onSuccess: "#1A1A1A",  // mustard yellow chips
  warning: "#FF85A1", onWarning: "#1A1A1A",  // pink highlights
  danger:  "#C92A2A", onDanger: "#FFFFFF",   // bold red danger
  overlay: "rgba(0,0,0,0.45)",
  pressed: "rgba(255,97,51,0.14)",           // orange press tint
  disabled:"rgba(26,26,26,0.35)",
};

const impossibleRedTheme = {
  // original keys
  primary: "#C92A2A",          // deep Impossible red
  background: "#FFF5F5",       // very pale red wash
  text: "#2B0D0D",             // dark red-brown
  border: "#F0CACA",
  white: "#FFFFFF",
  textLight: "#9A6B6B",
  card: "#FFD6D6",             // soft pink card
  shadow: "#000000",

  // semantic additions
  accent: "#C92A2A",           // CTA red
  onAccent: "#FFFFFF",
  textMuted: "#9C7676",
  link: "#FF4D4D",             // brighter red links

  success: "#FF922B", onSuccess: "#1A1A1A",  // orange highlight
  warning: "#FFE066", onWarning: "#1A1A1A",  // yellow highlight
  danger:  "#C92A2A", onDanger: "#FFFFFF",   // same bold red for errors
  overlay: "rgba(0,0,0,0.5)",
  pressed: "rgba(201,42,42,0.16)",           // red press tint
  disabled:"rgba(43,13,13,0.38)",
};

export const THEMES = {
  ocean: oceanTheme,
  midnight: midnightTheme,
  purple: purpleTheme,
  creme: cremeTheme,
  headspace: headspaceTheme,
  cherry: cherryTheme,
  duo: duoTheme,
  impossibleColorful: impossibleColorfulTheme,
  impossibleRed: impossibleRedTheme,
};

// 👇 change this to switch theme
export const COLORS = THEMES.creme;

// Export typography styles for easy access
export { TYPOGRAPHY };
