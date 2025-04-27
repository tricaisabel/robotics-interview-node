import mongoose, { Schema } from "mongoose";
const labelDataSchema = new Schema({
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
const labelSchema = new Schema({
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
export const LabelModel = mongoose.model("Label", labelSchema);
