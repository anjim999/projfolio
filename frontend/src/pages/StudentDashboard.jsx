// frontend/src/pages/StudentDashboard.jsx
import { useEffect, useState } from "react";
import api from "../api/axiosClient";
import Navbar from "../components/Navbar";
import { toast } from "react-toastify";

export default function StudentDashboard() {
  const [suggestions, setSuggestions] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedReviewId, setExpandedReviewId] = useState(null);
  const [submissionFilter, setSubmissionFilter] = useState("submitted");
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
        console.error("Dashboard load error:", err);
        toast.error("Failed to load dashboard data", { autoClose: 1000 });
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <div className="p-6">Loading...</div>;

  const inProgress = suggestions.filter((s) => s.status === "in-progress");
  const completed = suggestions.filter((s) => s.status === "completed");

  const toggleReview = (id) => {
    setExpandedReviewId((prev) => (prev === id ? null : id));
  };

  const reviewedSubs = submissions.filter(
    (sub) => sub.adminReview && sub.adminReview.rating
  );

  const visibleSubs =
    submissionFilter === "reviewed" ? reviewedSubs : submissions;

  return (
    <>
      <Navbar />
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
            <h2 className="text-lg font-semibold mb-2">
              In-Progress Projects
            </h2>
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
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-semibold">
                Completed Projects & Reviews
              </h2>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setSubmissionFilter("submitted")}
                  className={`cursor-pointer px-3 py-1 rounded-lg text-xs font-semibold border ${
                    submissionFilter === "submitted"
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-gray-700 border-gray-300"
                  }`}
                >
                  Submitted ({submissions.length})
                </button>
                <button
                  type="button"
                  onClick={() => setSubmissionFilter("reviewed")}
                  className={`cursor-pointer px-3 py-1 rounded-lg text-xs font-semibold border ${
                    submissionFilter === "reviewed"
                      ? "bg-green-600 text-white border-green-600"
                      : "bg-white text-gray-700 border-gray-300"
                  }`}
                >
                  Reviewed ({reviewedSubs.length})
                </button>
              </div>
            </div>

            {visibleSubs.length === 0 ? (
              <p className="text-sm text-gray-500">
                {submissionFilter === "reviewed"
                  ? "No reviewed projects yet."
                  : "No completed project submissions yet."}
              </p>
            ) : (
              <div className="space-y-3">
                {visibleSubs.map((sub) => {
                  const review = sub.adminReview;
                  const isExpanded = expandedReviewId === sub._id;

                  return (
                    <div
                      key={sub._id}
                      className="bg-white rounded-xl shadow border p-4 space-y-2"
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
                          rel="noreferrer"
                          className="text-blue-600 underline"
                        >
                          GitHub
                        </a>
                        {sub.frontendUrl && (
                          <a
                            href={sub.frontendUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-blue-600 underline"
                          >
                            Frontend
                          </a>
                        )}
                        {sub.backendUrl && (
                          <a
                            href={sub.backendUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-blue-600 underline"
                          >
                            Backend
                          </a>
                        )}
                        {sub.videoUrl && (
                          <a
                            href={sub.videoUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-blue-600 underline"
                          >
                            Video
                          </a>
                        )}
                      </div>

                      {review?.rating ? (
                        <div className="flex items-center justify-between mt-1">
                          <p className="text-xs text-green-700 font-semibold">
                            Rating: {review.rating} / 5
                          </p>
                          <button
                            type="button"
                            onClick={() => toggleReview(sub._id)}
                            className="cursor-pointer text-[11px] px-3 py-1 rounded-lg border border-indigo-500 text-indigo-600 hover:bg-indigo-50"
                          >
                            {isExpanded ? "Hide Review" : "View Review"}
                          </button>
                        </div>
                      ) : (
                        <p className="text-xs text-orange-600 mt-1">
                          Waiting for admin review.
                        </p>
                      )}

                      {review?.rating && isExpanded && (
                        <div className="mt-2 border-t border-gray-100 pt-2 text-xs space-y-1">
                          {review.comments && (
                            <p>
                              <span className="font-semibold">Comments:</span>{" "}
                              {review.comments}
                            </p>
                          )}

                          {review.badgeFileUrl ? (
                            <div className="mt-3 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                              <p className="font-semibold text-xs mb-3 text-gray-800">
                                Badge / Certificate:
                              </p>

                              {review.badgeFileUrl.match(
                                /\.(jpg|jpeg|png|gif)$/i
                              ) ? (
                                <div className="flex justify-center">
                                  <img
                                    src={review.badgeFileUrl}
                                    alt="Badge Certificate"
                                    className="max-w-sm h-auto rounded-lg border-2 border-white shadow-lg"
                                    onError={(e) => {
                                      console.error("Image failed to load:", review.badgeFileUrl);
                                      e.target.innerHTML = "Image failed to load";
                                    }}
                                  />
                                </div>
                              ) : (
                                <a
                                  href={review.badgeFileUrl}
                                  download
                                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 transition"
                                >
                                  Download Certificate
                                </a>
                              )}
                            </div>
                          ) : (
                            <p className="text-xs text-gray-400 mt-2">No badge file</p>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </div>
      </div>
    </>
  );
}