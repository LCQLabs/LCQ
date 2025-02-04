import React, { createContext, useContext, useState, useEffect } from 'react';

type Theme = 'dark' | 'light';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: Theme;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ 
  children, 
  defaultTheme = 'dark' 
}) => {
  const [theme, setTheme] = useState<Theme>(defaultTheme);
  
  // Initialize theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('lcq-theme') as Theme | null;
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);
  
  // Update localStorage and apply theme when it changes
  useEffect(() => {
    localStorage.setItem('lcq-theme', theme);
    applyTheme(theme);
  }, [theme]);
  
  const applyTheme = (newTheme: Theme) => {
    const root = document.documentElement;
    
    if (newTheme === 'dark') {
      root.classList.add('dark');
      
      // Set CSS variables for dark theme
      root.style.setProperty('--color-bg-primary', '#121212');
      root.style.setProperty('--color-bg-secondary', '#1E1E1E');
      root.style.setProperty('--color-bg-tertiary', '#252525');
      
      root.style.setProperty('--color-text-primary', '#FFFFFF');
      root.style.setProperty('--color-text-secondary', '#B0B0B0');
      
      root.style.setProperty('--color-accent-primary', '#479178');
      root.style.setProperty('--color-accent-secondary', '#7eb7a1');
      root.style.setProperty('--color-accent-tertiary', '#91d0b8');
      
      // Dark theme specific colors
      root.style.setProperty('--color-sidebar-bg', '#0A0A0A');
      root.style.setProperty('--color-card-bg', '#1A1A1A');
      root.style.setProperty('--color-input-bg', '#2A2A2A');
      root.style.setProperty('--color-border', '#333333');
    } else {
      root.classList.remove('dark');
      
      // Set CSS variables for light theme
      root.style.setProperty('--color-bg-primary', '#FFFFFF');
      root.style.setProperty('--color-bg-secondary', '#F5F5F5');
      root.style.setProperty('--color-bg-tertiary', '#EAEAEA');
      
      root.style.setProperty('--color-text-primary', '#121212');
      root.style.setProperty('--color-text-secondary', '#5A5A5A');
      
      root.style.setProperty('--color-accent-primary', '#08503d');
      root.style.setProperty('--color-accent-secondary', '#126444');
      root.style.setProperty('--color-accent-tertiary', '#186750');
      
      // Light theme specific colors
      root.style.setProperty('--color-sidebar-bg', '#F0F0F0');
      root.style.setProperty('--color-card-bg', '#FFFFFF');
      root.style.setProperty('--color-input-bg', '#F5F5F5');
      root.style.setProperty('--color-border', '#E0E0E0');
    }
  };
  
  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'dark' ? 'light' : 'dark'));
  };
  
  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use the theme context
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  
  return context;
};

// Higher-order component to apply theme to a component
export const withTheme = <P extends object>(
  Component: React.ComponentType<P>
): React.FC<P> => {
  return (props: P) => {
    return (
      <ThemeProvider>
        <Component {...props} />
      </ThemeProvider>
    );
  };
};

export default ThemeProvider;