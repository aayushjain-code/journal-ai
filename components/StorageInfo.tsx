"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Database, AlertTriangle, CheckCircle, Info } from "lucide-react";
import { getStorageInfo } from "@/utils/storage";

export default function StorageInfo() {
  const [storageInfo, setStorageInfo] = useState<any>(null);

  useEffect(() => {
    const info = getStorageInfo();
    setStorageInfo(info);
  }, []);

  if (!storageInfo) return null;

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getUsageColor = (percentage: number) => {
    if (percentage > 80) return "text-red-600";
    if (percentage > 60) return "text-yellow-600";
    return "text-green-600";
  };

  const getUsageBarColor = (percentage: number) => {
    if (percentage > 80) return "bg-red-500";
    if (percentage > 60) return "bg-yellow-500";
    return "bg-green-500";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Database className="w-5 h-5 text-primary-600" />
          <h3 className="font-semibold text-gray-900">Storage Information</h3>
        </div>
        {storageInfo.isNearLimit ? (
          <AlertTriangle className="w-5 h-5 text-red-500" />
        ) : (
          <CheckCircle className="w-5 h-5 text-green-500" />
        )}
      </div>

      <div className="space-y-4">
        {/* Storage Usage */}
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-600">Storage Usage</span>
            <span
              className={`font-medium ${getUsageColor(
                storageInfo.usagePercentage
              )}`}
            >
              {storageInfo.usagePercentage}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${getUsageBarColor(
                storageInfo.usagePercentage
              )}`}
              style={{
                width: `${Math.min(storageInfo.usagePercentage, 100)}%`,
              }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>{formatBytes(storageInfo.totalSize)} used</span>
            <span>{formatBytes(storageInfo.maxSize)} total</span>
          </div>
        </div>

        {/* Data Counts */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="font-medium text-gray-900">
              {storageInfo.entriesCount}
            </div>
            <div className="text-gray-600">Journal Entries</div>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="font-medium text-gray-900">
              {storageInfo.goalsCount}
            </div>
            <div className="text-gray-600">Goals</div>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="font-medium text-gray-900">
              {storageInfo.healthDataCount}
            </div>
            <div className="text-gray-600">Health Records</div>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="font-medium text-gray-900">
              {storageInfo.financeDataCount}
            </div>
            <div className="text-gray-600">Finance Records</div>
          </div>
        </div>

        {/* Storage Type */}
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Info className="w-4 h-4" />
          <span>{storageInfo.storageType}</span>
        </div>

        {/* Warning for near limit */}
        {storageInfo.isNearLimit && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-red-500" />
              <span className="text-sm font-medium text-red-800">
                Storage nearly full
              </span>
            </div>
            <p className="text-xs text-red-700 mt-1">
              Consider exporting your data or clearing old entries to free up
              space.
            </p>
          </div>
        )}

        {/* Storage Tips */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="flex items-center space-x-2 mb-2">
            <Info className="w-4 h-4 text-blue-500" />
            <span className="text-sm font-medium text-blue-800">
              Storage Tips
            </span>
          </div>
          <ul className="text-xs text-blue-700 space-y-1">
            <li>• Data is compressed to save space</li>
            <li>• Export regularly to backup your data</li>
            <li>• Clear old entries to free up space</li>
            <li>• IndexedDB provides additional storage when available</li>
          </ul>
        </div>
      </div>
    </motion.div>
  );
}
