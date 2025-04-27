import { DetectionStats } from "./detectionStats";

type Session = DetectionStats & {
  readonly id: string;
  readonly started: Date;
  readonly ended: Date | null;
};

export default Session;
