import React from "react";
import { parseISODate } from "../utils/date";
import { saveStats } from "../api";
import { useLabels } from "../contexts/labelsContext";
import { useSessions } from "../contexts/sessionsContext";
import toast from "react-hot-toast";
import { Session } from "@shared-types/session";

interface SessionCardProps {
  session: Session;
}

const SessionCard: React.FC<SessionCardProps> = ({ session }) => {
  const { setSelectedSessionId } = useLabels();
  const { reloadSessions } = useSessions();

  const [detections, setDetections] = React.useState<number>(
    session.detections
  );
  const [resolved, setResolved] = React.useState<number>(session.resolved);

  const onSaveStats = async () => {
    if (resolved > detections) {
      return toast(
        "The number of resolved detections must be egual or less than the number of detections"
      );
    }

    try {
      await saveStats({
        sessionId: session.id,
        detections: detections,
        resolved: resolved,
      });
      reloadSessions();
      toast("Session updated successfully");
    } catch (e) {
      toast("Something wrong happened while updating session");
    }
  };

  return (
    <>
      <div className="session-card">
        <div className="session-card-header">
          <h3>
            Session: <span>{session.id}</span>
          </h3>
          <span
            className={`detection-status ${
              session.resolved === session.detections ? "success" : "warning"
            }`}
          >
            <i
              className={`bi ${
                session.resolved === session.detections
                  ? "bi-check-circle-fill"
                  : "bi-exclamation-triangle-fill"
              }`}
            ></i>{" "}
            {session.ended === null
              ? "Ongoing"
              : session.resolved === session.detections
              ? "All resolved"
              : "Incomplete"}
          </span>
        </div>

        <div className="session-date-flex-container">
          <div className="session-date-icon">
            <i className="bi bi-clock"></i>
            Time span
          </div>
          <div className="session-dates">
            <div className="session-start-date">
              {parseISODate(session.started)}
            </div>
            <div className="session-separator">-</div>
            <div className="session-end-date">
              {parseISODate(session.ended)}
            </div>
          </div>
        </div>

        <div className="session-detection-info">
          <strong>Resolved detections: </strong>
          <span className="detection-count">
            {session.resolved ?? "N/A"} / {session.detections ?? "N/A"}
          </span>
        </div>

        {session.ended === null && (
          <div className="session-inputs">
            <div className="inputs-container">
              <input
                type="number"
                placeholder="Resolved"
                value={resolved}
                onChange={(e) => setResolved(parseInt(e.target.value))}
              />
              <input
                type="number"
                placeholder="Detections"
                value={detections}
                onChange={(e) => setDetections(parseInt(e.target.value))}
              />
            </div>

            <div>
              <button className="view-picture-link slim" onClick={onSaveStats}>
                <i className="bi bi-save"></i> Save Stats
              </button>
            </div>
          </div>
        )}
        <button
          className="accordion"
          onClick={() => setSelectedSessionId(session.id)}
        >
          View labels
        </button>
      </div>
    </>
  );
};

export default SessionCard;
