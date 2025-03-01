// src/contexts/ToastContext.jsx - Toast state management

import React, { createContext, useContext, useState, useCallback } from "react";

// Create the context and export it for direct use if needed
const ToastContext = createContext(undefined);
export { ToastContext };

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  
  // Add a new toast
  const toast = useCallback(({ title, description, variant = "default", duration = 3000, action }) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 9); // Simple unique ID without dependency
    const newToast = { id, title, description, variant, action };
    
    setToasts(prev => [...prev, newToast]);
    
    // Auto-dismiss after duration
    if (duration !== Infinity) {
      setTimeout(() => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
      }, duration);
    }
    
    return id;
  }, []);
  
  // Remove a toast by ID
  const dismissToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);
  
  // Clear all toasts
  const clearToasts = useCallback(() => {
    setToasts([]);
  }, []);
  
  return (
    <ToastContext.Provider value={{ toasts, toast, dismissToast, clearToasts }}>
      {children}
    </ToastContext.Provider>
  );
}

// Main hook for accessing the toast context
export function useToasts() {
  const context = useContext(ToastContext);
  
  if (context === undefined) {
    throw new Error("useToasts must be used within a ToastProvider");
  }
  
  return context;
}