"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  BarChart3,
  TrendingUp,
  Calendar,
  Target,
  Heart,
  Zap,
  Activity,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

interface AnalyticsProps {
  entries: any[];
  goals: any[];
}

export default function Analytics({ entries, goals }: AnalyticsProps) {
  const [timeRange, setTimeRange] = useState("30");
  const [chartData, setChartData] = useState<any>(null);

  useEffect(() => {
    if (entries.length > 0) {
      generateChartData();
    }
  }, [entries, timeRange]);

  const generateChartData = () => {
    const days = parseInt(timeRange);
    const data = [];

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];

      const dayEntries = entries.filter(
        (entry) => entry.timestamp && entry.timestamp.startsWith(dateStr)
      );

      data.push({
        date: date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        mood:
          dayEntries.length > 0
            ? dayEntries.reduce((sum, entry) => sum + entry.mood, 0) /
              dayEntries.length
            : 0,
        energy:
          dayEntries.length > 0
            ? dayEntries.reduce((sum, entry) => sum + entry.energy, 0) /
              dayEntries.length
            : 0,
        entries: dayEntries.length,
      });
    }

    setChartData(data);
  };

  const getCategoryData = () => {
    const categoryCounts = entries.reduce((acc, entry) => {
      acc[entry.category] = (acc[entry.category] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(categoryCounts).map(([category, count]) => ({
      name: category,
      value: count,
    }));
  };

  const getGoalProgressData = () => {
    return goals.map((goal) => ({
      name: goal.title,
      progress: goal.progress || 0,
    }));
  };

  const getMoodDistribution = () => {
    const moodCounts = entries.reduce((acc, entry) => {
      const mood = Math.floor(entry.mood / 2) * 2; // Group into ranges
      acc[mood] = (acc[mood] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(moodCounts).map(([mood, count]) => ({
      name: `${mood}-${parseInt(mood) + 1}`,
      value: count,
    }));
  };

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

  const stats = {
    totalEntries: entries.length,
    avgMood:
      entries.length > 0
        ? (
            entries.reduce((sum, entry) => sum + entry.mood, 0) / entries.length
          ).toFixed(1)
        : 0,
    avgEnergy:
      entries.length > 0
        ? (
            entries.reduce((sum, entry) => sum + entry.energy, 0) /
            entries.length
          ).toFixed(1)
        : 0,
    totalGoals: goals.length,
    completedGoals: goals.filter((goal) => goal.completed).length,
  };

  if (entries.length === 0) {
    return (
      <div className="text-center py-12">
        <BarChart3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No Data for Analytics
        </h3>
        <p className="text-gray-500">
          Start writing journal entries to see your analytics.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">
          Analytics Dashboard
        </h2>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="input-field w-auto"
        >
          <option value="7">Last 7 days</option>
          <option value="30">Last 30 days</option>
          <option value="90">Last 90 days</option>
        </select>
      </div>

      {/* Key Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card"
        >
          <div className="flex items-center">
            <Calendar className="w-8 h-8 text-blue-500 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Total Entries</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.totalEntries}
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card"
        >
          <div className="flex items-center">
            <Heart className="w-8 h-8 text-red-500 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Avg Mood</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.avgMood}/10
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card"
        >
          <div className="flex items-center">
            <Zap className="w-8 h-8 text-yellow-500 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Avg Energy</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.avgEnergy}/10
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card"
        >
          <div className="flex items-center">
            <Target className="w-8 h-8 text-green-500 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Goals Progress</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.completedGoals}/{stats.totalGoals}
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Mood & Energy Trend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="card"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Mood & Energy Trends
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="mood"
                stroke="#ef4444"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="energy"
                stroke="#f59e0b"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Entry Categories */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="card"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Entry Categories
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={getCategoryData()}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {getCategoryData().map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Goal Progress */}
        {goals.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="card"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Goal Progress
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={getGoalProgressData()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="progress" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        )}

        {/* Mood Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="card"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Mood Distribution
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={getMoodDistribution()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Activity Heatmap */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="card"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Activity Heatmap
        </h3>
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: parseInt(timeRange) }, (_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - (parseInt(timeRange) - 1 - i));
            const dateStr = date.toISOString().split("T")[0];
            const dayEntries = entries.filter(
              (entry) => entry.timestamp && entry.timestamp.startsWith(dateStr)
            );
            const intensity =
              dayEntries.length > 0 ? Math.min(dayEntries.length * 2, 10) : 0;

            return (
              <div
                key={i}
                className={`h-8 rounded text-xs flex items-center justify-center ${
                  intensity === 0
                    ? "bg-gray-100"
                    : intensity <= 2
                    ? "bg-green-200"
                    : intensity <= 4
                    ? "bg-green-400"
                    : intensity <= 6
                    ? "bg-green-600"
                    : "bg-green-800 text-white"
                }`}
                title={`${date.toLocaleDateString()}: ${
                  dayEntries.length
                } entries`}
              >
                {dayEntries.length > 0 ? dayEntries.length : ""}
              </div>
            );
          })}
        </div>
        <div className="flex items-center justify-center mt-4 space-x-4 text-sm text-gray-600">
          <span>Less</span>
          <div className="flex space-x-1">
            <div className="w-4 h-4 bg-gray-100 rounded"></div>
            <div className="w-4 h-4 bg-green-200 rounded"></div>
            <div className="w-4 h-4 bg-green-400 rounded"></div>
            <div className="w-4 h-4 bg-green-600 rounded"></div>
            <div className="w-4 h-4 bg-green-800 rounded"></div>
          </div>
          <span>More</span>
        </div>
      </motion.div>
    </div>
  );
}
