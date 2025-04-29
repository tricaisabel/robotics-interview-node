import React, {
  createContext,
  useState,
  ReactNode,
  useContext,
  useEffect,
  useCallback,
} from "react";
import { getCurrentSession } from "../api";
import { Session } from "@shared-types/session";

type CurrentSessionContextType = {
  currentSession: Session | undefined;
  loading: boolean;
  error?: string;
  setCurrentSession: (session: Session | undefined) => void;
  reloadCurrentSession: () => void;
};

const CurrentSessionContext = createContext<
  CurrentSessionContextType | undefined
>(undefined);

const fetchCurrentSessionApi = async ({
  setError,
  setLoading,
  setCurrentSession,
}: {
  setLoading: (isLoading: boolean) => void;
  setError: (error?: string) => void;
  setCurrentSession: (session: Session) => void;
}) => {
  setLoading(true);
  setError(undefined);
  try {
    const currentSession = await getCurrentSession();
    setCurrentSession(currentSession);
  } catch (err) {
    setError(err instanceof Error ? err.message : "An error occurred");
  } finally {
    setLoading(false);
  }
};

export const CurrentSessionProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [currentSession, setCurrentSession] = useState<Session | undefined>(
    undefined
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>();

  const fetchCurrentSession = useCallback(() => {
    fetchCurrentSessionApi({ setLoading, setError, setCurrentSession });
  }, []);
  
  const reloadCurrentSession = () => {
    fetchCurrentSession();
  };

  useEffect(() => {
    reloadCurrentSession();
  }, []);

  return (
    <CurrentSessionContext.Provider
      value={{
        currentSession,
        setCurrentSession,
        reloadCurrentSession,
        error,
        loading,
      }}
    >
      {children}
    </CurrentSessionContext.Provider>
  );
};

export const useCurrentSession = (): CurrentSessionContextType => {
  const context = useContext(CurrentSessionContext);
  if (!context) {
    throw new Error(
      "useCurrentSession must be used within a CurrentSessionProvider"
    );
  }
  return context;
};
