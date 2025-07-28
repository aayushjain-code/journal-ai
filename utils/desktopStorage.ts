// Desktop-specific storage utilities using file system

// Type definitions for Electron API
declare global {
  interface Window {
    electronAPI?: {
      saveFile: (data: {
        filePath: string;
        content: string;
      }) => Promise<{ success: boolean; error?: string }>;
      readFile: (
        filePath: string
      ) => Promise<{ success: boolean; content?: string; error?: string }>;
      showSaveDialog: (
        options?: any
      ) => Promise<{ canceled: boolean; filePath?: string }>;
      showOpenDialog: (
        options?: any
      ) => Promise<{ canceled: boolean; filePaths?: string[] }>;
      getAppVersion: () => string;
      getPlatform: () => string;
      onExportData: (callback: () => void) => void;
      onImportData: (callback: () => void) => void;
      onClearAllData: (callback: () => void) => void;
      removeAllListeners: (channel: string) => void;
    };
  }
}

export interface DesktopStorageData {
  entries: any[];
  goals: any[];
  healthData?: any[];
  financeData?: any[];
  profileData?: any[];
  exportDate: string;
  version: string;
}

export interface StorageStats {
  totalSize: number;
  entriesCount: number;
  goalsCount: number;
  healthDataCount: number;
  financeDataCount: number;
  lastBackup: string;
  storageType: "desktop" | "browser";
}

// Check if running in Electron
export const isElectron = () => {
  return typeof window !== "undefined" && window.electronAPI;
};

// Desktop storage functions
export const desktopStorage = {
  // Save data to file system
  async saveData(data: any, filename: string): Promise<boolean> {
    if (!isElectron() || !window.electronAPI) return false;

    try {
      const result = await window.electronAPI.saveFile({
        filePath: filename,
        content: JSON.stringify(data, null, 2),
      });
      return result.success;
    } catch (error) {
      console.error("Desktop save error:", error);
      return false;
    }
  },

  // Load data from file system
  async loadData(filename: string): Promise<any | null> {
    if (!isElectron() || !window.electronAPI) return null;

    try {
      const result = await window.electronAPI.readFile(filename);
      if (result.success && result.content) {
        return JSON.parse(result.content);
      }
      return null;
    } catch (error) {
      console.error("Desktop load error:", error);
      return null;
    }
  },

  // Show save dialog
  async showSaveDialog(options?: any): Promise<string | null> {
    if (!isElectron() || !window.electronAPI) return null;

    try {
      const result = await window.electronAPI.showSaveDialog(options);
      return result.canceled ? null : result.filePath || null;
    } catch (error) {
      console.error("Save dialog error:", error);
      return null;
    }
  },

  // Show open dialog
  async showOpenDialog(options?: any): Promise<string | null> {
    if (!isElectron() || !window.electronAPI) return null;

    try {
      const result = await window.electronAPI.showOpenDialog(options);
      return result.canceled ? null : result.filePaths?.[0] || null;
    } catch (error) {
      console.error("Open dialog error:", error);
      return null;
    }
  },

  // Export data with native dialog
  async exportData(data: DesktopStorageData): Promise<boolean> {
    if (!isElectron() || !window.electronAPI) return false;

    try {
      const filePath = await this.showSaveDialog();
      if (filePath) {
        return await this.saveData(data, filePath);
      }
      return false;
    } catch (error) {
      console.error("Export error:", error);
      return false;
    }
  },

  // Import data with native dialog
  async importData(): Promise<DesktopStorageData | null> {
    if (!isElectron() || !window.electronAPI) return null;

    try {
      const filePath = await this.showOpenDialog();
      if (filePath) {
        return await this.loadData(filePath);
      }
      return null;
    } catch (error) {
      console.error("Import error:", error);
      return null;
    }
  },

  // Get storage statistics
  async getStorageStats(): Promise<StorageStats> {
    if (!isElectron() || !window.electronAPI) {
      return {
        totalSize: 0,
        entriesCount: 0,
        goalsCount: 0,
        healthDataCount: 0,
        financeDataCount: 0,
        lastBackup: "",
        storageType: "browser",
      };
    }

    try {
      // Try to load data files to get stats
      const entries = (await this.loadData("journal_entries.json")) || [];
      const goals = (await this.loadData("goals.json")) || [];
      const healthData = (await this.loadData("health_data.json")) || [];
      const financeData = (await this.loadData("finance_data.json")) || [];

      return {
        totalSize: JSON.stringify({ entries, goals, healthData, financeData })
          .length,
        entriesCount: entries.length,
        goalsCount: goals.length,
        healthDataCount: healthData.length,
        financeDataCount: financeData.length,
        lastBackup: new Date().toISOString(),
        storageType: "desktop",
      };
    } catch (error) {
      console.error("Storage stats error:", error);
      return {
        totalSize: 0,
        entriesCount: 0,
        goalsCount: 0,
        healthDataCount: 0,
        financeDataCount: 0,
        lastBackup: "",
        storageType: "desktop",
      };
    }
  },

  // Auto-save data
  async autoSave(data: any, type: string): Promise<boolean> {
    if (!isElectron() || !window.electronAPI) return false;

    try {
      const filename = `${type}_data.json`;
      return await this.saveData(data, filename);
    } catch (error) {
      console.error("Auto-save error:", error);
      return false;
    }
  },

  // Load all data
  async loadAllData(): Promise<{
    entries: any[];
    goals: any[];
    healthData: any[];
    financeData: any[];
    profileData: any[];
  }> {
    if (!isElectron() || !window.electronAPI) {
      return {
        entries: [],
        goals: [],
        healthData: [],
        financeData: [],
        profileData: [],
      };
    }

    try {
      const entries = (await this.loadData("journal_entries.json")) || [];
      const goals = (await this.loadData("goals.json")) || [];
      const healthData = (await this.loadData("health_data.json")) || [];
      const financeData = (await this.loadData("finance_data.json")) || [];
      const profileData = (await this.loadData("profile_data.json")) || [];

      return {
        entries,
        goals,
        healthData,
        financeData,
        profileData,
      };
    } catch (error) {
      console.error("Load all data error:", error);
      return {
        entries: [],
        goals: [],
        healthData: [],
        financeData: [],
        profileData: [],
      };
    }
  },

  // Clear all data
  async clearAllData(): Promise<boolean> {
    if (!isElectron() || !window.electronAPI) return false;

    try {
      const files = [
        "journal_entries.json",
        "goals.json",
        "health_data.json",
        "finance_data.json",
        "profile_data.json",
      ];

      for (const file of files) {
        await this.saveData([], file);
      }

      return true;
    } catch (error) {
      console.error("Clear data error:", error);
      return false;
    }
  },
};

// Enhanced storage with desktop support
export const enhancedStorage = {
  // Save data with automatic fallback
  async saveData(key: string, data: any): Promise<boolean> {
    if (isElectron()) {
      return await desktopStorage.autoSave(data, key);
    } else {
      // Fallback to localStorage
      try {
        localStorage.setItem(key, JSON.stringify(data));
        return true;
      } catch (error) {
        console.error("localStorage save error:", error);
        return false;
      }
    }
  },

  // Load data with automatic fallback
  async loadData(key: string): Promise<any> {
    if (isElectron()) {
      const filename = `${key}_data.json`;
      return (await desktopStorage.loadData(filename)) || [];
    } else {
      // Fallback to localStorage
      try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : [];
      } catch (error) {
        console.error("localStorage load error:", error);
        return [];
      }
    }
  },

  // Export data with native dialog in desktop
  async exportData(data: DesktopStorageData): Promise<boolean> {
    if (isElectron()) {
      return await desktopStorage.exportData(data);
    } else {
      // Fallback to browser download
      try {
        const blob = new Blob([JSON.stringify(data, null, 2)], {
          type: "application/json",
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `journal-backup-${
          new Date().toISOString().split("T")[0]
        }.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        return true;
      } catch (error) {
        console.error("Browser export error:", error);
        return false;
      }
    }
  },

  // Import data with native dialog in desktop
  async importData(): Promise<DesktopStorageData | null> {
    if (isElectron()) {
      return await desktopStorage.importData();
    } else {
      // Fallback to browser file input
      return new Promise((resolve) => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = ".json";
        input.onchange = (e) => {
          const file = (e.target as HTMLInputElement).files?.[0];
          if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
              try {
                const data = JSON.parse(e.target?.result as string);
                resolve(data);
              } catch (error) {
                console.error("Import error:", error);
                resolve(null);
              }
            };
            reader.readAsText(file);
          } else {
            resolve(null);
          }
        };
        input.click();
      });
    }
  },

  // Get storage statistics
  async getStorageStats(): Promise<StorageStats> {
    if (isElectron()) {
      return await desktopStorage.getStorageStats();
    } else {
      // Browser storage stats
      try {
        const entries = JSON.parse(
          localStorage.getItem("journal_entries") || "[]"
        );
        const goals = JSON.parse(localStorage.getItem("goals") || "[]");
        const healthData = JSON.parse(
          localStorage.getItem("health_data") || "[]"
        );
        const financeData = JSON.parse(
          localStorage.getItem("finance_data") || "[]"
        );

        let totalSize = 0;
        for (let key in localStorage) {
          if (localStorage.hasOwnProperty(key)) {
            totalSize += localStorage[key].length + key.length;
          }
        }

        return {
          totalSize,
          entriesCount: entries.length,
          goalsCount: goals.length,
          healthDataCount: healthData.length,
          financeDataCount: financeData.length,
          lastBackup: new Date().toISOString(),
          storageType: "browser",
        };
      } catch (error) {
        console.error("Browser storage stats error:", error);
        return {
          totalSize: 0,
          entriesCount: 0,
          goalsCount: 0,
          healthDataCount: 0,
          financeDataCount: 0,
          lastBackup: "",
          storageType: "browser",
        };
      }
    }
  },
};
