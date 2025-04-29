import { Label, LabelBase } from "@shared-types/label";
import mongoose, { Document } from "mongoose";

export type LabelDocument = Document &
  LabelBase & {
    readonly image: Buffer | null;
    readonly timestamp: Date;
    readonly session: mongoose.Types.ObjectId;
  };

const toPublic = (label: LabelDocument): Label => {
  return {
    ...label,
    id: label.id,
    data: label.data,
    timestamp: label.timestamp.toISOString(),
    session: label.session.toHexString(),
    image: label.image?.toString("base64") ?? null,
  };
};

export const LabelDocument = {
  toPublic,
};
