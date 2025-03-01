// src/contexts/SettingsContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";

const SettingsContext = createContext(undefined);

// Default settings
const defaultSettings = {
  theme: "dark",
  autoSavePrompts: false,
  pathDisplayFormat: "relative", // "full" or "relative"
  indentSize: 2,
  includeMetadata: true,
  recentDirectories: [], // Store recently accessed directories
  favorites: [] // Favorite directories or files
};

export function SettingsProvider({ children }) {
  // Initialize state from localStorage or use defaults
  const [settings, setSettings] = useState(() => {
    try {
      const storedSettings = localStorage.getItem("promptkit-settings");
      return storedSettings ? JSON.parse(storedSettings) : defaultSettings;
    } catch (error) {
      console.error("Failed to load settings from storage:", error);
      return defaultSettings;
    }
  });

  // Persist settings to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem("promptkit-settings", JSON.stringify(settings));
    } catch (error) {
      console.error("Failed to save settings to storage:", error);
    }
  }, [settings]);

  // Update a single setting
  const updateSetting = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Reset settings to defaults
  const resetSettings = () => {
    setSettings(defaultSettings);
  };

  // Add a directory to recent directories
  const addRecentDirectory = (dirPath) => {
    setSettings(prev => {
      const recentDirs = [dirPath, ...prev.recentDirectories.filter(d => d !== dirPath)].slice(0, 5);
      return {
        ...prev,
        recentDirectories: recentDirs
      };
    });
  };

  // Toggle a favorite directory
  const toggleFavorite = (path) => {
    setSettings(prev => {
      const isFavorite = prev.favorites.includes(path);
      return {
        ...prev,
        favorites: isFavorite
          ? prev.favorites.filter(f => f !== path)
          : [...prev.favorites, path].slice(0, 10)
      };
    });
  };

  return (
    <SettingsContext.Provider 
      value={{
        settings,
        updateSetting,
        resetSettings,
        addRecentDirectory,
        toggleFavorite
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
}