"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  User,
  Edit3,
  Save,
  X,
  Briefcase,
  Heart,
  DollarSign,
  Target,
  Brain,
  Activity,
  Calendar,
  MapPin,
  BookOpen,
  Award,
  Star,
} from "lucide-react";
import toast from "react-hot-toast";

interface ProfileData {
  name: string;
  age: number;
  occupation: string;
  industry: string;
  income: number;
  healthGoals: string[];
  financialGoals: string[];
  personalGoals: string[];
  values: string[];
  fiveYearVision: string;
  location?: string;
  education?: string;
  maritalStatus?: string;
  hobbies?: string[];
  skills?: string[];
  achievements?: string[];
}

interface ProfilePageProps {
  onBack: () => void;
}

export default function ProfilePage({ onBack }: ProfilePageProps) {
  const [profileData, setProfileData] = useState<ProfileData>({
    name: "",
    age: 0,
    occupation: "",
    industry: "",
    income: 0,
    healthGoals: [],
    financialGoals: [],
    personalGoals: [],
    values: [],
    fiveYearVision: "",
    location: "",
    education: "",
    maritalStatus: "",
    hobbies: [],
    skills: [],
    achievements: [],
  });
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    const savedData = localStorage.getItem("onboardingData");
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      setProfileData((prev) => ({ ...prev, ...parsedData }));
    }
  }, []);

  const updateProfileData = (field: keyof ProfileData, value: any) => {
    setProfileData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    localStorage.setItem("onboardingData", JSON.stringify(profileData));
    setIsEditing(false);
    toast.success("Profile updated successfully!");
  };

  const handleCancel = () => {
    const savedData = localStorage.getItem("onboardingData");
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      setProfileData((prev) => ({ ...prev, ...parsedData }));
    }
    setIsEditing(false);
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: User },
    { id: "personal", label: "Personal", icon: User },
    { id: "professional", label: "Professional", icon: Briefcase },
    { id: "health", label: "Health", icon: Heart },
    { id: "financial", label: "Financial", icon: DollarSign },
    { id: "goals", label: "Goals", icon: Target },
    { id: "values", label: "Values", icon: Star },
  ];

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center space-x-3 mb-4">
            <User className="w-6 h-6 text-blue-600" />
            <h3 className="text-lg font-semibold">Basic Information</h3>
          </div>
          <div className="space-y-3">
            <div>
              <span className="text-sm text-gray-500">Name:</span>
              <p className="font-medium">
                {profileData.name || "Not provided"}
              </p>
            </div>
            <div>
              <span className="text-sm text-gray-500">Age:</span>
              <p className="font-medium">{profileData.age || "Not provided"}</p>
            </div>
            <div>
              <span className="text-sm text-gray-500">Occupation:</span>
              <p className="font-medium">
                {profileData.occupation || "Not provided"}
              </p>
            </div>
            <div>
              <span className="text-sm text-gray-500">Industry:</span>
              <p className="font-medium">
                {profileData.industry || "Not provided"}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center space-x-3 mb-4">
            <Target className="w-6 h-6 text-green-600" />
            <h3 className="text-lg font-semibold">Goals Summary</h3>
          </div>
          <div className="space-y-3">
            <div>
              <span className="text-sm text-gray-500">Health Goals:</span>
              <p className="font-medium">
                {profileData.healthGoals.length || 0} goals
              </p>
            </div>
            <div>
              <span className="text-sm text-gray-500">Financial Goals:</span>
              <p className="font-medium">
                {profileData.financialGoals.length || 0} goals
              </p>
            </div>
            <div>
              <span className="text-sm text-gray-500">Personal Goals:</span>
              <p className="font-medium">
                {profileData.personalGoals.length || 0} goals
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="flex items-center space-x-3 mb-4">
          <Brain className="w-6 h-6 text-purple-600" />
          <h3 className="text-lg font-semibold">5-Year Vision</h3>
        </div>
        <p className="text-gray-700">
          {profileData.fiveYearVision || "No vision statement provided yet."}
        </p>
      </div>
    </div>
  );

  const renderPersonal = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Full Name
          </label>
          <input
            type="text"
            value={profileData.name}
            onChange={(e) => updateProfileData("name", e.target.value)}
            disabled={!isEditing}
            className="input-field"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Age
          </label>
          <input
            type="number"
            value={profileData.age || ""}
            onChange={(e) =>
              updateProfileData("age", parseInt(e.target.value) || 0)
            }
            disabled={!isEditing}
            className="input-field"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Location
          </label>
          <input
            type="text"
            value={profileData.location || ""}
            onChange={(e) => updateProfileData("location", e.target.value)}
            disabled={!isEditing}
            className="input-field"
            placeholder="City, Country"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Education
          </label>
          <select
            value={profileData.education || ""}
            onChange={(e) => updateProfileData("education", e.target.value)}
            disabled={!isEditing}
            className="input-field"
          >
            <option value="">Select education level</option>
            <option value="high-school">High School</option>
            <option value="bachelor">Bachelor's Degree</option>
            <option value="master">Master's Degree</option>
            <option value="phd">PhD</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Marital Status
          </label>
          <select
            value={profileData.maritalStatus || ""}
            onChange={(e) => updateProfileData("maritalStatus", e.target.value)}
            disabled={!isEditing}
            className="input-field"
          >
            <option value="">Select status</option>
            <option value="single">Single</option>
            <option value="married">Married</option>
            <option value="divorced">Divorced</option>
            <option value="widowed">Widowed</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Hobbies (comma separated)
        </label>
        <input
          type="text"
          value={profileData.hobbies?.join(", ") || ""}
          onChange={(e) =>
            updateProfileData(
              "hobbies",
              e.target.value
                .split(",")
                .map((s) => s.trim())
                .filter((s) => s)
            )
          }
          disabled={!isEditing}
          className="input-field"
          placeholder="e.g., Reading, Traveling, Cooking"
        />
      </div>
    </div>
  );

  const renderProfessional = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Occupation
          </label>
          <input
            type="text"
            value={profileData.occupation}
            onChange={(e) => updateProfileData("occupation", e.target.value)}
            disabled={!isEditing}
            className="input-field"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Industry
          </label>
          <input
            type="text"
            value={profileData.industry}
            onChange={(e) => updateProfileData("industry", e.target.value)}
            disabled={!isEditing}
            className="input-field"
            placeholder="e.g., Technology, Healthcare, Finance"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Annual Income (₹)
          </label>
          <input
            type="number"
            value={profileData.income || ""}
            onChange={(e) =>
              updateProfileData("income", parseInt(e.target.value) || 0)
            }
            disabled={!isEditing}
            className="input-field"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Skills (comma separated)
        </label>
        <input
          type="text"
          value={profileData.skills?.join(", ") || ""}
          onChange={(e) =>
            updateProfileData(
              "skills",
              e.target.value
                .split(",")
                .map((s) => s.trim())
                .filter((s) => s)
            )
          }
          disabled={!isEditing}
          className="input-field"
          placeholder="e.g., JavaScript, Leadership, Communication"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Achievements (comma separated)
        </label>
        <input
          type="text"
          value={profileData.achievements?.join(", ") || ""}
          onChange={(e) =>
            updateProfileData(
              "achievements",
              e.target.value
                .split(",")
                .map((s) => s.trim())
                .filter((s) => s)
            )
          }
          disabled={!isEditing}
          className="input-field"
          placeholder="e.g., Promoted to Manager, Completed Certification"
        />
      </div>
    </div>
  );

  const renderHealth = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Health Goals (comma separated)
        </label>
        <input
          type="text"
          value={profileData.healthGoals.join(", ")}
          onChange={(e) =>
            updateProfileData(
              "healthGoals",
              e.target.value
                .split(",")
                .map((s) => s.trim())
                .filter((s) => s)
            )
          }
          disabled={!isEditing}
          className="input-field"
          placeholder="e.g., Lose weight, Build muscle, Improve sleep"
        />
      </div>
    </div>
  );

  const renderFinancial = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Financial Goals (comma separated)
        </label>
        <input
          type="text"
          value={profileData.financialGoals.join(", ")}
          onChange={(e) =>
            updateProfileData(
              "financialGoals",
              e.target.value
                .split(",")
                .map((s) => s.trim())
                .filter((s) => s)
            )
          }
          disabled={!isEditing}
          className="input-field"
          placeholder="e.g., Buy house, Retirement fund, Emergency fund"
        />
      </div>
    </div>
  );

  const renderGoals = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Personal Goals (comma separated)
        </label>
        <input
          type="text"
          value={profileData.personalGoals.join(", ")}
          onChange={(e) =>
            updateProfileData(
              "personalGoals",
              e.target.value
                .split(",")
                .map((s) => s.trim())
                .filter((s) => s)
            )
          }
          disabled={!isEditing}
          className="input-field"
          placeholder="e.g., Travel to 10 countries, Write a book, Learn to play guitar"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          5-Year Vision
        </label>
        <textarea
          value={profileData.fiveYearVision}
          onChange={(e) => updateProfileData("fiveYearVision", e.target.value)}
          disabled={!isEditing}
          className="input-field min-h-[100px]"
          placeholder="Describe your vision for the next 5 years..."
        />
      </div>
    </div>
  );

  const renderValues = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Core Values (comma separated)
        </label>
        <input
          type="text"
          value={profileData.values.join(", ")}
          onChange={(e) =>
            updateProfileData(
              "values",
              e.target.value
                .split(",")
                .map((s) => s.trim())
                .filter((s) => s)
            )
          }
          disabled={!isEditing}
          className="input-field"
          placeholder="e.g., Honesty, Family, Success, Creativity"
        />
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return renderOverview();
      case "personal":
        return renderPersonal();
      case "professional":
        return renderProfessional();
      case "health":
        return renderHealth();
      case "financial":
        return renderFinancial();
      case "goals":
        return renderGoals();
      case "values":
        return renderValues();
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={onBack}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
              <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
            </div>

            <div className="flex items-center space-x-3">
              {isEditing ? (
                <>
                  <button
                    onClick={handleSave}
                    className="btn-primary flex items-center"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save
                  </button>
                  <button onClick={handleCancel} className="btn-secondary">
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="btn-primary flex items-center"
                >
                  <Edit3 className="w-4 h-4 mr-2" />
                  Edit Profile
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                  activeTab === tab.id
                    ? "bg-primary-100 text-primary-700"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {renderTabContent()}
        </motion.div>
      </div>
    </div>
  );
}
