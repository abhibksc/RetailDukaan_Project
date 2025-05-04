import React, { useState } from "react";

const ExpandableText = ({ text, limit = 6 }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!text) return null;

  const truncatedText = text.length > limit ? `${text.substring(0, limit)}` : text;

  return (
    <div>
      <span>{isExpanded ? text : truncatedText}</span>
      {text.length > limit && (
        <button
          className="ml-2 text-blue-500 hover:underline"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? "..." : "..."}
        </button>
      )}
    </div>
  );
};

export default ExpandableText;
