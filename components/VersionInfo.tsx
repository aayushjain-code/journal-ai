"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Info, X, CheckCircle } from "lucide-react";
import { getVersionInfo } from "@/utils/version";

export default function VersionInfo() {
  const [showDetails, setShowDetails] = useState(false);
  const versionInfo = getVersionInfo();

  return (
    <>
      {/* Version Badge */}
      <div
        className="fixed bottom-4 right-4 bg-gray-800 text-white px-3 py-1 rounded-full text-xs font-medium shadow-lg z-50 hover:bg-gray-700 transition-colors cursor-pointer flex items-center space-x-1"
        onClick={() => setShowDetails(true)}
        title="Click for version info"
      >
        <Info className="w-3 h-3" />
        <span>v{versionInfo.version}</span>
      </div>

      {/* Version Details Modal */}
      <AnimatePresence>
        {showDetails && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowDetails(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Version Information
                </h3>
                <button
                  onClick={() => setShowDetails(false)}
                  className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Version:</span>
                    <span className="font-medium ml-2">
                      v{versionInfo.version}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Build Date:</span>
                    <span className="font-medium ml-2">
                      {versionInfo.buildDate}
                    </span>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">
                    Features Included:
                  </h4>
                  <div className="space-y-2">
                    {versionInfo.features.map((feature, index) => (
                      <div
                        key={index}
                        className="flex items-center space-x-2 text-sm"
                      >
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <p className="text-xs text-gray-500 text-center">
                    AI-enhanced personal journal for entrepreneurs
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
