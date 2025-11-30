// src/pages/GenerateSuggestionsPage.jsx
import { useState, useMemo } from "react";
import api from "../api/axiosClient";
import SuggestionsCard from "../components/SuggestionsCard";
import Navbar from "../components/Navbar";

const SKILL_OPTIONS = [
  "HTML",
  "CSS",
  "JavaScript",
  "TypeScript",
  "React",
  "Redux",
  "Next.js",
  "Node.js",
  "Express.js",
  "MongoDB",
  "Mongoose",
  "PostgreSQL",
  "MySQL",
  "REST APIs",
  "GraphQL",
  "Git",
  "GitHub",
  "Docker",
  "Kubernetes",
  "CI/CD",
  "Linux",
  "Tailwind CSS",
  "Bootstrap",
  "Material UI",
  "Jest",
  "React Testing Library",
  "Cypress",
  "Python",
  "Django",
  "Flask",
  "FastAPI",
  "Pandas",
  "NumPy",
  "Scikit-learn",
  "TensorFlow",
  "PyTorch",
  "Machine Learning",
  "Deep Learning",
  "Data Structures & Algorithms",
  "OOP",
  "System Design (Basics)",
  "AWS (Basics)",
  "Azure (Basics)",
  "GCP (Basics)",
  "Firebase",
  "Android (Basics)",
  "React Native",
  "Figma (UI Design)",
  "SQL",
  "NoSQL",
];

const LEVEL_OPTIONS = ["Beginner", "Intermediate", "Advanced"];

const INTEREST_OPTIONS = [
  "Full Stack Web",
  "Frontend",
  "Backend",
  "APIs & Microservices",
  "AI / ML",
  "Data Science",
  "Data Engineering",
  "EduTech",
  "FinTech",
  "Productivity Tools",
  "Dashboards / Analytics",
  "DevOps",
  "Cloud Projects",
];

const GOAL_OPTIONS = [
  "Job-ready portfolio",
  "Resume projects",
  "Learning practice",
  "Crack interviews",
  "College mini project",
];

export default function GenerateSuggestionsPage() {
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [skillSearch, setSkillSearch] = useState("");

  const [level, setLevel] = useState("Intermediate");
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [techStack, setTechStack] = useState("MERN");
  const [duration, setDuration] = useState("");
  const [goal, setGoal] = useState("");
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);

  const filteredSkills = useMemo(() => {
    const term = skillSearch.trim().toLowerCase();
    if (!term) return SKILL_OPTIONS;
    return SKILL_OPTIONS.filter((s) =>
      s.toLowerCase().includes(term)
    );
  }, [skillSearch]);

  const toggleSkill = (skill) => {
    setSelectedSkills((prev) =>
      prev.includes(skill)
        ? prev.filter((s) => s !== skill)
        : [...prev, skill]
    );
  };

  const toggleInterest = (interest) => {
    setSelectedInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest]
    );
  };

  const toArray = (text) =>
    text
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

  const handleGenerate = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post("/api/suggestions/generate", {
        skills: selectedSkills,
        level,
        interests: selectedInterests,
        techStack: toArray(techStack),
        duration,
        goal,
      });

      const data = res.data;
      let list = [];
      if (Array.isArray(data)) {
        list = data;
      } else if (Array.isArray(data.suggestions)) {
        list = data.suggestions;
      }

      const hydrated = (list || []).map((s) => ({
        ...s,
        saved: false,
        status: s.status || null,
      }));

      setSuggestions(hydrated);
    } catch (err) {
      console.error("Generate error:", err?.response?.data || err);
      alert("Failed to generate suggestions");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveForLater = async (suggestion) => {
    try {
      const payload = {
        title: suggestion.title,
        description: suggestion.description,
        techStack: suggestion.techStack,
        features: suggestion.features,
        learningOutcomes: suggestion.learningOutcomes,
        duration: suggestion.duration,
        level: suggestion.difficulty || level,
        tools: suggestion.tools,
        setupInstructions: suggestion.setupInstructions,
        status: "generated",
      };

      const res = await api.post("/api/suggestions", payload);
      const saved = res.data;

      setSuggestions((prev) =>
        prev.map((s) =>
          s === suggestion
            ? {
                ...s,
                _id: saved._id,
                saved: true,
                status: saved.status,
              }
            : s
        )
      );

      alert("Saved for later. You can see it in your dashboard/history.");
    } catch (err) {
      console.error("Save for later error:", err?.response?.data || err);
      alert("Failed to save suggestion");
    }
  };

  const handleStart = async (suggestion) => {
    try {
      const payload = {
        title: suggestion.title,
        description: suggestion.description,
        techStack: suggestion.techStack,
        features: suggestion.features,
        learningOutcomes: suggestion.learningOutcomes,
        duration: suggestion.duration,
        level: suggestion.difficulty || level,
        tools: suggestion.tools,
        setupInstructions: suggestion.setupInstructions,
        status: "in-progress",
      };

      const res = await api.post("/api/suggestions", payload);
      const saved = res.data;

      setSuggestions((prev) =>
        prev.map((s) =>
          s === suggestion
            ? {
                ...s,
                _id: saved._id,
                saved: true,
                status: saved.status, 
              }
            : s
        )
      );

      alert("Project started! Check your dashboard under In-Progress.");
    } catch (err) {
      console.error("Start project error:", err?.response?.data || err);
      alert("Failed to start project");
    }
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <h1 className="text-2xl font-bold text-gray-800">
            AI Project Suggestions for Your Portfolio
          </h1>
          <p className="text-sm text-gray-500">
            Select your skills, level, interests and goal. Generate 2–3
            projects, then <b>Save</b> or <b>Start</b> to store them in your
            history.
          </p>

          <form
            onSubmit={handleGenerate}
            className="bg-white rounded-xl shadow border p-4 space-y-5"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Your Skills (search & select)
              </label>
              <input
                type="text"
                value={skillSearch}
                onChange={(e) => setSkillSearch(e.target.value)}
                placeholder="Search skills (React, Node, MongoDB, Python...)"
                className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500 outline-none mb-2"
              />
              <div className="max-h-40 overflow-y-auto border rounded-lg p-2 grid grid-cols-2 gap-1 text-xs">
                {filteredSkills.map((skill) => {
                  const active = selectedSkills.includes(skill);
                  return (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => toggleSkill(skill)}
                      className={
                        "cursor-pointer inline-flex items-center justify-center px-2 py-1 rounded-md border text-[11px] " +
                        (active
                          ? "bg-blue-600 text-white border-blue-600"
                          : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50")
                      }
                    >
                      {skill}
                    </button>
                  );
                })}
              </div>
              {selectedSkills.length > 0 && (
                <p className="text-[11px] text-gray-500 mt-1">
                  Selected: {selectedSkills.join(", ")}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Your Level
                </label>
                <select
                  value={level}
                  onChange={(e) => setLevel(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
                >
                  {LEVEL_OPTIONS.map((lvl) => (
                    <option key={lvl}>{lvl}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Interests (select multiple)
                </label>
                <div className="border rounded-lg p-2 max-h-32 overflow-y-auto text-xs space-y-1">
                  {INTEREST_OPTIONS.map((interest) => {
                    const active = selectedInterests.includes(interest);
                    return (
                      <label
                        key={interest}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={active}
                          onChange={() => toggleInterest(interest)}
                          className="w-3 h-3"
                        />
                        <span>{interest}</span>
                      </label>
                    );
                  })}
                </div>
                {selectedInterests.length > 0 && (
                  <p className="text-[11px] text-gray-500 mt-1">
                    Selected: {selectedInterests.join(", ")}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Preferred Tech Stack
                </label>
                <input
                  value={techStack}
                  onChange={(e) => setTechStack(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="MERN, Django + React, etc."
                />
                <p className="text-[11px] text-gray-400 mt-1">
                  For this assignment, you can keep it as <b>MERN</b>.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Duration / Timeline
                </label>
                <input
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="7 days, 2 weeks, 1 month"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Objective / Goal
              </label>
              <select
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
              >
                <option value="">Select goal</option>
                {GOAL_OPTIONS.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="cursor-pointer inline-flex items-center px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold shadow hover:bg-blue-700 disabled:opacity-60"
            >
              {loading ? "Generating..." : "Generate Project Ideas"}
            </button>
          </form>

          {suggestions.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-800">
                Generated Suggestions
              </h2>

              <div className="space-y-3">
                {suggestions.map((s, index) => (
                  <SuggestionsCard
                    key={s._id || index}
                    suggestion={s}
                    onSaveForLater={handleSaveForLater}
                    onStart={handleStart}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
