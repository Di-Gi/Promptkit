// src/contexts/FileSelectionContext.jsx - File selection state management

import React, { createContext, useContext, useState } from "react";

const FileSelectionContext = createContext(undefined);

export function FileSelectionProvider({ children }) {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [activeFile, setActiveFile] = useState(null);
  
  const addSelectedFile = (file) => {
    if (!selectedFiles.some(f => f.path === file.path)) {
      setSelectedFiles(prev => [...prev, file]);
    }
    
    // Automatically set as active file for preview
    setActiveFile(file);
  };
  
  const removeSelectedFile = (filePath) => {
    setSelectedFiles(prev => prev.filter(f => f.path !== filePath));
    
    // Clear active file if it was removed
    if (activeFile && activeFile.path === filePath) {
      setActiveFile(null);
    }
  };
  
  const clearSelectedFiles = () => {
    setSelectedFiles([]);
    setActiveFile(null);
  };
  
  return (
    <FileSelectionContext.Provider value={{
      selectedFiles,
      activeFile,
      setActiveFile,
      addSelectedFile,
      removeSelectedFile,
      clearSelectedFiles
    }}>
      {children}
    </FileSelectionContext.Provider>
  );
}

export function useFileSelection() {
  const context = useContext(FileSelectionContext);
  if (context === undefined) {
    throw new Error("useFileSelection must be used within a FileSelectionProvider");
  }
  return context;
}