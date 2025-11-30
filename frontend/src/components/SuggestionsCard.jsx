// src/components/SuggestionCard.jsx
export default function SuggestionsCard({ suggestion, onStart }) {
  const {
    _id,
    title,
    description,
    setupInstructions,
    features = [],
    learningOutcomes = [],
    level,
    duration,
    status,
  } = suggestion;

  return (
    <div className="bg-white rounded-xl shadow border p-4 space-y-2">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-gray-800">
          {title || "Untitled"}
        </h3>
        <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">
          {status || level || "Suggestion"}
        </span>
      </div>

      {description && (
        <p className="text-sm text-gray-600">{description}</p>
      )}

      {setupInstructions && (
        <p className="text-xs text-gray-500">
          <span className="font-semibold">Setup:</span>{" "}
          {setupInstructions}
        </p>
      )}

      {duration && (
        <p className="text-xs text-gray-500">
          <span className="font-semibold">Duration:</span> {duration}
        </p>
      )}

      {features.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-gray-700">
            Features:
          </p>
          <ul className="list-disc pl-5 text-xs text-gray-600">
            {features.map((f, idx) => (
              <li key={idx}>{f}</li>
            ))}
          </ul>
        </div>
      )}

      {learningOutcomes.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-gray-700">
            Learning Outcomes:
          </p>
          <ul className="list-disc pl-5 text-xs text-gray-600">
            {learningOutcomes.map((o, idx) => (
              <li key={idx}>{o}</li>
            ))}
          </ul>
        </div>
      )}

      {onStart && status === "generated" && (
        <button
          onClick={() => onStart(_id)}
          className="cursor-pointer mt-2 inline-flex items-center px-3 py-1 rounded-lg bg-green-600 text-white text-xs font-semibold hover:bg-green-700"
        >
          Start This Project
        </button>
      )}
    </div>
  );
}
