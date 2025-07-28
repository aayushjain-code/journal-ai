// Version utility
export const getVersion = (): string => {
  // In a real app, you might want to read this from package.json
  // For now, we'll return a static version
  return "1.0.0";
};

export const getVersionInfo = () => {
  return {
    version: getVersion(),
    buildDate: new Date().toISOString().split("T")[0],
    features: [
      "Journal Entries",
      "Goal Tracking",
      "AI Insights",
      "Vision Board",
      "Analytics Dashboard",
      "Life Coach",
      "Health & Fitness",
      "Financial Tracking",
    ],
  };
};
