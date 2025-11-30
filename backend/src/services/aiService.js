// backend/src/services/aiService.js

/**
 * Generates project suggestions *locally* (no external Gemini call).
 * Uses the incoming data (skills, interests, techStack, duration, goal)
 * to generate 2–3 meaningful ideas.
 *
 * Time Complexity: O(1) – fixed number of suggestions.
 * Space Complexity: O(1) – we return a small static array.
 */

async function generateProjectSuggestions({
  skills = [],
  interests = [],
  techStack = [],
  duration = "",
  goal = "",
}) {
  const skillsStr = skills.length ? skills.join(", ") : "your current skills";
  const stackStr = techStack.length
    ? techStack.join(", ")
    : "MERN (MongoDB, Express, React, Node.js)";
  const durationStr = duration || "2–4 weeks";
  const goalStr =
    goal ||
    "to build strong real-world projects and improve your portfolio";

  // Suggestion 1 – Portfolio Project Hub
  const s1 = {
    title: "Personal Project Portfolio Hub",
    description:
      "A full-stack portfolio application where you can add, manage, and showcase all your projects with live demos, tech stack, and case-study style writeups.",
    techStack: techStack.length ? techStack : ["React", "Node.js", "MongoDB"],
    setupInstructions:
      "Use VS Code. Create a React frontend (Vite + Tailwind), a Node.js/Express backend with MongoDB (Atlas or local), and connect them via REST APIs.",
    features: [
      "Authentication (login / register)",
      "Add / edit / delete project entries",
      "Project categories & filtering",
      "Public portfolio page with shareable URL",
      "Admin view to manage all projects",
    ],
    learningOutcomes: [
      `Hands-on practice with ${stackStr}`,
      "Implementing authentication and protected routes",
      "Designing REST APIs and data models",
      "Building a clean, responsive UI with Tailwind CSS",
    ],
    duration: durationStr,
    level: "Intermediate",
  };

  // Suggestion 2 – Learning Tracker for Students
  const s2 = {
    title: "Student Learning Tracker",
    description:
      "A platform where students can track their daily learning, topics completed, and upcoming goals, with progress dashboards.",
    techStack: techStack.length ? techStack : ["React", "Node.js", "MongoDB"],
    setupInstructions:
      "Use VS Code. Create a React dashboard, a Node/Express API layer, and a MongoDB database for storing logs and milestones.",
    features: [
      "User authentication (student login)",
      "Daily/weekly learning logs",
      "Progress charts (per skill/subject)",
      "Goal setting and reminders",
      "Admin view to see all students and their progress",
    ],
    learningOutcomes: [
      "Handling relational-style data in MongoDB (user → logs → goals)",
      "Implementing charts/graphs in React",
      "Improving UX for data-heavy dashboards",
    ],
    duration: durationStr,
    level: "Intermediate",
  };

  // Suggestion 3 – AI-enhanced Project Idea Generator (meta!)
  const s3 = {
    title: "AI-Powered Project Idea Generator",
    description:
      "A web app where users enter their skills, interests, and time, and the system suggests project ideas and tracks which ones they start or complete.",
    techStack: techStack.length
      ? techStack
      : ["React", "Node.js", "MongoDB", "(optional: any AI API)"],
    setupInstructions:
      "Use VS Code with a standard MERN stack. Build forms to collect skills/interests, store suggestions in MongoDB, and provide a dashboard to track chosen ideas.",
    features: [
      "Form to collect skills, interests, tech stack preferences",
      "Suggestion list saved per user",
      "Mark suggestion as in-progress / completed",
      "Submit GitHub / live URLs for completed projects",
      "Admin panel to review and rate projects",
    ],
    learningOutcomes: [
      "Designing a full flow: from idea generation to submission and review",
      "Working with user-specific data and roles (user vs admin)",
      "Creating a clean frontend flow with React Router and context",
    ],
    duration: durationStr,
    level: "Intermediate",
  };

  // Return an array of suggestions
  return [s1, s2, s3];
}

module.exports = {
  generateProjectSuggestions,
};
