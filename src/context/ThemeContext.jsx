import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(
    () => localStorage.getItem('ewms_theme') || 'light'
  );
  const [accentColor, setAccentColor] = useState(
    () => localStorage.getItem('ewms_accent') || 'indigo'
  );
  const [fontSize, setFontSize] = useState(
    () => localStorage.getItem('ewms_fontsize') || 'base'
  );
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Apply theme class to <html>
  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('ewms_theme', theme);
  }, [theme]);

  // Apply font size
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('text-sm', 'text-base', 'text-lg');
    root.classList.add(fontSize === 'sm' ? 'text-sm' : fontSize === 'lg' ? 'text-lg' : 'text-base');
    localStorage.setItem('ewms_fontsize', fontSize);
  }, [fontSize]);

  // Persist accent
  useEffect(() => {
    localStorage.setItem('ewms_accent', accentColor);
  }, [accentColor]);

  const toggleTheme = useCallback(() =>
    setTheme((t) => (t === 'light' ? 'dark' : 'light')), []);

  return (
    <ThemeContext.Provider value={{
      theme, toggleTheme, setTheme,
      accentColor, setAccentColor,
      fontSize, setFontSize,
      sidebarCollapsed, setSidebarCollapsed,
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useThemeContext = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useThemeContext must be used inside ThemeProvider');
  return ctx;
};