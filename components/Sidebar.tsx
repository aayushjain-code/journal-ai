"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import {
  BookOpen,
  Target,
  TrendingUp,
  Lightbulb,
  BarChart3,
  Settings,
  Download,
  Upload,
  Trash2,
  Database,
} from "lucide-react";
import toast from "react-hot-toast";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onExport?: () => void;
  onImport?: (file: File) => void;
  onClear?: () => void;
}

const menuItems = [
  { id: "journal", label: "Journal", icon: BookOpen, color: "text-blue-600" },
  { id: "goals", label: "Goals", icon: Target, color: "text-green-600" },
  {
    id: "insights",
    label: "AI Insights",
    icon: Lightbulb,
    color: "text-purple-600",
  },
  {
    id: "vision",
    label: "Vision Board",
    icon: TrendingUp,
    color: "text-orange-600",
  },
  {
    id: "analytics",
    label: "Analytics",
    icon: BarChart3,
    color: "text-red-600",
  },
];

export default function Sidebar({
  activeTab,
  setActiveTab,
  onExport,
  onImport,
  onClear,
}: SidebarProps) {
  const [showDataMenu, setShowDataMenu] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImport = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && onImport) {
      onImport(file);
    }
    // Reset the input
    event.target.value = "";
  };

  const handleClearData = () => {
    if (
      window.confirm(
        "Are you sure you want to clear all data? This action cannot be undone."
      )
    ) {
      onClear?.();
    }
  };

  return (
    <motion.div
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-64 bg-white shadow-lg border-r border-gray-200"
    >
      <div className="p-6">
        <div className="flex items-center mb-8">
          <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <h2 className="ml-3 text-xl font-bold text-gray-900">Life Journal</h2>
        </div>

        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <motion.button
                key={item.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive
                    ? "bg-primary-50 text-primary-700 border-r-2 border-primary-500"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <Icon
                  className={`w-5 h-5 mr-3 ${
                    isActive ? item.color : "text-gray-400"
                  }`}
                />
                <span className="font-medium">{item.label}</span>
              </motion.button>
            );
          })}
        </nav>

        <div className="mt-8 pt-6 border-t border-gray-200">
          {/* Data Management Section */}
          <div className="space-y-2">
            <button
              onClick={() => setShowDataMenu(!showDataMenu)}
              className="w-full flex items-center px-4 py-3 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-all duration-200"
            >
              <Database className="w-5 h-5 mr-3 text-gray-400" />
              <span className="font-medium">Data Management</span>
            </button>

            {showDataMenu && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="ml-4 space-y-1"
              >
                <button
                  onClick={onExport}
                  className="w-full flex items-center px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-all duration-200"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export Data
                </button>

                <button
                  onClick={handleImport}
                  className="w-full flex items-center px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-all duration-200"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Import Data
                </button>

                <button
                  onClick={handleClearData}
                  className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 rounded-lg transition-all duration-200"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Clear All Data
                </button>
              </motion.div>
            )}
          </div>

          {/* Hidden file input for import */}
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleFileSelect}
            className="hidden"
          />

          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="text-xs text-gray-500 text-center">
              <p>All data stored locally</p>
              <p>in your browser</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
