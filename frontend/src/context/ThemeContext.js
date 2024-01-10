import React, { createContext, useContext, useState, useEffect } from 'react';
import { createTheme, ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { grey, indigo } from '@mui/material/colors';


// the themes:
const lightTheme = createTheme({
    title: 'light',
    mode: 'light',
    palette: {
        mode: 'light',
        primary: {
            main: indigo[400],
            dark: indigo[600],
            light: indigo[200]
        },
        secondary: {
            main: grey[500],
            dark: grey[700],
            light: grey[300]
        },
        background: {
            default: "#eeefef",
            paper: "#ffffff"
        },
        text: {
            main: "#222111",
            light: "#333222",
            dark: "#111000",
            white: "#eeefef"
        },
        border: {
            main: grey[300]
        }
    }
});
const darkTheme = createTheme({
    title: 'dark',
    palette: {
        mode: 'dark',
        primary: { 
            main: indigo[400],
            dark: indigo[600],
            light: indigo[200]
        },
        secondary: {
            main: grey[300],
            dark: grey[500],
            light: grey[100]
        },
        background: {
            default: "#2e2e2e",
            paper: "#FFF",
            table: "#2a2a2a"
        },
        text: {
            main: "#eee",
            light: "#ccc",
            dark: "#fff",
            white: "#eeefef"
        },
        border: {
            main: grey[700]
        }
    }  
});



const ThemeContext = createContext();

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState(() => {
        // light is default 
        return JSON.parse(localStorage.getItem('theme')) || lightTheme;
    }); 

    const toggleTheme = () => {
        const newTheme = theme.title === 'light' ? darkTheme : lightTheme;
        setTheme(newTheme);
        // document.getElementById('change-color-button').addEventListener('click', function() {
        //     // Get all elements containing text
        //     const textElements = document.querySelectorAll('body *:not(script):not(style)');
            
        //     // Change text color to white
        //     textElements.forEach(element => {
        //         element.style.color = 'white';
        //     });
        // });
        localStorage.setItem('theme', JSON.stringify(newTheme));
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};
