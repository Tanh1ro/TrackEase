import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  return useContext(ThemeContext);
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme || 'light';
  });

  const colors = {
    primary: '#6C63FF',
    primaryHover: '#8B84FF',
    background: theme === 'light' ? '#f6f8fa' : '#0d1117',
    card: theme === 'light' ? '#ffffff' : '#161b22',
    text: theme === 'light' ? '#24292e' : '#c9d1d9',
    textSecondary: theme === 'light' ? '#586069' : '#8b949e',
    border: theme === 'light' ? '#e1e4e8' : '#30363d',
    error: theme === 'light' ? '#d73a49' : '#f85149',
    success: '#2ea44f',
    warning: '#f7b955',
    info: '#58a6ff',
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    document.body.style.backgroundColor = colors.background;
    document.body.style.color = colors.text;
  }, [theme, colors.background, colors.text]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, colors }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext; 