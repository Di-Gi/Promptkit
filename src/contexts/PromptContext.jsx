// src/contexts/PromptContext.jsx - Prompt management context

import React, { createContext, useContext, useState, useEffect } from "react";
import { useSettings } from "./SettingsContext";

const PromptContext = createContext(undefined);

export function PromptProvider({ children }) {
  const { settings } = useSettings();
  
  // Main prompt content with auto-save capability
  const [mainPrompt, setMainPromptRaw] = useState("");
  
  // Saved prompts history with better persistence
  const [savedPrompts, setSavedPrompts] = useState(() => {
    try {
      const storedPrompts = localStorage.getItem("promptkit-saved-prompts");
      return storedPrompts ? JSON.parse(storedPrompts) : [];
    } catch (error) {
      console.error("Failed to load saved prompts:", error);
      return [];
    }
  });
  
  // Handle setting the main prompt with optional auto-save
  const setMainPrompt = (prompt) => {
    setMainPromptRaw(prompt);
    
    // If auto-save is enabled and the prompt is non-empty, save it automatically
    if (settings.autoSavePrompts && prompt.trim() !== "") {
      // Only auto-save if it has changed significantly (more than 50 chars difference)
      const lastSaved = savedPrompts[0] || "";
      if (Math.abs(prompt.length - lastSaved.length) > 50) {
        savePromptWithMetadata(prompt);
      }
    }
  };

  // Save prompts to localStorage when they change
  useEffect(() => {
    try {
      localStorage.setItem("promptkit-saved-prompts", JSON.stringify(savedPrompts));
    } catch (error) {
      console.error("Failed to save prompts to storage:", error);
    }
  }, [savedPrompts]);

  // Enhanced save function with metadata
  const savePromptWithMetadata = (prompt) => {
    if (!prompt || prompt.trim() === "") return;
    
    const promptWithMetadata = {
      text: prompt,
      timestamp: new Date().toISOString(),
      id: Date.now().toString(36) + Math.random().toString(36).substring(2)
    };

    // Add to start, limit to 15 saved prompts
    setSavedPrompts(prev => {
      // Don't add if it's the same as the most recent prompt
      if (prev.length > 0 && prev[0].text === prompt) {
        return prev;
      }
      
      const updated = [promptWithMetadata, ...prev];
      return updated.slice(0, 15);
    });
  };

  // Function to save current prompt
  const savePrompt = () => {
    savePromptWithMetadata(mainPrompt);
  };

  // Delete a specific prompt by ID
  const deletePrompt = (id) => {
    setSavedPrompts(prev => prev.filter(p => p.id !== id));
  };

  // Export all prompts as JSON
  const exportPrompts = () => {
    try {
      const dataStr = JSON.stringify(savedPrompts, null, 2);
      const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', 'promptkit-prompts.json');
      linkElement.click();
      
      return true;
    } catch (error) {
      console.error("Failed to export prompts:", error);
      return false;
    }
  };

  // Import prompts from JSON
  const importPrompts = async (file) => {
    try {
      const text = await file.text();
      const importedPrompts = JSON.parse(text);
      
      if (Array.isArray(importedPrompts)) {
        setSavedPrompts(prev => {
          // Merge imported prompts with existing (avoiding duplicates)
          const existingIds = new Set(prev.map(p => p.id));
          const newPrompts = importedPrompts.filter(p => !existingIds.has(p.id));
          return [...prev, ...newPrompts].slice(0, 50); // Allow more imported prompts
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error("Failed to import prompts:", error);
      return false;
    }
  };

  return (
    <PromptContext.Provider value={{
      mainPrompt,
      setMainPrompt,
      savedPrompts,
      savePrompt,
      deletePrompt,
      exportPrompts,
      importPrompts
    }}>
      {children}
    </PromptContext.Provider>
  );
}

export function usePrompt() {
  const context = useContext(PromptContext);
  if (context === undefined) {
    throw new Error("usePrompt must be used within a PromptProvider");
  }
  return context;
}