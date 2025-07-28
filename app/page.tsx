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
import LifeCoach from "@/components/LifeCoach";
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
import HealthFitness from "@/components/HealthFitness";
import Finance from "@/components/Finance";
import OnboardingForm from "@/components/OnboardingForm";
import ProfilePage from "@/components/ProfilePage";

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
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

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
    const onboardingCompleted = localStorage.getItem("onboardingCompleted");

    if (savedEntries && Array.isArray(savedEntries)) {
      setEntries(savedEntries);
    }
    if (savedGoals && Array.isArray(savedGoals)) {
      setGoals(savedGoals);
    }

    // Check if onboarding is completed
    if (!onboardingCompleted) {
      setShowOnboarding(true);
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

  const handleImport = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const jsonString = e.target?.result as string;
            const importedData = importData(jsonString);
            if (importedData) {
              setEntries(importedData.entries);
              setGoals(importedData.goals);
              saveToLocalStorage(
                STORAGE_KEYS.JOURNAL_ENTRIES,
                importedData.entries
              );
              saveToLocalStorage(STORAGE_KEYS.GOALS, importedData.goals);
              toast.success("Data imported successfully!");
            } else {
              toast.error("Invalid file format");
            }
          } catch (error) {
            console.error("Import error:", error);
            toast.error("Failed to import data");
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const handleOnboardingComplete = (data: any) => {
    localStorage.setItem("onboardingData", JSON.stringify(data));
    localStorage.setItem("onboardingCompleted", "true");
    setShowOnboarding(false);
    toast.success("Welcome! Your personalized journal is ready.");
  };

  const handleOnboardingSkip = () => {
    localStorage.setItem("onboardingCompleted", "true");
    setShowOnboarding(false);
    toast.success("You can always complete onboarding later from settings.");
  };

  const renderContent = () => {
    switch (activeTab) {
      case "journal":
        return (
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Welcome back! 🚀
              </h1>
              <p className="text-gray-600">
                Ready to document your journey and track your progress?
              </p>
            </motion.div>
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
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Goal Tracker 🎯
              </h1>
              <p className="text-gray-600">
                Set, track, and achieve your goals with smart progress
                monitoring.
              </p>
            </motion.div>
            <GoalTracker
              onSave={saveGoal}
              onUpdate={updateGoal}
              onDelete={deleteGoal}
              goals={goals}
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
      case "coach":
        return <LifeCoach entries={entries} goals={goals} />;
      case "health":
        return <HealthFitness entries={entries} goals={goals} />;
      case "finance":
        return <Finance entries={entries} goals={goals} />;
      case "profile":
        return <ProfilePage onBack={() => setActiveTab("journal")} />;
      default:
        return <div>Page not found</div>;
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your journal...</p>
        </div>
      </div>
    );
  }

  if (showOnboarding) {
    return (
      <OnboardingForm
        onComplete={handleOnboardingComplete}
        onSkip={handleOnboardingSkip}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <Sidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onExport={handleExportData}
          onImport={handleImport}
          onClear={handleClearLocalStorage}
          isOpen={sidebarOpen}
          onToggle={toggleSidebar}
        />

        <main className="flex-1 p-6">{renderContent()}</main>
      </div>
    </div>
  );
}
