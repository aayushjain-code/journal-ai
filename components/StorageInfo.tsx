"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Database, HardDrive, FileText, Target, Info } from "lucide-react";
import { getStorageInfo } from "@/utils/storage";

export default function StorageInfo() {
  const [storageInfo, setStorageInfo] = useState<any>(null);

  useEffect(() => {
    const info = getStorageInfo();
    setStorageInfo(info);
  }, []);

  if (!storageInfo) return null;

  const storagePercentage = (storageInfo.totalSize / storageInfo.maxSize) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card bg-gradient-to-r from-blue-50 to-purple-50"
    >
      <div className="flex items-center mb-4">
        <Database className="w-5 h-5 text-blue-600 mr-2" />
        <h3 className="text-lg font-semibold text-gray-900">
          Storage Information
        </h3>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">
            {storageInfo.entriesCount}
          </div>
          <div className="text-sm text-gray-600">Journal Entries</div>
        </div>

        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">
            {storageInfo.goalsCount}
          </div>
          <div className="text-sm text-gray-600">Goals</div>
        </div>

        <div className="text-center">
          <div className="text-2xl font-bold text-purple-600">
            {(storageInfo.totalSize / 1024).toFixed(1)}KB
          </div>
          <div className="text-sm text-gray-600">Used Space</div>
        </div>

        <div className="text-center">
          <div className="text-2xl font-bold text-orange-600">
            {storagePercentage.toFixed(1)}%
          </div>
          <div className="text-sm text-gray-600">Storage Used</div>
        </div>
      </div>

      <div className="mt-4">
        <div className="flex justify-between text-sm text-gray-600 mb-1">
          <span>Storage Usage</span>
          <span>
            {(storageInfo.totalSize / 1024).toFixed(1)}KB /{" "}
            {(storageInfo.maxSize / 1024 / 1024).toFixed(1)}MB
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${Math.min(storagePercentage, 100)}%` }}
          />
        </div>
      </div>

      <div className="mt-4 p-3 bg-blue-100 rounded-lg">
        <div className="flex items-start">
          <Info className="w-4 h-4 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">Local Storage</p>
            <p>
              All your data is stored locally in your browser. This ensures
              privacy and works offline. You can export your data anytime for
              backup.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
