import React from "react";
import LabelCard from "./LabelCard";
import { useLabels } from "../contexts/labelsContext";

const LabelList: React.FC = () => {
  const { labels, selectedSessionId } = useLabels();

  if (!selectedSessionId) {
    return (
      <div className="no-result-container">
        <p id="select-session-info-no-session-selected">
          <i className="bi bi-info-circle-fill"></i> Select a session to see its
          labels
        </p>
      </div>
    );
  }

  if (labels.length === 0) {
    return (
      <div className="no-result-container">
        <p id="select-session-info-no-labels">
          <i className="bi bi-info-circle-fill"></i> No labels found for this
          session
        </p>
      </div>
    );
  }

  return (
    <div className="info-screen" id="select-session-info">
      <div className="label-list">
        {labels.map((label) => (
          <LabelCard key={label.id} label={label} />
        ))}
      </div>
    </div>
  );
};

export default LabelList;
