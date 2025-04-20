import React from 'react';
import { FaSun, FaMoon } from 'react-icons/fa';
import { useTheme } from '../context/ThemeContext';
import './ThemeSwitch.css';

const ThemeSwitch = () => {
    const { theme, toggleTheme, colors } = useTheme();

    return (
        <div 
            className="theme-switch"
            onClick={toggleTheme}
            style={{ color: colors.text }}
        >
            {theme === 'dark' ? (
                <FaSun size={24} />
            ) : (
                <FaMoon size={24} />
            )}
        </div>
    );
};

export default ThemeSwitch; 