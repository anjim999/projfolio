// backend/src/services/aiService.js
function buildToolsList(stackStr) {
  return [
    "VS Code (with ESLint + Prettier extensions)",
    "Git & GitHub (for version control and hosting code)",
    "Postman / Thunder Client (for testing APIs)",
    "MongoDB Atlas & MongoDB Compass (if using MongoDB)",
    "Browser DevTools (Chrome / Edge)",
    `Render / Railway / Cyclic for backend deploy (for ${stackStr})`,
    "Vercel / Netlify for React frontend deploy",
  ];
}

function buildSetupInstructions(stackStr, durationStr, goalStr) {
  return [
    `Editor: VS Code`,
    ``,
    `1) Install & Setup`,
    `- Install Node.js (LTS)`,
    `- Install VS Code and extensions: ESLint, Prettier, React snippets`,
    `- Create a free MongoDB Atlas cluster (if you use MongoDB)`,
    ``,
    `2) Project Structure`,
    `- Create root folder: ai-project-folio`,
    `- Inside, create two folders: backend/ and frontend/`,
    ``,
    `Backend (Node + Express):`,
    `- cd backend`,
    `- npm init -y`,
    `- npm install express mongoose cors dotenv jsonwebtoken bcryptjs`,
    `- Create src/ with: server.js, models/, routes/, middleware/`,
    `- Setup environment variables in .env (PORT, MONGO_URI, JWT_SECRET, etc.)`,
    ``,
    `Frontend (React + Vite + Tailwind):`,
    `- cd frontend`,
    `- npm create vite@latest . --template react`,
    `- npm install`,
    `- npm install axios react-router-dom`,
    `- npm install -D tailwindcss postcss autoprefixer`,
    `- npx tailwindcss init -p`,
    `- Configure tailwind.config.js and src/index.css for Tailwind`,
    ``,
    `3) Git & GitHub Flow`,
    `- git init`,
    `- git add .`,
    `- git commit -m "Initial commit for portfolio project"`,
    `- Create a GitHub repo and push:`,
    `  git remote add origin <repo-url>`,
    `  git push -u origin main`,
    ``,
    `4) Deployment (High level)`,
    `Backend:`,
    `- Deploy Node/Express API to Render / Railway`,
    `- Set environment variables in the hosting platform`,
    ``,
    `Frontend:`,
    `- Build: npm run build`,
    `- Deploy dist/ folder on Vercel / Netlify`,
    `- Configure environment variables (VITE_API_BASE_URL, etc.)`,
    ``,
    `5) Recommended flow (${durationStr} total):`,
    `- First 20–30%: Setup ${stackStr} stack, auth, routing`,
    `- Middle 50%: Implement main features screen by screen`,
    `- Last 20%: Polish UI, test flows end-to-end, deploy, update README`,
    ``,
    `Goal: ${goalStr}`,
  ].join("\n");
}

async function generateProjectSuggestions({
  skills = [],
  level = "Intermediate",
  interests = [],
  techStack = [],
  duration = "",
  goal = "",
}) {
  const skillsStr = skills.length
    ? skills.join(", ")
    : "JavaScript, React, Node basics";
  const interestsStr = interests.length
    ? interests.join(", ")
    : "web development, career growth";
  const stackStr = techStack.length
    ? techStack.join(", ")
    : "MERN (MongoDB, Express, React, Node.js)";
  const durationStr = duration || "2–4 weeks";
  const difficultyStr = level || "Intermediate";
  const goalStr =
    goal ||
    "build strong real-world projects and a portfolio that impresses recruiters";

  const tools = buildToolsList(stackStr);
  const setupInstructions = buildSetupInstructions(stackStr, durationStr, goalStr);

  const s1 = {
    title: "AI-Guided Portfolio Project Hub",
    description:
      `A full-stack portfolio dashboard where a student can plan, track, and showcase all projects. ` +
      `The app is tailored for a ${difficultyStr.toLowerCase()} learner with skills in ${skillsStr} ` +
      `and interests around ${interestsStr}.`,
    techStack: techStack.length ? techStack : ["React", "Node.js", "MongoDB"],
    features: [
      "Student authentication (register / login) with JWT & protected routes",
      "Dashboard for all project suggestions with status (planned / in-progress / completed)",
      "Form to store project details: title, description, tech stack, links, duration",
      "Public portfolio page with shareable URL for recruiters",
      "Admin view to see all students and their project statuses",
    ],
    learningOutcomes: [
      `Hands-on experience building a portfolio system using ${stackStr}`,
      "Implementing authentication & authorization (JWT + frontend guards)",
      "Designing MongoDB models for users, projects, and submissions",
    ],
    duration: durationStr,
    difficulty: difficultyStr,
    tools,
    setupInstructions,
  };

  const s2 = {
    title: "Student Learning Journey Tracker",
    description:
      "A web app where students log what they learn daily, connect it to projects, and visualize progress over time. " +
      "Perfect to show consistent learning discipline in a portfolio or interview.",
    techStack: techStack.length ? techStack : ["React", "Node.js", "MongoDB"],
    features: [
      "User auth and profile page showing current skills and focus areas",
      "Daily/weekly learning logs (date, topics, resources, time spent)",
      "Ability to link logs to specific projects (e.g., 'Worked on auth for portfolio app')",
      "Charts/graphs for progress per skill or topic (e.g., React vs Node vs DB)",
      "Admin view to see top learners and consistent activity",
    ],
    learningOutcomes: [
      "Modeling related data in MongoDB (user → logs → projects)",
      "Building analytics dashboards with charts in React",
      "Filtering and querying data by date range, tech stack and project",
    ],
    duration: durationStr,
    difficulty: difficultyStr,
    tools,
    setupInstructions,
  };

  const s3 = {
    title: "Project Review & Feedback System",
    description:
      "A platform where students submit their project links (GitHub, live demo, video), and admins can review, rate, " +
      "award badges and give detailed feedback. This matches exactly what you're building in this assignment.",
    techStack: techStack.length
      ? techStack
      : ["React", "Node.js", "MongoDB", "Tailwind CSS"],
    features: [
      "List of AI-style suggested projects that students can mark as started/completed",
      "Submission form for GitHub repo, frontend URL, backend URL, and demo video link",
      "Admin dashboard to filter submissions by student, rating or status (reviewed / not reviewed)",
      "Admin review form to set rating (1–5), completion %, upload badge/certificate, and write comments",
      "Student dashboard to see each project submission with full admin review details and badges",
    ],
    learningOutcomes: [
      "Designing end-to-end flows: suggestion → implementation → submission → admin review",
      "Handling complex UI states in React with modals, filters and detail views",
      "Implementing role-based access control and review workflows",
    ],
    duration: durationStr,
    difficulty: difficultyStr,
    tools,
    setupInstructions,
  };

  return [s1, s2, s3];
}

module.exports = {
  generateProjectSuggestions,
};
