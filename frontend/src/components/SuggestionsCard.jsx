// src/components/SuggestionsCard.jsx
import React, { useState } from "react";

export default function SuggestionsCard({
  suggestion,
  onSaveForLater,
  onStart,
}) {
  const [showDetails, setShowDetails] = useState(false);
  const [showSetup, setShowSetup] = useState(false);

  const {
    title,
    description,
    techStack,
    features,
    learningOutcomes,
    difficulty,
    duration,
    tools,
    setupInstructions,
    status,
    saved,
  } = suggestion || {};

  const isInProgress = status === "in-progress";
  const isPlanned = status === "planned";

  // Split multiline setup instructions into lines for nice formatting
  const setupLines = (setupInstructions || "").split("\n");

  return (
    <div className="bg-white rounded-xl shadow border p-4 space-y-3">
      {/* Header */}
      <div className="flex justify-between items-start gap-2">
        <div>
          <h3 className="text-base font-semibold text-gray-900">
            {title || "Untitled Project"}
          </h3>
          {difficulty && (
            <p className="text-[11px] text-gray-500">
              Difficulty: <span className="font-semibold">{difficulty}</span>
              {duration && ` • Duration: ${duration}`}
            </p>
          )}
          {!difficulty && duration && (
            <p className="text-[11px] text-gray-500">
              Duration: <span className="font-semibold">{duration}</span>
            </p>
          )}
        </div>

        {/* Status pill if already saved */}
        {status && (
          <span
            className={
              "text-[10px] px-2 py-1 rounded-full border " +
              (isInProgress
                ? "bg-green-50 text-green-700 border-green-300"
                : isPlanned
                ? "bg-yellow-50 text-yellow-700 border-yellow-300"
                : "bg-gray-50 text-gray-600 border-gray-300")
            }
          >
            {status === "in-progress"
              ? "In Progress"
              : status === "completed"
              ? "Completed"
              : "Planned"}
          </span>
        )}
      </div>

      {/* Description */}
      {description && (
        <p className="text-xs text-gray-700 leading-relaxed">{description}</p>
      )}

      {/* Tech stack */}
      {Array.isArray(techStack) && techStack.length > 0 && (
        <p className="text-[11px] text-gray-500">
          Tech Stack:{" "}
          <span className="font-medium">
            {techStack.join(", ")}
          </span>
        </p>
      )}

      {/* Show details (features / learning outcomes) */}
      <button
        type="button"
        onClick={() => setShowDetails((prev) => !prev)}
        className="cursor-pointer text-[11px] text-indigo-600 hover:text-indigo-800 font-semibold"
      >
        {showDetails ? "Hide details ▲" : "View details ▼"}
      </button>

      {showDetails && (
        <div className="mt-1 space-y-2 text-xs">
          {Array.isArray(features) && features.length > 0 && (
            <div>
              <p className="font-semibold text-gray-800">Features:</p>
              <ul className="list-disc list-inside text-gray-700 space-y-0.5">
                {features.map((f, idx) => (
                  <li key={idx}>{f}</li>
                ))}
              </ul>
            </div>
          )}

          {Array.isArray(learningOutcomes) &&
            learningOutcomes.length > 0 && (
              <div>
                <p className="font-semibold text-gray-800">
                  Learning Outcomes:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-0.5">
                  {learningOutcomes.map((lo, idx) => (
                    <li key={idx}>{lo}</li>
                  ))}
                </ul>
              </div>
            )}

          {/* Tools section */}
          {Array.isArray(tools) && tools.length > 0 && (
            <div>
              <p className="font-semibold text-gray-800">Recommended Tools:</p>
              <ul className="list-disc list-inside text-gray-700 space-y-0.5">
                {tools.map((tool, idx) => (
                  <li key={idx}>{tool}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Setup / Git / Deploy instructions */}
      {setupInstructions && (
        <div className="pt-1 border-t border-gray-100 mt-2">
          <button
            type="button"
            onClick={() => setShowSetup((prev) => !prev)}
            className="cursor-pointer text-[11px] text-indigo-600 hover:text-indigo-800 font-semibold mt-1"
          >
            {showSetup
              ? "Hide setup / Git / deploy steps ▲"
              : "View setup / Git / deploy steps ▼"}
          </button>

          {showSetup && (
            <div className="mt-2 bg-gray-50 rounded-lg border border-gray-200 p-3 max-h-64 overflow-y-auto">
              <p className="text-[11px] font-semibold text-gray-800 mb-1">
                Project Setup & Deployment Guide
              </p>
              <ul className="text-[11px] text-gray-700 space-y-0.5 list-none">
                {setupLines.map((line, idx) => {
                  // Add a tiny visual formatting: headings vs plain lines
                  const trimmed = line.trim();
                  const isHeading =
                    trimmed.endsWith(":") ||
                    trimmed.startsWith("1)") ||
                    trimmed.startsWith("2)") ||
                    trimmed.startsWith("3)") ||
                    trimmed.startsWith("4)") ||
                    trimmed.startsWith("5)");

                  return (
                    <li
                      key={idx}
                      className={
                        isHeading
                          ? "mt-1 font-semibold text-gray-800"
                          : ""
                      }
                    >
                      {line}
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Action buttons */}
      <div className="flex flex-wrap gap-2 pt-2">
        <button
          type="button"
          onClick={() => onSaveForLater && onSaveForLater(suggestion)}
          disabled={saved && isPlanned}
          className={
            "cursor-pointer inline-flex items-center px-3 py-1.5 rounded-lg text-[11px] font-semibold border " +
            (saved && isPlanned
              ? "bg-gray-100 text-gray-400 border-gray-200 cursor-default"
              : "bg-white text-gray-800 border-gray-300 hover:bg-gray-50")
          }
        >
          {saved && isPlanned ? "Saved" : "Save for later"}
        </button>

        <button
          type="button"
          onClick={() => onStart && onStart(suggestion)}
          disabled={isInProgress}
          className={
            "cursor-pointer inline-flex items-center px-3 py-1.5 rounded-lg text-[11px] font-semibold " +
            (isInProgress
              ? "bg-green-100 text-green-500 cursor-default"
              : "bg-green-600 text-white hover:bg-green-700")
          }
        >
          {isInProgress ? "In progress" : "Start project"}
        </button>
      </div>
    </div>
  );
}
