// src/pages/HistoryPage.jsx
import { useEffect, useState } from "react";
import api from "../api/axiosClient";
import Navbar from "../components/Navbar";
import { toast } from "react-toastify";

export default function HistoryPage() {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get("/api/suggestions/my");
        setSuggestions(res.data || []);
      } catch (err) {
        console.error("History load error:", err);
        toast.error("Failed to load project history", { autoClose: 1000 });
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <div className="p-6">Loading...</div>;

  const saved = suggestions.filter((s) => s.status === "generated");
  const inProgress = suggestions.filter((s) => s.status === "in-progress");

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
      toast.success("Project marked as in-progress! You can now work and submit it.", { autoClose: 1000 }); // ADDED: Toastify
    } catch (err) {
      console.error("Start from history error:", err?.response?.data || err);
      toast.error("Failed to update project status", { autoClose: 1000 }); // ADDED: Toastify
    }
  };

  const renderSuggestionCard = (s, mode) => {
    return (
      <div
        key={s._id}
        className="bg-white rounded-xl border shadow p-4 space-y-3"
      >
        <div className="flex justify-between items-start gap-2">
          <div>
            <h3 className="font-semibold text-gray-900 text-base">
              {s.title || "Untitled Project"}
          </h3>
          <p className="text-xs text-gray-600 mt-1">
            {s.description}
          </p>
          </div>
          <span
            className={`px-2 py-1 rounded-full text-[10px] font-semibold ${
              s.status === "generated"
                ? "bg-yellow-100 text-yellow-800"
                : s.status === "in-progress"
                ? "bg-blue-100 text-blue-800"
                : "bg-green-100 text-green-800"
            }`}
          >
            {s.status}
          </span>
        </div>

        {Array.isArray(s.techStack) && s.techStack.length > 0 && (
          <div>
            <p className="text-[11px] font-semibold text-gray-700 mb-1">
              Tech stack
            </p>
            <div className="flex flex-wrap gap-1">
              {s.techStack.map((t, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded-full bg-slate-100 text-[11px] text-slate-700"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        )}

        {Array.isArray(s.features) && s.features.length > 0 && (
          <div>
            <p className="text-[11px] font-semibold text-gray-700 mb-1">
              Features
            </p>
            <ul className="list-disc list-inside space-y-0.5 text-[11px] text-gray-700">
              {s.features.map((f, idx) => (
                <li key={idx}>{f}</li>
              ))}
            </ul>
          </div>
        )}

        {Array.isArray(s.learningOutcomes) && s.learningOutcomes.length > 0 && (
          <div>
            <p className="text-[11px] font-semibold text-gray-700 mb-1">
              Learning outcomes
            </p>
            <ul className="list-disc list-inside space-y-0.5 text-[11px] text-gray-700">
              {s.learningOutcomes.map((l, idx) => (
                <li key={idx}>{l}</li>
              ))}
            </ul>
          </div>
        )}

        {Array.isArray(s.tools) && s.tools.length > 0 && (
          <div>
            <p className="text-[11px] font-semibold text-gray-700 mb-1">
              Recommended tools
            </p>
            <div className="flex flex-wrap gap-1">
              {s.tools.map((t, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded-full bg-indigo-50 text-[11px] text-indigo-700"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        )}

        {s.setupInstructions && (
          <div>
            <details className="group">
              <summary className="cursor-pointer text-[11px] font-semibold text-indigo-600 group-hover:text-indigo-700">
                View setup & deployment guide
              </summary>
              <pre className="mt-1 bg-slate-50 rounded-md p-2 text-[11px] whitespace-pre-wrap text-slate-800 overflow-x-auto">
                {s.setupInstructions}
              </pre>
            </details>
          </div>
        )}

        <div className="flex flex-wrap items-center gap-3 text-[11px] text-gray-600">
          {s.duration && (
            <span>
              <span className="font-semibold">Duration:</span> {s.duration}
            </span>
          )}
          {s.level && (
            <span>
              <span className="font-semibold">Level:</span> {s.level}
            </span>
          )}
        </div>

        <div className="flex justify-end gap-2 pt-2">
          {mode === "saved" && (
            <button
              type="button"
              onClick={() => handleStart(s._id)}
              className="cursor-pointer px-3 py-1.5 rounded-lg bg-blue-600 text-white text-[11px] font-semibold hover:bg-blue-700"
            >
              Start Project
            </button>
          )}

          {mode === "in-progress" && (
            <a
              href={`/submit/${s._id}`}
              className="cursor-pointer px-3 py-1.5 rounded-lg bg-green-600 text-white text-[11px] font-semibold hover:bg-green-700"
            >
              Submit Project
            </a>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-50 p-6 mt-12">
        <div className="max-w-5xl mx-auto space-y-6">
          <h1 className="text-2xl font-bold text-gray-800">History</h1>

          {/* SAVED FOR LATER */}
          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-gray-700">
              Saved for Later
            </h2>

            {saved.length === 0 ? (
              <p className="text-sm text-gray-500">
                No saved projects yet. Go to "Generate" and click "Save for
                later" or "Start project".
              </p>
            ) : (
              <div className="space-y-3">
                {saved.map((s) => renderSuggestionCard(s, "saved"))}
              </div>
            )}
          </section>

          {/* IN-PROGRESS */}
          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-gray-700">
              In-Progress Projects
            </h2>

            {inProgress.length === 0 ? (
              <p className="text-sm text-gray-500">
                No projects in progress. Start one from "Saved for later" or
                from the Generate page.
              </p>
            ) : (
              <div className="space-y-3">
                {inProgress.map((s) => renderSuggestionCard(s, "in-progress"))}
              </div>
            )}
          </section>
        </div>
      </div>
    </>
  );
}