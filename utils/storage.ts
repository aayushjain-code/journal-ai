// Local storage utility functions

export interface StorageData {
  entries: any[];
  goals: any[];
  exportDate: string;
  version: string;
}

export const STORAGE_KEYS = {
  JOURNAL_ENTRIES: "journalEntries",
  GOALS: "goals",
  VISIONS: "visions",
} as const;

export const getStorageSize = (): number => {
  let total = 0;
  for (let key in localStorage) {
    if (localStorage.hasOwnProperty(key)) {
      total += localStorage[key].length + key.length;
    }
  }
  return total;
};

export const getStorageInfo = () => {
  const entries = localStorage.getItem(STORAGE_KEYS.JOURNAL_ENTRIES);
  const goals = localStorage.getItem(STORAGE_KEYS.GOALS);

  return {
    entriesCount: entries ? JSON.parse(entries).length : 0,
    goalsCount: goals ? JSON.parse(goals).length : 0,
    totalSize: getStorageSize(),
    maxSize: 5 * 1024 * 1024, // 5MB typical localStorage limit
  };
};

export const clearAllData = (): boolean => {
  try {
    Object.values(STORAGE_KEYS).forEach((key) => {
      localStorage.removeItem(key);
    });
    return true;
  } catch (error) {
    console.error("Error clearing localStorage:", error);
    return false;
  }
};

export const exportData = (entries: any[], goals: any[]): string => {
  const data: StorageData = {
    entries,
    goals,
    exportDate: new Date().toISOString(),
    version: "1.0.0",
  };

  return JSON.stringify(data, null, 2);
};

export const importData = (
  jsonString: string
): { entries: any[]; goals: any[] } | null => {
  try {
    const data = JSON.parse(jsonString);

    // Validate the imported data
    if (!data.entries || !Array.isArray(data.entries)) {
      throw new Error("Invalid entries data");
    }

    if (!data.goals || !Array.isArray(data.goals)) {
      throw new Error("Invalid goals data");
    }

    return {
      entries: data.entries,
      goals: data.goals,
    };
  } catch (error) {
    console.error("Error importing data:", error);
    return null;
  }
};

export const backupData = (): StorageData | null => {
  try {
    const entries = localStorage.getItem(STORAGE_KEYS.JOURNAL_ENTRIES);
    const goals = localStorage.getItem(STORAGE_KEYS.GOALS);

    return {
      entries: entries ? JSON.parse(entries) : [],
      goals: goals ? JSON.parse(goals) : [],
      exportDate: new Date().toISOString(),
      version: "1.0.0",
    };
  } catch (error) {
    console.error("Error creating backup:", error);
    return null;
  }
};

export const restoreData = (backup: StorageData): boolean => {
  try {
    if (backup.entries) {
      localStorage.setItem(
        STORAGE_KEYS.JOURNAL_ENTRIES,
        JSON.stringify(backup.entries)
      );
    }
    if (backup.goals) {
      localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(backup.goals));
    }
    return true;
  } catch (error) {
    console.error("Error restoring data:", error);
    return false;
  }
};
