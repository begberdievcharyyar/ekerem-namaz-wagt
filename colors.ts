/**
 * Semantic design tokens for the mobile app.
 *
 * These tokens mirror the naming conventions used in web artifacts (index.css)
 * so that multi-artifact projects share a cohesive visual identity.
 *
 * Replace the placeholder values below with values that match the project's
 * brand. If a sibling web artifact exists, read its index.css and convert the
 * HSL values to hex so both artifacts use the same palette.
 *
 * To add dark mode, add a `dark` key with the same token names.
 * The useColors() hook will automatically pick it up.
 */

const colors = {
  light: {
    // Legacy aliases (kept for backward compatibility)
    text: '#17352B',
    tint: '#2D5A43',

    // Core surfaces
    background: '#F7F8F3',
    foreground: '#17352B',

    // Cards / elevated surfaces
    card: '#FFFFFF',
    cardForeground: '#17352B',

    // Primary action color (buttons, links, active states)
    primary: '#2D5A43',
    primaryForeground: '#ffffff',

    // Secondary / less-emphasis interactive surfaces
    secondary: '#E8EFE9',
    secondaryForeground: '#2D5A43',

    // Muted / subdued elements (dividers, timestamps, placeholders)
    muted: '#EEF2EA',
    mutedForeground: '#718078',

    // Accent highlights (badges, selected items, focus rings)
    accent: '#F1E9C8',
    accentForeground: '#6F5A1A',

    // Destructive actions (delete, error states)
    destructive: '#ef4444',
    destructiveForeground: '#ffffff',

    // Borders and input outlines
    border: '#E1E8DF',
    input: '#D7E1D8',
  },

  // Border radius (in px). Sync from the sibling web artifact's --radius
  // CSS variable. This value applies to cards, buttons, inputs, and modals.
  radius: 8,
};

export default colors;
