// frontend/src/pages/StudentDashboard.jsx
import { useEffect, useState } from "react";
import api from "../api/axiosClient";

export default function StudentDashboard() {
  const [suggestions, setSuggestions] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [sRes, subRes] = await Promise.all([
          api.get("/api/suggestions/my"),
          api.get("/api/submissions/my"),
        ]);
        setSuggestions(sRes.data || []);
        setSubmissions(subRes.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <div className="p-6">Loading...</div>;

  const inProgress = suggestions.filter((s) => s.status === "in-progress");
  const completed = suggestions.filter((s) => s.status === "completed");

  return (
    <div className="min-h-screen bg-gray-50 p-6 mt-12">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">
            Student Dashboard
          </h1>
          <a
            href="/suggestions/new"
            className="cursor-pointer inline-flex items-center px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold shadow hover:bg-blue-700"
          >
            Generate New Suggestions
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-white rounded-xl shadow border">
            <p className="text-sm text-gray-500">Total Suggestions</p>
            <p className="text-2xl font-bold">{suggestions.length}</p>
          </div>
          <div className="p-4 bg-white rounded-xl shadow border">
            <p className="text-sm text-gray-500">In-Progress Projects</p>
            <p className="text-2xl font-bold">{inProgress.length}</p>
          </div>
          <div className="p-4 bg-white rounded-xl shadow border">
            <p className="text-sm text-gray-500">Completed Projects</p>
            <p className="text-2xl font-bold">{completed.length}</p>
          </div>
        </div>

        <section>
          <h2 className="text-lg font-semibold mb-2">In-Progress Projects</h2>
          {inProgress.length === 0 ? (
            <p className="text-sm text-gray-500">
              No projects in progress. Start one from suggestions.
            </p>
          ) : (
            <div className="space-y-3">
              {inProgress.map((s) => (
                <div
                  key={s._id}
                  className="bg-white rounded-xl shadow border p-4 flex justify-between"
                >
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      {s.title || "Untitled"}
                    </h3>
                    <p className="text-xs text-gray-500">
                      {s.description?.slice(0, 120)}...
                    </p>
                  </div>
                  <a
                    href={`/submit/${s._id}`}
                    className="cursor-pointer text-xs px-3 py-1 rounded-lg bg-green-600 text-white font-semibold self-center"
                  >
                    Submit Project
                  </a>
                </div>
              ))}
            </div>
          )}
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-2">Completed Projects</h2>
          {submissions.length === 0 ? (
            <p className="text-sm text-gray-500">
              No completed project submissions yet.
            </p>
          ) : (
            <div className="space-y-3">
              {submissions.map((sub) => (
                <div
                  key={sub._id}
                  className="bg-white rounded-xl shadow border p-4"
                >
                  <h3 className="font-semibold text-gray-800">
                    {sub.suggestionId?.title || "Untitled"}
                  </h3>
                  <p className="text-xs text-gray-500 mb-1">
                    {sub.suggestionId?.description?.slice(0, 120)}...
                  </p>
                  <div className="text-xs space-x-2">
                    <a
                      href={sub.githubLink}
                      target="_blank"
                      className="text-blue-600 underline"
                    >
                      GitHub
                    </a>
                    {sub.frontendUrl && (
                      <a
                        href={sub.frontendUrl}
                        target="_blank"
                        className="text-blue-600 underline"
                      >
                        Frontend
                      </a>
                    )}
                    {sub.backendUrl && (
                      <a
                        href={sub.backendUrl}
                        target="_blank"
                        className="text-blue-600 underline"
                      >
                        Backend
                      </a>
                    )}
                    {sub.videoUrl && (
                      <a
                        href={sub.videoUrl}
                        target="_blank"
                        className="text-blue-600 underline"
                      >
                        Video
                      </a>
                    )}
                  </div>
                  {sub.adminReview?.rating && (
                    <p className="text-xs text-green-700 mt-1">
                      Rating: {sub.adminReview.rating} ⭐ | Badge:{" "}
                      {sub.adminReview.badge || "N/A"}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
