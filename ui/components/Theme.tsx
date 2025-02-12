"use client";
import React, { createContext, useState, useContext, useEffect } from "react";
import { Moon, Sun } from "lucide-react";
import { Switch } from "@/components/ui/switch"; // Adjust import path for Switch

type Theme = "light" | "dark";

const themes = {
  light: {
    background: "bg-white text-black",
    text: "text-black",
    inputBackground: "bg-gray-100",
    buttonBackground: "bg-gray-200",
    icon: <Sun color="black" size={24} />,
  },
  dark: {
    background: "bg-[#343541] text-white",
    text: "text-white",
    inputBackground: "bg-[#40414F]",
    buttonBackground: "bg-[#202123]",
    icon: <Moon color="white" size={24} />,
  },
};

type ThemeContextType = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  themes: typeof themes;
};

const ThemeContext = createContext<ThemeContextType>({
  theme: "dark",
  setTheme: () => {},
  themes: themes,
});

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("app-theme") as Theme) || "dark";
    }
    return "dark";
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("app-theme", theme);
      document.documentElement.className = themes[theme].background;
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, themes }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

export const ThemeChanger = () => {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <div className="flex items-center justify-center">
      <Switch
        checked={theme === "dark"}
        onCheckedChange={toggleTheme}
        aria-label="Toggle Theme"
        className="p-2"
      />
    </div>
  );
};

export const getThemeClasses = (theme: Theme) => themes[theme];
