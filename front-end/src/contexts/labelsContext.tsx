import React, {
  createContext,
  useState,
  useEffect,
  ReactNode,
  useContext,
  useCallback,
} from "react";
import { Label } from "@shared-types/index";
import { getLabelsBySessionId } from "../api";

type LabelsContextType = {
  labels: Label[];
  loading: boolean;
  error?: string;
  fetchLabels: (serviceId: string) => void;
  reloadLabels: () => void;
  selectedSessionId?: string;
  setSelectedSessionId: (selectedSessionId: string) => void;
};

const LabelsContext = createContext<LabelsContextType | undefined>(undefined);

const fetchLabelsApi = async ({
  serviceId,
  setLoading,
  setError,
  setLabels,
}: {
  serviceId: string;
  setLoading: (loading: boolean) => void;
  setError: (error?: string) => void;
  setLabels: (labels: Label[]) => void;
}) => {
  if (!serviceId) return;
  setLoading(true);
  setError(undefined);
  try {
    const labels = await getLabelsBySessionId(serviceId);
    setLabels(labels);
  } catch (err) {
    setError(err instanceof Error ? err.message : "An error occurred");
  } finally {
    setLoading(false);
  }
};

export const LabelsProvider: React.FC<{
  children: ReactNode;
}> = ({ children }) => {
  const [labels, setLabels] = useState<Label[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>();
  const [selectedSessionId, setSelectedSessionId] = useState<
    string | undefined
  >();

  const fetchLabels = useCallback((serviceId: string) => {
    fetchLabelsApi({ serviceId, setLoading, setError, setLabels });
  }, []);

  const reloadLabels = useCallback(() => {
    if (selectedSessionId) {
      fetchLabels(selectedSessionId);
    }
  }, [selectedSessionId]);

  useEffect(() => {
    if (selectedSessionId) {
      fetchLabels(selectedSessionId);
    }
  }, [selectedSessionId]);

  return (
    <LabelsContext.Provider
      value={{
        labels,
        loading,
        error,
        fetchLabels,
        reloadLabels,
        selectedSessionId,
        setSelectedSessionId,
      }}
    >
      {children}
    </LabelsContext.Provider>
  );
};

export const useLabels = (): LabelsContextType => {
  const context = useContext(LabelsContext);
  if (!context) {
    throw new Error("useLabels must be used within a LabelsProvider");
  }
  return context;
};
