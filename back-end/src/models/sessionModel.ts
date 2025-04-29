import mongoose from "mongoose";
import { SessionDocument } from "../types/sessionDocument";

const SESSION_SCHEMA = new mongoose.Schema<SessionDocument>({
  started: { type: Date, required: true },
  ended: { type: Date, default: null },
  detections: { type: Number, default: 0 },
  resolved: { type: Number, default: 0 },
});

export const SessionModel = mongoose.model<SessionDocument>(
  "Session",
  SESSION_SCHEMA
);
