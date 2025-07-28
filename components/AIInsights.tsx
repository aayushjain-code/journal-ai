"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Lightbulb,
  TrendingUp,
  Target,
  Heart,
  Brain,
  Zap,
  Eye,
  Clock,
  BarChart3,
} from "lucide-react";

interface AIInsightsProps {
  entries: any[];
  goals: any[];
}

export default function AIInsights({ entries, goals }: AIInsightsProps) {
  const [insights, setInsights] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    if (entries.length > 0) {
      generateInsights();
    }
  }, [entries]);

  const generateInsights = () => {
    setIsAnalyzing(true);

    // Simulate AI analysis
    setTimeout(() => {
      const analysis = analyzeData(entries, goals);
      setInsights(analysis);
      setIsAnalyzing(false);
    }, 2000);
  };

  const analyzeData = (entries: any[], goals: any[]) => {
    if (entries.length === 0) return null;

    // Calculate average mood and energy
    const avgMood =
      entries.reduce((sum, entry) => sum + entry.mood, 0) / entries.length;
    const avgEnergy =
      entries.reduce((sum, entry) => sum + entry.energy, 0) / entries.length;

    // Analyze categories
    const categoryCounts = entries.reduce((acc, entry) => {
      acc[entry.category] = (acc[entry.category] || 0) + 1;
      return acc;
    }, {});

    // Find most common tags
    const allTags = entries.flatMap((entry) => entry.tags || []);
    const tagCounts = allTags.reduce((acc, tag) => {
      acc[tag] = (acc[tag] || 0) + 1;
      return acc;
    }, {});

    const topTags = Object.entries(tagCounts)
      .sort(([, a], [, b]) => (b as number) - (a as number))
      .slice(0, 5)
      .map(([tag]) => tag);

    // Generate insights
    const insights = {
      moodTrend:
        avgMood > 7 ? "positive" : avgMood > 5 ? "stable" : "needs_attention",
      energyLevel: avgEnergy > 7 ? "high" : avgEnergy > 5 ? "moderate" : "low",
      topCategory:
        Object.entries(categoryCounts).sort(
          ([, a], [, b]) => (b as number) - (a as number)
        )[0]?.[0] || "general",
      topTags,
      recommendations: generateRecommendations(
        avgMood,
        avgEnergy,
        categoryCounts,
        goals
      ),
      patterns: findPatterns(entries),
    };

    return insights;
  };

  const generateRecommendations = (
    mood: number,
    energy: number,
    categories: any,
    goals: any[]
  ) => {
    const recommendations = [];

    if (mood < 6) {
      recommendations.push({
        type: "mood",
        title: "Focus on Positive Activities",
        description:
          "Your mood has been lower than usual. Consider activities that boost your spirits.",
        icon: Heart,
        priority: "high",
      });
    }

    if (energy < 6) {
      recommendations.push({
        type: "energy",
        title: "Optimize Your Energy",
        description:
          "Your energy levels are low. Focus on rest, nutrition, and high-impact activities.",
        icon: Zap,
        priority: "high",
      });
    }

    if (goals.length === 0) {
      recommendations.push({
        type: "goals",
        title: "Set Clear Goals",
        description:
          "You haven't set any goals yet. Define clear objectives to track your progress.",
        icon: Target,
        priority: "medium",
      });
    }

    if (categories.business && categories.business > 3) {
      recommendations.push({
        type: "business",
        title: "Business Focus Detected",
        description:
          "You're heavily focused on business. Consider balancing with personal development.",
        icon: TrendingUp,
        priority: "medium",
      });
    }

    return recommendations;
  };

  const findPatterns = (entries: any[]) => {
    const patterns = [];

    // Check for consistent writing
    if (entries.length >= 3) {
      const recentEntries = entries.slice(-3);
      const hasConsistentWriting = recentEntries.every(
        (entry) => entry.content.length > 50
      );

      if (hasConsistentWriting) {
        patterns.push({
          type: "positive",
          title: "Consistent Journaling",
          description:
            "You've been writing consistently detailed entries. Keep up the great work!",
        });
      }
    }

    // Check for mood patterns
    const recentMoods = entries.slice(-5).map((e) => e.mood);
    const moodVariance = Math.max(...recentMoods) - Math.min(...recentMoods);

    if (moodVariance < 2) {
      patterns.push({
        type: "stable",
        title: "Stable Mood",
        description: "Your mood has been relatively stable recently.",
      });
    }

    return patterns;
  };

  const getInsightColor = (type: string) => {
    const colors: Record<string, string> = {
      positive: "text-green-600 bg-green-50",
      negative: "text-red-600 bg-red-50",
      neutral: "text-blue-600 bg-blue-50",
      stable: "text-purple-600 bg-purple-50",
    };
    return colors[type] || colors.neutral;
  };

  if (entries.length === 0) {
    return (
      <div className="text-center py-12">
        <Brain className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No Data to Analyze
        </h3>
        <p className="text-gray-500">
          Start writing journal entries to get AI-powered insights.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">AI Insights</h2>
        <button
          onClick={generateInsights}
          disabled={isAnalyzing}
          className="btn-secondary flex items-center"
        >
          <Brain className="w-4 h-4 mr-2" />
          {isAnalyzing ? "Analyzing..." : "Refresh Analysis"}
        </button>
      </div>

      {isAnalyzing && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="card text-center py-8"
        >
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Analyzing your journal entries...</p>
        </motion.div>
      )}

      {insights && (
        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="card"
            >
              <div className="flex items-center mb-4">
                <Heart className="w-6 h-6 text-red-500 mr-3" />
                <h3 className="text-lg font-semibold">Mood Trend</h3>
              </div>
              <div
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getInsightColor(
                  insights.moodTrend
                )}`}
              >
                {insights.moodTrend === "positive"
                  ? "Positive"
                  : insights.moodTrend === "stable"
                  ? "Stable"
                  : "Needs Attention"}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="card"
            >
              <div className="flex items-center mb-4">
                <Zap className="w-6 h-6 text-yellow-500 mr-3" />
                <h3 className="text-lg font-semibold">Energy Level</h3>
              </div>
              <div
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getInsightColor(
                  insights.energyLevel === "high"
                    ? "positive"
                    : insights.energyLevel === "moderate"
                    ? "neutral"
                    : "negative"
                )}`}
              >
                {insights.energyLevel === "high"
                  ? "High"
                  : insights.energyLevel === "moderate"
                  ? "Moderate"
                  : "Low"}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="card"
            >
              <div className="flex items-center mb-4">
                <Eye className="w-6 h-6 text-blue-500 mr-3" />
                <h3 className="text-lg font-semibold">Top Focus</h3>
              </div>
              <div className="capitalize text-gray-700 font-medium">
                {insights.topCategory}
              </div>
            </motion.div>
          </div>

          {/* Recommendations */}
          {insights.recommendations.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="card"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Lightbulb className="w-5 h-5 text-yellow-500 mr-2" />
                AI Recommendations
              </h3>
              <div className="space-y-4">
                {insights.recommendations.map((rec: any, index: number) => {
                  const Icon = rec.icon;
                  return (
                    <div
                      key={index}
                      className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg"
                    >
                      <Icon className="w-5 h-5 text-primary-600 mt-1 flex-shrink-0" />
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 mb-1">
                          {rec.title}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {rec.description}
                        </p>
                      </div>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          rec.priority === "high"
                            ? "bg-red-100 text-red-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {rec.priority}
                      </span>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* Patterns */}
          {insights.patterns.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="card"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <BarChart3 className="w-5 h-5 text-purple-500 mr-2" />
                Detected Patterns
              </h3>
              <div className="space-y-3">
                {insights.patterns.map((pattern: any, index: number) => (
                  <div
                    key={index}
                    className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
                  >
                    <div
                      className={`w-3 h-3 rounded-full ${
                        pattern.type === "positive"
                          ? "bg-green-500"
                          : pattern.type === "negative"
                          ? "bg-red-500"
                          : "bg-blue-500"
                      }`}
                    />
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {pattern.title}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {pattern.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Top Tags */}
          {insights.topTags.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="card"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Frequent Topics
              </h3>
              <div className="flex flex-wrap gap-2">
                {insights.topTags.map((tag: string, index: number) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm font-medium"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
}
