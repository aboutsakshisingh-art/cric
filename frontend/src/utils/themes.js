// themes.json - Theme configuration for cricket overlay
export const themes = {
  asiaCup: {
    name: 'Asia Cup',
    primary: '#1E3A8A',      // Deep blue
    secondary: '#F59E0B',    // Amber gold
    text: '#FFFFFF',         // White
    textSecondary: '#E5E7EB',// Light gray
    accent: '#DC2626',       // Red
    background: 'rgba(30, 58, 138, 0.95)',
    gradient: 'linear-gradient(135deg, #1E3A8A 0%, #3B82F6 100%)',
    ballDot: {
      default: '#6B7280',
      zero: '#6B7280',
      one: '#10B981',
      two: '#3B82F6',
      three: '#8B5CF6',
      four: '#F59E0B',
      five: '#EC4899',
      six: '#EF4444',
      wicket: '#DC2626',
      wide: '#F97316',
      noBall: '#DC2626',
    },
  },
  ipl25: {
    name: 'IPL 2025',
    primary: '#7C3AED',      // Purple
    secondary: '#FBBF24',    // Gold
    text: '#FFFFFF',         // White
    textSecondary: '#F3F4F6',// Light gray
    accent: '#06B6D4',       // Cyan
    background: 'rgba(124, 58, 237, 0.95)',
    gradient: 'linear-gradient(135deg, #7C3AED 0%, #A855F7 50%, #EC4899 100%)',
    ballDot: {
      default: '#9CA3AF',
      zero: '#9CA3AF',
      one: '#34D399',
      two: '#60A5FA',
      three: '#A78BFA',
      four: '#FBBF24',
      five: '#F472B6',
      six: '#F87171',
      wicket: '#EF4444',
      wide: '#FB923C',
      noBall: '#EF4444',
    },
  },
  worldCup: {
    name: 'World Cup',
    primary: '#0F172A',      // Slate dark
    secondary: '#38BDF8',    // Sky blue
    text: '#FFFFFF',         // White
    textSecondary: '#CBD5E1',// Gray
    accent: '#22C55E',       // Green
    background: 'rgba(15, 23, 42, 0.95)',
    gradient: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
    ballDot: {
      default: '#64748B',
      zero: '#64748B',
      one: '#4ADE80',
      two: '#38BDF8',
      three: '#A78BFA',
      four: '#FACC15',
      five: '#F472B6',
      six: '#F87171',
      wicket: '#EF4444',
      wide: '#FB923C',
      noBall: '#EF4444',
    },
  },
};

/**
 * Utility function to apply theme CSS variables to document root
 * @param {string} themeKey - Key of the theme to apply (e.g., 'asiaCup', 'ipl25')
 * @returns {boolean} - Success status
 */
export const applyTheme = (themeKey) => {
  const theme = themes[themeKey];
  
  if (!theme) {
    console.error(`Theme "${themeKey}" not found. Available themes:`, Object.keys(themes));
    return false;
  }

  const root = document.documentElement;
  
  // Set main color variables
  root.style.setProperty('--primary-color', theme.primary);
  root.style.setProperty('--secondary-color', theme.secondary);
  root.style.setProperty('--text-color', theme.text);
  root.style.setProperty('--text-secondary-color', theme.textSecondary);
  root.style.setProperty('--accent-color', theme.accent);
  root.style.setProperty('--background-color', theme.background);
  root.style.setProperty('--gradient-bg', theme.gradient);

  // Set ball dot colors
  Object.entries(theme.ballDot).forEach(([key, value]) => {
    root.style.setProperty(`--ball-${key}`, value);
  });

  console.log(`✅ Theme applied: ${theme.name}`);
  return true;
};

/**
 * Get all available theme keys
 * @returns {string[]} Array of theme keys
 */
export const getAvailableThemes = () => {
  return Object.keys(themes);
};

/**
 * Get theme by key
 * @param {string} themeKey - Theme key
 * @returns {object|null} Theme object or null if not found
 */
export const getTheme = (themeKey) => {
  return themes[themeKey] || null;
};
