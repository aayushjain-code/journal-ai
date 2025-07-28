"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Plus,
  Target,
  Heart,
  TrendingUp,
  Star,
  Edit,
  Trash2,
  Image as ImageIcon,
} from "lucide-react";
import toast from "react-hot-toast";

export default function VisionBoard() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [visions, setVisions] = useState([
    {
      id: 1,
      title: "Build a Successful Tech Company",
      description: "Create innovative solutions that impact millions of people",
      category: "business",
      priority: "high",
      image: null,
      timeline: "5 years",
    },
    {
      id: 2,
      title: "Achieve Financial Freedom",
      description: "Generate passive income streams and build wealth",
      category: "financial",
      priority: "high",
      image: null,
      timeline: "10 years",
    },
    {
      id: 3,
      title: "Maintain Work-Life Balance",
      description: "Spend quality time with family while pursuing career goals",
      category: "personal",
      priority: "medium",
      image: null,
      timeline: "Ongoing",
    },
  ]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "business",
    priority: "medium",
    timeline: "",
    image: null,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.description.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    const vision = {
      ...formData,
      id: Date.now(),
      createdAt: new Date().toISOString(),
    };

    setVisions([...visions, vision]);
    setFormData({
      title: "",
      description: "",
      category: "business",
      priority: "medium",
      timeline: "",
      image: null,
    });
    setIsFormOpen(false);
    toast.success("Vision added to your board!");
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      business: "bg-blue-100 text-blue-800 border-blue-200",
      personal: "bg-green-100 text-green-800 border-green-200",
      financial: "bg-purple-100 text-purple-800 border-purple-200",
      health: "bg-red-100 text-red-800 border-red-200",
      learning: "bg-orange-100 text-orange-800 border-orange-200",
    };
    return colors[category] || colors.business;
  };

  const getPriorityIcon = (priority: string) => {
    if (priority === "high")
      return <Star className="w-5 h-5 text-yellow-500" />;
    if (priority === "medium")
      return <Target className="w-5 h-5 text-blue-500" />;
    return <Heart className="w-5 h-5 text-green-500" />;
  };

  const categories = [
    { id: "business", label: "Business", icon: TrendingUp },
    { id: "personal", label: "Personal", icon: Heart },
    { id: "financial", label: "Financial", icon: Target },
    { id: "health", label: "Health", icon: Heart },
    { id: "learning", label: "Learning", icon: TrendingUp },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Vision Board</h2>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsFormOpen(true)}
          className="btn-primary flex items-center"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Vision
        </motion.button>
      </div>

      {isFormOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="card"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Vision Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="input-field"
                placeholder="What's your big vision?"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="input-field min-h-[100px] resize-none"
                placeholder="Describe your vision in detail..."
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  className="input-field"
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Priority
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) =>
                    setFormData({ ...formData, priority: e.target.value })
                  }
                  className="input-field"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Timeline
                </label>
                <input
                  type="text"
                  value={formData.timeline}
                  onChange={(e) =>
                    setFormData({ ...formData, timeline: e.target.value })
                  }
                  className="input-field"
                  placeholder="e.g., 5 years"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button type="submit" className="btn-primary">
                Add Vision
              </button>
            </div>
          </form>
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {visions.map((vision, index) => (
          <motion.div
            key={vision.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="card hover:shadow-xl transition-shadow duration-300 border-2 border-gray-100"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {vision.title}
                </h3>
                <p className="text-sm text-gray-600 mb-3">
                  {vision.description}
                </p>
              </div>
              {getPriorityIcon(vision.priority)}
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium border ${getCategoryColor(
                    vision.category
                  )}`}
                >
                  {vision.category}
                </span>
                <span className="text-sm text-gray-500">{vision.timeline}</span>
              </div>

              {vision.image ? (
                <div className="w-full h-32 bg-gray-100 rounded-lg flex items-center justify-center">
                  <ImageIcon className="w-8 h-8 text-gray-400" />
                </div>
              ) : (
                <div className="w-full h-32 bg-gradient-to-br from-primary-50 to-secondary-50 rounded-lg flex items-center justify-center">
                  <ImageIcon className="w-8 h-8 text-primary-400" />
                </div>
              )}

              <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                <div className="flex space-x-2">
                  <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-red-600 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <button className="p-2 text-gray-400 hover:text-primary-600 transition-colors">
                  <ImageIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Vision Board Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="card bg-gradient-to-r from-primary-50 to-secondary-50"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Vision Summary
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary-600">
              {visions.length}
            </div>
            <div className="text-sm text-gray-600">Total Visions</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {visions.filter((v) => v.priority === "high").length}
            </div>
            <div className="text-sm text-gray-600">High Priority</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {visions.filter((v) => v.category === "business").length}
            </div>
            <div className="text-sm text-gray-600">Business Goals</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {visions.filter((v) => v.category === "personal").length}
            </div>
            <div className="text-sm text-gray-600">Personal Goals</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
