"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Monitor,
  HardDrive,
  Shield,
  Zap,
  FileText,
  Download,
  Upload,
  Settings,
  Info,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import {
  isElectron,
  enhancedStorage,
  StorageStats,
} from "@/utils/desktopStorage";

export default function DesktopFeatures() {
  const [isDesktop, setIsDesktop] = useState(false);
  const [storageStats, setStorageStats] = useState<StorageStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkDesktop = async () => {
      const desktop = Boolean(isElectron());
      setIsDesktop(desktop);

      if (desktop) {
        try {
          const stats = await enhancedStorage.getStorageStats();
          setStorageStats(stats);
        } catch (error) {
          console.error("Error getting storage stats:", error);
        }
      }

      setLoading(false);
    };

    checkDesktop();
  }, []);

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getStorageIcon = (type: string) => {
    switch (type) {
      case "desktop":
        return <HardDrive className="w-6 h-6 text-green-500" />;
      case "browser":
        return <Monitor className="w-6 h-6 text-blue-500" />;
      default:
        return <Info className="w-6 h-6 text-gray-500" />;
    }
  };

  if (loading) {
    return (
      <div className="card text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Checking system capabilities...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Desktop Status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            {isDesktop ? (
              <CheckCircle className="w-6 h-6 text-green-500" />
            ) : (
              <AlertCircle className="w-6 h-6 text-blue-500" />
            )}
            <h3 className="text-lg font-semibold text-gray-900">
              {isDesktop ? "Desktop Application" : "Web Application"}
            </h3>
          </div>
          <div className="flex items-center space-x-2">
            {getStorageIcon(storageStats?.storageType || "browser")}
            <span className="text-sm font-medium text-gray-600">
              {storageStats?.storageType === "desktop"
                ? "File System"
                : "Browser Storage"}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Shield className="w-5 h-5 text-green-500" />
              <span className="font-medium text-gray-900">Privacy</span>
            </div>
            <p className="text-sm text-gray-600">
              {isDesktop
                ? "All data stored locally on your computer"
                : "All data stored in your browser"}
            </p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Zap className="w-5 h-5 text-yellow-500" />
              <span className="font-medium text-gray-900">Performance</span>
            </div>
            <p className="text-sm text-gray-600">
              {isDesktop
                ? "Native performance with unlimited storage"
                : "Fast web performance with enhanced storage"}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Desktop Features */}
      {isDesktop && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card"
        >
          <div className="flex items-center space-x-3 mb-4">
            <Monitor className="w-6 h-6 text-primary-600" />
            <h3 className="text-lg font-semibold text-gray-900">
              Desktop Features
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
              <HardDrive className="w-5 h-5 text-green-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-gray-900">Unlimited Storage</h4>
                <p className="text-sm text-gray-600">
                  Store unlimited journal entries, goals, and data on your
                  computer
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
              <FileText className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-gray-900">
                  Native File Dialogs
                </h4>
                <p className="text-sm text-gray-600">
                  Use native save/open dialogs for better file management
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-3 bg-purple-50 rounded-lg">
              <Download className="w-5 h-5 text-purple-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-gray-900">Auto-Save</h4>
                <p className="text-sm text-gray-600">
                  Automatic data saving to prevent loss of information
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-3 bg-orange-50 rounded-lg">
              <Settings className="w-5 h-5 text-orange-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-gray-900">
                  System Integration
                </h4>
                <p className="text-sm text-gray-600">
                  Native menu, keyboard shortcuts, and system notifications
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Storage Statistics */}
      {storageStats && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card"
        >
          <div className="flex items-center space-x-3 mb-4">
            <HardDrive className="w-6 h-6 text-primary-600" />
            <h3 className="text-lg font-semibold text-gray-900">
              Storage Statistics
            </h3>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600">
                {storageStats.entriesCount}
              </div>
              <div className="text-sm text-gray-600">Journal Entries</div>
            </div>

            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600">
                {storageStats.goalsCount}
              </div>
              <div className="text-sm text-gray-600">Goals</div>
            </div>

            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600">
                {storageStats.healthDataCount}
              </div>
              <div className="text-sm text-gray-600">Health Records</div>
            </div>

            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600">
                {formatBytes(storageStats.totalSize)}
              </div>
              <div className="text-sm text-gray-600">Total Size</div>
            </div>
          </div>

          {isDesktop && (
            <div className="mt-4 p-3 bg-green-50 rounded-lg">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-sm font-medium text-green-800">
                  Desktop Mode: Unlimited storage capacity available
                </span>
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* Upgrade to Desktop */}
      {!isDesktop && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card border-2 border-dashed border-primary-200 bg-primary-50"
        >
          <div className="text-center">
            <Monitor className="w-12 h-12 text-primary-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Get the Desktop Version
            </h3>
            <p className="text-gray-600 mb-4">
              Download the desktop application for unlimited storage, native
              performance, and enhanced features.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button className="btn-primary flex items-center justify-center">
                <Download className="w-4 h-4 mr-2" />
                Download for macOS
              </button>
              <button className="btn-secondary flex items-center justify-center">
                <Download className="w-4 h-4 mr-2" />
                Download for Windows
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-3">
              Available for macOS, Windows, and Linux
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
}
