// src/App.jsx - Updated with ErrorBoundaries
import React from "react";
import { ThemeProvider } from "./contexts/ThemeContext";
import { SettingsProvider } from "./contexts/SettingsContext";
import { FileSelectionProvider } from "./contexts/FileSelectionContext";
import { PromptProvider } from "./contexts/PromptContext";
import Header from "./components/layout/Header";
import MainLayout from "./components/layout/MainLayout";
import StatusBar from "./components/layout/StatusBar";
import { Toaster } from "./components/ui/toaster";
import ErrorBoundary from "./components/ErrorBoundary";

export default function App() {
  return (
    <ErrorBoundary>
      <SettingsProvider>
        <ThemeProvider>
          <FileSelectionProvider>
            <PromptProvider>
              <div className="min-h-screen bg-background text-foreground flex flex-col">
                <ErrorBoundary>
                  <Header />
                </ErrorBoundary>
                <ErrorBoundary>
                  <MainLayout />
                </ErrorBoundary>
                <ErrorBoundary>
                  <StatusBar />
                </ErrorBoundary>
                <Toaster />
              </div>
            </PromptProvider>
          </FileSelectionProvider>
        </ThemeProvider>
      </SettingsProvider>
    </ErrorBoundary>
  );
}