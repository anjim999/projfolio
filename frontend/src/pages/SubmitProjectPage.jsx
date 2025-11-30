// frontend/src/pages/SubmitProjectPage.jsx
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axiosClient";

export default function SubmitProjectPage() {
  const { suggestionId } = useParams();
  const [githubLink, setGithubLink] = useState("");
  const [frontendUrl, setFrontendUrl] = useState("");
  const [backendUrl, setBackendUrl] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/api/submissions", {
        suggestionId,
        githubLink,
        frontendUrl,
        backendUrl,
        videoUrl,
      });
      alert("Submission saved!");
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      alert("Failed to submit project");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-xl mx-auto bg-white rounded-xl shadow border p-6 space-y-4">
        <h1 className="text-xl font-bold text-gray-800">
          Submit Project Links
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              GitHub Repository (required)
            </label>
            <input
              value={githubLink}
              onChange={(e) => setGithubLink(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500 outline-none"
              required
              placeholder="https://github.com/..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Frontend URL
            </label>
            <input
              value={frontendUrl}
              onChange={(e) => setFrontendUrl(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500 outline-none"
              placeholder="https://your-frontend.netlify.app"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Backend URL
            </label>
            <input
              value={backendUrl}
              onChange={(e) => setBackendUrl(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500 outline-none"
              placeholder="https://your-backend.onrender.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Screen Recording (Drive / YouTube)
            </label>
            <input
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500 outline-none"
              placeholder="https://drive.google.com/..."
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="cursor-pointer inline-flex items-center px-4 py-2 rounded-lg bg-green-600 text-white text-sm font-semibold shadow hover:bg-green-700 disabled:opacity-60"
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
}
