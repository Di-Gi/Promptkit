// src/lib/utils.js - Utility functions

import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatFileSize(bytes) {
  if (bytes === 0) return "0 B";
  
  const units = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${units[i]}`;
}

export function formatDate(dateString) {
  const date = new Date(dateString);
  
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}

export function formatFilePath(fullPath, formatType = "full") {
  if (!fullPath) return fullPath;
  
  switch (formatType) {
    case "filename":
      // Extract just the filename from the path
      return fullPath.split(/[/\\]/).pop();
      
    case "relative":
      // Create a relative-style path, keeping the last 2-3 directories
      const parts = fullPath.split(/[/\\]/);
      if (parts.length <= 3) return fullPath;
      
      // For Windows-style paths with drive letter (C:\)
      if (fullPath.match(/^[A-Z]:\\/i)) {
        // Start from the 3rd segment after the drive
        return '...' + parts.slice(-3).join('/');
      }
      
      // For Unix-style paths
      return '...' + parts.slice(-3).join('/');
      
    case "full":
    default:
      return fullPath;
  }
}

export function getFileIcon(extension) {
  // Map file extensions to appropriate icons
  const extensionMap = {
    ".js": "code",
    ".jsx": "code",
    ".ts": "code",
    ".tsx": "code",
    ".html": "code",
    ".css": "code",
    ".json": "code",
    ".md": "file-text",
    ".txt": "file-text",
    ".pdf": "file-text",
    ".jpg": "image",
    ".jpeg": "image",
    ".png": "image",
    ".gif": "image",
    ".svg": "image",
    // Add more mappings as needed
  };
  
  return extensionMap[extension?.toLowerCase()] || "file";
}