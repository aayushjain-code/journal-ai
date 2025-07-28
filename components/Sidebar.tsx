"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  BookOpen,
  Target,
  Brain,
  Eye,
  BarChart3,
  User,
  Download,
  Upload,
  Trash2,
  FileText,
} from "lucide-react";
import toast from "react-hot-toast";

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onExport?: () => void;
  onImport?: () => void;
  onClear?: () => void;
}

export default function Sidebar({
  activeTab,
  onTabChange,
  onExport,
  onImport,
  onClear,
}: SidebarProps) {
  const [showDataManagement, setShowDataManagement] = useState(false);

  const tabs = [
    { id: "journal", label: "Journal", icon: BookOpen },
    { id: "goals", label: "Goals", icon: Target },
    { id: "insights", label: "AI Insights", icon: Brain },
    { id: "vision", label: "Vision Board", icon: Eye },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "coach", label: "Life Coach", icon: User },
  ];

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

  return (
    <div className="w-64 bg-white shadow-lg border-r border-gray-200">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">
          Personal Journal
        </h1>

        <nav className="space-y-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <motion.button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive
                    ? "bg-primary-100 text-primary-700 border border-primary-200"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{tab.label}</span>
              </motion.button>
            );
          })}
        </nav>

        {/* Data Management Section */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <button
            onClick={() => setShowDataManagement(!showDataManagement)}
            className="w-full flex items-center justify-between px-4 py-3 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <FileText className="w-5 h-5" />
              <span className="font-medium">Data Management</span>
            </div>
            <motion.div
              animate={{ rotate: showDataManagement ? 180 : 0 }}
              transition={{ duration: 0.2 }}
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

          <motion.div
            initial={false}
            animate={{
              height: showDataManagement ? "auto" : 0,
              opacity: showDataManagement ? 1 : 0,
            }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="space-y-2 mt-3">
              <button
                onClick={onExport}
                className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Export Data</span>
              </button>

              <button
                onClick={handleImport}
                className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <Upload className="w-4 h-4" />
                <span>Import Data</span>
              </button>

              <button
                onClick={onClear}
                className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                <span>Clear All Data</span>
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
