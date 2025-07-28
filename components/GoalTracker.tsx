"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import {
  Plus,
  Target,
  CheckCircle,
  Circle,
  TrendingUp,
  Calendar,
  Edit,
  Trash2,
  Star,
  X,
} from "lucide-react";
import toast from "react-hot-toast";

interface GoalTrackerProps {
  goals: any[];
  onSave: (goal: any) => void;
  onUpdate?: (goalId: number, updatedGoal: any) => void;
  onDelete?: (goalId: number) => void;
}

export default function GoalTracker({
  goals,
  onSave,
  onUpdate,
  onDelete,
}: GoalTrackerProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "business",
    priority: "medium",
    targetDate: "",
    milestones: [],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.description.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    const goal = {
      ...formData,
    };

    if (editingGoal) {
      onUpdate?.(editingGoal.id, goal);
      setEditingGoal(null);
    } else {
      onSave(goal);
    }

    setFormData({
      title: "",
      description: "",
      category: "business",
      priority: "medium",
      targetDate: "",
      milestones: [],
    });
    setIsFormOpen(false);
  };

  const handleEdit = (goal: any) => {
    setEditingGoal(goal);
    setFormData({
      title: goal.title,
      description: goal.description,
      category: goal.category,
      priority: goal.priority,
      targetDate: goal.targetDate || "",
      milestones: goal.milestones || [],
    });
    setIsFormOpen(true);
  };

  const handleDelete = (goalId: number) => {
    if (
      window.confirm(
        "Are you sure you want to delete this goal? This action cannot be undone."
      )
    ) {
      onDelete?.(goalId);
    }
  };

  const handleCancel = () => {
    setEditingGoal(null);
    setFormData({
      title: "",
      description: "",
      category: "business",
      priority: "medium",
      targetDate: "",
      milestones: [],
    });
    setIsFormOpen(false);
  };

  const toggleGoalCompletion = (goalId: number) => {
    const goal = goals.find((g) => g.id === goalId);
    if (goal) {
      onUpdate?.(goalId, { completed: !goal.completed });
    }
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      high: "bg-red-100 text-red-800",
      medium: "bg-yellow-100 text-yellow-800",
      low: "bg-green-100 text-green-800",
    };
    return colors[priority] || colors.medium;
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      business: "bg-blue-100 text-blue-800",
      personal: "bg-green-100 text-green-800",
      health: "bg-purple-100 text-purple-800",
      financial: "bg-orange-100 text-orange-800",
      learning: "bg-indigo-100 text-indigo-800",
    };
    return colors[category] || colors.business;
  };

  const calculateProgress = (goal: any) => {
    if (!goal.milestones || goal.milestones.length === 0)
      return goal.progress || 0;
    const completed = goal.milestones.filter((m: any) => m.completed).length;
    return Math.round((completed / goal.milestones.length) * 100);
  };

  const getDaysRemaining = (targetDate: string) => {
    const target = new Date(targetDate);
    const today = new Date();
    const diffTime = target.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Goal Tracker</h2>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsFormOpen(true)}
          className="btn-primary flex items-center"
        >
          <Plus className="w-5 h-5 mr-2" />
          New Goal
        </motion.button>
      </div>

      {isFormOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="card"
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              {editingGoal ? "Edit Goal" : "New Goal"}
            </h3>
            <button
              onClick={handleCancel}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Goal Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="input-field"
                placeholder="What do you want to achieve?"
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
                placeholder="Describe your goal in detail..."
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
                  <option value="business">Business</option>
                  <option value="personal">Personal</option>
                  <option value="health">Health</option>
                  <option value="financial">Financial</option>
                  <option value="learning">Learning</option>
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
                  Target Date
                </label>
                <input
                  type="date"
                  value={formData.targetDate}
                  onChange={(e) =>
                    setFormData({ ...formData, targetDate: e.target.value })
                  }
                  className="input-field"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button type="submit" className="btn-primary">
                {editingGoal ? "Update Goal" : "Create Goal"}
              </button>
            </div>
          </form>
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {goals.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <Target className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No goals yet
            </h3>
            <p className="text-gray-500">
              Start setting goals to track your progress and achievements.
            </p>
          </div>
        ) : (
          goals.map((goal, index) => {
            const progress = calculateProgress(goal);
            const daysRemaining = goal.targetDate
              ? getDaysRemaining(goal.targetDate)
              : null;

            return (
              <motion.div
                key={goal.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`card hover:shadow-xl transition-shadow duration-300 ${
                  goal.completed ? "bg-green-50 border-green-200" : ""
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {goal.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      {goal.description}
                    </p>
                  </div>
                  {goal.priority === "high" && (
                    <Star className="w-5 h-5 text-yellow-500" />
                  )}
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(
                        goal.category
                      )}`}
                    >
                      {goal.category}
                    </span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(
                        goal.priority
                      )}`}
                    >
                      {goal.priority}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Progress</span>
                      <span className="font-medium">{progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>

                  {goal.targetDate && (
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="w-4 h-4 mr-1" />
                      <span>
                        {daysRemaining > 0
                          ? `${daysRemaining} days remaining`
                          : daysRemaining < 0
                          ? `${Math.abs(daysRemaining)} days overdue`
                          : "Due today"}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(goal)}
                        className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(goal.id)}
                        className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <button
                      onClick={() => toggleGoalCompletion(goal.id)}
                      className="p-2 text-gray-400 hover:text-green-600 transition-colors"
                    >
                      {goal.completed ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : (
                        <Circle className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}
