"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  BarChart3,
  TrendingUp,
  Target,
  Calendar,
  Activity,
  Zap,
  Heart,
  Clock,
  Award,
  TrendingDown,
  AlertCircle,
  CheckCircle,
  Star,
  Users,
  Lightbulb,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";

interface JournalEntry {
  id: number;
  title: string;
  content: string;
  mood: number;
  energy: number;
  category: string;
  tags: string[];
  timestamp: string;
}

interface Goal {
  id: number;
  title: string;
  description: string;
  category: string;
  priority: string;
  targetDate?: string;
  progress: number;
  completed: boolean;
  createdAt: string;
}

interface AnalyticsProps {
  entries: JournalEntry[];
  goals: Goal[];
}

interface LifeMetrics {
  overallHappiness: number;
  productivityScore: number;
  consistencyScore: number;
  growthRate: number;
  stressLevel: number;
  workLifeBalance: number;
}

export default function Analytics({ entries, goals }: AnalyticsProps) {
  const [metrics, setMetrics] = useState<LifeMetrics | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState("week");

  useEffect(() => {
    if (entries.length > 0 || goals.length > 0) {
      calculateMetrics();
    }
  }, [entries, goals, selectedPeriod]);

  const calculateMetrics = () => {
    if (entries.length === 0 && goals.length === 0) {
      setMetrics(null);
      return;
    }

    // Calculate overall happiness (average mood)
    const avgMood =
      entries.length > 0
        ? entries.reduce((sum, e) => sum + e.mood, 0) / entries.length
        : 5;

    // Calculate productivity score
    const completedGoals = goals.filter((g) => g.completed).length;
    const totalGoals = goals.length;
    const goalCompletionRate =
      totalGoals > 0 ? (completedGoals / totalGoals) * 100 : 0;
    const avgEnergy =
      entries.length > 0
        ? entries.reduce((sum, e) => sum + e.energy, 0) / entries.length
        : 5;
    const productivityScore = Math.round(
      (goalCompletionRate + avgEnergy * 10) / 2
    );

    // Calculate consistency score
    const recentEntries = entries.slice(-7);
    const consistencyScore =
      recentEntries.length >= 5 ? 85 : recentEntries.length >= 3 ? 60 : 30;

    // Calculate growth rate
    const recentMoods = entries.slice(-5).map((e) => e.mood);
    const growthRate =
      recentMoods.length >= 2
        ? ((recentMoods[recentMoods.length - 1] - recentMoods[0]) /
            recentMoods[0]) *
          100
        : 0;

    // Calculate stress level (inverse of energy and mood)
    const stressLevel = Math.max(0, 100 - (avgMood + avgEnergy) * 5);

    // Calculate work-life balance
    const businessEntries = entries.filter(
      (e) => e.category === "business"
    ).length;
    const personalEntries = entries.filter(
      (e) => e.category === "personal"
    ).length;
    const totalEntries = entries.length;
    const workLifeBalance =
      totalEntries > 0
        ? Math.abs(50 - (businessEntries / totalEntries) * 100)
        : 50;

    setMetrics({
      overallHappiness: Math.round(avgMood * 10),
      productivityScore,
      consistencyScore,
      growthRate: Math.round(growthRate),
      stressLevel: Math.round(stressLevel),
      workLifeBalance: Math.round(workLifeBalance),
    });
  };

  const getMoodData = () => {
    const recentEntries = entries.slice(-7);
    return recentEntries.map((entry, index) => ({
      day: new Date(entry.timestamp).toLocaleDateString("en-US", {
        weekday: "short",
      }),
      mood: entry.mood,
      energy: entry.energy,
      date: new Date(entry.timestamp).toLocaleDateString(),
    }));
  };

  const getCategoryData = () => {
    const categoryCounts: Record<string, number> = {};
    entries.forEach((entry) => {
      categoryCounts[entry.category] =
        (categoryCounts[entry.category] || 0) + 1;
    });

    return Object.entries(categoryCounts).map(([category, count]) => ({
      name: category,
      value: count,
      color: getCategoryColor(category),
    }));
  };

  const getGoalProgressData = () => {
    const categoryProgress: Record<
      string,
      { completed: number; total: number }
    > = {};
    goals.forEach((goal) => {
      if (!categoryProgress[goal.category]) {
        categoryProgress[goal.category] = { completed: 0, total: 0 };
      }
      categoryProgress[goal.category].total++;
      if (goal.completed) {
        categoryProgress[goal.category].completed++;
      }
    });

    return Object.entries(categoryProgress).map(([category, data]) => ({
      category,
      progress: data.total > 0 ? (data.completed / data.total) * 100 : 0,
      completed: data.completed,
      total: data.total,
    }));
  };

  const getMoodDistribution = () => {
    const distribution = { low: 0, medium: 0, high: 0 };
    entries.forEach((entry) => {
      if (entry.mood <= 3) distribution.low++;
      else if (entry.mood <= 7) distribution.medium++;
      else distribution.high++;
    });

    return [
      { name: "Low (1-3)", value: distribution.low, color: "#ef4444" },
      { name: "Medium (4-7)", value: distribution.medium, color: "#f59e0b" },
      { name: "High (8-10)", value: distribution.high, color: "#10b981" },
    ];
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      business: "#3b82f6",
      personal: "#10b981",
      goals: "#8b5cf6",
      ideas: "#f59e0b",
      general: "#6b7280",
    };
    return colors[category] || colors.general;
  };

  const getMetricStatus = (value: number, type: string) => {
    if (type === "stress") {
      return value < 30 ? "excellent" : value < 60 ? "good" : "needs_attention";
    }
    return value >= 80 ? "excellent" : value >= 60 ? "good" : "needs_attention";
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "excellent":
        return <Star className="w-5 h-5 text-green-500" />;
      case "good":
        return <CheckCircle className="w-5 h-5 text-blue-500" />;
      case "needs_attention":
        return <AlertCircle className="w-5 h-5 text-orange-500" />;
      default:
        return <Activity className="w-5 h-5 text-gray-500" />;
    }
  };

  const getImprovementSuggestions = () => {
    if (!metrics) return [];

    const suggestions = [];

    if (metrics.overallHappiness < 70) {
      suggestions.push("Practice gratitude journaling daily");
      suggestions.push("Schedule activities that bring you joy");
      suggestions.push("Consider meditation or mindfulness exercises");
    }

    if (metrics.productivityScore < 60) {
      suggestions.push("Break down large tasks into smaller, manageable steps");
      suggestions.push("Set specific, measurable deadlines for your goals");
      suggestions.push("Celebrate small wins to maintain motivation");
    }

    if (metrics.consistencyScore < 50) {
      suggestions.push("Establish a daily journaling routine");
      suggestions.push("Set reminders to check in with yourself");
      suggestions.push("Make journaling a non-negotiable part of your day");
    }

    if (metrics.stressLevel > 60) {
      suggestions.push(
        "Practice stress-reduction techniques like deep breathing"
      );
      suggestions.push("Ensure adequate sleep and rest periods");
      suggestions.push("Consider professional support if stress persists");
    }

    if (metrics.workLifeBalance > 70) {
      suggestions.push(
        "Strive for better balance between work and personal life"
      );
      suggestions.push("Schedule dedicated personal time");
      suggestions.push("Set boundaries between work and personal activities");
    }

    return suggestions;
  };

  if (entries.length === 0 && goals.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-3">
          <BarChart3 className="w-8 h-8 text-primary-600" />
          <h2 className="text-2xl font-bold text-gray-900">Life Analytics</h2>
        </div>

        <div className="card text-center py-12">
          <BarChart3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No Data to Analyze
          </h3>
          <p className="text-gray-500">
            Start journaling and setting goals to see detailed analytics.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <BarChart3 className="w-8 h-8 text-primary-600" />
          <h2 className="text-2xl font-bold text-gray-900">Life Analytics</h2>
        </div>

        <div className="flex space-x-2">
          {["week", "month", "all"].map((period) => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                selectedPeriod === period
                  ? "bg-primary-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {period.charAt(0).toUpperCase() + period.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Key Life Metrics */}
      {metrics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Heart className="w-6 h-6 text-red-500" />
                <h3 className="font-semibold text-gray-900">Happiness Score</h3>
              </div>
              {getStatusIcon(
                getMetricStatus(metrics.overallHappiness, "happiness")
              )}
            </div>
            <div className="text-3xl font-bold text-primary-600 mb-2">
              {metrics.overallHappiness}/100
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${metrics.overallHappiness}%` }}
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Target className="w-6 h-6 text-green-500" />
                <h3 className="font-semibold text-gray-900">Productivity</h3>
              </div>
              {getStatusIcon(
                getMetricStatus(metrics.productivityScore, "productivity")
              )}
            </div>
            <div className="text-3xl font-bold text-primary-600 mb-2">
              {metrics.productivityScore}/100
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${metrics.productivityScore}%` }}
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Clock className="w-6 h-6 text-blue-500" />
                <h3 className="font-semibold text-gray-900">Consistency</h3>
              </div>
              {getStatusIcon(
                getMetricStatus(metrics.consistencyScore, "consistency")
              )}
            </div>
            <div className="text-3xl font-bold text-primary-600 mb-2">
              {metrics.consistencyScore}/100
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${metrics.consistencyScore}%` }}
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="card"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-6 h-6 text-purple-500" />
                <h3 className="font-semibold text-gray-900">Growth Rate</h3>
              </div>
              {metrics.growthRate > 0 ? (
                <TrendingUp className="w-5 h-5 text-green-500" />
              ) : (
                <TrendingDown className="w-5 h-5 text-red-500" />
              )}
            </div>
            <div className="text-3xl font-bold text-primary-600 mb-2">
              {metrics.growthRate > 0 ? "+" : ""}
              {metrics.growthRate}%
            </div>
            <p className="text-sm text-gray-500">
              {metrics.growthRate > 0
                ? "Improving"
                : metrics.growthRate < 0
                ? "Declining"
                : "Stable"}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="card"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-6 h-6 text-orange-500" />
                <h3 className="font-semibold text-gray-900">Stress Level</h3>
              </div>
              {getStatusIcon(getMetricStatus(metrics.stressLevel, "stress"))}
            </div>
            <div className="text-3xl font-bold text-primary-600 mb-2">
              {metrics.stressLevel}/100
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${metrics.stressLevel}%` }}
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="card"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Users className="w-6 h-6 text-indigo-500" />
                <h3 className="font-semibold text-gray-900">
                  Work-Life Balance
                </h3>
              </div>
              {getStatusIcon(
                getMetricStatus(100 - metrics.workLifeBalance, "balance")
              )}
            </div>
            <div className="text-3xl font-bold text-primary-600 mb-2">
              {Math.round(100 - metrics.workLifeBalance)}/100
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-indigo-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${100 - metrics.workLifeBalance}%` }}
              />
            </div>
          </motion.div>
        </div>
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Mood & Energy Trends */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="card"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Mood & Energy Trends
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={getMoodData()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis domain={[0, 10]} />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="mood"
                stroke="#3b82f6"
                fill="#3b82f6"
                fillOpacity={0.3}
              />
              <Area
                type="monotone"
                dataKey="energy"
                stroke="#10b981"
                fill="#10b981"
                fillOpacity={0.3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Entry Categories */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
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
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Goal Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="card"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Goal Progress by Category
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={getGoalProgressData()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Bar dataKey="progress" fill="#8b5cf6" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Mood Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="card"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Mood Distribution
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={getMoodDistribution()}
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
                {getMoodDistribution().map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Improvement Suggestions */}
      {metrics && getImprovementSuggestions().length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="card"
        >
          <div className="flex items-center space-x-3 mb-4">
            <Lightbulb className="w-6 h-6 text-yellow-500" />
            <h3 className="text-lg font-semibold text-gray-900">
              Life Improvement Suggestions
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {getImprovementSuggestions().map((suggestion, index) => (
              <div
                key={index}
                className="flex items-start space-x-3 p-3 bg-primary-50 rounded-lg"
              >
                <CheckCircle className="w-5 h-5 text-primary-600 mt-0.5" />
                <p className="text-sm text-gray-700">{suggestion}</p>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
