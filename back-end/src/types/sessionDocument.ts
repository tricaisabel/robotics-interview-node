import { Session, SessionBase } from "@shared-types/session";
import mongoose from "mongoose";

export type SessionDocument = mongoose.Document &
  SessionBase & {
    readonly started: Date;
    readonly ended: Date | null;
  };

const toPublic = (session: SessionDocument): Session => {
  return {
    ...session,
    id: session.id,
    detections: session.detections,
    resolved: session.resolved,
    started: session.started.toISOString(),
    ended: session.ended ? session.ended.toISOString() : null,
  };
};

export const SessionDocument = {
  toPublic,
};
