"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  Target,
  Brain,
  Eye,
  BarChart3,
  User,
  Activity,
  DollarSign,
  Download,
  Upload,
  Trash2,
  X,
  Menu,
  ChevronLeft,
  ChevronRight,
  Settings,
} from "lucide-react";
import toast from "react-hot-toast";

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onExport?: () => void;
  onImport?: () => void;
  onClear?: () => void;
  isOpen: boolean;
  onToggle: () => void;
}

const tabs = [
  { id: "journal", label: "Journal", icon: BookOpen },
  { id: "goals", label: "Goals", icon: Target },
  { id: "insights", label: "AI Insights", icon: Brain },
  { id: "vision", label: "Vision Board", icon: Eye },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "coach", label: "Life Coach", icon: User },
  { id: "health", label: "Health & Fitness", icon: Activity },
  { id: "finance", label: "Finance", icon: DollarSign },
  { id: "profile", label: "Profile", icon: Settings },
];

export default function Sidebar({
  activeTab,
  onTabChange,
  onExport,
  onImport,
  onClear,
  isOpen,
  onToggle,
}: SidebarProps) {
  const [showDataManagement, setShowDataManagement] = useState(false);

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
            const data = JSON.parse(e.target?.result as string);
            onImport?.();
            toast.success("Data imported successfully!");
          } catch (error) {
            toast.error("Invalid file format");
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const handleClearData = () => {
    if (
      window.confirm(
        "Are you sure you want to clear all data? This action cannot be undone."
      )
    ) {
      onClear?.();
      toast.success("All data cleared successfully!");
    }
  };

  return (
    <>
      {/* Toggle Button - Always Visible */}
      <button
        onClick={onToggle}
        className="fixed top-4 left-4 z-[9999] bg-white p-2.5 rounded-lg shadow-md border border-gray-200 hover:bg-gray-50 hover:shadow-lg transition-all duration-200 transform hover:scale-105"
        title={isOpen ? "Close Sidebar" : "Open Sidebar"}
        style={{ zIndex: 9999 }}
      >
        {isOpen ? (
          <ChevronLeft className="w-5 h-5 text-gray-700" />
        ) : (
          <ChevronRight className="w-5 h-5 text-gray-700" />
        )}
      </button>

      {/* Overlay for mobile */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={onToggle}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: isOpen ? 320 : 80 }}
        transition={{ type: "spring", damping: 20, stiffness: 100 }}
        className="fixed lg:relative lg:translate-x-0 inset-y-0 left-0 z-50 bg-white border-r border-gray-200 shadow-lg lg:shadow-none overflow-hidden"
      >
        <div className="flex flex-col h-full">
          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  onTabChange(tab.id);
                  // Close sidebar on mobile after navigation
                  if (window.innerWidth < 1024) {
                    onToggle();
                  }
                }}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  activeTab === tab.id
                    ? "bg-primary-100 text-primary-700 border border-primary-200"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
                title={isOpen ? tab.label : tab.label}
              >
                <tab.icon className="w-5 h-5 flex-shrink-0" />
                <span
                  className={`font-medium transition-opacity duration-200 ${
                    isOpen ? "opacity-100" : "opacity-0"
                  }`}
                >
                  {tab.label}
                </span>
              </button>
            ))}
          </nav>

          {/* Data Management */}
          <div className="p-4 border-t border-gray-200">
            <button
              onClick={() => setShowDataManagement(!showDataManagement)}
              className="w-full flex items-center justify-between px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              title={isOpen ? "Data Management" : "Data Management"}
            >
              <span
                className={`font-medium transition-opacity duration-200 ${
                  isOpen ? "opacity-100" : "opacity-0"
                }`}
              >
                Data Management
              </span>
              <motion.div
                animate={{ rotate: showDataManagement ? 180 : 0 }}
                transition={{ duration: 0.2 }}
                className={`transition-opacity duration-200 ${
                  isOpen ? "opacity-100" : "opacity-0"
                }`}
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </motion.div>
            </button>

            <AnimatePresence>
              {showDataManagement && isOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-2 space-y-2"
                >
                  <button
                    onClick={onExport}
                    className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    <span>Export Data</span>
                  </button>
                  <button
                    onClick={handleImport}
                    className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Import Data</span>
                  </button>
                  <button
                    onClick={handleClearData}
                    className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Clear All Data</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.aside>
    </>
  );
}
