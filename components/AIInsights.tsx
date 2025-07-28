"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Brain,
  TrendingUp,
  Target,
  Lightbulb,
  Heart,
  Zap,
  Calendar,
  BarChart3,
  Sparkles,
  Clock,
  AlertCircle,
  CheckCircle,
  ArrowUp,
  ArrowDown,
  Activity,
} from "lucide-react";

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

interface AIInsightsProps {
  entries: JournalEntry[];
  goals: Goal[];
}

interface AnalysisResult {
  moodTrend: "improving" | "declining" | "stable";
  energyPattern: "consistent" | "fluctuating" | "low";
  productivityScore: number;
  goalProgress: number;
  recommendations: string[];
  patterns: string[];
  alerts: string[];
  weeklyInsights: any[];
}

export default function AIInsights({ entries, goals }: AIInsightsProps) {
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    if (entries.length > 0 || goals.length > 0) {
      performAnalysis();
    }
  }, [entries, goals]);

  const performAnalysis = () => {
    setIsAnalyzing(true);

    // Simulate AI analysis
    setTimeout(() => {
      const result = analyzeData(entries, goals);
      setAnalysis(result);
      setIsAnalyzing(false);
    }, 1500);
  };

  const analyzeData = (
    entries: JournalEntry[],
    goals: Goal[]
  ): AnalysisResult => {
    if (entries.length === 0 && goals.length === 0) {
      return {
        moodTrend: "stable",
        energyPattern: "consistent",
        productivityScore: 0,
        goalProgress: 0,
        recommendations: ["Start journaling to get personalized insights"],
        patterns: [],
        alerts: [],
        weeklyInsights: [],
      };
    }

    // Mood Analysis
    const recentMoods = entries.slice(-7).map((e) => e.mood);
    const moodTrend =
      recentMoods.length >= 2
        ? recentMoods[recentMoods.length - 1] > recentMoods[0]
          ? "improving"
          : recentMoods[recentMoods.length - 1] < recentMoods[0]
          ? "declining"
          : "stable"
        : "stable";

    // Energy Analysis
    const energyLevels = entries.map((e) => e.energy);
    const avgEnergy =
      energyLevels.reduce((a, b) => a + b, 0) / energyLevels.length;
    const energyPattern =
      avgEnergy > 7 ? "consistent" : avgEnergy < 5 ? "low" : "fluctuating";

    // Productivity Score
    const completedGoals = goals.filter((g) => g.completed).length;
    const totalGoals = goals.length;
    const goalProgress =
      totalGoals > 0 ? (completedGoals / totalGoals) * 100 : 0;

    const moodScore =
      entries.length > 0
        ? entries.reduce((sum, e) => sum + e.mood, 0) / entries.length
        : 5;
    const productivityScore = Math.round(
      (moodScore + avgEnergy + goalProgress) / 3
    );

    // Pattern Recognition
    const patterns = [];
    const categoryCounts: Record<string, number> = {};
    entries.forEach((e) => {
      categoryCounts[e.category] = (categoryCounts[e.category] || 0) + 1;
    });

    const topCategory = Object.entries(categoryCounts).sort(
      ([, a], [, b]) => b - a
    )[0];

    if (topCategory) {
      patterns.push(`You focus most on ${topCategory[0]} topics`);
    }

    if (moodTrend === "improving") {
      patterns.push("Your mood has been improving recently");
    } else if (moodTrend === "declining") {
      patterns.push(
        "Your mood has been declining - consider self-care activities"
      );
    }

    if (avgEnergy < 5) {
      patterns.push(
        "Your energy levels are consistently low - consider lifestyle changes"
      );
    }

    // Recommendations
    const recommendations = [];

    if (moodTrend === "declining") {
      recommendations.push("Practice gratitude journaling daily");
      recommendations.push("Consider meditation or mindfulness exercises");
      recommendations.push("Schedule activities you enjoy");
    }

    if (energyPattern === "low") {
      recommendations.push("Improve sleep hygiene and establish a routine");
      recommendations.push("Incorporate regular exercise into your schedule");
      recommendations.push("Consider dietary changes for sustained energy");
    }

    if (goalProgress < 50) {
      recommendations.push(
        "Break down large goals into smaller, manageable tasks"
      );
      recommendations.push("Set specific, measurable deadlines");
      recommendations.push("Celebrate small wins to maintain motivation");
    }

    if (entries.length < 7) {
      recommendations.push("Journal more frequently for better insights");
    }

    // Alerts
    const alerts = [];
    const lastEntry = entries[entries.length - 1];
    if (lastEntry) {
      const daysSinceLastEntry =
        (Date.now() - new Date(lastEntry.timestamp).getTime()) /
        (1000 * 60 * 60 * 24);
      if (daysSinceLastEntry > 3) {
        alerts.push("You haven't journaled in several days");
      }
    }

    if (moodTrend === "declining" && recentMoods.length >= 3) {
      alerts.push(
        "Your mood has been declining - consider reaching out for support"
      );
    }

    // Weekly Insights
    const weeklyInsights = entries.slice(-7).map((entry, index) => ({
      day: new Date(entry.timestamp).toLocaleDateString("en-US", {
        weekday: "short",
      }),
      mood: entry.mood,
      energy: entry.energy,
      category: entry.category,
      insight: getDailyInsight(entry),
    }));

    return {
      moodTrend,
      energyPattern,
      productivityScore,
      goalProgress,
      recommendations,
      patterns,
      alerts,
      weeklyInsights,
    };
  };

  const getDailyInsight = (entry: JournalEntry): string => {
    if (entry.mood >= 8) return "Excellent day! Keep up the positive energy";
    if (entry.mood >= 6) return "Good day with room for improvement";
    if (entry.mood >= 4) return "Challenging day - practice self-compassion";
    return "Difficult day - consider self-care activities";
  };

  const getMoodTrendIcon = (trend: string) => {
    switch (trend) {
      case "improving":
        return <TrendingUp className="w-5 h-5 text-green-500" />;
      case "declining":
        return <ArrowDown className="w-5 h-5 text-red-500" />;
      default:
        return <Activity className="w-5 h-5 text-blue-500" />;
    }
  };

  const getEnergyIcon = (pattern: string) => {
    switch (pattern) {
      case "consistent":
        return <Zap className="w-5 h-5 text-yellow-500" />;
      case "low":
        return <AlertCircle className="w-5 h-5 text-orange-500" />;
      default:
        return <Activity className="w-5 h-5 text-blue-500" />;
    }
  };

  if (isAnalyzing) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-3">
          <Brain className="w-8 h-8 text-primary-600" />
          <h2 className="text-2xl font-bold text-gray-900">AI Life Analysis</h2>
        </div>

        <div className="card text-center py-12">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <Sparkles className="w-12 h-12 text-primary-600 mx-auto mb-4" />
          </motion.div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Analyzing Your Life Patterns
          </h3>
          <p className="text-gray-500">
            AI is processing your data to provide personalized insights...
          </p>
        </div>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-3">
          <Brain className="w-8 h-8 text-primary-600" />
          <h2 className="text-2xl font-bold text-gray-900">AI Life Analysis</h2>
        </div>

        <div className="card text-center py-12">
          <Brain className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No Data to Analyze
          </h3>
          <p className="text-gray-500">
            Start journaling and setting goals to get personalized AI insights.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <Brain className="w-8 h-8 text-primary-600" />
        <h2 className="text-2xl font-bold text-gray-900">AI Life Analysis</h2>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card text-center"
        >
          <div className="flex items-center justify-center mb-2">
            {getMoodTrendIcon(analysis.moodTrend)}
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Mood Trend</h3>
          <p className="text-2xl font-bold text-primary-600 capitalize">
            {analysis.moodTrend}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card text-center"
        >
          <div className="flex items-center justify-center mb-2">
            {getEnergyIcon(analysis.energyPattern)}
          </div>
          <h3 className="text-lg font-semibold text-gray-900">
            Energy Pattern
          </h3>
          <p className="text-2xl font-bold text-primary-600 capitalize">
            {analysis.energyPattern}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card text-center"
        >
          <div className="flex items-center justify-center mb-2">
            <Target className="w-6 h-6 text-green-500" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">
            Productivity Score
          </h3>
          <p className="text-2xl font-bold text-primary-600">
            {analysis.productivityScore}/10
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card text-center"
        >
          <div className="flex items-center justify-center mb-2">
            <BarChart3 className="w-6 h-6 text-purple-500" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Goal Progress</h3>
          <p className="text-2xl font-bold text-primary-600">
            {Math.round(analysis.goalProgress)}%
          </p>
        </motion.div>
      </div>

      {/* Alerts */}
      {analysis.alerts.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card border-l-4 border-red-500 bg-red-50"
        >
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-6 h-6 text-red-500 mt-1" />
            <div>
              <h3 className="font-semibold text-red-800 mb-2">
                Attention Needed
              </h3>
              <ul className="space-y-1">
                {analysis.alerts.map((alert, index) => (
                  <li key={index} className="text-red-700 text-sm">
                    • {alert}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>
      )}

      {/* Recommendations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="card"
      >
        <div className="flex items-center space-x-3 mb-4">
          <Lightbulb className="w-6 h-6 text-yellow-500" />
          <h3 className="text-lg font-semibold text-gray-900">
            AI Recommendations
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {analysis.recommendations.map((rec, index) => (
            <div
              key={index}
              className="flex items-start space-x-3 p-3 bg-primary-50 rounded-lg"
            >
              <CheckCircle className="w-5 h-5 text-primary-600 mt-0.5" />
              <p className="text-sm text-gray-700">{rec}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Patterns */}
      {analysis.patterns.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="card"
        >
          <div className="flex items-center space-x-3 mb-4">
            <BarChart3 className="w-6 h-6 text-blue-500" />
            <h3 className="text-lg font-semibold text-gray-900">
              Life Patterns
            </h3>
          </div>
          <div className="space-y-2">
            {analysis.patterns.map((pattern, index) => (
              <div
                key={index}
                className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg"
              >
                <Sparkles className="w-4 h-4 text-blue-500" />
                <p className="text-sm text-gray-700">{pattern}</p>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Weekly Insights */}
      {analysis.weeklyInsights.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="card"
        >
          <div className="flex items-center space-x-3 mb-4">
            <Calendar className="w-6 h-6 text-green-500" />
            <h3 className="text-lg font-semibold text-gray-900">
              Weekly Insights
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {analysis.weeklyInsights.map((insight, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-900">
                    {insight.day}
                  </span>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-500">
                      Mood: {insight.mood}/10
                    </span>
                    <span className="text-xs text-gray-500">
                      Energy: {insight.energy}/10
                    </span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-2">{insight.insight}</p>
                <span className="inline-block px-2 py-1 bg-primary-100 text-primary-800 text-xs rounded">
                  {insight.category}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Deep Analysis Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="text-center"
      >
        <button
          onClick={performAnalysis}
          className="btn-primary flex items-center mx-auto"
        >
          <Brain className="w-5 h-5 mr-2" />
          Refresh Analysis
        </button>
      </motion.div>
    </div>
  );
}
