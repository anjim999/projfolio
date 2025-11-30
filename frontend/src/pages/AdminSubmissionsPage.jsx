// frontend/src/pages/AdminSubmissionsPage.jsx
import { useEffect, useState } from "react";
import api from "../api/axiosClient";

export default function AdminSubmissionsPage() {
  const [subs, setSubs] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/admin/submissions");
      setSubs(res.data || []);
    } catch (err) {
      console.error(err);
      alert("Failed to load submissions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleReview = async (id) => {
    const rating = Number(prompt("Enter rating 1-5:"));
    const badge = prompt("Enter badge (e.g., Excellent, Good):");
    const comments = prompt("Comments:");

    if (!rating) return;

    try {
      await api.patch(`/api/admin/submissions/${id}/review`, {
        rating,
        badge,
        comments,
      });
      alert("Review saved");
      load();
    } catch (err) {
      console.error(err);
      alert("Failed to save review");
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6 mt-10">
      <div className="max-w-5xl mx-auto space-y-4">
        <h1 className="text-2xl font-bold text-gray-800">
          Admin - Project Submissions
        </h1>

        {subs.length === 0 ? (
          <p className="text-sm text-gray-500">No submissions yet.</p>
        ) : (
          <div className="space-y-3">
            {subs.map((sub) => (
              <div
                key={sub._id}
                className="bg-white rounded-xl shadow border p-4 space-y-1"
              >
                <p className="text-sm text-gray-800 font-semibold">
                  {sub.suggestionId?.title || "Untitled"}
                </p>
                <p className="text-xs text-gray-500">
                  Student: {sub.userId?.name} ({sub.userId?.email})
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

                {sub.adminReview?.rating ? (
                  <p className="text-xs text-green-700">
                    Rating: {sub.adminReview.rating} ⭐ | Badge:{" "}
                    {sub.adminReview.badge || "N/A"}
                  </p>
                ) : (
                  <button
                    onClick={() => handleReview(sub._id)}
                    className="cursor-pointer mt-2 inline-flex items-center px-3 py-1 rounded-lg bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700"
                  >
                    Review & Rate
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
