import mongoose, { Schema } from "mongoose";

type LabelData =  {
  readonly timestamp: number;
  readonly uuid: string;
  readonly cameraIndex: number;
  readonly cameraType: string;
  readonly width: number;
  readonly height: number;
  readonly session: string;
  readonly store_id: number;
  readonly x: number;
  readonly y: number;
  readonly w: number;
  readonly h: number;
  readonly source_uuid: string;
};

type LabelDocument = mongoose.Document & {
  readonly image: Buffer | null;
  readonly timestamp: Date;
  readonly uuid: string;
  readonly source_uuid: string | null;
  readonly session: mongoose.Types.ObjectId;
  readonly data: LabelData;
};

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
