import mongoose, { Schema } from "mongoose";
import { LabelDocument } from "../types/labelDocument";
import { LabelData } from "@shared-types/labelData";

const LABEL_DATA_SCHEMA = new Schema<LabelData>({
  timestamp: { type: Number },
  uuid: { type: String },
  cameraIndex: { type: Number },
  cameraType: { type: String },
  width: { type: Number },
  height: { type: Number },
  session: { type: String },
  store_id: { type: Number },
  x: { type: Number },
  y: { type: Number },
  w: { type: Number },
  h: { type: Number },
  source_uuid: { type: String },
});

const LABEL_SCHEMA = new Schema<LabelDocument>({
  image: { type: Buffer },
  timestamp: { type: Date, required: true },
  uuid: { type: String, required: true },
  source_uuid: { type: String },
  session: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Session",
    required: true,
  },
  data: LABEL_DATA_SCHEMA,
});

export const LabelModel = mongoose.model<LabelDocument>("Label", LABEL_SCHEMA);
