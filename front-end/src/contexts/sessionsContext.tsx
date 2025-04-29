import React, {
  createContext,
  useState,
  useEffect,
  ReactNode,
  useContext,
  useCallback,
} from "react";
import { Session } from "@shared-types/index";
import { getSessions } from "../api";

type SessionsContextType = {
  sessions: Session[];
  loading: boolean;
  error?: string;
  fetchSessions: () => void;
  reloadSessions: () => void;
};

const SessionsContext = createContext<SessionsContextType | undefined>(
  undefined
);

const fetchSessionsApi = async ({
  setLoading,
  setError,
  setSessions,
}: {
  setLoading: (isLoading: boolean) => void;
  setError: (error?: string) => void;
  setSessions: (sessions: Session[]) => void;
}) => {
  setLoading(true);
  setError(undefined);
  try {
    const sessions = await getSessions();
    setSessions(sessions);
  } catch (err) {
    setError(err instanceof Error ? err.message : "An error occurred");
  } finally {
    setLoading(false);
  }
};

export const SessionsProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>();

  const fetchSessions = useCallback(() => {
    fetchSessionsApi({ setLoading, setError, setSessions });
  }, []);

  const reloadSessions = useCallback(() => {
    fetchSessions();
  }, []);

  useEffect(() => {
    fetchSessions();
  }, []);

  return (
    <SessionsContext.Provider
      value={{ sessions, loading, error, fetchSessions, reloadSessions }}
    >
      {children}
    </SessionsContext.Provider>
  );
};

export const useSessions = (): SessionsContextType => {
  const context = useContext(SessionsContext);
  if (!context) {
    throw new Error("useSessions must be used within a SessionsProvider");
  }
  return context;
};
