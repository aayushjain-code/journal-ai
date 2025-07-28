"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  User,
  Target,
  TrendingUp,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  Star,
  Lightbulb,
  Heart,
  Zap,
  BookOpen,
  Award,
  Sparkles,
  ArrowRight,
  Play,
  Pause,
  RotateCcw,
  Plus,
  Circle,
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

interface LifeCoachProps {
  entries: JournalEntry[];
  goals: Goal[];
}

interface Habit {
  id: string;
  name: string;
  category: string;
  frequency: "daily" | "weekly" | "monthly";
  streak: number;
  completed: boolean;
  createdAt: string;
}

interface LifeAdvice {
  type: "productivity" | "wellness" | "relationships" | "career" | "personal";
  title: string;
  description: string;
  actionItems: string[];
  priority: "high" | "medium" | "low";
}

export default function LifeCoach({ entries, goals }: LifeCoachProps) {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [advice, setAdvice] = useState<LifeAdvice[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedHabit, setSelectedHabit] = useState<string | null>(null);

  useEffect(() => {
    if (entries.length > 0 || goals.length > 0) {
      generateLifeAdvice();
    }
  }, [entries, goals]);

  const generateLifeAdvice = () => {
    setIsAnalyzing(true);

    setTimeout(() => {
      const newAdvice = analyzeLifePatterns(entries, goals);
      setAdvice(newAdvice);
      setIsAnalyzing(false);
    }, 2000);
  };

  const analyzeLifePatterns = (
    entries: JournalEntry[],
    goals: Goal[]
  ): LifeAdvice[] => {
    const advice: LifeAdvice[] = [];

    if (entries.length === 0 && goals.length === 0) {
      return [
        {
          type: "personal",
          title: "Start Your Journey",
          description:
            "Begin by creating your first journal entry and setting meaningful goals.",
          actionItems: [
            "Write your first journal entry about your current life situation",
            "Set 3 specific, achievable goals for the next 30 days",
            "Establish a daily routine that includes self-reflection",
          ],
          priority: "high",
        },
      ];
    }

    // Analyze mood patterns
    const avgMood =
      entries.length > 0
        ? entries.reduce((sum, e) => sum + e.mood, 0) / entries.length
        : 5;

    if (avgMood < 6) {
      advice.push({
        type: "wellness",
        title: "Boost Your Emotional Well-being",
        description:
          "Your mood has been lower than ideal. Let's work on improving your emotional state.",
        actionItems: [
          "Practice gratitude journaling for 10 minutes daily",
          "Schedule activities that bring you joy at least 3 times per week",
          "Consider meditation or mindfulness exercises",
          "Reach out to friends or family for support",
        ],
        priority: "high",
      });
    }

    // Analyze energy patterns
    const avgEnergy =
      entries.length > 0
        ? entries.reduce((sum, e) => sum + e.energy, 0) / entries.length
        : 5;

    if (avgEnergy < 6) {
      advice.push({
        type: "wellness",
        title: "Optimize Your Energy Levels",
        description:
          "Your energy levels are consistently low. Let's improve your vitality.",
        actionItems: [
          "Establish a consistent sleep schedule (7-9 hours)",
          "Incorporate 30 minutes of exercise into your daily routine",
          "Review and improve your nutrition habits",
          "Take regular breaks during work hours",
        ],
        priority: "high",
      });
    }

    // Analyze goal progress
    const completedGoals = goals.filter((g) => g.completed).length;
    const totalGoals = goals.length;

    if (totalGoals > 0 && completedGoals / totalGoals < 0.5) {
      advice.push({
        type: "productivity",
        title: "Enhance Your Goal Achievement",
        description:
          "Your goal completion rate suggests room for improvement in your planning and execution.",
        actionItems: [
          "Break down large goals into smaller, manageable tasks",
          "Set specific, measurable deadlines for each milestone",
          "Review your goals weekly and adjust as needed",
          "Celebrate small wins to maintain motivation",
        ],
        priority: "medium",
      });
    }

    // Analyze work-life balance
    const businessEntries = entries.filter(
      (e) => e.category === "business"
    ).length;
    const personalEntries = entries.filter(
      (e) => e.category === "personal"
    ).length;
    const totalEntries = entries.length;

    if (
      totalEntries > 0 &&
      Math.abs(businessEntries - personalEntries) / totalEntries > 0.3
    ) {
      advice.push({
        type: "career",
        title: "Achieve Better Work-Life Balance",
        description:
          "Your journal shows an imbalance between work and personal life.",
        actionItems: [
          "Schedule dedicated personal time in your calendar",
          "Set clear boundaries between work and personal activities",
          "Make time for hobbies and interests outside work",
          "Practice saying no to non-essential work commitments",
        ],
        priority: "medium",
      });
    }

    // Analyze consistency
    const recentEntries = entries.slice(-7);
    if (recentEntries.length < 5) {
      advice.push({
        type: "personal",
        title: "Build Consistent Self-Reflection Habits",
        description:
          "Regular journaling helps track progress and maintain self-awareness.",
        actionItems: [
          "Set a daily reminder to journal at the same time",
          "Start with just 5 minutes of writing each day",
          "Use prompts to guide your journaling when stuck",
          "Make journaling a non-negotiable part of your routine",
        ],
        priority: "medium",
      });
    }

    // Analyze category focus
    const categoryCounts: Record<string, number> = {};
    entries.forEach((e) => {
      categoryCounts[e.category] = (categoryCounts[e.category] || 0) + 1;
    });

    const topCategory = Object.entries(categoryCounts).sort(
      ([, a], [, b]) => b - a
    )[0];

    if (topCategory && topCategory[1] > entries.length * 0.4) {
      advice.push({
        type: "personal",
        title: "Diversify Your Life Focus",
        description: `You're heavily focused on ${topCategory[0]} topics. Consider exploring other areas of life.`,
        actionItems: [
          "Set goals in different life areas (health, relationships, learning)",
          "Schedule activities outside your current focus area",
          "Journal about different aspects of your life",
          "Seek balance across all life domains",
        ],
        priority: "low",
      });
    }

    return advice;
  };

  const addHabit = (habit: Omit<Habit, "id" | "createdAt">) => {
    const newHabit: Habit = {
      ...habit,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setHabits([...habits, newHabit]);
  };

  const toggleHabit = (habitId: string) => {
    setHabits(
      habits.map((habit) =>
        habit.id === habitId
          ? {
              ...habit,
              completed: !habit.completed,
              streak: !habit.completed ? habit.streak + 1 : habit.streak,
            }
          : habit
      )
    );
  };

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      high: "bg-red-100 text-red-800 border-red-200",
      medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
      low: "bg-green-100 text-green-800 border-green-200",
    };
    return colors[priority] || colors.medium;
  };

  const getAdviceIcon = (type: string) => {
    const icons: Record<string, any> = {
      productivity: Target,
      wellness: Heart,
      relationships: User,
      career: TrendingUp,
      personal: User,
    };
    const Icon = icons[type] || Lightbulb;
    return <Icon className="w-6 h-6" />;
  };

  if (isAnalyzing) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-3">
          <User className="w-8 h-8 text-primary-600" />
          <h2 className="text-2xl font-bold text-gray-900">Life Coach</h2>
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
            Your personal life coach is analyzing your data to provide tailored
            advice...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <User className="w-8 h-8 text-primary-600" />
          <h2 className="text-2xl font-bold text-gray-900">Life Coach</h2>
        </div>

        <button
          onClick={generateLifeAdvice}
          className="btn-primary flex items-center"
        >
          <RotateCcw className="w-5 h-5 mr-2" />
          Refresh Advice
        </button>
      </div>

      {/* Personalized Life Advice */}
      <div className="space-y-4">
        {advice.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="card"
          >
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">{getAdviceIcon(item.type)}</div>

              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {item.title}
                  </h3>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(
                      item.priority
                    )}`}
                  >
                    {item.priority}
                  </span>
                </div>

                <p className="text-gray-600 mb-4">{item.description}</p>

                <div className="space-y-2">
                  <h4 className="font-medium text-gray-900">Action Items:</h4>
                  <ul className="space-y-2">
                    {item.actionItems.map((action, actionIndex) => (
                      <li
                        key={actionIndex}
                        className="flex items-start space-x-2"
                      >
                        <ArrowRight className="w-4 h-4 text-primary-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{action}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Habit Tracker */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="card"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Target className="w-6 h-6 text-green-500" />
            <h3 className="text-lg font-semibold text-gray-900">
              Habit Tracker
            </h3>
          </div>

          <button
            onClick={() => setSelectedHabit("new")}
            className="btn-primary flex items-center"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Habit
          </button>
        </div>

        {habits.length === 0 ? (
          <div className="text-center py-8">
            <Target className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">
              No Habits Yet
            </h4>
            <p className="text-gray-500">
              Start building positive habits to improve your life.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {habits.map((habit) => (
              <div
                key={habit.id}
                className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                  habit.completed
                    ? "bg-green-50 border-green-200"
                    : "bg-gray-50 border-gray-200"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{habit.name}</h4>
                  <button
                    onClick={() => toggleHabit(habit.id)}
                    className={`p-2 rounded-full transition-colors ${
                      habit.completed
                        ? "text-green-600 hover:text-green-700"
                        : "text-gray-400 hover:text-gray-600"
                    }`}
                  >
                    {habit.completed ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <Circle className="w-5 h-5" />
                    )}
                  </button>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span className="capitalize">{habit.frequency}</span>
                  <span className="flex items-center space-x-1">
                    <Award className="w-4 h-4" />
                    <span>{habit.streak} day streak</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="card"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors text-left">
            <div className="flex items-center space-x-3">
              <BookOpen className="w-6 h-6 text-blue-600" />
              <div>
                <h4 className="font-medium text-gray-900">Daily Reflection</h4>
                <p className="text-sm text-gray-600">
                  Take 5 minutes to reflect
                </p>
              </div>
            </div>
          </button>

          <button className="p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors text-left">
            <div className="flex items-center space-x-3">
              <Target className="w-6 h-6 text-green-600" />
              <div>
                <h4 className="font-medium text-gray-900">Goal Review</h4>
                <p className="text-sm text-gray-600">Check your progress</p>
              </div>
            </div>
          </button>

          <button className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors text-left">
            <div className="flex items-center space-x-3">
              <Lightbulb className="w-6 h-6 text-purple-600" />
              <div>
                <h4 className="font-medium text-gray-900">New Insight</h4>
                <p className="text-sm text-gray-600">Get fresh perspective</p>
              </div>
            </div>
          </button>
        </div>
      </motion.div>
    </div>
  );
}
