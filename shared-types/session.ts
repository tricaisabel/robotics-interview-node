import { DetectionStats } from "./detectionStats";

export type SessionBase = DetectionStats & {
  readonly id: string;
};

export type Session = SessionBase & {
  readonly started: string;
  readonly ended: string | null;
};
