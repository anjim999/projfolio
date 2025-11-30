// src/pages/GenerateSuggestionsPage.jsx
import { useState } from "react";
import api from "../api/axiosClient";
import SuggestionsCard from "../components/SuggestionsCard";

export default function GenerateSuggestionsPage() {
  const [skills, setSkills] = useState("");
  const [interests, setInterests] = useState("");
  const [techStack, setTechStack] = useState("");
  const [duration, setDuration] = useState("");
  const [goal, setGoal] = useState("");
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);

  const handleGenerate = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post("/api/suggestions/generate", {
        skills: skills
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        interests: interests
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        techStack: techStack
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        duration,
        goal,
      });

      console.log("Generate response:", res.data);

      const data = res.data;

      // 🔹 Handle both cases: array OR { suggestions: [...] }
      let list = [];
      if (Array.isArray(data)) {
        list = data;
      } else if (Array.isArray(data.suggestions)) {
        list = data.suggestions;
      }

      setSuggestions(list);
    } catch (err) {
      console.error("Generate error:", err?.response?.data || err);
      alert("Failed to generate suggestions");
    } finally {
      setLoading(false);
    }
  };

  const handleStart = async (id) => {
    try {
      await api.patch(`/api/suggestions/${id}/status`, {
        status: "in-progress",
      });
      setSuggestions((prev) =>
        prev.map((s) =>
          s._id === id ? { ...s, status: "in-progress" } : s
        )
      );
      alert("Marked as in-progress. Check dashboard.");
    } catch (err) {
      console.error("Start project error:", err?.response?.data || err);
      alert("Failed to mark as in-progress");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Generate AI Project Suggestions
        </h1>

        {/* Form */}
        <form
          onSubmit={handleGenerate}
          className="bg-white rounded-xl shadow border p-4 space-y-4"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Skills (comma separated)
            </label>
            <input
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500 outline-none"
              placeholder="React, Node.js, MongoDB"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Interests (comma separated)
            </label>
            <input
              value={interests}
              onChange={(e) => setInterests(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500 outline-none"
              placeholder="EdTech, AI, Finance"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Preferred Tech Stack
            </label>
            <input
              value={techStack}
              onChange={(e) => setTechStack(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500 outline-none"
              placeholder="MERN, Django, Power BI"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Duration / Timeline
              </label>
              <input
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder="2 weeks, 1 month"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Goal
              </label>
              <input
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder="Job-ready projects, resume building..."
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="cursor-pointer inline-flex items-center px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold shadow hover:bg-blue-700 disabled:opacity-60"
          >
            {loading ? "Generating..." : "Generate"}
          </button>
        </form>

        {/* Suggestions */}
        {suggestions.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-800">
              Generated Suggestions
            </h2>

            <div className="space-y-3">
              {suggestions.map((s) => (
                <SuggestionsCard
                  key={s._id}
                  suggestion={s}
                  onStart={handleStart}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
