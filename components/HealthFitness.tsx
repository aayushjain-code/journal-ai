"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Activity,
  Heart,
  Target,
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  Circle,
  Calendar,
  Clock,
  TrendingUp,
  Scale,
  Droplets,
  Apple,
  Dumbbell,
  Bed,
  AlertCircle,
  Award,
  BarChart3,
  X,
} from "lucide-react";
import toast from "react-hot-toast";

interface HealthGoal {
  id: number;
  title: string;
  category: "weight" | "fitness" | "nutrition" | "sleep" | "mental";
  target: number;
  current: number;
  unit: string;
  deadline?: string;
  completed: boolean;
  createdAt: string;
}

interface Workout {
  id: number;
  type: string;
  duration: number;
  calories: number;
  notes: string;
  date: string;
}

interface Meal {
  id: number;
  name: string;
  type: "breakfast" | "lunch" | "dinner" | "snack";
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  notes: string;
  date: string;
}

interface HealthMetrics {
  weight: number;
  bodyFat: number;
  muscleMass: number;
  waterIntake: number;
  sleepHours: number;
  stressLevel: number;
  date: string;
}

interface HealthFitnessProps {
  entries: any[];
  goals: any[];
}

export default function HealthFitness({ entries, goals }: HealthFitnessProps) {
  const [healthGoals, setHealthGoals] = useState<HealthGoal[]>([]);
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [meals, setMeals] = useState<Meal[]>([]);
  const [metrics, setMetrics] = useState<HealthMetrics[]>([]);
  const [activeTab, setActiveTab] = useState("goals");
  const [showGoalForm, setShowGoalForm] = useState(false);
  const [showWorkoutForm, setShowWorkoutForm] = useState(false);
  const [showMealForm, setShowMealForm] = useState(false);
  const [showMetricsForm, setShowMetricsForm] = useState(false);

  // Load data from localStorage
  useEffect(() => {
    const savedGoals = localStorage.getItem("healthGoals");
    const savedWorkouts = localStorage.getItem("workouts");
    const savedMeals = localStorage.getItem("meals");
    const savedMetrics = localStorage.getItem("healthMetrics");

    if (savedGoals) setHealthGoals(JSON.parse(savedGoals));
    if (savedWorkouts) setWorkouts(JSON.parse(savedWorkouts));
    if (savedMeals) setMeals(JSON.parse(savedMeals));
    if (savedMetrics) setMetrics(JSON.parse(savedMetrics));
  }, []);

  const saveToStorage = (key: string, data: any) => {
    localStorage.setItem(key, JSON.stringify(data));
  };

  // Health Goals Management
  const addHealthGoal = (goal: Omit<HealthGoal, "id" | "createdAt">) => {
    const newGoal: HealthGoal = {
      ...goal,
      id: Date.now(),
      createdAt: new Date().toISOString(),
    };
    const updatedGoals = [...healthGoals, newGoal];
    setHealthGoals(updatedGoals);
    saveToStorage("healthGoals", updatedGoals);
    toast.success("Health goal added successfully!");
  };

  const updateHealthGoal = (goalId: number, updates: Partial<HealthGoal>) => {
    const updatedGoals = healthGoals.map((goal) =>
      goal.id === goalId ? { ...goal, ...updates } : goal
    );
    setHealthGoals(updatedGoals);
    saveToStorage("healthGoals", updatedGoals);
    toast.success("Health goal updated!");
  };

  const deleteHealthGoal = (goalId: number) => {
    const updatedGoals = healthGoals.filter((goal) => goal.id !== goalId);
    setHealthGoals(updatedGoals);
    saveToStorage("healthGoals", updatedGoals);
    toast.success("Health goal deleted!");
  };

  // Workout Management
  const addWorkout = (workout: Omit<Workout, "id" | "date">) => {
    const newWorkout: Workout = {
      ...workout,
      id: Date.now(),
      date: new Date().toISOString(),
    };
    const updatedWorkouts = [...workouts, newWorkout];
    setWorkouts(updatedWorkouts);
    saveToStorage("workouts", updatedWorkouts);
    toast.success("Workout logged successfully!");
  };

  const deleteWorkout = (workoutId: number) => {
    const updatedWorkouts = workouts.filter(
      (workout) => workout.id !== workoutId
    );
    setWorkouts(updatedWorkouts);
    saveToStorage("workouts", updatedWorkouts);
    toast.success("Workout deleted!");
  };

  // Meal Management
  const addMeal = (meal: Omit<Meal, "id" | "date">) => {
    const newMeal: Meal = {
      ...meal,
      id: Date.now(),
      date: new Date().toISOString(),
    };
    const updatedMeals = [...meals, newMeal];
    setMeals(updatedMeals);
    saveToStorage("meals", updatedMeals);
    toast.success("Meal logged successfully!");
  };

  const deleteMeal = (mealId: number) => {
    const updatedMeals = meals.filter((meal) => meal.id !== mealId);
    setMeals(updatedMeals);
    saveToStorage("meals", updatedMeals);
    toast.success("Meal deleted!");
  };

  // Metrics Management
  const addMetrics = (metricsData: Omit<HealthMetrics, "date">) => {
    const newMetrics: HealthMetrics = {
      ...metricsData,
      date: new Date().toISOString(),
    };
    const updatedMetrics = [...metrics, newMetrics];
    setMetrics(updatedMetrics);
    saveToStorage("healthMetrics", updatedMetrics);
    toast.success("Health metrics recorded!");
  };

  // Analytics
  const getWeeklyStats = () => {
    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);

    const weekWorkouts = workouts.filter((w) => new Date(w.date) >= lastWeek);
    const weekMeals = meals.filter((m) => new Date(m.date) >= lastWeek);
    const weekMetrics = metrics.filter((m) => new Date(m.date) >= lastWeek);

    return {
      totalWorkouts: weekWorkouts.length,
      totalCalories: weekMeals.reduce((sum, meal) => sum + meal.calories, 0),
      avgSleep:
        weekMetrics.length > 0
          ? weekMetrics.reduce((sum, m) => sum + m.sleepHours, 0) /
            weekMetrics.length
          : 0,
      avgWeight:
        weekMetrics.length > 0
          ? weekMetrics.reduce((sum, m) => sum + m.weight, 0) /
            weekMetrics.length
          : 0,
    };
  };

  const getGoalProgress = (goal: HealthGoal) => {
    const progress = (goal.current / goal.target) * 100;
    return Math.min(progress, 100);
  };

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, any> = {
      weight: Scale,
      fitness: Activity,
      nutrition: Apple,
      sleep: Bed,
      mental: Heart,
    };
    const Icon = icons[category] || Target;
    return <Icon className="w-5 h-5" />;
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      weight: "bg-blue-100 text-blue-800",
      fitness: "bg-green-100 text-green-800",
      nutrition: "bg-orange-100 text-orange-800",
      sleep: "bg-purple-100 text-purple-800",
      mental: "bg-pink-100 text-pink-800",
    };
    return colors[category] || "bg-gray-100 text-gray-800";
  };

  const stats = getWeeklyStats();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Activity className="w-8 h-8 text-green-600" />
          <h2 className="text-2xl font-bold text-gray-900">Health & Fitness</h2>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card text-center"
        >
          <Activity className="w-8 h-8 text-green-500 mx-auto mb-2" />
          <h3 className="text-lg font-semibold text-gray-900">
            Weekly Workouts
          </h3>
          <p className="text-3xl font-bold text-green-600">
            {stats.totalWorkouts}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card text-center"
        >
          <Apple className="w-8 h-8 text-orange-500 mx-auto mb-2" />
          <h3 className="text-lg font-semibold text-gray-900">
            Weekly Calories
          </h3>
          <p className="text-3xl font-bold text-orange-600">
            {stats.totalCalories}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card text-center"
        >
          <Bed className="w-8 h-8 text-purple-500 mx-auto mb-2" />
          <h3 className="text-lg font-semibold text-gray-900">Avg Sleep</h3>
          <p className="text-3xl font-bold text-purple-600">
            {stats.avgSleep.toFixed(1)}h
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card text-center"
        >
          <Scale className="w-8 h-8 text-blue-500 mx-auto mb-2" />
          <h3 className="text-lg font-semibold text-gray-900">Avg Weight</h3>
          <p className="text-3xl font-bold text-blue-600">
            {stats.avgWeight.toFixed(1)}kg
          </p>
        </motion.div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        {["goals", "workouts", "meals", "metrics"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === tab
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Health Goals */}
      {activeTab === "goals" && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">
              Health Goals
            </h3>
            <button
              onClick={() => setShowGoalForm(true)}
              className="btn-primary flex items-center"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Goal
            </button>
          </div>

          {showGoalForm && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card"
            >
              <HealthGoalForm
                onSubmit={addHealthGoal}
                onCancel={() => setShowGoalForm(false)}
              />
            </motion.div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {healthGoals.map((goal) => (
              <motion.div
                key={goal.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="card"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    {getCategoryIcon(goal.category)}
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(
                        goal.category
                      )}`}
                    >
                      {goal.category}
                    </span>
                  </div>
                  <button
                    onClick={() => deleteHealthGoal(goal.id)}
                    className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <h4 className="font-semibold text-gray-900 mb-2">
                  {goal.title}
                </h4>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Progress</span>
                    <span className="font-medium">
                      {goal.current}/{goal.target} {goal.unit}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${getGoalProgress(goal)}%` }}
                    />
                  </div>
                </div>

                {goal.deadline && (
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="w-4 h-4 mr-1" />
                    <span>
                      Due: {new Date(goal.deadline).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Workouts */}
      {activeTab === "workouts" && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">Workout Log</h3>
            <button
              onClick={() => setShowWorkoutForm(true)}
              className="btn-primary flex items-center"
            >
              <Plus className="w-5 h-5 mr-2" />
              Log Workout
            </button>
          </div>

          {showWorkoutForm && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card"
            >
              <WorkoutForm
                onSubmit={addWorkout}
                onCancel={() => setShowWorkoutForm(false)}
              />
            </motion.div>
          )}

          <div className="space-y-4">
            {workouts
              .slice()
              .reverse()
              .map((workout) => (
                <motion.div
                  key={workout.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="card"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        {workout.type}
                      </h4>
                      <p className="text-sm text-gray-600">{workout.notes}</p>
                      <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                        <span className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {workout.duration} min
                        </span>
                        <span className="flex items-center">
                          <Activity className="w-4 h-4 mr-1" />
                          {workout.calories} cal
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500">
                        {new Date(workout.date).toLocaleDateString()}
                      </span>
                      <button
                        onClick={() => deleteWorkout(workout.id)}
                        className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
          </div>
        </div>
      )}

      {/* Meals */}
      {activeTab === "meals" && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">
              Meal Tracker
            </h3>
            <button
              onClick={() => setShowMealForm(true)}
              className="btn-primary flex items-center"
            >
              <Plus className="w-5 h-5 mr-2" />
              Log Meal
            </button>
          </div>

          {showMealForm && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card"
            >
              <MealForm
                onSubmit={addMeal}
                onCancel={() => setShowMealForm(false)}
              />
            </motion.div>
          )}

          <div className="space-y-4">
            {meals
              .slice()
              .reverse()
              .map((meal) => (
                <motion.div
                  key={meal.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="card"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        {meal.name}
                      </h4>
                      <p className="text-sm text-gray-600">{meal.notes}</p>
                      <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                        <span className="flex items-center">
                          <Apple className="w-4 h-4 mr-1" />
                          {meal.calories} cal
                        </span>
                        <span>P: {meal.protein}g</span>
                        <span>C: {meal.carbs}g</span>
                        <span>F: {meal.fat}g</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          meal.type === "breakfast"
                            ? "bg-yellow-100 text-yellow-800"
                            : meal.type === "lunch"
                            ? "bg-orange-100 text-orange-800"
                            : meal.type === "dinner"
                            ? "bg-purple-100 text-purple-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {meal.type}
                      </span>
                      <button
                        onClick={() => deleteMeal(meal.id)}
                        className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
          </div>
        </div>
      )}

      {/* Health Metrics */}
      {activeTab === "metrics" && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">
              Health Metrics
            </h3>
            <button
              onClick={() => setShowMetricsForm(true)}
              className="btn-primary flex items-center"
            >
              <Plus className="w-5 h-5 mr-2" />
              Record Metrics
            </button>
          </div>

          {showMetricsForm && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card"
            >
              <MetricsForm
                onSubmit={addMetrics}
                onCancel={() => setShowMetricsForm(false)}
              />
            </motion.div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {metrics
              .slice()
              .reverse()
              .map((metric) => (
                <motion.div
                  key={metric.date}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="card"
                >
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">
                        {new Date(metric.date).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-gray-600">Weight:</span>
                        <span className="font-medium ml-1">
                          {metric.weight}kg
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Body Fat:</span>
                        <span className="font-medium ml-1">
                          {metric.bodyFat}%
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Muscle:</span>
                        <span className="font-medium ml-1">
                          {metric.muscleMass}kg
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Water:</span>
                        <span className="font-medium ml-1">
                          {metric.waterIntake}L
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Sleep:</span>
                        <span className="font-medium ml-1">
                          {metric.sleepHours}h
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Stress:</span>
                        <span className="font-medium ml-1">
                          {metric.stressLevel}/10
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Form Components
function HealthGoalForm({
  onSubmit,
  onCancel,
}: {
  onSubmit: (goal: any) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState({
    title: "",
    category: "weight",
    target: 0,
    current: 0,
    unit: "kg",
    deadline: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }
    onSubmit(formData);
    onCancel();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Goal Title
        </label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="input-field"
          placeholder="e.g., Lose 10kg, Run 5km"
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
            <option value="weight">Weight</option>
            <option value="fitness">Fitness</option>
            <option value="nutrition">Nutrition</option>
            <option value="sleep">Sleep</option>
            <option value="mental">Mental Health</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Unit
          </label>
          <input
            type="text"
            value={formData.unit}
            onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
            className="input-field"
            placeholder="kg, km, hours"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Current Value
          </label>
          <input
            type="number"
            value={formData.current}
            onChange={(e) =>
              setFormData({ ...formData, current: parseFloat(e.target.value) })
            }
            className="input-field"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Target Value
          </label>
          <input
            type="number"
            value={formData.target}
            onChange={(e) =>
              setFormData({ ...formData, target: parseFloat(e.target.value) })
            }
            className="input-field"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Deadline (Optional)
        </label>
        <input
          type="date"
          value={formData.deadline}
          onChange={(e) =>
            setFormData({ ...formData, deadline: e.target.value })
          }
          className="input-field"
        />
      </div>

      <div className="flex justify-end space-x-3">
        <button type="button" onClick={onCancel} className="btn-secondary">
          Cancel
        </button>
        <button type="submit" className="btn-primary">
          Add Goal
        </button>
      </div>
    </form>
  );
}

function WorkoutForm({
  onSubmit,
  onCancel,
}: {
  onSubmit: (workout: any) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState({
    type: "",
    duration: 0,
    calories: 0,
    notes: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.type.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }
    onSubmit(formData);
    onCancel();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Workout Type
        </label>
        <input
          type="text"
          value={formData.type}
          onChange={(e) => setFormData({ ...formData, type: e.target.value })}
          className="input-field"
          placeholder="e.g., Running, Weight Training, Yoga"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Duration (minutes)
          </label>
          <input
            type="number"
            value={formData.duration}
            onChange={(e) =>
              setFormData({ ...formData, duration: parseInt(e.target.value) })
            }
            className="input-field"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Calories Burned
          </label>
          <input
            type="number"
            value={formData.calories}
            onChange={(e) =>
              setFormData({ ...formData, calories: parseInt(e.target.value) })
            }
            className="input-field"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Notes
        </label>
        <textarea
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          className="input-field min-h-[100px]"
          placeholder="How did it feel? Any achievements?"
        />
      </div>

      <div className="flex justify-end space-x-3">
        <button type="button" onClick={onCancel} className="btn-secondary">
          Cancel
        </button>
        <button type="submit" className="btn-primary">
          Log Workout
        </button>
      </div>
    </form>
  );
}

function MealForm({
  onSubmit,
  onCancel,
}: {
  onSubmit: (meal: any) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState({
    name: "",
    type: "breakfast",
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    notes: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }
    onSubmit(formData);
    onCancel();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Meal Name
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="input-field"
          placeholder="e.g., Grilled Chicken Salad"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Meal Type
          </label>
          <select
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            className="input-field"
          >
            <option value="breakfast">Breakfast</option>
            <option value="lunch">Lunch</option>
            <option value="dinner">Dinner</option>
            <option value="snack">Snack</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Calories
          </label>
          <input
            type="number"
            value={formData.calories}
            onChange={(e) =>
              setFormData({ ...formData, calories: parseInt(e.target.value) })
            }
            className="input-field"
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Protein (g)
          </label>
          <input
            type="number"
            value={formData.protein}
            onChange={(e) =>
              setFormData({ ...formData, protein: parseFloat(e.target.value) })
            }
            className="input-field"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Carbs (g)
          </label>
          <input
            type="number"
            value={formData.carbs}
            onChange={(e) =>
              setFormData({ ...formData, carbs: parseFloat(e.target.value) })
            }
            className="input-field"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Fat (g)
          </label>
          <input
            type="number"
            value={formData.fat}
            onChange={(e) =>
              setFormData({ ...formData, fat: parseFloat(e.target.value) })
            }
            className="input-field"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Notes
        </label>
        <textarea
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          className="input-field min-h-[100px]"
          placeholder="How did it taste? Any dietary notes?"
        />
      </div>

      <div className="flex justify-end space-x-3">
        <button type="button" onClick={onCancel} className="btn-secondary">
          Cancel
        </button>
        <button type="submit" className="btn-primary">
          Log Meal
        </button>
      </div>
    </form>
  );
}

function MetricsForm({
  onSubmit,
  onCancel,
}: {
  onSubmit: (metrics: any) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState({
    weight: 0,
    bodyFat: 0,
    muscleMass: 0,
    waterIntake: 0,
    sleepHours: 0,
    stressLevel: 5,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onCancel();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Weight (kg)
          </label>
          <input
            type="number"
            step="0.1"
            value={formData.weight}
            onChange={(e) =>
              setFormData({ ...formData, weight: parseFloat(e.target.value) })
            }
            className="input-field"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Body Fat (%)
          </label>
          <input
            type="number"
            step="0.1"
            value={formData.bodyFat}
            onChange={(e) =>
              setFormData({ ...formData, bodyFat: parseFloat(e.target.value) })
            }
            className="input-field"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Muscle Mass (kg)
          </label>
          <input
            type="number"
            step="0.1"
            value={formData.muscleMass}
            onChange={(e) =>
              setFormData({
                ...formData,
                muscleMass: parseFloat(e.target.value),
              })
            }
            className="input-field"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Water Intake (L)
          </label>
          <input
            type="number"
            step="0.1"
            value={formData.waterIntake}
            onChange={(e) =>
              setFormData({
                ...formData,
                waterIntake: parseFloat(e.target.value),
              })
            }
            className="input-field"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sleep Hours
          </label>
          <input
            type="number"
            step="0.1"
            value={formData.sleepHours}
            onChange={(e) =>
              setFormData({
                ...formData,
                sleepHours: parseFloat(e.target.value),
              })
            }
            className="input-field"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Stress Level (1-10)
          </label>
          <input
            type="number"
            min="1"
            max="10"
            value={formData.stressLevel}
            onChange={(e) =>
              setFormData({
                ...formData,
                stressLevel: parseInt(e.target.value),
              })
            }
            className="input-field"
          />
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <button type="button" onClick={onCancel} className="btn-secondary">
          Cancel
        </button>
        <button type="submit" className="btn-primary">
          Record Metrics
        </button>
      </div>
    </form>
  );
}
