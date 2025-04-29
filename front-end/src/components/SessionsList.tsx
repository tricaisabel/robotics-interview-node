import React from "react";
import SessionCard from "./SessionCard";
import { useSessions } from "../contexts/sessionsContext";

const SessionList: React.FC = () => {
  const { sessions } = useSessions();

  return (
    <div className="session-container">
      {sessions.map((session) => (
        <SessionCard
          key={session.id}
          session={session}
        />
      ))}
    </div>
  );
};

export default SessionList;
