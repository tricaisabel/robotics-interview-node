import mongoose from "mongoose";

const labelDataSchema = new mongoose.Schema({
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

const labelSchema = new mongoose.Schema({
  image: { type: Buffer },
  timestamp: { type: Date, required: true },
  uuid: { type: String, required: true },
  source_uuid: { type: String },
  session: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Session",
    required: true,
  },
  data: labelDataSchema,
});

export const Label = mongoose.model("Label", labelSchema);
