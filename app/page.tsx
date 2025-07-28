"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  BookOpen,
  Target,
  TrendingUp,
  Lightbulb,
  Calendar,
  Plus,
  Search,
  Filter,
} from "lucide-react";
import JournalEntry from "@/components/JournalEntry";
import GoalTracker from "@/components/GoalTracker";
import AIInsights from "@/components/AIInsights";
import VisionBoard from "@/components/VisionBoard";
import Analytics from "@/components/Analytics";
import Sidebar from "@/components/Sidebar";
import StorageInfo from "@/components/StorageInfo";
import toast from "react-hot-toast";
import {
  STORAGE_KEYS,
  getStorageInfo,
  clearAllData,
  exportData,
  importData,
} from "@/utils/storage";

// Define types for our data structures
interface JournalEntry {
  id: number;
  title: string;
  content: string;
  mood: number;
  energy: number;
  category: string;
  tags: string[];
  timestamp: string;
}

interface Goal {
  id: number;
  title: string;
  description: string;
  category: string;
  priority: string;
  targetDate?: string;
  progress: number;
  completed: boolean;
  createdAt: string;
  milestones?: any[];
}

export default function Home() {
  const [activeTab, setActiveTab] = useState("journal");
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Enhanced localStorage functions
  const saveToLocalStorage = (key: string, data: any) => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
      return true;
    } catch (error) {
      console.error(`Error saving to localStorage: ${error}`);
      toast.error("Failed to save data. Please check your browser storage.");
      return false;
    }
  };

  const loadFromLocalStorage = (key: string) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error(`Error loading from localStorage: ${error}`);
      toast.error("Failed to load saved data.");
      return null;
    }
  };

  const handleClearLocalStorage = () => {
    if (clearAllData()) {
      setEntries([]);
      setGoals([]);
      toast.success("All data cleared successfully!");
    } else {
      toast.error("Failed to clear data.");
    }
  };

  useEffect(() => {
    // Load saved data from localStorage with error handling
    const savedEntries = loadFromLocalStorage(STORAGE_KEYS.JOURNAL_ENTRIES);
    const savedGoals = loadFromLocalStorage(STORAGE_KEYS.GOALS);

    if (savedEntries && Array.isArray(savedEntries)) {
      setEntries(savedEntries);
    }
    if (savedGoals && Array.isArray(savedGoals)) {
      setGoals(savedGoals);
    }

    setIsLoading(false);
  }, []);

  const saveEntry = (entry: Omit<JournalEntry, "id" | "timestamp">) => {
    const newEntries = [
      ...entries,
      { ...entry, id: Date.now(), timestamp: new Date().toISOString() },
    ];
    setEntries(newEntries);

    if (saveToLocalStorage(STORAGE_KEYS.JOURNAL_ENTRIES, newEntries)) {
      toast.success("Journal entry saved successfully!");
    }
  };

  const updateEntry = (
    entryId: number,
    updatedEntry: Partial<JournalEntry>
  ) => {
    const newEntries = entries.map((entry) =>
      entry.id === entryId ? { ...entry, ...updatedEntry } : entry
    );
    setEntries(newEntries);
    saveToLocalStorage(STORAGE_KEYS.JOURNAL_ENTRIES, newEntries);
    toast.success("Entry updated successfully!");
  };

  const deleteEntry = (entryId: number) => {
    const newEntries = entries.filter((entry) => entry.id !== entryId);
    setEntries(newEntries);
    saveToLocalStorage(STORAGE_KEYS.JOURNAL_ENTRIES, newEntries);
    toast.success("Entry deleted successfully!");
  };

  const saveGoal = (
    goal: Omit<Goal, "id" | "createdAt" | "progress" | "completed">
  ) => {
    const newGoals = [
      ...goals,
      {
        ...goal,
        id: Date.now(),
        createdAt: new Date().toISOString(),
        progress: 0,
        completed: false,
      },
    ];
    setGoals(newGoals);

    if (saveToLocalStorage(STORAGE_KEYS.GOALS, newGoals)) {
      toast.success("Goal created successfully!");
    }
  };

  const updateGoal = (goalId: number, updatedGoal: Partial<Goal>) => {
    const newGoals = goals.map((goal) =>
      goal.id === goalId ? { ...goal, ...updatedGoal } : goal
    );
    setGoals(newGoals);
    saveToLocalStorage(STORAGE_KEYS.GOALS, newGoals);
    toast.success("Goal updated successfully!");
  };

  const deleteGoal = (goalId: number) => {
    const newGoals = goals.filter((goal) => goal.id !== goalId);
    setGoals(newGoals);
    saveToLocalStorage(STORAGE_KEYS.GOALS, newGoals);
    toast.success("Goal deleted successfully!");
  };

  const handleExportData = () => {
    try {
      const dataString = exportData(entries, goals);
      const blob = new Blob([dataString], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `personal-journal-backup-${
        new Date().toISOString().split("T")[0]
      }.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success("Data exported successfully!");
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to export data.");
    }
  };

  const handleImportData = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = importData(e.target?.result as string);

        if (data) {
          setEntries(data.entries);
          setGoals(data.goals);
          saveToLocalStorage(STORAGE_KEYS.JOURNAL_ENTRIES, data.entries);
          saveToLocalStorage(STORAGE_KEYS.GOALS, data.goals);
          toast.success("Data imported successfully!");
        } else {
          toast.error("Invalid data format. Please check the file.");
        }
      } catch (error) {
        console.error("Import error:", error);
        toast.error("Failed to import data. Please check the file format.");
      }
    };
    reader.readAsText(file);
  };

  const renderContent = () => {
    switch (activeTab) {
      case "journal":
        return (
          <div className="space-y-6">
            <JournalEntry
              onSave={saveEntry}
              onUpdate={updateEntry}
              onDelete={deleteEntry}
              entries={entries}
            />
            <StorageInfo />
          </div>
        );
      case "goals":
        return (
          <div className="space-y-6">
            <GoalTracker
              goals={goals}
              onSave={saveGoal}
              onUpdate={updateGoal}
              onDelete={deleteGoal}
            />
            <StorageInfo />
          </div>
        );
      case "insights":
        return <AIInsights entries={entries} goals={goals} />;
      case "vision":
        return <VisionBoard />;
      case "analytics":
        return <Analytics entries={entries} goals={goals} />;
      default:
        return (
          <div className="space-y-6">
            <JournalEntry
              onSave={saveEntry}
              onUpdate={updateEntry}
              onDelete={deleteEntry}
              entries={entries}
            />
            <StorageInfo />
          </div>
        );
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your journal...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onExport={handleExportData}
        onImport={handleImportData}
        onClear={handleClearLocalStorage}
      />

      <main className="flex-1 overflow-auto">
        <div className="p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome back, Entrepreneur! 🚀
            </h1>
            <p className="text-gray-600">
              Document your journey, track your goals, and let AI enhance your
              vision. All data is stored locally in your browser.
            </p>
          </motion.div>

          {renderContent()}
        </div>
      </main>
    </div>
  );
}
