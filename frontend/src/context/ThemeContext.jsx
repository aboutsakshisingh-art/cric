import { createContext, useContext, useState, useCallback } from 'react';
import { themes, applyTheme, getAvailableThemes, getTheme } from '../utils/themes';

const ThemeContext = createContext(null);

export const ThemeProvider = ({ children, defaultTheme = 'ipl25' }) => {
  const [currentTheme, setCurrentTheme] = useState(defaultTheme);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize theme on mount
  const initializeTheme = useCallback((themeKey) => {
    const success = applyTheme(themeKey);
    if (success) {
      setCurrentTheme(themeKey);
      setIsInitialized(true);
    }
    return success;
  }, []);

  // Change theme function
  const changeTheme = useCallback((themeKey) => {
    const success = applyTheme(themeKey);
    if (success) {
      setCurrentTheme(themeKey);
    }
    return success;
  }, []);

  // Get current theme object
  const getCurrentTheme = useCallback(() => {
    return getTheme(currentTheme);
  }, [currentTheme]);

  // Get all available themes
  const availableThemes = getAvailableThemes();

  const value = {
    currentTheme,
    currentThemeObject: getCurrentTheme(),
    availableThemes,
    changeTheme,
    initializeTheme,
    isInitialized,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use theme context
export const useTheme = () => {
  const context = useContext(ThemeContext);
  
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  
  return context;
};

export default ThemeContext;
