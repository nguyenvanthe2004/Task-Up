import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";

interface ThemeContextValue {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    const saved = localStorage.getItem("profile.theme");
    return saved === "dark" ? "dark" : "light";
  });

  const setTheme = (newTheme: Theme) => {
  setThemeState(newTheme);
  localStorage.setItem("profile.theme", newTheme);
  document.documentElement.classList.toggle("dark", newTheme === "dark");
};

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextValue => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside <ThemeProvider>");
  return ctx;
};