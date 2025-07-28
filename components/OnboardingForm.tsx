"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { User, ArrowRight, Save } from "lucide-react";
import toast from "react-hot-toast";

interface OnboardingData {
  name: string;
  age: number;
  occupation: string;
}

interface OnboardingFormProps {
  onComplete: (data: OnboardingData) => void;
  onSkip: () => void;
}

export default function OnboardingForm({
  onComplete,
  onSkip,
}: OnboardingFormProps) {
  const [formData, setFormData] = useState<OnboardingData>({
    name: "",
    age: 0,
    occupation: "",
  });

  const updateFormData = (field: keyof OnboardingData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleComplete = () => {
    if (!formData.name.trim()) {
      toast.error("Please provide your name to continue");
      return;
    }
    onComplete(formData);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="p-3 bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Welcome to Your AI Personal Journal
          </h1>
          <p className="text-gray-600">
            Let's get to know you better to provide personalized insights
          </p>
        </div>

        {/* Form */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => updateFormData("name", e.target.value)}
              className="input-field"
              placeholder="Enter your full name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Age
            </label>
            <input
              type="number"
              value={formData.age || ""}
              onChange={(e) =>
                updateFormData("age", parseInt(e.target.value) || 0)
              }
              className="input-field"
              placeholder="Your age"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Occupation
            </label>
            <input
              type="text"
              value={formData.occupation}
              onChange={(e) => updateFormData("occupation", e.target.value)}
              className="input-field"
              placeholder="What do you do?"
            />
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <button onClick={onSkip} className="btn-secondary">
            Skip
          </button>

          <button
            onClick={handleComplete}
            className="btn-primary flex items-center"
          >
            <Save className="w-4 h-4 mr-2" />
            Complete Setup
          </button>
        </div>
      </motion.div>
    </div>
  );
}
