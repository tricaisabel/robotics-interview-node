import React from "react";
import { endSession, startSession } from "../api";
import { useCurrentSession } from "../contexts/currentSessionContext";
import { useSessions } from "../contexts/sessionsContext";
import toast from "react-hot-toast";

const StartStopSessionButton: React.FC = () => {
  const { currentSession, reloadCurrentSession } = useCurrentSession();
  const { reloadSessions } = useSessions();

  const handleSession = async () => {
    try {
      if (currentSession) {
        await endSession(currentSession.id);
      } else {
        await startSession();
      }
      reloadSessions();
      reloadCurrentSession();
    } catch {
      toast(
        `Something wrong happened while ${
          currentSession ? "ending" : "starting"
        } session`
      );
    }
  };

  return (
    <button onClick={handleSession} className="view-picture-link">
      {currentSession ? "End Session" : "Start Session"}
    </button>
  );
};

export default StartStopSessionButton;
