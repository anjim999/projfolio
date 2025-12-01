// backend/src/services/aiService.js
require("dotenv").config();
const axios = require("axios");

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

async function generateProjectSuggestions({
  skills = [],
  level = "Intermediate",
  interests = [],
  techStack = [],
  duration = "",
  goal = "",
}) {
  if (!GEMINI_API_KEY) {
    throw new Error("Gemini API key missing. Add GEMINI_API_KEY in .env file.");
  }

  const prompt = `You are an expert project ideation AI for developers building portfolios.

USER PROFILE:
- Skills: ${skills.join(", ") || "General programming"}
- Level: ${level}
- Interests: ${interests.join(", ") || "General"}
- Tech Stack: ${techStack.join(", ") || "Any"}
- Timeline: ${duration || "2-4 weeks"}
- Goal: ${goal || "Build portfolio projects"}

Generate EXACTLY 3 unique, practical, portfolio-quality project ideas.

REQUIREMENTS:
1. Each project must be real-world and achievable in the given timeline
2. Match the user's skill level and interests
3. Personalized to their tech stack preference
4. Include specific, actionable features
5. Each should teach valuable skills for job interviews

RESPONSE FORMAT (ONLY JSON, NO OTHER TEXT):
[
  {
    "title": "Project Title",
    "description": "2-3 sentence description of what they'll build",
    "techStack": ["tech1", "tech2"],
    "features": ["feature1", "feature2", "feature3"],
    "learningOutcomes": ["skill1", "skill2", "skill3"],
    "duration": "estimated timeline",
    "difficulty": "Beginner/Intermediate/Advanced",
    "tools": ["tool1", "tool2"],
    "setupInstructions": "Step-by-step setup guide",
    "deploymentGuide": "How and where to deploy",
    "complexity": "Brief complexity assessment"
  }
]

IMPORTANT: Return ONLY valid JSON array. No markdown, no code blocks, no explanations.`;

  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
      }
    );

    let text = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    if (!text) {
      throw new Error("No response from Gemini API");
    }

    text = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();

    const suggestions = JSON.parse(text);

    if (!Array.isArray(suggestions)) {
      throw new Error("Gemini response is not an array");
    }

    return suggestions;
  } catch (err) {
    console.error("Gemini API Error:", err.response?.data || err.message || err);
    throw new Error(`Failed to generate suggestions: ${err.message}`);
  }
}

module.exports = {
  generateProjectSuggestions,
};














// backend/src/services/aiService.js

// // Calculate difficulty based on skills & tech stack
// function calculateDifficulty(skills = [], selectedLevel = "Intermediate", stackStr = "") {
//   const advancedSkills = ["System Design", "CI/CD", "Docker", "Kubernetes", "GraphQL", "Microservices"];
//   const intermediateSkills = ["React", "Node.js", "MongoDB", "REST APIs", "Express.js"];
  
//   const hasAdvanced = skills.some(s =>
//     advancedSkills.some(a => s.toLowerCase().includes(a.toLowerCase()))
//   );
//   const hasIntermediate = skills.some(s =>
//     intermediateSkills.some(a => s.toLowerCase().includes(a.toLowerCase()))
//   );

//   if (hasAdvanced || selectedLevel === "Advanced") return "Advanced";
//   if (hasIntermediate || selectedLevel === "Intermediate") return "Intermediate";
//   return "Beginner";
// }

// // Suggest datasets for ML/Data projects
// function getSuggestedDatasets(interests = [], stackStr = "") {
//   const datasets = {
//     "AI / ML": [
//       "Iris Dataset (UCI ML Repository)",
//       "MNIST (Handwritten digits - TensorFlow)",
//       "Kaggle: Titanic - Machine Learning Disaster",
//       "Boston Housing (Regression prediction)",
//     ],
//     "Data Science": [
//       "Kaggle: COVID-19 Data",
//       "Kaggle: Netflix Titles Dataset",
//       "Kaggle: NYC Taxi Trip Data",
//       "World Bank Open Data API",
//     ],
//     "FinTech": [
//       "Yahoo Finance API (stock prices)",
//       "Kaggle: Credit Card Fraud Detection",
//       "Alpha Vantage (stock market data)",
//       "Kaggle: Bitcoin Historical Data",
//     ],
//     "EduTech": [
//       "Kaggle: Student Performance Data",
//       "UNESCO Education Statistics",
//       "Kaggle: IMDB Movie Reviews (NLP demo)",
//     ],
//     "HealthTech": [
//       "Kaggle: Heart Disease UCI",
//       "Kaggle: Diabetes Prediction Dataset",
//       "Kaggle: COVID-19 Symptoms Tracker",
//       "CDC Public Health Data",
//     ],
//   };

//   const key = interests.find(i =>
//     Object.keys(datasets).some(k => i.toLowerCase().includes(k.toLowerCase()))
//   );

//   return datasets[key] || datasets["Data Science"];
// }

// // Get deployment recommendations
// function getDeploymentGuide(stackStr = "") {
//   const guides = {
//     react: {
//       frontend: "Vercel (1-click deploy from GitHub)",
//       hosting: "Netlify (great for React)",
//       guide: "npm run build && deploy dist/ to Vercel",
//     },
//     node: {
//       backend: "Railway.app or Render.com (free tier available)",
//       database: "MongoDB Atlas (free M0 cluster)",
//       guide: "Push code to GitHub → Connect to Railway → Auto-deploy",
//     },
//     flask: {
//       backend: "Railway or PythonAnywhere",
//       guide: "pip freeze > requirements.txt → Deploy to Railway",
//     },
//     django: {
//       backend: "PythonAnywhere or Render",
//       guide: "Push to GitHub → Connect to PythonAnywhere",
//     },
//   };

//   for (const [key, guide] of Object.entries(guides)) {
//     if (stackStr.toLowerCase().includes(key)) {
//       return guide;
//     }
//   }

//   return {
//     frontend: "Vercel",
//     backend: "Railway",
//     guide: "Standard deployment workflow",
//   };
// }

// // Get learning resources
// function getLearningResources(stackStr = "", interests = []) {
//   const resources = [];

//   if (stackStr.toLowerCase().includes("react")) {
//     resources.push({
//       topic: "React Fundamentals",
//       resources: [
//         "React Official Docs (react.dev)",
//         "Scrimba: Learn React (free course)",
//         "YouTube: React Course by Traversy Media",
//       ],
//     });
//   }

//   if (stackStr.toLowerCase().includes("node")) {
//     resources.push({
//       topic: "Node.js & Express",
//       resources: [
//         "Node.js Official Docs",
//         "freeCodeCamp: Node.js Course",
//         "YouTube: Express.js Tutorial",
//       ],
//     });
//   }

//   if (stackStr.toLowerCase().includes("python")) {
//     resources.push({
//       topic: "Python Basics",
//       resources: [
//         "Python.org Documentation",
//         "freeCodeCamp: Python for Everybody",
//         "DataCamp: Python for Data Science",
//       ],
//     });
//   }

//   if (interests.some(i => i.toLowerCase().includes("ml"))) {
//     resources.push({
//       topic: "Machine Learning",
//       resources: [
//         "Andrew Ng's ML Course (Coursera)",
//         "Fast.ai Practical Deep Learning",
//         "Kaggle Learn (free micro-courses)",
//       ],
//     });
//   }

//   return resources;
// }

// // Get GitHub project examples
// function getGitHubExamples(title = "", stackStr = "") {
//   // In production, you'd fetch these from GitHub API
//   const examples = [
//     {
//       name: "freeCodeCamp Projects",
//       stars: "⭐⭐⭐⭐⭐",
//       description: "Production-ready MERN projects",
//       url: "https://github.com/freecodecamp/",
//     },
//     {
//       name: "Awesome Lists",
//       stars: "⭐⭐⭐⭐⭐",
//       description: "Curated lists of great projects",
//       url: "https://github.com/sindresorhus/awesome",
//     },
//     {
//       name: "30-Day Coding Challenge",
//       stars: "⭐⭐⭐⭐",
//       description: "Real project examples with solutions",
//       url: "https://github.com/",
//     },
//   ];

//   return examples;
// }

// function buildToolsList(stackStr = "", interests = []) {
//   const baseTools = [
//     "VS Code (with relevant extensions)",
//     "Git & GitHub (for version control and hosting code)",
//     "Browser DevTools (Chrome / Edge)",
//   ];

//   if (stackStr.toLowerCase().includes("react") || stackStr.toLowerCase().includes("frontend")) {
//     baseTools.push("React DevTools Extension");
//     baseTools.push("Tailwind CSS / Material-UI");
//   }

//   if (
//     stackStr.toLowerCase().includes("node") ||
//     stackStr.toLowerCase().includes("express") ||
//     stackStr.toLowerCase().includes("backend")
//   ) {
//     baseTools.push("Postman / Thunder Client (for testing APIs)");
//     baseTools.push("MongoDB Compass (if using MongoDB)");
//   }

//   if (
//     stackStr.toLowerCase().includes("python") ||
//     interests.some(i => i.toLowerCase().includes("ml") || i.toLowerCase().includes("ai"))
//   ) {
//     baseTools.push("Jupyter Notebook / Google Colab");
//     baseTools.push("Scikit-learn, TensorFlow, or PyTorch");
//   }

//   if (stackStr.toLowerCase().includes("docker")) {
//     baseTools.push("Docker Desktop");
//   }

//   return baseTools;
// }

// function buildSetupInstructions(stackStr = "", durationStr = "", interests = []) {
//   let instructions = `Setup Guide\n`;
//   instructions += `Duration: ${durationStr}\n\n`;

//   const lower = stackStr.toLowerCase();

//   if (lower.includes("mern") || (lower.includes("react") && lower.includes("node"))) {
//     instructions += `MERN Stack Setup:\n`;
//     instructions += `1. Install Node.js (LTS)\n`;
//     instructions += `2. Create project: mkdir ai-project && cd ai-project\n`;
//     instructions += `3. Backend: npm init -y && npm install express mongoose cors dotenv\n`;
//     instructions += `4. Frontend: npm create vite@latest client --template react\n`;
//     instructions += `5. Setup MongoDB Atlas cluster\n`;
//     instructions += `6. Configure .env with MONGO_URI, JWT_SECRET, PORT\n`;
//     instructions += `7. Create Git repo and push to GitHub\n`;
//   } else if (lower.includes("python")) {
//     instructions += `Python Setup:\n`;
//     instructions += `1. Install Python 3.9+\n`;
//     instructions += `2. Create virtual env: python -m venv venv\n`;
//     instructions += `3. Activate: source venv/bin/activate (Mac/Linux) or venv\\Scripts\\activate (Windows)\n`;
//     instructions += `4. Install dependencies: pip install -r requirements.txt\n`;
//     instructions += `5. For ML/AI: pip install scikit-learn pandas numpy matplotlib\n`;
//     instructions += `6. For web: pip install flask django\n`;
//   } else if (lower.includes("django")) {
//     instructions += `Django Setup:\n`;
//     instructions += `1. Install Python 3.9+\n`;
//     instructions += `2. Create virtual env and activate it\n`;
//     instructions += `3. pip install django djangorestframework django-cors-headers\n`;
//     instructions += `4. django-admin startproject config . && python manage.py startapp api\n`;
//     instructions += `5. Configure settings.py with CORS and database\n`;
//     instructions += `6. python manage.py migrate && python manage.py runserver\n`;
//   } else if (lower.includes("next")) {
//     instructions += `Next.js Setup:\n`;
//     instructions += `1. Install Node.js\n`;
//     instructions += `2. npx create-next-app@latest --typescript\n`;
//     instructions += `3. npm install axios or fetch library\n`;
//     instructions += `4. Setup API routes in pages/api/\n`;
//     instructions += `5. Configure environment variables in .env.local\n`;
//   }

//   instructions += `\nDeployment:\n`;
//   if (lower.includes("react")) {
//     instructions += `- Frontend: Vercel, Netlify (npm run build && deploy dist/)\n`;
//   }
//   if (lower.includes("node") || lower.includes("express")) {
//     instructions += `- Backend: Render, Railway, Heroku (set env vars in hosting platform)\n`;
//   }

//   return instructions;
// }

// function generateMLProject(skills = [], interests = [], techStack = [], durationStr = "") {
//   return {
//     title: "Predictive ML Model with Web Interface",
//     description:
//       `Build a machine learning model for prediction (classification or regression) tailored to ${interests.join(" or ")}. ` +
//       `Create a web interface to input data and visualize predictions. Demonstrate your ${skills.slice(0, 2).join(" and ")} skills.`,
//     techStack: techStack.length ? techStack : ["Python", "Scikit-learn", "React"],
//     features: [
//       `Train a dataset for ${interests[0] || "classification"} prediction`,
//       "Compare 2-3 ML algorithms (Logistic Regression, Random Forest, SVM, etc.)",
//       "Evaluate with accuracy, precision, recall, F1-score metrics",
//       "Build a React/web UI to input test data and display predictions",
//       "Generate performance comparison charts and confusion matrices",
//     ],
//     learningOutcomes: [
//       "End-to-end ML pipeline: data → preprocessing → training → evaluation",
//       "Model comparison and hyperparameter tuning",
//       "Deploying ML models as APIs and consuming them in web apps",
//     ],
//     duration: durationStr,
//     goal: "Build a portfolio-worthy ML project that showcases your data science skills",
//   };
// }

// function generateWebDevProject(skills = [], interests = [], techStack = [], durationStr = "") {
//   return {
//     title: `Full-Stack ${interests[0] || "E-Commerce"} Platform`,
//     description:
//       `Create a real-world web app focused on ${interests.join(" and ")} using ${techStack.join(", ")}. ` +
//       `This will be a strong portfolio project showcasing your full-stack capabilities.`,
//     techStack: techStack.length ? techStack : ["React", "Node.js", "MongoDB"],
//     features: [
//       `Authentication & role-based access (users, admins, ${
//         interests[0]?.toLowerCase() === "ecommerce" ? "vendors" : "contributors"
//       })`,
//       `Core feature: ${
//         interests[0] === "social"
//           ? "Feed, posts, comments, likes"
//           : interests[0] === "ecommerce"
//           ? "Product catalog, cart, checkout"
//           : "Main business logic"
//       }`,
//       "Search, filter, and sorting functionality",
//       "Real-time notifications (WebSocket or polling)",
//       "Admin dashboard for analytics and management",
//     ],
//     learningOutcomes: [
//       `Full-stack development with ${techStack.slice(0, 2).join(" and ")}`,
//       "Database design for complex data relationships",
//       "API design and error handling",
//       "Frontend state management and responsive UI",
//     ],
//     duration: durationStr,
//     goal: "Build a professional web app that demonstrates job-ready skills",
//   };
// }

// function generateDataProject(skills = [], interests = [], techStack = [], durationStr = "") {
//   return {
//     title: "Data Analysis & Visualization Dashboard",
//     description:
//       `Analyze real-world ${interests.join(" and ")} datasets. Create interactive dashboards ` +
//       `that tell a story with data using ${techStack.join(", ")}.`,
//     techStack: techStack.length ? techStack : ["Python", "Pandas", "Plotly"],
//     features: [
//       `Download and clean ${interests[0] || "public"} datasets from Kaggle or government sources`,
//       "Exploratory Data Analysis (EDA) with statistical insights",
//       "Interactive dashboards (Plotly, Dash, or Streamlit)",
//       "Predictive insights or trend analysis",
//       "Export results as PDF or interactive HTML reports",
//     ],
//     learningOutcomes: [
//       "Data wrangling and cleaning with Pandas",
//       "Statistical analysis and hypothesis testing",
//       "Data visualization and storytelling",
//       "Building and deploying interactive dashboards",
//     ],
//     duration: durationStr,
//     goal: "Create data-driven insights that impress in interviews or portfolio",
//   };
// }

// async function generateProjectSuggestions({
//   skills = [],
//   level = "Intermediate",
//   interests = [],
//   techStack = [],
//   duration = "",
//   goal = "",
// }) {
//   const skillsStr = skills.length ? skills.join(", ") : "JavaScript, React, Node basics";
//   const interestsStr = interests.length ? interests.join(", ") : "web development, career growth";
//   const stackStr = techStack.length ? techStack.join(", ") : "MERN (MongoDB, Express, React, Node.js)";
//   const durationStr = duration || "2–4 weeks";

//   // Calculate actual difficulty based on skills
//   const difficultyStr = calculateDifficulty(skills, level, stackStr);
//   const goalStr = goal || "build strong real-world projects and a portfolio that impresses recruiters";

//   const tools = buildToolsList(stackStr, interests);
//   const setupInstructions = buildSetupInstructions(stackStr, durationStr, interests);

//   // New enrichment data
//   const deploymentGuide = getDeploymentGuide(stackStr);
//   const suggestedDatasets = getSuggestedDatasets(interests, stackStr);
//   const learningResources = getLearningResources(stackStr, interests);
//   const gitHubExamples = getGitHubExamples("", stackStr);

//   const suggestions = [];

//   const lower = stackStr.toLowerCase();

//   // Determine project types
//   const isML =
//     lower.includes("python") ||
//     lower.includes("ml") ||
//     lower.includes("tensorflow") ||
//     lower.includes("pytorch") ||
//     interests.some(i =>
//       i.toLowerCase().includes("ml") ||
//       i.toLowerCase().includes("ai") ||
//       i.toLowerCase().includes("data")
//     );

//   const isWeb =
//     lower.includes("react") ||
//     lower.includes("node") ||
//     lower.includes("mern") ||
//     lower.includes("django") ||
//     lower.includes("flask") ||
//     lower.includes("next") ||
//     lower.includes("vue") ||
//     lower.includes("fastapi");

//   const isData = interests.some(i =>
//     i.toLowerCase().includes("data") || i.toLowerCase().includes("analytics")
//   );

//   const isMobile =
//     lower.includes("react native") ||
//     lower.includes("flutter");

//   // Helper to enrich each suggestion
//   const enrichSuggestion = (s) => ({
//     ...s,
//     tools,
//     setupInstructions,
//     difficulty: difficultyStr,
//     estimatedEffort: {
//       expectedCommits: "50-100",
//       timelineWeeks: durationStr,
//       skillsGained: 8 + Math.floor(Math.random() * 4),
//       gitHubStarsPotential: "10-100+",
//     },
//     deploymentGuide,
//     learningResources,
//     gitHubExamples,
//     suggestedDatasets: isML || isData ? suggestedDatasets : undefined,
//   });

//   // --- Project branches ---

//   if (isML && !isWeb) {
//     // Pure ML path - suggest ML projects
//     suggestions.push({
//       title: `${interests[0] || "Machine Learning"} Prediction Engine`,
//       description:
//         `Build a production-ready ML model for ${interests[0] || "classification"}. ` +
//         `Train on real datasets, optimize with multiple algorithms, and deploy as a REST API. ` +
//         `Perfect for showcasing your ${skills.slice(0, 2).join(" and ")} expertise.`,
//       techStack: techStack.length ? techStack : ["Python", "Scikit-learn", "Flask"],
//       complexity: difficultyStr === "Advanced" ? "Advanced - 4-6 weeks" : "Intermediate - 2-3 weeks",
//       features: [
//         `Collect/preprocess data for ${interests[0] || "your target problem"}`,
//         "Train 3+ ML models (Logistic Regression, Random Forest, Gradient Boosting, XGBoost)",
//         "Hyperparameter tuning and cross-validation (K-fold)",
//         "Model evaluation with precision, recall, F1, ROC-AUC",
//         "Deploy as REST API with Flask/FastAPI",
//         "Interactive dashboard for predictions (Plotly/Streamlit)",
//       ],
//       learningOutcomes: [
//         "Complete ML lifecycle: data collection → preprocessing → model selection → deployment",
//         "Advanced model tuning and ensemble methods",
//         "API integration and real-world deployment",
//       ],
//       duration: durationStr,
//       goal: goalStr,
//     });

//     suggestions.push({
//       title: `NLP Text Analysis for ${interests[1] || "Sentiment"}`,
//       description:
//         `Develop a natural language processing project analyzing ${interests[1] || "social media"} ` +
//         `using transformers or LSTM models. Extract real insights and deploy as a service.`,
//       techStack: techStack.length ? techStack : ["Python", "Hugging Face", "PyTorch"],
//       complexity: difficultyStr === "Advanced" ? "Advanced - 5-6 weeks" : "Intermediate - 3-4 weeks",
//       features: [
//         `Collect text data from ${interests[1] || "public sources"}`,
//         "Tokenization and embeddings (Word2Vec, GloVe, BERT)",
//         "Train custom LSTM or use pre-trained transformers",
//         "Sentiment/emotion analysis or topic classification",
//         "Deploy API with FastAPI",
//         "Web dashboard for real-time analysis",
//       ],
//       learningOutcomes: [
//         "NLP fundamentals and transformer models (BERT, GPT-2)",
//         "Pre-trained model fine-tuning and transfer learning",
//         "Text preprocessing and feature engineering",
//       ],
//       duration: durationStr,
//       goal: goalStr,
//     });

//     suggestions.push({
//       title: `Computer Vision Project - ${interests[2] || "Image Classification"}`,
//       description:
//         `Build an image recognition system using deep learning CNNs or transfer learning. ` +
//         `Deploy as a web service that classifies images in real-time.`,
//       techStack: techStack.length ? techStack : ["Python", "TensorFlow", "OpenCV"],
//       complexity: difficultyStr === "Advanced" ? "Advanced - 4-5 weeks" : "Intermediate - 3 weeks",
//       features: [
//         `Dataset: ImageNet, CIFAR-10, or custom ${interests[2] || "images"} collection`,
//         "Convolutional Neural Networks (CNN) architecture design",
//         "Transfer learning with pre-trained models (ResNet, VGG, EfficientNet)",
//         "Data augmentation and regularization techniques",
//         "Deploy as REST API (Flask)",
//         "Web UI for image upload and predictions",
//       ],
//       learningOutcomes: [
//         "Deep learning and CNN architectures (VGG, ResNet, MobileNet)",
//         "Transfer learning and fine-tuning for faster training",
//         "Image preprocessing and augmentation strategies",
//       ],
//       duration: durationStr,
//       goal: goalStr,
//     });
//   } else if (isData) {
//     // Data-focused path
//     suggestions.push({
//       title: `Data Analytics Dashboard - ${interests[0] || "Business Insights"}`,
//       description:
//         `Create an interactive dashboard analyzing ${interests[0] || "business"} datasets. ` +
//         `Use Pandas for data processing and Plotly/Dash for visualizations. Deploy publicly on Vercel or Heroku.`,
//       techStack: techStack.length ? techStack : ["Python", "Pandas", "Plotly"],
//       complexity: difficultyStr === "Advanced" ? "Advanced - 3-4 weeks" : "Beginner - 1-2 weeks",
//       features: [
//         `Fetch data from Kaggle, APIs, or CSV files about ${interests[0] || "your topic"} `,
//         "Data cleaning and feature engineering with Pandas",
//         "Statistical analysis and trend detection",
//         "Interactive Plotly/Dash dashboard with multiple charts",
//         "Real-time data updates via API polling",
//         "Deploy on Heroku, Streamlit Cloud, or Vercel",
//       ],
//       learningOutcomes: [
//         "Data wrangling and exploratory data analysis (EDA)",
//         "Advanced visualizations and data storytelling",
//         "Dashboard deployment and maintenance",
//       ],
//       duration: durationStr,
//       goal: goalStr,
//     });

//     suggestions.push({
//       title: `E-commerce Analytics Platform (Full-Stack)`,
//       description:
//         `Build a complete data analytics platform for ${interests[1] || "product sales"} using ${stackStr}. ` +
//         `Combine backend APIs with interactive data visualizations and real-time insights.`,
//       techStack: techStack.length ? techStack : ["React", "Node.js", "MongoDB"],
//       complexity: "Advanced - 4-6 weeks",
//       features: [
//         "User auth and role-based access (buyer, seller, admin)",
//         "Real product/sales data management with analytics",
//         "Advanced filtering, search, and sorting with aggregation pipelines",
//         "Analytics dashboards with revenue trends, top sellers, customer behavior",
//         "Export reports in CSV, PDF formats",
//         "Real-time notifications for top sellers and admins",
//       ],
//       learningOutcomes: [
//         "Full-stack development combining data and web technologies",
//         "Advanced database design for analytics (MongoDB aggregations)",
//         "Building scalable, high-performance APIs",
//       ],
//       duration: durationStr,
//       goal: goalStr,
//     });

//     suggestions.push({
//       title: `ML + Web Hybrid: Predictive Analytics App`,
//       description:
//         `Combine machine learning with web development. Train predictive models, expose via API, ` +
//         `and build React UI for data input and visualizations.`,
//       techStack: techStack.length ? techStack : ["Python", "Node.js", "React"],
//       complexity: "Advanced - 5-7 weeks",
//       features: [
//         "Train ML model for predictions (regression, classification, clustering)",
//         "Backend API (Flask/FastAPI) to serve ML model predictions",
//         "React frontend for data input and visualizations",
//         "Historical data storage and analysis with charts",
//         "Export predictions and detailed reports (PDF, CSV)",
//         "Real-time prediction updates with WebSocket",
//       ],
//       learningOutcomes: [
//         "Full-stack ML development from training to production",
//         "API design and integration between Python backend and React frontend",
//         "Cross-domain project architecture and deployment",
//       ],
//       duration: durationStr,
//       goal: goalStr,
//     });
//   } else if (isMobile) {
//     // Mobile development path
//     suggestions.push({
//       title: `Social Networking Mobile App (${stackStr})`,
//       description:
//         `Build a mobile app with user profiles, messaging, and feed features using ${stackStr}. ` +
//         `Include real-time notifications and push alerts for engagement.`,
//       techStack: techStack.length ? techStack : ["React Native"],
//       complexity: difficultyStr === "Advanced" ? "Advanced - 6-8 weeks" : "Intermediate - 4-5 weeks",
//       features: [
//         "User authentication and detailed profiles",
//         "Feed with posts, comments, and likes",
//         "Direct messaging / chat with real-time updates",
//         "Image upload and sharing",
//         "Real-time notifications",
//         "Push notifications for friend requests and messages",
//       ],
//       learningOutcomes: [
//         `Mobile development with ${stackStr}`,
//         "Real-time features with WebSocket/Firebase",
//         "Mobile app store deployment (iOS & Android)",
//       ],
//       duration: durationStr,
//       goal: goalStr,
//     });

//     suggestions.push({
//       title: `E-Commerce Mobile Shopping App`,
//       description:
//         `Create a full-featured mobile shopping app with product catalog, cart, ` +
//         `and Stripe/Razorpay payment integration.`,
//       techStack: techStack.length ? techStack : ["Flutter"],
//       complexity: difficultyStr === "Advanced" ? "Advanced - 7-8 weeks" : "Intermediate - 5-6 weeks",
//       features: [
//         "Product browsing with advanced search and filters",
//         "Shopping cart and wishlist management",
//         "Payment gateway integration (Stripe, Razorpay, PayPal)",
//         "Order tracking and history",
//         "User reviews, ratings, and product recommendations",
//         "Push notifications for deals and order updates",
//       ],
//       learningOutcomes: [
//         "Mobile UI/UX best practices and responsive design",
//         "Payment gateway integration and security",
//         "State management and offline capabilities in mobile apps",
//       ],
//       duration: durationStr,
//       goal: goalStr,
//     });

//     suggestions.push({
//       title: `Fitness Tracker / Health App`,
//       description:
//         `Build a mobile app tracking workouts, calories, and health metrics. ` +
//         `Integrate with device APIs and provide social challenges.`,
//       techStack: techStack.length ? techStack : ["React Native"],
//       complexity: "Intermediate - 4-5 weeks",
//       features: [
//         "Workout logging with exercises, sets, and reps",
//         "Calorie/nutrition calculator with food database",
//         "Goal setting, progress visualization, and milestones",
//         "Social features (friend workouts, fitness challenges, leaderboards)",
//         "Integration with health APIs (Apple HealthKit, Google Fit)",
//         "Motivational notifications and streak tracking",
//       ],
//       learningOutcomes: [
//         "Sensor integration, permissions, and device APIs",
//         "Health data management and privacy compliance",
//         "Mobile analytics and user engagement tracking",
//       ],
//       duration: durationStr,
//       goal: goalStr,
//     });
//   } else if (isWeb) {
//     // Web development path (default & most common)
//     suggestions.push({
//       title: `${interests[0] || "SaaS"} Platform (Full-Stack ${stackStr})`,
//       description:
//         `Build a production-ready ${interests[0] || "SaaS"} product with ${stackStr}. ` +
//         `Focus on scalable architecture, auth, database design, APIs, and responsive UI.`,
//       techStack: techStack.length ? techStack : ["React", "Node.js", "MongoDB"],
//       complexity: difficultyStr === "Advanced" ? "Advanced - 6-8 weeks" : "Intermediate - 4-5 weeks",
//       features: [
//         "User authentication with JWT, sessions, and OAuth",
//         "Role-based access control (RBAC) with permissions",
//         `Core feature for ${interests[0] || "your business"}`,
//         "Advanced search, filters, and pagination",
//         "Admin dashboard with analytics and user management",
//         "Email notifications, webhooks, and third-party integrations",
//       ],
//       learningOutcomes: [
//         `Full-stack development with ${stackStr}`,
//         "Scalable database design and indexing",
//         "Security best practices (auth, validation, XSS, SQL injection protection)",
//       ],
//       duration: durationStr,
//       goal: goalStr,
//     });

//     suggestions.push({
//       title: `${interests[1] || "Community"} Portal with Real-Time Features`,
//       description:
//         `Create a ${interests[1] || "collaborative"} platform with live updates, ` +
//         `WebSocket-based messaging, and community engagement features.`,
//       techStack: techStack.length ? techStack : ["React", "Node.js", "MongoDB"],
//       complexity: difficultyStr === "Advanced" ? "Advanced - 7-8 weeks" : "Intermediate - 5-6 weeks",
//       features: [
//         "User profiles, social networking, and follower system",
//         "Real-time chat using WebSocket/Socket.io",
//         "Activity feed with posts, comments, and reactions",
//         "Notifications (email & real-time in-app)",
//         "Search and intelligent recommendation system",
//         "Admin moderation tools and content management",
//       ],
//       learningOutcomes: [
//         "Real-time systems (WebSocket, Socket.io, Redis)",
//         "Complex state management in React (Redux, Context API)",
//         "Scalable message queuing and caching",
//       ],
//       duration: durationStr,
//       goal: goalStr,
//     });

//     suggestions.push({
//       title: `Project Management / Collaboration Tool`,
//       description:
//         `Build an all-in-one collaboration platform for teams with Kanban boards, ` +
//         `tasks, calendar, file sharing, and team communication.`,
//       techStack: techStack.length ? techStack : ["React", "Node.js", "PostgreSQL"],
//       complexity: "Advanced - 7-8 weeks",
//       features: [
//         "Kanban boards with drag-drop task management",
//         "Task management with deadlines, assignments, and priorities",
//         "Team calendar and scheduling with reminders",
//         "File sharing, version control, and collaboration",
//         "Real-time team chat and mentions",
//         "Notifications, reminders, and email digests",
//       ],
//       learningOutcomes: [
//         "Complex UI interactions (drag-drop, real-time sync)",
//         "Database design for complex relationships and queries",
//         "Scalability and performance optimization (pagination, caching)",
//       ],
//       duration: durationStr,
//       goal: goalStr,
//     });
//   } else {
//     // Fallback: mixed suggestions
//     suggestions.push(generateWebDevProject(skills, interests, techStack, durationStr));
//     suggestions.push(generateMLProject(skills, interests, techStack, durationStr));
//     suggestions.push(generateDataProject(skills, interests, techStack, durationStr));
//   }

//   // Enrich all suggestions with additional metadata
//   return suggestions.map(enrichSuggestion);
// }

// module.exports = {
//   generateProjectSuggestions,
// };
