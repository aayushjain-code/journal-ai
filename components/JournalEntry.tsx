"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import {
  Plus,
  Edit,
  Trash2,
  Heart,
  TrendingUp,
  Target,
  Lightbulb,
  BookOpen,
  X,
} from "lucide-react";
import toast from "react-hot-toast";

interface JournalEntryProps {
  onSave: (entry: any) => void;
  onUpdate?: (entryId: number, updatedEntry: any) => void;
  onDelete?: (entryId: number) => void;
  entries: any[];
}

export default function JournalEntry({
  onSave,
  onUpdate,
  onDelete,
  entries,
}: JournalEntryProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    mood: 5,
    energy: 5,
    category: "general",
    tags: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    const entry = {
      ...formData,
      tags: formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag),
    };

    if (editingEntry) {
      onUpdate?.(editingEntry.id, entry);
      setEditingEntry(null);
    } else {
      onSave(entry);
    }

    setFormData({
      title: "",
      content: "",
      mood: 5,
      energy: 5,
      category: "general",
      tags: "",
    });
    setIsFormOpen(false);
  };

  const handleEdit = (entry: any) => {
    setEditingEntry(entry);
    setFormData({
      title: entry.title,
      content: entry.content,
      mood: entry.mood,
      energy: entry.energy,
      category: entry.category,
      tags: entry.tags ? entry.tags.join(", ") : "",
    });
    setIsFormOpen(true);
  };

  const handleDelete = (entryId: number) => {
    if (
      window.confirm(
        "Are you sure you want to delete this entry? This action cannot be undone."
      )
    ) {
      onDelete?.(entryId);
    }
  };

  const handleCancel = () => {
    setEditingEntry(null);
    setFormData({
      title: "",
      content: "",
      mood: 5,
      energy: 5,
      category: "general",
      tags: "",
    });
    setIsFormOpen(false);
  };

  const getMoodIcon = (mood: number) => {
    if (mood >= 8) return <Heart className="w-5 h-5 text-red-500" />;
    if (mood >= 6) return <TrendingUp className="w-5 h-5 text-green-500" />;
    if (mood >= 4) return <Target className="w-5 h-5 text-yellow-500" />;
    return <Lightbulb className="w-5 h-5 text-blue-500" />;
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      business: "bg-blue-100 text-blue-800",
      personal: "bg-green-100 text-green-800",
      goals: "bg-purple-100 text-purple-800",
      ideas: "bg-orange-100 text-orange-800",
      general: "bg-gray-100 text-gray-800",
    };
    return colors[category] || colors.general;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Daily Journal</h2>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsFormOpen(true)}
          className="btn-primary flex items-center"
        >
          <Plus className="w-5 h-5 mr-2" />
          New Entry
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
              {editingEntry ? "Edit Entry" : "New Entry"}
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
                Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="input-field"
                placeholder="What's on your mind today?"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Content *
              </label>
              <textarea
                value={formData.content}
                onChange={(e) =>
                  setFormData({ ...formData, content: e.target.value })
                }
                className="input-field min-h-[120px] resize-none"
                placeholder="Share your thoughts, experiences, and insights..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
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
                  <option value="general">General</option>
                  <option value="business">Business</option>
                  <option value="personal">Personal</option>
                  <option value="goals">Goals</option>
                  <option value="ideas">Ideas</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags
                </label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) =>
                    setFormData({ ...formData, tags: e.target.value })
                  }
                  className="input-field"
                  placeholder="entrepreneur, goals, ideas"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mood (1-10)
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={formData.mood}
                  onChange={(e) =>
                    setFormData({ ...formData, mood: parseInt(e.target.value) })
                  }
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>😞</span>
                  <span>😊</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Energy Level (1-10)
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={formData.energy}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      energy: parseInt(e.target.value),
                    })
                  }
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>😴</span>
                  <span>⚡</span>
                </div>
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
                {editingEntry ? "Update Entry" : "Save Entry"}
              </button>
            </div>
          </form>
        </motion.div>
      )}

      <div className="space-y-4">
        {entries.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No entries yet
            </h3>
            <p className="text-gray-500">
              Start documenting your journey by creating your first journal
              entry.
            </p>
          </div>
        ) : (
          entries
            .slice()
            .reverse()
            .map((entry, index) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="card hover:shadow-xl transition-shadow duration-300"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {entry.title}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {format(
                        new Date(entry.timestamp),
                        "MMM dd, yyyy - HH:mm"
                      )}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getMoodIcon(entry.mood)}
                    <span className="text-sm text-gray-500">
                      Mood: {entry.mood}/10 | Energy: {entry.energy}/10
                    </span>
                  </div>
                </div>

                <p className="text-gray-700 mb-4 leading-relaxed">
                  {entry.content}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(
                        entry.category
                      )}`}
                    >
                      {entry.category}
                    </span>
                    {entry.tags && entry.tags.length > 0 && (
                      <div className="flex space-x-1">
                        {entry.tags.map((tag: string, tagIndex: number) => (
                          <span
                            key={tagIndex}
                            className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(entry)}
                      className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(entry.id)}
                      className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
        )}
      </div>
    </div>
  );
}
