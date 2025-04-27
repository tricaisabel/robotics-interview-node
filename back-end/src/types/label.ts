import { LabelData } from "./labelData";

export type LabelBase = {
  readonly timestamp: Date;
  readonly uuid: string;
  readonly source_uuid: string | null;
  readonly data: LabelData;
};

export type Label = LabelBase & {
  readonly image: string | null;
  readonly session: string;
};
