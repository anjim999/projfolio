// src/pages/AdminUserDetailsPage.jsx
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/axiosClient";
import Navbar from "../components/Navbar";
export default function AdminUserDetailsPage() {
  const params = useParams();
  const resolvedUserId = params.id || params.userId;

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [filterType, setFilterType] = useState("notReviewed"); // reviewed | notReviewed

  // review form state
  const [reviewingId, setReviewingId] = useState(null);
  const [completionPercent, setCompletionPercent] = useState("");
  const [rating, setRating] = useState("");
  const [comments, setComments] = useState("");
  const [badgeFile, setBadgeFile] = useState(null);
  const [submittingReview, setSubmittingReview] = useState(false);

  const load = async () => {
    if (!resolvedUserId) {
      console.error("❌ No user id found in route params:", params);
      alert("Invalid user URL: user id is missing.");
      return;
    }

    setLoading(true);
    try {
      const res = await api.get(`/api/admin/users/${resolvedUserId}/summary`);
      setUser(res.data.user);
      setSubmissions(res.data.submissions || []);
      setSuggestions(res.data.suggestions || []);
    } catch (err) {
      console.error("Admin user details error:", err?.response?.data || err);
      alert("Failed to load user details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resolvedUserId]);

  const openReviewForm = (submission) => {
    setReviewingId(submission._id);
    setCompletionPercent(
      submission.adminReview?.completionPercent?.toString() || ""
    );
    setRating(
      submission.adminReview?.rating
        ? submission.adminReview.rating.toString()
        : ""
    );
    setComments(submission.adminReview?.comments || "");
    setBadgeFile(null);
  };

  const resetReviewForm = () => {
    setReviewingId(null);
    setCompletionPercent("");
    setRating("");
    setComments("");
    setBadgeFile(null);
    setSubmittingReview(false);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewingId) return;

    const numericRating = Number(rating);
    if (!numericRating || numericRating < 1 || numericRating > 5) {
      alert("Rating must be between 1 and 5");
      return;
    }

    if (
      completionPercent &&
      (Number(completionPercent) < 0 || Number(completionPercent) > 100)
    ) {
      alert("Completion % must be between 0 and 100");
      return;
    }

    try {
      setSubmittingReview(true);
      const formData = new FormData();
      formData.append("rating", numericRating.toString());
      formData.append("comments", comments);
      if (completionPercent !== "") {
        formData.append("completionPercent", completionPercent.toString());
      }
      if (badgeFile) {
        formData.append("badgeFile", badgeFile);
      }

      const res = await api.patch(
        `/api/admin/submissions/${reviewingId}/review`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const updated = res.data.submission;

      // Update local submissions list
      setSubmissions((prev) =>
        prev.map((s) => (s._id === updated._id ? updated : s))
      );

      alert("Review saved");
      resetReviewForm();
    } catch (err) {
      console.error("Review submit error:", err?.response?.data || err);
      alert("Failed to save review");
      setSubmittingReview(false);
    }
  };

  if (!resolvedUserId) {
    return (
      <div className="p-6">
        <p className="text-red-600 text-sm">
          Invalid URL: user id is missing.
        </p>
      </div>
    );
  }

  if (loading) {
    return <div className="p-6">Loading user details...</div>;
  }

  if (!user) {
    return (
      <div className="p-6">
        <p className="text-red-600 text-sm">User not found.</p>
        <Link
          to="/admin/users"
          className="cursor-pointer inline-block mt-2 text-sm text-blue-600 underline"
        >
          Back to Students
        </Link>
      </div>
    );
  }

  const submissionCount = submissions.length;
  const suggestionCount = suggestions.length;

  const reviewedSubs = submissions.filter(
    (s) => s.adminReview && s.adminReview.rating
  );
  const notReviewedSubs = submissions.filter(
    (s) => !s.adminReview || !s.adminReview.rating
  );

  const shownSubs =
    filterType === "reviewed" ? reviewedSubs : notReviewedSubs;

  return (

    <>
    <Navbar />  
  
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header + back */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Student Details
            </h1>
            <p className="text-sm text-gray-500">
              {user.name} &lt;{user.email}&gt;
            </p>
          </div>
          <Link
            to="/admin/users"
            className="cursor-pointer text-sm px-4 py-2 rounded-lg bg-gray-200 text-gray-800 font-semibold hover:bg-gray-300"
          >
            Back to Students
          </Link>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl shadow border p-4">
            <p className="text-xs text-gray-500">Total Suggestions</p>
            <p className="text-lg font-semibold">{suggestionCount}</p>
          </div>
          <div className="bg-white rounded-xl shadow border p-4">
            <p className="text-xs text-gray-500">Total Submissions</p>
            <p className="text-lg font-semibold">{submissionCount}</p>
          </div>
          <div className="bg-white rounded-xl shadow border p-4">
            <p className="text-xs text-gray-500">Reviewed / Not reviewed</p>
            <p className="text-lg font-semibold">
              {reviewedSubs.length} / {notReviewedSubs.length}
            </p>
          </div>
        </div>

        {/* Submissions section with filter buttons */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-800">
              Project Submissions
            </h2>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setFilterType("notReviewed")}
                className={`cursor-pointer px-3 py-1 rounded-lg text-xs font-semibold border ${
                  filterType === "notReviewed"
                    ? "bg-orange-500 text-white border-orange-500"
                    : "bg-white text-gray-700 border-gray-300"
                }`}
              >
                Not Reviewed ({notReviewedSubs.length})
              </button>
              <button
                type="button"
                onClick={() => setFilterType("reviewed")}
                className={`cursor-pointer px-3 py-1 rounded-lg text-xs font-semibold border ${
                  filterType === "reviewed"
                    ? "bg-green-600 text-white border-green-600"
                    : "bg-white text-gray-700 border-gray-300"
                }`}
              >
                Reviewed ({reviewedSubs.length})
              </button>
            </div>
          </div>

          {shownSubs.length === 0 ? (
            <p className="text-sm text-gray-500">
              {filterType === "reviewed"
                ? "No reviewed projects yet."
                : "No projects pending review."}
            </p>
          ) : (
            shownSubs.map((sub) => (
              <div
                key={sub._id}
                className="bg-white rounded-xl shadow border p-4 space-y-2"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-800">
                      {sub.suggestionId?.title || "Untitled Project"}
                    </h3>
                    <p className="text-xs text-gray-500">
                      Submitted at:{" "}
                      {new Date(sub.createdAt).toLocaleString()}
                    </p>
                    {sub.adminReview?.completionPercent != null && (
                      <p className="text-xs text-gray-600 mt-1">
                        Completion:{" "}
                        {sub.adminReview.completionPercent}%{" "}
                      </p>
                    )}
                  </div>
                  <div className="text-xs text-gray-600 text-right">
                    {sub.adminReview?.rating ? (
                      <>
                        <p>
                          Rating:{" "}
                          <span className="font-semibold">
                            {sub.adminReview.rating} ⭐
                          </span>
                        </p>
                        {sub.adminReview.badgeFileUrl && (
                          <a
                            href={sub.adminReview.badgeFileUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-blue-600 underline block"
                          >
                            View Badge
                          </a>
                        )}
                        {sub.adminReview.comments && (
                          <p className="mt-1 text-[11px] text-gray-500">
                            {sub.adminReview.comments}
                          </p>
                        )}
                      </>
                    ) : (
                      <span className="text-orange-500 font-semibold">
                        Not reviewed
                      </span>
                    )}
                  </div>
                </div>

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

                {/* Review button only on NOT REVIEWED tab */}
                {!sub.adminReview?.rating && filterType === "notReviewed" && (
                  <button
                    type="button"
                    onClick={() => openReviewForm(sub)}
                    className="cursor-pointer mt-2 inline-flex items-center px-3 py-1 rounded-lg bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700"
                  >
                    Review
                  </button>
                )}
              </div>
            ))
          )}
        </section>

        {/* Review form (shown when reviewingId is set) */}
        {reviewingId && (
          <section className="bg-white rounded-xl shadow border p-4 space-y-3">
            <h3 className="text-sm font-semibold text-gray-800">
              Review Submission
            </h3>
            <form
              className="space-y-3"
              onSubmit={handleReviewSubmit}
              encType="multipart/form-data"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Completion Percentage (0–100)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={completionPercent}
                    onChange={(e) => setCompletionPercent(e.target.value)}
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500 outline-none"
                    placeholder="e.g., 80"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Rating (1–5)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500 outline-none"
                    placeholder="e.g., 4"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Badge File (image or PDF)
                </label>
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={(e) => setBadgeFile(e.target.files[0] || null)}
                  className="w-full text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Comments
                </label>
                <textarea
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  rows={3}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="Share your feedback about this project..."
                />
              </div>

              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={resetReviewForm}
                  className="cursor-pointer px-4 py-2 rounded-lg text-xs font-semibold border border-gray-300 bg-white text-gray-700 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingReview}
                  className="cursor-pointer px-4 py-2 rounded-lg text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-60"
                >
                  {submittingReview ? "Saving..." : "Save Review"}
                </button>
              </div>
            </form>
          </section>
        )}
      </div>
    </div>
    </>
  );
}
