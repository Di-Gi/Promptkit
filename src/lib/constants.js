// src/lib/constants.js - Application constants

// Maximum file size for preview (1MB)
export const maximumFileSize = 1024 * 1024;

// Supported file types for specific features
export const supportedCodeFileTypes = [
  '.js', '.jsx', '.ts', '.tsx', 
  '.html', '.css', '.json',
  '.py', '.rb', '.php', '.go',
  '.java', '.c', '.cpp', '.cs',
  '.md', '.txt'
];

// File categories for organization
export const fileCategories = {
  code: ['js', 'jsx', 'ts', 'tsx', 'html', 'css', 'json', 'py', 'rb', 'php', 'go', 'java', 'c', 'cpp', 'cs'],
  document: ['md', 'txt', 'pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'odt', 'rtf'],
  image: ['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp', 'bmp', 'ico'],
  archive: ['zip', 'rar', '7z', 'tar', 'gz', 'tgz'],
  audio: ['mp3', 'wav', 'ogg', 'flac', 'aac'],
  video: ['mp4', 'webm', 'avi', 'mov', 'wmv', 'mkv'],
};

// Application configuration
export const appConfig = {
  maxSavedPrompts: 10,
  defaultTheme: 'dark',
  maxFileSelections: 50,
};