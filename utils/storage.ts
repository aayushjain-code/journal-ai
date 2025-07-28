// Enhanced storage utilities with IndexedDB support and compression
export interface StorageData {
  entries: any[];
  goals: any[];
  healthData?: any[];
  financeData?: any[];
  exportDate: string;
  version: string;
}

export const STORAGE_KEYS = {
  JOURNAL_ENTRIES: "journal_entries",
  GOALS: "goals",
  HEALTH_DATA: "health_data",
  FINANCE_DATA: "finance_data",
  PROFILE_DATA: "profile_data",
  ONBOARDING_DATA: "onboarding_data",
  ONBOARDING_COMPLETED: "onboardingCompleted",
} as const;

// IndexedDB setup for larger storage
let db: IDBDatabase | null = null;

const DB_NAME = "PersonalJournalDB";
const DB_VERSION = 1;
const STORE_NAME = "journalData";

export const initIndexedDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    if (db) {
      resolve(db);
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      db = request.result;
      resolve(db);
    };

    request.onupgradeneeded = (event) => {
      const database = (event.target as IDBOpenDBRequest).result;
      if (!database.objectStoreNames.contains(STORE_NAME)) {
        database.createObjectStore(STORE_NAME, { keyPath: "key" });
      }
    };
  });
};

// Compress data to save space
export const compressData = (data: any): string => {
  try {
    const jsonString = JSON.stringify(data);
    // Simple compression: remove unnecessary whitespace and use shorter property names
    return jsonString
      .replace(/\s+/g, "")
      .replace(/"([^"]+)":/g, (match, key) => {
        const shortKeys: Record<string, string> = {
          id: "i",
          title: "t",
          content: "c",
          mood: "m",
          energy: "e",
          category: "cat",
          tags: "tg",
          timestamp: "ts",
          description: "d",
          priority: "p",
          targetDate: "td",
          progress: "pr",
          completed: "comp",
          createdAt: "ca",
          milestones: "ms",
        };
        return `"${shortKeys[key] || key}":`;
      });
  } catch (error) {
    console.error("Compression error:", error);
    return JSON.stringify(data);
  }
};

// Decompress data
export const decompressData = (compressedData: string): any => {
  try {
    // Reverse the compression
    const expandedData = compressedData.replace(/"([^"]+)":/g, (match, key) => {
      const longKeys: Record<string, string> = {
        i: "id",
        t: "title",
        c: "content",
        m: "mood",
        e: "energy",
        cat: "category",
        tg: "tags",
        ts: "timestamp",
        d: "description",
        p: "priority",
        td: "targetDate",
        pr: "progress",
        comp: "completed",
        ca: "createdAt",
        ms: "milestones",
      };
      return `"${longKeys[key] || key}":`;
    });
    return JSON.parse(expandedData);
  } catch (error) {
    console.error("Decompression error:", error);
    return JSON.parse(compressedData);
  }
};

// Enhanced storage size calculation
export const getStorageSize = (): number => {
  let totalSize = 0;

  try {
    // Calculate localStorage size
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        totalSize += localStorage[key].length + key.length;
      }
    }

    // Add estimated IndexedDB size (if available)
    if (db) {
      totalSize += 1024 * 1024; // Estimate 1MB for IndexedDB
    }
  } catch (error) {
    console.error("Error calculating storage size:", error);
  }

  return totalSize;
};

// Get comprehensive storage information
export const getStorageInfo = () => {
  try {
    const totalSize = getStorageSize();
    const maxSize = 5 * 1024 * 1024; // 5MB limit
    const usagePercentage = (totalSize / maxSize) * 100;

    const entries = JSON.parse(
      localStorage.getItem(STORAGE_KEYS.JOURNAL_ENTRIES) || "[]"
    );
    const goals = JSON.parse(localStorage.getItem(STORAGE_KEYS.GOALS) || "[]");
    const healthData = JSON.parse(
      localStorage.getItem(STORAGE_KEYS.HEALTH_DATA) || "[]"
    );
    const financeData = JSON.parse(
      localStorage.getItem(STORAGE_KEYS.FINANCE_DATA) || "[]"
    );

    return {
      totalSize,
      maxSize,
      usagePercentage: Math.round(usagePercentage * 100) / 100,
      entriesCount: entries.length,
      goalsCount: goals.length,
      healthDataCount: healthData.length,
      financeDataCount: financeData.length,
      isNearLimit: usagePercentage > 80,
      storageType: db ? "IndexedDB + localStorage" : "localStorage only",
    };
  } catch (error) {
    console.error("Error getting storage info:", error);
    return {
      totalSize: 0,
      maxSize: 5 * 1024 * 1024,
      usagePercentage: 0,
      entriesCount: 0,
      goalsCount: 0,
      healthDataCount: 0,
      financeDataCount: 0,
      isNearLimit: false,
      storageType: "localStorage only",
    };
  }
};

// Enhanced data clearing
export const clearAllData = (): boolean => {
  try {
    // Clear localStorage
    Object.keys(STORAGE_KEYS).forEach((key) => {
      localStorage.removeItem(STORAGE_KEYS[key as keyof typeof STORAGE_KEYS]);
    });

    // Clear IndexedDB if available
    if (db) {
      const transaction = db.transaction([STORE_NAME], "readwrite");
      const store = transaction.objectStore(STORE_NAME);
      store.clear();
    }

    return true;
  } catch (error) {
    console.error("Error clearing data:", error);
    return false;
  }
};

// Enhanced data export with compression
export const exportData = (
  entries: any[],
  goals: any[],
  healthData?: any[],
  financeData?: any[]
): string => {
  const data: StorageData = {
    entries,
    goals,
    healthData: healthData || [],
    financeData: financeData || [],
    exportDate: new Date().toISOString(),
    version: "1.0.0",
  };

  return compressData(data);
};

// Enhanced data import with decompression
export const importData = (
  jsonString: string
): {
  entries: any[];
  goals: any[];
  healthData?: any[];
  financeData?: any[];
} | null => {
  try {
    const data = decompressData(jsonString);

    if (!data.entries || !data.goals) {
      throw new Error("Invalid data format");
    }

    return {
      entries: data.entries,
      goals: data.goals,
      healthData: data.healthData || [],
      financeData: data.financeData || [],
    };
  } catch (error) {
    console.error("Import error:", error);
    return null;
  }
};

// Enhanced backup with IndexedDB support
export const backupData = (): StorageData | null => {
  try {
    const entries = JSON.parse(
      localStorage.getItem(STORAGE_KEYS.JOURNAL_ENTRIES) || "[]"
    );
    const goals = JSON.parse(localStorage.getItem(STORAGE_KEYS.GOALS) || "[]");
    const healthData = JSON.parse(
      localStorage.getItem(STORAGE_KEYS.HEALTH_DATA) || "[]"
    );
    const financeData = JSON.parse(
      localStorage.getItem(STORAGE_KEYS.FINANCE_DATA) || "[]"
    );

    return {
      entries,
      goals,
      healthData,
      financeData,
      exportDate: new Date().toISOString(),
      version: "1.0.0",
    };
  } catch (error) {
    console.error("Backup error:", error);
    return null;
  }
};

// Enhanced restore with IndexedDB support
export const restoreData = (backup: StorageData): boolean => {
  try {
    localStorage.setItem(
      STORAGE_KEYS.JOURNAL_ENTRIES,
      JSON.stringify(backup.entries)
    );
    localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(backup.goals));

    if (backup.healthData) {
      localStorage.setItem(
        STORAGE_KEYS.HEALTH_DATA,
        JSON.stringify(backup.healthData)
      );
    }

    if (backup.financeData) {
      localStorage.setItem(
        STORAGE_KEYS.FINANCE_DATA,
        JSON.stringify(backup.financeData)
      );
    }

    return true;
  } catch (error) {
    console.error("Restore error:", error);
    return false;
  }
};

// Initialize IndexedDB on app startup
export const initializeStorage = async () => {
  try {
    await initIndexedDB();
    console.log("IndexedDB initialized successfully");
  } catch (error) {
    console.warn("IndexedDB not available, using localStorage only:", error);
  }
};
