// src/components/ReviewModal.jsx
import React from "react";

export default function ReviewModal({
  submission,
  isOpen,
  onClose,
  onSubmit,
  completionPercent,
  setCompletionPercent,
  rating,
  setRating,
  comments,
  setComments,
  badgeFile,
  setBadgeFile,
  submittingReview,
}) {
  if (!isOpen) return null;

  // The submission title is used in the modal header
  const title = submission?.suggestionId?.title || "Untitled Project";

  // --- FUNCTION: Handle badge file removal ---
  const handleRemoveBadge = () => {
    // This clears the state
    setBadgeFile(null);
    // Clear the file input value visually
    const fileInput = document.getElementById("badge-file-input");
    if (fileInput) {
      fileInput.value = "";
    }
  };

  // Optional: A simple click outside handler to close the modal
  const handleOverlayClick = (e) => {
    if (e.target.id === "modal-overlay") {
      onClose();
    }
  };

  return (
    // Modal Overlay (Full screen, fixed, semi-transparent background)
    <div
      id="modal-overlay"
      className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 transition-opacity duration-300"
      onClick={handleOverlayClick}
    >
      {/* Modal Container */}
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden transform transition-all duration-300 scale-100 opacity-100">
        
        {/* Modal Header */}
        <div className="px-6 py-4 bg-indigo-600 text-white flex justify-between items-center">
          <h3 className="text-xl font-bold">
            Review: {title}
          </h3>
          <button
            type="button"
            onClick={onClose}
            // ADDED: cursor-pointer
            className="text-white hover:text-indigo-200 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>
        </div>

        {/* Modal Body (Form) */}
        <form className="p-6 space-y-4" onSubmit={onSubmit} encType="multipart/form-data">
          
          {/* Submission Info Links */}
          <div className="text-sm space-x-4 border-b pb-4">
              <span className="font-semibold text-gray-700">Links:</span>
              <a href={submission.githubLink} target="_blank" rel="noreferrer" className="text-blue-600 hover:text-blue-800 underline cursor-pointer">GitHub</a>
              {submission.frontendUrl && <a href={submission.frontendUrl} target="_blank" rel="noreferrer" className="text-blue-600 hover:text-blue-800 underline cursor-pointer">Frontend</a>}
              {submission.backendUrl && <a href={submission.backendUrl} target="_blank" rel="noreferrer" className="text-blue-600 hover:text-blue-800 underline cursor-pointer">Backend</a>}
              {submission.videoUrl && <a href={submission.videoUrl} target="_blank" rel="noreferrer" className="text-blue-600 hover:text-blue-800 underline cursor-pointer">Video</a>}
          </div>


          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Completion Percentage (0–100)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={completionPercent}
                onChange={(e) => setCompletionPercent(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-base focus:ring-indigo-500 focus:border-indigo-500 outline-none transition duration-150"
                placeholder="e.g., 80"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rating (1-5)
              </label>
              <input
                type="number"
                min="1"
                max="5"
                value={rating}
                onChange={(e) => setRating(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-base focus:ring-indigo-500 focus:border-indigo-500 outline-none transition duration-150"
                placeholder="e.g., 4"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Badge File (optional - image or PDF)
            </label>
            <div className="flex items-center gap-2">
              <input
                id="badge-file-input"
                type="file"
                accept="image/*,application/pdf"
                onChange={(e) => setBadgeFile(e.target.files[0] || null)}
                // RESTORED ORIGINAL STYLING:
                className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
              />
              {/* --- CORRECTED: Delete Icon at the end of the file line --- */}
              {badgeFile && (
                <button
                  type="button"
                  onClick={handleRemoveBadge}
                  // ADDED: cursor-pointer
                  className="p-1 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition duration-150 flex items-center justify-center shrink-0 cursor-pointer"
                  aria-label="Remove badge file"
                  title={`Remove ${badgeFile.name}`}
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    ></path>
                  </svg>
                </button>
              )}
            </div>
            {/* REMOVED: The extra line displaying badgeFile.name */}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Comments
            </label>
            <textarea
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              rows={4}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-indigo-500 focus:border-indigo-500 outline-none transition duration-150"
              placeholder="Share your detailed feedback about this project..."
            />
          </div>

          {/* Modal Footer (Actions) */}
          <div className="flex gap-3 justify-end pt-2 border-t">
            <button
              type="button"
              onClick={onClose}
              // ADDED: cursor-pointer
              className="px-4 py-2 rounded-lg text-sm font-semibold border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 transition duration-150 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submittingReview}
              // ADDED: cursor-pointer (for non-disabled state)
              className="px-4 py-2 rounded-lg text-sm font-semibold bg-indigo-600 text-white hover:bg-indigo-700 transition duration-150 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
            >
              {submittingReview ? "Saving..." : "Save Review"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}