// preload.js - With better error handling
const { contextBridge, ipcRenderer } = require('electron');

// Safely wrap IPC calls with error handling
const safeIpcCall = async (channel, ...args) => {
  try {
    return await ipcRenderer.invoke(channel, ...args);
  } catch (error) {
    console.error(`IPC call to ${channel} failed:`, error);
    return null;
  }
};

const safeIpcSend = (channel, ...args) => {
  try {
    ipcRenderer.send(channel, ...args);
    return true;
  } catch (error) {
    console.error(`IPC send to ${channel} failed:`, error);
    return false;
  }
};

// Expose window control APIs to the renderer
contextBridge.exposeInMainWorld('electron', {
  windowControls: {
    minimize: () => safeIpcSend('window:minimize'),
    maximize: () => safeIpcSend('window:maximize'),
    close: () => safeIpcSend('window:close'),
    isMaximized: () => safeIpcCall('window:isMaximized')
  }
});