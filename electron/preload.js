const { contextBridge, ipcRenderer } = require("electron");

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld("electronAPI", {
  // File operations
  saveFile: (data) => ipcRenderer.invoke("save-file", data),
  readFile: (filePath) => ipcRenderer.invoke("read-file", filePath),
  showSaveDialog: (options) => ipcRenderer.invoke("show-save-dialog", options),
  showOpenDialog: (options) => ipcRenderer.invoke("show-open-dialog", options),

  // App information
  getAppVersion: () => process.versions.electron,
  getPlatform: () => process.platform,

  // Event listeners
  onExportData: (callback) => ipcRenderer.on("export-data", callback),
  onImportData: (callback) => ipcRenderer.on("import-data", callback),
  onClearAllData: (callback) => ipcRenderer.on("clear-all-data", callback),

  // Remove listeners
  removeAllListeners: (channel) => ipcRenderer.removeAllListeners(channel),
});

// Security: Disable eval and other dangerous features
window.addEventListener("DOMContentLoaded", () => {
  // Disable eval
  window.eval = () => {
    throw new Error("eval is disabled for security");
  };

  // Disable Function constructor
  window.Function = () => {
    throw new Error("Function constructor is disabled for security");
  };
});
