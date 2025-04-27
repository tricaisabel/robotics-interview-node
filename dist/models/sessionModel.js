import mongoose from "mongoose";
const sessionSchema = new mongoose.Schema({
    started: { type: Date, required: true },
    ended: { type: Date, default: null },
    detections: { type: Number, default: 0 },
    resolved: { type: Number, default: 0 },
});
export const SessionModel = mongoose.model("Session", sessionSchema);
